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
 *  which is not an anchor at all any more but a link to /case-studies.
 *  `solutions` and the seven sector anchors went with Built across industries
 *  (owner, 2026-10-05); nothing links to them. */
const menuAnchors = [
  "products",
  "arvena-ai",
  "ftesa",
  "ihrauto",
];

test("server-renders the Mardal homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  /* The old tagline left with the hero it was the heading of (2026-10-03). */
  assert.match(html, /<title>Mardal — House of Creativity &amp; Technology<\/title>/i);

  /* Hero — the owner's concept of 2026-10-03: his heading and sentence, line
     for line, over his photograph. Served in its first state (heading over a
     band of the photograph); the scroll does the rest. The opening it
     replaced, "Innovation lives here.", was deleted the same day. */
  const hero = html.match(/<section class="house-hero"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "the homepage's opening is not rendered");
  assert.deepEqual(
    [...hero.matchAll(/class="house-hero__title-line">([^<]*)</g)].map((m) => m[1]),
    ["HOUSE OF CREATIVITY", "&amp; TECHNOLOGY"],
  );
  assert.deepEqual(
    [...hero.matchAll(/class="house-hero__support-line">([^<]*)</g)].map((m) => m[1]),
    [
      "Good design and Development creates real value.",
      "We create for people, businesses and society.",
    ],
  );
  assert.match(hero, /<h1 class="house-hero__title" id="house-hero-title"/);
  assert.match(hero, /<img class="house-hero__image" src="\/house-hero-1540-ff3300\.webp" alt="[^"]+" width="1540" height="1021"/);
  assert.doesNotMatch(html, /data-hero-line/);

  /* The bar names where Mardal is, beside the wordmark. */
  assert.match(html, /<span class="site-nav__place">Operating from Kosova<\/span>/);
  /* On the homepage the opening carries its own, at the band's right end on
     arrival (owner, 2026-10-05: "by default thi text to be move on that
     position"), which the scroll takes down to the foot of the photograph. */
  assert.match(hero, /<p class="house-hero__place" data-house-place="true">Operating from Kosova<\/p>/);
  /* What Makes Us Different left the homepage on the owner's word, 2026-10-05
     ("delete also thi section"), its five boxes with it. */
  assert.doesNotMatch(html, /What Makes Us|class="difference-section"|difference-card/);

  /* Built across industries left the homepage on the owner's word, 2026-10-05
     ("delete also this section"), after Why Mardal and the old Selected work. */
  assert.doesNotMatch(html, /class="industries-section"|industries-explore|industries-key/);
  assert.equal(
    (html.match(/class="[^"]*product__arrow[^"]*"/g) ?? []).length,
    3,
  );
  assert.doesNotMatch(html, /button--flat|shape-flat/);
  /* Each product's lines under its picture, as Selected Work sets a piece's —
     the field, then where it stands and its year; no term labels, since the
     owner's "use our new concept" (2026-10-05). The years are the owner's. */
  assert.doesNotMatch(html, /product-fact/);
  assert.equal((html.match(/<p class="product__line">/g) ?? []).length, 6);
  for (const year of ["2025", "2024", "2026"]) {
    assert.match(
      html,
      new RegExp(`<p class="product__line">In development, ${year}</p>`),
      `missing ${year}`,
    );
  }
  /* The heading's full stop is the red square, the character kept for a
     screen reader. */
  assert.match(html, /should exist<span class="products__stop" data-products-stop="true"><span class="visually-hidden">\.<\/span><\/span>/);
  assert.doesNotMatch(html, /\[Year\]/);
  assert.match(html, /Mental health/);
  assert.match(html, /Automotive/);
  assert.match(html, /Events/);
  /* `cases-record` was the case-study section's class, and it stays gone: six
     designs of it were tried on 2026-07-28 and none of them was wanted, so the
     component, the content, the styles and the stock photography all went.

     **`Selected` came off this guard on 2026-08-27**, on the owner's word: five
     of the works on the homepage, under Built across industries. What is back is
     not that section — no cards, no photographs, no stock, no grid — it is five
     names under five redaction bars, headed with the two words the Clients
     page's own rail already uses. The class is what this guards; the word was
     standing next to it. */
  assert.doesNotMatch(html, /cases-record/);
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
  // The products stand as one ruled index under their heading (2026-10-05).
  assert.match(html, /<ul class="products__list">/);
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
  // The contact section is still off the page, and since the owner's footer
  // reference of 2026-10-05 its closing words are too.
  assert.doesNotMatch(html, /Start a conversation/);

  /* ── The header, and a note on why this block had to be rebuilt ──
     Every assertion below existed and was DESTROYED on 2026-08-25, in the
     commit that replaced the Clients taxonomy: that change rewrote large parts
     of this file and took the whole header block with it. Nothing failed,
     because what was lost was coverage rather than behaviour — and it stayed
     lost until the services were reordered and the suite went on passing.

     A green suite after a deliberate change is the symptom worth naming here.
     That is what a missing assertion looks like from the outside. */

  /* **The bar is the wordmark and the burger, and nothing else** — owner,
     2026-10-03: "i want BIG MENU so Only BURGER menu". The words that stood in
     the bar, and the dropdown under them, are gone at every width; the old
     header is in backup/2026-10-03-site-header/. */
  const bar = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(bar, "the bar is not rendered");
  assert.match(bar, /class="brand"/);
  assert.match(
    bar,
    /<button class="mobile-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation"/,
  );
  /* "Menu" and a drawn plus (owner, 2026-10-03), where the two lines were — the
     same word open and shut; the mark folds to a minus. Sentence case and the
     plus split into four strokes since 2026-10-05, from his screenshot. */
  /* The word rolls under the pointer, as VIEW ALL's does (owner, 2026-10-05):
     written twice, the copy hidden, so the button is still named "Menu". */
  assert.match(bar, /class="mobile-menu-toggle__label"><span class="roll"><span class="roll__face">Menu<\/span><span class="roll__face roll__face--next" aria-hidden="true">Menu<\/span>/);
  assert.match(bar, /aria-controls="mobile-navigation" data-roll="true"/);
  assert.match(bar, /class="mobile-menu-toggle__plus" aria-hidden="true"/);
  assert.doesNotMatch(bar, /mobile-menu-toggle__bars|CLOSE/);

  /* **No ground, and MENU alone once the page has moved** — owner, 2026-10-03:
     "remove the bacground when scroll in and when scrollin to be visible only
     MENU +". So the bar has no ground layer and never slides off; what leaves is
     the wordmark and its place. Read from the stylesheet, since the states are
     attributes the server never writes. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(CSS, /\.site-header::before|\.site-header\[data-header="hidden"\]/);
  /* Scrolled, only the wordmark's ring stays (owner, 2026-10-05: "also when
     scroll only icon of the logo to remain") — the letters clipped away to
     its 163.92 of 694.25 units — and the place beside it goes. */
  assert.match(
    CSS,
    /\.site-header:not\(\[data-header="top"\]\):not\(\.site-header--mobile-menu-open\)\s*\.brand-logo\s*\{[^}]*clip-path:\s*inset\(0 76\.39% 0 0\)/,
  );
  assert.match(
    CSS,
    /\.site-header:not\(\[data-header="top"\]\):not\(\.site-header--mobile-menu-open\)\s*\.site-nav__place\s*\{[^}]*opacity:\s*0/,
  );
  /* Open, the plus stays a plus (owner, 2026-10-05: "not to transform to
     --"): nothing folds it into a minus any more. */
  assert.doesNotMatch(CSS.replace(/\/\*[\s\S]*?\*\//g, ""), /\.mobile-menu-toggle\[aria-expanded="true"\] \.mobile-menu-toggle__plus/);
  /* The split: each stroke's middle is left open, upright and level alike. */
  assert.match(CSS, /\.mobile-menu-toggle__plus::before\s*\{[^}]*linear-gradient\(\s*to right,\s*currentcolor var\(--plus-arm\),\s*transparent 0 calc\(100% - var\(--plus-arm\)\)/);
  assert.match(CSS, /\.mobile-menu-toggle__plus::after\s*\{[^}]*linear-gradient\(\s*to bottom,\s*currentcolor var\(--plus-arm\),\s*transparent 0 calc\(100% - var\(--plus-arm\)\)/);
  /* A minus only while the menu is open; under the pointer the plus turns
     slowly instead, at its own size — he wanted neither the minus nor a bigger
     plus on hover. */
  /* Under the pointer the plus does not move at all since 2026-10-05 — Menu
     takes VIEW ALL's hover, "not to move the icon" — and the word is set at
     VIEW ALL's size and weight. */
  assert.doesNotMatch(CSS.replace(/\/\*[\s\S]*?\*\//g, ""), /:hover \.mobile-menu-toggle__plus/);
  /* The rule that sets its type — the first `.mobile-menu-toggle {` in the
     file is a shared pointer-events rule. */
  const toggle = [...CSS.matchAll(/(?:^|\n)\.mobile-menu-toggle \{([^}]*)\}/g)]
    .map((match) => match[1])
    .find((body) => /font-size/.test(body)) ?? "";
  assert.match(toggle, /font-size:\s*var\(--text-body\)/);
  assert.match(toggle, /font-weight:\s*var\(--weight-body\)/);
  assert.doesNotMatch(CSS, /\.mobile-menu-toggle:hover \.mobile-menu-toggle__plus::after/);
  /* And under the pointer the whole button is the site's red — the owner's,
     which took the lilac's place everywhere on 2026-10-03, and is #ff3300 since
     2026-10-05 ("also use this color as a globall : FF3300"). */
  assert.match(CSS, /--tint-red:\s*#ff3300;/);
  assert.doesNotMatch(CSS, /--tint-lilac/);
  assert.match(CSS, /\.mobile-menu-toggle:hover\s*\{\s*color:\s*var\(--tint-red\);\s*\}/);

  /* With no ground of its own, the bar turns white over anything dark, which
     marks itself: the opening's photograph. The footer is white since the
     owner's reference of 2026-10-05, and does not. */
  assert.match(html, /class="house-hero__frame" data-house-frame="true" data-bar-dark="true"/);
  assert.doesNotMatch(html, /<footer[^>]*data-bar-dark/);
  assert.doesNotMatch(html, /site-footer__panel/);
  /* **The bar's row of pages** — owner, 2026-10-05: "no big menu but when
     hover to aper menu on the left … Home, Services, Products, Clients,
     about … only as a text", and "when click inside to have all services and
     other not as a sublink". Five plain links beside Menu, each to the page
     that holds everything under it; no sub-links, and no Company or Hire us. */
  const row = bar.match(/<ul class="bar-menu" id="bar-menu" aria-label="Pages">[\s\S]*?<\/ul>/)?.[0];
  assert.ok(row, "the bar has no row of pages");
  assert.deepEqual(
    [...row.matchAll(/<a [^>]*href="([^"]+)"[^>]*class="bar-menu__link"|<a [^>]*class="bar-menu__link"[^>]*href="([^"]+)"/g)].map((m) => m[1] ?? m[2]),
    ["/", "/services", "/products", "/case-studies", "/about"],
  );
  assert.deepEqual(
    [...row.matchAll(/<span class="roll__face">([^<]*)</g)].map((m) => m[1]),
    ["Home", "Services", "Products", "Clients", "About"],
  );
  assert.doesNotMatch(bar, />(Company|Hire us)</);
  assert.doesNotMatch(html, /mega-menu|nav-trigger|site-nav__actions/);

  /* The menu is closed on arrival and out of the tab order while it is. */
  const sheet = html.match(/<div class="mobile-menu"[^>]*>/)?.[0];
  assert.ok(sheet, "the menu is not rendered");
  assert.match(sheet, /id="mobile-navigation"/);
  assert.match(sheet, /aria-hidden="true"/);
  assert.match(sheet, /inert=""/);

  /* **Four words on the red sheet — since 2026-10-05** ("now i want to
     redesin comple the menu the burger menu inside", and after three goes,
     "somthing different"). Services, Products and About are parents —
     buttons that open their pages and go nowhere (owner's call, 2026-08-24:
     disclosures, not destinations) — and Clients is a page. They arrive
     closed. */
  const pages = html.match(/<ul class="mobile-menu__pages">[\s\S]*<\/ul><div class="mobile-menu__foot"/)?.[0];
  assert.ok(pages, "the menu has no entries");
  assert.deepEqual(
    [...pages.matchAll(/data-menu-word="true"><span class="roll"><span class="roll__face">([^<]*)</g)].map((m) => m[1]),
    ["Services", "Products", "Clients", "About"],
  );
  /* About is the company's four pages under the first one's name — owner,
     2026-10-05: "maybe Blog carreers and contact to be under About". */
  for (const key of ["services", "products", "about"]) {
    assert.match(
      pages,
      new RegExp(`<button class="mobile-menu__page" type="button" aria-expanded="false" aria-controls="mobile-menu-panel-${key}"`),
      `${key} is not a closed parent`,
    );
    assert.match(pages, new RegExp(`<div class="mobile-menu__panel" id="mobile-menu-panel-${key}">`));
  }
  assert.deepEqual(
    [...pages.matchAll(/<a href="([^"]+)" class="mobile-menu__page"/g)].map((m) => m[1]),
    ["/case-studies"],
  );
  /* No second screen to step into, and nothing to go back from. */
  assert.doesNotMatch(html, /mobile-menu__(index|detail|back|count|rows|num)/);

  /* **The pages behind each parent.** The seven services in their two
     halves, each list named by its heading, in the owner's order —
     Development's four, then Creative's three (2026-10-03); the other two
     parents' lists named by the word itself. */
  const lists = Object.fromEntries(
    [...pages.matchAll(/<ul class="mobile-menu__links" (?:aria-labelledby="mobile-menu-group-(\w+)"|aria-label="(\w+)")>([\s\S]*?)<\/ul>/g)].map(
      (m) => [m[1] ?? m[2], [...m[3].matchAll(/class="mobile-menu__link-text">([^<]*)</g)].map((n) => n[1])],
    ),
  );
  assert.deepEqual(lists, {
    development: ["Websites", "Software", "CRM Solution", "AI &amp; Automation"],
    /* Branding & Logo is the menu's word only; the page behind it is still
       Branding, at the same address. */
    creative: ["Branding &amp; Logo", "UX/UI Design", "Print Design"],
    Products: ["Arvena AI", "Ftesa.co", "Ihrauto"],
    About: ["About", "Blog", "Careers", "Contact"],
  });
  for (const half of ["development", "creative"]) {
    assert.match(pages, new RegExp(`<p class="mobile-menu__group-title" id="mobile-menu-group-${half}">`));
  }
  /* Each page a ruled row: its name, and VIEW ALL's thin arrow (owner,
     2026-10-05: "i don like how sub links shows pls redesign that part"). */
  assert.equal((pages.match(/<li class="mobile-menu__item">/g) ?? []).length, 14);
  assert.equal((pages.match(/class="mobile-menu__link-arrow"/g) ?? []).length, 14);

  /* And the foot: the way in, then the ways to reach Mardal. */
  assert.match(html, /<div class="mobile-menu__foot"[^>]*>[\s\S]*?class="mobile-menu__cta" data-roll="true" href="\/contact"[\s\S]*?href="mailto:info@mardal\.co"[\s\S]*?href="tel:\+38349210999"/);

  /* Names only — no line of description under any of them. The dropdown of
     the same day shipped with one and the owner took them out: "why
     explanation under each menu that is very bad". */
  assert.doesNotMatch(html, /__summary/);

  /* "Hire us" left with the bar; the way in is "Start a project", at the
     foot of the menu. */
  assert.doesNotMatch(html, /Hire us/);
  assert.match(html, /Start a project/);

  /* ── Footer ──
     The owner's reference of 2026-10-05: "try this version maybe you can
     addapt with our information also the logo without icon". White, three
     lists from the second rule, the wordmark without the ring the width of the
     page from there, and one line under it. */
  const footerPart = html.slice(html.indexOf("<footer"), html.indexOf("</footer>"));
  assert.match(html, /<footer class="site-footer" id="contact"/);
  assert.match(html, /© \d{4} Mardal/);
  assert.match(
    html,
    /class="site-footer__top-link" href="#main-content" data-scroll-direct="true" data-roll="true"><span class="roll"><span class="roll__face">Back to top</,
  );

  // The wordmark without the ring: a file of its own, and the home link.
  const brand = html.match(/<a [^>]*class="site-footer__brand"[^>]*><img src="\/SVG\/logo-wordmark\.svg" alt=""/)?.[0] ?? "";
  assert.match(brand, /href="\/"/, "the footer's wordmark is not the home link");
  assert.match(brand, /aria-label="Mardal home"/);
  const wordmark = readFileSync(new URL("../public/SVG/logo-wordmark.svg", import.meta.url), "utf8");
  /* The ring is twenty bars; the one rect left is the "l". */
  assert.equal((wordmark.match(/<rect/g) ?? []).length, 1, "the ring is back in the wordmark");
  assert.match(wordmark, /viewBox="213\.12 27\.81 481\.13 91\.1"/);

  // Three lists, each a heading over its lines.
  assert.equal((html.match(/<nav class="site-footer__group" aria-labelledby="footer-group-/g) ?? []).length, 2);
  assert.match(html, /<h2 class="site-footer__group-title" id="footer-group-pages">Menu<\/h2>/);
  assert.match(html, /<h2 class="site-footer__group-title" id="footer-group-services">Services<\/h2>/);
  assert.match(html, /<h2 class="site-footer__group-title">Contact<\/h2>/);
  /* Menu is the pages that are there: Services and Products are disclosures
     in the header, not destinations, so neither placeholder is linked. */
  for (const [label, href] of [
    ["Home", "/"],
    ["About", "/about"],
    ["Clients", "/case-studies"],
    ["Blog", "/blog"],
    ["Careers", "/careers"],
    ["Contact", "/contact"],
  ]) {
    assert.match(footerPart, new RegExp(`<a class="site-footer__link" href="${href}">${label}</a>`), `${label} is not in the footer`);
  }
  assert.doesNotMatch(footerPart, /href="\/services"|href="\/products"/);
  for (const service of ["Websites", "Software", "CRM Solution", "AI &amp; Automation", "Branding &amp; Logo", "UX/UI Design", "Print Design"]) {
    assert.match(footerPart, new RegExp(`>${service}</a>`), `${service} is not in the footer`);
  }

  // None of the earlier footers' furniture: no closing line, no way in, no
  // ring, no panel, no paragraph.
  assert.doesNotMatch(footerPart, /site-footer__(title|cta|mark|lead|label|sign|bars|wordmark|email|body)\b/);
  assert.doesNotMatch(html, /Let’s build|Tell us what you want to improve|practical digital solution/);

  // 6 pages, 7 services, the email and the phone, and the 3 legal links. The
  // address is not a link and the social marks are not links yet.
  assert.equal((html.match(/class="site-footer__link"/g) ?? []).length, 18);
  // **Team is gone from every menu, not just this one.**
  assert.doesNotMatch(html, />Team</);
  assert.doesNotMatch(html, /href="#team"/);
  assert.doesNotMatch(html, /class="site-footer__column"/);
  assert.doesNotMatch(
    html,
    /site-footer__meta|site-footer__head|site-footer__grid|site-footer__words|site-footer__slab|site-footer__index/,
  );
  const bandOrder = ["__columns", "__brand-mask", "__legal"].map((band) =>
    footerPart.indexOf(`site-footer${band}`),
  );
  assert.ok(
    bandOrder.every((at, i) => at > 0 && (i === 0 || at > bandOrder[i - 1])),
    `footer bands out of order: ${bandOrder.join(", ")}`,
  );

  // How to reach Mardal — all of it real, and the phone dialable.
  assert.equal((html.match(/class="site-footer__detail"/g) ?? []).length, 1);
  assert.match(html, /class="site-footer__detail-value">.{0,400}?href="mailto:info@mardal\.co"/s);
  assert.match(html, /href="tel:\+38349210999"[^>]*>\+383 49 210 999</);
  // Street first, then postcode and city — the order it is written in,
  // and the one that breaks into two lines a phone can hold.
  assert.match(html, /Rr\.\u00a0\u201cIsa\u00a0Boletini\u201d, 6000\u00a0Gjilan/);
  assert.doesNotMatch(html, /site-footer__detail-short/);
  assert.doesNotMatch(html, /contact-icon/);
  assert.doesNotMatch(html, /\[Phone number\]|\[Street\]|\[City\]/);
  // Three marks, drawn at the icon weight the rest of the site uses, and not
  // links: the accounts exist but their addresses have not been given, and a
  // guessed profile URL is worse than a mark that waits for one.
  //
  // Counted inside the footer and across the document. The menu's foot carried
  // the same three from 2026-08-27 until the owner asked for a minimal one on
  // 2026-10-03, so the page-wide count is three again: the footer's and no
  // others.
  const footerHtml = html.slice(html.indexOf("<footer"));
  assert.ok(footerHtml.length > 0, "the homepage renders no footer");
  assert.equal((footerHtml.match(/class="social-icon"/g) ?? []).length, 3);
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
  /* Six since 2026-10-05: the owner's Selected Work, "about" and "Our
     expertise" went in under Fusion, and Why Mardal, the old Selected work, Built across industries
     and What Makes Us Different left the homepage ("delete this section … completwly from home page")
     — five sections now;
     six since 2026-08-27: Selected work went in under Built across industries.
     Counted rather than listed, so a section added without one is caught — the
     entrance is applied by `SectionEnter` to `main > section[data-route-section]`
     and a section without the attribute simply never arrives. */
  assert.equal((html.match(/<section class="[^"]*"[^>]*data-route-section/g) ?? []).length, 5);
  assert.doesNotMatch(html, /class="why-section"|class="work-section"|class="industries-section"|class="difference-section"/);

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
  assert.match(html, /class="service-cta__link" data-roll="true" href="[^"]*"><span class="roll"><span class="roll__face">Get in touch/);

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
     editing a service page is to add the number that would make it persuasive.

     **Read from `<main>`, not from the document.** Written page-wide it also
     read the `<head>`, where every `modulepreload` carries a build hash — and it
     failed the day a new component changed those hashes and produced
     `SiteHeader-Croi8rhe.js` and `layout-segment-context-Bb2ymA6X.js`. "roi" and
     "6X" are not claims about branding work. A guard on prose has to be scoped
     to where the prose is, or it eventually fails on a random string. */
  const prose = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  assert.doesNotMatch(prose, /\d+\s*%|\d+x\b|increased|boosted|doubled|ROI/i);
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
  assert.match(html, /href="\/services\/ux-ui-design"/);
  assert.match(html, /href="\/services\/print-design"/);

  /* Not a list of strings — every href the panel carries is fetched. The old
     version of this test asserted three literals and would have gone on passing
     with the route renamed underneath it, which is exactly what happened to
     `/services/web-platforms-apps`. */
  const hrefs = [
    ...html.matchAll(/class="mobile-menu__link" href="(\/services\/[^"]+)"/g),
  ].map((m) => m[1]);
  assert.equal(hrefs.length, 7);
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

  /* The menu on this page points at the page it is on, and says so. In the
     menu since the burger of 2026-10-03, where the word is set in a span. */
  const clientsLink = html.match(/<a [^>]*class="mobile-menu__page"[^>]*>(?:(?!<\/a>)[\s\S])*data-menu-word="true"><span class="roll"><span class="roll__face">Clients</)?.[0];
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


  /* **No labels on the card — owner, 2026-09-30.** From 2026-08-25 there was a
     label over each fact and none over the name; he has taken the two off, and
     the values stand under the name alone, the way his own portfolio sets its
     work. Asserted as an absence because a label is the obvious way to "finish"
     a card like this, and nothing else here would notice one arriving. */
  assert.doesNotMatch(cardMarkup, /<(dl|dt|dd)[\s>]/);
  assert.doesNotMatch(cardMarkup, />(Location|Industry|Service|Client|Name)</);

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

  /* **Three lines under each name: the client's industry, the service, and
     where** — owner, 2026-09-30, in that order, from his own portfolio. The
     industry is the line the rail does not repeat: the rail files by
     discipline, and the service line is those same disciplines, every one the
     entry lists.

     Read per CARD rather than as one flat list. Flat, a place landing in an
     industry's slot — or one card losing a line and shifting every line after
     it — would still be twenty-four strings drawn from the right three sets. */
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
  /* The rail's seven, as the server writes them — the ampersand escaped. */
  const DISCIPLINES = [
    "UX/UI Design",
    "Branding",
    "Websites",
    "Applications",
    "Software",
    "CRM",
    "AI &amp; Automation",
  ];
  const facts = [
    ...cardMarkup.matchAll(
      /class="clients-card__name">[^<]*<\/h3><p class="clients-card__fact">([^<]*)<\/p><p class="clients-card__fact">([^<]*)<\/p><p class="clients-card__fact">([^<]*)<\/p>/g,
    ),
  ];
  assert.equal(facts.length, 8);
  for (const [, sector, service, place] of facts) {
    /* The industry is the one line on a card that is not invented: it is
       derived from the entry's own sector, out of the list declared once in
       content/home.ts that the homepage reads too. */
    assert.ok(SECTORS.includes(sector), `"${sector}" is not one of the seven`);
    assert.ok(
      service.split(", ").every((one) => DISCIPLINES.includes(one)),
      `"${service}" is not a list of the rail's disciplines`,
    );
    /* Unspecific on purpose — a country, not a city or an address — asserted as
       a closed set, because "unspecific" is the kind of instruction a later
       edit satisfies once and then forgets. */
    assert.ok(
      COUNTRIES.includes(place),
      `"${place}" is more specific than a country`,
    );
  }

  /* Read out of the cards, not off the page: Next embeds the whole tree a
     second time as its RSC payload, so counting an attribute document-wide
     counts everything twice. */
  assert.equal((cardMarkup.match(/class="clients-card__fact"/g) ?? []).length, 24);

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

/** The four boxes under "Why Mardal?", rebuilt 2026-08-26 from a reference the
 *  owner sent: a number, a short title, a lot of air, a plus in the corner.
 *
 *  Written out here rather than imported. The section this replaced had NO test
 *  at all — the whole of it could be swapped, drawings and copy together, and
 *  the suite stayed green, which is how a change this size arrives unnoticed. */
const WHY_COPY = [
  "We start from how your business actually works",
  "AI and automation, CRM, custom software, web platforms and apps.",
  "We use technology where it makes work faster",
  "We stay involved beyond launch",
];

const WHY_TITLES = [
  "We think strategically",
  "Technology",
  "We understand business",
  "Engagement",
];

test("the fusion mark is two strokes, and still says nothing", async () => {
  const html = await (await render("/")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const at = main.indexOf('class="fusion-section"');
  assert.ok(at > 0, "the fusion section is not on the page");
  const section = main.slice(at, main.indexOf("</section>", at));

  /* **Two spans rather than `::before` and `::after`**, since the mark is drawn
     one stroke at a time and a tween cannot reach a pseudo-element. Nothing
     about how it looks changed — same size vars, same `currentcolor`. */
  assert.match(section, /class="fusion-plus"[^>]*aria-hidden="true"/);
  assert.match(section, /class="fusion-plus__stroke fusion-plus__stroke--up"/);
  assert.match(section, /class="fusion-plus__stroke fusion-plus__stroke--across"/);

  /* The upright is written FIRST, and that is the order it is drawn in. Markup
     order is not what drives the timeline, but a reader meeting `across` above
     `up` would reasonably assume it is. */
  assert.ok(
    section.indexOf("--up") < section.indexOf("--across"),
    "the crossbar is written above the upright it is drawn after",
  );

  /* A drawn mark leaves nothing at the join for a screen reader, so the heading
     carries its own spoken name and the mark stays out of the tree. Splitting it
     into two elements doubles the ways that can go wrong. */
  assert.match(
    section,
    /aria-label="Human Creativity plus Artificial Intelligence"/,
  );
  assert.equal((section.match(/aria-hidden="true"/g) ?? []).length, 1);

  /* Both halves are addressable, and named by side rather than by index: the
     reveal uncovers one from its left edge and one from its right, and a
     `[0]`/`[1]` pair would swap silently if the markup were ever reordered. */
  assert.match(section, /class="fusion-title__half" data-fusion-half="left"/);
  assert.match(section, /class="fusion-title__half" data-fusion-half="right"/);

  /* **It declines the site's section entrance.** A block that holds itself in
     place cannot also be arriving — a pin is measured while its ancestor's lag
     is applied and then rests exactly that far out, which is a real bug this
     codebase has had before. */
  assert.match(section, /data-enter-mode="none"/);
});

test("the fusion reveal draws the rules and the mark, and raises the lines", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const code = readFileSync(
    new URL("../components/home/FusionReveal.tsx", import.meta.url),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");
  const bare = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  const rule = (selector) => {
    const at = bare.indexOf(selector);
    assert.ok(at > 0, `${selector} has no rule`);
    return bare.slice(at, bare.indexOf("}", at));
  };

  /* **The stylesheet does not draw the plus too.** Leaving pseudo-elements
     behind would put two crossbars in the mark, one of them undrawable. */
  assert.doesNotMatch(bare, /\.fusion-plus::(before|after)/);

  /* **Played, not scrolled** — owner, 2026-10-05: "remove the on scroll
     effect put a normal effect from gsap". No pin holds the page and no scrub
     ties the beats to the scroll: each trigger only says when, and plays once. */
  assert.doesNotMatch(code, /pin:|scrub:|HOLD/);
  assert.match(code, /once: true/);
  assert.match(code, /const START = "top 85%";/);

  /* **Smoother, more elegant** — the same day. Each block arrives as it comes
     into view rather than one timeline for a composition taller than the
     screen; nothing overshoots, and the mark neither rises nor grows. */
  assert.doesNotMatch(code, /back\.out|scale: 0\.72|y: still \? 0 : 90/);
  for (const block of ["once(section)", "once(left)", "once(right)", 'once(copy, "top 92%")']) {
    assert.ok(code.includes(block), `${block} has no trigger of its own`);
  }

  /* **Each heading line rises out of its own mask**, the menu's motion: the
     line clips, the inner span travels. Clipped at the line, not the half, so
     the lines arrive one after the next — and opened at the foot so the
     descenders are whole at rest. */
  assert.match(rule(".fusion-title__line {"), /clip-path:\s*inset\(-0\.15em -0\.25em -0\.3em\)/);
  assert.match(code, /\{ yPercent: 120 \}/);
  assert.match(code, /const RISE = \{ duration: 1\.4, ease: "expo\.out", stagger: 0\.12 \};/);

  /* **The mark is drawn, as he chose on 2026-08-26**: the upright out of its
     own foot, the crossbar from the centre, eased at both ends. */
  assert.match(code, /scaleY: 0, transformOrigin: "50% 100%"/);
  assert.match(code, /scaleX: 0, transformOrigin: "50% 50%"/);
  assert.match(code, /const DRAW = "power3\.inOut";/);

  /* **The rules are drawn first**, down the section, through a custom property
     the stylesheet's clip reads — whole when the script never runs. */
  assert.match(rule(".fusion-section::before {"), /clip-path:\s*inset\(0 0 calc\(\(1 - var\(--fusion-rules, 1\)\) \* 100%\) 0\)/);
  assert.match(code, /"--fusion-rules": 1/);

  /* **And nothing is hidden in CSS.** The start states are written by the
     script, so a page with it blocked shows the section whole. */
  for (const selector of [".fusion-title__line {", ".fusion-title__rise {", ".fusion-copy {"]) {
    assert.doesNotMatch(rule(selector), /opacity|transform:|translate/, `${selector} hides itself`);
  }

  /* **Reduced motion keeps the order and drops the travel**: the lines fade
     where they would rise, the sentence does not lift, the strokes still draw. */
  assert.match(code, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(code, /still \? \{ opacity: 0 \} : \{ yPercent: 120 \}/);
  assert.match(code, /y: still \? 0 : 24/);

  /* Reverted on unmount, or a route change leaves triggers behind on a page
     that no longer has the section. */
  assert.match(code, /context\.revert\(\)/);
});

test("Selected Work stands under Fusion, as the owner's comp draws it", async () => {
  const html = await (await render("/")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const fusion = main.indexOf('class="fusion-section"');
  const at = main.indexOf('class="selected-work"');
  assert.ok(fusion > 0 && at > fusion, "Selected Work is not under the Fusion section");
  assert.ok(at < main.indexOf('class="products"'), "Selected Work is not above Products");
  const section = main.slice(at, main.indexOf("</section>", at));

  /* His words, line for line: the heading in two lines, VIEW ALL to the index
     that exists, and two pieces with the same three lines under each. */
  assert.match(section, /data-selected-work-line[^>]*>SELECTED<\/span>/);
  assert.match(section, /data-selected-work-line[^>]*>WORK<\/span>/);
  /* Attributes in either order — the worker's Link writes href first. */
  const viewAll = section.match(/<a [^>]*selected-work__all[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.match(viewAll, /href="\/case-studies"/);
  /* **The roll** (owner, 2026-10-05: "text all text in same time to rotate
     like vertically"): the word twice in one cell, the copy hidden from the
     screen reader so the link is named once. */
  assert.match(viewAll, /data-roll="true"/);
  assert.match(viewAll, /<span class="roll__face">VIEW ALL<\/span>/);
  assert.match(viewAll, /class="roll__face roll__face--next" aria-hidden="true">VIEW ALL<\/span>/);
  /* The comp's pair — tall, then wide — and since 2026-10-05 two more "in
     differen format", "near each other": two squares side by side on the
     page's second and third columns, their lines under them. */
  const shapes = [...section.matchAll(/class="selected-work__item selected-work__item--(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(shapes, ["tall", "wide"]);
  assert.equal((section.match(/class="selected-work__feature"/g) ?? []).length, 2);
  const CSSF = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(CSSF, /\.selected-work__feature \.selected-work__frame \{\s*aspect-ratio:\s*1;/);
  /* The left in the second column, as it was; the right "to the end of the
     width" — from the third rule to the page's right edge. */
  assert.match(CSSF, /\.selected-work__features \{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/);
  assert.match(CSSF, /\.selected-work__feature:nth-child\(1\) \{\s*grid-column:\s*2;/);
  assert.match(CSSF, /\.selected-work__feature:nth-child\(2\) \{\s*grid-column:\s*3 \/ -1;/);
  for (const line of ["Buhler", "Software, CRM", "Switzerland"]) {
    assert.equal(
      (section.match(new RegExp(`>${line}<`, "g")) ?? []).length,
      4,
      `"${line}" is not under every piece`,
    );
  }
  assert.equal((section.match(/src="\/selected-work-buhler\.webp"/g) ?? []).length, 4);

  /* **No piece opens anything** — there is no Buhler page, and a card that
     answers with nothing is the promise this site refuses to make. VIEW ALL is
     the section's one link. */
  const list = section.slice(section.indexOf('class="selected-work__list"'));
  assert.doesNotMatch(list, /<a /);

  /* Its own entrance, so it declines the site's, and nothing in the
     stylesheet hides it before the script runs. */
  assert.match(main.slice(at - 300, at + 400), /data-enter-mode="none"/);
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const selector of [".selected-work__rise {", ".selected-work__frame {", ".selected-work__meta {"]) {
    const rule = CSS.slice(CSS.indexOf(selector), CSS.indexOf("}", CSS.indexOf(selector)));
    assert.doesNotMatch(rule, /opacity|clip-path:\s*inset\(100%|transform:/, `${selector} hides itself`);
  }

  /* The word turns, the whole of it at once, and the arrow stays where it
     is: "the arrows dont move". */
  assert.match(CSS, /\[data-roll\]:hover \.roll__face \{\s*transform:\s*rotateX\(90deg\);/);
  assert.match(CSS, /\[data-roll\]:hover \.roll__face--next \{\s*transform:\s*rotateX\(0deg\);/);
  assert.doesNotMatch(CSS, /\.selected-work__all:hover \.selected-work__all-arrow/);

  /* The three-in-a-row design with a hover was tried and reverted on the
     owner's word the same day: "i dont like the selectec work design, revers
     as it was". */
  assert.doesNotMatch(CSS, /selected-work__stage|45\.3cqi/);
});

test("about stands under Selected Work: the word, its red o, and his paragraph", async () => {
  const html = await (await render("/")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const work = main.indexOf('class="selected-work"');
  const at = main.indexOf('class="about-intro"');
  assert.ok(work > 0 && at > work, "about is not under Selected Work");
  assert.ok(at < main.indexOf('class="products"'), "about is not above Products");
  const section = main.slice(at, main.indexOf("</section>", at));

  /* The heading still reads "about": the "o" is in the square, hidden from
     sight, not from the reader. */
  const heading = section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? "";
  assert.equal(heading.replace(/<[^>]+>/g, ""), "about");
  assert.match(heading, /ab<span class="about-intro__mark" data-about-mark="true"><span class="visually-hidden">o<\/span><\/span>ut/);

  /* His paragraph, every word, as six lines that run together as one. */
  const copy = (section.match(/<p class="about-intro__copy"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "").replace(/<[^>]+>/g, "");
  assert.equal(
    copy,
    "We’re a small team of curious humans who create work we’re proud of for people and brands we believe in. With collaboration at the heart of every project, we identify what skills are required and then bring the best people together to create something truly extraordinary. Combining strategy, branding, web design and development, we build digital experiences that transform the way people connect and interact with brands.",
  );
  assert.equal((section.match(/class="about-intro__copy-line"/g) ?? []).length, 6);

  /* The square is the site's red, on the grid, and nothing hides the section
     before its script runs. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const mark = CSS.slice(CSS.indexOf(".about-intro__mark {"), CSS.indexOf("}", CSS.indexOf(".about-intro__mark {")));
  assert.match(mark, /background:\s*var\(--accent\)/);
  assert.match(mark, /width:\s*0\.567em;\s*height:\s*0\.567em/);
  assert.match(section.slice(0, 600), /data-enter-mode="none"/);
});

test("Our expertise stands under about, and each word opens its services", async () => {
  const html = await (await render("/")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const about = main.indexOf('class="about-intro"');
  const at = main.indexOf('class="expertise"');
  assert.ok(about > 0 && at > about, "Our expertise is not under about");
  assert.ok(at < main.indexOf('class="products"'), "Our expertise is not above Products");
  const section = main.slice(at, main.indexOf("</section>", at));

  /* His label and words, and Creative's four as his second comp lists them.
     Development's are the menu's Development half — the same four services. */
  assert.match(section, /<span class="expertise__label-line">Our<\/span><span class="expertise__label-line">expertise<\/span>/);
  /* Each word rolls under the pointer (RollingLabel), so it is written twice;
     the first face is the one read. */
  const words = [...section.matchAll(/data-expertise-word="true"><span class="roll"><span class="roll__face">([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(words, ["Creative", "Development"]);
  assert.equal((section.match(/class="expertise__row" data-expertise-row="true" data-roll="true"/g) ?? []).length, 2);
  const subs = (key) =>
    [...(section.match(new RegExp(`id="expertise-${key}"[\\s\\S]*?</ul>`))?.[0] ?? "").matchAll(/<li class="expertise__sub"><span class="expertise__sub-word">([^<]+)<\/span><\/li>/g)].map((m) => m[1]);
  assert.deepEqual(subs("creative"), ["Branding", "UX / UI", "Web design", "Social Media"]);
  assert.deepEqual(subs("development"), ["Websites", "Software", "CRM Solution", "AI &amp; Automation"]);

  /* Each word is a button that names the panel it opens, closed to start. */
  assert.equal((section.match(/<button class="expertise__toggle" type="button" aria-expanded="false" aria-controls="expertise-(creative|development)"/g) ?? []).length, 2);

  /* It opens under the pointer, or once pressed — and the cross is the
     site's red, drawn, never typed. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(CSS, /@media \(hover: hover\) \{\s*\.expertise__row:hover \.expertise__panel \{\s*grid-template-rows:\s*1fr;/);
  assert.match(CSS, /\.expertise__row:has\(\[aria-expanded="true"\]\) \.expertise__panel \{\s*grid-template-rows:\s*1fr;/);
  assert.match(CSS, /\.expertise__cross \{[^}]*color:\s*var\(--accent\)/);
  assert.match(section.slice(0, 700), /data-enter-mode="none"/);
});

test("every word-and-arrow button rolls its word and keeps its arrow still", async () => {
  /* Owner, 2026-10-05: "make this on hovver effect globall when we have button
     we have simple text + arro and that hover animation" — VIEW ALL's roll.
     Every control that is a word and an arrow carries `data-roll` and its word
     twice; cards and rows that only end in an arrow are not buttons and keep
     their own hover. */
  const rolling = (html, host) => {
    const at = html.indexOf(`class="${host}"`);
    assert.ok(at > 0, `${host} is not on the page`);
    const tag = html.slice(html.lastIndexOf("<", at), html.indexOf(">", at) + 1);
    assert.match(tag, /data-roll="true"/, `${host} does not roll`);
    const body = html.slice(html.indexOf(">", at) + 1, html.indexOf("pixel-arrow", at));
    assert.match(body, /<span class="roll"><span class="roll__face">[^<]+<\/span><span class="roll__face roll__face--next" aria-hidden="true">/, `${host}'s word is not doubled`);
  };
  const home = await (await render("/")).text();
  for (const host of ["product__cta"]) rolling(home, host);
  const service = await (await render("/services/ai-automation")).text();
  for (const host of ["service-hero__cta", "service-journey__next", "service-cta__link"]) rolling(service, host);

  /* And the arrow does not move: the pixel arrows' dot-by-dot rebuild is off
     on a rolling control, which keeps only the colour change. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(CSS, /\[data-roll\]:hover \.pixel-arrow--animated > span,\s*\[data-roll\]:focus-visible \.pixel-arrow--animated > span \{\s*animation:\s*none;/);

  /* The service pages rewrite their next-chapter word as the reader moves on;
     it goes to both faces, or the roll would be wiped by the first update. */
  const scroll = readFileSync(new URL("../components/services/ServiceOfferingsScroll.tsx", import.meta.url), "utf8");
  assert.match(scroll, /querySelectorAll<HTMLElement>\("\.roll__face"\)/);
  assert.doesNotMatch(scroll, /nextLabel\.textContent =\s*(groupLinks|"Let)/);
});

test("the hairlines run from Fusion to the foot of the homepage, and nowhere else", async () => {
  /* Owner, 2026-10-05: "i want thos vertical line to stretc to the end of
     website all the way down". Every homepage section from Fusion on, and the
     footer, draws them; the opening above Fusion does not, and the footer on
     any other page stays plain. */
  const html = await (await render("/")).text();
  const page = html.slice(html.indexOf("<main"), html.indexOf("</footer>") + 9);
  for (const name of [
    "fusion-section",
    "selected-work",
    "about-intro",
    "expertise",
    "products",
  ]) {
    assert.match(page, new RegExp(`<section class="${name}"[^>]*data-ruled`), `${name} is not ruled`);
  }
  assert.doesNotMatch(page, /<section class="house-hero"[^>]*data-ruled/);
  assert.match(page, /<footer class="site-footer"[^>]*data-ruled/);

  /* **The entrance moves the content, not the section.** SectionEnter slides
     the block it is given; given a whole section it slid the hairlines with it
     and opened 133px of white between two sections (measured). Every ruled
     section on the page now has its own entrance or nominates an inner block
     — none hands SectionEnter the whole section. */
  for (const name of ["fusion-section", "selected-work", "about-intro", "expertise", "products"]) {
    const at = page.indexOf(`<section class="${name}"`);
    const tag = page.slice(at, page.indexOf(">", at) + 1);
    const body = page.slice(at, page.indexOf("</section>", at));
    assert.ok(/data-enter-mode="none"/.test(tag) || /data-enter="true"/.test(body), `${name} slides its hairlines on entering`);
  }

  const about = await (await render("/about")).text();
  assert.doesNotMatch(about, /<footer class="site-footer"[^>]*data-ruled/);
});

test("Fusion has its four ruled columns, every block on a rule", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const bare = CSS.replace(/\/\*[\s\S]*?\*\//g, "");

  /* **Fusion is on ruled columns of its own** — the owner's comp of
     2026-10-05. Until then it sat on the Why section's three columns so both
     started on one edge; the comp puts "Human Creativity" by the second rule
     instead, so that alignment, and the 700px measure the block was held to,
     went. Five columns in the comp, four on his word the same day: "we need
     only 4 spaces not five". */
  assert.match(bare, /--column-gap:\s*clamp\(0\.65rem, 0\.9vw, 0\.85rem\)/);
  assert.doesNotMatch(bare, /--statement-measure/);

  const fusion = bare.indexOf(".container.fusion-container {");
  assert.ok(fusion > 0, "the fusion column has no rule");
  const container = bare.slice(fusion, bare.indexOf("\n}", fusion));
  assert.match(container, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);

  /* The rules are the four columns' five edges, across the page column — the
     container's own inset — and under the type (owner: "not inside the
     line"). Since 2026-10-05 they run from this section to the foot of the
     page ("all the way down"): every section that carries `data-ruled` draws
     its own length, under its content. */
  const rules = bare.indexOf("[data-ruled]::before {");
  assert.ok(rules > 0, "the section draws no rules");
  const ruled = bare.slice(rules, bare.indexOf("\n}", rules));
  assert.match(ruled, /inset-inline:\s*var\(--page-gutter\)/);
  assert.match(ruled, /var\(--line-grid-vertical\) 0\.7px,\s*transparent 0\.7px\s*\)/);
  assert.match(ruled, /calc\(\(100% - 0\.7px\) \/ 4\) 100% repeat-x/);
  assert.match(bare, /--line-grid:\s*#8c8c8c;/);
  assert.match(ruled, /z-index:\s*-1/);
  /* Drawn in white since 2026-10-05 — there, and not seen ("revrse back the
     vertical lines but in white i dont want to be seeen"). */
  assert.doesNotMatch(ruled, /display:\s*none/);
  assert.match(bare, /--line-grid-vertical:\s*#ffffff;/);
  assert.match(bare, /\[data-ruled\] \{\s*position:\s*relative;\s*isolation:\s*isolate;/);

  assert.match(container, /position:\s*relative/);

  /* **Every block starts ON a rule** — owner, 2026-10-05: "the text needs to
     be at start of the vertical lines alwasy use as a grid". The first half
     and the sentence from rule 2, the second half from rule 3, the plus from
     rule 2 — and none of them nudged off it by a side margin. */
  const block = (selector) => {
    const at = bare.indexOf(selector);
    assert.ok(at > 0, `${selector} has no rule`);
    return bare.slice(at, bare.indexOf("}", at));
  };
  const placed = {
    '.fusion-title__half[data-fusion-half="left"] {': "2 / -1",
    '.fusion-title__half[data-fusion-half="right"] {': "3 / -1",
    ".fusion-plus {": "2",
    ".fusion-copy {": "2 / -1",
  };
  for (const [selector, column] of Object.entries(placed)) {
    const rule = block(selector);
    assert.match(rule, new RegExp(`grid-column:\\s*${column.replace("/", "\\/")};`), selector);
    /* The side offsets the first build took off the screenshot — a few
       hundredths of the heading either side of the rule — are what this
       request removed. */
    assert.doesNotMatch(rule, /margin-left|margin-inline|-0\.285em|-0\.157em|0\.146em|-0\.151\)/, `${selector} is nudged off its rule`);
  }
});

