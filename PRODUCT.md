# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS — a single page, no build step, no dependencies, no package manager. Chosen by the user over Vite/TypeScript and Astro. Deployed as-is to GitHub Pages; what is in the repository is what the browser receives.

## Users

Sim racers preparing for or sitting in a race, across ACC, iRacing, Le Mans Ultimate, Assetto Corsa, AMS2 and similar titles. They arrive with numbers taken off a practice run — a fuel readout, a stint time, a tank size — and need a fuel load and a stop plan before the session starts.

Phone and desktop matter equally. The phone case is one-handed use beside a running rig; the desktop case is a second monitor next to the sim. Neither is the fallback for the other.

## Product Purpose

Turn the numbers a driver actually has after a practice run into a fuel load and a pit strategy, without the driver doing arithmetic first.

Success is a driver reaching a correct fuel figure and a stop plan in seconds, on a phone, without leaving the page or opening a calculator.

## Positioning

Existing fuel calculators require **fuel per lap** as an input. That is the one number a driver typically does not have. What they have is a total: "12.4 litres over 4 laps." This product accepts the total and the lap count for both fuel and lap time, and derives the per-lap values itself.

It also treats pit strategy as a comparison rather than a verdict: instead of reporting the minimum number of stops, it lays out every viable stop count side by side with the laps and fuel for each stint, and flags the ones a given tank cannot support.

## Operating Context

The user has just finished a practice run and is reading numbers off the sim's fuel readout, setup screen, or a timing app. They may be in a lobby with a countdown running. Inputs are transcribed by hand from another screen, so entry speed and error tolerance matter more than input richness.

Setups recur: the same car at the same track, week to week, in a league. Sharing a plan with a teammate is a normal act.

## Capabilities and Constraints

Confirmed for v1:

- Race defined **either** by duration (hours + minutes) **or** by a fixed lap count.
- Lap time entered as a total over N laps; average derived. N defaults to 1.
- Fuel entered as a total over N laps; per-lap derived. N defaults to 1.
- Tank capacity, and pit stop time loss in seconds.
- Outputs: race laps, minimum fuel, recommended fuel load, and a strategy list across stop counts with laps, fuel per stint, starting load, total fuel, and estimated race time.
- Non-viable strategies (a stint exceeding tank capacity) are shown as non-viable, not hidden and not rendered as impossible numbers.
- Inputs encode into the URL so a plan can be bookmarked or sent.
- Named setups persist in `localStorage`.

Fuel margin is fixed, not user-configurable: one formation lap plus one spare lap, stated in the interface wherever the recommended figure appears. The user declined a margin control; the reasoning recorded is that an unexplained buffer gets overridden blindly, so the tool states its assumption rather than delegating it.

Units are **litres only**. Gallons and kilograms were considered and declined.

For timed races, lap count is `floor(raceSeconds / averageLap) + 1` — a timed race ends when the leader crosses the line after the clock expires, so a lap beyond the arithmetic is always run. This is product behaviour, not a safety pad, and is separate from the margin above.

Explicitly out of scope for v1, and deliberately undecided rather than rejected:

- Fuel-weight pace penalty (a heavier car being slower). Without it, the fewest viable stops always ranks fastest, so the strategy ordering is predictable and only the time deltas and viability flags carry new information. The user accepted this trade for v1.
- Refuel-rate modelling (a larger fill physically taking longer than a flat pit loss).
- Per-sim or per-car presets shipped with the product.

## Brand Commitments

None. No existing name, logo, palette, or voice. simracingsetup.com/fuel-calculator is the functional reference point the user named — it is a description of the problem being improved on, not a visual constraint.

## Evidence on Hand

None. No screenshots, telemetry, brand assets, real user data, or existing deployment. Any demonstration values shown in the interface (example lap times, fuel figures, car or track names) are authored illustrations and must be recognisable as such. No claims about accuracy against any specific sim, no user counts, and no endorsements may be stated.

## Product Principles

1. **Accept the number the driver has.** Any quantity a sim reports as a total over several laps should be enterable that way. Making the user divide before they can start is the failure this product exists to fix.
2. **State assumptions in the interface, not in a footnote.** Every figure that includes a buffer says what the buffer is, at the point the figure is read.
3. **Compare, don't pronounce.** Strategy is a trade the driver owns. Show the viable options and what each costs; do not collapse them to a single recommended answer.
4. **The phone is a first-class surface.** Results must be readable and inputs reachable one-handed, on a phone, without scrolling past the answer.
5. **No arithmetic reaches the screen unfinished.** Blank, zero, and impossible inputs produce a stated condition, never `NaN`, `Infinity`, or a negative fuel load.

## Accessibility & Inclusion

No user-specific requirement was established. General baseline applies: real form labels, keyboard operability, visible focus, and colour never used as the sole carrier of a viability or error state.
