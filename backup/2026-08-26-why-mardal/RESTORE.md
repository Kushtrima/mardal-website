# Why Mardal — snapshot before the boxes were changed

Taken 2026-08-26, at the owner's request, immediately before the "Why Mardal?"
cards on the homepage had their animated artwork removed and their copy
replaced.

**This is a full copy of every file that change touches, not an excerpt.** The
`.txt` extensions are deliberate: `tsconfig.json` includes `**/*.ts` and
`**/*.tsx`, so a `.tsx` in here would be typechecked as a second definition of
a component that already exists, and the build would carry it.

| file here | goes back to |
|---|---|
| `home.ts.txt` | `content/home.ts` |
| `WhyMardal.tsx.txt` | `components/home/WhyMardal.tsx` |
| `globals.css.txt` | `app/globals.css` |
| `AnimatedIpoImage.tsx.txt` | `components/home/AnimatedIpoImage.tsx` |
| `AnimatedRecurringImage.tsx.txt` | `components/home/AnimatedRecurringImage.tsx` |
| `AnimatedRecommendationsImage.tsx.txt` | `components/home/AnimatedRecommendationsImage.tsx` |
| `AnimatedSupportImage.tsx.txt` | `components/home/AnimatedSupportImage.tsx` |

`why-mardal.css.txt` is not a file of its own — it is lines 2208-2768 of the
stylesheet as they stood, which is `.why-section` through the last
`.why-card--four`, kept separately so the section can be read without opening a
372KB file. Restore from `globals.css.txt`, not from this.

## To put it back

```sh
cd "~/Desktop/Mardal websitess "
D=backup/2026-08-26-why-mardal
cp $D/home.ts.txt content/home.ts
cp $D/WhyMardal.tsx.txt components/home/WhyMardal.tsx
cp $D/globals.css.txt app/globals.css
for f in AnimatedIpoImage AnimatedRecurringImage AnimatedRecommendationsImage AnimatedSupportImage; do
  cp $D/$f.tsx.txt components/home/$f.tsx
done
rm -rf .next && npm run build:worker && npm test
```

The `rm -rf .next` is not optional: Turbopack serves stale CSS from that cache
and a restart alone does not clear it.

## What was in it

Four cards, each with an animated isometric drawing, a label in the corner, a
serif title and a line of copy:

| # | art | label | title |
|---|---|---|---|
| one | `columns` | Applied AI | Solving real business problems with AI |
| two | `cycle` | Automation | Less repetition. More progress. |
| three | `handoff` | Connected Systems | Everything working together |
| four | `orbit` | Technology Partnership | Built with you. Improved as you grow. |

Above them, the label "Why Mardal?", the heading "Build smarter. / Scale
faster.", and the paragraph beginning "We help your business work better…".

## The other backup

Git has all of this too — the change lands as a diff and `git checkout` on any
of these paths undoes it. This folder exists because the owner asked for a copy
he can see, and because the working tree has a large uncommitted batch on
`light-and-dark`, so `git checkout` would take unrelated work back with it.
