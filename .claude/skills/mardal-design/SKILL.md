---
name: mardal-design
description: Design and build UI for the Mardal website. Use for any visual, layout, typography, colour, motion or section work on this site — and read it before proposing a design, not after. Covers the token system, the house rules, the responsive and mobile concept every page follows (new pages too), how the owner reviews work, and the mistakes that have already been made here.
---

# Designing for Mardal

The owner is the designer. He reviews visually, in the browser, and decides fast.
Your job is to build the thing he can look at, and to be right about the details
he should not have to check.

## Show, don't describe

Six designs were rejected in one session, and every rejection came faster than
the description that preceded it. He does not read design proposals. He looks.

- Build one real version and put it on the page. Do not offer three sketches.
- One screenshot beats five paragraphs. Take one, at the right scroll position.
- If you genuinely cannot choose without him, ask **one** question in plain
  prose with the options in a sentence — not a menu, not a table.

When he rejects something, the word he uses is the diagnosis. "Generic" means
the layout could belong to any company. "Too heavy" means dark fills, big
photography, or too much chrome. "Not modern" means it looks like 2015. "Too
much" means motion. Fix the named thing; do not rebuild everything.

## What he does not want

Learned the hard way, each from a rejection:

- **Generic layouts.** A numbered list, a card grid, an index-and-stage, a
  sticky photo stack — all rejected on sight. If a competitor could paste it
  onto their site unchanged, it fails before he sees it.
- **Analogies and storytelling in copy.** "Somebody retypes it on a Monday
  morning" was rejected as unprofessional. State capability directly.
- **Stock photography.** It reads as generic immediately.
- **Cursor followers.** A coloured disc, an outlined ring, and a cross were all
  rejected. If a hover needs an effect, let the *content* respond — the thing
  being pointed at, not a decoration chasing the pointer.
- **Filler words.** solutions, seamless, empower, leverage, cutting-edge,
  innovative, robust, journey, unlock, elevate, transform, ecosystem,
  streamline, end-to-end, best-in-class, world-class, bespoke.

## What worked

- The **redaction bars** are the one distinctive thing this site owns. Reach
  for them before inventing a new motif.
- **Flat tinted panels** in the four brand colours.
- **Small marks**: a 60px rule, a dash that closes into a cross. Restraint reads
  as considered.
- **Content responding to the pointer** — the boxes' bars redraw on hover.

## Never invent facts

Mardal has no public clients, no logos, no testimonials, no published numbers,
and its two products are unfinished. The owner has not published a city, a
team size or a legal entity.

Write `[City]`, `[X] hours`, `[founder name]`. Never fill a bracket with a
plausible guess — a page with an invented figure is worse than a page with a
gap, and he will catch it.

## The token system

Every value lives in `:root` in `app/globals.css`. Sixty-one tokens. Nothing in
the stylesheet sets a colour, weight, size, radius, shadow or duration by hand —
if you are about to type a hex or a px, look for the token first.

**Type — three sizes and only three.** Every piece of text on the site is one of
them. Anything small — labels, buttons, navigation, footer, eyebrows — is the
paragraph size.

| | size | weight | leading | tracking |
|---|---|---|---|---|
| big header | `--text-heading-xl` 72px | 430 | 0.94 | −0.055em |
| header | `--text-heading` 30px | 400 | 1.12 | −0.045em |
| paragraph | `--text-body` 16px | 400 | — | — |

Both headers are fluid and settle at those sizes from ~1280px up. There are no
responsive font-size overrides anywhere; the clamps handle small screens. Do not
add one.

**Colour.** One page, light, and nothing else — owner, 2026-10-03: "delete dark
mode we dont need it delete it all". No `light-dark()`, no `data-theme`, no
switch, no `prefers-color-scheme`; `tests/theme.test.mjs` fails if any comes back.
The things on the page carry the tint.

- `--canvas` `#ffffff` — the page, white (owner, 2026-10-05; it was grey `#e1e1df` from 2026-10-03)
- `--surface` `#efefed` — cards; `--menu-surface` white
- `--ink` `#08080a`, `--ink-muted` `#5e5a69`
- `--accent` = `--tint-red` `#ff3300` (owner 2026-10-05; the red replaced every purple and pink on 2026-10-03, then `#fb000e`); small type and focus use `--tint-red-bar` `#cc2900`
- Four card tints, each with a deeper bar shade: `--tint-red`, `--tint-butter`,
  `--tint-mint`, `--tint-sky`, and `--tint-*-bar`

**Only those four tints.** Two extra colours were added once and removed the
same day. Across five or six items, cycle the four and start the second row one
colour along so nothing touches its own colour.

**Motion.** `--duration-fast` 180ms for things under the hand, `--duration-base`
420ms, `--duration-handover` 900ms with `--ease-handover` for changes that
happen on their own while being watched.

## House rules for the code

- **All CSS in `app/globals.css`.** No inline styles, no CSS modules, no
  Tailwind utilities in markup. The render test fails the build if a
  server-rendered element carries a `style=` attribute. GSAP setting styles at
  runtime is fine.
- **Copy lives in `content/home.ts`**, never in components.
- **Server components by default.** Interactivity goes in a small `"use client"`
  component that attaches listeners, so sections stay server-rendered.
- Run `npm test` — it builds and renders the page, asserting real strings.
  Update its assertions when you change what the page says.

## Verify in the browser, with numbers

He will ask "is it 30px?" and the answer must be measured, not estimated. Open
the page, evaluate JS, and report actual values: gaps, widths, computed colours,
frame counts, opacity over time. Several bugs this session were only found this
way, and several "it's not moving" reports were the animation genuinely not
running.

Note when reading measurements: the rendered HTML includes the RSC payload after
the markup, so every class name appears twice — take the first N matches.

## Bugs already hit here

- `overwrite: true` on a GSAP tween kills **every** tween on that element,
  including `quickTo` position tweens. Use `overwrite: "auto"`.
- `pointerenter` with capture fires for every descendant. An SVG with 65 rects
  restarts the animation 65 times. Use `pointerover`, which bubbles, and hold
  the current element so it only fires on change.
- Tweening `filter` from `none` has no sane start value; GSAP drove brightness
  far past the target and rendered the cards near-black. Animate transforms.
- `Math.sin` differs in the last digit between server and browser. Round any
  generated SVG geometry, or React reports a hydration mismatch.
- Never `npm audit fix --force` — it downgrades this repo to `next@9`.

## Layout facts worth knowing

- The content column runs to `--container-default` 80rem. Sections align to it;
  breaking out of it loses the alignment with every other section, which he
  notices.
- When a box has to grow but its drawing must not distort, read the container's
  own width: `height: calc(100cqw * H / W + 60px)` with `container-type:
  inline-size` on the parent. Used by the coloured boxes.
- Both headers use `text-wrap` set in the content as explicit line spans, not
  automatic wrapping, so the break falls in the same place at every width.

## Responsive and mobile — every page, new ones too

Owner, 2026-10-06: "save this responsivenes and mobile concept hot it should
look also the future pages globally". Built and approved in the responsive
pass of 2026-10-06 (the homepage and /services are the worked examples).
Every new page and section follows it from the start, not as a later pass.

**The idea: the phone is the desktop design, adapted, not a simpler site.**
Owner, of the phone wheel: "yes try to adapt same effect as in desktop". Keep
the same layout ideas, the same marks and the same motion; change only the
arrangement and the sizes so they fit. Never swap a designed section for a
plain stack of blocks on a phone. If the owner draws phone comps (390px
wide), build exactly to them.

**Widths.** Only the six steps in `lib/breakpoints.ts` — 24, 30, 40, 48,
64, 75rem — or a step's complement 1/16rem past it (`min-width:
40.0625rem`). `tests/breakpoints.test.mjs` fails on any other width. Phones
are ≤ 40rem. The stylesheet is desktop-first: add phone rules in a
`@media (max-width: 40rem)` block after the desktop rule, never rewrite it
mobile-first. Inside a component, prefer a container query
(`container-type: inline-size`, `cqw`) so it fits the room it is given.

**Touch is asked of the pointer, not the width.** The mobile menu, the phone
bar and ScrollSmoother switch on `MOBILE_MENU` = `(max-width: 64rem),
(hover: none)` — use the constant, never a new copy. Every hover effect needs
a tap equivalent.

**The grid.** Desktop four columns, five hairlines; a phone two columns,
three hairlines (`[data-ruled]` does it). Content sits between the lines on a
phone as it does on a desktop, never cut through by one.

**Type.** Still the three sizes; the clamps shrink them. Headings stay explicit
line spans; on a phone keep the desktop's set (first line indented, a line
justified to the column) rather than letting it wrap freely. Never break a
hyphenated word across lines — wrap it whole (`.services-hero__whole`).

**The bar on a phone and tablet** slides away on scrolling down and comes
back on a canvas band when scrolling up, so it never sits over text. Desktop
keeps the bar without a ground.

**The menu.** Every top word has the red plus in front, a page's as well as
a parent's. A word that is a page goes straight to its page. No focus ring
after a tap — the header's `data-pressed` hides it, and a key brings it back.

**Screens and edges.**
- `viewport-fit=cover`; side gutters clear of the notch (`--page-gutter`), and
  anything at the foot of the screen clear of the home bar with
  `env(safe-area-inset-bottom)`.
- Full-screen sections use `svh`. A phone's address bar hides as it scrolls,
  so the screen grows past `100svh`: anything that must reach the foot of the
  screen — the hairlines above all — lives in the page, not in a held
  section, so it carries on past the section's foot.
- Never join two pieces of one drawing across a held (pinned) section. The
  page moves on its own on a phone and anything moved by script follows a
  frame or more late, so the join opens while it scrolls (the gap in the
  services lines, 2026-10-06). One piece, in the page.

**Fingers.** Everything pressable is at least 44px on a touch screen. The
press area grows, not the layout: padding plus the same negative margin, in
the `(pointer: coarse)` block ("Room for a finger"). Add a new link class
there. Form fields are 16px or more, or Safari zooms in on them.

**Images.** Every image gets `srcSet` widths and `sizes`, so a phone loads a
phone-sized file, and a set aspect ratio, so nothing jumps while it loads.

**Motion.** The same effects, set per size (`gsap.matchMedia()`, or a
`window.matchMedia` the component rebuilds on); lighter
where a phone needs it, never dropped for being on a phone. ScrollSmoother is
off on touch; `ScrollTrigger.config({ ignoreMobileResize: true })` wherever a
section is held, so the address bar does not re-measure it mid-scroll.
Reduced motion stays respected everywhere.

**Checks before showing him.**
- `npm run check:responsive` (dev server on :3001): every page at 360, 390,
  430, 768, 1024, 1280 and 1440 — sideways scroll, spill past the edge,
  small targets, small text, zooming fields, heavy images. 0 failing, or it
  is not done. Add a new page's route to `ALL_ROUTES` in
  `scripts/responsive-check.mjs`.
- Speed on a phone (Lighthouse mobile): main content within 2.5s, nothing
  jumping (CLS 0.1 or less), a tap answered within 0.2s.
- Accessibility: text at 200%, a phone on its side, the keyboard all the way
  through.
- The owner checks on his real iPhone (and iPad) in Safari — the emulator
  misses Safari's own behaviour. Phone screenshots of the real page, at the
  scroll position in question, before saying it works.
