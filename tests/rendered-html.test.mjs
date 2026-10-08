import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

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
    2,
  );
  assert.doesNotMatch(html, /button--flat|shape-flat/);
  /* Each product's lines under its picture, as Selected Work sets a piece's —
     where it stands and its year; no term labels, since the
     owner's "use our new concept" (2026-10-05). The years are the owner's. */
  assert.doesNotMatch(html, /product-fact/);
  assert.equal((html.match(/<p class="product__line">/g) ?? []).length, 2);
  for (const year of ["2025", "2026"]) {
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
  /* No field under the name (owner, 2026-10-07: "delete under name the
     section like Mental Health and Evends"). */
  assert.doesNotMatch(html, /<p class="product__line">(Mental health|Events)<\/p>/);
  /* **Ihrauto is gone** — owner, 2026-10-07: "remove this product from
     homepage and eeryhwere IHR AUTO". Two products now. */
  assert.doesNotMatch(html, /Ihrauto|ihrauto|Automotive/i);
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
  assert.equal((html.match(/class="product__name"/g) ?? []).length, 2);
  assert.equal((html.match(/class="product__image"/g) ?? []).length, 2);
  // Two different photographs, each with alt text, each sized so the page
  // does not shift as they load.
  const productImages = [
    ...html.matchAll(/<img class="product__image"[^>]*src="([^"]+)"[^>]*>/g),
  ];
  assert.equal(productImages.length, 2);
  assert.equal(new Set(productImages.map((image) => image[1])).size, 2);
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
  /* Except on a phone or a touch screen, where it steps aside going down and
     comes back on a band going up — the responsive plan the owner approved
     on 2026-10-06 ("ok continue"). That and only that is inside the mobile
     menu's query; everywhere else the 2026-10-03 rule stands. */
  const phoneBar = CSS.match(/\/\* \*\*A phone, or any touch screen: the bar steps aside\*\*[\s\S]*?\n@media \(max-width: 64rem\), \(hover: none\) \{[\s\S]*?\n\}\n/)?.[0] ?? "";
  assert.match(phoneBar, /\.site-header\[data-header="hidden"\]/, "the phone's bar does not step aside");
  assert.doesNotMatch(CSS.replace(phoneBar, ""), /\.site-header::before|\.site-header\[data-header="hidden"\]/);
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
  /* Shared since 2026-10-08 with FILTERS on the Clients page, which draws
     the same plus — so the selector may be a list. */
  assert.match(CSS, /\.mobile-menu-toggle__plus::before(?:,\s*[.\w:-]+)*\s*\{[^}]*linear-gradient\(\s*to right,\s*currentcolor var\(--plus-arm\),\s*transparent 0 calc\(100% - var\(--plus-arm\)\)/);
  assert.match(CSS, /\.mobile-menu-toggle__plus::after(?:,\s*[.\w:-]+)*\s*\{[^}]*linear-gradient\(\s*to bottom,\s*currentcolor var\(--plus-arm\),\s*transparent 0 calc\(100% - var\(--plus-arm\)\)/);
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
     that holds everything under it; no sub-links, and no Company or Hire us.
     Home came out and Contact went in — owner, 2026-10-08: "remove HOME link
     from header add contact". */
  const row = bar.match(/<ul class="bar-menu" id="bar-menu" aria-label="Pages">[\s\S]*?<\/ul>/)?.[0];
  assert.ok(row, "the bar has no row of pages");
  assert.deepEqual(
    [...row.matchAll(/<a [^>]*href="([^"]+)"[^>]*class="bar-menu__link"|<a [^>]*class="bar-menu__link"[^>]*href="([^"]+)"/g)].map((m) => m[1] ?? m[2]),
    ["/services", "/products", "/case-studies", "/about", "/contact"],
  );
  assert.deepEqual(
    [...row.matchAll(/<span class="roll__face">([^<]*)</g)].map((m) => m[1]),
    ["Services", "Products", "Clients", "About", "Contact"],
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
     "somthing different"). Products and About are parents — buttons that
     open their pages and go nowhere (owner's call, 2026-08-24: disclosures,
     not destinations) — and Clients is a page; so is Services since
     2026-10-06, its wheel of every service ("we need our new pages"). The
     parents arrive closed. */
  const pages = html.match(/<ul class="mobile-menu__pages">[\s\S]*<\/ul><div class="mobile-menu__foot"/)?.[0];
  assert.ok(pages, "the menu has no entries");
  assert.deepEqual(
    [...pages.matchAll(/data-menu-word="true"><span class="roll"><span class="roll__face">([^<]*)</g)].map((m) => m[1]),
    ["Services", "Products", "Clients", "About", "Contact"],
  );
  /* About was the company's four pages under the first one's name (owner,
     2026-10-05: "maybe Blog carreers and contact to be under About"); since
     2026-10-08 it is one page and Contact a word of its own ("i want to
     remain only one page about", "add contact"). Products is the one parent
     left. */
  assert.doesNotMatch(pages, /mobile-menu-panel-about/);
  for (const key of ["products"]) {
    assert.match(
      pages,
      new RegExp(`<button class="mobile-menu__page" type="button" aria-expanded="false" aria-controls="mobile-menu-panel-${key}"`),
      `${key} is not a closed parent`,
    );
    assert.match(pages, new RegExp(`<div class="mobile-menu__panel" id="mobile-menu-panel-${key}">`));
  }
  assert.deepEqual(
    [...pages.matchAll(/<a href="([^"]+)" class="mobile-menu__page"/g)].map((m) => m[1]),
    ["/services", "/case-studies", "/about", "/contact"],
  );
  /* No second screen to step into, and nothing to go back from. */
  assert.doesNotMatch(html, /mobile-menu__(index|detail|back|count|rows|num)/);

  /* **The pages behind each parent**, each list named by the word itself. */
  const lists = Object.fromEntries(
    [...pages.matchAll(/<ul class="mobile-menu__links" (?:aria-labelledby="mobile-menu-group-(\w+)"|aria-label="(\w+)")>([\s\S]*?)<\/ul>/g)].map(
      (m) => [m[1] ?? m[2], [...m[3].matchAll(/class="mobile-menu__link-text">([^<]*)</g)].map((n) => n[1])],
    ),
  );
  assert.deepEqual(lists, {
    Products: ["Arvena AI", "Ftesa.co"],
  });
  /* Each page a ruled row: its name, and VIEW ALL's thin arrow (owner,
     2026-10-05: "i don like how sub links shows pls redesign that part"). */
  assert.equal((pages.match(/<li class="mobile-menu__item">/g) ?? []).length, 2);
  assert.equal((pages.match(/class="mobile-menu__link-arrow"/g) ?? []).length, 2);

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

test("the footer points at the service pages that exist", async () => {
  const html = await (await render()).text();
  assert.match(html, /href="\/services\/ai-automation"/);
  assert.match(html, /href="\/services\/crm-solution"/);
  assert.match(html, /href="\/services\/websites"/);
  assert.match(html, /href="\/services\/branding"/);
  assert.match(html, /href="\/services\/ux-ui-design"/);
  assert.match(html, /href="\/services\/print-design"/);

  /* Not a list of strings — every href the footer's Services column carries
     is fetched. The old version of this test asserted three literals and would
     have gone on passing with the route renamed underneath it, which is exactly
     what happened to `/services/web-platforms-apps`. (It read the menu's panel
     until Services became a page of its own, 2026-10-06; the footer lists the
     same seven.) */
  const hrefs = [
    ...new Set([...html.matchAll(/class="site-footer__link" href="(\/services\/[^"]+)"/g)].map((m) => m[1])),
  ];
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

/* The Clients page. Still served at /case-studies: the route was left alone
   when the word was changed. Since 2026-10-08 it opens as the services and
   the products do — owner: "change the hero of Client to be same design as
   in product and service that style of course add a appropriate text". */
test("server-renders the Clients hero", async () => {
  const response = await render("/case-studies");
  assert.equal(response.status, 200);

  const html = await response.text();
  /* The tab has to say what was clicked to get here. */
  assert.match(html, /<title>Clients — Mardal<\/title>/i);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);

  /* The services' opening, in the clients' words: the label beside its plus,
     the heading in its three authored lines with the red full stop, the note,
     four marks. The old opening ("Customer / stories", its sentence and its
     way in) is gone with it. */
  const opening = html.slice(html.indexOf('class="services-hero services-hero--clients"'), html.indexOf("</section>"));
  assert.ok(opening.length > 0, "the Clients page does not open on the services' hero");
  assert.match(opening, /aria-labelledby="clients-hero-title" data-services-hero="true"/);
  assert.match(opening, /<p class="services-hero__label" data-services-hero-first="true"><span class="services-hero__mark" aria-hidden="true"><\/span>Clients<\/p>/);
  assert.deepEqual(
    [...opening.replace(/<!-- -->/g, "").matchAll(/<span class="services-hero__title-line">(.*?)<\/span>(?=<span class="services-hero__title-line">|<\/h1>)/g)].map((m) => m[1].replace(/<[^>]+>/g, "")),
    ["Every project here started", "with a real problem. Every one of them", "ended with a measurable result."],
  );
  assert.match(opening, /<h1 class="services-hero__title" id="clients-hero-title" data-services-hero-title="true">/);
  assert.match(opening, /<span class="services-hero__stop">\.<\/span>/);
  assert.match(opening, /We don’t show work to impress\. We show it to prove a point — that strategy, design, and execution working together produce real outcomes most agencies only pitch about, but rarely deliver\./);
  assert.equal((opening.match(/class="services-hero__mark/g) ?? []).length, 4);
  assert.doesNotMatch(html, /class="service-hero[ "]|service-hero__title-line|Customer|data-service-hero-cta/);

  /* On the same hairlines: the page's five, from its top, and the footer's. */
  const main = html.slice(html.indexOf('<main class="service-page service-page--clients service-page--case-studies"'), html.indexOf('class="services-hero'));
  assert.equal((main.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 5);
  assert.equal((html.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 10);

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
test("the Clients index is one page under FILTERS, not seven filtered views", async () => {
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

  /* **FILTERS, under the opening — owner, 2026-10-08**: "under the hero add
     this then when click to open …", then "i want when open menu to open on
     the left horisontally as menu, then to be selectd only All and active with
     red underline". It replaced the rail down the left (owner: remove it), so
     the rail, its "Selected work" heading and the pin that held it are
     asserted gone. */
  const filters = all.match(/<div class="clients-filters" data-open="false">[\s\S]*?<\/ul>/)?.[0];
  assert.ok(filters, "FILTERS is not rendered, or arrives open");
  assert.ok(
    all.indexOf('class="clients-filters"') < all.indexOf('<ul class="clients-grid">'),
    "FILTERS does not stand above the work",
  );
  assert.match(filters, /<button class="clients-filters__toggle" type="button" data-roll="true" aria-expanded="false" aria-controls="clients-filters-list">/);
  assert.match(filters, /<span class="clients-filters__plus" aria-hidden="true"><\/span><span class="roll"><span class="roll__face">FILTERS<\/span>/);

  /* All, then his seven in his order — a list, because a set would pass
     shuffled — each a word that rolls, out of the tab order while shut; All
     the only one chosen when the page arrives. */
  const options = [...filters.matchAll(/<button class="clients-filters__option"[^>]*>[\s\S]*?<\/button>/g)].map((m) => m[0]);
  assert.deepEqual(
    options.map((option) => option.match(/class="roll__face">([^<]*)</)?.[1]),
    ["All", "UX/UI Design", "Branding", "Websites", "Applications", "Software", "CRM", "AI &amp; Automation"],
  );
  assert.deepEqual(
    options.map((option) => option.match(/aria-pressed="(\w+)"/)?.[1]),
    ["true", "false", "false", "false", "false", "false", "false", "false"],
  );
  for (const option of options) {
    assert.match(option, /data-roll="true"/);
    assert.match(option, /tabindex="-1"/i);
  }
  assert.doesNotMatch(all, /clients-rail|class="clients-filter"|clients-filter__|clients-layout|clients-filters__tick/);
  assert.ok(
    !existsSync(new URL("../components/case-studies/ClientsPin.tsx", import.meta.url)),
    "the rail's pin is back",
  );

  /* Opened beside FILTERS, as the bar's row is from Menu: wiped out from it,
     and the chosen word underlined in the red. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(CSS, /\.clients-filters__list \{[^}]*clip-path: inset\(-0\.6em 100% -0\.6em 0\)/);
  assert.match(CSS, /\.clients-filters__option\[aria-pressed="true"\]::after \{\s*transform: none;/);
  assert.match(CSS, /\.clients-filters__option::after \{[^}]*background: var\(--accent\)/);
  /* The plus red all the time; the word red while open. */
  assert.match(CSS, /\.clients-filters__plus,\s*\.clients-filters\[data-open="true"\] \.clients-filters__toggle \{\s*color: var\(--accent\);/);

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
  /* One `src` each (the srcset names the same frame again, at two sizes). */
  assert.equal((cardMarkup.match(/ src="https:\/\/picsum\.photos\//g) ?? []).length, 8);
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

  /* **The name and nothing under it** — owner, 2026-10-08: "only name of the
     company and servces", then "remove the service complete under the
     project". (Industry, services and country stood there from 2026-09-30.) */
  assert.equal(
    [...cardMarkup.matchAll(/class="clients-card__name">[^<]*(?:<!-- -->)?(?:<svg class="clients-card__arrow"[\s\S]*?<\/svg>)?<\/h3><\/article>/g)].length,
    8,
  );
  assert.doesNotMatch(cardMarkup, /clients-card__fact/);
  assert.doesNotMatch(cardMarkup, />(Switzerland|Germany|Austria|Kosovo|Finance|Healthcare|Manufacturing|Automotive|Retail|Logistics|Public Sector|UX\/UI Design|Branding|Software|CRM)</);

  /* **Three shapes, two to a row at most, sometimes one** — owner,
     2026-10-08: "i want the project to have three format Box, wide and
     portrat and to be mixed", each starting on one of the page's lines, then
     "max 2 project in one row sometimes 1". Eight cards are rows of two, one,
     two, one, two; each card's shape, columns (of the page's four) and — a
     row's first — starting line set by its place. */
  assert.deepEqual(
    [...cardMarkup.matchAll(/<li data-format="(\w+)" data-span="(\d+)"(?: data-start="(\d)")? data-row="(\d)" data-place="(\d)">/g)].map(
      (m) => `${m[1]} ${m[2]}${m[3] ? "@" + m[3] : ""} ${m[4]}.${m[5]}`,
    ),
    [
      "portrait 2@1 2.1", "wide 2 2.2",
      "wide 3@2 1.1",
      "box 2@1 2.1", "portrait 2 2.2",
      "box 2@1 1.1",
      "portrait 2@1 2.1", "wide 2 2.2",
    ],
  );

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

  /* **The hover — owner, 2026-10-08** ("i dont like it how it is right
     now"): no wash and no cross laid over the picture; its frame draws in,
     the photograph leans in, the name turns red and an arrow comes in beside
     it — the arrow only on the card that opens. */
  const CSSH = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(CSSH, /\[data-opens\]:hover \[data-opens-mark\] \{\s*clip-path: inset\(/);
  assert.match(CSSH, /\[data-opens\]:hover \[data-opens-mark\] img \{\s*transform: scale\(1\.06\);/);
  assert.doesNotMatch(CSSH, /\[data-opens-mark\]::(before|after)|rgb\(8 8 10 \/ 90%\)/);
  assert.equal((cardMarkup.match(/class="clients-card__arrow"/g) ?? []).length, links.length);

  /* And it is on the card that has the link, not on some other one. */
  assert.match(
    cardMarkup,
    /<article[^>]*data-opens="true"[^>]*>[\s\S]*?class="clients-card__link"/,
  );
});

/* The pilot story — the page a card opens, and the only one there is. What is
   being judged is the shape; the words in it are slots.

   **A new approach — owner, 2026-10-08**, from three references: "hero with
   big images", the project in a paragraph with its record under it, "then
   changellens etc", then the delivered pages one after the next. */
test("server-renders the one customer story", async () => {
  /* The sector segment came out of this address with the taxonomy on
     2026-08-25; next.config.ts redirects the old one. */
  const path = "/case-studies/healthcare-office-website";
  const response = await render(path);
  assert.equal(response.status, 200);

  const html = await response.text();
  const page = html.slice(0, html.indexOf("<footer"));

  /* The tab is the whole title on one line; the heading is the card's name. */
  assert.match(html, /<title>A website for a healthcare office — Mardal<\/title>/i);
  assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1);

  /* **The opening: one picture across the screen**, the bar white over it,
     the page's lines drawn over it, and from the middle line the industry
     beside the red square and the name of the card it was opened from. */
  const hero = page.match(/<section class="project-hero"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "the story does not open on the picture");
  assert.match(hero, /data-bar-dark="true" data-project-hero="true"/);
  assert.match(hero, /class="project-hero__image"[^>]*src="https:\/\/picsum\.photos\/seed\/mardal-healthcare-hero\//);
  assert.equal((hero.match(/class="services-rules__line"/g) ?? []).length, 5);
  assert.match(hero, /<span class="project-hero__mark" aria-hidden="true"><\/span>Healthcare<\/p>/);
  assert.match(hero, /<h1 class="project-hero__title" id="project-title" data-project-hero-title="true">Solvei<\/h1>/);

  /* **The project**: its name where a logo would stand (there is none on
     file), the paragraph, the record two by two, the way to the live site —
     with no address on file, not a link. */
  const intro = page.match(/<section class="project-intro"[\s\S]*?<\/section>/)?.[0];
  assert.ok(intro, "the project is not introduced");
  assert.match(intro, /<h2 class="project-intro__name" id="project-intro-title">Solvei<\/h2>/);
  assert.match(intro, /class="project-intro__summary">\[Two or three sentences/);
  assert.deepEqual(
    [...intro.matchAll(/class="project-intro__label">([^<]*)</g)].map((m) => m[1]),
    ["INDUSTRY:", "SERVICES:", "CHALLENGE:", "SOLUTION:"],
  );
  assert.match(intro, /class="project-intro__value">Healthcare</);
  assert.match(intro, /class="project-intro__value">UX\/UI Design, Websites</);
  assert.match(intro, /<p class="project-live" aria-disabled="true"><span>LIVE WEBSITE<\/span>/);
  /* The site's word-and-arrow button (VIEW ALL's), not a box; labels black. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const live = CSS.slice(CSS.indexOf("\n.project-live {"), CSS.indexOf("\n}", CSS.indexOf("\n.project-live {")));
  assert.doesNotMatch(live, /background|border/);
  assert.match(live, /gap: 0\.7em;/);
  assert.match(CSS, /\.project-intro__label \{[^}]*color: var\(--ink\);/);
  assert.doesNotMatch(intro, /<a [^>]*class="project-live"/);

  /* **The account**: the three the Clients page has promised, each heading
     over its slots. */
  assert.deepEqual(
    [...page.matchAll(/class="project-passage__title">([^<]*)</g)].map((m) => m[1]),
    ["What it replaced", "What it does now", "What the client owns"],
  );
  assert.match(page, /class="project-passage__copy"><p>\[What the office was working/);
  /* Still, one under the next, no effect on the scroll at all — owner,
     2026-10-08, after a reveal and a held version: "remove all on scroll
     leave it as it was in normal state". */
  assert.match(page, /<section class="project-account"[^>]*>[\s\S]*?data-enter-mode="none"/);
  assert.doesNotMatch(page, /project-account__stack|data-held|project-passage__rise/);
  assert.ok(
    !existsSync(new URL("../components/case-studies/ProjectAccountMotion.tsx", import.meta.url)),
    "the account is moved by the scroll again",
  );

  /* **The pages**, on the white page ("here bacground in white"): six, the
     same six in small with a frame over the part in view, Previous (shut at
     the first) and Next. No dark ground, so the bar stays as it is. */
  const showcase = page.match(/<section class="project-showcase"[\s\S]*?<\/section>/)?.[0];
  assert.ok(showcase, "the pages are not shown");
  assert.doesNotMatch(showcase, /data-bar-dark/);
  assert.equal((showcase.match(/<li class="project-showcase__page">/g) ?? []).length, 6);
  assert.equal((showcase.match(/class="project-showcase__thumb"/g) ?? []).length, 6);
  assert.match(showcase, /class="project-showcase__window"/);
  assert.match(showcase, /<button class="project-showcase__step" type="button" disabled=""><span>Previous<\/span>/);
  assert.match(showcase, /<button class="project-showcase__step" type="button"><span>Next<\/span>/);
  assert.match(showcase, /aria-label="Page 1" aria-current="true"/);

  /* In that order, then the way back to every story. */
  const order = ["project-hero", "project-intro", "project-account", "project-showcase"]
    .map((name) => page.indexOf(`<section class="${name}"`))
    .concat(page.indexOf('<nav class="project-out"'));
  assert.deepEqual([...order].sort((x, y) => x - y), order, `the sections are out of order: ${order}`);
  /* The foot: Back on the left to every story, Next Project on the right —
     owner, 2026-10-08. No second story yet, so Next Project is no link. */
  const back = page.match(/<a [^>]*class="project-out__link project-out__link--back"[^>]*>[\s\S]*?<\/a>/)?.[0];
  assert.ok(back, "there is no way back");
  assert.match(back, /href="\/case-studies"/);
  /* Arrows only on the page ("remove text only leave it arrows"), the words
     kept for a screen reader. */
  assert.match(back, /<svg class="project-out__arrow"[\s\S]*?<span class="visually-hidden">Back<\/span>/);
  assert.match(page, /<p class="project-out__link project-out__link--next" aria-disabled="true"><span class="visually-hidden">Next Project<\/span><svg class="project-out__arrow"/);
  assert.doesNotMatch(page.slice(page.indexOf('<nav class="project-out"')), /class="roll__face"/);
  assert.doesNotMatch(page, /All customer stories/);

  /* **Every picture is stock and must not ship**: the opening and six pages,
     one `src` each. Delete this with the commit that puts real shots in. */
  assert.equal((page.match(/ src="https:\/\/picsum\.photos\/seed\/mardal-healthcare-/g) ?? []).length, 1 + 6 + 6);

  /* The old page is gone: its record rail, its steps, its plate. */
  assert.doesNotMatch(page, /class="story-|service-hero/);

  /* Exactly one story exists, and any other slug is a wrong address rather than
     an unwritten page. */
  assert.equal((await render("/case-studies/not-a-story")).status, 404);

  /* **The two-segment addresses are now redirects, not 404s** — they were
     `/case-studies/{sector}/{story}`; an old address is a moved page, then
     the router judges what is left. */
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
  /* (The section's own trigger drew its rules until 2026-10-06; they simply
     stand now.) */
  for (const block of ["once(left)", "once(right)", 'once(copy, "top 92%")']) {
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

  /* **The rules simply stand** — owner, 2026-10-06: "i want the lines to be
     there all the time no reveal". Nothing draws them: no clip on them, and
     this section no longer animates its own. */
  assert.doesNotMatch(code, /--fusion-rules/);
  assert.doesNotMatch(rule("[data-ruled]::before {"), /clip-path/);
  assert.doesNotMatch(bare, /--rule-draw/);

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
  const words = [...section.matchAll(/data-expertise-word="true"><span class="roll"><span class="roll__face">([\s\S]*?)<\/span><span class="roll__face roll__face--next"/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  /* A third row since 2026-10-06 — owner: "add another one under development
     at Artificial Intelegence", then "change ai to this: AI + Automation",
     with a typed plus ("make it a normal +"). */
  assert.deepEqual(words, ["Creative", "Development", "AI + Automation"]);
  assert.doesNotMatch(section, /expertise__plus/);
  assert.equal((section.match(/class="expertise__row" data-expertise-row="true" data-roll="true"/g) ?? []).length, 3);
  const subs = (key) =>
    [...(section.match(new RegExp(`id="expertise-${key}"[\\s\\S]*?</ul>`))?.[0] ?? "").matchAll(/<li class="expertise__sub"><span class="expertise__sub-word">([^<]+)<\/span><\/li>/g)].map((m) => m[1]);
  /* His five a row (owner, 2026-10-06). */
  assert.deepEqual(subs("creative"), ["Branding", "UX/UI Design", "Web Design", "Product Design", "Social Media Design"]);
  assert.deepEqual(subs("development"), ["Websites", "Web Platforms", "Mobile Apps", "Custom Software", "CRM Solutions"]);
  assert.deepEqual(subs("ai"), ["AI Assistants", "AI Integrations", "Workflow Automation", "Sales &amp; CRM Automation", "Customer Service Automation"]);

  /* VIEW ALL at its bottom right, to every service (owner, 2026-10-06). */
  const all = section.match(/<a[^>]*class="expertise__all"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.match(all, /href="\/services"/);
  assert.match(all, /data-roll="true"/);
  assert.match(all, /<span class="roll__face">VIEW ALL<\/span>/);

  /* Each word is a button that names the panel it opens, closed to start. */
  assert.equal((section.match(/<button class="expertise__toggle" type="button" aria-expanded="false" aria-controls="expertise-(creative|development|ai)"/g) ?? []).length, 3);

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
     website all the way down" — and, after a moment without them in the
     footer, 2026-10-06: "i want to leav till the end of the page". Every
     homepage section from Fusion on, and the footer, draws them; the opening
     above Fusion does not, and the footer on any other page stays plain. */
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
  /* The shared rule itself, at the start of its line — not a section's own
     adjustment of it (the services page's opening runs its rules to the top). */
  const rules = bare.indexOf("\n[data-ruled]::before {");
  assert.ok(rules > 0, "the section draws no rules");
  const ruled = bare.slice(rules, bare.indexOf("\n}", rules));
  assert.match(ruled, /inset-inline:\s*var\(--page-gutter\)/);
  assert.match(ruled, /var\(--line-grid-vertical\) 0\.7px,\s*transparent 0\.7px\s*\)/);
  assert.match(ruled, /calc\(\(100% - 0\.7px\) \/ 4\) 100% repeat-x/);
  assert.match(bare, /--line-grid:\s*#8c8c8c;/);
  assert.match(ruled, /z-index:\s*-1/);
  /* White for a day (2026-10-05), then the page's grey again — owner,
     2026-10-06: "in darkk greay as it was before". */
  assert.doesNotMatch(ruled, /display:\s*none/);
  assert.match(bare, /--line-grid-vertical:\s*var\(--line-grid\);/);
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


test("the services' page turns its services on a wheel, each one's content beside it", async () => {
  /* Owner, 2026-10-06, from a reference of names on a curve: "when we enter in
     services the services to be on the left and as i scroll into services on
     the right side to apear all the content for that service … and instead of
     that arrow to be our +". */
  const html = await (await render("/services")).text();
  /* **Its opening is the owner's comp** (2026-10-06: "this is what we
     need"): "Service" beside a plus, the heading in his four lines as the
     page's one h1, and the note beside the last plus — his words, word for
     word — on the page's hairlines, and the wheel straight under it. Not the
     placeholder's "Working on it." any more. */
  const opening = html.slice(html.indexOf('class="services-hero"'), html.indexOf('class="services-wheel"'));
  assert.ok(html.indexOf('class="services-hero"') > 0 && opening.length > 0, "the services page does not open on its hero");
  /* Its five hairlines, in the page itself before the opening, from its top
     to the wheel's foot in one piece (owner, 2026-10-06, on a phone: "i can
     see a spacebetween the vertical line")… */
  const main = html.slice(html.indexOf('<main class="service-page service-page--services"'), html.indexOf('class="services-hero"'));
  assert.match(main, /<div class="services-rules" aria-hidden="true">/);
  assert.equal((main.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 5);
  assert.equal((opening.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 0);
  /* …and the footer the same five on to the foot of the page (a trial,
     2026-10-06): no other set. */
  assert.equal((html.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 10);
  assert.match(html, /<footer class="site-footer" id="contact" data-own-rules="true"/);
  assert.match(html, /class="services-rules services-rules--grey" aria-hidden="true">/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(opening, /<p class="services-hero__label" data-services-hero-first="true"><span class="services-hero__mark" aria-hidden="true"><\/span>Service<\/p>/);
  assert.deepEqual(
    [...opening.matchAll(/<span class="services-hero__title-line">(.*?)<\/span>(?=<span class="services-hero__title-line">|<\/span><\/h1>|<\/h1>)/g)].map((m) => m[1].replace(/<[^>]+>/g, "")),
    ["Mardal is a results-driven", "agency built for ambitious brands", "that refuse to settle", "for average."],
  );
  /* GSAP's SplitText splits it on arrival (ServicesHeroReveal), so the markup
     is the plain lines; the full stop is the red (owner, 2026-10-06). */
  assert.match(opening, /data-services-hero-title="true"/);
  /* The words are written one by one (a hyphenated one kept whole), so React
     may set its empty comments between them. */
  assert.match(opening.replace(/<!-- -->/g, ""), /<span class="services-hero__title-line">for average<span class="services-hero__stop">\.<\/span><\/span>/);
  assert.match(opening, /<span class="services-hero__whole">results-driven<\/span>/);
  assert.match(opening, /<h1 class="services-hero__title" id="services-hero-title" data-services-hero-title="true">/);
  assert.match(opening, /We don’t measure success in deliverables\. We measure it in revenue grown, leads doubled, and brands that became impossible to ignore\./);
  assert.equal((opening.match(/class="services-hero__mark/g) ?? []).length, 4);
  assert.doesNotMatch(html, /Working|service-hero__title|expertise__label/);
  const wheel = html.match(/<section class="services-wheel"[\s\S]*?<\/section>/)?.[0];
  assert.ok(wheel, "the services' page has no wheel");
  /* **His list, word for word** (owner, 2026-10-06, renewed the same day):
     nineteen services in three groups, each group's name in the line above
     its first. */
  assert.deepEqual(
    [...wheel.matchAll(/<li class="services-wheel__group" aria-hidden="true" data-wheel-line="true">([^<]+)</g)].map((m) => m[1]),
    ["Creative", "Development", "AI + Automation"],
  );
  assert.deepEqual(
    [...wheel.matchAll(/<button class="services-wheel__name" type="button">([^<]+)</g)].map((m) => m[1]),
    [
      "Branding", "Visual Identity", "UX/UI Design", "Web Design", "Product Design", "Print Design", "Social Media Design",
      "Websites", "Web Platforms", "Mobile Apps", "Custom Software", "CRM Solutions", "E-commerce", "API &amp; Integrations",
      "AI Assistants", "AI Integrations", "Workflow Automation", "Sales &amp; CRM Automation", "Customer Service Automation",
    ],
  );
  /* **Nothing is chosen before the section is reached** (owner, 2026-10-06:
     "whn enter the section first to be selc the service then to aper the
     right text not before"): no service, panel or group is lit as served. */
  assert.doesNotMatch(wheel, /data-active|is-active|is-current/);
  assert.match(wheel, /<span class="services-wheel__mark" aria-hidden="true"><\/span>/);
  /* **Every service says what he wrote** (owner, 2026-10-06): his
     paragraph and what it includes, and no heading over them — his title
     lines and the group's name came off ("delete title for each and for
     example Creative only paragraf and other text"), and the word "Includes"
     ("delete text Include in all"). The name stays as the
     panel's heading for a phone and a screen reader; the stylesheet hides it
     beside the wheel. */
  const creative = [
    ["Branding", "We help define what your brand stands for", "Brand strategy"],
    ["Visual Identity", "We turn your brand strategy into a distinct visual language", "Templates &amp; applications"],
    ["UX/UI Design", "We combine user experience thinking with strong interface design", "Usability improvements"],
    ["Web Design", "We design websites around your brand, your audience", "Developer-ready designs"],
    ["Product Design", "We help shape digital products from early concepts", "Product discovery"],
    ["Print Design", "We design print materials that extend your visual identity", "Corporate materials"],
    ["Social Media Design", "We design visual systems and campaign assets", "Social media guidelines"],
    ["Websites", "We design and develop modern, responsive websites", "SEO-ready structure"],
    ["Web Platforms", "We build custom web platforms for businesses", "User accounts &amp; permissions"],
    ["Mobile Apps", "We create mobile applications that give users", "App maintenance &amp; updates"],
    ["Custom Software", "We develop software around the way your business actually operates", "Maintenance &amp; ongoing development"],
    ["CRM Solutions", "We help businesses bring customer information", "Training &amp; support"],
    ["E-commerce", "We build e-commerce experiences that connect", "Analytics &amp; reporting"],
    ["API &amp; Integrations", "We connect your applications, platforms, and business systems", "Integration maintenance"],
    ["AI Assistants", "We build AI assistants that help customers and teams find information", "CRM and business system connections"],
    ["AI Integrations", "We integrate AI into the tools and systems your business already uses", "Custom AI features"],
    ["Workflow Automation", "We automate repetitive business processes so information, tasks", "System-to-system workflows"],
    ["Sales &amp; CRM Automation", "We connect your sales processes with automation and AI", "Reporting workflows"],
    ["Customer Service Automation", "We automate repetitive customer service processes", "Feedback collection"],
  ];
  for (const [name, paragraph, item] of creative) {
    const panel = wheel.match(new RegExp(`<h2 class="services-wheel__title">${name}</h2>[\\s\\S]*?</article>`))?.[0] ?? "";
    assert.ok(panel, `${name} has no panel`);
    assert.ok(panel.includes(`<p class="services-wheel__summary">${paragraph}`), `${name} has not got his paragraph`);
    assert.ok(panel.includes(`<li>${item}</li>`), `${name} is missing ${item}`);
  }
  assert.doesNotMatch(wheel, /services-wheel__panel-group|Build a clear foundation for your brand|>Includes</);
  /* **Two ways in under every service** (owner, 2026-10-06: "write to us and
     other Book a meeting so two buttons"). */
  const panels = [...wheel.matchAll(/<article class="services-wheel__panel"[\s\S]*?<\/article>/g)].map((m) => m[0]);
  assert.equal(panels.length, 19);
  for (const panel of panels) {
    assert.deepEqual(
      [...panel.matchAll(/class="services-wheel__cta" href="([^"]+)"[\s\S]*?roll__face">([^<]+)</g)].map((m) => [m[1], m[2]]),
      [["/contact", "Write to us"], ["mailto:info@mardal.co?subject=Book%20a%20meeting", "Book a meeting"]],
    );
  }
  /* No index list under it any more. */
  assert.doesNotMatch(html, /class="page-index"/);
});

test("the products' page opens as the services' does, in its own words", async () => {
  /* Owner, 2026-10-07: "Recreate Product page, make same hero banner but with
     different text adapt a text that explakin product pages". */
  const response = await render("/products");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Products — Mardal<\/title>/i);
  assert.doesNotMatch(html, /Working|service-hero__title|class="page-index"/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);

  const opening = html.slice(html.indexOf('class="services-hero services-hero--products"'), html.indexOf("</section>"));
  assert.ok(opening.length > 0, "the products' page does not open on the hero");
  assert.match(opening, /aria-labelledby="products-hero-title" data-services-hero="true"/);
  assert.match(opening, /<p class="services-hero__label" data-services-hero-first="true"><span class="services-hero__mark" aria-hidden="true"><\/span>Products<\/p>/);
  assert.deepEqual(
    [...opening.replace(/<!-- -->/g, "").matchAll(/<span class="services-hero__title-line">(.*?)<\/span>(?=<span class="services-hero__title-line">|<\/h1>)/g)].map((m) => m[1].replace(/<[^>]+>/g, "")),
    ["Mardal also builds its own", "products to test its thinking before", "it goes into the work", "for clients."],
  );
  assert.match(opening, /<h1 class="services-hero__title" id="products-hero-title" data-services-hero-title="true">/);
  assert.match(opening, /<span class="services-hero__stop">\.<\/span>/);
  assert.match(opening, /Each one starts from a real need, not a trend\. We explore, build, test and refine it, then bring what we learn into every project we take on\./);
  assert.equal((opening.match(/class="services-hero__mark/g) ?? []).length, 4);

  /* On the same hairlines: the page's five, from its top, and the footer's. */
  const main = html.slice(html.indexOf('<main class="service-page service-page--products"'), html.indexOf('class="services-hero'));
  assert.equal((main.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 5);
  assert.equal((html.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 10);
});

/* **Privacy, Terms and Cookies — owner, 2026-10-08**: "now we have to work on
   privacy, terms and Cookies", then "don need the hero banner only normal
   page titles then text under it in classic way". A document each: the
   title, a line under it, then each heading with its words under it. Every
   fact not on file is a bracket, never a guess. */
test("the three legal pages are written as documents, and guess nothing", async () => {
  const expected = {
    "/privacy": { title: "Privacy", intro: "This policy covers mardal.co", first: "Who is responsible" },
    "/terms": { title: "Terms", intro: "Using mardal.co means accepting these terms", first: "Who we are" },
    "/cookies": { title: "Cookies", intro: "Today this site sets no cookies", first: "What they are" },
  };
  for (const [path, page] of Object.entries(expected)) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} does not answer`);
    const html = await response.text();
    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));

    assert.match(html, new RegExp(`<title>${page.title} — Mardal</title>`, "i"));
    assert.doesNotMatch(main, /Working[\s\S]{0,40}on it\./, `${path} is still a placeholder`);
    assert.doesNotMatch(main, /services-hero/, `${path} has a hero again`);
    assert.match(main, new RegExp(`<h1 class="legal__page-title" id="legal-title">${page.title}</h1><p class="legal__intro">${page.intro}`));
    assert.equal((main.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 5, `${path} has not got the page's lines`);
    assert.match(main, new RegExp(`<h2 class="legal__title">${page.first}</h2>`));

    /* Nothing invented: the company is named as what is on file, and what is
       not on file stays a bracket. */
    const prose = main.replace(/<[^>]*>/g, " ");
    assert.doesNotMatch(prose, /\b(L\.?L\.?C|SH\.?P\.?K|GmbH|Ltd)\b/, `${path} names a legal form nobody gave`);
    assert.doesNotMatch(prose, /\b(Google Analytics|Vercel|Cloudflare|Netlify|AWS|Mailchimp)\b/, `${path} names a provider nobody chose`);
  }

  const privacy = await (await render("/privacy")).text();
  assert.match(privacy, /\[registered name and number\]/);
  assert.match(privacy, /\[hosting provider\]/);
  assert.match(privacy, /We do not use analytics or advertising tools/);

  /* The Cookies page says what the site keeps today — one choice — and has
     the way back to the panel. */
  const cookies = await (await render("/cookies")).text();
  assert.match(cookies, /Today this site sets no cookies/);
  assert.match(cookies, /mardal-consent/);
  assert.match(cookies, /<button class="legal__button" type="button" data-roll="true"><span class="roll"><span class="roll__face">Change cookie settings</);
});

test("the cookie panel asks once, keeps one name, and says no as easily as yes", () => {
  const panel = readFileSync(new URL("../components/consent/CookieConsent.tsx", import.meta.url), "utf8");
  const store = readFileSync(new URL("../lib/consent.ts", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const CSSP = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  /* Outside the scrolling content, as the bar is. */
  assert.match(layout, /<SiteHeader \/>[\s\S]*<CookieConsent \/>[\s\S]*<div id="smooth-wrapper">/);

  /* One name, versioned, read safely. */
  assert.match(store, /CONSENT_KEY = "mardal-consent"/);
  assert.match(store, /CONSENT_VERSION = 1/);
  assert.match(store, /try \{[\s\S]*localStorage\.getItem/);

  /* Accept all and Necessary only are the same solid button, so no is as easy
     as yes; Settings is the word-and-arrow button. Red and white — owner,
     2026-10-08: "make this Cookies popup in red and white". */
  const solid = [...panel.matchAll(/className="consent__button consent__button--solid"/g)];
  assert.equal(solid.length, 4, "Accept all, Necessary only, Save choices, Accept all");
  assert.equal([...panel.matchAll(/className="consent__button consent__button--text"/g)].length, 1);
  const panelRule = CSSP.slice(CSSP.indexOf("\n.consent {"), CSSP.indexOf("\n}", CSSP.indexOf("\n.consent {")));
  /* Our red — owner, 2026-10-08: "thiis is not our red?" (it was the deeper
     #cc2900). White on #ff3300 is under AA for text this size; kept on his
     word, and printed here every run so it is not forgotten. */
  assert.match(panelRule, /--consent-ground: var\(--accent\);/);
  const lum = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
  const red = CSSP.match(/--tint-red:\s*(#[0-9a-f]{6})/i)[1];
  console.log(`    cookie panel: white on ${red} is ${(1.05 / (lum(red) + 0.05)).toFixed(2)}:1 — under AA for small text, kept on the owner's word`);
  assert.match(panelRule, /--consent-ink: var\(--accent-contrast\);/);
  assert.match(panel, /role="switch"/);
  assert.match(panel, /aria-disabled=\{kind\.locked \? "true" : undefined\}/);

  /* From the middle line to the edge, under the bar. */
  const rule = CSSP.slice(CSSP.indexOf("\n.consent {"), CSSP.indexOf("\n}", CSSP.indexOf("\n.consent {")));
  assert.match(rule, /left: 50%;/);
  assert.match(rule, /right: var\(--page-gutter\);/);
  assert.match(rule, /z-index: 50;/);
});
