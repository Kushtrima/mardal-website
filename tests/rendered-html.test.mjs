import assert from "node:assert/strict";
import test from "node:test";

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
  /* The support line, from the hero rather than the meta description — the two
     say different things now, and matching on the shared words passed without
     ever reaching the hero. */
  assert.match(html, /platforms, apps, CRM/);
  assert.match(html, /integrations between them/);
  assert.match(html, /class="hero-field__box"/);
  /* Server-rendered in the two-band field, the pose the cycle hands over to
     the lattice from. */
  assert.match(html, /class="hero-field"[^>]*viewBox="0 670 1920 376"/);
  // The field is drawn in one light purple now, not a colour per pose.
  assert.match(html, /fill="#c3aef3"/);
  assert.doesNotMatch(html, /fill="#(f1ce6d|6fdd9f|8ec5ef)"/);

  // Why Mardal
  assert.match(html, /Why Mardal/);
  assert.match(html, /Build smarter\./);
  assert.match(html, /Scale faster\./);
  assert.match(html, /Applied AI/);
  assert.match(html, /Solving real business problems with AI/);
  assert.match(html, /Less repetition\. More progress\./);
  assert.match(html, /Connected Systems/);
  assert.match(html, /Everything working together/);
  assert.match(html, /Technology Partnership/);
  assert.match(html, /Built with you\. Improved as you grow\./);
  assert.match(html, /We stay involved beyond launch/);

  // Card artwork
  assert.match(html, /Animated rising columns/);
  assert.match(html, /class="ipo-column ipo-column--phase-1"/);
  assert.match(html, /Animated repeating cycle/);
  assert.match(html, /class="recurring-sphere recurring-sphere--one"/);
  assert.match(html, /Animated orbiting support/);
  assert.match(html, /class="support-color-part support-color-part--small"/);
  assert.match(html, /Animated system handoff/);
  assert.match(html, /class="recommendation-wall recommendation-wall--front"/);
  assert.match(html, /card-icons\/recommendations\.png/);

  // Header — the desktop panel is its list and nothing else now: the eyebrow
  // and the sentence under it are gone, and so are the 01-07 counters, since
  // both restated what the word you clicked already said.
  assert.doesNotMatch(html, /mega-menu__(meta|eyebrow|description|number|view-all)/);
  assert.doesNotMatch(html, /Mardal Services/);
  assert.match(html, /class="mega-menu__links"/);
  assert.match(html, /AI &amp; Automation/);
  assert.match(html, /System Integration/);
  assert.match(html, /CRM Solutions/);
  assert.match(html, /Company/);

  /* Clients: the one word in the bar that is both a link and a trigger. It is a
     real anchor, so a click goes to the page, and it carries the panel's hooks
     as well, so hovering it opens the seven sectors. Every other word is one or
     the other and this is the only entry that has to be checked for both.

     Picked apart rather than matched whole, because the two builds this repo
     has do not agree on attribute order — `next dev` writes the class first and
     the worker these tests load writes the href first. An assertion on the
     whole tag passes under one and fails under the other while the markup is
     correct in both. */
  const clientsLink = html.match(/<a [^>]*>Clients<\/a>/)?.[0];
  assert.ok(clientsLink, "Clients is not rendered as a link");
  assert.match(clientsLink, /href="\/case-studies"/);
  /* `nav-trigger` is what draws the chevron and turns it. The word has a panel
     again, so the mark that says so is back with it — this is the visual half
     of the check and it is the half that silently regresses. */
  assert.match(clientsLink, /class="nav-link nav-trigger"/);
  assert.match(clientsLink, /data-nav-trigger="true"/);
  assert.match(clientsLink, /aria-controls="desktop-mega-menu"/);
  assert.match(clientsLink, /aria-expanded="false"/);
  /* One element, not two: a half conversion would leave the button standing
     beside the link and the word would open a panel on a press as well as go to
     a page. */
  assert.doesNotMatch(html, /<button[^>]*>Clients<\/button>/);

  /* **The panel is named by the word that opened it, and every trigger carries
     the id that lets it.** One panel serves all four entries, so a reader who has
     just moved focus into it is otherwise told nothing about which of the four
     list they are standing in.
     This is the static half of the keyboard fix — the half that can be asserted
     from rendered HTML. The keys themselves are `lib/nav-keys.ts`, held by
     tests/nav-keys.test.mjs, because a key handler leaves no trace in markup. */
  for (const key of ["services", "products", "case-studies", "company"]) {
    assert.match(
      html,
      new RegExp(`id="nav-trigger-${key}"`),
      `${key} has no trigger id for the panel to be named by`,
    );
  }
  const panel = html.match(/<div class="mega-menu"[^>]*>/)?.[0];
  assert.ok(panel, "the shared panel is not rendered");
  assert.match(panel, /aria-labelledby="nav-trigger-services"/);
  /* Closed on arrival, and out of the tab order while it is — `inert` is what
     stops a reader tabbing into a panel that is not on screen. */
  assert.match(panel, /inert=""/);
  assert.doesNotMatch(html, /Case Studies/);
  /* The panel it replaced held one ArvenaAI anchor pointing at a section on no
     page. PRODUCT.md forbids ArvenaAI being written as a delivered client
     outcome, so it must not come back pointing at /case-studies either. */
  assert.doesNotMatch(html, /arvena-ai-case-study/);
  /* Mobile stays a link even though the entry now has children, because the
     children are a hover affordance and there is no hovering on a phone. A tap
     means what a click means on the bar: the page. */
  const clientsMobile = html.match(/<a ([^>]*)><span>Clients<\/span>/)?.[1];
  assert.ok(clientsMobile, "Clients is not a link in the mobile index");
  assert.match(clientsMobile, /href="\/case-studies"/);
  assert.match(clientsMobile, /class="mobile-menu__index-link"/);
  assert.match(html, /Hire us/);
  assert.match(html, /Start a project/);
  assert.match(html, /class="pixel-arrow /);
  assert.doesNotMatch(html, /[↗→←]/);

  const mobileMenu = html.match(
    /<div class="mobile-menu"[\s\S]*?Start a project/,
  )?.[0];
  assert.ok(mobileMenu);
  assert.doesNotMatch(mobileMenu, /mobile-menu__(?:eyebrow|view-all)/);
  assert.doesNotMatch(mobileMenu, /View all/);

  // The sections below the fold. These strings are deliberately ones the
  // header menu does not already satisfy, so they prove the section rendered.
  assert.match(html, /What Makes Us/);
  // Five coloured boxes carrying the service names and the ids the menu wants,
  // in four tints — the second row starts one colour further on.
  assert.match(html, /Five connected services\. One team\./);
  assert.match(html, /one partner that makes everything work together/);
  assert.doesNotMatch(html, /Shaped Around You|Beyond Handover/);
  assert.equal((html.match(/class="difference-card /g) ?? []).length, 5);
  assert.doesNotMatch(html, /difference-card--(five|six)/);
  // The markup is followed by the RSC payload, which repeats every class name,
  // so the boxes are the first five matches.
  assert.deepEqual(
    [...html.matchAll(/difference-card--(\w+)/g)].map((m) => m[1]).slice(0, 5),
    ["one", "two", "three", "four", "one"],
  );
  assert.match(html, /Built across industries/);
  /* The seven sectors are declared once now and read by both this section and
     the header's Clients panel. The descriptor is what proves this section
     still gets the whole entry rather than only the name the menu needs. */
  assert.match(html, /Physical stores, e-commerce businesses/);

  // Products: three names, each over its own drawing in bars.
  // Set as explicit lines rather than left to wrap, and stepped in the CSS.
  assert.match(html, /class="products-title__line">We build what</);
  assert.match(html, /class="products-title__line">should exist\.</);
  assert.match(html, /Arvena AI/);
  assert.match(html, /Ftesa\.co/);
  assert.match(html, /Ihrauto/);
  assert.equal((html.match(/class="product"/g) ?? []).length, 3);
  assert.equal(
    (html.match(/<p class="product-fact__value">In development<\/p>/g) ?? [])
      .length,
    3,
  );
  // A quiet link, not a filled box: the same one the industries use.
  assert.equal((html.match(/class="product__cta"/g) ?? []).length, 3);
  /* "Explore more" on all three, and it must not leak. `products.cta` is read
     only by the product cards while `products.ctaHref` beside it is read by
     half the site, so the label was changed on 2026-08-09 without touching the
     "Get in touch" the five service CTA blocks still say. Both halves of that
     are asserted, here and on the service page below. */
  assert.equal(
    (html.match(/class="product__cta" href="[^"]*">Explore more/g) ?? []).length,
    3,
  );
  assert.doesNotMatch(html, /class="product__cta" href="[^"]*">Get in touch/);

  /* **The seven industries go somewhere now, one page each.** They were a
     button the scrollbar had taken the job from, then a plain word with no
     destination at all; each is a link to its own sector on the Clients page.
     Read off the whole tag rather than assuming attribute order — the two
     builds this repo has disagree on it, and `next dev` writes one way while
     the worker these tests load writes the other.

     The order is asserted with them: the sectors are declared once at the top
     of content/home.ts and this run, the header panel and the Clients index are
     all built from that one array, so a sector reordered in the declaration and
     not here would mean something had been copied that should have been
     shared. */
  const industryLinks = [...html.matchAll(/<a ([^>]*industries-item[^>]*)>/g)]
    .map((match) => match[1].match(/href="([^"]*)"/)?.[1])
    .filter(Boolean);
  assert.deepEqual(industryLinks, [
    "/case-studies/finance",
    "/case-studies/healthcare",
    "/case-studies/manufacturing",
    "/case-studies/automotive",
    "/case-studies/retail",
    "/case-studies/logistics",
    "/case-studies/public-sector",
  ]);

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
  assert.match(html, /aria-label="Artificial Intelligence plus Human Creativity"/);

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
  assert.match(html, /class="service-hero__pattern"/);
  assert.doesNotMatch(
    html,
    /service-hero__kicker|service-hero__bar|service-hero__pattern-image/,
  );

  // The band of bars that used to sit under the heading is gone, and nothing
  // of it is left behind.
  assert.doesNotMatch(html, /service-banner/);

  // The service journey renders every card in source order before motion is
  // enhanced, so the content remains complete without client-side JavaScript.
  assert.match(html, /AI &amp; Automation Services/);
  assert.match(html, /AI Applications/);
  assert.match(html, /data-service-group-link="1"[^>]*>Automation</);
  assert.equal((html.match(/class="service-card"/g) ?? []).length, 12);
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

test("server-renders the System Integration service page", async () => {
  const response = await render("/services/system-integration");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>System Integration — Mardal<\/title>/i);
  assert.match(html, /class="service-hero__title"/);
  assert.match(html, /Keep your business/);
  assert.match(html, /in sync\./);
  assert.match(html, /Connect your CRM, ERP, and business apps\./);
  assert.match(
    html,
    /class="service-hero__pattern service-hero__pattern--system-integration"/,
  );
  assert.match(html, /System Integration Services/);
  assert.match(html, /Business Integrations/);
  assert.match(html, /App Connections/);
  assert.match(html, /Integration Support/);
  assert.equal((html.match(/class="service-card"/g) ?? []).length, 9);
  assert.equal((html.match(/data-service-group-link=/g) ?? []).length, 3);
  assert.match(
    html,
    /class="service-journey__skip" href="#system-integration-cta" data-scroll-direct="true" data-scroll-duration="1.5" data-scroll-ease="sine.in" data-scroll-preserve-view="true" data-service-skip="true"[^>]*>[\s\S]*?pixel-x[\s\S]*?Skip[\s\S]*?<\/a>/,
  );
  assert.match(html, /class="service-cta" id="system-integration-cta"/);
  assert.match(html, /class="service-journey__controls"/);
  assert.match(
    html,
    /class="service-cta__inner" data-enter="true" data-enter-mode="none"/,
  );
  assert.match(html, /CRM &amp; ERP/);
  assert.match(html, /E-commerce &amp; Operations/);
  assert.match(html, /Accounting &amp; Payments/);
  assert.match(html, /Custom Connections/);
  assert.match(html, /Communication Tools/);
  assert.match(html, /Data Transfer &amp; Sync/);
  assert.match(html, /Connect the systems used across sales, orders, inventory/);
  assert.match(
    html,
    /<span data-service-word="true">Connect<\/span> <span data-service-word="true">the<\/span>/,
  );
  assert.match(html, /We connect websites, internal software, and specialist business apps/);
  assert.match(html, /Microsoft Teams, and Slack/);
  assert.match(html, /Information from older software is cleaned and moved into a new system/);
  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});

test("server-renders the CRM Solutions service page", async () => {
  const response = await render("/services/crm-solutions");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>CRM Solutions — Mardal<\/title>/i);
  assert.match(html, /One system for/);
  assert.match(html, /your business\./);
  assert.match(
    html,
    /Keep everything organized, connected, and easy to manage\./,
  );
  assert.match(
    html,
    /class="service-hero__pattern service-hero__pattern--crm-solutions"/,
  );
  assert.match(html, /CRM Solutions Services/);
  assert.match(html, /CRM Strategy/);
  assert.match(html, /CRM Implementation/);
  assert.match(html, /CRM Operations/);
  assert.match(html, /AI-Powered/);
  assert.equal((html.match(/class="service-card"/g) ?? []).length, 18);
  assert.equal((html.match(/data-service-group-link=/g) ?? []).length, 4);
  assert.match(
    html,
    /class="service-journey__skip" href="#crm-solutions-cta" data-scroll-direct="true" data-scroll-duration="1.5" data-scroll-ease="sine.in" data-scroll-preserve-view="true" data-service-skip="true"[^>]*>[\s\S]*?pixel-x[\s\S]*?Skip[\s\S]*?<\/a>/,
  );
  assert.match(html, /class="service-cta" id="crm-solutions-cta"/);
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
  assert.match(html, /href="\/services\/system-integration"/);
  assert.match(html, /href="\/services\/crm-solutions"/);
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

/* The sector filter, which is the answer to "choosing Finance should not mean
   coming back to the header to change your mind": one page, seven views, and
   the view chosen on the SERVER so the first paint is already the right one.
   These assert the server half — that /case-studies/finance arrives filtered
   rather than arriving whole and correcting itself in the browser. */
test("filters the Clients page by sector, server-side", async () => {
  const all = await (await render("/case-studies")).text();
  const finance = await (await render("/case-studies/finance")).text();
  const publicSector = await (
    await render("/case-studies/public-sector")
  ).text();

  /* Matched to the end of the class name rather than the end of the attribute:
     a card with a story behind it carries a modifier too, and pinning this to
     the bare `class="clients-card"` stopped counting it the moment the first
     story existed. */
  const cards = (html) => (html.match(/class="clients-card[" ]/g) ?? []).length;
  /* Matched across the class list rather than against one exact string — All
     carries a modifier of its own — and reaching through to the label span,
     since the word is wrapped now: the span is what travels when a sector is
     chosen, so the button holds no text of its own to match on. */
  const lit = (html) =>
    html.match(
      /clients-filter__item[^"]*is-current"[\s\S]*?clients-filter__label">([^<]*)/,
    )?.[1];

  /* Unfiltered is every entry, and the word lit in the row says so. */
  assert.equal(lit(all), "All");
  assert.equal(cards(all), 8);

  /* All closes the row rather than opening it: the seven sectors are a list,
     and the way out of one of them is not the eighth member of that list. This
     asserts the order, because it is a decision and not an accident of how the
     array happens to be written. */
  const order = [
    ...all.matchAll(/class="clients-filter__label">([^<]*)/g),
  ].map((match) => match[1]);
  assert.equal(order.at(-1), "All");
  assert.equal(order.at(0), "Finance");
  assert.equal(order.length, 8);

  /* Filtered is a subset, and only that sector survives — the count and the
     labels both, since a filter that changed the count while leaving a stray
     card from another sector would pass on the count alone. */
  assert.equal(lit(finance), "Finance");
  assert.equal(cards(finance), 2);
  const labels = [
    ...finance.matchAll(/class="clients-card__title">([^<]*)/g),
  ].map((match) => match[1]);
  assert.deepEqual([...new Set(labels)], ["Finance"]);

  /* Every card carries a picture in a box of the same shape. Four tints cycled
     by position, so no plate sits under its own colour — the tint is what
     stands in the box while a picture is in flight and what is left if one
     never arrives. */
  assert.equal((all.match(/class="clients-card__plate"/g) ?? []).length, 8);
  assert.equal((all.match(/class="clients-card__art"/g) ?? []).length, 8);

  /* **The pictures are placeholders on a third party's server and must not
     ship.** This is the assertion that makes that impossible to forget: it
     fails the build the day someone tries to publish this page with stock
     frames still in it, which is exactly when nobody is reading comments.
     Delete it in the same commit that puts real screenshots in. */
  assert.equal((all.match(/https:\/\/picsum\.photos\//g) ?? []).length, 8);
  /* Decorative, so every one of them is silent to a screen reader: they are
     photographs of nothing to do with the work. */
  assert.doesNotMatch(all, /class="clients-card__art"[^>]*alt="[^"]+"/);
  const tints = [...all.matchAll(/clients-card__plate" data-tint="(\w+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(tints.slice(0, 5), ["one", "two", "three", "four", "one"]);

  /* No project name anywhere on a card. A project's name is its client's, and
     the sector heads the card precisely so nothing has to stand in for one —
     `[Project 01]` was the placeholder that used to, and a bracket must never
     reach a page. */
  assert.doesNotMatch(all, /\[Project/);

  /* Two fields a card, in this order: who it was for, then what it was. */
  const fields = [...all.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]);
  assert.deepEqual(fields.slice(0, 2), ["Client", "Description"]);
  assert.equal(fields.length, 16);
  /* The three they replaced are gone rather than left rendering beside them. */
  assert.doesNotMatch(all, /<dt>(Replaced|Does now|Client owns)<\/dt>/);

  /* **One card is a link, and only one.** The pilot story is the only entry
     with a page behind it; the other seven go nowhere on purpose, because a
     card that looks like a link and answers with an empty page is worse than a
     card that never offered. This is what stops the next story being wired up
     by adding a route and forgetting the index, or the reverse. */
  /* Read off the whole tag rather than assuming class comes before href: the
     two builds this repo has disagree on attribute order, and `next dev` writes
     one way while the worker these tests load writes the other. */
  const links = [...all.matchAll(/<a ([^>]*clients-card__link[^>]*)>/g)]
    .map((match) => match[1].match(/href="([^"]*)"/)?.[1])
    .filter(Boolean);
  assert.deepEqual(links, [
    "/case-studies/healthcare/healthcare-office-website",
  ]);

  /* **The link opens on the picture, and that is a size, not a nesting taste.**
     The stylesheet stretches this anchor over the whole card with `inset: 0`,
     which measures from the nearest positioned ancestor. The anchor used to sit
     inside `.clients-card__title` — absolutely positioned in the corner of the
     picture, shrunk to the word in it — so the clickable area was the word while
     the card's hover lit the whole panel. Markup is the only place that fact is
     visible, so it is asserted here: the anchor must open directly on the plate,
     and no anchor may appear inside a title. */
  assert.match(all, /<a [^>]*clients-card__link[^>]*><div [^>]*clients-card__plate/);
  assert.doesNotMatch(all, /clients-card__title[^>]*>\s*<a[\s>]/);

  /* **The Client field is the one this page may not fill.** PRODUCT.md records
     that per-client sign-off for naming those companies publicly was never
     recorded, so the slot stays bracketed — this is the assertion that catches a
     real name being typed into the likeliest place on the whole site for one to
     appear. The named-client loop below covers the seven the archive holds; this
     covers the field itself being filled with anything at all. */
  assert.match(all, /<dt>Client<\/dt><dd>\[Client name\]<\/dd>/);

  /* A sector with nothing in it is a screen, not a blank: the same empty state
     the Blog index shows, the bars standing in for writing that is genuinely
     not there. Every sector is in this state until the entries are written —
     this one is only the first to prove it renders. */
  assert.equal(lit(publicSector), "Public Sector");
  assert.equal(cards(publicSector), 0);
  assert.match(publicSector, /class="clients-empty__title"/);
  assert.match(publicSector, /Nothing published yet\./);

  /* The sector leads the tab, because a shared link shows the tab and the
     sector is why it was shared. */
  assert.match(finance, /<title>Finance — Clients — Mardal<\/title>/i);

  /* A sector that does not exist is a wrong address, not an empty filter. */
  assert.equal((await render("/case-studies/nonsense")).status, 404);

  /* **Still no client named, on the filtered routes too.** The assertion above
     covers /case-studies alone; these are seven more pages that could carry a
     name, and the entries on them are the likeliest place for one to arrive. */
  for (const client of [
    "EN NUR",
    "Spitex",
    "Stolzbau",
    "Henor",
    "ANDI SPORT",
    "Jetonikeramika",
  ]) {
    assert.doesNotMatch(finance, new RegExp(client, "i"), `${client} named`);
    assert.doesNotMatch(all, new RegExp(client, "i"), `${client} named`);
  }
});

/* The pilot story — the page a card opens, and the only one there is. What is
   being judged is the shape; the words in it are slots. */
test("server-renders the one customer story", async () => {
  const path = "/case-studies/healthcare/healthcare-office-website";
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
  assert.match(html, /href="\/case-studies\/healthcare"/);

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

  /* Exactly one story exists. Any other address under a sector is a wrong
     address, not an unwritten page. */
  assert.equal(
    (await render("/case-studies/healthcare/not-a-story")).status,
    404,
  );
  assert.equal(
    (await render("/case-studies/finance/healthcare-office-website")).status,
    404,
  );

  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});
