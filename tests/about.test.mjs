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

/** The delivered archive, alphabetically — the real seven, not the eight
 *  placeholders the Clients page carries. PRODUCT.md records them and the owner
 *  confirmed on 2026-08-05 that they may be named as Mardal's work. Legal
 *  suffixes included: trimming those is editing a company's name. */
const CLIENTS = [
  "ANDI SPORT",
  "EN NUR",
  "Henor",
  "Jetonikeramika",
  "Spitex Schwab AG",
  "Stolzbau GmbH",
  "ZEN",
];

/** ⚠ The eight placeholder companies the Clients page carries, reused on About
 *  at the owner's request. NOT clients. Written out here, not imported, so this
 *  file states plainly what it is pinning. */
const BORROWED_NAMES = [
  "Nordvik",
  "Alturi",
  "Solvei",
  "Marren",
  "Brekk",
  "Vantor",
  "Lumea",
  "Kestrel",
];

/** ⚠ The fifteen written for this list when the owner asked for more, after the
 *  eight above ran out. NOT clients. Kept apart from them because the two are
 *  declared differently — those are imported, these are typed — and the test
 *  below holds each to its own rule. */
const INVENTED_NAMES = [
  "Astrel",
  "Brimhold",
  "Corvane",
  "Delmara",
  "Fennik",
  "Grisal",
  "Halvorn",
  "Ivrell",
  "Jarnek",
  "Kolvi",
  "Lestad",
  "Myrek",
  "Oskra",
  "Rendal",
  "Varek",
];

/** ⚠ Everything on the page that is not a client: twenty-three of thirty. */
const EXAMPLE_NAMES = [...BORROWED_NAMES, ...INVENTED_NAMES];

/** The line the page ends on, verbatim. His words, and the whole of them —
 *  a closing statement asserted by its first clause is a statement half
 *  covered, which is the mistake `VALUES` records. */
const CLOSING =
  "Every great achievement, company, and brand you know has one thing in common — they started small. One step, one idea, one tiny victory at a time. And many of the companies we work with started that way with us.";

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

test("the hero carries the artwork-less arrangement, and adds nothing to it", async () => {
  const html = await (await render("/about")).text();

  assert.match(html, /class="service-hero service-hero--bare"/);
  assert.match(html, /class="service-page service-page--about"/);
  assert.match(html, /class="service-hero__aside"/);

  /* ★ **And carries NOTHING of its own for the foot — owner, 2026-08-27:
     About, Blog and Contact are to match Careers.**

     This is asserted as an absence because the absence is the decision. Three
     rules used to stand here: `display: contents` on the aside above 48rem,
     which dissolved the wrapper so the sentence took column 1 and the link
     column 9, plus the support measure and link placement that arrangement
     needed, plus two more below 48rem undoing the first on a phone. They came
     from the 2026-08-26 ask to put the link on the right "like the other pages",
     where the other pages meant the five service pages — which stand their foot
     on two edges around artwork. Careers has no artwork and gathers its foot
     into one block in the corner, and that is the comparison now.

     Measured before the removal: About's sentence sat 730px from the right edge
     at a 1440 window, where Careers', Blog's and Contact's all sat at 40. After:
     all four report an identical computed arrangement — same display, same
     flex-direction, same align-items, same align-self on the link, same
     text-align — at 390, 1024 and 1440. What still differs between them is the
     WIDTH of the block, and only because the four sentences are 21, 43, 65 and
     111 characters long.

     Written against the whole prefix rather than a single property: any rule
     scoped to this page and this class is the thing that is not wanted, whatever
     it happens to declare. */
  assert.doesNotMatch(
    CSS,
    /\.service-page--about \.service-hero--bare\b/,
    "About has page-scoped foot rules again — the foot is `service-hero--bare` and nothing else, as it is on Careers, Blog, Contact and Clients",
  );

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

test("the sentence takes the site's support scale, not one of its own", () => {
  /* What survives from the rule this replaces, and the only part of it that was
     ever about the site rather than about this page.

     The measure it also carried — 30ch, six columns — went with the rest of
     About's foot on 2026-08-27; the sentence is held at `--bare`'s 26ch now, the
     same as every other artwork-less hero. The size is different in kind: it was
     set at 20-26px for an hour and the owner caught it as smaller than the other
     pages, and `--service-text-support` is one pixel scale for every service
     page. A page quietly opting out of it is how a scale stops being one.

     So the assertion inverts. There is no longer a page rule to read the size
     off — the base rule supplies it, which is the point — and what is checked is
     that nothing here sets a size of its own again. */
  const base = CSS.indexOf(".service-hero__support {");
  assert.ok(base > 0, "the shared support rule is gone");
  assert.match(
    CSS.slice(base, CSS.indexOf("}", base)),
    /font-size:\s*var\(--service-text-support\)/,
    "the shared support rule no longer carries the shared scale",
  );

  const pageScoped = [...CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(
    (m) =>
      /\.service-page--about\b/.test(m[1]) &&
      /\.service-hero__support\b/.test(m[1]) &&
      /font-size/.test(m[2]),
  );
  assert.equal(
    pageScoped.length,
    0,
    "About sets a support size of its own again, which is how a shared scale stops being one",
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
    /class="about-journey"[^>]*data-wash-end/,
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

  /* **And what the yellow turns INTO.** Owner: the colour should transition from
     that yellow to this. So the page had three grounds — white above the
     photograph, yellow through the middle, `#ffd7eb` from the note down — and a
     fourth under the closing line since. Each holds where it stops: a scrubbed tween holds its end state past the
     trigger, so the final section and the footer carry it.

     His, exactly as given, and safe under everything on it: 15.4:1 against
     `--ink`, 5.7 against the muted grey. Dark half derived the same way as the
     yellow's — hue held at 330, S 100 to 26, L 92 to 8 — and measured in the
     browser: #ffd7eb on the light page, #1a0f14 on the dark one, 16.6:1 against
     its ink. */
  assert.match(CSS, /--wash-about-end:\s*light-dark\(#ffd7eb, #1a0f14\)/);

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
  /* **The change finishes before the next section arrives, not under it.** At
     `bottom top` the colour was still moving while that section filled the
     screen, which reads as the page's colour following you down rather than as a
     section arriving.

     It was `bottom center` until the owner asked for the orange below to start
     earlier, 2026-08-26. The orange begins exactly where this ends, so this is
     what moved. Asserted here AND in the fourth-ground test, as a pair: half of
     this change applied is two grounds painting the same pixels. */
  assert.match(code, /end: "bottom bottom"/);

  /* **It turns into the second colour rather than draining back.** Both ends are
     read from tokens, so the component still knows no colours — and asserting
     the target is what keeps "transition to pink" from quietly becoming "fade to
     white" again, which is what it did before and looks almost the same in a
     still of the middle of the run. */
  assert.match(code, /resolve\("var\(--wash-about-end\)"\)/);
  assert.equal((code.match(/resolve\("var\(--canvas\)"\)/g) ?? []).length, 1);

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

  /* And every surface it painted is cleaned up, not just the first. Matched
     with the body of the loop, because the fourth ground below paints through a
     loop of the same shape and a bare `for (const surface of surfaces)` would
     be satisfied by that one. */
  assert.match(
    code,
    /for \(const surface of surfaces\) \{\s*surface\.style\.removeProperty\("background-color"\)/,
  );
});

test("the page turns once more under the closing line", () => {
  /* Owner, 2026-08-26, with a swatch: transition to this colour on the new
     text. So the page has FOUR grounds — white, `#faff89` through the middle,
     `#ffd7eb` from the end of the notes, and this under the last sentence. */
  assert.match(CSS, /--wash-about-close:\s*light-dark\(#ffa769, #1a130f\)/);

  /* His colour exactly as given, and the closing line is set in `--ink`: 10.5:1.
     The muted grey is 3.5, AA for large text and under it for small — and
     nothing muted sits on this ground, the only thing on it is that sentence
     and the footer's own purple slab. The same limit the yellow (7.0) and the
     pink (5.2) have, for the same reason.

     Dark half derived as theirs were: hue held at 25, S 100 to 26, L 71 to 8,
     16.3:1 against the dark page's ink. */

  const raw = readFileSync(
    new URL("../components/motion/SectionWash.tsx", import.meta.url),
    "utf8",
  );
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /querySelector<HTMLElement>\("\[data-wash-close\]"\)/);

  /* **It does not tween the background at all**, which is what lets it coexist
     with the run above it. Two scrubbed tweens on one property fight: whichever
     renders last in a frame wins and the loser goes on re-applying its own
     start value from outside its own range. This one tweens a plain object and
     paints from its progress.

     A `.to()` on that object does not render until it is reached, so nothing is
     painted at load — a `fromTo` here would paint the whole page pink from the
     hero down. */
  assert.match(code, /gsap\.to\(state, \{/);
  assert.match(code, /gsap\.utils\.interpolate\(from, to, state\.t\)/);

  /* Silent at rest, and this one line is the whole of it: at `t` zero the run
     above owns the colour, and painting there would fight it. */
  assert.match(code, /if \(state\.t <= 0\) return;/);

  /* **Its start is the run above's end, exactly.** That one ends at the
     journey's `bottom bottom`; this begins at the statement's `top bottom`, and
     the two sections share a border edge — so both resolve to the same scroll
     position without either being told about the other.

     Asserted as a pair, because the identity is what matters and either one
     changed alone breaks it: earlier and the two overlap and fight for the same
     pixels, later and the page sits finished-pink for a stretch.

     Both were `center` and both moved together when the owner asked for the
     orange sooner — half a window earlier, to the moment the closing section's
     top edge appears. Moving THIS one alone is the tempting version, because it
     is the one he asked about, and it is the bug the pair exists to catch. */
  assert.match(code, /end: "bottom bottom"/);
  assert.match(code, /start: "top bottom"/);

  /* Half a screen, and longer than the two above it (0.1 of a ~2100px run, so
     about 210px each) because nothing else is happening here: those arrive
     under a photograph opening and under notes replacing one another, and this
     arrives under one sentence that is not moving. */
  assert.match(code, /const CLOSE = 0\.5;/);
  assert.match(code, /"\+=" \+ window\.innerHeight \* CLOSE/);

  /* Resolved once rather than per frame — `resolve` puts a probe in the document
     and reads it back — and taken again on refresh, which is when a theme change
     lands. Without that the orange would stay the light page's after a flip. */
  assert.match(code, /onRefresh: \(\) => \{\s*from = resolve\("var\(--wash-about-end\)"\);\s*to = resolve\("var\(--wash-about-close\)"\);/);
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

test("the history is the one prose section left, and it still takes the entrance", async () => {
  const html = await (await render("/about")).text();

  /* One block written once and called twice — the history above the rooms and
     the note below them. It was `.about-story` while there was one of them, a
     name for the history rather than for the shape; the second section is what
     made the difference matter. Counted in the markup rather than assumed from
     the component, because a copy-paste of the JSX would render identically and
     drift from here on. */
  /* **One, not three.** The two notes below the photographs became a journey —
     one block that replaces itself — so this shape is the history alone now.
     Counted, because leaving a stray `.about-prose` behind would render a note
     twice: once here and once inside the journey's stage. */
  const sections = html.match(/<section class="about-prose"/g) ?? [];
  assert.equal(sections.length, 1);

  assert.match(html, /aria-labelledby="about-prose-title"/);
  assert.doesNotMatch(html, /about-values-title|about-venture-title/);

  /* The history is above the photographs and above the coloured run, so it must
     not carry the marker that ends it. */
  const history = html.slice(html.indexOf('aria-labelledby="about-prose-title"'));
  assert.doesNotMatch(history.slice(0, 200), /data-wash-end/);

  /* **Both take the section entrance**, unlike the plate and the rooms, which
     decline it because they animate themselves. Two entrances on one block is
     what broke the plate, and prose with nothing of its own moving is exactly
     what `SectionEnter` was written for. */
  assert.equal(
    (html.match(/<section class="about-prose"[^>]*data-route-section/g) ?? []).length,
    1,
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

test("the prose arrives a few words at a time, from the right", async () => {
  const html = await (await render("/about")).text();

  /* Every paragraph is split into words, and every paragraph carries the whole
     sentence as `aria-label` — a paragraph of separate spans is read as
     fragments otherwise. The service pages solve it the same way. */
  const lines = html.match(/<p class="about-prose__paragraph"[^>]*>/g) ?? [];
  /* Two: the history alone. The six below it belong to the journey, which takes
     their words AWAY on scroll rather than bringing them in, and marks them with
     its own attribute so the two treatments cannot both claim a word. */
  assert.equal(lines.length, 2);
  for (const line of lines) {
    assert.match(line, /aria-label="/);
    assert.match(line, /data-prose-line/);
  }
  assert.ok((html.match(/data-prose-word/g) ?? []).length > 60);
  assert.ok((html.match(/data-journey-word/g) ?? []).length > 150);

  const raw = readFileSync(
    new URL("../components/motion/ProseReveal.tsx", import.meta.url),
    "utf8",
  );
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /"use client"/);
  assert.match(code, /prefers-reduced-motion:\s*reduce/);
  const guard = code.indexOf("prefers-reduced-motion");
  assert.ok(guard > 0 && guard < code.indexOf("gsap.context"));

  /* **The service run's own numbers**, copied deliberately so the two read as
     one idea: three words to a group, a 0.22 window per group over a 0.78
     spread, smoothstepped, drifting 14px. There it is `renderWordExit` and the
     copy LEAVES toward the left; here the same shape runs forwards and the words
     arrive from the right. */
  assert.match(code, /const GROUP = 3;/);
  assert.match(code, /const DRIFT = 14;/);
  assert.match(code, /const WINDOW = 0\.22;/);
  assert.match(code, /const SPREAD = 0\.78;/);
  assert.match(code, /local \* local \* \(3 - 2 \* local\)/);

  /* **The stagger itself, not just the constant that feeds it.** Asserting
     `SPREAD = 0.78` passes with the whole calculation deleted — the constant
     sits there unused and every word arrives at once, which is a fade, not this.
     The expression is what makes it a stagger. */
  assert.match(code, /\(group \/ \(groups - 1\)\) \* SPREAD/);
  assert.match(code, /\(progress - start\) \/ WINDOW/);

  /* **`opacity`, never `autoAlpha`.** The service version uses autoAlpha, which
     sets `visibility: hidden` at zero — fine where words start visible and are
     being taken away. Here they start hidden, and hidden text is out of the
     accessibility tree and out of find-in-page until it arrives. */
  assert.match(code, /opacity: eased/);
  assert.doesNotMatch(code, /autoAlpha/);

  /* Per paragraph. A note here is three paragraphs and most of a screen tall;
     staggered as one block the last words arrive long after they are read. */
  assert.match(code, /trigger: paragraph/);
  assert.match(code, /scrub:/);
});

test("the two notes are one block that replaces itself", async () => {
  const html = await (await render("/about")).text();

  const journey = html.slice(
    html.indexOf('class="about-journey"'),
    html.indexOf("</section>", html.indexOf('class="about-journey"')),
  );

  /* Both notes are cards in one stage, each carrying its own heading as data —
     that is what the swap reads from. */
  assert.equal((journey.match(/data-journey-card/g) ?? []).length, 2);
  assert.match(journey, /data-journey-heading="Small by choice"/);
  assert.match(journey, /data-journey-heading="AI-native venture studio"/);

  /* **The heading is OUTSIDE the stage, and that is the whole difference the
     owner named.** In the service journey the heading belongs to the card and
     leaves with it; here it holds its column and its text is swapped. Asserted
     as document order — the title element before the stage opens — because a
     heading moved inside would still render and would then travel. */
  const title = journey.indexOf("data-journey-title");
  const stage = journey.indexOf("data-journey-stage");
  assert.ok(title > 0 && stage > 0 && title < stage, "the heading is inside the stage");

  /* It changes without the page navigating, so a reader who cannot see the swap
     gets nothing without this. */
  assert.match(journey, /aria-live="polite"/);

  /* The page's colour ends over this block, which the pin makes the longest
     thing on the page. */
  assert.match(html, /class="about-journey"[^>]*data-wash-end/);

  /* It animates itself, so it declines the section entrance — two entrances on
     one block is what broke the plate. */
  assert.match(html, /class="about-journey"[^>]*data-enter-mode="none"/);

  /* **A card is the whole stage**, one at a time. At 48% the next note parked
     beside the current one and both were readable, which is the thing that was
     wrong. The measure stays on the paragraph, because a note at the full width
     of this column runs to about ninety characters a line. */
  const card = CSS.indexOf(".about-journey__card {");
  assert.match(CSS.slice(card, CSS.indexOf("}", card)), /width:\s*100%/);
  const line = CSS.indexOf(".about-journey__paragraph {");
  assert.match(CSS.slice(line, CSS.indexOf("}", line)), /max-width:\s*52ch/);
});

test("the journey pins, hands over, and takes the words leftward", () => {
  const raw = readFileSync(
    new URL("../components/motion/AboutJourney.tsx", import.meta.url),
    "utf8",
  );
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /"use client"/);
  assert.match(code, /prefers-reduced-motion:\s*reduce/);

  /* ★ **It runs on a phone too — owner, 2026-08-27.**

     It was gated twice: on reduced motion, and on `(max-width: 64rem)` because
     below that the stage was a static grid with nothing stacked to slide. The
     second gate is gone and so is the layout that justified it — the stage
     stacks its cards at every width now.

     Asserted as an absence, because a width question reappearing in here is
     precisely the regression: the stylesheet no longer has a width at which the
     cards are un-stacked, so a script that still bailed at one would leave two
     notes sitting on top of each other. */
  assert.doesNotMatch(
    code,
    /matchMedia\([^)]*max-width/,
    "AboutJourney asks a width question again — the stage stacks at every width, so bailing on one leaves the notes overlapping",
  );

  /* And the one gate that remains still un-stacks them, rather than just
     stopping the script. Reduced motion is the only state where nothing
     separates the cards, so the stylesheet has to put them back in flow. */
  const calm = CSS.indexOf("@media (prefers-reduced-motion: reduce)", CSS.indexOf(".about-journey"));
  assert.ok(calm > 0, "nothing un-stacks the notes when motion is declined");
  const calmBlock = CSS.slice(calm, CSS.indexOf("\n}", CSS.indexOf(".about-journey__card", calm)));
  assert.match(calmBlock, /\.about-journey__card \{[^}]*position:\s*static/);

  /* **The stage is measured, not declared.** The CSS floor is 22rem, written for
     a desktop column beside a heading. Measured at a 320px window the taller
     note is 414px — 62px past that floor, which is a note running into whatever
     follows it. Read from the cards on every refresh instead. */
  assert.match(code, /offsetHeight/);
  assert.match(code, /addEventListener\("refreshInit"/);
  assert.match(code, /removeEventListener\("refreshInit"/);

  /* **And the note waiting its turn cannot widen the page.** It stands a
     stage-width to the right, which used to be caught only by ScrollSmoother's
     wrapper — and the smoother is killed wherever the mobile menu takes over.
     Measured before the clip: a 732px document in a 390px window. */
  const section = CSS.indexOf(".about-journey {");
  assert.ok(section > 0, "the journey section has no rule");
  assert.match(
    CSS.slice(section, CSS.indexOf("}", section)),
    /overflow-x:\s*clip/,
    "the journey no longer keeps its parked note off the page, so /about scrolls sideways on a phone",
  );

  /* The pin is the mechanism, and its length is per note. Measured: the spacer
     added 1641px against an expected 1642 on a 912px window. */
  assert.match(code, /pin: viewport/);
  assert.match(code, /const PER_NOTE = 0\.9;/);
  assert.match(code, /window\.innerHeight \* PER_NOTE \* cards\.length/);

  /* **One note on screen at a time, which is a correction.** The service journey
     shows two — the one being read and the next standing a column over — which
     is right there, where cards are half the stage and the pair reads as a set.
     Here it read as two notes side by side, and the owner asked for one at a
     time, the second arriving as the first goes.

     So the outgoing words are gone by LEAVES and the incoming one does not begin
     until HANDOVER, with air between them; and the incoming card is invisible
     until it starts moving, so nothing shows through the one still being read.
     Measured at rest: card A at x 0 fully opaque, card B at opacity 0 and x 885,
     one whole stage width off to the right. */
  assert.match(code, /const LEAVES = 0\.5;/);
  assert.match(code, /const HANDOVER = 0\.55;/);
  assert.match(code, /\(progress - 0\.02\) \/ \(LEAVES - 0\.02\)/);
  assert.match(code, /opacity: isCurrent \? 1 : isNext \? handover : 0/);

  /* A card is the stage now, so it travels a stage's width rather than a column
     of one. */
  assert.match(code, /const column = stage\.clientWidth;/);
  assert.match(code, /\(1 - handover\) \* column/);

  /* And the outgoing one's words leave LEFTWARD in groups of three — the service
     run's own shape and its own numbers. */
  assert.match(code, /const GROUP = 3;/);
  assert.match(code, /x: eased \* -DRIFT/);
  assert.match(code, /\(group \/ \(groups - 1\)\) \* SPREAD/);

  /* `opacity`, not `autoAlpha`: hidden text is out of find-in-page, and here a
     whole note is hidden at a time rather than a word. */
  assert.doesNotMatch(code, /autoAlpha: 1 - eased|opacity: 1 - eased.*autoAlpha/);
  assert.match(code, /opacity: 1 - eased/);

  /* **The heading goes before it changes and comes back after.** It swapped its
     text on one frame, which is a cut in the middle of a block where everything
     else is scrubbed. It leaves upward as the note under it dissolves, the text
     is written while nothing is on screen to see it change, and it arrives from
     below with the note it belongs to.

     Checked as arithmetic, since the run cannot be scrolled in the automation
     tab: solid to 0.32, fading and lifting to -6.5 by 0.49, opacity 0 at 0.50
     where the swap happens, invisible through the gap to 0.55, then rising from
     +8 to 0 by the end. The `y` jump at the swap is unseen because it happens
     at zero — which is the whole reason the swap is placed there. */
  assert.match(code, /const TITLE_FADE = 0\.18;/);
  assert.match(code, /const TITLE_LIFT = 8;/);
  assert.match(code, /const swapped = !last && local >= LEAVES;/);
  assert.match(code, /const opacity = last \? 1 : Math\.max\(1 - leaving, handover\)/);

  /* **And that the heading is actually SET from it.** Asserting the calculation
     exists passes with `opacity: 1` written into the `gsap.set` and the variable
     left sitting there unused — the heading cuts again and the arithmetic above
     is still perfect. Third time in this file that a computed value has been
     asserted without asserting its use. */
  assert.match(code, /gsap\.set\(heading, \{\s*opacity,/);

  /* Away upward, back from below — not the same direction twice, which reads as
     the heading sliding past rather than as one leaving and another coming. */
  assert.match(code, /\(1 - handover\) \* TITLE_LIFT/);
  assert.match(code, /-leaving \* TITLE_LIFT/);

  /* **The heading is written only when it changes.** Setting the same string
     every frame makes a polite live region announce on every one of them. */
  assert.match(code, /if \(showing !== announced\)/);
});

test("the page ends on the owner's line, whole and last", async () => {
  const html = await (await render("/about")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));

  /* Written out here rather than imported. A test that reads the module the
     page reads asserts only that a file equals itself, and this is his
     sentence — changing a word of it has to be a decision made twice. */
  assert.ok(main.includes(CLOSING), "the closing line is not on the page");

  /* **Last, and after the notes.** He asked for it at the end of the scrolling
     text, so the journey has to be above it. Compared inside `<main>`: the RSC
     payload repeats the markup further down the document, and a position taken
     from the whole file can land in the copy. */
  const notes = main.indexOf('class="about-journey"');
  const line = main.indexOf(CLOSING);
  assert.ok(notes > 0, "the journey is not on the page");
  assert.ok(line > notes, "the closing line is above the notes it should follow");

  /* **One section below it, and it is the client list.** He asked for the line
     at the end of the scrolling text and then for the clients under it, so
     "last" means last of the two now. The way out below both is the footer's.

     Written as a count rather than as "no sections after", which is what this
     said while the line really was last — an assertion that has to be rewritten
     every time something is added to the page is one that will be rewritten
     without being read. */
  const below = main.slice(line).match(/<section[^>]*class="([\w-]+)"/g) ?? [];
  assert.deepEqual(below, ['<section class="about-clients"']);

  /* **Set as a title, not marked as one.** 211 characters announced as a
     landmark is not a heading, whatever face it wears — a reader moving through
     this page by heading would meet the whole sentence as one stop. Asserted on
     the document rather than on the section, so wrapping it in an `<h2>`
     anywhere fails. */
  for (const level of [1, 2, 3, 4, 5, 6]) {
    for (const heading of main.match(new RegExp(`<h${level}[^>]*>[\\s\\S]*?</h${level}>`, "g")) ?? []) {
      assert.ok(
        !heading.includes(CLOSING.slice(0, 40)),
        `the closing line is set as an h${level}`,
      );
    }
  }
  assert.match(main, /<p class="about-statement__line">/);

  /* It takes the site's entrance, which is what a section with nothing of its
     own moving is for — and it has no heading to trigger on, so SectionEnter
     falls back to the section's own box. The plate above does the same.

     `data-wash-close` is the page's fourth ground: the colour turns orange
     under this sentence. One on the page, and it is this section. */
  assert.match(
    main,
    /<section class="about-statement" data-route-section="true" data-wash-close="true">/,
  );
  assert.equal((main.match(/data-wash-close/g) ?? []).length, 1);

  /* **It is not a second wash marker.** The colour ends at the journey; a
     `data-wash-end` down here would stretch the change over this block too and
     the page would still be turning pink while the last line was being read.
     One on the page, and it is above this. */
  assert.equal((main.match(/data-wash-end/g) ?? []).length, 1);
  assert.doesNotMatch(main.slice(line), /data-wash-end/);
});

test("the client list is seven real names and twenty-three examples", async () => {
  const html = await (await render("/about")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const at = main.indexOf('<section class="about-clients"');
  assert.ok(at > 0, "there is no client section");
  const section = main.slice(at, main.indexOf("</section>", at));

  /* **The seven are the delivered archive**, recorded in PRODUCT.md and
     confirmed by the owner on 2026-08-05 as work Mardal may name. Written out
     here rather than imported: a test that reads the module the page reads
     asserts only that a file equals itself, and which names go on a public page
     is the one decision on this section worth making twice. */
  for (const name of CLIENTS) {
    assert.ok(section.includes(name), `${name} is missing from the client list`);
  }

  /* **And twenty-three are examples**, added at the owner's request after he was
     told the archive holds seven and no more, and extended when he asked for
     more. Eight are the Clients page's own placeholders; fifteen were written
     for this list because there were only ever eight. See the test below, which
     is what stops any of them shipping. */
  for (const name of EXAMPLE_NAMES) {
    assert.ok(section.includes(name), `${name} is missing from the client list`);
  }

  /* **A name and nothing else.** No sector, no country, no year, no count —
     none of those is recorded per client and every one is the kind of fact that
     goes unchecked once it is set in type. Asserted by reading the section's
     whole visible text: anything added to it has to be added here too. */
  const words = section
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const shown = [...CLIENTS, ...EXAMPLE_NAMES].sort((a, b) => a.localeCompare(b, "en"));
  assert.equal(words, ["Our clients", ...shown].join(" "));

  /* **Alphabetical over the whole list, which is doing two jobs.** It is the one
     order that does not rank them — PRODUCT.md lists the real ones by how strong
     the artefact is, and carrying that onto a public page turns a list into a
     league table. And sorted TOGETHER, the real names are not a block at the top
     with the filler beneath, which is the arrangement that quietly tells a
     reader which is which.

     Derived, not restated: the order asserted above is computed from the two
     lists, so this checks the page agrees with it. */
  const order = shown.map((name) => section.indexOf(name));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));

  /* A real list. Thirty names in two columns is a list whatever it is drawn as,
     and "list, 30 items" is what a screen reader has instead of the columns. */
  assert.match(section, /<ul class="about-clients__list">/);
  assert.equal(
    (section.match(/<li class="about-clients__name"/g) ?? []).length,
    shown.length,
  );

  /* Named for the outline, and taking the site's entrance like the prose does. */
  assert.match(section, /aria-labelledby="about-clients-title"/);
  assert.match(section, /data-route-section="true"/);
});

test("the example names are invented, marked, and cannot ship quietly", async () => {
  const source = readFileSync(
    new URL("../content/about.ts", import.meta.url),
    "utf8",
  );

  /* ⚠ **TWENTY-THREE OF THE THIRTY NAMES ON THIS PAGE ARE INVENTED AND MUST NOT
     SHIP.**

     Pinned the way the Clients page's are in `rendered-html.test.mjs`, and for
     the same reason: so publishing means deleting a test on purpose rather than
     forgetting a comment, which is exactly what nobody is reading on the day
     this goes live. None of these is a company Mardal has worked for. Under a
     heading reading "Our clients", alphabetised in among the real seven, a
     reader has no way at all to tell which is which.

     Delete this test in the same commit that puts real names in. */
  const html = await (await render("/about")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  for (const invented of EXAMPLE_NAMES) {
    assert.ok(main.includes(invented), `${invented} is not on the page`);
  }

  /* **The eight are borrowed, not re-invented.** The Clients page already carries
     them; typing them again here would give the site a third place to delete
     them from. Imported, replacing them in `content/case-studies.ts` carries
     this list with it — and this assertion is what keeps that true, because the
     tempting edit is to paste the strings in. */
  assert.match(source, /const BORROWED = clientEntries\.map\(\(entry\) => entry\.name\)/);
  assert.match(source, /import \{ clientEntries \} from "\.\/case-studies"/);
  for (const borrowed of BORROWED_NAMES) {
    assert.ok(
      !source.includes(`"${borrowed}"`),
      `${borrowed} is typed into content/about.ts instead of imported`,
    );
  }

  /* **The fifteen are declared here, in one array, under the warning.** They had
     to be written somewhere — there were only ever eight placeholders — and the
     thing that matters is that they are in ONE place with a marker on it, not
     scattered into the real list where nothing records what they are. */
  const invented = source.indexOf("const INVENTED = [");
  assert.ok(invented > 0, "the written examples are not declared");
  assert.deepEqual(
    [...source.slice(invented, source.indexOf("]", invented)).matchAll(/"([^"]+)"/g)].map(
      (m) => m[1],
    ),
    INVENTED_NAMES,
  );
  const warned = source.slice(0, invented);
  assert.match(warned.slice(warned.lastIndexOf("/**")), /INVENTED|MUST NOT SHIP/);

  /* **The real list holds only the real names.** The failure this catches is an
     example being appended to `DELIVERED` — after which nothing on the page,
     and nothing in the source, records that it was never a client. */
  const at = source.indexOf("const DELIVERED = [");
  assert.ok(at > 0, "the delivered archive is not declared");
  const delivered = [
    ...source.slice(at, source.indexOf("]", at)).matchAll(/"([^"]+)"/g),
  ].map((m) => m[1]);
  assert.deepEqual(delivered, CLIENTS);

  /* And the borrowed set says what it is too, in the place someone editing it
     looks. */
  const marker = source.slice(0, source.indexOf("const BORROWED"));
  assert.match(marker.slice(marker.lastIndexOf("/**")), /INVENTED|MUST NOT SHIP/);
});

test("the client list is a label beside two columns", () => {
  const at = CSS.indexOf(".about-clients__list {");
  assert.ok(at > 0, "the client list has no rule");
  const list = CSS.slice(at, CSS.indexOf("}", at));

  /* **Columns 9 to 12, and the number came off the reference.** The capture is a
     2874px retina shot of a 1437px window, so everything in it halves: the names
     begin at 0.658 of the width and the second column at 0.812. Four of twelve
     puts the left edge at 0.664 and holds there — 0.667 at 2560, 0.664 at 1025 —
     because the gutter and the gap are both clamped and the drift between them
     is under half a column.

     It was 6 / -1, which is where this page puts prose beside a heading. That is
     0.427 of the window: a reading column, not the reference's right-hand
     quarter. */
  assert.match(list, /grid-column:\s*9 \/ -1/);
  assert.match(list, /columns:\s*2/);
  assert.match(list, /list-style:\s*none/);

  /* **A black rule on top.** Owner's word: black. `var(--ink)` is #08080a on the
     light page and turns over with the theme, which a literal `black` would not
     — a hairline that stays black on the dark page is an invisible line.

     Full strength, not `--line-soft`: that token is the ink at 16% and is what
     this site rules rows with. On the orange ground it would be a crease.

     On the INNER, so the line runs gutter to gutter with the label and the names
     rather than edge to edge with the window. */
  const inner = CSS.indexOf(".about-clients__inner {");
  assert.ok(inner > 0, "the client section has no inner rule");
  const box = CSS.slice(inner, CSS.indexOf("}", inner));
  assert.match(box, /border-top:\s*1px solid var\(--ink\)/);
  assert.doesNotMatch(box, /--line-soft|:\s*black|#000/);
  assert.match(box, /padding-top:/);

  const head = CSS.indexOf(".about-clients__title {");
  assert.ok(head > 0, "the client label has no rule");
  const title = CSS.slice(head, CSS.indexOf("}", head));
  assert.match(title, /grid-column:\s*1 \/ span 4/);

  /* **The normal face, at reading size.** Owner: the title in the normal font
     and smaller. It was `--type-title` at up to 64px — this page's treatment for
     a section heading, which the history and the notes both carry — and it is
     not the reference's: there the label is a quiet marker in the same face as
     everything else and the names are the only thing being read. */
  assert.match(title, /font-family:\s*var\(--type-body\)/);
  assert.doesNotMatch(title, /--type-title|--type-display/);
  assert.match(title, /font-size:\s*var\(--text-copy\)/);

  /* Written out rather than left off. `--tracking-display` is -0.03em, set for
     type at 40px and up where it closes gaps the eye reads as slack; at 17px it
     is just tight, and a heading rule that inherits it is the easy mistake when
     this block is copied from the one above. */
  assert.match(title, /letter-spacing:\s*normal/);
  assert.doesNotMatch(title, /--tracking-display/);

  /* **The pitch is 1.75em**, which is the reference's 29.5px at the size the
     names take at 1440 (16.6px). It was 2.05 — 1.2 leading and 0.85 under each
     name — which is 37 to 49px, and "closer" is what the owner asked for. */
  const row = CSS.indexOf(".about-clients__name {");
  assert.ok(row > 0, "the names have no rule");
  const rule = CSS.slice(row, CSS.indexOf("}", row));
  assert.match(rule, /line-height:\s*1\.2/);
  assert.match(rule, /margin-block-end:\s*0\.55em/);
  assert.match(rule, /font-size:\s*clamp\(0\.9375rem, 1\.15vw, 1\.125rem\)/);

  /* Multi-column will split a name between the columns without this, and a name
     is not a paragraph. */
  assert.match(rule, /break-inside:\s*avoid/);

  /* **Two columns run out at about 363px of window**, measured with the real
     face: the longest name is 8.62em of Geist, which is 155px at the small end
     of the size clamp, and a column is (container - gap) / 2. The fallback is
     at 24rem because 360px phones exist, and `Spitex Schwab AG` wrapping to two
     lines beside `ZEN` is not a column, it is a wrap. */
  const narrow = CSS.indexOf("@media (max-width: 24rem)", at);
  assert.ok(narrow > 0, "the columns never collapse");
  assert.match(CSS.slice(narrow, CSS.indexOf("}\n}", narrow)), /columns:\s*1/);

  /* And it stacks where the rest of the page stacks. */
  const stack = CSS.indexOf("@media (max-width: 64rem)", at);
  assert.ok(stack > 0 && stack < narrow, "the client section never stacks");
  const query = CSS.slice(stack, CSS.indexOf("}\n}", stack));
  assert.match(query, /\.about-clients__title,\s*\n\s*\.about-clients__list \{/);
  assert.match(query, /grid-column:\s*1 \/ -1/);
});

test("the closing line is set on the display face, and balanced", () => {
  const at = CSS.indexOf(".about-statement__line {");
  assert.ok(at > 0, "the closing line has no rule");
  const rule = CSS.slice(at, CSS.indexOf("}", at));

  /* Owner: in our title font. That is `--type-title`, the face the hero and the
     history heading carry — not `--type-display`, which is the sans. */
  assert.match(rule, /font-family:\s*var\(--type-title\)/);
  assert.doesNotMatch(rule, /var\(--type-display\)/);

  /* Owner: in the middle. */
  assert.match(rule, /text-align:\s*center/);
  assert.match(rule, /margin:\s*0 auto/);

  /* **21em, and the unit is the point.** A measure in `em` is a measure in
     characters, so the sentence is the same four lines at every size rather
     than re-breaking as the clamp grows. Measured in the real face at this
     tracking: the whole sentence is 77.1em, four even lines want 19.3em each,
     and greedy wrapping at 21em gives 20.2 / 19.6 / 18.5 / 18.2.

     Asserted as `em` explicitly. The obvious "tidy-up" here is a round pixel
     number or a `ch`, and both of them break the line count loose from the
     size — 21ch is a third of the width, and 21em at the small end of the clamp
     is not the same column as 21em at the large end unless it is written in the
     unit that follows it. */
  assert.match(rule, /max-width:\s*21em/);

  /* Bounded so the measure never has to give way to the page's column: 21em at
     3.4vw is 857px inside a 1120px column at 1200 and 1028 inside 1360 at 1440,
     and the cap stops it growing before the column does. */
  assert.match(rule, /font-size:\s*clamp\(1\.5rem, 3\.4vw, 3\.5rem\)/);

  /* A refinement, not the thing holding the shape — the sentence is four lines
     within an em of even with it turned off. It is here because it costs
     nothing and evens the last line where it is supported. */
  assert.match(rule, /text-wrap:\s*balance/);

  /* Not the heading leading. `--leading-heading-xl` is 0.94, set for a
     three-word title on one line; four lines of it collide. */
  assert.match(rule, /line-height:\s*var\(--leading-heading\)/);
  assert.doesNotMatch(rule, /--leading-heading-xl/);
});

test("the closing line's measure survives the build", () => {
  /* The stylesheet is not what ships. `max-width: none` was dropped by the
     minifier as an initial value and four of five slice copies drew nothing
     because of it, so a measure that decides a line count is checked in the
     built file rather than in the source. */
  const dist = new URL("../dist/client/assets/", import.meta.url);
  const sheet = readdirSync(dist).find((name) => name.endsWith(".css"));
  assert.ok(sheet, "no built stylesheet");
  const built = readFileSync(new URL(sheet, dist), "utf8");

  const at = built.indexOf(".about-statement__line{");
  assert.ok(at > 0, "the closing line's rule is not in the built stylesheet");
  const rule = built.slice(at, built.indexOf("}", at));

  assert.match(rule, /max-width:21em/);
  assert.match(rule, /text-wrap:balance/);
  assert.match(rule, /text-align:center/);
  assert.match(rule, /font-family:var\(--type-title\)/);
});

test("every card's pattern is its own tint, thinned", () => {
  /* Owner: on all five boxes make the pattern a little pale, around 20%
     transparent. So each mark is its tint's bar with `cc` on the end.

     **Derived here rather than trusted, because it is written out.**
     `color-mix` was the obvious way to express it and does not survive the
     build — it compiles to an `@supports` block whose fallback the build makes
     itself by dropping the percentage, serving the colour at full strength to
     anything without it. Six hex digits and an alpha pair compile to themselves,
     and the price is that the mark no longer follows its token automatically.
     `--tint-butter-bar` has been three different colours in one afternoon, so
     this is the check that a fourth cannot land without its card following. */
  const bars = Object.fromEntries(
    [...CSS.matchAll(/--tint-(\w+)-bar: (#[0-9a-f]{6});/g)].map((m) => [m[1], m[2]]),
  );
  assert.equal(Object.keys(bars).length, 5);

  for (const [tint, hex] of Object.entries(bars)) {
    const card = CSS.indexOf(`--card-tint: var(--tint-${tint});`);
    assert.ok(card > 0, `${tint} is not on a card`);
    const rule = CSS.slice(card, CSS.indexOf("}", card));
    assert.match(
      rule,
      new RegExp(`--card-tint-bar: ${hex}cc;`),
      `${tint}'s mark is not its own bar thinned — the bar is ${hex}`,
    );
  }

  /* And the panels are untouched: it was built the other way round first, with
     the panel derived from the bar, and that was the wrong half. */
  assert.equal((CSS.match(/--card-tint: var\(--tint-\w+\);/g) ?? []).length, 5);
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

  /* About took the count to ten. Contact took it to nine on 2026-09-13, so what
     is held here is that it never climbs back past ten — a page graduating
     after About is not About coming back, and must not fail About's test. */
  const count = Number(table.match(/const PLACEHOLDER_PAGES = (\d+);/)?.[1]);
  assert.ok(count > 0 && count <= 10, `the placeholder table counts ${count}`);
});
