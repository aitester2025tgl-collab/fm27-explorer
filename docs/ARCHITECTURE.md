# Architecture and decisions

## Constraints that shaped the design

| Constraint | Consequence |
|---|---|
| FM26/FM27 removed the old "print view to HTML/CSV" export | Data has to come from the save file itself |
| Save files are proprietary, zstd-compressed binaries | Use [fmsave](https://github.com/rhiever/fmsave), an open-source reader, instead of reverse-engineering |
| `.fmf` tactic files are encrypted | Never decrypted. Tactics are read from the save once loaded in-game |
| Users should not have to install Python or tools | Run Python **in the browser** with Pyodide |
| Saves contain a full game world (57k players) and are personal | Process locally; store in the browser (IndexedDB); never upload |
| Must also work when opened from disk (`file://`) | Single self-contained HTML file; main-thread Pyodide (module workers are blocked on `file://`) |

## Data flow

1. The user picks a `.fm` file. `boot.js` lazily loads Pyodide 314.0.7 from the jsDelivr CDN and the
   pinned fmsave 0.12.6 wheel from PyPI, unpacking it into Pyodide's `site-packages`.
2. The save is copied into Pyodide's in-memory filesystem. `convert.py` calls fmsave's CLI entry point
   to export `players`, `clubs`, `nations`, `managed-clubs` and `tactics`, then compacts them into
   positional arrays (~20 MB JSON for the full database).
3. The JSON is stored in IndexedDB under `slug(save name)__in-game date`. Re-importing the same save at a
   later date creates a new snapshot, so seasons can be compared.
4. `app.js` and `tactic.js` render everything client-side with plain DOM APIs — no framework, no build
   toolchain beyond `tools/build.py`.

## Nationality names

Saves store nations as database ids without names. Names were mapped by inspecting the best-known
players of each nation id (e.g. id 788 → Bruno Fernandes, Vitinha, Rúben Dias → Portugal). A dozen
tiny nations without recognisable players fall back to `Nação #id`.

## Role-fit model

For a player *p* and role *r* with attribute weights *w*:

```
weighted = Σ w_a · attr_a / Σ w_a                     (1–20 scale)
key      = mean(attr_a for the role's key attributes) (weight ≥ 2)
fit      = (0.6 · weighted + 0.4 · key) · 5           (0–100)
score    = fit × familiarity(position)                 (1.0 natural … 0.4 unfamiliar)
```

- Weights per role are editable in the UI and saved per save file.
- Pace and acceleration carry extra weight in most outfield roles, following community match-engine
  testing (FM-Arena) that consistently ranks them among the most impactful attributes.
- The best XI is an assignment problem (11 slots × N players) solved with the Hungarian algorithm.
- Weak positions: starter < 66 or second option < 62.

These numbers are an approximation designed to rank players sensibly, not a replica of the game's
star ratings; calibrating weights against in-game stars is the natural next improvement.

## Asking-price estimate

The game computes asking prices at negotiation time, so they are not in the save. The estimate:

```
m = contract factor (0.5 if < 6 months … 1.3 if 3+ years)
  × squad status factor (star 1.3, regular 1.1, fringe 0.75 …)
  × age factor (≤23: 1.1, ≥31: 0.85)
m = min(m, 1.7)
range = market value × m × [0.85, 1.15], capped by the applicable release clause
```

Release clauses (general, foreign-only, domestic-only) are real values from the save; the one that
applies depends on whether the buyer (the managed club) is in the same country as the seller.

## Tactics from the save

fmsave exposes each tactic's 11 slots as position bit masks. Bits follow FM's classic order
(GK, SW, DR, DL, DC, WBR, WBL, DM, MR, ML, MC, AMR, AML, AMC, ST) and two high bits mark the left/right
member of a pair. That is enough to rebuild the in-possession formation. Role ids are stored as
unnamed numbers, so roles default by position group and the user selects them once.
Out-of-possession positions are available but looked inconsistent in testing, so they are not shown.

## Internationalisation

UI strings are written in Portuguese in the code and wrapped in `t("…")`; `src/js/i18n.js` holds the
English dictionary plus English names for attributes, positions, roles, statuses and nations. English is
the default; the EN | PT switch stores the choice in `localStorage` and reloads. Static page text is
translated once at start-up. A test fails if any `t("…")` string lacks an English entry.

## Testing

- `tests/test_build.py` — the build resolves every include, required UI elements exist, embedded Python
  parses, runtime versions are pinned, and each inline script passes `node --check`.
- `tests/test_convert.py` — converter helpers (number parsing, release-clause selection, nation names).
- During development the full flow (import → tactic → scouting) was exercised end to end with
  Playwright against a real save, using local mirrors of the Pyodide and fmsave assets.
