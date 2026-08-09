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
 *  Case Studies, Company and Products, whose sections are not on the page. */
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
  assert.match(html, /Case Studies/);
  assert.match(html, /Company/);
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
  // The footer renders the site's menu less Case Studies, whose one entry did
  // not earn a column: Services, Products, Company. This said 4 until the
  // worker these tests load was actually rebuilt — `1fbc8cf` took Solutions out
  // of the menu and the count was never followed down here, but the artifact
  // predated that commit, so the assertion went on passing against a menu that
  // no longer existed.
  assert.equal((html.match(/class="site-footer__group"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /site-footer__group-title">Case Studies/);
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
  // 13 in the three menu groups — five Services, three Products, five Company —
  // the email and the phone in the details block, and the three legal links in
  // the foot. The address is not a link and the social marks are not links yet.
  // Was 25 against a four-group menu, and stale for the same reason as the
  // group count above.
  assert.equal((html.match(/class="site-footer__link"/g) ?? []).length, 18);
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
