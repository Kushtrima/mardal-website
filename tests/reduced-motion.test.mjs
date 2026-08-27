import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * The one guarantee no assertion on rendered HTML can make.
 *
 * A service card's resting state is `visibility: hidden` — the markup carries all
 * twelve and the stylesheet shows one. Something has to reveal the rest, and for a
 * long time the only thing that did on a wide window was the desktop run, which
 * `ServiceOfferingsScroll` refuses to build for a reader who has asked for no
 * motion. The result was a reduced-motion visitor on a laptop reading one card of
 * twelve, with the other eleven out of the accessibility tree as well.
 *
 * The rendered HTML was complete the whole time, so every existing assertion
 * passed. This reads the stylesheet instead, because that is where the guarantee
 * actually lives.
 */

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const SCROLL = readFileSync(
  new URL("../components/services/ServiceOfferingsScroll.tsx", import.meta.url),
  "utf8",
);

/** Top-level `@media` blocks, as { condition, body }. */
function mediaBlocks(css) {
  const blocks = [];
  let depth = 0;
  let current = null;

  for (const line of css.split("\n")) {
    const trimmed = line.trim();

    if (depth === 0 && trimmed.startsWith("@media")) {
      current = {
        condition: trimmed.replace(/^@media\s*/, "").replace(/\s*\{\s*$/, ""),
        body: [],
      };
    } else if (current) {
      current.body.push(line);
    }

    depth += (line.match(/\{/g) ?? []).length;
    depth -= (line.match(/\}/g) ?? []).length;

    if (depth === 0 && current) {
      current.body = current.body.join("\n");
      blocks.push(current);
      current = null;
    }
  }

  return blocks;
}

/** The rule body for a selector inside a chunk of CSS. */
function ruleFor(css, selector) {
  const at = css.indexOf(`\n${selector} {`) >= 0
    ? css.indexOf(`\n${selector} {`)
    : css.indexOf(`  ${selector} {`);
  if (at < 0) return null;
  const open = css.indexOf("{", at);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

test("a card's resting state is hidden, which is what makes the reveal load-bearing", () => {
  /* If this ever stops being true the test below is measuring nothing, so it is
     asserted rather than assumed. */
  const blocks = mediaBlocks(CSS);
  const outsideQueries = blocks.reduce(
    (css, block) => css.replace(block.body, ""),
    CSS,
  );
  const resting = ruleFor(outsideQueries, ".service-card");
  assert.ok(resting, ".service-card has no unconditional rule");
  assert.match(resting, /visibility:\s*hidden/);
  assert.match(resting, /opacity:\s*0/);
});

test("the cards are revealed for reduced motion, not for narrow windows alone", () => {
  const revealing = mediaBlocks(CSS).filter((block) => {
    const rule = ruleFor(block.body, ".service-card");
    return rule && /visibility:\s*visible/.test(rule);
  });

  assert.equal(
    revealing.length,
    1,
    `expected exactly one query to reveal the cards, found ${revealing.length}`,
  );

  /* The whole finding, in one assertion: written as a width alone, "there is no
     run" meant "the window is narrow", and a reduced-motion reader on a wide one
     was left with the hidden resting state. */
  assert.match(
    revealing[0].condition,
    /prefers-reduced-motion:\s*reduce/,
    `the query that reveals the service cards is "${revealing[0].condition}" — a reader who has asked for no motion is not covered by it`,
  );
});

test("the stylesheet's condition and the script's are exact complements", () => {
  /* ★ The pairing is the invariant, and since 2026-08-27 it is exact.

     The script builds the run for `no-preference`; the stylesheet un-stacks for
     `reduce`. A card rests at `opacity: 0; visibility: hidden`, so a reader
     claimed by NEITHER sees one card of twelve with the rest gone from the
     accessibility tree too. That has happened here twice.

     It used to be a width pair — `min-width: 64.0625rem` in the script against
     `max-width: 64rem` in the stylesheet — and lib/breakpoints.ts documents why
     that shape cannot be made exact: 64.0625rem is 1025px, so 1024.5, which
     browser zoom and fractional device pixel ratios produce routinely, matched
     neither. A hole one pixel wide with a card hidden inside it.

     The owner asking for the journey on a phone removed the reason for a width
     at all. `reduce` and `no-preference` are the only two states of one feature,
     so the pair is now exhaustive by construction. What this test guards is that
     nobody reintroduces arithmetic that cannot be exact. */
  assert.match(SCROLL, /prefers-reduced-motion:\s*no-preference/);
  assert.match(SCROLL, /prefers-reduced-motion:\s*reduce/);

  const revealing = mediaBlocks(CSS).find((block) => {
    const rule = ruleFor(block.body, ".service-card");
    return rule && /visibility:\s*visible/.test(rule);
  });

  assert.ok(revealing, "nothing reveals the service cards");
  assert.equal(
    revealing.condition.replace(/\s+/g, " ").trim(),
    "(prefers-reduced-motion: reduce)",
    `the query that reveals the service cards is "${revealing.condition}" — anything beyond the motion feature makes the pair inexact again`,
  );

  /* And no width survives on the script's side either. The queries it hands to
     `matchMedia`/`media.add` are the whole of how it decides; a width in one of
     them is the 1024.5px hole coming back. */
  const queries = [...SCROLL.matchAll(/"\(([^"]*)\)"/g)].map((m) => m[1]);
  const widthQueries = queries.filter((q) => /width:/.test(q));
  assert.deepEqual(
    widthQueries,
    [],
    `ServiceOfferingsScroll decides on width again (${widthQueries.join("; ")}) — the run and the flow can no longer be proven to cover every reader`,
  );
});

test("the un-stacked journey is not left clipped by the held stage", () => {
  /* Revealing a card inside `height: 100svh; overflow: hidden` shows nothing —
     the container has to come back into flow with it. Asserted because the reveal
     and the container are two rules that have to move together. */
  const revealing = mediaBlocks(CSS).find((block) => {
    const rule = ruleFor(block.body, ".service-card");
    return rule && /visibility:\s*visible/.test(rule);
  });

  const journey = ruleFor(revealing.body, ".service-journey");
  assert.ok(journey, "the reveal query does not un-stack .service-journey");
  assert.match(journey, /height:\s*auto/);
  assert.match(journey, /overflow:\s*visible/);
});
