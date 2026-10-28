# Design skills for Niagize (v2.16)

These are vendored copies, pinned to a commit, each with its own licence. Claude Code loads them automatically when it works in this repo.
All four read `DESIGN.md` and `PRODUCT.md` at the repo root, and DESIGN.md wins any clash.

| Skill | Use it for | Source (commit) | Licence |
|---|---|---|---|
| `impeccable` | Main tool. `/impeccable audit`, `critique`, `polish`, `quieter`, `distill`, `harden`, `onboard` on a screen (Operate mode) | github.com/pbakaus/impeccable (3e3a917) | Apache 2.0 |
| `web-design-guidelines` | 100+ rule check: accessibility, focus, forms, touch, safe areas, dark mode, i18n. Rules are in `rules.md` | github.com/vercel-labs/agent-skills (1a2c79d) + web-interface-guidelines (434b7f9) | MIT |
| `taste-skill` (invoked as `design-taste-frontend`) | Spotting generic, AI-made patterns; notes on app screens, colour and motion | github.com/Leonxlnx/taste-skill (12af471) | MIT |
| `hallmark` | **Audit only** (`/hallmark audit <path>`) plus the slop checker. It's made for marketing pages, so don't let it redesign the app | github.com/nutlope/hallmark (6033bab) | MIT |

## Slop checker (no AI needed)
```
node .claude/skills/hallmark/scripts/sloplint.mjs beta/admin/index.html beta/shared/style.css beta/index.html --scope app
```
Baseline on v2.15 (28 Oct 2026): 194 FAIL, 249 REFLEX, 35 WARN. 155 of the FAILs are colour literals outside the tokens.
Known clashes with our house style (keep them, waive on record): " · " between two facts; the Hallmark stamp comment (rule 20).

## Updating a skill
Re-copy the skill folder from its repo at a newer commit, update the commit in this table, and re-run the checker.
