/* Run with: node test-calc.js
   Pure-arithmetic checks against hand-worked cases. No dependencies. */

var C = require('./calc.js');

var pass = 0, fail = 0;

function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (detail ? '\n          ' + detail : '')); }
}

function eq(name, actual, expected) {
  ok(name, actual === expected, 'expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
}

function near(name, actual, expected, tol) {
  var t = tol == null ? 1e-6 : tol;
  ok(name, Math.abs(actual - expected) <= t,
    'expected ' + expected + ' (±' + t + '), got ' + actual);
}

function group(title) { console.log('\n' + title); }

var base = {
  byTime: true, raceH: '1', raceM: '0',
  lapM: '2', lapS: '0', lapN: '1',
  fuelUsed: '3.1', fuelN: '1',
  tank: '110', pitLoss: '30'
};

function withInput(over) {
  var o = {};
  Object.keys(base).forEach(function (k) { o[k] = base[k]; });
  Object.keys(over).forEach(function (k) { o[k] = over[k]; });
  return o;
}

/* ------------------------------------------------------------------ */
group('Timed race lap count — the lap after the clock expires');

eq('60 min @ 2:00 -> 31 laps (exact divisor still runs one more)',
  C.compute(withInput({})).raceLaps, 31);

eq('70 min @ 2:05 -> 34 laps',
  C.compute(withInput({ raceH: '0', raceM: '70', lapM: '2', lapS: '5' })).raceLaps, 34);

eq('20 min @ 1:30 -> 14 laps',
  C.compute(withInput({ raceH: '0', raceM: '20', lapM: '1', lapS: '30' })).raceLaps, 14);

eq('lap longer than the race -> 1 lap',
  C.compute(withInput({ raceH: '0', raceM: '1', lapM: '5', lapS: '0' })).raceLaps, 1);

/* ------------------------------------------------------------------ */
group('Lap-count race format');

eq('25 laps by distance -> 25 laps',
  C.compute(withInput({ byTime: false, raceLapsIn: '25' })).raceLaps, 25);

eq('fractional lap entry floors',
  C.compute(withInput({ byTime: false, raceLapsIn: '25.9' })).raceLaps, 25);

/* ------------------------------------------------------------------ */
group('The "over N laps" shortcut — the core differentiator');

near('12.4 L over 4 laps -> 3.1 L/lap',
  C.compute(withInput({ fuelUsed: '12.4', fuelN: '4' })).fuelPerLap, 3.1);

eq('fuel over N laps gives an identical load to the per-lap entry',
  C.fmtL(C.compute(withInput({ fuelUsed: '12.4', fuelN: '4' })).recFuel, 1),
  C.fmtL(C.compute(withInput({ fuelUsed: '3.1', fuelN: '1' })).recFuel, 1));

near('8:20 over 4 laps -> 125 s average lap',
  C.compute(withInput({ lapM: '8', lapS: '20', lapN: '4' })).avgLap, 125);

eq('lap time over N laps gives an identical lap count to the per-lap entry',
  C.compute(withInput({ lapM: '8', lapS: '20', lapN: '4' })).raceLaps,
  C.compute(withInput({ lapM: '2', lapS: '5', lapN: '1' })).raceLaps);

eq('blank divisor is treated as 1', C.divisor(''), 1);
eq('divisor floors a decimal', C.divisor('4.8'), 4);
eq('divisor rejects zero', C.divisor('0'), null);
eq('divisor rejects negative', C.divisor('-3'), null);

/* ------------------------------------------------------------------ */
group('Fuel load and the stated margin');

var r = C.compute(withInput({}));
near('minimum fuel = 31 laps x 3.1', r.minFuel, 96.1, 1e-9);
near('load = 33 laps x 3.1 (formation + spare)', r.recFuel, 102.3, 1e-9);
eq('margin is exactly two laps', r.marginLaps, 2);
near('load minus minimum equals two laps of fuel',
  r.recFuel - r.minFuel, 2 * r.fuelPerLap, 1e-9);

/* ------------------------------------------------------------------ */
group('Strategy enumeration');

var s = C.compute(withInput({})).strategies;
eq('0 stops is viable at 102.3 L in a 110 L tank', s.all[0].viable, true);
eq('fastest is the zero-stop run', s.best.stops, 0);
near('total fuel is identical across every stop count',
  s.all[3].totalFuel, s.all[0].totalFuel, 1e-9);
eq('single stint carries formation AND spare',
  s.all[0].laps[0] + 2, Math.round(s.all[0].fuel[0] / 3.1));

/* Tank too small for one stint forces a stop. */
var small = C.compute(withInput({ tank: '60' })).strategies;
eq('60 L tank makes the no-stop run non-viable', small.all[0].viable, false);
eq('60 L tank -> 1 stop is fastest viable', small.best.stops, 1);
ok('non-viable start load is still a real positive number',
  small.all[0].startFuel > 0 && isFinite(small.all[0].startFuel));

/* Delta reflects pit loss only. */
var d = C.compute(withInput({ tank: '60', pitLoss: '30' })).strategies;
var oneStop = d.all[1], twoStop = d.all[2];
near('a second stop costs exactly one pit loss', twoStop.raceTime - oneStop.raceTime, 30, 1e-9);
eq('delta on the fastest row is zero', d.best.delta, 0);

/* Stint splits cover the race exactly. */
[0, 1, 2, 3, 4].forEach(function (stops) {
  var row = s.all[stops];
  if (!row) return;
  var sum = row.laps.reduce(function (a, b) { return a + b; }, 0);
  eq('stints sum to race distance at ' + stops + ' stop(s)', sum, 31);
});

/* No degenerate stints. */
var manyStops = C.compute(withInput({ byTime: false, raceLapsIn: '3', tank: '110' })).strategies;
ok('never plans more stints than there are laps',
  manyStops.all.every(function (row) {
    return row.laps.every(function (l) { return l >= 1; });
  }));

/* Stints are balanced, not "full stints plus a short final". */
group('Balanced stint splits');

eq('29 laps over 4 stints splits 8/7/7/7, not 8/8/8/5',
  C.planStints(29, 4, 1).laps.join('/'), '8/7/7/7');

eq('40 laps over 3 stints splits 14/13/13',
  C.planStints(40, 3, 1).laps.join('/'), '14/13/13');

eq('evenly divisible splits stay even',
  C.planStints(30, 3, 1).laps.join('/'), '10/10/10');

ok('no stint is ever more than one lap longer than another', (function () {
  for (var laps = 1; laps <= 200; laps++) {
    for (var st = 1; st <= Math.min(laps, 12); st++) {
      var p = C.planStints(laps, st, 1);
      if (!p) return false;
      var mn = Math.min.apply(null, p.laps), mx = Math.max.apply(null, p.laps);
      if (mx - mn > 1) return false;
      if (p.laps.reduce(function (a, b) { return a + b; }, 0) !== laps) return false;
    }
  }
  return true;
})());

eq('more stints than laps is refused', C.planStints(3, 4, 1), null);

/* ------------------------------------------------------------------ */
group('Guards — nothing unfinished reaches the screen');

ok('blank lap time errors', !!C.compute(withInput({ lapM: '', lapS: '' })).error);
ok('zero lap time errors', !!C.compute(withInput({ lapM: '0', lapS: '0' })).error);
ok('blank fuel errors', !!C.compute(withInput({ fuelUsed: '' })).error);
ok('zero fuel errors', !!C.compute(withInput({ fuelUsed: '0' })).error);
ok('negative fuel errors', !!C.compute(withInput({ fuelUsed: '-5' })).error);
ok('zero race length errors', !!C.compute(withInput({ raceH: '0', raceM: '0' })).error);
ok('zero lap divisor errors', !!C.compute(withInput({ lapN: '0' })).error);
ok('garbage text errors rather than producing NaN',
  !!C.compute(withInput({ fuelUsed: 'abc' })).error);
ok('absurd lap count is refused',
  !!C.compute(withInput({ raceH: '24', raceM: '0', lapM: '0', lapS: '1' })).error);

var noTank = C.compute(withInput({ tank: '' }));
ok('missing tank still yields a fuel load', noTank.recFuel > 0 && !noTank.error);
eq('missing tank yields no strategies', noTank.strategies, null);

var tinyTank = C.compute(withInput({ tank: '2' })).strategies;
eq('a tank smaller than one lap of fuel has no viable strategy', tinyTank.firstViable, -1);

/* Every numeric field in a full result is finite. */
var full = C.compute(withInput({}));
ok('no NaN or Infinity anywhere in the result', (function () {
  var bad = [];
  var walk = function (o, path) {
    Object.keys(o).forEach(function (k) {
      var v = o[k];
      if (typeof v === 'number' && !isFinite(v)) bad.push(path + k);
      else if (v && typeof v === 'object') walk(v, path + k + '.');
    });
  };
  walk(full, '');
  return bad.length === 0;
})());

/* ------------------------------------------------------------------ */
group('Formatting');

eq('lap time formats as m:ss.s', C.fmtLap(125), '2:05.0');
eq('race time under an hour is m:ss', C.fmtClock(3540), '59:00');
eq('race time over an hour is h:mm:ss', C.fmtClock(3720), '1:02:00');
eq('sub-minute delta', C.fmtDelta(34), '+34s');
eq('over-minute delta', C.fmtDelta(72), '+1:12');
eq('zero delta reads as a dash', C.fmtDelta(0), '—');
eq('comma decimals parse', C.parseNum('3,1'), 3.1);
eq('blank parses to null', C.parseNum(''), null);
eq('garbage parses to null', C.parseNum('abc'), null);

/* ------------------------------------------------------------------ */
console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail === 0 ? 0 : 1);
