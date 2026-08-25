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

/* **The card name leads, and it is not set in the display face.**
 *
 * Both halves are stylesheet facts that no assertion on markup can see, and
 * both are things a reader would call wrong on sight.
 *
 * It shared the values' 18-20px for a build — name, location and industry all
 * set identically, three plain lines — and the owner asked for the name to
 * lead. The pull from there is to reach for `--type-title`, which is what
 * "bigger and more important" means everywhere else on this site. Here it would
 * put eight card names in the same face as the rail's heading standing beside
 * them, which runs to 76px: the cards would be competing with the thing that
 * indexes them.
 */
test("the client card's name leads without borrowing the display face", () => {
  /* Every rule the name is named in, not just the one that carries its size.
     Its face is set in a grouped rule shared with the value under it — reading
     only the standalone rule found no `font-family` at all and reported the
     name as unfaced. */
  const named = ALL.filter((rule) =>
    rule.selector
      .split(",")
      .some((part) => part.trim() === ".clients-card__name"),
  );
  assert.ok(named.length > 0, "the card name has no rule of its own");

  const declared = named.map((rule) => rule.body).join("\n");
  assert.doesNotMatch(declared, /var\(--type-title\)/);
  assert.match(declared, /font-family: var\(--type-body\)/);

  /* Bigger than the value under it. Compared rather than pinned to a number, so
     tuning either size stays free as long as the order holds. */
  /* One level of token indirection resolved, because a size set as
     `var(--text-copy)` is still a size — reading only literal clamps reported
     the card's facts as unsized the moment they moved onto the site's own copy
     token. */
  const floor = (sel) => {
    const rule = ALL.find((r) => r.selector === sel);
    let value = rule?.body.match(/font-size:\s*([^;]+);/)?.[1]?.trim();
    assert.ok(value, `${sel} sets no font-size`);

    const token = value.match(/^var\((--[a-z0-9-]+)\)$/);
    if (token) {
      value = CSS.match(new RegExp(`${token[1]}:\\s*([^;]+);`))?.[1]?.trim();
      assert.ok(value, `${token[1]} is not defined`);
    }

    /* A clamp's floor, or a flat size. The label is the one thing on this card
       set to a single value — it is below the site's smallest token and does
       not scale — so a helper that only understood clamps could not read it. */
    const clamped = value.match(/clamp\(\s*([\d.]+)(px|rem)/);
    const flat = value.match(/^([\d.]+)(px|rem)$/);
    const size = clamped ?? flat;
    assert.ok(size, `${sel} is sized in a way this cannot read: ${value}`);
    return Number(size[1]) * (size[2] === "rem" ? 16 : 1);
  };
  /* The whole hierarchy, as an ordering. Three sizes went up and down this card
     across a day — the name shared the values' size, then the values were taken
     smaller when it was the LABEL that was meant — so what is held is the order
     rather than any of the numbers. */
  const name = floor(".clients-card__name");
  const value = floor(".clients-card__fact dd");
  const label = floor(".clients-card__fact dt");

  assert.ok(name > value, "the card name is no larger than the facts under it");
  assert.ok(value > label, "the fact's label is no smaller than its value");
});
