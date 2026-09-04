# Fuel Calculator

A sim racing fuel and stint planner that takes the numbers you actually have.

Most fuel calculators demand **fuel per lap** — the one figure a driver rarely
has to hand. What you have after a practice run is a total: *"12.4 litres over
4 laps."* This one accepts the total and the lap count, for both fuel **and**
lap time, and does the division itself.

It also treats pit strategy as a comparison rather than a verdict: every stop
count is laid out side by side with the laps, time and fuel for each stint, and
the ones your tank cannot support are marked as such instead of hidden.

If you already have a **stint requirement** — a regulation, a driver-swap
window, or simply how long you want to stay in the car — enter it in minutes
and the whole plan is worked out around it.

Available in **English and Bahasa Melayu** — toggle at the top left. Your
choice is remembered, and it travels in the share link.

## Using it

| Input | Notes |
|---|---|
| Race format | By time (hours + minutes) or by a fixed lap count |
| Lap time | Minutes and seconds, **over any number of laps** |
| Fuel used | Litres, **over any number of laps** |
| Tank capacity | Litres |
| Stint limit | **Optional.** Minutes — the longest a single stint may run |
| Pit stop loss | Seconds lost per stop, entry to exit |

The "over N laps" field defaults to 1, so a per-lap figure still works exactly
as you'd expect.

Inputs are encoded in the URL, so a plan can be bookmarked or sent to a
teammate. Named setups save to the browser on that device.

## How the numbers work

**Race laps.** For a timed race:

```
raceLaps = floor(raceSeconds / averageLap) + 1
```

The `+ 1` is not padding. A timed race ends when the leader crosses the line
*after* the clock expires, so you always run one lap beyond the arithmetic. A
60-minute race at 2:00 laps is 31 laps, not 30.

**Fuel load.** Always includes one formation lap and one spare lap:

```
load = (raceLaps + 2) × fuelPerLap
```

This is fixed rather than configurable, and the interface states it wherever
the figure appears. Fuel is weight and weight is lap time, so a buffer nobody
can see is a buffer people override blindly.

**Stints.** Laps are spread as evenly as the stop count allows — 29 laps over
4 stints is 8/7/7/7, not 8/8/8/5. The first stint carries the formation lap,
the last carries the spare lap. A strategy is viable when no single stint
exceeds tank capacity.

**Stint limit.** Optional, and stated in minutes because that is how the rule
usually reads. It is enforced in laps, using the same average lap as
everything else:

```
stintLapCap = floor(stintSeconds / averageLap)
```

A strategy is viable when its longest stint clears *every* limit you stated —
so a 40-minute cap on 2:00 laps allows 20 laps, and a plan whose longest stint
is 21 laps is ruled out even if the tank could hold the fuel. The page states
the cap in both currencies (`40 min · 20 laps`), because a plan that stops a
lap "early" otherwise reads as a bug.

Either limit works on its own: a stint limit with no tank capacity still
produces a strategy table, and vice versa. Stint time is measured over race
laps only — the formation lap is fuelled for, not timed.

**Race time.**

```
raceTime = raceLaps × averageLap + stops × pitLoss
```

## Known limits

Two things are deliberately not modelled in this version:

- **Fuel weight.** A heavier car is slower, but that pace penalty isn't
  simulated. The practical consequence: *the fewest viable stops always ranks
  fastest*, so the ordering of the strategy table is never a surprise. What it
  does tell you is the **delta** — what each extra stop costs — and which
  strategies your tank actually supports. Those are the parts that aren't
  obvious.
- **Refuel rate.** Pit loss is a flat number, though in most sims a larger
  fill physically takes longer.

Both would drop into `calc.js` without restructuring anything. Neither is
present today.

Figures are litres. There is no gallon or kilogram conversion.

## Running and testing

It's a static page with no build step and no dependencies. Open `index.html`,
or serve the folder with anything.

The calculation core in `calc.js` is pure and has no DOM dependency:

```
node test-calc.js    # 84 checks
node test-i18n.js    # 25 checks
```

`test-calc.js` covers the timed-lap rule, the "over N laps" equivalence, stint
balancing, tank and stint-limit viability, and input guards (blank, zero, negative, and
non-numeric entry must never produce `NaN`, `Infinity`, or a negative load).

`test-i18n.js` covers the translations: every English key has a Malay
counterpart, no Malay string is an untranslated copy, `{placeholder}` slots
match across both languages, plural rules behave (English inflects, Malay
does not), and every key referenced in `app.js`, `calc.js` or `index.html`
actually exists. A missing translation falls back to English silently at
runtime, so it has to be caught here instead.

Note that `calc.js` returns error **keys** (`err.lapTime`), not sentences.
The calculation layer has no opinion about language, and switching language
re-renders an error without recomputing anything.

## Files

| Path | Purpose |
|---|---|
| `index.html` | Markup, plus the design direction contract |
| `styles.css` | All styling |
| `calc.js` | Pure calculation core — no DOM |
| `app.js` | DOM layer, URL state, saved setups |
| `i18n.js` | English + Bahasa Melayu strings |
| `test-calc.js` | Calculation test suite |
| `test-i18n.js` | Translation test suite |
| `fonts/` | Martian Mono, 3 weights, ~30 KB total |
| `PRODUCT.md` | Product decisions and their reasoning |
| `DESIGN.md` | The visual system as built |

## Design

The interface is built as a **live timing screen** — ruled columns, tabular
figures, and the purple / green / amber vocabulary that already means *session
best / valid / warning* to anyone who watches motorsport. Strategy viability
inherits that reading rather than inventing a new one.

Colour is never the sole carrier of state: every flagged row also carries a
word naming the limit it breaks, and the figures that overran are struck
through as well as flagged — litres for the tank, minutes for the stint.

Every figure is set in **Martian Mono**, self-hosted at three weights (~30 KB
total, no network request). The page's focal element is a 96px number, and
leaving that to whatever monospace the OS happens to ship — Consolas on
Windows, SF Mono on macOS, Liberation Mono on Linux — is three different
designs. Licensed under the SIL Open Font License 1.1; see
`fonts/LICENSE-MartianMono.txt`.

Everything is flat ink. No gradient, no shadow, no glass, no glow.
