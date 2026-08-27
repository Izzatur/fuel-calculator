/* ==========================================================================
   Fuel Calculator — English / Bahasa Melayu.

   Malay has no plural inflection, so `plural` is a no-op there rather than a
   special case scattered through the callers. Motorsport loanwords the
   community actually uses — stint, pit, delta — are kept, because
   translating them would be less clear to the reader, not more.
   ========================================================================== */

(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.I18N = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STRINGS = {
    en: {
      'doc.title': 'Fuel Calculator — sim racing fuel and stint planner',
      'app.name': 'Fuel Calculator',
      'lang.en': 'EN',
      'lang.ms': 'BM',
      'lang.label': 'Language',

      'readout.laps': 'Race laps',
      'readout.fuelPerLap': 'Fuel / lap',
      'readout.load': 'Load',
      'session.none': 'No session',
      'session.race': 'race',

      'entry.head': 'Session entry',
      'entry.format': 'Race format',
      'entry.byTime': 'By time',
      'entry.byLaps': 'By laps',
      'entry.raceLength': 'Race length',
      'entry.raceDistance': 'Race distance',
      'entry.lapTime': 'Lap time',
      'entry.fuelUsed': 'Fuel used',
      'entry.tank': 'Tank capacity',
      'entry.pitLoss': 'Pit stop loss',
      'entry.pitHint': 'Time lost per stop, pit entry to exit.',
      'entry.over': 'over',

      'unit.h': 'h',
      'unit.min': 'min',
      'unit.m': 'm',
      'unit.s': 's',
      'unit.L': 'L',
      'unit.laps': 'laps',
      'unit.lap': 'lap',
      'unit.litres': 'litres',

      'aria.raceHours': 'Race hours',
      'aria.raceMinutes': 'Race minutes',
      'aria.lapMinutes': 'Lap time minutes',
      'aria.lapSeconds': 'Lap time seconds',
      'aria.shareUrl': 'Shareable link',
      'aria.presetName': 'Setup name',
      'aria.delete': 'Delete {name}',

      'load.head': 'Fuel load',
      'load.empty': 'Enter a lap time and a fuel figure.',
      'load.basis': 'For {laps} race {lapWord}, plus one formation lap and one spare lap.',
      'load.basisTimed': 'A timed race ends on the lap you finish after the clock expires, so that lap is included.',
      'load.basisFixed': 'Fixed-distance race.',
      'load.multiStint': 'Total for the race across {stints} stints — more than the {tank} L tank holds, so it is not a single fill. Start with {start} L.',
      'load.raceDistance': 'Race distance',
      'load.fuelForRace': 'Fuel for race distance',
      'load.formationLap': 'Formation lap',
      'load.spareLap': 'Spare lap',
      'load.total': 'Load',
      'load.tank': 'Tank capacity',
      'load.startLoad': 'Start load (stint 1 of {stints})',

      'derived.avgLap': 'Average lap',
      'derived.fuelPerLap': 'Fuel per lap',
      'derived.from': '(from {value} over {n} laps)',

      'strat.head': 'Strategy',
      'strat.caption': 'Pit strategies by stop count',
      'strat.stops': 'Stops',
      'strat.stints': 'Stints',
      'strat.lapsPerStint': 'Laps / stint',
      'strat.startLoad': 'Start load',
      'strat.fuelPerStint': 'Fuel / stint',
      'strat.totalFuel': 'Total fuel',
      'strat.raceTime': 'Race time',
      'strat.delta': 'Delta',
      'strat.status': 'Status',
      'strat.fastest': 'Fastest',
      'strat.overTank': 'Over tank',
      'strat.fastestViable': 'Fastest viable',
      'strat.viable': 'Viable',
      'strat.exceedsTank': 'Exceeds tank',
      'strat.needTank': 'Enter your tank capacity to compare pit strategies.',
      'strat.none': 'No strategy could be worked out from these numbers.',
      'strat.noneFit': 'No strategy fits a {tank} L tank. Even split across {n} stints, the largest still needs {max} L. Check the tank capacity and the fuel figure.',
      'strat.oneStint': 'The whole race fits in one stint on a {tank} L tank.',
      'strat.fewest': '{stops} {stopWord} is the fewest that fits a {tank} L tank.',
      'strat.assumption': 'Race time assumes {pit}s lost per stop and no fuel-weight effect, so fewer stops always ranks faster — the delta is what the extra stops cost you.',
      'strat.truncated': 'Strategies with fewer stops are omitted: none of them fit the tank.',
      'strat.stop': 'stop',
      'strat.stops_plural': 'stops',

      'save.head': 'Saved setups',
      'save.placeholder': 'e.g. GT3 · Spa · 60 min',
      'save.save': 'Save',
      'save.delete': 'Delete',
      'save.copyLink': 'Copy shareable link',
      'save.empty': 'No saved setups yet. Name one above to keep it on this device.',
      'save.needName': 'Give the setup a name first.',
      'save.saved': 'Saved “{name}”.',
      'save.updated': 'Updated “{name}”.',
      'save.deleted': 'Deleted “{name}”.',
      'save.loaded': 'Loaded “{name}”.',
      'save.failed': 'Could not save — storage is unavailable in this browser.',
      'save.linkCopied': 'Link copied.',
      'save.copyBelow': 'Copy the link below.',

      'announce': '{load} litres total for {laps} laps.',
      'announce.noStops': ' No stops needed.',
      'announce.stops': ' {stops} {stopWord}, starting with {start} litres.',

      'foot.margin': 'Every load figure includes one formation lap and one spare lap. Timed races are calculated to the lap you finish after the clock expires.',
      'foot.meta': 'Litres. No fuel-weight or refuel-rate modelling — see the README.',

      'err.lapDivisor': 'Lap-time lap count must be 1 or more.',
      'err.fuelDivisor': 'Fuel lap count must be 1 or more.',
      'err.lapTime': 'Enter a lap time.',
      'err.fuel': 'Enter the fuel you used.',
      'err.raceLength': 'Enter a race length.',
      'err.raceDistance': 'Enter a race distance in laps.',
      'err.absurd': 'That works out to {laps} laps — check the lap time.'
    },

    ms: {
      'doc.title': 'Kalkulator Minyak — perancang minyak & stint sim racing',
      'app.name': 'Kalkulator Minyak',
      'lang.en': 'EN',
      'lang.ms': 'BM',
      'lang.label': 'Bahasa',

      'readout.laps': 'Pusingan',
      'readout.fuelPerLap': 'Minyak / pusingan',
      'readout.load': 'Muatan',
      'session.none': 'Tiada sesi',
      'session.race': 'perlumbaan',

      'entry.head': 'Butiran sesi',
      'entry.format': 'Format perlumbaan',
      'entry.byTime': 'Ikut masa',
      'entry.byLaps': 'Ikut pusingan',
      'entry.raceLength': 'Jangka masa',
      'entry.raceDistance': 'Jarak perlumbaan',
      'entry.lapTime': 'Masa pusingan',
      'entry.fuelUsed': 'Minyak digunakan',
      'entry.tank': 'Kapasiti tangki',
      'entry.pitLoss': 'Masa hilang di pit',
      'entry.pitHint': 'Masa hilang setiap henti, dari masuk hingga keluar pit.',
      'entry.over': 'untuk',

      'unit.h': 'j',
      'unit.min': 'min',
      'unit.m': 'm',
      'unit.s': 's',
      'unit.L': 'L',
      'unit.laps': 'pusingan',
      'unit.lap': 'pusingan',
      'unit.litres': 'liter',

      'aria.raceHours': 'Jam perlumbaan',
      'aria.raceMinutes': 'Minit perlumbaan',
      'aria.lapMinutes': 'Minit masa pusingan',
      'aria.lapSeconds': 'Saat masa pusingan',
      'aria.shareUrl': 'Pautan kongsi',
      'aria.presetName': 'Nama setup',
      'aria.delete': 'Padam {name}',

      'load.head': 'Muatan minyak',
      'load.empty': 'Masukkan masa pusingan dan jumlah minyak.',
      'load.basis': 'Untuk {laps} {lapWord} perlumbaan, campur satu pusingan formasi dan satu pusingan simpanan.',
      'load.basisTimed': 'Perlumbaan ikut masa tamat pada pusingan yang anda habiskan selepas jam tamat, jadi pusingan itu dikira sekali.',
      'load.basisFixed': 'Perlumbaan jarak tetap.',
      'load.multiStint': 'Jumlah untuk seluruh perlumbaan merentas {stints} stint — lebih daripada muatan tangki {tank} L, jadi ini bukan satu isian. Mula dengan {start} L.',
      'load.raceDistance': 'Jarak perlumbaan',
      'load.fuelForRace': 'Minyak untuk jarak perlumbaan',
      'load.formationLap': 'Pusingan formasi',
      'load.spareLap': 'Pusingan simpanan',
      'load.total': 'Muatan',
      'load.tank': 'Kapasiti tangki',
      'load.startLoad': 'Muatan mula (stint 1 drpd {stints})',

      'derived.avgLap': 'Purata pusingan',
      'derived.fuelPerLap': 'Minyak sepusingan',
      'derived.from': '(dari {value} untuk {n} pusingan)',

      'strat.head': 'Strategi',
      'strat.caption': 'Strategi pit mengikut bilangan henti',
      'strat.stops': 'Henti',
      'strat.stints': 'Stint',
      'strat.lapsPerStint': 'Pusingan / stint',
      'strat.startLoad': 'Muatan mula',
      'strat.fuelPerStint': 'Minyak / stint',
      'strat.totalFuel': 'Jumlah minyak',
      'strat.raceTime': 'Masa perlumbaan',
      'strat.delta': 'Beza',
      'strat.status': 'Status',
      'strat.fastest': 'Terpantas',
      'strat.overTank': 'Lebih tangki',
      'strat.fastestViable': 'Terpantas & muat',
      'strat.viable': 'Muat',
      'strat.exceedsTank': 'Lebih tangki',
      'strat.needTank': 'Masukkan kapasiti tangki untuk banding strategi pit.',
      'strat.none': 'Strategi tidak dapat dikira daripada nombor ini.',
      'strat.noneFit': 'Tiada strategi muat tangki {tank} L. Walaupun dibahagi sama rata kepada {n} stint, yang terbesar masih perlukan {max} L. Semak kapasiti tangki dan jumlah minyak.',
      'strat.oneStint': 'Seluruh perlumbaan muat dalam satu stint dengan tangki {tank} L.',
      'strat.fewest': '{stops} {stopWord} ialah paling sedikit yang muat tangki {tank} L.',
      'strat.assumption': 'Masa perlumbaan andaikan {pit}s hilang setiap henti dan tiada kesan berat minyak, jadi kurang henti sentiasa lebih pantas — beza itu ialah kos henti tambahan.',
      'strat.truncated': 'Strategi dengan henti lebih sedikit tidak ditunjuk: tiada satu pun muat tangki.',
      'strat.stop': 'henti',
      'strat.stops_plural': 'henti',

      'save.head': 'Setup disimpan',
      'save.placeholder': 'cth. GT3 · Sepang · 60 min',
      'save.save': 'Simpan',
      'save.delete': 'Padam',
      'save.copyLink': 'Salin pautan kongsi',
      'save.empty': 'Tiada setup disimpan lagi. Namakan satu di atas untuk simpan pada peranti ini.',
      'save.needName': 'Namakan setup dahulu.',
      'save.saved': 'Disimpan “{name}”.',
      'save.updated': 'Dikemas kini “{name}”.',
      'save.deleted': 'Dipadam “{name}”.',
      'save.loaded': 'Dimuatkan “{name}”.',
      'save.failed': 'Gagal simpan — storan tidak tersedia dalam pelayar ini.',
      'save.linkCopied': 'Pautan disalin.',
      'save.copyBelow': 'Salin pautan di bawah.',

      'announce': '{load} liter kesemuanya untuk {laps} pusingan.',
      'announce.noStops': ' Tiada henti diperlukan.',
      'announce.stops': ' {stops} {stopWord}, mula dengan {start} liter.',

      'foot.margin': 'Setiap muatan termasuk satu pusingan formasi dan satu pusingan simpanan. Perlumbaan ikut masa dikira sehingga pusingan yang anda habiskan selepas jam tamat.',
      'foot.meta': 'Liter. Tiada model berat minyak atau kadar isi semula — lihat README.',

      'err.lapDivisor': 'Bilangan pusingan bagi masa mesti 1 atau lebih.',
      'err.fuelDivisor': 'Bilangan pusingan bagi minyak mesti 1 atau lebih.',
      'err.lapTime': 'Masukkan masa pusingan.',
      'err.fuel': 'Masukkan minyak yang digunakan.',
      'err.raceLength': 'Masukkan jangka masa perlumbaan.',
      'err.raceDistance': 'Masukkan jarak perlumbaan dalam pusingan.',
      'err.absurd': 'Itu menjadi {laps} pusingan — semak masa pusingan.'
    }
  };

  var current = 'en';

  function has(lang) { return Object.prototype.hasOwnProperty.call(STRINGS, lang); }

  function set(lang) { current = has(lang) ? lang : 'en'; return current; }
  function get() { return current; }

  /* Missing keys fall back to English rather than rendering a raw key at the
     user — a half-translated interface still has to work. */
  function t(key, vars) {
    var table = STRINGS[current] || STRINGS.en;
    var s = table[key];
    if (s == null) s = STRINGS.en[key];
    if (s == null) return key;
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, function (m, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m;
    });
  }

  /* English inflects, Malay does not. */
  function plural(n, singularKey, pluralKey) {
    if (current === 'ms') return t(singularKey);
    return n === 1 ? t(singularKey) : t(pluralKey);
  }

  function langAttr() { return current === 'ms' ? 'ms' : 'en'; }

  return {
    languages: ['en', 'ms'],
    has: has,
    set: set,
    get: get,
    t: t,
    plural: plural,
    langAttr: langAttr,
    _strings: STRINGS
  };
}));
