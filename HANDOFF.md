# Project Handoff: Birthday Wizard

## What this is
A single-file HTML page (`index.html`) built as a birthday gift for the user's cousin. It's a mashup of two meanings of "wizard": a step-by-step **installation wizard** UI (Next/Back buttons, progress indicator, gated steps), skinned entirely in a **Gandalf-style epic fantasy** theme.

## Tech constraints
- **Pure HTML/CSS/JS.** No framework, no build step, no bundler, no npm dependencies.
- Only external dependency: Google Fonts (`Cinzel Decorative`, `Cinzel`, `EB Garamond`) loaded via a `<link>` tag — requires internet to render fonts correctly, everything else works offline.
- Keep it a single file unless explicitly asked to split it up.
- Fireworks are drawn on a `<canvas>` with vanilla JS (no animation library).
- Respects `prefers-reduced-motion` — preserve this if editing animations.

## Design language (please preserve unless asked to change it)
- **Palette:** deep midnight indigo (`#100c1e`, `#1b1738`, `#2a2150`) background, aged parchment (`#ece0c2`, `#e6d5a8`) for the installer "window," gold accents (`#c9a227`, `#f0c95c`), ember orange (`#e8703a`) for highlights/fire.
- **Type:** `Cinzel Decorative` for the big fantasy headline, `Cinzel` for UI labels/eyebrows, `EB Garamond` for body/parchment text.
- **Motif:** the installer is framed like an ancient stone/leather tablet with brass-ish borders, sitting over a starfield + mountain silhouette. Progress indicator is 5 glowing "runes" (I–V) that light up as you advance.
- **Voice:** playful high-fantasy language applied to mundane installer copy (e.g. "Terms of Enchantment," "Casting the Spell," status messages like "Summoning candles…").

## Current structure (5 steps)
1. **Welcome** — quest framing, "Begin" button
2. **Terms of Enchantment** — parody EULA in a scrollable box + a required checkbox ("I agree to grow one year wiser") that gates the Next button
3. **Choose Your Path** — 3 joke radio options (quiet hearth / legendary feast / epic quest), purely flavor, no branching logic yet
4. **Casting the Spell** — animated progress bar + rotating fantasy status messages, auto-runs once on entering the step, gates Next until it completes
5. **Finish** — canvas fireworks burst + birthday message, "Finish" button currently resets the wizard back to step 1

## Known gaps / good next steps
- The cousin's name and age were intentionally left generic — consider asking the user if they want to fill these in now, and where (headline, step 5 message, etc.)
- Step 3's choice doesn't currently affect anything downstream — could change step 5's message/visuals based on the selected path
- No sound — a soft chime on fireworks or step transitions could be nice
- Currently single-file; only split into separate CSS/JS files if asked
- No persistence — if the user reloads mid-wizard, it resets to step 1

## How to preview
Just open `index.html` directly in a browser (no server required), or run:
```bash
python3 -m http.server 8000
```
and visit `localhost:8000`.
