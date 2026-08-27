/* ==========================================================================
   Fuel Calculator — pure calculation core.
   No DOM, no side effects. Exported to window.FuelCalc in the browser and
   to module.exports under Node so the arithmetic can be tested directly.
   ========================================================================== */

(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FuelCalc = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* FORMATION_LAPS  one lap run before the race distance begins.
     SPARE_LAPS      the stated buffer. Fixed by product decision: an
                     unexplained margin gets overridden blindly, so the
                     interface states it rather than exposing a control. */
  var FORMATION_LAPS = 1;
  var SPARE_LAPS = 1;
  var MAX_STOPS = 20;
  var MAX_ROWS = 7;
  var MAX_RACE_LAPS = 5000;
  var EPS = 1e-9;

  /* --- Parsing ----------------------------------------------------------- */

  function parseNum(raw) {
    if (raw == null) return null;
    if (typeof raw === 'number') return isFinite(raw) ? raw : null;
    var s = String(raw).trim().replace(',', '.');
    if (s === '') return null;
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }

  /* A lap-count divisor: whole number >= 1. Blank means 1. Invalid is null. */
  function divisor(raw) {
    var n = parseNum(raw);
    if (n === null) return 1;
    n = Math.floor(n);
    return n >= 1 ? n : null;
  }

  /* --- Formatting -------------------------------------------------------- */

  function fmtL(litres, dp) {
    if (litres == null || !isFinite(litres)) return '—';
    return litres.toFixed(dp == null ? 1 : dp);
  }

  function fmtClock(seconds) {
    if (seconds == null || !isFinite(seconds) || seconds < 0) return '—';
    var t = Math.round(seconds);
    var h = Math.floor(t / 3600);
    var m = Math.floor((t % 3600) / 60);
    var s = t % 60;
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    return h > 0 ? h + ':' + pad(m) + ':' + pad(s) : m + ':' + pad(s);
  }

  function fmtLap(seconds) {
    if (seconds == null || !isFinite(seconds) || seconds <= 0) return '—';
    var m = Math.floor(seconds / 60);
    var s = seconds - m * 60;
    return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1);
  }

  function fmtDelta(seconds) {
    if (seconds == null || !isFinite(seconds)) return '—';
    if (seconds <= 0.5) return '—';
    var t = Math.round(seconds);
    if (t < 60) return '+' + t + 's';
    var m = Math.floor(t / 60);
    var s = t % 60;
    return '+' + m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* --- Stint planning -----------------------------------------------------
     Laps are spread as evenly as the count allows: with a remainder, the
     earlier stints take the extra lap each. An engineer balances stints
     rather than running three full ones and a short final, and a balanced
     split also lowers the largest stint, which is what tank viability is
     measured against.

     The first stint carries the formation lap, the last carries the spare
     lap; with a single stint it carries both. Returns null when the stop
     count leaves a stint with no laps in it. */
  function planStints(raceLaps, stints, fuelPerLap) {
    if (stints > raceLaps) return null;

    var base = Math.floor(raceLaps / stints);
    var remainder = raceLaps % stints;

    var laps = [], fuel = [];
    for (var i = 0; i < stints; i++) {
      var l = base + (i < remainder ? 1 : 0);
      if (l < 1) return null;
      var extra = (i === 0 ? FORMATION_LAPS : 0) + (i === stints - 1 ? SPARE_LAPS : 0);
      laps.push(l);
      fuel.push((l + extra) * fuelPerLap);
    }

    return {
      perStint: laps[0],
      lastLaps: laps[laps.length - 1],
      laps: laps,
      fuel: fuel
    };
  }

  function enumerate(raceLaps, fuelPerLap, tank, avgLap, pitLoss) {
    var rows = [];
    for (var stops = 0; stops <= MAX_STOPS; stops++) {
      var plan = planStints(raceLaps, stops + 1, fuelPerLap);
      if (!plan) break;

      var maxStint = Math.max.apply(null, plan.fuel);
      var total = plan.fuel.reduce(function (a, b) { return a + b; }, 0);

      rows.push({
        stops: stops,
        stints: stops + 1,
        laps: plan.laps,
        fuel: plan.fuel,
        perStint: plan.perStint,
        lastLaps: plan.lastLaps,
        startFuel: plan.fuel[0],
        minStint: Math.min.apply(null, plan.fuel),
        maxStint: maxStint,
        totalFuel: total,
        viable: maxStint <= tank + EPS,
        raceTime: raceLaps * avgLap + stops * pitLoss
      });
    }

    var firstViable = -1;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].viable) { firstViable = i; break; }
    }

    var best = firstViable >= 0 ? rows[firstViable] : null;
    rows.forEach(function (r) {
      r.best = !!(best && r === best);
      r.delta = (best && r.viable) ? r.raceTime - best.raceTime : null;
    });

    var end = firstViable >= 0
      ? Math.min(rows.length - 1, firstViable + 2)
      : rows.length - 1;
    var start = Math.max(0, end - (MAX_ROWS - 1));

    return {
      all: rows,
      shown: rows.slice(start, end + 1),
      truncatedLow: start > 0,
      firstViable: firstViable,
      best: best
    };
  }

  /* --- Main entry ---------------------------------------------------------
     `input` is a plain object of raw values (strings or numbers):
       byTime, raceH, raceM, raceLapsIn, lapM, lapS, lapN,
       fuelUsed, fuelN, tank, pitLoss

     Returns { error: "<i18n key>", errorVars: {...} } or a full result.
     Errors are KEYS, not sentences: this module has no opinion about
     language, and switching language must re-render an error without
     recomputing anything. Never returns NaN. */
  function compute(input) {
    var byTime = !!input.byTime;

    var lapN = divisor(input.lapN);
    var fuelN = divisor(input.fuelN);
    if (lapN === null) return { error: 'err.lapDivisor' };
    if (fuelN === null) return { error: 'err.fuelDivisor' };

    var lapM = parseNum(input.lapM) || 0;
    var lapS = parseNum(input.lapS) || 0;
    var lapTotal = lapM * 60 + lapS;
    if (!(lapTotal > 0)) return { error: 'err.lapTime' };
    var avgLap = lapTotal / lapN;

    var fuelTotal = parseNum(input.fuelUsed);
    if (fuelTotal === null || !(fuelTotal > 0)) return { error: 'err.fuel' };
    var fuelPerLap = fuelTotal / fuelN;

    var raceLaps, raceSeconds;
    if (byTime) {
      var h = parseNum(input.raceH) || 0;
      var m = parseNum(input.raceM) || 0;
      raceSeconds = h * 3600 + m * 60;
      if (!(raceSeconds > 0)) return { error: 'err.raceLength' };
      /* A timed race ends on the lap you finish AFTER the clock expires. */
      raceLaps = Math.floor(raceSeconds / avgLap) + 1;
    } else {
      var rl = parseNum(input.raceLapsIn);
      if (rl === null || rl < 1) return { error: 'err.raceDistance' };
      raceLaps = Math.floor(rl);
      raceSeconds = raceLaps * avgLap;
    }

    if (raceLaps > MAX_RACE_LAPS) {
      return { error: 'err.absurd', errorVars: { laps: raceLaps.toLocaleString() } };
    }

    var marginLaps = FORMATION_LAPS + SPARE_LAPS;
    var minFuel = raceLaps * fuelPerLap;
    var recFuel = (raceLaps + marginLaps) * fuelPerLap;

    var tank = parseNum(input.tank);
    var hasTank = tank !== null && tank > 0;

    var pitLoss = parseNum(input.pitLoss);
    if (pitLoss === null || pitLoss < 0) pitLoss = 0;

    return {
      byTime: byTime,
      avgLap: avgLap,
      fuelPerLap: fuelPerLap,
      lapN: lapN,
      fuelN: fuelN,
      raceLaps: raceLaps,
      raceSeconds: raceSeconds,
      minFuel: minFuel,
      recFuel: recFuel,
      marginLaps: marginLaps,
      formationLaps: FORMATION_LAPS,
      spareLaps: SPARE_LAPS,
      tank: tank,
      hasTank: hasTank,
      pitLoss: pitLoss,
      strategies: hasTank ? enumerate(raceLaps, fuelPerLap, tank, avgLap, pitLoss) : null
    };
  }

  return {
    FORMATION_LAPS: FORMATION_LAPS,
    SPARE_LAPS: SPARE_LAPS,
    MAX_STOPS: MAX_STOPS,
    MAX_ROWS: MAX_ROWS,
    MAX_RACE_LAPS: MAX_RACE_LAPS,
    parseNum: parseNum,
    divisor: divisor,
    fmtL: fmtL,
    fmtClock: fmtClock,
    fmtLap: fmtLap,
    fmtDelta: fmtDelta,
    planStints: planStints,
    enumerate: enumerate,
    compute: compute
  };
}));
