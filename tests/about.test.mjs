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

/** The products side, under the note on how the studio works, verbatim. */
const VENTURE = [
  "We are also a venture studio. We create our own products because building things ourselves keeps us moving beyond the perspective of a consultant or traditional design studio.",
  "Our products are the backbone of how we keep evolving as innovators. They allow us to test ideas in the real world, build our own tools, and move beyond the limitations of relying only on existing platforms — often translating directly into value for our clients.",
  "AI is changing how creative work gets made, and we want to show that it can be an enabler of better creative thinking, not a shortcut around it. The aim is real value, not simply adding a layer of AI to existing workflows.",
];

/** How the studio works, under the three rooms — each paragraph WHOLE.
 *
 * The third was held here as its closing sentence only, and a break that cut the
 * first two thirds of it passed: the fragment survived at the end. A paragraph
 * asserted by its tail is a paragraph half covered. */
const VALUES = [
  "No layers. No middlemen. You work directly with the people shaping the strategy, designing the experience, and building the final product.",
  "Our team brings together engineers, designers, AI researchers, and psychologists, people who understand technology, design, and how people think and behave.",
  "We keep the process open, move quickly, and focus on work that creates real value. Expectations are made clear from the start, so everyone stays aligned throughout the project. We believe the best work comes from strong collaboration, clear communication, and relationships built on trust.",
];

/** The history under the photograph, verbatim. */
const STORY = [
  "Our story began in 2008, when we opened our first small studio with a lot of enthusiasm and a simple idea: to create meaningful digital work.",
  "From 2020, we began concentrating more on UX/UI, branding, websites, and software.",
  "Today, that journey continues under a new name: Mardal, with new offices, expanded services, and a clearer focus on the work we do and the direction we want to take.",
];

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

test("the sentence under the heading is his, and so is the history", async () => {
  const html = await (await render("/about")).text();

  assert.match(html, new RegExp(SUPPORT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  /* Both paragraphs of the history, whole. Asserted verbatim because this is the
     only page on the site that states anything about the company, and a
     paraphrase of an owner's sentence is a different sentence. */
  assert.match(html, /Built Over Time/);
  for (const line of STORY) {
    assert.match(html, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  /* One character was changed from what he sent: `Mardal ,with` to
     `Mardal, with`. A misplaced comma is a typo, not a phrasing. */
  assert.doesNotMatch(html, /Mardal ,/);
});

test("the only facts on the page are the ones the owner gave", async () => {
  const html = await (await render("/about")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));

  /* **This assertion used to be "no year at all", and that was right until it
     was not.** The page carried no year, no headcount and no history because
     nothing had been supplied, and PRODUCT.md's answer to an unsupplied fact is
     an absence rather than a plausible guess.

     The owner then supplied two years. The rule has not loosened — it has been
     answered — so the guard becomes an allow-list rather than a ban. A third
     year appearing on this page is a year nobody gave me. */
  /* Read from the TEXT, with the tags stripped. Written against the markup it
     also read every attribute, and the photographs are 1920 tall and one of
     their rungs is 2000 wide — so a guard on what the page SAYS was failing on
     the size of a picture. */
  const prose = main.replace(/<[^>]*>/g, " ");
  const years = [...new Set(prose.match(/\b(?:19|20)\d{2}\b/g) ?? [])].sort();
  assert.deepEqual(years, ["2008", "2020"]);

  /* And everything a reader would expect NEXT to those years is still absent,
     because he did not say any of it: how many people, how many clients, where
     the new offices are, what the studio was called before. Each is one
     plausible sentence away. */
  assert.doesNotMatch(prose, /\b\d+\s*(people|employees|designers|engineers|clients|projects|years)\b/i);
  assert.doesNotMatch(prose, /\b\d+\s*%|\bfounded\b|\bsince \d/i);
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

  /* A direct child of `main`. `data-route-section` is how SectionEnter finds a
     block — it collects `main > section[data-route-section]` — and the plate
     carries it while opting straight back out; see below for why. */
  assert.match(html, /<\/section><section class="about-plate" data-route-section="true">/);

  /* **The plate must NOT take the section entrance.** It gets one free from
     `data-route-section`: a y-lag of 96 to 160px and a fade from 0.62. The
     slices bring their own displacement and their own fade, so together that is
     two vertical motions on two different scroll windows and two opacities that
     MULTIPLY — 0.62 x 0.55 — and the photograph arrived through a ghost, a
     shear and a snap. That is what the owner reported as broken.

     `data-enter` nominates the block and `data-enter-mode="none"` turns the
     section's entrance off, which is the opt-out the CTA sections already use.
     Measured after: the section sits at y 0 and opacity 1 and never moves, and
     the slices are the only thing animating. */
  assert.match(html, /class="about-plate__frame"[^>]*data-enter="true"/);
  assert.match(html, /class="about-plate__frame"[^>]*data-enter-mode="none"/);

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

  /* **One picture, and one `<img>`.** It was five copies for a version, each
     clipped to a fifth for the slice entrance; they went with the effect they
     existed for. Counted, because leaving one behind is silent — a second copy
     renders exactly on top of the first. */
  const plate = html.slice(
    html.indexOf('class="about-plate"'),
    html.indexOf("</figure>"),
  );
  assert.equal((plate.match(/<img/g) ?? []).length, 1);
  assert.doesNotMatch(plate, /data-plate-slice|--slices?:/);

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

  /* The picture is the frame's own width, so nothing here has to beat the base
     `img { max-width: 100% }` any more. The slice version did — five copies each
     sized to the WHOLE frame — and needed `min-width` to survive the minifier;
     both went with the entrance they were for. */
  const at2 = CSS.indexOf(".about-plate__image {");
  const image = CSS.slice(at2, CSS.indexOf("}", at2));
  assert.match(image, /width:\s*100%/);
  assert.match(image, /object-fit:\s*cover/);
  assert.doesNotMatch(CSS, /about-plate__slice/);

  /* The clip the hold opens is cut by this. */
  assert.match(rule, /overflow:\s*clip/);

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

test("the plate's rule survives the build, not just the stylesheet", () => {
  /* **The one thing a test on `globals.css` cannot see, and it has bitten once.**
     `.about-plate__image` carried `max-width: none` to defeat the base rule
     `img { max-width: 100% }` while the plate was five clipped copies. The
     source was right; the BUILD was not — the minifier drops `max-width: none`
     as an initial value without accounting for the lower-specificity rule it
     exists to override, so what shipped had no `max-width` at all and four of
     the five copies drew nothing. Every assertion in this file passed.

     That declaration is gone with the slices, and this check is not: a rule that
     reaches the browser different from how it was written is a class of failure,
     not one incident. */
  const assets = new URL("../dist/client/assets/", import.meta.url);
  const sheets = readdirSync(assets).filter((name) => name.endsWith(".css"));
  assert.ok(sheets.length, "the build produced no stylesheet");

  const built = sheets
    .map((name) => readFileSync(new URL(name, assets), "utf8"))
    .join("\n");

  const frame = built.match(/\.about-plate__frame\s*\{[^}]*\}/);
  assert.ok(frame, "the plate frame rule did not survive the build");
  assert.match(frame[0], /aspect-ratio:\s*16\s*\/\s*9/);
  /* The clip the hold opens is cut by this, and `clip` is not the initial value
     of `overflow`, so nothing can decide it is redundant. */
  assert.match(frame[0], /overflow:\s*clip/);
});

test("the reveal holds the page, and resolves", () => {
  /* **Read with the prose stripped out, once, and used for everything below.**
     Assertions in this file have three times been written against the raw text
     and caught the file's own comments instead of its code — a sentence saying
     it does not use `Math.random`, one saying "moving 800 to 2500px a second",
     and one saying "clip-path rather than width". A component that explains what
     it deliberately does NOT do will always trip a guard looking for that thing. */
  const raw = readFileSync(
    new URL("../components/motion/MediaReveal.tsx", import.meta.url),
    "utf8",
  );
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /"use client"/);
  assert.match(code, /prefers-reduced-motion:\s*reduce/);

  /* It bails before touching anything, rather than building the pin and leaving
     it paused. A pin left behind would still add its scroll length to the page
     for a reader who asked for no motion. */
  const guard = code.indexOf("prefers-reduced-motion");
  const firstWrite = code.indexOf("gsap.timeline");
  assert.ok(firstWrite > 0, "the reveal never builds anything");
  assert.ok(guard > 0 && guard < firstWrite);

  /* **The pin is the effect.** Every other entrance this plate has had happens
     while the page moves past; this one holds the page still. Measured: the
     spacer adds 729px on a 912px window against an expected 730. */
  assert.match(code, /pin: frame/);
  assert.match(code, /pinSpacing: true/);
  assert.match(code, /const HOLD = 0\.8;/);

  /* Centred rather than `top top`, so the hold does not depend on the plate
     being shorter than the window — which it is not on a laptop. */
  assert.match(code, /start: "center center"/);
  assert.match(code, /window\.innerHeight \* HOLD/);

  /* **Scrubbed, not timed.** The hold is not a pause on a timer, it is scroll
     distance spent in one place — so it plays fast when the page is thrown and
     sits halfway when it is stopped halfway. A `scrub` removed turns the hold
     into a fixed-length animation that runs whether the reader moves or not. */
  assert.match(code, /scrub:/);
  assert.match(code, /ease: "none"/);

  /* **And it RESOLVES**, to `inset(0)` and scale 1, where it locks. Parallax
     keeps its offset and drifts forever; an end value of anything else is the
     difference, and both look plausible in a still. */
  assert.match(code, /clipPath: `inset\(\$\{BANDED\}% 0% \$\{BANDED\}% 0%\)`/);
  assert.match(code, /clipPath: "inset\(0% 0% 0% 0%\)"/);
  assert.match(code, /\{ scale: OVERSIZE \}/);
  assert.match(code, /scale: 1,/);

  /* **No opacity anywhere on this plate.** The section entrance fades from 0.62,
     and the entrance before this one faded too — the two multiplied to 0.217 and
     the photograph arrived as a ghost. The plate opts out of the section's
     entrance now, and this keeps the other half of that from coming back. */
  assert.doesNotMatch(code, /opacity/);

  /* Attached by attribute, so the next photograph gets this by carrying the
     attribute rather than by being named here. */
  assert.match(code, /\[data-media-reveal\]/);
  assert.doesNotMatch(code, /about/i);
});

test("the history takes the section entrance the plate declines", async () => {
  const html = await (await render("/about")).text();

  /* It names its own heading, which SectionEnter uses as the trigger — sections
     open with a band of space, and measuring from the top edge spends a third of
     the movement on empty white. */
  assert.match(
    html,
    /<section class="about-prose" aria-labelledby="about-prose-title" data-route-section="true">/,
  );
  assert.match(html, /id="about-prose-title"/);

  /* **And it does NOT opt out.** The plate above it declines the section
     entrance because it animates itself, and two entrances on one block is what
     broke that one. This is prose with nothing of its own moving, which is what
     `SectionEnter` was written for — so the opt-out belongs on exactly one of
     the two sections on this page. */
  const story = html.slice(
    html.indexOf('class="about-prose"'),
    html.indexOf("</section>", html.indexOf('class="about-prose"')),
  );
  assert.doesNotMatch(story, /data-enter/);

  const plate = html.slice(
    html.indexOf('class="about-plate"'),
    html.indexOf("</figure>"),
  );
  assert.match(plate, /data-enter-mode="none"/);
});

test("the history's heading is on the display face", () => {
  /* Owner: this in the other font, the premium one, and bigger. It was the sans
     at 24-30px, which is the size a label takes.

     The face is `--type-title`, whose own comment used to say "h1 only" — it had
     not been true for a long time, twenty-one rules reach for it including CTA
     headings and card titles that are h2 and below. Corrected there. What it
     marks is editorial rather than hierarchical: the sans is for what a reader
     moves through, this is for what they stop at. */
  const at = CSS.indexOf(".about-prose__title {");
  assert.ok(at > 0, "the history has no heading rule");
  const rule = CSS.slice(at, CSS.indexOf("}", at));

  assert.match(rule, /font-family:\s*var\(--type-title\)/);
  assert.doesNotMatch(rule, /var\(--type-display\)/);

  /* **Bounded by fitting on one line**, because turning a three-word heading is
     a decision about the copy. Measured with the real face at eleven widths: it
     needs 372px of a 598px slot at 1920, 334 of 440 at 1440, and 238 of 304 just
     above the split, which is where the slot is narrowest relative to the text
     because the column count changes there and the width does not. */
  assert.match(rule, /font-size:\s*clamp\(2\.25rem, 4vw, 4rem\)/);

  /* A grid item stretches to its row, and this row is as tall as the prose
     beside it. Nothing moves without this — text sits at the top of its box
     either way — but a one-line heading in a four-line box is a thing that reads
     as broken the first time anyone inspects it. */
  assert.match(rule, /align-self:\s*start/);
});

test("the history is set at a measure running text can hold", () => {
  const at = CSS.indexOf(".about-prose__paragraph {");
  assert.ok(at > 0, "the history sets no measure");
  const rule = CSS.slice(at, CSS.indexOf("}", at));

  /* **52ch, and the number is not the character count.** CSS `ch` is the width
     of the `0` glyph, which is wider than an average letter: 62ch measured out
     at about 80 real characters a line, past the 45 to 75 running text is
     comfortable at. 52ch measures at 70. Asserted with that written down,
     because the obvious "fix" for a 52 that reads as 70 is to change the 52. */
  assert.match(rule, /max-width:\s*52ch/);

  /* The split is at 64rem, not 48. It broke at 48 for a version and the band
     just above was the worst of both — measured at 769 the reading column came
     out 406px, 49 characters a line, narrower than the phone gets when it
     stacks, on a window nearly two and a half times as wide. */
  const stack = CSS.indexOf("@media (max-width: 64rem)", CSS.indexOf(".about-prose"));
  assert.ok(stack > 0, "the history never stacks");
  const query = CSS.slice(stack, CSS.indexOf("}\n}", stack));
  assert.match(query, /\.about-prose__title,\s*\n\s*\.about-prose__copy \{/);
  assert.match(query, /grid-column:\s*1 \/ -1/);
});

test("the three rooms are composed, and say only what they show", async () => {
  const html = await (await render("/about")).text();

  const rooms = html.slice(
    html.indexOf('class="about-rooms"'),
    html.indexOf("</section>", html.indexOf('class="about-rooms"')),
  );

  assert.equal((rooms.match(/<img/g) ?? []).length, 3);

  /* **`src` as well as `srcSet`.** Only the ladder was asserted, and swapping
     `src` back to the broken path failed nothing — the fallback would have 404d
     for any browser that ignores `srcset`, and silently. The asset stem and the
     CSS modifier are different strings on purpose: the files are prefixed and
     the class is not, and building one from the other shipped `/glass-700.webp`
     against `about-glass-700.webp`. */
  for (const stem of ["about-glass", "about-window", "about-timber"]) {
    assert.match(rooms, new RegExp(`src="/${stem}-\\d+\\.webp"`));
  }

  /* Three rungs each, and each named by what the room is rather than by its
     position, so the composition can be rearranged without renaming files. */
  for (const [name, widths] of [
    ["about-glass", [700, 1050, 1400]],
    ["about-window", [900, 1400, 2000]],
    ["about-timber", [700, 1050, 1400]],
  ]) {
    for (const width of widths) {
      const file = statSync(
        new URL(`../public/${name}-${width}.webp`, import.meta.url),
      );
      assert.ok(file.size > 0, `${name}-${width}.webp is empty`);
      assert.match(rooms, new RegExp(`/${name}-${width}\\.webp ${width}w`));
    }
  }

  /* Each `sizes` names the fraction of the page that picture occupies, and they
     differ — the tall one is 38vw, the wide one 48, the short one 30. One shared
     value would send a phone-sized rung to the widest of them. */
  for (const fraction of ["32vw", "40vw", "24vw"]) {
    assert.match(rooms, new RegExp(`sizes="[^"]*${fraction}`));
  }

  /* **The alts describe rooms and do not say whose they are**, and neither does
     the heading that names the group. "Inside the studio" was the first heading
     and is the same claim — it says these rooms are Mardal's, which nothing
     states. */
  assert.match(rooms, />Workspaces</);
  assert.doesNotMatch(rooms, /Inside the studio/);
  for (const alt of rooms.match(/alt="([^"]+)"/g) ?? []) {
    assert.doesNotMatch(alt.toLowerCase(), /\bour\b|mardal|\bwe\b/);
  }
});

test("each room keeps its own proportions, and none of them lines up", () => {
  /* **The ratio is a variable, not a shared constant.** The three are 0.728,
     0.854 and 1.5, and making the two uprights share one would crop one of them
     to force a pair out of two things that are not a pair. */
  const at = CSS.indexOf(".about-rooms__frame {");
  assert.ok(at > 0, "the rooms have no frame rule");
  assert.match(CSS.slice(at, CSS.indexOf("}", at)), /aspect-ratio:\s*var\(--room-ratio\)/);

  /* The arrangement: the tall one holds the left across both rows, the wide one
     sits across the top right, the short one hangs under it indented from the
     left. Asserted because it IS the design — three items on `1 / -1` is a
     column, and nothing else here would notice. */
  const placement = (name, expected) => {
    const rule = CSS.indexOf(`.about-rooms__frame--${name} {`);
    assert.ok(rule > 0, `${name} has no placement`);
    assert.match(CSS.slice(rule, CSS.indexOf("}", rule)), expected);
  };
  placement("glass", /grid-column:\s*1 \/ span 4/);
  placement("window", /grid-column:\s*8 \/ span 5/);
  placement("timber", /grid-column:\s*5 \/ span 3/);

  /* **Nothing shares an edge, and the offsets are what make that true.** The
     first version ended its two columns level to within a dozen pixels, and
     level is what the owner ruled out. Percentage margins because they resolve
     against the container's inline size — in `vh` they drift away from pictures
     that are sized by width. */
  /* **`cqw`, not `%`.** A percentage margin resolves against the containing
     block's inline size, and for a grid item that is its own grid area rather
     than the grid — so 52% meant 52% of a 440px picture, every offset came out a
     third of what was intended, and the wide one and the lower upright
     overlapped by 252px at 1920. */
  placement("window", /margin-top:\s*12cqw/);
  placement("timber", /margin-top:\s*30cqw/);
  const inner = CSS.indexOf(".about-rooms__inner {");
  assert.match(CSS.slice(inner, CSS.indexOf("}", inner)), /container-type:\s*inline-size/);

  /* All three on one grid row. Left to auto-placement, two items sharing a
     column are pushed onto rows of their own and the scatter becomes a list. */
  const frame = CSS.indexOf(".about-rooms__frame {");
  assert.match(CSS.slice(frame, CSS.indexOf("}", frame)), /grid-row:\s*1/);

  /* **No two share a column, and that is a safety property rather than a look.**
     The first scatter had the wide one and an upright overlapping columns, so
     every offset and depth had to be checked against a vertical clearance — and
     one of them failed by 252px. Side by side there is no clearance to get
     wrong: they cannot collide whatever the entrance does to them.

     Read off the placements rather than restated, so a future rearrangement that
     reintroduces an overlap fails here instead of on the page. */
  const spans = ["glass", "timber", "window"].map((name) => {
    const rule = CSS.indexOf(`.about-rooms__frame--${name} {`);
    const [, start, count] = CSS.slice(rule, CSS.indexOf("}", rule))
      .match(/grid-column:\s*(\d+) \/ span (\d+)/);
    return { start: Number(start), end: Number(start) + Number(count) };
  });
  spans.sort((a, b) => a.start - b.start);
  for (const [at, span] of spans.slice(1).entries()) {
    assert.ok(
      span.start >= spans[at].end,
      `columns ${spans[at].start}-${spans[at].end - 1} and ${span.start}-${span.end - 1} overlap`,
    );
  }

  /* Tightened on the owner's word — too much empty space. The first scatter was
     1197px tall at a 1440 window with white on three sides of every picture;
     adjacent column runs and smaller drops bring it to 789, a third shorter,
     with the six edges still all at different heights. */
  assert.equal(spans[spans.length - 1].end, 13);

  /* Stacked below the split. Six of twelve is 340px at a 768 window and the
     arrangement stops being a composition and becomes three small pictures. */
  const stack = CSS.indexOf("@media (max-width: 64rem)", CSS.indexOf(".about-rooms"));
  assert.ok(stack > 0, "the rooms never stack");
  assert.match(CSS.slice(stack, stack + 700), /grid-template-columns:\s*minmax\(0, 1fr\)/);
});

test("each room is drawn open from an edge, and the picture moves against it", () => {
  const raw = readFileSync(
    new URL("../components/motion/MediaCluster.tsx", import.meta.url),
    "utf8",
  );
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /"use client"/);
  assert.match(code, /prefers-reduced-motion:\s*reduce/);
  const guard = code.indexOf("prefers-reduced-motion");
  const firstWrite = code.indexOf("gsap.context");
  assert.ok(firstWrite > 0, "the cluster never builds anything");
  assert.ok(guard > 0 && guard < firstWrite);

  /* **The frame opens from one edge and the picture behind it moves the other
     way**, over the same scroll. What reads is a photograph being revealed
     rather than a box growing — the image holds still against the page while its
     window widens. Both halves, because either alone is a different effect. */
  assert.match(code, /"inset\(0% 100% 0% 0%\)"/);
  assert.match(code, /"inset\(0% 0% 0% 100%\)"/);
  assert.match(code, /clipPath: "inset\(0% 0% 0% 0%\)"/);
  assert.match(code, /const COUNTER = 14;/);
  assert.match(code, /xPercent: fromLeft \? -COUNTER : COUNTER/);
  assert.match(code, /xPercent: 0,/);

  /* Which edge is a composition decision, so it lives in the markup. */
  assert.match(code, /dataset\.clusterFrom/);

  /* **Everything happens inside the frame**, which is why there is no separate
     behaviour for a stacked layout any more. The effect before this moved the
     frames themselves, so every offset had to be checked against the neighbours
     it might hit — and it did hit them twice, once by 252px and once by 77.
     Nothing here leaves its own box, so `gsap.matchMedia` and the stacked-rise
     branch it existed for are both gone. */
  assert.doesNotMatch(code, /matchMedia\(\s*"\(m/);
  assert.doesNotMatch(code, /STACKED_RISE|TRAVEL|clusterDepth/);

  /* Each picture triggers on ITSELF. Keyed to the group, the block is 1361px
     tall on a 912px window and the lower two finished arriving 677px below the
     fold — only the first appeared to do anything. */
  assert.match(code, /trigger: item,/);
  assert.doesNotMatch(code, /trigger: group/);

  assert.match(code, /scrub:/);
  assert.match(code, /ease: "none"/);

  /* No opacity, for the reason the plate has none: the section entrance fades
     from 0.62 and two fades multiply. */
  assert.doesNotMatch(code, /opacity/);
});

test("the three open from alternating edges", async () => {
  const html = await (await render("/about")).text();
  const rooms = html.slice(
    html.indexOf('class="about-rooms"'),
    html.indexOf("</section>", html.indexOf('class="about-rooms"')),
  );

  /* **Alternating is what makes three of them a set** rather than three things
     doing the same thing at different times. Asserted in document order — left,
     right, left across the block — because a set that all opened the same way
     would render identically and read as a repeat. */
  const sides = [...rooms.matchAll(/data-cluster-from="(left|right)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(sides, ["left", "right", "left"]);
});

test("the page washes from the open picture to the end of the note", async () => {
  const html = await (await render("/about")).text();

  /* The plate's frame starts it and one section ends it — one tween spanning
     both, because two scrubbed tweens on one property fight over it. */
  assert.match(html, /class="about-plate__frame"[^>]*data-wash="about"/);

  /* **It ends after the note, not after the photographs.** Owner: leave the
     yellow longer, for that text too. Extending it is moving this marker, which
     is the point of naming the ends rather than writing scroll positions. */
  assert.match(
    html,
    /class="about-prose" aria-labelledby="about-values-title"[^>]*data-wash-end/,
  );

  /* **Exactly one of each, and that is load-bearing.** `SectionWash` takes the
     FIRST match for either end; a second `data-wash-end` left on an earlier
     section would silently win and the colour would drain where it used to.

     Counted inside `<main>`: Next writes the whole tree a second time as its RSC
     payload, so a document-wide count of this attribute reads 3 and means 1. */
  const markup = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  assert.equal((markup.match(/data-wash-end/g) ?? []).length, 1);
  assert.equal((markup.match(/data-wash="about"/g) ?? []).length, 1);

  /* **The owner's colour, used exactly as given.** Safe under everything that
     can appear over it — 17.7:1 against `--ink`, 7.0 against the muted grey.
     White would be 1.06 and fails, which is why nothing white sits on the
     canvas; the footer carries its own slab.

     **The dark half is derived, and recorded rather than hidden.** Hue held at
     63, saturation 100 to 26, lightness 77 to 8 — a page background at L 77 on
     the dark page would be a lamp. Verified by flipping the theme: #faff89 on
     the light page, #191a0f on the dark one, 17.6:1 against its ink. */
  assert.match(CSS, /--wash-about:\s*light-dark\(#faff89, #191a0f\)/);

  /* **No CSS toggle, and no transition on the body.** Both are from the version
     this replaced, and either left behind would fight the tween — a 700ms
     transition on a property being scrubbed turns every frame into a chase. */
  assert.doesNotMatch(CSS, /body\[data-wash/);
  const body = CSS.indexOf("\nbody {");
  assert.doesNotMatch(CSS.slice(body, CSS.indexOf("}", body)), /transition/);
});

test("the wash begins where the pin lets go", () => {
  const raw = readFileSync(
    new URL("../components/motion/SectionWash.tsx", import.meta.url),
    "utf8",
  );
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /"use client"/);

  /* **The colour is read, never written here**, so the token stays the one place
     it is decided and the dark page gets its own half without this knowing. */
  assert.doesNotMatch(code, /#[0-9a-f]{3,8}\b|rgb\(/i);
  assert.match(code, /var\(--wash-about\)/);
  assert.match(code, /var\(--canvas\)/);

  /* **Scrubbed, which is a correction.** This was a toggle with a CSS cross-fade
     on the reasoning that a colour has no travel to compete with the page's. The
     owner asked for the opposite in as many words — start when the image is
     open, and change as he scrolls — and he was right: the wash is not an effect
     ON the section, it is the section arriving. */
  assert.match(code, /scrub:/);
  assert.doesNotMatch(code, /onEnter|onLeave|dataset\.wash =/);

  /* **The start is arithmetic, not a relative expression, and that is the whole
     finding.** A pinned element cannot express its own release: it does not move
     while it is held, so every position on it resolves to the GRAB and every
     offset past that is delayed by the hold again. Four relative expressions
     were tried against the real page and all four were wrong.

     So it imports the hold and works the release out: the pin grabs when the
     frame's centre meets the window's centre, and lets go `HOLD` screens later.
     Measured after: white at a scroll of 1750 with the picture still opening at
     `inset(0.76%)`, colour starting at 1850 the moment it reads `inset(0%)`. */
  assert.match(code, /import \{ HOLD \} from ".\/MediaReveal"/);
  assert.match(code, /window\.innerHeight \* HOLD/);
  assert.match(code, /start: \(\) => \{/);

  /* Ends against a different element, so one tween covers the whole run. */
  assert.match(code, /endTrigger: to/);
  /* **The drain finishes before the white section arrives, not under it.** The
     venture note below the wash is on white by instruction, and at `bottom top`
     the colour was still going while that section filled the screen — which
     reads as the yellow following you down the page. */
  assert.match(code, /end: "bottom center"/);

  /* Held in between. A colour that starts leaving the moment it arrives never
     reads as the page's colour, only as a tint passing over it. Measured: full
     from 1950 through 3200, which is the whole time the rooms are on screen. */
  assert.match(code, /const IN = 0\.1;/);
  assert.match(code, /const OUT = 0\.1;/);

  /* **It washes the `<main>`, not only the body, and that is the whole reason
     this did nothing for four attempts.** `.service-page` sets
     `background: var(--service-surface)` on the main — an opaque white layer
     over the body for the height of the page. Washing the body underneath it
     changed a property nothing could see.

     It was "verified" the whole time by reading
     `getComputedStyle(document.body).backgroundColor`, which reported the colour
     changing correctly at every scroll position. The property WAS changing.
     Measuring the property is not measuring the page. */
  assert.match(code, /closest\("main"\)/);

  /* **And every OTHER ground too, or the colour ends in a hard line.** `html`
     and `.site-footer` both carry `background: var(--canvas)` as well, so washing
     only the main stopped the yellow exactly where the main's box ends and let
     white take over below it — which is what the owner saw as an abrupt edge. A
     wash that misses one ground is not a paler wash, it is a seam.

     `html` is the one most easily forgotten and matters most: it has a
     background of its own, so the body's does NOT propagate to the canvas and
     everything the main does not cover is painted by the root element.

     Listed rather than derived. Deriving it from the stylesheet was tried and is
     the wrong shape: a great many rules carry `background: var(--canvas)` —
     `.service-hero`, `.why-section`, `.difference-section` and more — and almost
     all of them are homepage sections that never share a screen with this wash.
     The four that matter are the ones that paint UNDER the About page's own
     content, and knowing which those are is a fact about this page. */
  for (const ground of ["documentElement", "body", 'closest("main")', "site-footer"]) {
    assert.ok(
      code.includes(ground),
      `the wash does not cover ${ground}, which paints the page's ground`,
    );
  }

  /* And every surface it painted is cleaned up, not just the first. */
  assert.match(code, /for \(const surface of surfaces\)/);
});

test("the note on how the studio works is his, whole", async () => {
  const html = await (await render("/about")).text();

  assert.match(html, /Small by choice/);
  for (const line of VALUES) {
    assert.match(html, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  /* **The disciplines are named without counts, and that is what keeps them a
     description rather than a claim.** "engineers, designers, AI researchers,
     and psychologists" says who is on the team; "four engineers" would say how
     big it is, which nothing states. The page-wide fact guard already refuses a
     number in front of any of those words — this is the sentence that makes that
     guard load-bearing rather than theoretical. */
  assert.match(html, /engineers, designers, AI researchers, and psychologists/);
  assert.doesNotMatch(html, /\b\d+\s*(engineers|designers|researchers|psychologists)\b/i);
});

test("the prose sections are one shape, rendered three times", async () => {
  const html = await (await render("/about")).text();

  /* One block written once and called twice — the history above the rooms and
     the note below them. It was `.about-story` while there was one of them, a
     name for the history rather than for the shape; the second section is what
     made the difference matter. Counted in the markup rather than assumed from
     the component, because a copy-paste of the JSX would render identically and
     drift from here on. */
  const sections = html.match(/<section class="about-prose"/g) ?? [];
  assert.equal(sections.length, 3);

  assert.match(html, /aria-labelledby="about-prose-title"/);
  assert.match(html, /aria-labelledby="about-values-title"/);
  assert.match(html, /aria-labelledby="about-venture-title"/);

  /* **The third one is on white, which is where it sits rather than what it is
     styled as.** The wash ends at the section above it, so this is simply after
     the coloured run — and the only thing that keeps it that way is being the
     one WITHOUT `data-wash-end`. Ordering matters here: moving the marker down
     to this one would put it on yellow. */
  const venture = html.slice(
    html.indexOf('aria-labelledby="about-venture-title"'),
  );
  assert.doesNotMatch(venture.slice(0, 200), /data-wash-end/);

  /* **Both take the section entrance**, unlike the plate and the rooms, which
     decline it because they animate themselves. Two entrances on one block is
     what broke the plate, and prose with nothing of its own moving is exactly
     what `SectionEnter` was written for. */
  assert.equal(
    (html.match(/<section class="about-prose"[^>]*data-route-section/g) ?? []).length,
    3,
  );
  for (const block of html.match(/<section class="about-prose"[\s\S]*?<\/section>/g) ?? []) {
    assert.doesNotMatch(block, /data-enter/);
  }
});

test("the venture note is his, whole, and claims nothing measured", async () => {
  const html = await (await render("/about")).text();

  assert.match(html, /AI-native venture studio/);
  for (const line of VENTURE) {
    assert.match(html, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  /* **The strongest thing it says is "often".** No product is named, no count of
     them is given, no outcome is measured. This company does have three products
     and they are named on the homepage; pulling them in here would be a
     connection nobody asked me to draw. */
  assert.match(html, /often translating directly into value/);
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const prose = main.replace(/<[^>]*>/g, " ");
  assert.doesNotMatch(prose, /\b\d+\s*(products|ventures|startups|tools)\b/i);
  for (const product of ["Arvena", "Ftesa", "Ihrauto"]) {
    assert.doesNotMatch(prose, new RegExp(product, "i"));
  }
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
