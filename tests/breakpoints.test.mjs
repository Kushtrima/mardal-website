import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { MOBILE_MENU } from "../lib/breakpoints.ts";

/**
 * One fact, written in two languages, held equal.
 *
 * Whether the mobile menu is the navigation is decided by a media query in
 * `globals.css`. Two pieces of JavaScript need the same answer: `SiteHeader`, to
 * drop the menu's state and its scroll lock when the menu goes away, and
 * `SmoothScroll`, because the smoother must never run under a `position: fixed`
 * panel it would pin to the page instead of the screen.
 *
 * All three used to say it themselves and all three disagreed — 64rem in the
 * stylesheet, 70.0625rem in the header, 48rem in the smoother. Every gap between
 * them was a trap a reader could not get out of. CSS cannot export a query, so
 * one copy is unavoidable; this file is what keeps that copy honest.
 */

const ROOT = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, ROOT), "utf8");

const CSS = read("app/globals.css");
const HEADER = read("components/layout/SiteHeader.tsx");
const SMOOTH = read("components/motion/SmoothScroll.tsx");

/**
 * Source with its comments removed.
 *
 * Both files carry the old numbers in prose deliberately — a comment saying what
 * 70.0625rem cost is the record of why this file exists, and an assertion that
 * forbade the string outright would delete that history to protect against it.
 * These checks are about what the code does, so they read what the code is.
 */
const code = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/**
 * The condition of the top-level `@media` block that holds the phone's bar.
 *
 * It was the block that put the menu on screen — fixed sheet, visible toggle —
 * until 2026-10-03, when the burger and its sheet became the menu at every
 * width. The line is still the same line: on one side of it the sheet's two
 * halves take turns and the bar is set tight, on the other the halves stand
 * side by side (`.mobile-menu--wide`, which the header sets from this same
 * constant).
 */
function menuQuery() {
  let depth = 0;
  let condition = null;
  let body = [];

  for (const line of CSS.split("\n")) {
    const trimmed = line.trim();
    if (depth === 0 && trimmed.startsWith("@media")) {
      condition = trimmed.replace(/^@media\s*/, "").replace(/\s*\{\s*$/, "");
      body = [];
    } else if (condition) {
      body.push(line);
    }

    depth += (line.match(/\{/g) ?? []).length;
    depth -= (line.match(/\}/g) ?? []).length;

    if (depth === 0 && condition) {
      const text = body.join("\n");
      if (/\.site-nav\s*\{[^}]*padding:/.test(text)) {
        return condition;
      }
      condition = null;
    }
  }

  return null;
}

test("the shared constant is the stylesheet's query, character for character", () => {
  const css = menuQuery();
  assert.ok(
    css,
    "no @media block sets the phone's bar — the stylesheet's own definition has moved",
  );
  assert.equal(
    MOBILE_MENU,
    css,
    `lib/breakpoints.ts says "${MOBILE_MENU}" and globals.css says "${css}" — the copy has drifted, which is the bug this file exists for`,
  );
});

test("the query keeps both of its clauses", () => {
  /* Width alone is half the definition. The stylesheet also hands over on
     `hover: none`, which is every tablet at every size — and a guard that asked
     about width only force-closed the menu when an iPad was rotated, on a device
     where that menu is the only navigation there is. */
  assert.match(MOBILE_MENU, /max-width:\s*64rem/);
  assert.match(MOBILE_MENU, /hover:\s*none/);
});

test("nobody spells the boundary a second time", () => {
  /* The header said 70.0625rem — 1121px, a number that appears nowhere in the
     stylesheet — and the smoother said 48rem. Both were stale copies of a
     boundary that had moved. */
  for (const [name, source] of [
    ["SiteHeader", HEADER],
    ["SmoothScroll", SMOOTH],
  ]) {
    const body = code(source);
    assert.match(body, /MOBILE_MENU/, `${name} does not read the shared query`);
    assert.doesNotMatch(
      body,
      /matchMedia\(\s*"\(min-width/,
      `${name} has gone back to asking a width question of its own`,
    );
    assert.doesNotMatch(body, /70\.0625rem/, `${name} still names 1121px in code`);
  }
});

test("both consumers answer changes rather than deciding once", () => {
  /* Deciding on mount leaves whichever answer was true at load standing for the
     whole visit: a window widened past the boundary keeps a scroll lock nothing
     visible can release, and one narrowed keeps a smoother under a menu it
     breaks. */
  for (const [name, source] of [
    ["SiteHeader", HEADER],
    ["SmoothScroll", SMOOTH],
  ]) {
    assert.match(source, /addEventListener\("change"/, `${name} does not subscribe`);
    assert.match(
      source,
      /removeEventListener\("change"/,
      `${name} does not unsubscribe`,
    );
  }
});

test("the smoother is killed rather than only dropped when the menu appears", () => {
  /* `kill()` puts the transform back and hands the scroll to the browser. Without
     it the page stays at whatever offset the smoother had written, which nothing
     then owns. */
  assert.match(SMOOTH, /smoother\.kill\(\)/);
});

/**
 * **The clients grid: the page's four columns, rows of two and of one —
 * owner, 2026-10-08**: "i want the project to have three format Box, wide and
 * portrat and to be mixed", "the images need to start always from the
 * [vertical] line", and "max 2 project in one row sometimes 1". It was two
 * equal columns at every width (2026-08-25), which this test held. What it
 * holds now: one top-level rule, four columns with no gap between them (so
 * every picture starts on a line), never `auto-fit`, the spans and starting
 * lines a row is made of, and the phone's two columns inside the phone query.
 */
test("the clients grid is the page's four columns, in rows of two and of one", () => {
  const stripped = code(CSS);

  const rules = [...stripped.matchAll(/\n\.clients-grid\s*\{([^}]*)\}/g)].map(
    (match) => match[1],
  );
  assert.equal(rules.length, 1, "the clients grid is styled in more than one place");
  assert.match(rules[0], /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(rules[0], /gap:[^;]*\s0;/);
  assert.doesNotMatch(rules[0], /auto-fit|auto-fill/);

  for (const span of [2, 3]) {
    assert.match(
      stripped,
      new RegExp(`\\.clients-grid > \\[data-span="${span}"\\] \\{\\s*grid-column-end: span ${span};`),
      `no rule spans ${span} columns`,
    );
  }
  for (const start of [1, 2]) {
    assert.match(
      stripped,
      new RegExp(`\\.clients-grid > \\[data-start="${start}"\\] \\{\\s*grid-column-start: ${start};`),
      `no rule starts a picture on line ${start}`,
    );
  }

  /* The phone's halves and wholes, in the phone query. */
  const phone = stripped.match(/@media \(max-width: 40rem\) \{\s*\.clients-grid \{[\s\S]*?\n\}/)?.[0];
  assert.ok(phone, "a phone does not rearrange the clients rows");
  assert.match(phone, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(phone, /grid-column-end: span 1;/);
  assert.match(phone, /grid-column: 1 \/ -1;/);
});

test("every width the stylesheet changes at is a step of the page's scale", () => {
  /* The responsive pass, 2026-10-06: a layout changes at a few widths, the
     same everywhere (lib/breakpoints.ts). A step's complement — a sixteenth
     of a rem past it — is the same line seen from the other side. */
  const SCALE = [24, 30, 40, 48, 64, 75];
  const allowed = new Set(SCALE.flatMap((step) => [step, step + 0.0625, step - 0.0625]));
  const widths = [...code(CSS).matchAll(/@media[^{]*?\((?:max|min)-width:\s*([\d.]+)rem\)/g)].map((m) => Number(m[1]));
  assert.ok(widths.length > 20, "the stylesheet's widths were not found");
  const strays = [...new Set(widths.filter((width) => !allowed.has(width)))];
  assert.deepEqual(strays, [], `widths off the scale: ${strays.map((w) => w + "rem").join(", ")}`);
});
