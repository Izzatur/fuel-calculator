/* Run with: node test-i18n.js
   Checks the dictionaries agree with each other and with the code that uses
   them. A missing Malay key falls back to English silently at runtime, so it
   has to be caught here instead. */

var I = require('./i18n.js');
var fs = require('fs');

var pass = 0, fail = 0;

function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (detail ? '\n          ' + detail : '')); }
}
function eq(name, a, b) {
  ok(name, a === b, 'expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a));
}
function group(t) { console.log('\n' + t); }

var en = I._strings.en, ms = I._strings.ms;
var enKeys = Object.keys(en).sort(), msKeys = Object.keys(ms).sort();

/* ------------------------------------------------------------------ */
group('Dictionaries agree');

var missingInMs = enKeys.filter(function (k) { return !(k in ms); });
var extraInMs = msKeys.filter(function (k) { return !(k in en); });

ok('every English key has a Malay translation',
  missingInMs.length === 0, 'missing: ' + missingInMs.join(', '));
ok('no orphan Malay keys',
  extraInMs.length === 0, 'orphans: ' + extraInMs.join(', '));

/* Legitimately identical: unit symbols, the EN/BM button labels themselves,
   and loanwords Malay actually uses ("status" is standard Malay; "stint" and
   "delta" are what the racing community says). */
var SAME_BY_DESIGN = ['strat.status'];

var untranslated = enKeys.filter(function (k) {
  if (k.indexOf('unit.') === 0 || k.indexOf('lang.') === 0) return false;
  if (SAME_BY_DESIGN.indexOf(k) >= 0) return false;
  return en[k] === ms[k];
});
ok('no Malay string is a copy of the English',
  untranslated.length === 0, 'identical: ' + untranslated.join(', '));

var empties = enKeys.filter(function (k) { return !String(ms[k]).trim(); });
ok('no empty Malay strings', empties.length === 0, empties.join(', '));

/* ------------------------------------------------------------------ */
group('Placeholders match across languages');

function slots(s) {
  return (String(s).match(/\{(\w+)\}/g) || []).sort().join(',');
}
var mismatched = enKeys.filter(function (k) { return slots(en[k]) !== slots(ms[k]); });
ok('every {placeholder} appears in both languages',
  mismatched.length === 0,
  mismatched.map(function (k) { return k + ' [' + slots(en[k]) + '] vs [' + slots(ms[k]) + ']'; }).join('; '));

/* ------------------------------------------------------------------ */
group('Interpolation and fallback');

I.set('en');
eq('substitutes a variable', I.t('save.saved', { name: 'GT3' }), 'Saved “GT3”.');
I.set('ms');
eq('substitutes in Malay too', I.t('save.saved', { name: 'GT3' }), 'Disimpan “GT3”.');
eq('unknown key returns the key', I.t('nope.not.here'), 'nope.not.here');
eq('missing variable leaves the slot alone', I.t('save.saved', {}), 'Disimpan “{name}”.');

I.set('zz');
eq('unknown language falls back to English', I.get(), 'en');

/* ------------------------------------------------------------------ */
group('Plural rules');

I.set('en');
eq('English singular', I.plural(1, 'unit.lap', 'unit.laps'), 'lap');
eq('English plural', I.plural(2, 'unit.lap', 'unit.laps'), 'laps');
eq('English zero is plural', I.plural(0, 'unit.lap', 'unit.laps'), 'laps');
eq('English stop', I.plural(1, 'strat.stop', 'strat.stops_plural'), 'stop');
eq('English stops', I.plural(3, 'strat.stop', 'strat.stops_plural'), 'stops');

I.set('ms');
eq('Malay does not inflect (1)', I.plural(1, 'unit.lap', 'unit.laps'), 'pusingan');
eq('Malay does not inflect (2)', I.plural(2, 'unit.lap', 'unit.laps'), 'pusingan');
eq('Malay stops do not inflect', I.plural(3, 'strat.stop', 'strat.stops_plural'), 'henti');

eq('lang attribute for Malay', I.langAttr(), 'ms');
I.set('en');
eq('lang attribute for English', I.langAttr(), 'en');

/* ------------------------------------------------------------------ */
group('Every key the code uses actually exists');

var src = fs.readFileSync('./app.js', 'utf8') + fs.readFileSync('./calc.js', 'utf8');
/* The boundary matters: without it this also matches the t( inside
   setText(, and every element id gets reported as a missing key. */
var used = {};
(src.match(/(?<![\w.])t\('([a-zA-Z][\w.]*)'/g) || []).forEach(function (m) {
  used[m.replace(/^t\('/, '').slice(0, -1)] = true;
});
(src.match(/error:\s*'(err\.[\w.]+)'/g) || []).forEach(function (m) {
  used[m.replace(/.*'(err\.[\w.]+)'.*/, '$1')] = true;
});

var undefinedKeys = Object.keys(used).filter(function (k) { return !(k in en); });
ok('no key referenced in app.js or calc.js is missing from the dictionary',
  undefinedKeys.length === 0, 'undefined: ' + undefinedKeys.join(', '));

/* Every error calc.js can return must be translatable. */
var errKeys = enKeys.filter(function (k) { return k.indexOf('err.') === 0; });
var thrown = (fs.readFileSync('./calc.js', 'utf8').match(/error:\s*'(err\.[\w.]+)'/g) || [])
  .map(function (m) { return m.replace(/.*'(err\.[\w.]+)'.*/, '$1'); });
var uniqueThrown = thrown.filter(function (v, i) { return thrown.indexOf(v) === i; });
ok('every error calc.js returns has a translation',
  uniqueThrown.every(function (k) { return errKeys.indexOf(k) >= 0; }),
  'thrown: ' + uniqueThrown.join(', '));
ok('calc.js returns at least 6 distinct error codes', uniqueThrown.length >= 6,
  'found ' + uniqueThrown.length);

/* ------------------------------------------------------------------ */
group('Every data-i18n key in the markup exists');

var html = fs.readFileSync('./index.html', 'utf8');
var attrKeys = [];
(html.match(/data-i18n(?:-placeholder|-aria-label)?="([\w.]+)"/g) || []).forEach(function (m) {
  attrKeys.push(m.replace(/.*="([\w.]+)"/, '$1'));
});
var missingAttr = attrKeys.filter(function (k) { return !(k in en); });
ok('no data-i18n attribute points at a missing key',
  missingAttr.length === 0, 'missing: ' + missingAttr.join(', '));
ok('the markup actually carries i18n attributes', attrKeys.length > 30,
  'found ' + attrKeys.length);

/* ------------------------------------------------------------------ */
console.log('\n' + pass + ' passed, ' + fail + ' failed');
console.log('keys: ' + enKeys.length + ' per language');
process.exit(fail === 0 ? 0 : 1);
