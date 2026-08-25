import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * How the display face is fitted, held in one place.
 *
 * **Owner's call, 2026-08-25, in three steps.** Every heading in `--type-title`
 * was on `--tracking-tight` at -0.055em; that was too tight, `normal` was too
 * loose, and the answer is a token of its own at -0.02em. Twenty-one rules read
 * it now, which is the point of it: the next adjustment is one number rather
 * than twenty-one.
 *
 * What makes this worth a test is the shape of the mistake that undoes it — not
 * someone deciding against the value, but someone adding a NEW heading and
 * reaching for `--tracking-tight`, because that token is still there, still
 * named for tightening, and every other measurement on this site is a token.
 *
 * It is not deleted and must not be: four rules read it, all of them the sans.
 * Being em-based it bites in proportion to the type — at the hero's 120px it
 * pulled 6.6px out of every letter gap, and at the nav's size it pulls under
 * one. The decision was always about which face, not about the number.
 */

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

/** Every rule in the file as { selector, body }, media queries walked into. */
function rules(css) {
  const out = [];
  let i = 0;

  while (i < css.length) {
    if (css.startsWith("/*", i)) {
      i = css.indexOf("*/", i) + 2;
      continue;
    }
    if (" \t\n".includes(css[i])) {
      i += 1;
      continue;
    }

    let j = i;
    while (j < css.length && css[j] !== "{" && css[j] !== ";") j += 1;
    if (j >= css.length) break;

    const selector = css.slice(i, j).trim();
    if (css[j] === ";") {
      i = j + 1;
      continue;
    }

    let depth = 0;
    let k = j;
    for (; k < css.length; k += 1) {
      if (css[k] === "{") depth += 1;
      else if (css[k] === "}" && (depth -= 1) === 0) break;
    }

    const body = css.slice(j + 1, k);
    if (selector.startsWith("@media")) out.push(...rules(body));
    else if (!selector.startsWith("@")) out.push({ selector, body });

    i = k + 1;
  }

  return out;
}

const ALL = rules(CSS);
const titleFace = ALL.filter((rule) =>
  rule.body.includes("font-family: var(--type-title)"),
);

test("the file parses into rules at all", () => {
  /* If the walker above ever returns nothing the two tests below pass in
     silence, which is the one way this file could lie. */
  assert.ok(ALL.length > 400, `only ${ALL.length} rules parsed`);
  assert.ok(titleFace.length > 15, `only ${titleFace.length} in the display face`);
});

test("the display face is fitted by one token, everywhere", () => {
  for (const rule of titleFace) {
    assert.doesNotMatch(
      rule.body,
      /letter-spacing:\s*var\(--tracking-tight\)/,
      `${rule.selector} puts --tracking-tight back on the display face`,
    );

    /* A rule that sets the face and says nothing about tracking inherits it,
       which is fine; what is not fine is a rule setting its own. That is how
       twenty-one values drift back out of one. */
    const spacing = rule.body.match(/letter-spacing:\s*([^;]+);/);
    if (!spacing) continue;
    assert.equal(
      spacing[1].trim(),
      "var(--tracking-display)",
      `${rule.selector} fits the display face its own way`,
    );
  }
});

/* And the token survives, because the sans still reads it. Deleting it would
   take the nav links and the service support line with it — a different face at
   a different size, where the same number does something else. */
test("the tight token is still there for the sans", () => {
  const readers = ALL.filter((rule) =>
    /letter-spacing:\s*var\(--tracking-tight\)/.test(rule.body),
  );
  assert.ok(readers.length > 0, "--tracking-tight is now dead and should be removed");
  for (const rule of readers) {
    assert.doesNotMatch(
      rule.body,
      /font-family: var\(--type-title\)/,
      `${rule.selector} is the display face`,
    );
  }
});
