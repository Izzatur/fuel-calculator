/* ==========================================================================
   Fuel Calculator — DOM layer. Arithmetic lives in calc.js, strings in
   i18n.js. No dependencies. See the direction contract in index.html.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.FuelCalc;
  var I = window.I18N;
  var t = I.t;

  var PRESET_KEY = 'fuelcalc.presets.v1';
  var LANG_KEY = 'fuelcalc.lang';

  /* A page about transcribed figures must never break a value away from its
     unit, so every number is bound to what follows it with NBSP. */
  var NB = ' ';

  /* Field id -> URL param key. Order is the URL's column order. */
  var FIELDS = [
    ['raceH', 'rh'], ['raceM', 'rm'], ['raceLapsIn', 'rl'],
    ['lapM', 'lm'], ['lapS', 'ls'], ['lapN', 'ln'],
    ['fuelUsed', 'fu'], ['fuelN', 'fn'],
    ['tank', 'tk'], ['stintMin', 'sm'], ['pitLoss', 'pt']
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

  /* --- Language ----------------------------------------------------------
     calc.js returns error CODES, not sentences, so a language switch
     re-renders correctly without the calculation layer knowing about text. */

  function applyLang(lang) {
    I.set(lang);
    document.documentElement.lang = I.langAttr();
    document.title = t('doc.title');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });

    document.querySelectorAll('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === I.get();
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    try { localStorage.setItem(LANG_KEY, I.get()); } catch (e) { /* private mode */ }

    renderPresets();
    render();
  }

  function initialLang() {
    var q = new URLSearchParams(location.search).get('lg');
    if (q && I.has(q)) return q;
    try {
      var stored = localStorage.getItem(LANG_KEY);
      if (stored && I.has(stored)) return stored;
    } catch (e) { /* private mode */ }
    var nav = (navigator.language || '').toLowerCase();
    if (nav.indexOf('ms') === 0 || nav.indexOf('id') === 0) return 'ms';
    return 'en';
  }

  /* --- Rendering --------------------------------------------------------- */

  function setText(id, text) { $(id).textContent = text; }

  function lapWord(n) { return I.plural(n, 'unit.lap', 'unit.laps'); }
  function stopWord(n) { return I.plural(n, 'strat.stop', 'strat.stops_plural'); }

  function render() {
    var r = C.compute(readInputs());

    updateLapWords();
    setText('sessionLabel', sessionLabel(r));

    if (r.error) {
      var msg = t(r.error, r.errorVars || {});
      ['outRaceLaps', 'outFuelPerLap', 'outLoad', 'loadValue'].forEach(function (id) {
        setText(id, '—');
      });
      setText('loadBasis', msg);
      setText('loadAnnounce', '');
      window.clearTimeout(announceTimer);
      $('loadBreakdown').innerHTML = '';
      setText('derived', msg);
      $('derived').className = 'derived derived--err';
      $('stratBody').innerHTML = '';
      setText('stratNote', msg);
      lastBestStops = null;
      return;
    }

    setText('outRaceLaps', String(r.raceLaps));
    setText('outFuelPerLap', C.fmtL(r.fuelPerLap, 2));
    setText('outLoad', C.fmtL(r.recFuel, 1));
    setText('loadValue', C.fmtL(r.recFuel, 1));

    var best = r.strategies && r.strategies.best;

    /* The headline is total race fuel. On a multi-stop race that is more
       than the tank holds, so it must never read as "put this in the car" —
       the actionable figure is the first stint's load. */
    var basis = t('load.basis', { laps: r.raceLaps, lapWord: lapWord(r.raceLaps) }) +
      ' ' + (r.byTime ? t('load.basisTimed') : t('load.basisFixed'));

    /* Without a tank figure the split is the stint limit's doing, so the
       sentence must not blame a capacity the racer never gave. */
    if (best && best.stops > 0) {
      basis = t(r.hasTank ? 'load.multiStint' : 'load.multiStintNoTank', {
        stints: best.stints,
        tank: C.fmtL(r.tank, 1),
        start: C.fmtL(best.startFuel, 1)
      }) + ' ' + basis;
    }
    setText('loadBasis', basis);

    announce(r, best);
    renderDerived(r);
    renderBreakdown(r, best);
    renderStrategies(r);
  }

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

    add(t('derived.avgLap'), C.fmtLap(r.avgLap),
      r.lapN > 1 ? t('derived.from', { value: C.fmtClock(r.avgLap * r.lapN), n: r.lapN }) : '');
    d.appendChild(document.createTextNode('  ·  '));
    add(t('derived.fuelPerLap'), C.fmtL(r.fuelPerLap, 2) + NB + t('unit.L'),
      r.fuelN > 1 ? t('derived.from', {
        value: C.fmtL(r.fuelPerLap * r.fuelN, 2) + NB + t('unit.L'), n: r.fuelN
      }) : '');
  }

  function renderBreakdown(r, best) {
    var dl = $('loadBreakdown');
    dl.innerHTML = '';
    var L = NB + t('unit.L');

    var pair = function (term, def, cls) {
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');
      dt.textContent = term;
      dd.textContent = def;
      if (cls) { dt.className = cls; dd.className = cls; }
      dl.appendChild(dt);
      dl.appendChild(dd);
    };

    pair(t('load.raceDistance'), r.raceLaps + NB + t('unit.laps'));
    pair(t('load.fuelForRace'), C.fmtL(r.minFuel, 1) + L);
    pair(t('load.formationLap'), '+' + NB + C.fmtL(r.fuelPerLap * r.formationLaps, 1) + L);
    pair(t('load.spareLap'), '+' + NB + C.fmtL(r.fuelPerLap * r.spareLaps, 1) + L);

    /* The sum, then — kept adjacent — the figure the driver actually pours
       in. Different emphasis because they are different kinds of number:
       one totals the rows above it, one is an instruction. */
    pair(t('load.total'), C.fmtL(r.recFuel, 1) + L, 'is-total');

    if (best && best.stops > 0) {
      pair(t('load.startLoad', { stints: best.stints }),
        C.fmtL(best.startFuel, 1) + L, 'is-action');
    }

    if (r.hasTank) pair(t('load.tank'), C.fmtL(r.tank, 1) + L);

    if (r.hasStint) {
      pair(t('load.stintLimit'),
        r.stintMinutes + NB + t('unit.min') + '  ·  ' +
        r.stintLapCap + NB + lapWord(r.stintLapCap));
    }
  }

  /* One debounced sentence, so a screen reader is not re-read the whole
     block on every keystroke. */
  var announceTimer = null;
  function announce(r, best) {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () {
      var msg = t('announce', { load: C.fmtL(r.recFuel, 1), laps: r.raceLaps });
      if (best) {
        msg += best.stops === 0
          ? t('announce.noStops')
          : t('announce.stops', {
              stops: best.stops,
              stopWord: stopWord(best.stops),
              start: C.fmtL(best.startFuel, 1)
            });
      }
      setText('loadAnnounce', msg);
    }, 700);
  }

  function renderStrategies(r) {
    var body = $('stratBody');
    var note = $('stratNote');

    /* Either limit on its own is enough to rank strategies. */
    if (!r.hasTank && !r.hasStint) {
      body.innerHTML = '';
      note.textContent = t('strat.needTank');
      lastBestStops = null;
      return;
    }

    var s = r.strategies;
    if (!s || s.all.length === 0) {
      body.innerHTML = '';
      note.textContent = t('strat.none');
      lastBestStops = null;
      return;
    }

    if (s.firstViable < 0) {
      var worst = s.all[s.all.length - 1];
      body.innerHTML = '';
      /* With a stint limit in play the tank may not be what is blocking, so
         the message reports the longest stint in both currencies. */
      note.textContent = r.hasStint
        ? t('strat.noneFitLimits', {
            n: s.all.length,
            laps: worst.maxLaps,
            lapWord: lapWord(worst.maxLaps),
            time: C.fmtClock(worst.stintTime),
            max: C.fmtL(worst.maxStint, 1)
          })
        : t('strat.noneFit', {
            tank: C.fmtL(r.tank, 1),
            n: s.all.length,
            max: C.fmtL(worst.maxStint, 1)
          });
      lastBestStops = null;
      return;
    }

    var newBest = s.best.stops;
    var changed = booted && lastBestStops !== null && lastBestStops !== newBest;

    /* data-label drives the stacked card layout under 640px, where a
       ten-column tabulation cannot be read on a phone. */
    body.innerHTML = s.shown.map(function (row) {
      var cls = row.best ? 'row--best' : (row.viable ? 'row--ok' : 'row--bad');
      if (row.best && changed) cls += ' row--flash';

      var stintLaps = range(row.laps);
      var stintFuel = row.stints === 1
        ? C.fmtL(row.fuel[0], 1)
        : (Math.abs(row.maxStint - row.minStint) < 0.05
            ? C.fmtL(row.maxStint, 1)
            : C.fmtL(row.minStint, 1) + '–' + C.fmtL(row.maxStint, 1));

      /* Which limit a row breaks is the useful part, so the tag and the
         hidden status name it rather than reading "not viable". */
      var breaks = !row.fitsTank ? t('strat.overTank')
        : (!row.fitsStint ? t('strat.overStint') : '');

      var tag = row.best
        ? '<span class="tag tag--best">' + esc(t('strat.fastest')) + '</span>'
        : (breaks ? '<span class="tag tag--bad">' + esc(breaks) + '</span>' : '');

      var status = row.best ? t('strat.fastestViable')
        : (row.viable ? t('strat.viable')
          : (!row.fitsTank ? t('strat.exceedsTank') : t('strat.exceedsStint')));

      /* Strike the figures that overran, not the whole row: the litres are
         wrong for the tank, the minutes are wrong for the stint limit. */
      var overFuel = row.fitsTank ? '' : ' tab__over';
      var overTime = row.fitsStint ? '' : ' tab__over';

      return '<tr class="' + cls + '">' +
        '<td class="flagcell"><span class="flagbar"></span><span class="vh">' + esc(status) + '</span></td>' +
        '<td class="tab__stops" data-label="' + esc(t('strat.stops')) + '">' + row.stops + tag + '</td>' +
        '<td data-label="' + esc(t('strat.stints')) + '">' + row.stints + '</td>' +
        '<td class="tab__n' + overTime + '" data-label="' + esc(t('strat.lapsPerStint')) + '">' + esc(stintLaps) + '</td>' +
        '<td class="tab__n' + overTime + '" data-label="' + esc(t('strat.stintTime')) + '">' + C.fmtClock(row.stintTime) + '</td>' +
        '<td class="tab__n' + overFuel + '" data-label="' + esc(t('strat.startLoad')) + '">' + C.fmtL(row.startFuel, 1) + '</td>' +
        '<td class="tab__n' + overFuel + '" data-label="' + esc(t('strat.fuelPerStint')) + '">' + esc(stintFuel) + '</td>' +
        '<td class="tab__n" data-label="' + esc(t('strat.totalFuel')) + '">' + C.fmtL(row.totalFuel, 1) + '</td>' +
        '<td class="tab__n" data-label="' + esc(t('strat.raceTime')) + '">' + C.fmtClock(row.raceTime) + '</td>' +
        '<td class="tab__n" data-label="' + esc(t('strat.delta')) + '">' + (row.best ? '—' : C.fmtDelta(row.delta)) + '</td>' +
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
    if (s.best.stops === 0) {
      parts.push(r.hasTank
        ? t('strat.oneStint', { tank: C.fmtL(r.tank, 1) })
        : t('strat.oneStintFree'));
    } else {
      /* Credit the limit that actually forced the stop. The row directly
         above the fastest viable one is the plan that was ruled out, and
         what it broke is why the racer is stopping at all — saying "the
         tank" when the tank had room to spare would be a lie. */
      var blocked = s.all[s.firstViable - 1];
      var key = !blocked.fitsTank
        ? (!blocked.fitsStint ? 'strat.fewestBoth' : 'strat.fewest')
        : 'strat.fewestStint';
      parts.push(t(key, {
        stops: s.best.stops,
        stopWord: stopWord(s.best.stops),
        tank: C.fmtL(r.tank, 1),
        min: r.stintMinutes
      }));
    }
    /* The limit is stated in minutes but enforced in laps — say both, or a
       plan that stops one lap "early" looks like an error. */
    if (r.hasStint) {
      parts.push(t('strat.stintCap', {
        min: r.stintMinutes,
        laps: r.stintLapCap,
        lapWord: lapWord(r.stintLapCap),
        lap: C.fmtLap(r.avgLap)
      }));
    }
    parts.push(t('strat.assumption', { pit: r.pitLoss }));
    if (s.truncatedLow) parts.push(t('strat.truncated'));
    note.textContent = parts.join(' ');
  }

  function range(laps) {
    var min = Math.min.apply(null, laps);
    var max = Math.max.apply(null, laps);
    return min === max ? String(min) : min + '–' + max;
  }

  function sessionLabel(r) {
    if (r.error) return t('session.none');
    var len = r.byTime
      ? C.fmtClock(r.raceSeconds).replace(/:00$/, '') + ' ' + t('session.race')
      : r.raceLaps + ' ' + t('unit.laps');
    return len + '  ·  ' + C.fmtLap(r.avgLap) + '  ·  ' +
      C.fmtL(r.fuelPerLap, 2) + ' ' + t('unit.L') + '/' + t('unit.lap');
  }

  function updateLapWords() {
    document.querySelectorAll('[data-lapword]').forEach(function (span) {
      var id = span.getAttribute('data-lapword');
      var n = C.parseNum(els[id] ? els[id].value : null);
      span.textContent = lapWord(n === null ? 1 : n);
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
    p.set('lg', I.get());
    return p.toString();
  }

  function fromQuery(qs) {
    var p = new URLSearchParams(qs);
    if (!p.toString()) return false;
    if (p.get('md') === 'l') fmtLapsRadio.checked = true;
    else if (p.get('md') === 't') fmtTimeRadio.checked = true;

    /* toQuery always writes `md` and omits empty fields, so a query carrying
       it is a complete state: an absent field means blank, not unchanged.
       Without this, loading a setup saved with no stint limit would leave a
       limit already typed in the box. A hand-made partial link has no `md`
       and still only fills in what it names. */
    var whole = p.get('md') !== null;

    FIELDS.forEach(function (f) {
      if (!els[f[0]]) return;
      var v = p.get(f[1]);
      if (v !== null) els[f[0]].value = v;
      else if (whole) els[f[0]].value = '';
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
      ul.innerHTML = '<li class="presets__empty">' + esc(t('save.empty')) + '</li>';
      return;
    }
    ul.innerHTML = list.map(function (p, i) {
      return '<li>' +
        '<button type="button" class="presets__load" data-i="' + i + '">' + esc(p.n) + '</button>' +
        '<button type="button" class="presets__del" data-del="' + i + '" aria-label="' +
          esc(t('aria.delete', { name: p.n })) + '">' + esc(t('save.delete')) + '</button>' +
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

  $('langGroup').addEventListener('click', function (e) {
    var b = e.target.closest('.lang__btn');
    if (!b) return;
    applyLang(b.getAttribute('data-lang'));
    syncUrl();
  });

  $('savePreset').addEventListener('click', function () {
    var name = $('presetName').value.trim();
    if (!name) { status(t('save.needName')); $('presetName').focus(); return; }

    var list = loadPresets();
    var entry = { n: name, q: toQuery() };
    var existing = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].n === name) { existing = i; break; } }
    if (existing >= 0) list[existing] = entry; else list.push(entry);

    if (savePresets(list)) {
      $('presetName').value = '';
      renderPresets();
      status(t(existing >= 0 ? 'save.updated' : 'save.saved', { name: name }));
    } else {
      status(t('save.failed'));
    }
  });

  $('presetList').addEventListener('click', function (e) {
    var loadBtn = e.target.closest('.presets__load');
    var delBtn = e.target.closest('.presets__del');
    if (!loadBtn && !delBtn) return;

    var list = loadPresets();

    if (loadBtn) {
      var p = list[parseInt(loadBtn.getAttribute('data-i'), 10)];
      if (p) { fromQuery(p.q); render(); syncUrl(); status(t('save.loaded', { name: p.n })); }
      return;
    }

    var i = parseInt(delBtn.getAttribute('data-del'), 10);
    var name = list[i] ? list[i].n : '';
    list.splice(i, 1);
    savePresets(list);
    renderPresets();
    status(t('save.deleted', { name: name }));
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
      status(t('save.copyBelow'));
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        $('shareFallback').hidden = true;
        status(t('save.linkCopied'));
      }, fallback);
    } else {
      fallback();
    }
  });

  /* --- Boot -------------------------------------------------------------- */

  fromQuery(location.search);
  syncFormat();
  applyLang(initialLang());
  booted = true;
})();
