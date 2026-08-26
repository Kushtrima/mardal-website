# Fusion section — snapshot before the scroll reveal

Taken 2026-08-26, immediately before the drawn-plus reveal was built.
`.txt` because tsconfig includes `**/*.tsx` and a live copy would be typechecked.

| file here | goes back to |
|---|---|
| `FusionSection.tsx.txt` | `components/home/FusionSection.tsx` |
| `globals.css.txt` | `app/globals.css` |

`fusion.css.txt` is lines 2120-2200 of the stylesheet, kept separately so the
section reads without opening a 372KB file. Restore from `globals.css.txt`.

After restoring: `rm -rf .next && npm run build:worker && npm test`. The cache
clear is not optional — Turbopack serves stale CSS a restart does not touch.
