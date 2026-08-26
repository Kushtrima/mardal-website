import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

/** The anchors that are still on the page. The menu also links to Services,
 *  Company and Products, whose sections are not on the page, and to Clients,
 *  which is not an anchor at all any more but a link to /case-studies — the
 *  seven sectors in its panel are the anchors from `finance` down. */
const menuAnchors = [
  "solutions",
  "products",
  "arvena-ai",
  "ftesa",
  "ihrauto",
  "finance",
  "healthcare",
  "manufacturing",
  "automotive",
  "retail",
  "logistics",
  "public-sector",
];

test("server-renders the Mardal homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Mardal — Innovation lives here<\/title>/i);

  // Hero
  assert.match(html, /Innovation/);
  assert.match(html, /lives here/);
  /* ── What Makes Us Different: five boxes, five colours ──
     This block was destroyed on 2026-08-25 along with the header assertions, in
     the commit that replaced the Clients taxonomy, and its absence is why
     giving the fifth box its own colour changed nothing in the suite. Rebuilt
     here, for what the section is now rather than what it was.

     **The tints are a list, not a modulo.** They cycled `one two three four
     one` over five cards, so AI & Automation wore Branding's lilac — two
     identical boxes two rows apart, which reads as an oversight rather than as
     a rhythm. `--five` is `--tint-clay` — panel `#ffb6a6`, bar `#fd7979`, both
     the owner's and both replaced once since this block was written. The hex is
     deliberately NOT asserted anywhere: the sequence is structure and belongs
     in a test, the colours are taste and belong to him.

     Sliced to the first five, because the markup is followed by the RSC payload
     and every class name appears in it twice. */
  assert.match(html, /What Makes Us/);
  assert.match(html, /Five connected services\. One team\./);
  assert.equal((html.match(/class="difference-card /g) ?? []).length, 5);
  assert.deepEqual(
    [...html.matchAll(/difference-card--(\w+)/g)].map((m) => m[1]).slice(0, 5),
    ["one", "two", "three", "four", "five"],
  );
  /* Five is the last of them. A sixth box would silently wear no tint at all —
     `TINTS[index % TINTS.length]` would hand it "one" again, which is the bug
     this whole change was about. */
  assert.doesNotMatch(html, /difference-card--six/);

  /* **The seven industries are text, and only `Explore All` goes anywhere.**

     They have been three things: anchors to a run further down this page, which
     only ever scrolled you; links to `/case-studies/{id}`, a sector view of the
     Clients page; then, when that taxonomy was removed, seven links all
     pointing at `/case-studies` — seven different words promising one
     destination, which is what the owner took out on 2026-08-25.

     Both halves are asserted, because each catches the other's failure. Seven
     items still render — a name silently losing its element would otherwise
     pass — and none of them is an anchor. */
  /* The item itself, not its children. `industries-item__name`, `__mark` and
     `__note` all begin with the block's own name, so a prefix match found 35
     elements where there are 7 — the modifier is what tells the block from the
     things inside it. */
  const industryItems = [
    ...html.matchAll(/<(\w+) [^>]*class="industries-item industries-item--\w+"/g),
  ];
  assert.equal(industryItems.length, 7);
  assert.deepEqual([...new Set(industryItems.map((m) => m[1]))], ["div"]);

  /* The way out is still a link, and it is the only one on this run. */
  assert.match(html, /<a [^>]*class="industries-explore"[^>]*href="\/case-studies"|<a [^>]*href="\/case-studies"[^>]*class="industries-explore"/);

  /* And nothing here promises a press: the finger came off with the link. */
  assert.doesNotMatch(html, /class="industries-item[^"]*"[^>]*data-cursor/);

  /* And the one that does not narrow. `Explore` pointing at `#contact` was the
     only destination this run had before the Clients page existed — seven
     sectors naming an audience and then handing you an email address. Both
     halves are pinned: the label, and that the dead anchor is gone. */
  const explore = html.match(/<a ([^>]*industries-explore[^>]*)>([^<]*)/);
  assert.ok(explore, "the way on from the industries run is missing");
  assert.match(explore[1], /href="\/case-studies"/);
  assert.match(explore[2], /Explore All/);
  assert.doesNotMatch(html, /industries-explore[^>]*href="#contact"/);
  assert.equal(
    (html.match(/class="[^"]*product__arrow[^"]*"/g) ?? []).length,
    3,
  );
  assert.doesNotMatch(html, /button--flat|shape-flat/);
  // Each product states the two things actually known about it, against a
  // rule, the way the reference sets its facts.
  assert.equal((html.match(/class="product-fact"/g) ?? []).length, 9);
  assert.match(html, /<p class="product-fact__label">Status<\/p>/);
  assert.match(html, /<p class="product-fact__label">Field<\/p>/);
  assert.match(html, /<p class="product-fact__label">Year<\/p>/);
  // Three years, supplied by the owner, one apiece.
  for (const year of ["2025", "2024", "2026"]) {
    assert.match(
      html,
      new RegExp(`<p class="product-fact__value">${year}</p>`),
      `missing ${year}`,
    );
  }
  assert.doesNotMatch(html, /\[Year\]/);
  assert.match(html, /Mental health/);
  assert.match(html, /Automotive/);
  assert.match(html, /Events/);
  assert.doesNotMatch(html, /cases-record|Selected/);
  // No drawn mark of any kind, and no panel: each product leads with a
  // photograph instead.
  assert.doesNotMatch(html, /product-mark|product-card|product__panel/);
  assert.equal((html.match(/class="product__name"/g) ?? []).length, 3);
  assert.equal((html.match(/class="product__image"/g) ?? []).length, 3);
  // Three different photographs, each with alt text, each sized so the page
  // does not shift as they load.
  const productImages = [
    ...html.matchAll(/<img class="product__image"[^>]*src="([^"]+)"[^>]*>/g),
  ];
  assert.equal(productImages.length, 3);
  assert.equal(new Set(productImages.map((image) => image[1])).size, 3);
  for (const image of productImages) {
    assert.match(image[0], /alt="[^"]+"/);
    assert.match(image[0], /width="1600" height="1000"/);
    assert.match(image[1], /^https:\/\/images\.unsplash\.com\//);
  }
  // The words sit beside the products, not above them.
  assert.match(html, /class="products-layout"/);
  assert.doesNotMatch(html, /product-mark[^>]*fill="#/);
  // The ring that ran through the industries is gone; the words stay.
  assert.doesNotMatch(html, /industry-art/);
  // The footer carries the address now that the contact section is gone.
  assert.match(html, /info@mardal\.co/);

  // Services, solutions, case study, process, products and contact are all off
  // the page: these strings live in the sections, not in the menu that links to
  // them, so the menu is unaffected.
  assert.doesNotMatch(html, /Services built around the way you work/);
  assert.doesNotMatch(html, /Compliance-aware systems/);
  assert.doesNotMatch(html, /shaped into a product|Case study in progress/);
  assert.doesNotMatch(html, /A simple path from idea to working software/);
  // The contact section is still off the page — but its words now close the
  // footer, which is where the page's one call to action lives.
  assert.doesNotMatch(html, /Start a conversation/);

  /* ── The header, and a note on why this block had to be rebuilt ──
     Every assertion below existed and was DESTROYED on 2026-08-25, in the
     commit that replaced the Clients taxonomy: that change rewrote large parts
     of this file and took the whole header block with it. Nothing failed,
     because what was lost was coverage rather than behaviour — and it stayed
     lost until the services were reordered and the suite went on passing.

     A green suite after a deliberate change is the symptom worth naming here.
     That is what a missing assertion looks like from the outside. */

  /* The panel is its list and nothing else: no eyebrow, no sentence under it,
     no 01-07 counters. Each restated what the word you pressed already said. */
  assert.doesNotMatch(html, /mega-menu__(meta|eyebrow|description|number|view-all)/);
  assert.match(html, /class="mega-menu__links"/);

  /* **The five services, in the owner's order.** AI & Automation went last on
     2026-08-25; it had been third, in the middle of the run. Read out of the
     panel and compared as a LIST, because the names on their own passed while
     the order was anything at all — which is exactly what happened while this
     assertion was missing. */
  const servicesPanel = html.match(/<ul class="mega-menu__links">[\s\S]*?<\/ul>/)?.[0];
  assert.ok(servicesPanel, "the services panel is not rendered");
  assert.deepEqual(
    [...servicesPanel.matchAll(/class="mega-menu__label">([^<]*)</g)].map((m) => m[1]),
    [
      /* Renamed on 2026-08-25 — the labels only; the routes behind them
         did not move. */
      "Branding",
      "Websites",
      "Software",
      "CRM Solution",
      "AI &amp; Automation",
    ],
  );

  /* **Services, Products and Company open their lists and go nowhere.** Owner's
     call: they are disclosures, not destinations. Each still has a real route
     behind it, so nothing in the markup shows this but the element — a link and
     a button look identical in a screenshot, and the difference is a chevron
     and a panel that either open or do not. */
  for (const label of ["Services", "Products", "Company"]) {
    const trigger = html.match(new RegExp(`<button ([^>]*)>${label}</button>`))?.[1];
    assert.ok(trigger, `${label} is not a button in the desktop bar`);
    assert.match(trigger, /class="nav-link nav-trigger"/);
    assert.match(trigger, /aria-controls="desktop-mega-menu"/);
    assert.match(trigger, new RegExp(`id="nav-trigger-${label.toLowerCase()}"`));
    assert.doesNotMatch(
      html,
      new RegExp(`<a [^>]*>${label}</a>`),
      `${label} is a link again`,
    );
  }

  /* **Clients is the one word that goes somewhere, and has no panel.** It was
     both for a while; the seven sectors its panel held were deleted with the
     taxonomy, so `items` is empty and the header needed no change to notice —
     `hasPanel` is `items.length > 0`. */
  const clientsInBar = html.match(/<a [^>]*>Clients<\/a>/)?.[0];
  assert.ok(clientsInBar, "Clients is not rendered as a link");
  assert.match(clientsInBar, /href="\/case-studies"/);
  assert.match(clientsInBar, /class="nav-link"/);
  assert.doesNotMatch(clientsInBar, /nav-trigger|aria-controls|aria-expanded/);
  assert.doesNotMatch(html, /<button[^>]*>Clients<\/button>/);
  assert.doesNotMatch(servicesPanel, />Finance<|>Healthcare<|>Public Sector</);

  /* One panel serves all three triggers, so a reader who has just moved focus
     into it is otherwise told only "navigation". Closed on arrival and out of
     the tab order while it is — `inert` is what stops a reader tabbing into a
     panel that is not on screen. */
  const panel = html.match(/<div class="mega-menu"[^>]*>/)?.[0];
  assert.ok(panel, "the shared panel is not rendered");
  assert.match(panel, /aria-labelledby="nav-trigger-services"/);
  assert.match(panel, /inert=""/);

  /* The mobile index asks the same question the bar does: a word the owner said
     is not a destination is not one on a phone either. It is also what makes
     the five service pages reachable there — while those three were links, a
     tap went to the placeholder and the list under them opened for nobody. */
  for (const label of ["Services", "Products", "Company"]) {
    assert.match(
      html,
      new RegExp(`<button ([^>]*)><span>${label}</span>`),
      `${label} is not a button in the mobile index`,
    );
  }
  assert.match(html, /<a ([^>]*)><span>Clients<\/span>/);

  assert.match(html, /Hire us/);
  assert.match(html, /Start a project/);

  // Footer — it closes the page rather than ending it.
  assert.match(html, /<footer class="site-footer" id="contact"/);
  assert.match(html, /© \d{4} Mardal/);
  assert.match(html, /class="site-footer__nav"/);
  assert.match(html, /Back to top/);
  assert.match(
    html,
    /class="site-footer__top-link" href="#main-content" aria-label="Back to top" data-scroll-direct="true"/,
  );
  assert.doesNotMatch(
    html,
    /class="site-footer__top-link"[^>]*>\s*Back to top/,
  );
  // No oversized wordmark: the footer logo stays at brand size.
  assert.doesNotMatch(html, /site-footer__wordmark/);
  // The closing line, set as two explicit lines at the display size.
  assert.match(html, /class="site-footer__title-line">Let’s build</);
  assert.match(html, /class="site-footer__title-line">smarter</);
  assert.equal(
    (html.match(/class="site-footer__title-line"/g) ?? []).length,
    2,
  );
  assert.match(html, /Tell us what you want to improve, automate, or create/);
  assert.match(html, /practical digital solution/);
  assert.doesNotMatch(
    html,
    /moves you forward|what better could look like|build the right/,
  );
  // The large address link is gone; the mark closes that column instead, and
  // the address is one of the details under the rule.
  assert.doesNotMatch(html, /site-footer__email/);
  assert.match(
    html,
    /class="site-footer__detail-value">.{0,400}?href="mailto:info@mardal\.co"/s,
  );
  // The footer renders the menu's groups: Services, Products, Company. Clients
  // is not one — a column here is a heading over a list and it has no list, so
  // the footer filters on that rather than on its name now. It was put in, then
  // taken back out on 2026-08-09, when it was still a panel whose one entry was
  // a dead anchor and a column made that more visible rather than less; it is
  // now a plain link in the header and still earns no column. This assertion is
  // what stops the two menus drifting on the count alone: it said 4 until the
  // worker these tests load was actually rebuilt — `1fbc8cf` took Solutions out
  // of the menu and the number was never followed down here, but the artifact
  // predated that commit, so it went on passing against a menu that no longer
  // existed.
  assert.equal((html.match(/class="site-footer__group"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /site-footer__group-title">Clients/);
  // The ring alone, cropped from the wordmark rather than a second asset.
  assert.match(html, /class="site-footer__mark"/);
  // The bar field, traced: 22 bars, every one 10 wide, on three spans — nine
  // hanging from the top and stopping halfway, ten standing on the bottom
  // half, three running the full height.
  const footerBars = html.match(/<svg class="site-footer__bars"[\s\S]*?<\/svg>/);
  assert.ok(footerBars, "footer bar field missing");
  assert.equal((footerBars[0].match(/<rect /g) ?? []).length, 22);
  assert.equal((footerBars[0].match(/width="10"/g) ?? []).length, 22);
  assert.equal((footerBars[0].match(/y="0" width="10" height="99"/g) ?? []).length, 9);
  assert.equal((footerBars[0].match(/y="99" width="10" height="99"/g) ?? []).length, 10);
  assert.equal((footerBars[0].match(/y="0" width="10" height="198"/g) ?? []).length, 3);
  // 12 in the three menu groups — five Services, three Products, four Company —
  // the email and the phone in the details block, and the three legal links in
  // the foot. The address is not a link and the social marks are not links yet.
  // Was 18 until Team came out of Company on 2026-08-12, 19 while Case Studies
  // had a column down here, and 25 before `1fbc8cf` took Solutions out.
  assert.equal((html.match(/class="site-footer__link"/g) ?? []).length, 17);
  // **Team is gone from every menu, not just this one.** The header panels and
  // this footer all read the same array, so an entry that survived in one of
  // them would mean something had been copied that should have been shared.
  assert.doesNotMatch(html, />Team</);
  assert.doesNotMatch(html, /href="#team"/);
  assert.doesNotMatch(html, /site-footer__column/);
  // The mark sits under the rule now, with the way back up opposite it, and
  // the year and the legal links below them.
  assert.match(
    html,
    /class="site-footer__meta">[\s\S]*?site-footer__mark[\s\S]*?site-footer__top-link/,
  );
  assert.match(html, /class="site-footer__legal">[\s\S]*?© \d{4} Mardal/);
  // How to reach Mardal — all of it real now, and the phone dialable.
  assert.equal((html.match(/class="site-footer__detail"/g) ?? []).length, 4);
  assert.match(html, /site-footer__detail-full">Email</);
  assert.match(html, /site-footer__detail-full">Phone</);
  assert.match(html, /site-footer__detail-full">Address</);
  assert.match(html, /site-footer__detail-full">Follow</);
  assert.match(html, /href="tel:\+38349210999"[^>]*>\+383 49 210 999</);
  // Street first, then postcode and city — the order it is written in,
  // and the one that breaks into two lines a phone can hold.
  assert.match(html, /Rr\.\u00a0\u201cIsa\u00a0Boletini\u201d, 6000\u00a0Gjilan/);
  // Each row named twice: the word for the wide panel and for anything
  // listening, the abbreviation for a phone.
  assert.equal((html.match(/class="site-footer__detail-short"/g) ?? []).length, 3);
  for (const short of ["EMAIL", "TEL", "STR"]) {
    assert.match(html, new RegExp(`detail-short" aria-hidden="true">${short}:`));
  }
  assert.doesNotMatch(html, /contact-icon/);
  assert.doesNotMatch(html, /\[Phone number\]|\[Street\]|\[City\]/);
  // Three marks, drawn at the icon weight the rest of the site uses, and not
  // links: the accounts exist but their addresses have not been given, and a
  // guessed profile URL is worse than a mark that waits for one.
  assert.equal((html.match(/class="social-icon"/g) ?? []).length, 3);
  for (const name of ["Instagram", "Facebook", "LinkedIn"]) {
    assert.match(html, new RegExp(`aria-label="${name}"`), `missing ${name}`);
    assert.doesNotMatch(html, new RegExp(`<a[^>]*>${name}<`));
  }
  assert.match(html, /class="social-icon"[^>]*viewBox="0 0 24 24"/);
  // Short labels: the three of them fit one line on a 320 screen this way.
  assert.match(html, />Privacy</);
  assert.match(html, />Terms</);
  assert.match(html, />Cookies</);
  assert.doesNotMatch(html, /Privacy Policy|Terms of Service/);

  // Shared machinery
  assert.match(html, /data-route-section/);
  // One arrival per section: the section moves as a whole, so no element
  // inside it carries its own reveal.
  assert.doesNotMatch(html, /data-reveal-item/);
  // Every section on the page is one, including Why Mardal.
  assert.match(html, /class="why-section"[^>]*data-route-section/);
  assert.equal((html.match(/<section class="[^"]*"[^>]*data-route-section/g) ?? []).length, 5);

  // Artificial Intelligence + Human Creativity, under the hero.
  assert.match(html, /class="fusion-section"[^>]*data-route-section/);
  assert.match(html, /Artificial<\/span>/);
  assert.match(html, /Intelligence<\/span>/);
  assert.match(html, /Human<\/span>/);
  assert.match(html, /Creativity<\/span>/);
  assert.match(html, /unlocks new possibilities\./);
  // The plus is drawn, not typed, so it has to stay out of the accessible tree
  // and the heading has to carry its own spoken name in its place.
  assert.match(html, /class="fusion-plus"[^>]*aria-hidden="true"/);
  /* **Which half is on which side, and the spoken name agreeing with it.**
     Human Creativity reads first as of 2026-08-24. The drawn plus is hidden
     from the accessible tree, so `aria-label` is the entire sentence a screen
     reader gets — swap the visual order without it and the page says one thing
     and is read as another, which no other assertion here would notice. */
  assert.match(html, /aria-label="Human Creativity plus Artificial Intelligence"/);
  /* The heading's CONTENT, with its opening tag cut off. Written against the
     whole element this assertion is vacuous: `aria-label` sits in the tag and
     already reads "Human Creativity plus Artificial Intelligence", so the
     first "Human" it finds is in the attribute and the order always holds.
     It passed with the halves swapped back — that is how this was found. */
  const fusionWords = html.match(
    /<h2 class="fusion-title"[^>]*>([\s\S]*?)<\/h2>/,
  )?.[1];
  assert.ok(fusionWords, "the fusion heading is not rendered");
  assert.ok(
    fusionWords.indexOf("Human") < fusionWords.indexOf("Artificial"),
    "Artificial Intelligence is reading before Human Creativity",
  );

  // The isometric drawings did not come back with the section.
  assert.doesNotMatch(html, /class="iso-art"/);

  // The bars belong to the hero alone, and the scroll route line is gone.
  assert.doesNotMatch(html, /line-band|scroll-side/);

  for (const anchor of menuAnchors) {
    assert.match(html, new RegExp(`id="${anchor}"`), `missing #${anchor}`);
  }

  // One h1 on the page, and the styling stays in globals.css.
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<(section|div|p|h[1-6]|article|li|a|span)[^>]* style="/);

  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the AI & Automation service page", async () => {
  const response = await render("/services/ai-automation");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>AI &amp; Automation — Mardal<\/title>/i);
  assert.match(html, /class="service-hero__title"/);
  assert.match(html, /Turn repetitive work/);
  assert.match(html, /into intelligent workflows\./);
  assert.match(html, /Build smarter operations with AI agents\./);
  /* It has a modifier of its own now. It was the one hero without one — the
     drawing the base rule masked with, so it took the brand purple by being
     first — and it wears its homepage card's clay like the other four. */
  assert.match(
    html,
    /class="service-hero__pattern service-hero__pattern--ai-automation"/,
  );
  /* `service-hero__bar` is bounded because `service-hero__bars` — the class the
     traced drawing renders under since all five heroes stopped being masks — is
     a prefix of it, and an unbounded guard failed the day that arrived. This is
     the third time a prefix match has caught something it was not written for. */
  assert.doesNotMatch(
    html,
    /service-hero__kicker|service-hero__bar(?![\w-])|service-hero__pattern-image/,
  );

  // The band of bars that used to sit under the heading is gone, and nothing
  // of it is left behind.
  assert.doesNotMatch(html, /service-banner/);

  /* The three-column overview between the hero and the journey is gone, taken
     out on the owner's word. It was the LAST of two — Custom Software carried
     the other and lost it the same day — so `.service-overview` is now a block
     no page renders, and its rules, its two media-query overrides and the
     `--service-text-overview-title` token came out of the stylesheet with it.
     Both halves are asserted here and on the Custom Software page below: the
     markup, and the copy in `content/ai-automation.ts`, which was deleted so no
     one re-renders a field that is still sitting in the module. */
  assert.doesNotMatch(html, /service-overview/);
  assert.doesNotMatch(html, /We start by understanding how work moves/);

  /* The service journey renders every card in source order before motion is
     enhanced, so the MARKUP is complete without client-side JavaScript.
     Say markup and not page, because for a long time this comment was read as
     the stronger claim and the stronger claim was false: a card rests at
     `visibility: hidden` and something has to reveal it. On a wide window that
     was the desktop run alone, which never builds for a reader who has asked for
     no motion — so twelve cards were in the markup and one was on the screen.
     What the rendered page shows is now held by tests/reduced-motion.test.mjs,
     which reads the stylesheet, because no assertion on HTML can see it. */
  assert.match(html, /AI &amp; Automation Services/);
  assert.match(html, /AI Applications/);
  assert.match(html, /data-service-group-link="1"[^>]*>Automation</);
  assert.equal((html.match(/class="service-card"/g) ?? []).length, 12);

  /* **A chapter's own words reach the page, folded into the first card it
     opens.** These two strings rendered nowhere for as long as the five service
     pages each built their cards with their own copy of one flatMap: three of the
     five grew a branch that reads `chapter.description` and two never did, and
     this is the page where that cost something — chapters two and three both
     carry one. Held here rather than trusted to the shared builder, because the
     symptom was invisible: the content was in a typed module, the page compiled,
     and nothing said the field was inert. */
  assert.match(html, /Connected workflows that reduce repetitive work/);
  assert.match(
    html,
    /Advanced AI technologies for projects that need company knowledge/,
  );
  assert.equal(
    (html.match(/data-service-group-link=/g) ?? []).length,
    3,
  );
  assert.match(
    html,
    /class="service-journey__skip" href="#ai-automation-cta" data-scroll-direct="true" data-scroll-duration="1.5" data-scroll-ease="sine.in" data-scroll-preserve-view="true" data-service-skip="true"[^>]*>[\s\S]*?pixel-x[\s\S]*?Skip[\s\S]*?<\/a>/,
  );
  /* The bespoke capabilities section is gone: this page runs the same journey
     as the other four, and its third chapter carries what that section held. */
  assert.doesNotMatch(html, /ai-capabilit(?:ies|y)/);
  assert.match(html, /AI Systems/);
  assert.match(html, /RAG &amp; Knowledge Systems/);
  assert.match(html, /Predictive Analytics/);
  assert.match(html, /AI Governance &amp; Operations/);
  assert.match(html, /Computer Vision/);
  /* Two compliance claims were taken out of the copy deliberately and must not
     come back through here. The page claims regulatory readiness, nothing
     stronger. See PRODUCT.md, Evidence on Hand. */
  assert.doesNotMatch(html, /Full AI Act compliance/);
  assert.doesNotMatch(html, /Secure vector databases/);
  assert.match(html, /Support responsible AI and regulatory readiness/);
  assert.match(html, /class="service-cta" id="ai-automation-cta"/);
  assert.match(html, /class="service-journey__controls"/);
  assert.match(
    html,
    /class="service-cta__inner" data-enter="true" data-enter-mode="none"/,
  );
  assert.match(html, /data-service-track/);
  assert.match(html, /class="service-card__number"[^>]*>01</);
  /* One 01 per chapter, and this page has three. */
  assert.equal(
    (html.match(/class="service-card__number"[^>]*>01</g) ?? []).length,
    3,
  );
  assert.match(html, /class="service-card__number"[^>]*>05</);
  assert.doesNotMatch(html, />Overview<|>Key uses<|>In practice</);
  assert.doesNotMatch(html, /class="service-card__uses"/);
  assert.match(
    html,
    /Summarize current and past performance\. Explain the causes behind trends and changes\. Analyze customer feedback\./,
  );
  assert.match(
    html,
    /The assistant finds the relevant information and responds directly/,
  );
  assert.match(
    html,
    /<span data-service-word="true">The<\/span> <span data-service-word="true">assistant<\/span>/,
  );
  assert.doesNotMatch(html, /<details|service-row__action|09 services/);

  /* Every card the journey carries, in order. */
  for (const title of [
    "AI Assistants",
    "Document Intelligence",
    "AI Data &amp; Insights",
    "Sales &amp; CRM Automation",
    "Customer Service Automation",
    "Document &amp; Approval Automation",
    "Order &amp; Operations Automation",
    "Reporting &amp; Alerts",
    "RAG &amp; Knowledge Systems",
    "Predictive Analytics",
    "Computer Vision",
    "AI Governance &amp; Operations",
  ]) {
    assert.match(html, new RegExp(title));
  }

  assert.doesNotMatch(html, /is-scroll-stack|data-service-row/);

  /* The service CTA still says "Get in touch". The product cards moved to
     "Explore more" on 2026-08-09 and these did not; the two labels live in
     different content modules and this is the assertion that keeps them
     apart. */
  assert.match(html, /class="service-cta__link" href="[^"]*">Get in touch/);

  // The page carries the site's own header and footer.
  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
  assert.match(html, /class="pixel-arrow /);
  assert.doesNotMatch(html, /[↗→←]/);
});

/* The fifth service page, and the first written from nothing rather than moved.
   It was a placeholder route for a day; the owner asked for it written on
   2026-08-25 and it left `content/placeholders.ts` the way Careers did. */
test("server-renders the Branding service page", async () => {
  const response = await render("/services/branding");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Branding — Mardal<\/title>/i);
  assert.match(html, /class="service-hero__title"/);
  assert.match(html, /A brand that holds/);
  assert.match(html, /once it is built\./);
  assert.match(html, /Identity, and the system that keeps it intact\./);

  /* It keeps the drawing it carried as a placeholder — the one System
     Integration left behind — so the page did not lose its hero by being
     written. */
  assert.match(
    html,
    /class="service-hero__pattern service-hero__pattern--branding"/,
  );

  /* The drawing is in the HTML rather than in a mask — counted for all five
     heroes together in "every service hero draws its own bars" below. */

  /* **It is a real page now, not the placeholder.** Both halves: the journey
     exists, and the heading that stood in for one is gone. A route that was
     half-converted would still render and still say Branding. */
  assert.match(html, /Branding Services/);
  assert.match(html, /class="service-journey__controls"/);
  assert.doesNotMatch(html, /Working[\s\S]{0,40}on it\./);
  assert.doesNotMatch(html, /service-hero--bare|service-hero__eyebrow/);

  /* Three chapters, nine services. */
  assert.equal((html.match(/data-service-group-link=/g) ?? []).length, 3);
  assert.equal((html.match(/class="service-card"/g) ?? []).length, 9);
  /* Named in the words a buyer would use, and in this site's own pattern —
     CRM Solutions runs `CRM Strategy · CRM Implementation · CRM Operations`.
     They were Foundations / Identity / The System for an hour. */
  for (const chapter of ["Brand Strategy", "Visual Identity", "Brand Implementation"]) {
    assert.match(html, new RegExp(`>${chapter}<`));
  }
  for (const service of [
    "Positioning",
    "Naming",
    "Tone of Voice",
    "Logo &amp; Marks",
    "Typography &amp; Colour",
    "Brand Assets",
    "Design System",
    "Brand Guidelines",
    "Handover",
  ]) {
    assert.match(html, new RegExp(service));
  }

  /* **Nothing on this page claims a result.** PRODUCT.md records zero
     quantified outcomes anywhere on this site and no per-client sign-off for
     naming anyone, so the copy was written as what the WORK is rather than what
     it achieved. This is the assertion that keeps it that way — the pull when
     editing a service page is to add the number that would make it persuasive. */
  assert.doesNotMatch(html, /\d+\s*%|\d+x\b|increased|boosted|doubled|ROI/i);
  for (const client of ["EN NUR", "Spitex", "Stolzbau", "Henor", "ANDI SPORT", "Jetonikeramika"]) {
    assert.doesNotMatch(html, new RegExp(client, "i"), `${client} is named on a service page`);
  }

  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});

test("server-renders the Software service page", async () => {
  const response = await render("/services/software");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Software — Mardal<\/title>/i);
  assert.match(html, /class="service-hero__title"/);
  assert.match(html, /Build the software/);
  assert.match(html, /your business actually needs\./);
  assert.match(html, /Custom apps, platforms, and tools made for your team\./);
  /* **Fourteen across four chapters since 2026-08-25.** The Software page
     gained a `System Integration` chapter: five services recovered word for
     word from the page of that name deleted the day before. Integration is
     not a product this site sells any more — it is what a build has to do to
     reach the systems a business already runs — so it is a chapter here
     rather than a page of its own.

     It was one service inside Existing Software for an hour before the owner
     asked for the chapter. `Custom Connections` MOVED rather than being
     copied, which is what this count would catch if it ever went wrong: a
     service in two chapters renders twice and reads as a mistake nobody
     wrote. */
  assert.equal((html.match(/data-service-group-link=/g) ?? []).length, 4);
  assert.equal((html.match(/class="service-card"/g) ?? []).length, 14);
  assert.match(html, />System Integration</);
  for (const service of [
    "CRM &amp; ERP",
    "E-commerce &amp; Operations",
    "Accounting &amp; Payments",
    "Custom Connections",
    "Data Transfer &amp; Sync",
  ]) {
    assert.match(html, new RegExp(service));
  }
  /* Once each. `Custom Connections` is the one that moved. */
  assert.equal((html.match(/>Custom Connections</g) ?? []).length, 1);

  /* And the four left in git stay there. `Communication Tools` reads as a
     fifth flavour of the same thing; Monitoring, Error Recovery and Updates &
     Support describe running an integration estate as an ongoing service,
     which is what the deleted page sold and this site no longer does.
     Restoring those is re-creating that page rather than filling a chapter. */
  assert.doesNotMatch(
    html,
    /Communication Tools|Error Recovery|Monitoring &amp; Alerts|Updates &amp; Support/,
  );

  /* The overview section is gone here as well, and this page is why the CSS
     could go: it was the second and last renderer of `.service-overview`.
     The page had NO test of its own before this one, so the section could have
     come back on it and the suite would have stayed green. */
  assert.doesNotMatch(html, /service-overview/);
  assert.doesNotMatch(html, /When standard software no longer fits/);
  assert.doesNotMatch(html, /Custom software is built for a specific/);
});

test("every service hero draws its own bars", async () => {
  /* **The owner's instruction in one test.** 2026-08-26: the same movement on
     every service pattern, each page keeping its OWN drawing rather than taking
     Branding's. All five were PNGs used as CSS masks; a bar in a mask is pixels,
     with no element to move, so each was traced back out of its own alpha.

     The counts are what makes this bite. Losing a trace and rendering an empty
     `<svg>`, or wiring two pages to one data file, would leave every other
     assertion on those pages passing and the heroes wrong. */
  const HEROES = [
    { path: "/services/branding", bands: 16, bars: 303 },
    { path: "/services/ai-automation", bands: 16, bars: 355 },
    { path: "/services/software", bands: 15, bars: 40 },
    { path: "/services/crm-solution", bands: 16, bars: 44 },
    { path: "/services/websites", bands: 14, bars: 46 },
  ];

  const drawings = new Map();

  for (const { path, bands, bars } of HEROES) {
    const html = await (await render(path)).text();
    const svg = html.match(/<svg[^>]*data-pattern-bars[\s\S]*?<\/svg>/);
    assert.ok(svg, `${path} draws no bars`);

    /* Two paths per band, one canvas width apart, which is what makes the belt
       loop without a seam; the second copy is outside the viewBox until
       something moves it, so nothing is visible twice. */
    assert.equal((svg[0].match(/data-pattern-band=/g) ?? []).length, bands, path);
    assert.equal((svg[0].match(/<path/g) ?? []).length, bands * 2, path);
    assert.equal((svg[0].match(/M-?\d+ -?\d+h/g) ?? []).length, bars * 2, path);

    /* Paths rather than one rect per bar — two `<rect>`s sharing an edge are
       rasterised separately and leave a pale line along the join, which is what
       the owner saw the first time this shipped. On Branding it is the
       difference between 572 pale pixels and 9. */
    assert.equal((svg[0].match(/<rect/g) ?? []).length, 0, path);

    assert.deepEqual(
      [...new Set(svg[0].match(/translate\([^)]*\)/g) ?? [])].sort(),
      ["translate(-1447 0)", "translate(1447 0)"],
      path,
    );

    /* Server-rendered, which is the whole reason the motion is a separate client
       component: no `<svg>` here would mean a hero blank until hydration and
       blank forever with scripting off. */
    assert.match(svg[0], /class="service-hero__bars"/);
    drawings.set(path, svg[0]);
  }

  /* **Five drawings, not one copied five times.** Every count above would still
     pass if all five pages imported the same data file. */
  assert.equal(new Set(drawings.values()).size, HEROES.length);
});

test("server-renders the CRM Solution service page", async () => {
  const response = await render("/services/crm-solution");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>CRM Solution — Mardal<\/title>/i);
  assert.match(html, /One system for/);
  assert.match(html, /your business\./);
  assert.match(
    html,
    /Keep everything organized, connected, and easy to manage\./,
  );
  assert.match(
    html,
    /class="service-hero__pattern service-hero__pattern--crm-solution"/,
  );
  assert.match(html, /CRM Solution Services/);
  assert.match(html, /CRM Strategy/);
  assert.match(html, /CRM Implementation/);
  assert.match(html, /CRM Operations/);
  assert.match(html, /AI-Powered/);
  assert.equal((html.match(/class="service-card"/g) ?? []).length, 18);
  assert.equal((html.match(/data-service-group-link=/g) ?? []).length, 4);
  assert.match(
    html,
    /class="service-journey__skip" href="#crm-solution-cta" data-scroll-direct="true" data-scroll-duration="1.5" data-scroll-ease="sine.in" data-scroll-preserve-view="true" data-service-skip="true"[^>]*>[\s\S]*?pixel-x[\s\S]*?Skip[\s\S]*?<\/a>/,
  );
  assert.match(html, /class="service-cta" id="crm-solution-cta"/);
  assert.match(html, /class="service-journey__controls"/);
  assert.match(
    html,
    /class="service-cta__inner" data-enter="true" data-enter-mode="none"/,
  );
  assert.match(html, /data-service-next-link/);
  assert.doesNotMatch(
    html,
    /class="service-journey__next"[^>]*(?:aria-hidden="true"|tabindex="-1")/,
  );
  assert.match(
    html,
    /<span data-service-word="true">We<\/span> (?:<!-- -->)?<span data-service-word="true">review<\/span>/,
  );
  assert.match(html, /information across spreadsheets, emails, documents/);
  assert.match(html, /recommend the most practical option/);
  assert.match(html, /properties, owners, buyers, viewings, documents/);
  assert.match(html, /products, services, pricing information/);
  assert.match(html, /where work is delayed/);
  assert.match(html, /AI extracts the company details/);
  assert.match(html, /suggest missing field updates/);

  for (const title of [
    "Business Process Planning",
    "CRM Selection",
    "CRM Structure",
    "Setup &amp; Configuration",
    "CRM Customization",
    "Data Migration",
    "Company &amp; Contact Records",
    "Products &amp; Services",
    "Activities &amp; Tasks",
    "Sales &amp; Opportunities",
    "Service &amp; Support",
    "Dashboards &amp; Reporting",
    "Training &amp; Improvement",
    "AI Information Assistant",
    "Data Organization",
    "Communication Assistance",
    "Work &amp; Opportunity Assistance",
    "Service Assistance",
  ]) {
    assert.match(html, new RegExp(title));
  }

  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});

test("the menu points at the service pages that exist", async () => {
  const html = await (await render()).text();
  assert.match(html, /href="\/services\/ai-automation"/);
  assert.match(html, /href="\/services\/crm-solution"/);
  assert.match(html, /href="\/services\/websites"/);
  assert.match(html, /href="\/services\/branding"/);

  /* Not a list of strings — every href the panel carries is fetched. The old
     version of this test asserted three literals and would have gone on passing
     with the route renamed underneath it, which is exactly what happened to
     `/services/web-platforms-apps`. */
  const hrefs = [
    ...html.matchAll(/class="mega-menu__link" href="(\/services\/[^"]+)"/g),
  ].map((m) => m[1]);
  assert.equal(hrefs.length, 5);
  for (const href of hrefs) {
    assert.equal(
      (await render(href)).status,
      200,
      `${href} is in the menu and does not resolve`,
    );
  }
});

/* The block that closes a piece. It is the one part of the blog with logic in
   it rather than copy — which piece sits on which side — and that logic is only
   wrong at the ends of the run, where nobody looks. */
test("a piece ends with the piece behind on the left and the piece ahead on the right", async () => {
  const html = await (await render("/blog/what-phase-one-does-not-include")).text();

  /* Second of three, so both neighbours are the real ones rather than a wrap. */
  assert.match(
    html,
    /class="blog-more__side blog-more__side--back" href="\/blog\/between-systems"/,
  );
  assert.match(
    html,
    /class="blog-more__side blog-more__side--on" href="\/blog\/migration-is-the-project"/,
  );

  /* Named, because "read more" is not an offer. */
  assert.match(html, /Most failures happen between systems/);
  assert.match(html, /Migration is the project/);

  /* The way out sits between them, and the piece never offers itself. */
  assert.match(html, /class="blog-more__all" href="\/blog"/);
  assert.doesNotMatch(html, /href="\/blog\/what-phase-one-does-not-include"/);
});

test("the ends of the run wrap rather than offering nothing", async () => {
  /* First piece: the piece behind it is the last one. */
  const first = await (await render("/blog/between-systems")).text();
  assert.match(
    first,
    /class="blog-more__side blog-more__side--back" href="\/blog\/migration-is-the-project"/,
  );

  /* Last piece: the piece ahead of it is the first one. */
  const last = await (await render("/blog/migration-is-the-project")).text();
  assert.match(
    last,
    /class="blog-more__side blog-more__side--on" href="\/blog\/between-systems"/,
  );
});

/* The Clients page, which is a hero and nothing else yet — the same order the
   Blog was built in. Two of these assertions are about the opening; the third
   is the one that matters. Still served at /case-studies: the hero's drawing is
   generated from that slug, so the route was left alone when the word was
   changed. */
test("server-renders the Clients hero", async () => {
  const response = await render("/case-studies");
  assert.equal(response.status, 200);

  const html = await response.text();
  /* The tab has to say what was clicked to get here. */
  assert.match(html, /<title>Clients — Mardal<\/title>/i);

  /* Two authored line spans, so the break falls where it was chosen rather than
     wherever the measure happens to run out. The words are the owner's and they
     turn the page around: "Systems we built / and handed over." was written
     from Mardal's side, this is written from the reader's. */
  assert.match(html, /class="service-hero__title-line">Customer</);
  assert.match(html, /class="service-hero__title-line">stories</);
  assert.equal(
    (html.match(/class="service-hero__title-line"/g) ?? []).length,
    2,
  );
  assert.doesNotMatch(html, /Systems we built|and handed over/);
  assert.match(html, /What each one replaced, what it does now/);

  /* No artwork in this opening, which makes it the only hero on the site
     without one — the five service pages mask a PNG and the Blog draws the
     vector. Owner's call. Asserted rather than left to the eye because the
     hero's layout now depends on it: the heading's measure and the column the
     support line stands in were both set by where the drawing was. */
  assert.doesNotMatch(html, /service-hero__pattern/);
  assert.doesNotMatch(html, /class="service-hero__drawing"/);

  /* **No client is named, and none may be until the owner says so.**
     PRODUCT.md records that the delivered archive may be described as Mardal's
     work but that per-client sign-off for naming these companies in public was
     never recorded. This is the assertion that catches a name arriving here
     before that decision does — the copy is written so it never has to. */
  for (const client of [
    "EN NUR",
    "Spitex",
    "Stolzbau",
    "Henor",
    "ANDI SPORT",
    "Jetonikeramika",
  ]) {
    assert.doesNotMatch(html, new RegExp(client, "i"), `${client} named`);
  }

  /* ArvenaAI is an unreleased in-house product and PRODUCT.md forbids writing
     it as a delivered client outcome. It belongs under Products; the dead
     ArvenaAI case-study anchor the menu used to carry must not follow the page
     here now that the menu comes straight to it. */
  assert.doesNotMatch(html, /arvena-ai-case-study/);

  /* The header on this page points at the page it is on, and says so. */
  const clientsLink = html.match(/<a [^>]*>Clients<\/a>/)?.[0];
  assert.ok(clientsLink, "Clients is not rendered as a link");
  assert.match(clientsLink, /aria-current="page"/);

  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});

/* **What replaced the sector filter, and what has to stay gone.**

   This test was the filter's: `/case-studies/finance` had to arrive already
   filtered, from the server, rather than arriving whole and correcting itself
   in the browser. The owner replaced the industry taxonomy on 2026-08-25 —
   there is one page of work now, with a rail down the left saying what KIND of
   work it holds — so what is asserted is the shape that replaced it, and that
   the seven addresses answer rather than 404.

   The card assertions below are the filter test's own and are kept: they were
   never about filtering, they are about what a card is. */
test("the Clients index is one page with a rail, not seven filtered views", async () => {
  const all = await (await render("/case-studies")).text();

  /* **The grid element, taken once — everything about a card is read out of
     this and not out of the page.**

     Next embeds the whole tree a second time as its RSC payload, and since
     ClientsIndex stopped being a client component the cards appear in that copy
     too: every per-card count read double. The first `<ul class="clients-grid">`
     is the rendered one. */
  const cardMarkup = all.match(/<ul class="clients-grid">[\s\S]*?<\/ul>/)?.[0];
  assert.ok(cardMarkup, "the clients grid is not rendered");

  /* Every entry, once. There is no state and no subset any more, so this is the
     count of the whole list rather than of a view of it. Matched to the end of
     the class name rather than the attribute: a card with a story behind it
     carries a modifier too. */
  assert.equal((cardMarkup.match(/class="clients-card[" ]/g) ?? []).length, 8);
  assert.equal((cardMarkup.match(/<article/g) ?? []).length, 8);

  /* **What ClientsPin holds must not be a grid item, and this is the only place
     that fact is visible.**

     ScrollTrigger pins by wrapping its target in a `pin-spacer` and lifting the
     element out of flow inside it. Point it at a direct child of
     `.clients-layout` and the spacer becomes the grid item — so every refresh
     re-measures a box the grid lays itself out from, which can move the work
     column, whose height the pin watches in order to decide when to refresh.
     The page walks up and down on every press. That is exactly what happened
     when the rail was asked to stick and the pin was aimed one level too high.

     Two halves, and both are needed: the selector the pin defaults to, read out
     of its own source, and the proof that the element wearing it is nested
     inside the grid item rather than being it. */
  const pinSource = readFileSync(
    new URL("../components/case-studies/ClientsPin.tsx", import.meta.url),
    "utf8",
  );
  const pinned = pinSource.match(/rail:\s*railSelector\s*=\s*"\.([\w-]+)"/)?.[1];
  assert.ok(pinned, "ClientsPin names no rail to hold");
  assert.match(
    all,
    new RegExp(`<div class="clients-layout"><div class="[\\w-]+"><div class="${pinned}"`),
    `ClientsPin holds .${pinned}, which is the grid item itself`,
  );

  /* The heading, in the special face and on its two authored lines. */
  assert.match(all, /class="clients-rail__title"/);
  assert.match(all, /clients-rail__title-line">Selected<[\s\S]*?clients-rail__title-line">work</);

  /* The rail itself. Matched on the group element rather than on
     `.clients-rail`, whose closing tag a non-greedy match now finds inside the
     holder — the holder is nested in it, so the first `</div>` after
     `class="clients-rail"` closes the wrong box. */
  const rail = all.match(
    /<div class="clients-filter" id="clients-filter"[\s\S]*?<\/div>\s*<\/div>/,
  )?.[0];
  assert.ok(rail, "the rail is not rendered");

  /* The seven, in order, then All. As a list because the order is the owner's
     and a set would pass while they were shuffled. */
  assert.deepEqual(
    [...rail.matchAll(/class="clients-filter__label">([^<]*)</g)].map((m) => m[1]),
    [
      "UX/UI Design",
      "Branding",
      "Websites",
      "Applications",
      "Software",
      "CRM",
      "AI &amp; Automation",
      "All",
    ],
  );

  /* **Eight pressable words: the seven, then All.** The rail filters again —
     owner's call, after one build in which it was static text — so what is
     asserted is that every discipline is a control and that `All` is the eighth
     and last of them, held off by the rule at the foot of the index.

     `aria-pressed` rather than `aria-current`: these are toggles over one list,
     not links to eight places. That distinction is the whole difference between
     this rail and the sector routes it replaced, and it is the only thing in
     the markup that says so. */
  const controls = [...rail.matchAll(/<button[^>]*class="clients-filter__item[^"]*"[^>]*>/g)];
  assert.equal(controls.length, 8);
  assert.match(rail, /clients-filter__item clients-filter__item--all/);
  assert.doesNotMatch(rail, /<a /);

  /* **All is chosen when the page arrives**, and it is the ONLY one that is.
     A rail arriving with two marks drawn, or with none, is the failure this
     catches — and neither would fail anything else here, since the eight
     buttons would still be eight buttons. */
  const current = [...rail.matchAll(/class="clients-filter__item[^"]*is-current[^"]*"[\s\S]*?<span class="clients-filter__label">([^<]*)</g)]
    .map((match) => match[1]);
  assert.deepEqual(current, ["All"]);
  assert.equal((rail.match(/aria-pressed="true"/g) ?? []).length, 1);

  /* And with All chosen the grid is every entry — which is what makes the
     default meaningful rather than just marked. */
  assert.equal((cardMarkup.match(/class="clients-card[" ]/g) ?? []).length, 8);

  /* The seven sector addresses were live and prerendered. They redirect rather
     than 404, so anything already linked still lands somewhere. */
  for (const sector of ["finance", "healthcare", "public-sector"]) {
    const response = await render(`/case-studies/${sector}`);
    assert.equal(
      response.status,
      308,
      `/case-studies/${sector} does not redirect`,
    );
    assert.equal(response.headers.get("location"), "/case-studies");
  }


  /* **A label over each fact, and none over the name.** That is the whole of the
     owner's distinction, 2026-08-25: the name is the card's heading and a word
     above a heading is a caption on it. Both halves asserted — a label arriving
     over the name would be the obvious way to "finish" this card, and nothing
     else here would notice. */
  assert.deepEqual(
    [...cardMarkup.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]),
    Array.from({ length: 8 }, () => ["Location", "Industry"]).flat(),
  );
  assert.doesNotMatch(
    cardMarkup,
    /<dt>[^<]*<\/dt>\s*<[^>]*clients-card__name/,
    "a label has appeared over the card's name",
  );
  assert.doesNotMatch(cardMarkup, /<dt>Client<\/dt>|<dt>Name<\/dt>/);

  /* Every card carries a picture in a box of the same shape. Four tints cycled
     by position, so no plate sits under its own colour. */
  assert.equal((cardMarkup.match(/class="clients-card__plate"/g) ?? []).length, 8);
  assert.equal((cardMarkup.match(/class="clients-card__art"/g) ?? []).length, 8);
  const tints = [...cardMarkup.matchAll(/clients-card__plate" data-tint="(\w+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(tints.slice(0, 5), ["one", "two", "three", "four", "one"]);

  /* **The pictures are placeholders on a third party's server and must not
     ship.** This is the assertion that makes that impossible to forget: it
     fails the build the day someone tries to publish this page with stock
     frames still in it, which is exactly when nobody is reading comments.
     Delete it in the same commit that puts real screenshots in. */
  assert.equal((cardMarkup.match(/https:\/\/picsum\.photos\//g) ?? []).length, 8);
  /* Decorative, so every one of them is silent to a screen reader. */
  assert.doesNotMatch(cardMarkup, /class="clients-card__art"[^>]*alt="[^"]+"/);

  /* ⚠ **THE EIGHT NAMES ON THIS PAGE ARE INVENTED AND MUST NOT SHIP.**

     Pinned for the same reason the stock photographs above are: so publishing
     this page means deleting a test on purpose rather than forgetting a
     comment. None of these is a company Mardal has worked for. Under a heading
     reading "Customer stories" and a line promising delivered work, eight
     invented companies are a claimed client list and a reader cannot tell them
     from the real archive — which is in PRODUCT.md, behind a naming decision
     nobody has made. Delete this with the commit that puts real names in. */
  assert.deepEqual(
    [...cardMarkup.matchAll(/class="clients-card__name">([^<]*)</g)].map(
      (m) => m[1],
    ),
    ["Nordvik", "Alturi", "Solvei", "Marren", "Brekk", "Vantor", "Lumea", "Kestrel"],
  );

  /* No project name, and no bracket left behind by the names landing. One entry
     still holding `[Client name]` while the other seven read as companies is
     worse than eight brackets. */
  assert.doesNotMatch(all, /\[Project|\[Client name\]|\[Location\]/);

  /* **Two lines under each name: where, then what the client does.** The
     industry came back on 2026-08-25 after a day off the card — it left when it
     WAS the rail's taxonomy and the card was repeating the filter that had put
     it there, and it returned once the rail began filtering by discipline
     instead, because the two now say different things.

     Read as PAIRS rather than as one flat list. Flat, a location landing in an
     industry's place — or one card losing a line and shifting every pair after
     it — would still be sixteen strings drawn from the right two sets. */
  const COUNTRIES = ["Switzerland", "Germany", "Austria", "Kosovo"];
  const SECTORS = [
    "Finance",
    "Healthcare",
    "Manufacturing",
    "Automotive",
    "Retail",
    "Logistics",
    "Public Sector",
  ];
  const pairs = [
    ...cardMarkup.matchAll(
      /<dt>Location<\/dt><dd>([^<]*)<[\s\S]*?<dt>Industry<\/dt><dd>([^<]*)</g,
    ),
  ];
  assert.equal(pairs.length, 8);
  for (const [, place, sector] of pairs) {
    /* Unspecific on purpose — a country, not a city or an address — asserted as
       a closed set, because "unspecific" is the kind of instruction a later
       edit satisfies once and then forgets. */
    assert.ok(
      COUNTRIES.includes(place),
      `"${place}" is more specific than a country`,
    );
    /* The industry is the one line on a card that is not invented: it is
       derived from the entry's own sector, out of the list declared once in
       content/home.ts that the homepage reads too. */
    assert.ok(SECTORS.includes(sector), `"${sector}" is not one of the seven`);
  }

  /* Read out of the cards, not off the page: Next embeds the whole tree a
     second time as its RSC payload, so counting an attribute document-wide
     counts everything twice. */
  assert.equal((cardMarkup.match(/class="clients-card__fact"/g) ?? []).length, 16);

  /* **One card is a link, and only one.** The pilot story is the only entry
     with a page behind it; the other seven go nowhere on purpose, because a
     card that looks like a link and answers with an empty page is worse than a
     card that never offered.

     Its address lost the sector segment with the taxonomy — it was
     `/case-studies/healthcare/healthcare-office-website`. */
  const links = [...cardMarkup.matchAll(/<a [^>]*class="clients-card__link"[^>]*>/g)];
  assert.equal(links.length, 1);
  assert.match(all, /href="\/case-studies\/healthcare-office-website"/);

  /* **The link opens on the picture, and that is a size, not a nesting taste.**
     The stylesheet stretches this anchor over the whole card with `inset: 0`,
     which measures from the nearest positioned ancestor. It once sat inside a
     heading that was absolutely positioned in the corner of the picture, so the
     clickable area was one word while the hover lit the whole card. */
  assert.match(cardMarkup, /<a [^>]*clients-card__link[^>]*><div [^>]*clients-card__plate/);

  /* The only thing inside that link is a silent image, so it carries its own
     name — without one the single clickable card announces itself as "link". */
  assert.match(cardMarkup, /class="clients-card__link"[^>]*aria-label="[^"]+"/);

  /* **The hover treatment is hung on data, and the data comes from the entry.**

     A card that opens something darkens and draws a plus on its picture. The
     stylesheet answers to `[data-opens]` and `[data-opens-mark]` rather than to
     anything named Clients, so another card type adopts the whole treatment by
     carrying two attributes — and, more to the point here, these eight get it
     the moment a story is written behind them, with no CSS and no markup
     touched.

     Which is the half worth asserting: `data-opens` must appear exactly as
     often as the link does. Set by hand it would drift from what actually
     opens, and a plus under the pointer on a card that answers with an empty
     page is the promise this site refuses to make. */
  assert.equal((cardMarkup.match(/data-opens="true"/g) ?? []).length, links.length);
  assert.equal((cardMarkup.match(/data-opens-mark/g) ?? []).length, 8);

  /* And it is on the card that has the link, not on some other one. */
  assert.match(
    cardMarkup,
    /<article[^>]*data-opens="true"[^>]*>[\s\S]*?class="clients-card__link"/,
  );
});

/* The pilot story — the page a card opens, and the only one there is. What is
   being judged is the shape; the words in it are slots. */
test("server-renders the one customer story", async () => {
  /* The sector segment came out of this address with the taxonomy on
     2026-08-25; next.config.ts redirects the old one. */
  const path = "/case-studies/healthcare-office-website";
  const response = await render(path);
  assert.equal(response.status, 200);

  const html = await response.text();

  /* The tab is the whole title on one line — a heading may be two, a title may
     not, and a shared link shows the title. */
  assert.match(
    html,
    /<title>A website for a healthcare office — Mardal<\/title>/i,
  );

  /* Authored line spans, so the heading breaks where it was chosen. */
  assert.match(html, /class="service-hero__title-line">A website for a</);
  assert.match(html, /class="service-hero__title-line">healthcare office</);

  /* The record across the page under the opening, the reading below it. It was
     a rail down the left held against the scroll; asserting the layout element
     is gone is what stops the pin being reinstated with nothing to hold. */
  assert.doesNotMatch(html, /class="story-layout"/);
  assert.match(html, /class="story-record"/);
  assert.match(html, /class="story-reading"/);
  for (const heading of [
    "What it replaced",
    "What it does now",
    "What the client owns",
  ]) {
    assert.match(html, new RegExp(`class="story-index__title">${heading}<`));
  }

  /* Three entries. Matched to the end of the class NAME rather than the
     attribute: a modifier on the element would break a match pinned to the bare
     class, which is a trap this file has been caught by three times — the
     linked client card, the sector filter, and the accordion this index
     replaced. */
  assert.equal((html.match(/class="story-index__entry[" ]/g) ?? []).length, 3);

  /* Numbered, and the number is decoration for the sequence rather than
     content: it is hidden from a screen reader, which reads the three headings
     in order and gets the sequence from that. */
  assert.deepEqual(
    [...html.matchAll(/class="story-index__number"[^>]*>([^<]*)/g)].map(
      (m) => m[1],
    ),
    ["01", "02", "03"],
  );
  /* The titles stay <h2>: they are the section headings of this page, which is
     why the number sits beside one in a div rather than the pair being a
     paragraph. */
  assert.equal((html.match(/<h2 class="story-index__title">/g) ?? []).length, 3);

  /* **Nothing opens, and nothing is hidden.** The index does not collapse — the
     bars travel between two piles and every reading is at full height between
     them the whole time. So the served markup carries no open/shut state at
     all, and a reader with no JavaScript, a crawler, and anyone with reduced
     motion get the same three readings in the same order. The assertion is here
     because the shape this replaced DID hide them, and reinstating a collapse
     without meaning to would show up as nothing on the page. */
  assert.doesNotMatch(html, /story-index[^"]*is-open/);
  assert.match(html, /class="story-index__copy">\[What the office was working/);

  /* **Three paragraphs and exactly one picture in every entry.** Two other
     arrangements were built and rejected on the page, and both are pinned here
     rather than left to drift back: an entry carrying two pictures, which made
     itself half as long again as its neighbours, and an entry carrying none,
     which became a band of text across the width. The counts are what catch
     either one returning. */
  assert.equal((html.match(/class="story-index__copy"/g) ?? []).length, 9);
  assert.equal((html.match(/class="story-index__shot"/g) ?? []).length, 3);
  for (const shot of html.matchAll(
    /class="story-index__shot">(.*?)<\/figure>/g,
  )) {
    assert.equal(
      (shot[1].match(/<img/g) ?? []).length,
      1,
      "a picture column holds one frame, never a stack",
    );
  }
  /* No entry carries a modifier — the three are the same shape, which is the
     thing that took two rejections to settle. */
  assert.doesNotMatch(html, /class="story-index__entry [a-z-]/);

  /* The way back, and both halves of it: leaving a story should offer the
     sector it sits in as well as the whole index. */
  assert.match(html, /href="\/case-studies"/);
  /* One crumb now. The second pointed at the sector view this story sat
     under, and that view no longer exists. */
  assert.doesNotMatch(html, /href="\/case-studies\/healthcare"/);

  /* **Still no client named, on the page most likely to name one.** A story is
     where a name wants to go — it is a page about one customer — so this is the
     assertion that matters most on this route. */
  for (const client of [
    "EN NUR",
    "Spitex",
    "Stolzbau",
    "Henor",
    "ANDI SPORT",
    "Jetonikeramika",
  ]) {
    assert.doesNotMatch(html, new RegExp(client, "i"), `${client} named`);
  }
  /* **The pictures are stock and must not ship** — the same guard the index
     carries, which fails the build the day this page is published with them
     still in it. Counted as distinct seeds: this route is server-rendered, so
     the RSC payload after the markup repeats every src. */
  const shots = new Set(
    [...html.matchAll(/https:\/\/picsum\.photos\/seed\/([a-z-]+)/g)].map(
      (match) => match[1],
    ),
  );
  assert.equal(shots.size, 5);

  /* The plate under the record: square, and inside the same column the record
     is ruled to. Order asserted because it is the argument — the record says
     what the job was, the plate shows it, the reading explains it. */
  /* Three paragraphs about the client company, in one row above the plate, and
     no headings over them. They were three sections about Mardal, which could
     carry real prose; about the client they are slots, because the office
     cannot be named and nothing about it is written down anywhere. */
  assert.equal((html.match(/class="story-about__copy"/g) ?? []).length, 3);
  const about = html.slice(
    html.indexOf('class="story-about"'),
    html.indexOf('class="story-plate"'),
  );
  assert.doesNotMatch(about, /<h[1-6]/);
  /* Every one of the three is still a bracket. This is the assertion that
     catches a plausible description of a healthcare practice being written in —
     which would read perfectly and be an invention. */
  assert.equal((about.match(/\[/g) ?? []).length, 3);

  assert.match(html, /class="story-plate"/);
  assert.ok(
    html.indexOf('class="story-record"') < html.indexOf('class="story-plate"') &&
      html.indexOf('class="story-plate"') < html.indexOf('class="story-reading"'),
    "the plate belongs between the record and the reading",
  );

  /* The right half of the opening carries a picture, behind the words rather
     than beside them — the heading, the lede and the way in all keep their
     places over it, and the menu stays white because the picture is darkened
     under it rather than the type being recoloured. */
  assert.match(html, /class="story-hero__art"/);
  assert.match(html, /class="story-hero__art-image"/);

  /* Exactly one story exists, and any other slug is a wrong address rather than
     an unwritten page. */
  assert.equal((await render("/case-studies/not-a-story")).status, 404);

  /* **The two-segment addresses are now redirects, not 404s**, and the
     difference is deliberate. They were `/case-studies/{sector}/{story}` and
     the sector segment came out with the taxonomy on 2026-08-25, so an old
     address is a moved page rather than a wrong one — `next.config.ts` strips
     the segment and lets the router judge what is left.

     Which means a wrong story under an old sector redirects to a 404 rather
     than answering with one directly. That is the correct pair of answers in
     the correct order: the address moved, and then it does not exist. */
  const moved = await render("/case-studies/healthcare/not-a-story");
  assert.equal(moved.status, 308);
  assert.equal(moved.headers.get("location"), "/case-studies/not-a-story");
  assert.equal((await render("/case-studies/not-a-story")).status, 404);

  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});
