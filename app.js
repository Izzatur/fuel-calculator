/* ==========================================================================
   Fuel Calculator — DOM layer. All arithmetic lives in calc.js.
   No dependencies. See the direction contract in index.html.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.FuelCalc;
  var PRESET_KEY = 'fuelcalc.presets.v1';

  /* Field id -> URL param key. Order is the URL's column order. */
  var FIELDS = [
    ['raceH', 'rh'], ['raceM', 'rm'], ['raceLapsIn', 'rl'],
    ['lapM', 'lm'], ['lapS', 'ls'], ['lapN', 'ln'],
    ['fuelUsed', 'fu'], ['fuelN', 'fn'],
    ['tank', 'tk'], ['pitLoss', 'pt']
  ];

  var $ = function (id) { return document.getElementById(id); };

  var els = {};
  FIELDS.forEach(function (f) { els[f[0]] = $(f[0]); });

  var fmtTimeRadio = $('fmtTime');
  var fmtLapsRadio = $('fmtLaps');
  var cellTime = $('cellTime');
  var cellLaps = $('cellLaps');

  var lastBestStops = null;
  var booted = false;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function readInputs() {
    var o = { byTime: fmtTimeRadio.checked };
    FIELDS.forEach(function (f) { o[f[0]] = els[f[0]] ? els[f[0]].value : ''; });
    return o;
  }

  /* --- Rendering --------------------------------------------------------- */

  function setText(id, text) { $(id).textContent = text; }

  function render() {
    var r = C.compute(readInputs());

    updatePlurals();
    setText('sessionLabel', sessionLabel(r));

    if (r.error) {
      ['outRaceLaps', 'outFuelPerLap', 'outLoad', 'loadValue'].forEach(function (id) {
        setText(id, '—');
      });
      setText('loadBasis', r.error);
      setText('loadAnnounce', '');
      window.clearTimeout(announceTimer);
      $('loadBreakdown').innerHTML = '';
      setText('derived', r.error);
      $('derived').className = 'derived derived--err';
      $('stratBody').innerHTML = '';
      setText('stratNote', r.error);
      lastBestStops = null;
      return;
    }

    setText('outRaceLaps', String(r.raceLaps));
    setText('outFuelPerLap', C.fmtL(r.fuelPerLap, 2));
    setText('outLoad', C.fmtL(r.recFuel, 1));
    setText('loadValue', C.fmtL(r.recFuel, 1));

    /* The headline is total race fuel. On a multi-stop race that is more
       than the tank holds, so it must never read as "put this in the car" —
       the actionable figure is the first stint's load. */
    var best = r.strategies && r.strategies.best;
    var basis = 'For ' + r.raceLaps + ' race lap' + (r.raceLaps === 1 ? '' : 's') +
      ', plus one formation lap and one spare lap. ' +
      (r.byTime
        ? 'A timed race ends on the lap you finish after the clock expires, so that lap is included.'
        : 'Fixed-distance race.');

    if (best && best.stops > 0) {
      basis = 'Total for the race across ' + best.stints + ' stints — more than the ' +
        C.fmtL(r.tank, 1) + NB + 'L tank holds, so it is not a single fill. ' +
        'Start with ' + C.fmtL(best.startFuel, 1) + NB + 'L. ' + basis;
    }
    setText('loadBasis', basis);

    announce(r, best);
    renderDerived(r);
    renderBreakdown(r);
    renderStrategies(r);
  }

  /* A page about transcribed figures must never break a value away from its
     unit, so every number is bound to what follows it with NBSP. */
  var NB = ' ';

  function renderDerived(r) {
    var d = $('derived');
    d.className = 'derived';
    d.textContent = '';

    var add = function (label, value, note) {
      d.appendChild(document.createTextNode(label + ' '));
      var b = document.createElement('b');
      b.textContent = value;
      d.appendChild(b);
      if (note) {
        var n = document.createElement('span');
        n.className = 'nowrap';
        n.textContent = ' ' + note;
        d.appendChild(n);
      }
    };

    add('Average lap', C.fmtLap(r.avgLap),
      r.lapN > 1 ? '(from ' + C.fmtClock(r.avgLap * r.lapN) + ' over ' + r.lapN + NB + 'laps)' : '');
    d.appendChild(document.createTextNode('  ·  '));
    add('Fuel per lap', C.fmtL(r.fuelPerLap, 2) + NB + 'L',
      r.fuelN > 1 ? '(from ' + C.fmtL(r.fuelPerLap * r.fuelN, 2) + NB + 'L over ' + r.fuelN + NB + 'laps)' : '');
  }

  function renderBreakdown(r) {
    var dl = $('loadBreakdown');
    dl.innerHTML = '';

    var pair = function (term, def, cls) {
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');
      dt.textContent = term;
      dd.textContent = def;
      if (cls) { dt.className = cls; dd.className = cls; }
      dl.appendChild(dt);
      dl.appendChild(dd);
    };

    var best = r.strategies && r.strategies.best;

    pair('Race distance', r.raceLaps + NB + 'laps');
    pair('Fuel for race distance', C.fmtL(r.minFuel, 1) + NB + 'L');
    pair('Formation lap', '+' + NB + C.fmtL(r.fuelPerLap * r.formationLaps, 1) + NB + 'L');
    pair('Spare lap', '+' + NB + C.fmtL(r.fuelPerLap * r.spareLaps, 1) + NB + 'L');

    /* The sum, then — kept adjacent — the figure the driver actually pours
       in. They carry different emphasis because they are different kinds of
       number: one totals the rows above it, one is an instruction. Tank
       capacity follows as plain reference. */
    pair('Load', C.fmtL(r.recFuel, 1) + NB + 'L', 'is-total');

    if (best && best.stops > 0) {
      pair('Start load (stint 1 of ' + best.stints + ')',
        C.fmtL(best.startFuel, 1) + NB + 'L', 'is-action');
    }

    if (r.hasTank) pair('Tank capacity', C.fmtL(r.tank, 1) + NB + 'L');
  }

  /* One debounced sentence, so a screen reader is not re-read the whole
     block on every keystroke. */
  var announceTimer = null;
  function announce(r, best) {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () {
      var msg = C.fmtL(r.recFuel, 1) + ' litres total for ' + r.raceLaps + ' laps.';
      if (best) {
        msg += best.stops === 0
          ? ' No stops needed.'
          : ' ' + best.stops + ' stop' + (best.stops === 1 ? '' : 's') +
            ', starting with ' + C.fmtL(best.startFuel, 1) + ' litres.';
      }
      setText('loadAnnounce', msg);
    }, 700);
  }

  function renderStrategies(r) {
    var body = $('stratBody');
    var note = $('stratNote');

    if (!r.hasTank) {
      body.innerHTML = '';
      note.textContent = 'Enter your tank capacity to compare pit strategies.';
      lastBestStops = null;
      return;
    }

    var s = r.strategies;
    if (!s || s.all.length === 0) {
      body.innerHTML = '';
      note.textContent = 'No strategy could be worked out from these numbers.';
      lastBestStops = null;
      return;
    }

    if (s.firstViable < 0) {
      body.innerHTML = '';
      note.textContent =
        'No strategy fits a ' + C.fmtL(r.tank, 1) + ' L tank. Even split across ' +
        s.all.length + ' stints, the largest still needs ' +
        C.fmtL(s.all[s.all.length - 1].maxStint, 1) +
        ' L. Check the tank capacity and the fuel figure.';
      lastBestStops = null;
      return;
    }

    var newBest = s.best.stops;
    var changed = booted && lastBestStops !== null && lastBestStops !== newBest;

    body.innerHTML = s.shown.map(function (row) {
      var cls = row.best ? 'row--best' : (row.viable ? 'row--ok' : 'row--bad');
      if (row.best && changed) cls += ' row--flash';

      var stintLaps = range(row.laps);
      var stintFuel = row.stints === 1
        ? C.fmtL(row.fuel[0], 1)
        : (Math.abs(row.maxStint - row.minStint) < 0.05
            ? C.fmtL(row.maxStint, 1)
            : C.fmtL(row.minStint, 1) + '–' + C.fmtL(row.maxStint, 1));

      var tag = row.best
        ? '<span class="tag tag--best">Fastest</span>'
        : (!row.viable ? '<span class="tag tag--bad">Over tank</span>' : '');

      var status = row.best ? 'Fastest viable' : (row.viable ? 'Viable' : 'Exceeds tank');
      var over = row.viable ? '' : ' tab__over';

      /* data-label drives the stacked card layout under 640px, where a
         nine-column tabulation cannot be read on a phone. */
      return '<tr class="' + cls + '">' +
        '<td class="flagcell"><span class="flagbar"></span><span class="vh">' + status + '</span></td>' +
        '<td class="tab__stops" data-label="Stops">' + row.stops + tag + '</td>' +
        '<td data-label="Stints">' + row.stints + '</td>' +
        '<td class="tab__n" data-label="Laps / stint">' + esc(stintLaps) + '</td>' +
        '<td class="tab__n' + over + '" data-label="Start load">' + C.fmtL(row.startFuel, 1) + '</td>' +
        '<td class="tab__n' + over + '" data-label="Fuel / stint">' + esc(stintFuel) + '</td>' +
        '<td class="tab__n" data-label="Total fuel">' + C.fmtL(row.totalFuel, 1) + '</td>' +
        '<td class="tab__n" data-label="Race time">' + C.fmtClock(row.raceTime) + '</td>' +
        '<td class="tab__n" data-label="Delta">' + (row.best ? '—' : C.fmtDelta(row.delta)) + '</td>' +
        '</tr>';
    }).join('');

    if (changed) {
      window.setTimeout(function () {
        var el = body.querySelector('.row--flash');
        if (el) el.classList.remove('row--flash');
      }, 700);
    }

    lastBestStops = newBest;

    var parts = [];
    parts.push(s.best.stops === 0
      ? 'The whole race fits in one stint on a ' + C.fmtL(r.tank, 1) + ' L tank.'
      : s.best.stops + ' stop' + (s.best.stops === 1 ? '' : 's') +
        ' is the fewest that fits a ' + C.fmtL(r.tank, 1) + ' L tank.');
    parts.push('Race time assumes ' + r.pitLoss +
      's lost per stop and no fuel-weight effect, so fewer stops always ranks faster — the delta is what the extra stops cost you.');
    if (s.truncatedLow) parts.push('Strategies with fewer stops are omitted: none of them fit the tank.');
    note.textContent = parts.join(' ');
  }

  function range(laps) {
    var min = Math.min.apply(null, laps);
    var max = Math.max.apply(null, laps);
    return min === max ? String(min) : min + '–' + max;
  }

  function sessionLabel(r) {
    if (r.error) return 'No session';
    var len = r.byTime
      ? C.fmtClock(r.raceSeconds).replace(/:00$/, '') + ' race'
      : r.raceLaps + ' laps';
    return len + '  ·  ' + C.fmtLap(r.avgLap) + '  ·  ' + C.fmtL(r.fuelPerLap, 2) + ' L/lap';
  }

  function updatePlurals() {
    ['lapN', 'fuelN'].forEach(function (id) {
      var n = C.parseNum(els[id] ? els[id].value : null);
      var span = document.querySelector('[data-plural="' + id + '"]');
      if (span) span.textContent = (n === 1) ? '' : 's';
    });
  }

  /* --- Race format toggle ------------------------------------------------ */

  function syncFormat() {
    var byTime = fmtTimeRadio.checked;
    cellTime.hidden = !byTime;
    cellLaps.hidden = byTime;
  }

  /* --- URL state --------------------------------------------------------- */

  function toQuery() {
    var p = new URLSearchParams();
    p.set('md', fmtTimeRadio.checked ? 't' : 'l');
    FIELDS.forEach(function (f) {
      var el = els[f[0]];
      if (el && el.value.trim() !== '') p.set(f[1], el.value.trim());
    });
    return p.toString();
  }

  function fromQuery(qs) {
    var p = new URLSearchParams(qs);
    if (!p.toString()) return false;
    if (p.get('md') === 'l') fmtLapsRadio.checked = true;
    else if (p.get('md') === 't') fmtTimeRadio.checked = true;
    FIELDS.forEach(function (f) {
      var v = p.get(f[1]);
      if (v !== null && els[f[0]]) els[f[0]].value = v;
    });
    syncFormat();
    return true;
  }

  var urlTimer = null;
  function syncUrl() {
    window.clearTimeout(urlTimer);
    urlTimer = window.setTimeout(function () {
      try {
        history.replaceState(null, '', location.pathname + '?' + toQuery());
      } catch (e) { /* file:// and some embedded views reject this */ }
    }, 400);
  }

  /* --- Presets ----------------------------------------------------------- */

  function loadPresets() {
    try {
      var arr = JSON.parse(localStorage.getItem(PRESET_KEY) || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function savePresets(list) {
    try {
      localStorage.setItem(PRESET_KEY, JSON.stringify(list));
      return true;
    } catch (e) { return false; }
  }

  function renderPresets() {
    var list = loadPresets();
    var ul = $('presetList');
    if (list.length === 0) {
      ul.innerHTML = '<li class="presets__empty">No saved setups yet. Name one above to keep it on this device.</li>';
      return;
    }
    ul.innerHTML = list.map(function (p, i) {
      return '<li>' +
        '<button type="button" class="presets__load" data-i="' + i + '">' + esc(p.n) + '</button>' +
        '<button type="button" class="presets__del" data-del="' + i + '" aria-label="Delete ' + esc(p.n) + '">Delete</button>' +
        '</li>';
    }).join('');
  }

  function status(msg) {
    var el = $('saveStatus');
    el.textContent = msg;
    window.setTimeout(function () {
      if (el.textContent === msg) el.textContent = '';
    }, 3000);
  }

  /* --- Wiring ------------------------------------------------------------ */

  function onInput() { render(); syncUrl(); }

  FIELDS.forEach(function (f) {
    var el = els[f[0]];
    if (!el) return;
    el.addEventListener('input', onInput);
    /* These fields are transcribed from another screen, so overwriting is
       the common act and cursor placement is not. */
    el.addEventListener('focus', function () { el.select(); });
  });

  [fmtTimeRadio, fmtLapsRadio].forEach(function (el) {
    el.addEventListener('change', function () { syncFormat(); onInput(); });
  });

  $('savePreset').addEventListener('click', function () {
    var name = $('presetName').value.trim();
    if (!name) { status('Give the setup a name first.'); $('presetName').focus(); return; }

    var list = loadPresets();
    var entry = { n: name, q: toQuery() };
    var existing = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].n === name) { existing = i; break; } }
    if (existing >= 0) list[existing] = entry; else list.push(entry);

    if (savePresets(list)) {
      $('presetName').value = '';
      renderPresets();
      status(existing >= 0 ? 'Updated “' + name + '”.' : 'Saved “' + name + '”.');
    } else {
      status('Could not save — storage is unavailable in this browser.');
    }
  });

  $('presetList').addEventListener('click', function (e) {
    var loadBtn = e.target.closest('.presets__load');
    var delBtn = e.target.closest('.presets__del');
    if (!loadBtn && !delBtn) return;

    var list = loadPresets();

    if (loadBtn) {
      var p = list[parseInt(loadBtn.getAttribute('data-i'), 10)];
      if (p) { fromQuery(p.q); render(); syncUrl(); status('Loaded “' + p.n + '”.'); }
      return;
    }

    var i = parseInt(delBtn.getAttribute('data-del'), 10);
    var name = list[i] ? list[i].n : '';
    list.splice(i, 1);
    savePresets(list);
    renderPresets();
    status('Deleted “' + name + '”.');
  });

  $('copyLink').addEventListener('click', function () {
    var url = location.origin + location.pathname + '?' + toQuery();

    /* The denial path is ordinary, not exceptional — file://, iOS in-app
       browsers and a refused permission all land here. Render the link in
       the page's own vocabulary rather than interrupting with a system
       modal. */
    var fallback = function () {
      var box = $('shareFallback');
      var field = $('shareUrl');
      box.hidden = false;
      field.value = url;
      field.focus();
      field.select();
      status('Copy the link below.');
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        $('shareFallback').hidden = true;
        status('Link copied.');
      }, fallback);
    } else {
      fallback();
    }
  });

  /* --- Boot -------------------------------------------------------------- */

  fromQuery(location.search);
  syncFormat();
  renderPresets();
  render();
  booted = true;
})();
