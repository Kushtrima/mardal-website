import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * Which page a visitor arrives on.
 *
 * **This has no trace in rendered HTML at all.** Nothing is written on `<html>`
 * for a first-time visitor — that is the point of the arrangement, since a page
 * that needs a script to decide its own colour flashes the other one first. The
 * whole decision is one CSS property, and one property is exactly the kind of
 * thing an unrelated edit moves without anyone seeing it: the site would still
 * build, still pass every other test, and still look right to whoever changed
 * it, as long as their own machine happened to be set the way the old default
 * assumed.
 */

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const LAYOUT = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

/** Every rule with this exact selector, joined.
 *
 *  All of them, not the first: `:root` is written twice on purpose — the
 *  palette at the top of the file and the four non-colour values near the
 *  bottom — and they cascade into one element. Reading only the first found the
 *  palette and reported the other four missing. */
function rule(selector) {
  const bodies = [];
  const needle = `\n${selector} {`;
  for (let at = CSS.indexOf(needle); at !== -1; at = CSS.indexOf(needle, at + 1)) {
    bodies.push(CSS.slice(at, CSS.indexOf("}", at)));
  }
  assert.notEqual(bodies.length, 0, `there is no \`${selector}\` rule`);
  return bodies.join("\n");
}

/* Owner's call, 2026-08-25: the page arrives white. `light dark` is what it read
   before, and the two words are the whole difference — with both, every
   `light-dark()` token in the file resolves off the visitor's operating system,
   so half of them met a black site. */
test("the page is white before anyone chooses", () => {
  assert.match(rule(":root"), /color-scheme:\s*light\s*;/);
  assert.doesNotMatch(rule(":root"), /color-scheme:\s*light\s+dark/);
});

/* And the dark page is still there, still reachable, still one property away.
   Flipping the default must not become deleting the theme. */
test("the toggle still turns the whole page over", () => {
  assert.match(rule(':root[data-theme="dark"]'), /color-scheme:\s*dark\s*;/);
  assert.match(rule(':root[data-theme="light"]'), /color-scheme:\s*light\s*;/);

  /* The palette is built on light-dark(), so both halves of every colour are
     still authored. If this ever falls to zero the toggle has nothing to turn. */
  assert.ok(
    (CSS.match(/light-dark\(/g) ?? []).length > 20,
    "the palette has stopped carrying both themes",
  );
});

/* The four values that are not colours, so `light-dark()` cannot carry them.
   They used to be written dark-on-:root with the light pair duplicated into a
   `prefers-color-scheme` block AND the toggle's rule — three copies of two
   states, with a comment asking whoever edited one to remember the others.
   Flipping the default let the base hold light and the toggle hold dark, once
   each, and took the file's only colour-scheme query with it. */
test("what is not a colour turns over too, and is written once", () => {
  const light = rule(":root");
  const dark = rule(':root[data-theme="dark"]');

  assert.match(light, /--logo-filter:\s*brightness\(0\)\s*;/);
  assert.match(light, /--panel-shadow:\s*var\(--shadow-soft\)/);
  assert.match(light, /--font-smoothing:\s*auto/);

  assert.match(dark, /--logo-filter:\s*brightness\(0\) invert\(1\)/);
  assert.match(dark, /--panel-shadow:\s*none/);
  assert.match(dark, /--font-smoothing:\s*antialiased/);

  /* No colour-scheme media query, in either direction. The palette never had
     one; these four were the only reason the file did. */
  assert.doesNotMatch(CSS, /@media[^{]*prefers-color-scheme/);
});

/* The script in the head writes a REMEMBERED choice and nothing else. If it ever
   starts reading `matchMedia("(prefers-color-scheme: …)")` the operating system
   is back in charge of the default and the line above is decorative. */
test("nothing but a remembered choice reaches the root element", () => {
  assert.match(LAYOUT, /localStorage\.getItem\("mardal-theme"\)/);
  assert.match(LAYOUT, /t==="light"\|\|t==="dark"/);
  assert.doesNotMatch(LAYOUT, /prefers-color-scheme/);
});

/* The footer slab is the one thing on the site that does not turn over with the
   page: a fixed lavender in both themes, with its ink named beside it. Owner
   turned that ink white on 2026-08-25 and the slab stayed as it was.

   **What is asserted is that the two things which must agree do agree.**
   Everything on the panel — the words, the link columns, the social marks, the
   bar field — reads `--accent-contrast` by inheritance and follows it for free.
   The wordmark cannot: it is a raster, so it is crushed to a silhouette with a
   filter, and that filter is a second place the colour is written down.

   The failure this catches is quiet rather than loud. A mark left `brightness(0)`
   on a white-inked panel still draws — it is simply the one black thing on a
   panel where everything else is white, which reads as a logo that was forgotten
   rather than as a bug. */
test("the footer wordmark is the same colour as the rest of the footer", () => {
  const panel = rule(".site-footer__panel");
  const mark = rule(".site-footer__mark img");

  const white = /--accent-contrast:\s*#ffffff/.test(panel);
  const black = /--accent-contrast:\s*#000000/.test(panel);
  assert.ok(white || black, "the footer panel names no ink");

  /* invert(1) after brightness(0) is what turns the silhouette white. */
  assert.equal(
    /filter:\s*brightness\(0\) invert\(1\)/.test(mark),
    white,
    white
      ? "the footer ink is white and the wordmark is still crushed to black"
      : "the footer ink is black and the wordmark is being inverted to white",
  );
});

/* ⚠ Not an assertion — a record, and deliberately not a failure.
   White on the footer's #a98ad6 is 2.88:1, which meets neither AA threshold
   (4.5:1 body, 3:1 large). The owner asked for the ink to go white and the slab
   to stay, and that is his call to make; what is not acceptable is it being
   forgotten. So the number is computed here from the two values actually in the
   stylesheet rather than written into a comment that can drift away from them,
   and it is printed on every run. */
test("the footer's contrast is what it is, and it is said out loud", () => {
  const panel = rule(".site-footer__panel");
  const slab = panel.match(/--accent:\s*(#[0-9a-f]{6})/i)?.[1];
  const ink = panel.match(/--accent-contrast:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(slab && ink, "the footer panel does not name both of its colours");

  const channel = (c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map(
      (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
    );
    return (
      0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
    );
  };
  const a = luminance(slab);
  const b = luminance(ink);
  const contrast =
    (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  console.log(
    `    footer: ${ink} on ${slab} is ${contrast.toFixed(2)}:1` +
      (contrast >= 4.5
        ? " — meets AA"
        : contrast >= 3
          ? " — large text only, fails AA for body"
          : " — FAILS AA at both thresholds"),
  );

  /* The one thing that would be a mistake rather than a decision: the two
     colours being the same, or near enough that the panel reads as blank. */
  assert.ok(contrast > 1.5, "the footer ink has disappeared into its slab");
});
