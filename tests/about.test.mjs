import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync, statSync } from "node:fs";

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

test("the photograph is under the hero, and says only what it shows", async () => {
  const html = await (await render("/about")).text();

  /* A direct child of `main`, carrying `data-route-section`. That attribute is
     the whole of how a block gets the site's entrance — SectionEnter collects
     `main > section[data-route-section]` — so the plate is animated by being one
     of the page's sections rather than by anything of its own. */
  assert.match(html, /<\/section><section class="about-plate" data-route-section="true">/);

  /* **The page's column, not the page.** It was full-bleed for a version and the
     owner ruled that out, so the figure is back inside a container and stands on
     the same left and right edges as the heading above it. Asserted as
     adjacency, because the container coming back out is one deleted line and the
     plate would silently run to the screen edges again. */
  assert.match(
    html,
    /<section class="about-plate"[^>]*><div class="container"><figure class="about-plate__frame"/,
  );

  /* Its own pixels, so the box is the right shape before the picture decodes and
     nothing below it moves when it arrives — which is also what makes lazy safe.
     It was `eager` for a version on the belief that it had to be, which was
     never true once the frame carried a ratio. */
  assert.match(html, /width="4000"/);
  assert.match(html, /height="2250"/);
  assert.match(html, /loading="lazy"/);

  /* **Five slices, each carrying the whole picture, clipped to a fifth.** The
     owner's pick from four entrances. Copies rather than one image with masks,
     because each slice has to move on its own; copies rather than five
     backgrounds, because a background cannot carry `srcset` and that ladder is
     why a phone gets 107KB instead of 947. */
  const plate = html.slice(
    html.indexOf('class="about-plate"'),
    html.indexOf("</figure>"),
  );
  assert.equal((plate.match(/data-plate-slice/g) ?? []).length, 5);
  assert.equal((plate.match(/<img/g) ?? []).length, 5);
  for (const slice of [0, 1, 2, 3, 4]) {
    assert.match(plate, new RegExp(`--slice:\\s*${slice}`), `slice ${slice} is unnumbered`);
  }
  assert.match(plate, /--slices:\s*5/);

  /* **One photograph, however many boxes it is drawn in.** The alt is on the
     first copy and the other four are hidden — without that a screen reader
     meets the same description five times, which reads as five pictures. */
  assert.equal((plate.match(/aria-hidden="true"/g) ?? []).length, 4);
  assert.equal((plate.match(/alt=""/g) ?? []).length, 4);

  /* **Five rungs, not one file.** The original is 1.2MB and a phone needs 1200px
     of it. `sizes` is the fact that lets the browser choose, and it names the
     COLUMN rather than the viewport — the gutters come off first. Written out
     rather than as `var(--page-gutter)`: `sizes` is parsed before the cascade
     exists, so a custom property there is not a smaller number, it is an invalid
     value and the attribute is dropped whole. */
  assert.match(html, /sizes="calc\(100vw - 2 \* clamp\(1rem, 4vw, 2\.5rem\)\)"/);
  assert.doesNotMatch(html, /sizes="[^"]*var\(/);
  for (const width of [1200, 1800, 2400, 3200, 4000]) {
    assert.match(
      html,
      new RegExp(`/about-office-${width}\\.webp ${width}w`),
      `the ${width}px rung is missing from srcset`,
    );
  }

  /* **The alt describes the room and does not say whose it is.** Nothing states
     that this is Mardal's own office, and an `alt` is where an invented fact is
     least likely to be checked. Asserted as an absence, because the tempting
     rewrite — "our studio" — is one word long. */
  const described = html
    .match(/alt="([^"]+)"/g)
    .map((a) => a.toLowerCase())
    .find((a) => a.includes("open-plan"));
  assert.ok(described, "the photograph has no descriptive alt");
  assert.doesNotMatch(described, /\bour\b|mardal|\bstudio\b|\bteam\b|\bwe\b/);
});

test("the plate is the column wide, and every rung of it is on disk", () => {
  const at = CSS.indexOf(".about-plate__frame {");
  assert.ok(at > 0, "the plate has no frame rule");
  const rule = CSS.slice(at, CSS.indexOf("}", at));

  assert.match(rule, /width:\s*100%/);
  assert.match(rule, /aspect-ratio:\s*16 \/ 9/);

  /* **What makes five clipped columns one seamless picture.** Each copy is the
     whole frame wide and slid left by its own index, so every one of them lands
     on the same absolute left edge — measured, all five at 40px, and no gap
     between any two slices. Both terms are the composite; either alone is five
     pictures side by side or one picture five times over. */
  const at2 = CSS.indexOf(".about-plate__image {");
  const image = CSS.slice(at2, CSS.indexOf("}", at2));
  assert.match(image, /width:\s*calc\(100% \* var\(--slices\)\)/);
  assert.match(image, /left:\s*calc\(var\(--slice\) \* -100%\)/);

  /* **`min-width`, and it has to be `min-width`.** The base stylesheet holds
     every `img` to `max-width: 100%`, which clamps each copy to its own slice.
     `max-width: none` is the obvious answer and it is not enough — see the
     built-stylesheet test below, which is where that was caught. */
  assert.match(image, /min-width:\s*calc\(100% \* var\(--slices\)\)/);

  /* Flex children rather than absolute boxes at 20% intervals: adjacent flex
     items share an edge and tile without a gap at fractional widths. */
  const at3 = CSS.indexOf(".about-plate__slice {");
  assert.match(CSS.slice(at3, CSS.indexOf("}", at3)), /flex:\s*1 1 0/);

  /* **`100%` and never `100vw`.** `100%` is the container it now sits in; `100vw`
     was what the full-bleed version wanted and it is wrong twice over — the
     plate is not the page any more, and inside `#smooth-content` `100vw`
     includes the scrollbar, so the page would gain a horizontal scroll of
     exactly that width on every screen with one. */
  assert.doesNotMatch(rule, /100vw/);

  /* Every width named in `srcset` has to exist, or a browser picks a rung and
     gets a 404 — which shows as no picture at all, only at some window sizes. */
  let total = 0;
  for (const width of [1200, 1800, 2400, 3200, 4000]) {
    const file = statSync(
      new URL(`../public/about-office-${width}.webp`, import.meta.url),
    );
    assert.ok(file.size > 0, `the ${width}px rung is empty`);
    total += file.size;
  }
  assert.ok(total > 0);

  /* And the file it replaced is gone rather than left behind unreferenced. */
  assert.throws(() =>
    statSync(new URL("../public/about-office.jpeg", import.meta.url)),
  );
});

test("the plate survives the minifier, not just the stylesheet", () => {
  /* **The one thing a test on `globals.css` cannot see.**
     `.about-plate__image` carried `max-width: none` to defeat the base rule
     `img { max-width: 100% }`. The source was right; the BUILD was not. The
     minifier drops `max-width: none` as an initial value without accounting for
     the lower-specificity rule it exists to override, so what shipped had no
     `max-width` at all — every copy clamped to its own 281px slice while sitting
     at `left: -281px`, which put four of the five entirely outside their own
     clip. They drew nothing. The owner saw one column of photograph and four
     empty ones, and every assertion in this file passed.

     So this reads the built stylesheet. `min-width` is what carries the size
     now: it wins over `max-width` by the cascade's own rule, and it is not an
     initial value, so nothing can decide it is redundant. */
  const assets = new URL("../dist/client/assets/", import.meta.url);
  const sheets = readdirSync(assets).filter((name) => name.endsWith(".css"));
  assert.ok(sheets.length, "the build produced no stylesheet");

  const built = sheets
    .map((name) => readFileSync(new URL(name, assets), "utf8"))
    .join("\n");

  const rule = built.match(/\.about-plate__image\s*\{[^}]*\}/);
  assert.ok(rule, "the plate image rule did not survive the build");

  assert.match(rule[0], /min-width:\s*calc\(100% \* var\(--slices\)\)/);
  assert.match(rule[0], /left:\s*calc\(var\(--slice\) \* -100%\)/);

  /* And the rule it is there to beat is still in the build, so this is not
     guarding against something that has quietly gone away. */
  assert.match(built, /max-width:\s*100%/);
});

test("the reveal is tied to scroll position and resolves", () => {
  /* **Read with the prose stripped out, once, and used for everything below.**
     Three assertions in this file have now been written against the raw text and
     caught the file's own comments instead of its code — a sentence saying it
     does not use `Math.random`, one saying "moving 800 to 2500px a second", and
     one saying "clip-path rather than width". A component that explains what it
     deliberately does NOT do will always trip a guard looking for that thing. */
  const raw = readFileSync(
    new URL("../components/motion/MediaReveal.tsx", import.meta.url),
    "utf8",
  );
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /"use client"/);
  assert.match(code, /prefers-reduced-motion:\s*reduce/);
  /* It bails before touching anything, rather than building the tween and
     leaving it paused. Anchored to `gsap.set`, which is now the first thing it
     would do — anchored to `gsap.fromTo` this silently passed nothing once the
     construction changed, because `indexOf` returns -1 and every index is
     greater than that. */
  const guard = code.indexOf("prefers-reduced-motion");
  const firstWrite = code.indexOf("gsap.set");
  assert.ok(firstWrite > 0, "the reveal never writes anything");
  assert.ok(guard > 0 && guard < firstWrite);

  /* **Slices that land.** Fourth treatment this plate has had and the owner's
     own pick from four: a scale-settle, a sideways open and a downward uncover
     came before it. They start displaced along the frame's short axis,
     alternating up and down so the run reads as a set of pieces rather than one
     thing leaning, and come home at staggered times.

     **Set, then tweened — not a staggered `fromTo`.** That was the obvious way
     to write it and it does not work: a staggered `fromTo` renders each target's
     from-values when that target's turn arrives, so at the head of the window
     only the first slice was displaced. Measured at `126/0.35` on the first and
     `0/1.00` on the other four — four fifths of the picture never moved.
     `immediateRender: true` does not reach the staggered sub-tweens either; it
     was tried and measured the same. Set up front, every slice holds its start
     because the start is simply where it already is. Measured after:
     `+126/-126/+126/-126/+126`, all at 0.35. */
  assert.match(code, /gsap\.set\(slices, \{/);
  assert.match(code, /index % 2 \? -TRAVEL : TRAVEL/);
  assert.match(code, /stagger: \{ each: APART \}/);
  assert.doesNotMatch(code, /fromTo/);

  /* **And it RESOLVES**, every slice to exactly zero. Parallax keeps its offset
     and drifts forever; an end value of anything but 0 is the difference, and
     both look plausible in a still. */
  assert.match(code, /yPercent: 0,/);
  assert.match(code, /opacity: 1,/);

  /* Never fully transparent on the way in: a slice can be faint for a moment,
     but a blank column reads as a picture that failed to load. */
  assert.match(code, /const FAINT = 0\.\d+;/);
  assert.doesNotMatch(code, /opacity: 0,/);

  /* Attached by attribute, so the next photograph gets this by carrying the
     attribute rather than by being named here. */
  assert.match(code, /\[data-media-reveal\]/);
  assert.doesNotMatch(code, /about/i);
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
