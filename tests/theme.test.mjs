import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";

/**
 * The site has one page, and it is light.
 *
 * Owner, 2026-10-03: "delete dark mode we dont need it delete it all". Until
 * then every colour token carried a light and a dark half, a switch in the menu
 * turned the page over and a script in the head remembered the choice. All of
 * it is gone, and this file is what keeps it gone: the dark page is the kind of
 * thing that comes back one `light-dark()` at a time, from an old snippet or a
 * habit, and each piece of it would still build and still pass.
 *
 * The ground was the owner's grey #e1e1df the same day, and is white since
 * 2026-10-05: "make bacrgound of al website white not grey globally".
 */

const ROOT = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, ROOT), "utf8");
const CSS = read("app/globals.css");
const LAYOUT = read("app/layout.tsx");

/* Code only: the stylesheet's notes still tell the history of the dark page,
   and a note about it is not the thing itself. */
const code = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const CSS_CODE = code(CSS);

/** Every rule with this exact selector, joined. */
function rule(selector) {
  const bodies = [];
  const needle = `\n${selector} {`;
  for (let at = CSS.indexOf(needle); at !== -1; at = CSS.indexOf(needle, at + 1)) {
    bodies.push(CSS.slice(at, CSS.indexOf("}", at)));
  }
  assert.notEqual(bodies.length, 0, `there is no \`${selector}\` rule`);
  return bodies.join("\n");
}

/** Every source file under a folder, as [path, code]. */
function sources(dir) {
  const out = [];
  for (const name of readdirSync(new URL(dir, ROOT))) {
    const path = `${dir}/${name}`;
    if (statSync(new URL(path, ROOT)).isDirectory()) out.push(...sources(path));
    else if (/\.(tsx?|mjs|css)$/.test(name)) out.push([path, code(read(path))]);
  }
  return out;
}

test("the page is light, and only light", () => {
  assert.match(rule(":root"), /color-scheme:\s*light\s*;/);
  assert.doesNotMatch(CSS_CODE, /color-scheme:\s*dark/);
  assert.doesNotMatch(CSS_CODE, /light-dark\(/, "a colour has a dark half again");
  assert.doesNotMatch(CSS_CODE, /data-theme/, "a rule answers to a theme again");
  assert.doesNotMatch(CSS_CODE, /prefers-color-scheme/, "the page follows the OS again");
  assert.doesNotMatch(CSS_CODE, /theme-toggle/, "the switch has styles again");
});

test("the ground is white", () => {
  assert.match(rule(":root"), /--canvas:\s*#ffffff\s*;/);
});

test("the four values that are not colours are the light page's", () => {
  const root = rule(":root");
  assert.match(root, /--logo-filter:\s*brightness\(0\)\s*;/);
  assert.match(root, /--panel-shadow:\s*var\(--shadow-soft\)/);
  assert.match(root, /--font-smoothing:\s*auto/);
});

test("nothing chooses a theme any more", () => {
  assert.ok(
    !existsSync(new URL("components/layout/ThemeToggle.tsx", ROOT)),
    "the switch is back",
  );
  assert.doesNotMatch(code(LAYOUT), /mardal-theme|dataset\.theme|localStorage/);
  for (const [path, body] of [...sources("app"), ...sources("components"), ...sources("lib")]) {
    assert.doesNotMatch(body, /ThemeToggle|mardal-theme|dataset\.theme/, `${path} chooses a theme`);
  }
});

/* The footer panel's colours do not turn over with the page: a fixed pair named
   on the panel, black with white ink since 2026-08-27.

   **What is asserted is that the two things which must agree do agree.**
   Everything on the panel — the closing line, the link columns, the social
   marks — reads `--accent-contrast` by inheritance and follows it for free. The
   wordmark cannot: it is a raster, so it is crushed to a silhouette with a
   filter, and that filter is a second place the colour is written down.

   The failure this catches is quiet rather than loud. A mark left `brightness(0)`
   on a white-inked panel still draws — it is simply the one black thing on a
   panel where everything else is white, which reads as a logo that was forgotten
   rather than as a bug.

   The mark was briefly not a raster at all: one pass on 2026-08-27 set the name
   as type at the size of the panel and made that the home link, which retired
   the filter and this pairing with it. The owner asked for the icon back, so
   both are load-bearing again. */
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
  const panel = rule(".site-footer__slab");
  const slab = panel.match(/--accent:\s*(#[0-9a-f]{6})/i)?.[1];
  const ink = panel.match(/--accent-contrast:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(slab && ink, "the footer slab does not name both of its colours");

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
