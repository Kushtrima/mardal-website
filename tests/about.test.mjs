import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * About, and the third page to leave `content/placeholders.ts`.
 *
 * The copy is written out here rather than imported, the same way
 * `placeholder-pages.test.mjs` does it and for the same reason: a test that
 * reads the module the page reads asserts only that a file equals itself. These
 * are the owner's own two sentences, and changing one has to be a decision made
 * twice.
 */

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const TITLE_LINES = ["A studio shaped by people,", "ideas, and progress."];
const SUPPORT =
  "Our core team is small on purpose, but highly skilled, so you get the right talent and expertise, all the time.";

test("About is a written page, not a placeholder any more", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>About — Mardal<\/title>/i);

  /* Both halves. A half-converted route would still render and still say About:
     the shared heading is gone, and so is the eyebrow that told the unwritten
     pages apart from one another. */
  assert.doesNotMatch(html, /Working[\s\S]{0,40}on it\./);
  assert.doesNotMatch(html, /service-hero__eyebrow/);
});

test("the heading is the owner's sentence, broken where he broke it", async () => {
  const html = await (await render("/about")).text();

  /* React writes a `<!-- -->` separator between two adjacent text children, so
     the span's content is not a run of non-`<`. Stripped rather than matched
     around, because the marker is React's business and the words are the
     assertion. */
  const spans = [
    ...html.matchAll(/<span class="service-hero__title-line">(.*?)<\/span>/g),
  ].map((m) => m[1].replace(/<!-- -->/g, ""));

  /* Sliced because the RSC payload repeats the markup. Order asserted, not just
     presence: the two lines reversed still render, still contain every word, and
     say something else. */
  assert.deepEqual(spans.slice(0, 2), [
    TITLE_LINES[0],
    ` ${TITLE_LINES[1]}`,
  ]);

  /* **The leading space is load-bearing and invisible until it is not.** The
     spans are adjacent in the markup with nothing between them, which is fine
     while they are blocks — and at 48rem and under they are set inline so the
     sentence can balance at a size the authored break cannot reach. Without it
     that reads `people,ideas,`. Careers shipped `startswith` this way with every
     measurement passing, because a `::after` is not in `textContent`. */
  assert.match(
    html,
    /people,<\/span><span class="service-hero__title-line"> (<!-- -->)?ideas,/,
  );
});

test("the sentence under it is his too, and is the only claim on the page", async () => {
  const html = await (await render("/about")).text();

  assert.match(html, new RegExp(SUPPORT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  /* **Nothing about the company was supplied beyond these two lines**, and
     PRODUCT.md's standing answer to an unsupplied fact is an absence rather than
     a plausible guess — which on a page ABOUT the company is where a guess would
     do the most damage. So: no team size, no founding year, no names, no
     quantified outcome. Every one of those is a sentence I would have written. */
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  assert.doesNotMatch(main, /\b(19|20)\d{2}\b/, "About names a year");
  assert.doesNotMatch(main, /\b\d+\s*(people|employees|designers|engineers|years)\b/i);
  assert.doesNotMatch(main, /\b\d+\s*%|\bfounded\b|\bsince\b/i);
});

test("the hero carries the artwork-less arrangement, and turns it over", async () => {
  const html = await (await render("/about")).text();

  /* **`--bare` is carried for its phone half only.** Built without the class
     first: the base rule pins the sentence bottom-LEFT and the way in
     bottom-RIGHT, absolutely, and measured at 320, 375, 390, 430 and 600 the
     sentence ran underneath the link at every one of them — 113 characters do
     not fit between them. Above that width the class is wrong for this page, so
     the wrapper leaves the box tree and the two take their base placements. */
  assert.match(html, /class="service-hero service-hero--bare"/);
  assert.match(html, /class="service-page service-page--about"/);
  assert.match(html, /class="service-hero__aside"/);

  /* **Given unconditionally and taken back on the phone, never the reverse.**
     Scoped as `@media (min-width: 48.0625rem)` — the complement this file uses
     elsewhere — it leaves a sliver at 768 < w < 769 matching neither query, and
     in it the wrapper stood on the right. A fractional viewport is what zoom and
     a fractional device pixel ratio produce; it is not hypothetical, and it is
     what the measurement that found this was reading.

     The two are told apart by indentation rather than by slicing from the first
     `@media (max-width: 48rem)`: there are eight of those blocks in this file and
     the first opens 1,400 lines ABOVE the unconditional rule, so slicing from it
     found the desktop rule and read `contents` where it wanted `flex`. */
  const ASIDE = ".service-page--about .service-hero--bare .service-hero__aside {";
  const wide = CSS.indexOf(`\n${ASIDE}`);
  const phone = CSS.indexOf(`\n  ${ASIDE}`);

  assert.ok(wide > 0, "About does not step the artwork-less wrapper aside");
  assert.match(CSS.slice(wide, CSS.indexOf("}", wide)), /display:\s*contents/);

  assert.ok(phone > 0, "the phone never gets its wrapper back");
  assert.match(CSS.slice(phone, CSS.indexOf("}", phone)), /display:\s*flex/);

  /* That the unconditional rule was FOUND unindented is itself the proof it is
     not nested in a query, so no separate guard is needed — and the one written
     first was worse than redundant: `assert.doesNotMatch(CSS, /48\.0625rem/)`
     read the whole stylesheet and failed on a rule belonging to another page
     entirely. A page-wide guard for a page-scoped fact, which is the third time
     that shape has caught something it was not written for. */

  /* And the link stands where it stands on the five service pages. `--bare`
     resets its placement for a link inside the block, and with the wrapper gone
     those resets left it drifting: 95px in from the right at 769 and 469px at
     1920. Measured against Branding at 1440, both now sit flush. */
  const link = CSS.indexOf(
    ".service-page--about .service-hero--bare .service-hero__cta {",
  );
  assert.ok(link > 0, "About does not put the link back on the right");
  const linkRule = CSS.slice(link, CSS.indexOf("}", link));
  assert.match(linkRule, /justify-self:\s*end/);
  assert.match(linkRule, /align-self:\s*end/);

  /* No artwork. It is not a service and it has no drawing, so the hero must not
     be reserving room for one. */
  assert.doesNotMatch(html, /service-hero__pattern|data-pattern-bars/);
});

test("the heading sets its own measure and its own size", () => {
  /* The base caps the heading at `min(21ch, 100cqw - 30rem - 2rem)`, and the
     second term reserves 30rem for a drawing this page has not got. Left in, the
     26-character line turned at every width measured except 1600.

     The size DIVIDES rather than declares — the column over the width of the
     longest authored line — because an authored line must never wrap and the
     largest a page can be set is exactly that quotient. `--hero-line` is the one
     measured fact the page contributes; the arithmetic is shared. */
  const at = CSS.indexOf(".service-page--about .service-hero__title {");
  assert.ok(at > 0, "About sets no title rule");
  const rule = CSS.slice(at, CSS.indexOf("}", at));

  assert.match(rule, /max-width:\s*none/);
  assert.match(rule, /--hero-line:\s*9\.904/);

  /* **Its own slope, not the shared token.** Owner, 2026-08-26: bigger.
     `--text-heading-xl` caps at 72px and was the binding term from 1300 up,
     while the quotient allowed 118 there and 240 at 2560 — the container has no
     maximum, so the column kept growing and the heading did not. Measured after:
     104px from 1300 up, 82 at 1024, 62 at 769.

     Both halves asserted. Taking the token back caps it at 72 again; dropping
     the quotient takes away the only thing stopping a longer line from turning,
     and this page has already had one — the first heading here was 13.196em and
     turned at every width but 1600 until the division went in. */
  assert.match(rule, /font-size:\s*min\(clamp\(3rem, 8vw, 6\.5rem\), calc\(96cqi \/ var\(--hero-line\)\)\)/);
  assert.doesNotMatch(rule, /--text-heading-xl/);

  /* And the intro takes the whole row, without which the quotient is measuring a
     column the heading has not got: placed `1 / span 8` it had 807px of a 1220px
     row at 1300 and lines turned inside it. Row 1 is the intro's alone — the
     bare aside sits at `2 / -1` — so this costs nothing. */
  const intro = CSS.indexOf(".service-page--about .service-hero__intro {");
  assert.ok(intro > 0);
  assert.match(CSS.slice(intro, CSS.indexOf("}", intro)), /grid-column:\s*1 \/ -1/);
});

test("the sentence is set as prose, and beats the rules it has to beat", () => {
  /* `--bare` holds the support to 26ch and the service pages to 16, both written
     for a phrase standing beside something. This is 113 characters and the only
     prose on the page.

     **Three classes, not two, and that is the assertion.** Both of those rules
     are two classes and both are written FURTHER DOWN this file, so an equal
     selector here loses on order — which is how the link ended up 170 to 321px
     inside a left edge the sentence above it was already meeting. */
  const at = CSS.indexOf(
    ".service-page--about .service-hero--bare .service-hero__support {",
  );
  assert.ok(at > 0, "the support override is not specific enough to win");
  const rule = CSS.slice(at, CSS.indexOf("}", at));
  assert.match(rule, /max-width:\s*30ch/);
  assert.match(rule, /grid-column:\s*1 \/ span 6/);

  /* **The size is the shared one, and that is the assertion.** It was set at
     20-26px for an hour and the owner caught it: smaller than the other pages.
     `--service-text-support` is one pixel scale for every service page, and a
     page quietly opting out of it is how a scale stops being one. The override
     is the measure, which is about this copy, not the size, which is about the
     site. Measured after: 39px here and 39px on Branding at 1440. */
  assert.match(rule, /font-size:\s*var\(--service-text-support\)/);
  assert.doesNotMatch(rule, /font-size:\s*clamp\(/);

  /* One rule, not two. The first attempt at this left the old override in place
     as well, and the stale one won on order — which is why the sentence was
     still 20px after being told to take the shared size. */
  assert.equal(
    CSS.split(
      ".service-page--about .service-hero--bare .service-hero__support {",
    ).length - 1,
    2,
    "there is not exactly one desktop rule and one phone rule for the sentence",
  );
});

test("About is out of the placeholder module, and out of its test", () => {
  const placeholderModule = readFileSync(
    new URL("../content/placeholders.ts", import.meta.url),
    "utf8",
  );
  const table = readFileSync(
    new URL("./placeholder-pages.test.mjs", import.meta.url),
    "utf8",
  );

  /* Leaving one of those behind is the whole failure mode of graduating a page:
     the module entry would still compile, the table would still fetch `/about`,
     and it would assert the shared heading against a page that no longer has it. */
  assert.doesNotMatch(placeholderModule, /^\s{2}about: \{/m);
  assert.doesNotMatch(table, /path: "\/about"/);
  assert.match(table, /const PLACEHOLDER_PAGES = 10;/);
});
