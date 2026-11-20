# Case study — FM27 Explorer

*A side project built over two days with an AI pair-programmer, from a question to a shipped tool.*

## The problem

Football Manager gives you 57,000 players and a tactic made of 11 roles, but no good way to answer
the questions that matter when you start a save:

- Which of my players actually fit the roles of my tactic?
- Where is my squad weak?
- Who could I realistically sign to fix it, at what price?

In FM26/FM27 it got harder: the long-standing "export view to HTML/CSV" feature was removed, so the
community's spreadsheets and scouting tools stopped working.

## Approach

I treated it like any product: start from the user's job, find the constraint, ship the smallest thing
that works, then iterate on real feedback.

| Step | Decision | Why |
|---|---|---|
| Discovery | Read data from the save file instead of the UI | The export is gone; screen-scraping is slow and fragile |
| Feasibility | Build on [fmsave](https://github.com/rhiever/fmsave), Randal S. Olson's open-source save reader | Faster and more reliable than reverse-engineering a binary format — and better for the community to build on shared work than to duplicate it |
| Validation | Compared all 36 attributes of one player against an in-game screenshot | Trust the data before building on it |
| v1 | Local HTML app to search players and clubs | Smallest useful thing |
| v2 | Import from the browser (Pyodide) instead of a `.bat` installer | The installer failed on the first real run; one button beats three steps |
| v3 | Tactic view: roles per position, best XI, weak spots | The real job: "do I have the right players for this tactic?" |
| v4+ | Role-driven scouting, key-attribute columns, price estimates, release clauses, tactics read from the save | Each came from a specific piece of feedback after using the previous version |

## Constraints and trade-offs

- **Privacy:** the save never leaves the user's machine. The cost is a ~10 MB runtime download on
  first import.
- **Encrypted tactic files:** I chose not to break the encryption tactic authors use. Instead, tactics
  are read from the save after being loaded in-game. Formation comes through; role names don't,
  so the user picks them once.
- **Model honesty:** fit scores and price estimates are clearly labelled as the app's approximations,
  with a tooltip explaining each number. Unreliable data (out-of-possession positions) was hidden
  rather than shown.
- **Zero install:** one self-contained HTML file that works from disk or GitHub Pages and can be shared
  with a friend as a 16 KB zip.

## Working with AI

I acted as product owner and tester; Claude did most of the engineering. In practice that meant:

- Framing problems as user outcomes ("show me players who fit *this role*", not "add a filter").
- Reviewing every iteration in the real game and feeding back concrete issues (a cut-off column, a
  confusing default, a missing filter).
- Making the calls on scope and trade-offs: keep max age, drop min age; read tactics from the save
  rather than decrypt files; hide data I couldn't trust.

## Result

- Imports a full FM27 save in ~30 seconds, in the browser.
- Tactic-aware scouting across the whole game world, with role key attributes, estimated price,
  release clauses, foot and height filters.
- Packaged to share with friends as a single file; open source under MIT.

## Credit where it's due

The hardest technical problem — decoding FM's save format — was solved by
[fmsave](https://github.com/rhiever/fmsave) (Randal S. Olson, MIT). FM27 Explorer is a product layer on
top of it: browser packaging, tactic and scouting models, and the UI. Choosing to build on an existing
open-source project, and crediting it clearly, was a deliberate product decision.

## What I'd do next

- Calibrate role weights against the game's own star ratings.
- Save multiple named tactics per career.
- Track squad development across imported seasons.
