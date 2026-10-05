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
test("the paragraph ramp is lifted, not tilted", () => {
  /* Owner, 2026-08-26, reading the site on a 16in laptop: paragraphs a little
     bigger. The two sizes below were identical until then and are not any more,
     which is what the split between them was for.

     **Asserted as a relationship, not as two numbers.** What must hold is that
     the paragraph ramp runs on the SAME slope as the label ramp above it — the
     comment on `--text-body` is explicit that the two must not drift apart as a
     window is resized, and the way that breaks is someone steepening one of them
     to reach a size at the top of the range. Both bases and both ceilings are
     free to move; the slope is not. */
  const read = (token) => {
    const value = CSS.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1];
    assert.ok(value, `${token} is not defined`);
    const m = value.match(
      /clamp\(\s*([\d.]+)px,\s*calc\(\s*([\d.]+)px\s*\+\s*([\d.]+)vw\s*\),\s*([\d.]+)px\s*\)/,
    );
    assert.ok(m, `${token} is not a floor/slope/ceiling ramp: ${value}`);
    return { floor: +m[1], base: +m[2], slope: +m[3], ceiling: +m[4] };
  };

  const body = read("--text-body");
  const copy = read("--text-copy");
  assert.equal(copy.slope, body.slope, "the two sizes no longer run in parallel");

  /* Running text is at least as large as the labels, never smaller. */
  assert.ok(copy.ceiling >= body.ceiling);
  assert.ok(copy.base >= body.base);

  /* **A 16in laptop is not one width**, which is why the ramp was lifted rather
     than the ceiling raised alone: a MacBook 16 reports 1728 CSS px at its
     default scaling, a Windows 16 at 125% reports 1536, and the same panel at
     200% reports 1280. All three have to gain, so the gain is checked across the
     band rather than at the top of it. */
  const at = (r, vw) => Math.min(Math.max(r.base + (r.slope * vw) / 100, r.floor), r.ceiling);
  for (const vw of [1280, 1440, 1536, 1728]) {
    assert.ok(
      at(copy, vw) >= 17.5,
      `paragraphs are ${at(copy, vw).toFixed(2)}px at ${vw}, which is the size they were before he asked`,
    );
  }

  /* The phone is untouched: the floor is the floor. */
  assert.equal(at(copy, 390), 16);
});

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

    /* A clamp's floor, or a flat size, so a size written either way can be
       compared. The card's label was the flat one, at 10px, until its labels
       came off on 2026-09-30. */
    const clamped = value.match(/clamp\(\s*([\d.]+)(px|rem)/);
    const flat = value.match(/^([\d.]+)(px|rem)$/);
    const size = clamped ?? flat;
    assert.ok(size, `${sel} is sized in a way this cannot read: ${value}`);
    return Number(size[1]) * (size[2] === "rem" ? 16 : 1);
  };
  /* The whole hierarchy, as an ordering. Three sizes went up and down this card
     across a day — the name shared the values' size, then the values were taken
     smaller when it was the LABEL that was meant — so what is held is the order
     rather than any of the numbers. Two sizes since 2026-09-30, when the labels
     came off: the name over the facts. */
  const name = floor(".clients-card__name");
  const value = floor(".clients-card__fact");

  assert.ok(name > value, "the card name is no larger than the facts under it");
});

test("every arrow link is one size, and one step", () => {
  /* Owner, 2026-08-27: one dimension for all of them on desktop, one globally
     for mobile.

     They were four. `.service-hero__cta` took `--service-text-action` at a flat
     20px, `.product__cta` and `.blog-more__all` took `--text-body` at 16 to 18,
     and `.industries-explore` took `--text-copy` at 16 to 19 — a pixel apart
     from the product link at wide widths, which was drift rather than a
     decision. A reader meets two of them on one scroll.

     Held as a SET rather than as four assertions of the same value: what has to
     be true is that they agree, and the token is what makes that structural. */
  /* `.industries-explore` left with its section on 2026-10-05. */
  const LINKS = [
    ".service-hero__cta {",
    ".product__cta {",
    ".blog-more__all {",
  ];
  /* The rule that sizes it, wherever it is: a selector can also close a
     shared list (the footer's quiet links) that sets no size. */
  const sizes = LINKS.map((selector) => {
    let at = CSS.indexOf(selector);
    assert.ok(at > 0, `${selector} has no rule`);
    let size = null;
    while (at > 0 && !size) {
      const rule = CSS.slice(at, CSS.indexOf("\n}", at)).replace(/\/\*[\s\S]*?\*\//g, "");
      size = rule.match(/font-size:\s*([^;]+);/);
      at = CSS.indexOf(selector, at + selector.length);
    }
    assert.ok(size, `${selector} sets no size`);
    return size[1].trim();
  });
  assert.deepEqual(new Set(sizes), new Set(["var(--text-cta)"]));

  /* **A step, not a clamp**, and that is a deliberate departure from every other
     size on this site: one value on desktop and one on mobile is by definition
     not a fluid ramp. The mobile value sits on `:root` and the desktop one
     replaces it at the split the rest of the page already turns at, so every
     link turns together rather than each carrying its own query. */
  assert.match(CSS, /--text-cta:\s*16px;/);
  const step = CSS.indexOf("@media (min-width: 64rem) {\n  :root {");
  assert.ok(step > 0, "there is no desktop half");
  assert.match(CSS.slice(step, CSS.indexOf("}\n}", step)), /--text-cta:\s*20px/);

  /* **And one purple for the label, matching the arrow.** This was three answers
     to one question: the service hero's CTA and the product link went to
     `--accent-strong`, the blog's went to `--accent`, and the industries link
     did nothing at all — two purples and a gap, on four links that do the same
     job.

     `--accent` because that is what the arrow beside it takes; label and mark
     change together or the hover reads as two things happening. 4.77:1 on the
     light canvas and 7.29 on the dark, AA for text at any size. Held as a set
     for the same reason the size is. */
  const hover = CSS.indexOf(".service-hero__cta:hover,");
  assert.ok(hover > 0, "the labels do not turn together");
  const rule = CSS.slice(hover, CSS.indexOf("\n  }", hover));
  for (const link of [
    ".service-hero__cta:hover",
    ".product__cta:hover",
    ".blog-more__all:hover",
  ]) {
    assert.ok(rule.includes(link), `${link} is not in the family`);
  }
  assert.match(CSS.slice(hover, CSS.indexOf("}\n}", hover)), /color:\s*var\(--accent\);/);
  assert.doesNotMatch(
    CSS.slice(hover, CSS.indexOf("}\n}", hover)),
    /--accent-strong/,
  );

  /* And nowhere else answers it differently. */
  for (const stray of [
    ".product__cta:hover {",
    ".service-hero__cta:hover {",
  ]) {
    assert.ok(!CSS.includes(stray), `${stray} still has a hover of its own`);
  }

  /* **`--service-text-action` is not what changed.** It is the service pages'
     action size and seven other rules read it — role links, the story way-out,
     the journey, the cards. Only the hero's CTA left it, and only because it is
     one of the four links this is about. */
  assert.match(CSS, /--service-text-action:\s*20px/);
  assert.ok(
    (CSS.match(/var\(--service-text-action\)/g) ?? []).length >= 7,
    "the service action size lost users it should have kept",
  );
});

test("the arrow changes colour on hover and never changes place", () => {
  /* Owner, 2026-08-27: no change of position on hover, only the effect, in
     purple.

     The nudge that came off was `translate(2px, -2px)` on the industries link,
     and it was the only arrow on this site that moved — one link behaving
     differently from every other link with an arrow in it. Asserted as an
     absence across the whole stylesheet, because a transform on any arrow is
     the same fault wherever it lands. */
  const bare = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const rule of bare.match(/[^}]*__arrow[^{]*\{[^}]*\}/g) ?? []) {
    assert.doesNotMatch(
      rule,
      /transform:\s*translate/,
      `an arrow still moves: ${rule.slice(0, 60)}`,
    );
  }

  /* **`color`, not a background.** Every dot is `background: currentColor`, so
     one declaration on the arrow carries all fourteen — and it rides on the same
     `:is(a, button):hover` the reconstruct animation does, so anything that gets
     the effect gets the colour, from the keyboard as well as the pointer. */
  const lit = bare.indexOf(":is(a, button):hover .pixel-arrow--animated,");
  assert.ok(lit > 0, "the arrow does not take a colour on hover");
  const rule = bare.slice(lit, bare.indexOf("\n}", lit));
  assert.match(rule, /:focus-visible \.pixel-arrow--animated/);
  assert.match(rule, /color:\s*var\(--accent\)/);

  /* The accent panel's exception went with the panel (2026-10-05): the
     footer is black now, and its way back up is a word and a thin arrow that
     turn the site's red together, which reads on black. */
  assert.doesNotMatch(bare, /\.site-footer__panel/);
});
