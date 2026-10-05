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

/* The footer is the page's white with the page's ink since the owner's
   reference of 2026-10-05, and its wordmark — the letters without the ring,
   a vector drawn in black — needs no filter to agree with it. One that
   inverted it would draw white on white: nothing at all. */
test("the footer wordmark is the same colour as the rest of the footer", () => {
  const footer = rule(".site-footer");
  assert.match(footer, /background:\s*var\(--canvas\)/);
  assert.match(footer, /color:\s*var\(--ink\)/);
  assert.doesNotMatch(rule(".site-footer__brand img"), /filter/);
  const svg = readFileSync(new URL("public/SVG/logo-wordmark.svg", ROOT), "utf8");
  assert.match(svg, /\.fil0 \{fill:black\}/);
  assert.match(svg, /\.fil1 \{fill:black;/);
});

/* The pair's contrast, computed from the two values actually in the
   stylesheet rather than written into a comment that can drift from them. */
test("the footer's contrast is what it is, and it is said out loud", () => {
  const root = rule(":root");
  const ground = root.match(/--ink:\s*(#[0-9a-f]{6})/i)?.[1];
  const ink = root.match(/--canvas:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(ground && ink, "the footer's two colours are not named on :root");

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
  const a = luminance(ground);
  const b = luminance(ink);
  const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  console.log(`    footer: ${ink} on ${ground} is ${contrast.toFixed(2)}:1`);
  assert.ok(contrast >= 7, "the footer's ink does not meet AAA on its ground");
});
