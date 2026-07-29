import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /technology behind/);
  assert.match(html, /class="hero-field__box"/);
  // The field is server-rendered in its settled pose, in the brand colour.
  assert.match(html, /class="hero-field"[^>]*viewBox="0 0 1920 1400"/);
  assert.match(html, /fill="#8362b8"/);

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

  // Header — the full menu, including entries whose sections are not on this
  // page yet.
  assert.match(html, /Mardal Services/);
  assert.match(html, /AI &amp; Automation/);
  assert.match(html, /Solutions by Industry/);
  assert.match(html, /Mardal Products/);
  assert.match(html, /Mardal Projects/);
  assert.match(html, /Inside Mardal/);
  assert.match(html, /Careers/);
  assert.match(html, /Hire us/);
  assert.match(html, /Start a project/);

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
  assert.match(html, /class="products-title__line">Products are</);
  assert.match(html, /class="products-title__line">how we test</);
  assert.match(html, /class="products-title__line">our thinking\.</);
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
  assert.equal((html.match(/class="product__arrow"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /button--flat|shape-flat/);
  // Each product states the two things actually known about it, against a
  // rule, the way the reference sets its facts.
  assert.equal((html.match(/class="product-fact"/g) ?? []).length, 9);
  assert.match(html, /<p class="product-fact__label">Status<\/p>/);
  assert.match(html, /<p class="product-fact__label">Field<\/p>/);
  assert.match(html, /<p class="product-fact__label">Year<\/p>/);
  // The year is not known for any of them, so it ships as a bracket rather
  // than as a number somebody made up.
  assert.equal(
    (html.match(/<p class="product-fact__value">\[Year\]<\/p>/g) ?? []).length,
    3,
  );
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
  assert.match(html, /hello@mardal\.com/);

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
    /class="site-footer__detail-value"><a class="site-footer__link" href="mailto:hello@mardal\.com"/,
  );
  // The footer renders the site's menu less Case Studies, whose one entry did
  // not earn a column.
  assert.equal((html.match(/class="site-footer__group"/g) ?? []).length, 4);
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
  // 20 in the four menu groups, the address in the details block, and the
  // three legal links in the foot.
  assert.equal((html.match(/class="site-footer__link"/g) ?? []).length, 24);
  assert.doesNotMatch(html, /site-footer__column/);
  // The mark sits under the rule now, with the way back up opposite it, and
  // the year and the legal links below them.
  assert.match(
    html,
    /class="site-footer__meta">[\s\S]*?site-footer__mark[\s\S]*?site-footer__top-link/,
  );
  assert.match(html, /class="site-footer__legal">[\s\S]*?© \d{4} Mardal/);
  // How to reach Mardal. Only the email is real; the rest ship as brackets
  // rather than as plausible-looking details.
  assert.equal((html.match(/class="site-footer__detail"/g) ?? []).length, 4);
  assert.match(html, /site-footer__detail-label">Email</);
  assert.match(html, /site-footer__detail-label">Phone</);
  assert.match(html, /site-footer__detail-label">Address</);
  assert.match(html, /site-footer__detail-label">Follow</);
  assert.match(html, /\[Phone number\]/);
  assert.match(html, /\[Street\], \[City\]/);
  // No account to point at yet, so the names are not links.
  assert.doesNotMatch(html, /<a[^>]*>LinkedIn</);
  assert.match(html, /Privacy Policy/);
  assert.match(html, /Terms of Service/);
  assert.match(html, /Cookies/);

  // Shared machinery
  assert.match(html, /data-route-section/);
  // One arrival per section: the section moves as a whole, so no element
  // inside it carries its own reveal.
  assert.doesNotMatch(html, /data-reveal-item/);
  // Every section on the page is one, including Why Mardal.
  assert.match(html, /class="why-section"[^>]*data-route-section/);
  assert.equal((html.match(/<section class="[^"]*"[^>]*data-route-section/g) ?? []).length, 4);

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
