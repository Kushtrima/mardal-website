import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  DRIFT_BAND,
  DRIFT_QUICK,
  DRIFT_SLOW,
  bandOf,
  bandsOf,
  barsPath,
  driftHash,
  touching,
  trailingOffset,
} from "../lib/pattern-drift.ts";
import { brandingPattern } from "../lib/branding-pattern.ts";
import { aiAutomationPattern } from "../lib/ai-automation-pattern.ts";
import { softwarePattern } from "../lib/software-pattern.ts";
import { crmSolutionPattern } from "../lib/crm-solution-pattern.ts";
import { websitesPattern } from "../lib/websites-pattern.ts";

/**
 * All five hero drawings travel now, each in its own artwork, and a tween cannot
 * be asserted in Node. What can is the arithmetic underneath it, which is where
 * the failures nobody would catch by looking actually live: a seam at the loop
 * point, a shape torn across two belts, or a drawing agreeing to go one way.
 *
 * Table-driven because the whole point of the owner's instruction was that these
 * are five different drawings on one mechanism. A rule proved against Branding
 * alone is a rule proved against the densest of them.
 */
const PATTERNS = [
  { name: "Branding", pattern: brandingPattern, bars: 303, adjacencies: 291 },
  { name: "AI & Automation", pattern: aiAutomationPattern, bars: 355, adjacencies: 334 },
  { name: "Software", pattern: softwarePattern, bars: 40, adjacencies: 5 },
  { name: "CRM Solution", pattern: crmSolutionPattern, bars: 44, adjacencies: 15 },
  { name: "Websites", pattern: websitesPattern, bars: 46, adjacencies: 13 },
];

for (const { name, pattern, bars: count, adjacencies } of PATTERNS) {
  const bands = bandsOf(pattern.bars);

  test(`${name}: the artwork is the trace, unedited`, () => {
    /* The bars came off each PNG's pixels rather than off anyone's judgement, so
       a changed count means a data file was edited by hand or re-traced with
       different settings. Either is a decision, and this is where it is noticed. */
    assert.equal(pattern.bars.length, count);

    /* **All five were drawn on the same canvas**, which is the fact that lets one
       `aspect-ratio` in the stylesheet serve every hero. A sixth traced at some
       other size would be letterboxed or stretched, silently. */
    assert.equal(pattern.width, 1447);
    assert.equal(pattern.height, 1087);
  });

  test(`${name}: every bar is carried, and carried once`, () => {
    /* Banding is a partition. A bar dropped between two bands vanishes from the
       hero; a bar in two of them renders twice, in two places, moving two ways. */
    const carried = bands.flatMap((band) => band.bars);
    assert.equal(carried.length, count);
    assert.equal(new Set(carried.map((bar) => bar.join())).size, count);

    /* Position decides the band unless a neighbour overrules it — see below — so
       a bar sits either where its middle put it or higher, never lower. */
    for (const band of bands) {
      for (const bar of band.bars) assert.ok(band.index <= bandOf(bar));
    }
  });

  test(`${name}: nothing that touches is split across two belts`, () => {
    /* **The invariant that stops a drawing tearing.** The trace cuts one drawn
       shape into several rectangles wherever its vertical extent changes — an L
       is two, a stepped block three — and two pieces of one shape on two belts do
       not drift apart, they come open. A hairline is a rendering artefact; this
       is not. It opens to a full canvas width and closes again, once a lap, for
       as long as the page is open. */
    const carrier = new Map();
    for (const band of bands) {
      for (const bar of band.bars) carrier.set(bar.join(), band.index);
    }

    for (const a of pattern.bars) {
      for (const b of pattern.bars) {
        if (a === b || !touching(a, b)) continue;
        assert.equal(
          carrier.get(a.join()),
          carrier.get(b.join()),
          `[${a}] touches [${b}] and they are on different belts`,
        );
      }
    }

    /* Not vacuous: each drawing really does have edges to share. Counted once per
       pair rather than once per ordering — `touching` is symmetric, so the naive
       double loop reports twice what it means. */
    let pairs = 0;
    pattern.bars.forEach((a, at) => {
      for (const b of pattern.bars.slice(at + 1)) if (touching(a, b)) pairs += 1;
    });
    assert.equal(pairs, adjacencies);
  });

  test(`${name}: some go left and some go right`, () => {
    const left = bands
      .filter((band) => band.direction === -1)
      .reduce((n, band) => n + band.bars.length, 0);
    const right = count - left;

    /* Counted in BARS rather than in bands, and as a share rather than a
       threshold: these drawings run from 40 bars to 355, and one of them has a
       band holding 59 while another holds 1, so an even count of bands says
       nothing at all about what the page looks like. */
    const minority = Math.min(left, right) / count;
    assert.ok(
      minority > 0.3,
      `${name} sends only ${(minority * 100).toFixed(0)}% of its bars one way (${left} left, ${right} right)`,
    );

    /* And the alternation itself, so a band cannot drift out of step with the one
       above it without failing here. */
    for (const band of bands) {
      assert.equal(band.direction, band.index % 2 === 0 ? -1 : 1);
    }
  });

  test(`${name}: the lap has no seam`, () => {
    /* The whole trick. Each band is drawn twice, one canvas width apart on the
       side it is travelling FROM, and then slides by exactly that width — so the
       frame it restarts on is identical to the frame before it.

       Both halves are load-bearing and neither is visible in a still: an offset
       of the wrong magnitude leaves a gap that opens once a lap, and one on the
       wrong side means the copy chases the band off screen instead of arriving. */
    for (const band of bands) {
      const offset = trailingOffset(band.direction, pattern.width);
      assert.equal(Math.abs(offset), pattern.width);
      assert.equal(Math.sign(offset), -band.direction);
    }
  });

  test(`${name}: no two bands keep the same time`, () => {
    /* Every band starts at zero so that first paint is the traced artwork
       exactly. What separates them afterwards is only that no two take the same
       time over a lap — if the hash degenerated they would shear as one piece for
       good, and the drawing would read as a single sliding sheet. */
    const laps = new Set(bands.map((band) => band.duration.toFixed(2)));
    assert.equal(laps.size, bands.length, `only ${laps.size} distinct lap times`);

    for (const band of bands) {
      assert.ok(band.duration >= DRIFT_QUICK && band.duration <= DRIFT_SLOW);
    }
  });

  test(`${name}: a band is one path, and the path is still the trace`, () => {
    /* **What closed the pale lines the owner saw**, with the trace keeping its
       one-pixel slivers. Two `<rect>` elements sharing an edge are rasterised
       separately, the shared boundary lands on a fraction of a pixel — 1447
       units drawn at about 480, so nearly every edge does — and the two partial
       coverages composite to less than one. Measured on Branding: 572 pale
       pixels as rects, 9 as one path per band.

       The reason it is safe is that it changes no geometry, so the path is read
       back and compared with the bars it was built from. Nudging, overlapping or
       snapping would also have hidden the seams, and would have moved the art. */
    for (const band of bands) {
      const back = [
        ...barsPath(band.bars).matchAll(/M(-?\d+) (-?\d+)h(-?\d+)v(-?\d+)h(-?\d+)z/g),
      ].map((m) => [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])]);

      assert.deepEqual(back, band.bars.map((bar) => [...bar]));
    }
  });
}

test("the drawings differ — this is five traces, not one copied five times", () => {
  /* The owner's instruction in one assertion: the same movement everywhere, each
     page keeping its OWN pattern. Copying Branding's bars into the other four
     would satisfy every test above and be exactly the thing he said not to do. */
  const drawings = PATTERNS.map(({ pattern }) => JSON.stringify(pattern.bars));
  assert.equal(new Set(drawings).size, PATTERNS.length);
});

test("no hero is masked by a PNG any more", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  /* All five drawings are elements now, so nothing is cut out of a flat block.
     A mask left behind would cut the drawing underneath it to some OTHER page's
     geometry, which is a failure that looks like a design decision. */
  for (const png of [
    "ai-automation-pattern",
    "ux-ui-branding-pattern",
    "crm-solutions-pattern-v5",
    "custom-software-pattern-v5",
    "web-platforms-apps-pattern-v6",
  ]) {
    assert.doesNotMatch(css, new RegExp(`mask-image:[^;]*${png}`));
  }

  /* **And the base rule paints nothing at all now.** It used to carry a flat
     `background` and the AI page's mask, which every variant then had to undo —
     `--lines` and `--drawn` had been undoing it since the Blog and Case Studies
     started drawing their own bars. A base that does not paint has nothing to
     undo, and that is asserted rather than left to drift back. */
  const base = css.slice(css.indexOf(".service-hero__pattern {"));
  const rule = base.slice(0, base.indexOf("}"));
  assert.doesNotMatch(rule, /background/);
  assert.doesNotMatch(rule, /mask/);
  assert.match(rule, /aspect-ratio:\s*1447 \/ 1087/);
});

test("each hero keeps the colour its homepage card gave it", () => {
  /* **Owner, 2026-08-26, with the Different section on screen: take the stronger
     colour from each card, not the pale background.** This test derived each
     hero's fill from the homepage box for its service, so the two could not
     drift apart. The boxes left the homepage on 2026-10-05 ("delete also thi
     section"); the heroes keep the colours they were given, and those are what
     is pinned now — five services, five tints, none shared. */
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const HERO = {
    branding: "--tint-red-bar",
    websites: "--tint-butter-bar",
    software: "--tint-mint-bar",
    "crm-solution": "--tint-sky-bar",
    "ai-automation": "--tint-clay-bar",
  };
  const fills = new Set();
  for (const [page, tint] of Object.entries(HERO)) {
    const rule = css.indexOf(`.service-hero__pattern--${page} .service-hero__bars {`);
    assert.ok(rule > 0, `${page} names no fill`);
    const hero = css.slice(rule, css.indexOf("}", rule)).match(/fill:\s*var\((--[\w-]+)\)/);
    assert.ok(hero, `${page} has a rule but sets no fill`);
    assert.equal(hero[1], tint, `${page}'s hero is ${hero[1]}, not ${tint}`);
    fills.add(hero[1]);
  }

  /* Five services, five colours. Two pages on one tint is the bug that put
     AI & Automation in Branding's lilac on the homepage in the first place. */
  assert.equal(fills.size, 5);

  /* The fallback outlives the page that needed it: AI & Automation used to take
     `--accent` from the base rule, by being the drawing that rule masked with. It
     has a modifier of its own now, so nothing reaches this — kept for a hero that
     arrives without a tint, and asserted so it cannot quietly become a colour. */
  const fallback = css.slice(css.indexOf(".service-hero__bars {"));
  assert.match(fallback.slice(0, fallback.indexOf("}")), /fill:\s*var\(--accent\)/);
});

test("the same band travels the same way on every render", () => {
  /* No `Math.random`: two renders of a page have to agree, and the markup carries
     the speed as an attribute, so a server and a browser that disagreed would be
     a hydration mismatch rather than a wobble. */
  assert.equal(driftHash(7), driftHash(7));
  assert.deepEqual(bandsOf(brandingPattern.bars), bandsOf(brandingPattern.bars));

  /* Read with the prose stripped out. The first version of this caught the
     sentence in `pattern-drift.ts` that says it does not use `Math.random`,
     which is a test of the comment rather than of the code. */
  const code = readFileSync(
    new URL("../lib/pattern-drift.ts", import.meta.url),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /Math\.sin/);
  assert.doesNotMatch(code, /Math\.random/);
});

test("the drawing does not depend on the script that moves it", () => {
  const drawn = readFileSync(
    new URL("../components/services/ServiceHeroBars.tsx", import.meta.url),
    "utf8",
  );
  const drift = readFileSync(
    new URL("../components/services/PatternDrift.tsx", import.meta.url),
    "utf8",
  );

  /* The artwork is server-rendered and the motion is a separate client component,
     so every hero is drawn with scripting off, before hydration, and for a reader
     who has asked for no motion. Making the SVG a client component would take all
     three away and nothing on any page would look different. */
  assert.doesNotMatch(drawn, /"use client"/);
  assert.match(drift, /"use client"/);
  assert.match(drift, /prefers-reduced-motion:\s*reduce/);

  /* It bails before touching anything, rather than building the tweens and
     leaving them paused. */
  const guard = drift.indexOf("prefers-reduced-motion");
  assert.ok(guard > 0 && guard < drift.indexOf("gsap.fromTo"));

  /* `ease: "none"` is not a preference. Any easing makes a band slow into its own
     restart, which is a stutter once a lap on a loop that is otherwise seamless. */
  assert.match(drift, /ease:\s*"none"/);
  assert.match(drift, /repeat:\s*-1/);
});

test("the band height still lands on these drawings", () => {
  /* 68 is a constant that looks arbitrary and is not. It has to give every one of
     the five enough bands to counter-flow without cutting the sparse ones into
     belts of one bar each — and they run from 40 bars to 355, so a height that
     suits the densest is not automatically right for the rest. */
  assert.equal(DRIFT_BAND, 68);

  for (const { name, pattern } of PATTERNS) {
    const bands = bandsOf(pattern.bars);
    assert.ok(bands.length >= 14, `${name} splits into only ${bands.length} bands`);
    assert.ok(bands.length <= 17, `${name} splits into ${bands.length} bands`);
  }
});
