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
  /* A step above the paragraph since 2026-10-09 ("make Menu text little
     bigger", on a phone and then on a desktop); the paragraph's weight. */
  assert.match(toggle, /font-size:\s*calc\(var\(--text-body\) \* 1\.125\)/);
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
  /* No parents left: About became one page and Contact a word of its own
     (owner, 2026-10-08: "i want to remain only one page about", "add
     contact"), and Products a page too once its two products' pages were
     deleted the same day ("delete it all", "we dont have seperate pages for
     those links"). Every word goes straight to its page. */
  assert.doesNotMatch(pages, /<button class="mobile-menu__page"|mobile-menu__panel|mobile-menu__links/);
  assert.deepEqual(
    [...pages.matchAll(/<a href="([^"]+)" class="mobile-menu__page"/g)].map((m) => m[1]),
    ["/services", "/products", "/case-studies", "/about", "/contact"],
  );
  /* No second screen to step into, and nothing to go back from. */
  assert.doesNotMatch(html, /mobile-menu__(index|detail|back|count|rows|num)/);

  /* And the foot: the way in, then the ways to reach Mardal — no phone since
     2026-10-09 (owner: "Number of telephone need to be remove completley"). */
  assert.match(html, /<div class="mobile-menu__foot"[^>]*>[\s\S]*?class="mobile-menu__cta" data-roll="true" href="\/contact"[\s\S]*?href="mailto:info@mardal\.co"/);
  assert.doesNotMatch(html, /href="tel:|210 999|210999/);

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

  // Two lists, each a heading over its lines. Services and Products had
  // lists of their own until their pages were deleted (owner, 2026-10-08).
  assert.equal((html.match(/<nav class="site-footer__group" aria-labelledby="footer-group-/g) ?? []).length, 1);
  assert.match(html, /<h2 class="site-footer__group-title" id="footer-group-pages">Menu<\/h2>/);
  assert.match(html, /<h2 class="site-footer__group-title">Contact<\/h2>/);
  assert.doesNotMatch(footerPart, /footer-group-(services|products)|site-footer__stack/);
  /* Menu is the bar's words in the bar's order, then Blog, the footer's
     alone; no Home, as the bar has none (owner, 2026-10-08). */
  const menuList = footerPart.slice(
    footerPart.indexOf('id="footer-group-pages"'),
    footerPart.indexOf("</nav>", footerPart.indexOf('id="footer-group-pages"')),
  );
  assert.deepEqual(
    [...menuList.matchAll(/<a class="site-footer__link" href="([^"]+)">([^<]+)<\/a>/g)].map((m) => [m[2], m[1]]),
    [
      ["Services", "/services"],
      ["Products", "/products"],
      ["Clients", "/case-studies"],
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Blog", "/blog"],
    ],
  );
  assert.doesNotMatch(footerPart, /<a class="site-footer__link" href="\/">/);
  assert.doesNotMatch(footerPart, /href="\/(services|products)\/[^"]/);

  // None of the earlier footers' furniture: no closing line, no way in, no
  // ring, no panel, no paragraph.
  assert.doesNotMatch(footerPart, /site-footer__(title|cta|mark|lead|label|sign|bars|wordmark|email|body)\b/);
  assert.doesNotMatch(html, /Let’s build|Tell us what you want to improve|practical digital solution/);

  // 6 pages, the email, and the 3 legal links. The address is not a link, and
  // the social marks are links of their own (site-footer__social-link).
  assert.equal((html.match(/class="site-footer__link"/g) ?? []).length, 10);
  assert.doesNotMatch(html, /href="\/careers/);
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

  // How to reach Mardal — all of it real; no phone since 2026-10-09.
  assert.equal((html.match(/class="site-footer__detail"/g) ?? []).length, 1);
  assert.match(html, /class="site-footer__detail-value">.{0,400}?href="mailto:info@mardal\.co"/s);
  assert.doesNotMatch(html, /href="tel:|\+383 49/);
  // Street first, then postcode and city — the order it is written in,
  // and the one that breaks into two lines a phone can hold.
  assert.match(html, /Rr\.\u00a0\u201cIsa\u00a0Boletini\u201d, 6000\u00a0Gjilan/);
  assert.doesNotMatch(html, /site-footer__detail-short/);
  assert.doesNotMatch(html, /contact-icon/);
  assert.doesNotMatch(html, /\[Phone number\]|\[Street\]|\[City\]/);
  // Three marks, drawn at the icon weight the rest of the site uses, each a
  // link to its account since the owner gave the addresses (2026-10-09).
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
  for (const href of [
    "https://www.instagram.com/mardal.co/",
    "https://www.facebook.com/mardallagency",
    "https://www.linkedin.com/company/mardal-co/",
  ]) {
    const link = footerHtml.match(new RegExp(`<a [^>]*href="${href.replace(/[.?/]/g, "\\$&")}"[^>]*>`))?.[0] ?? "";
    assert.match(link, /class="site-footer__social-link"/, `${href} is not a footer link`);
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noreferrer"/);
  }
  assert.doesNotMatch(html, /viewAsMember/);
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

  /* Two long arrows, no words on the page and no "All writing" between them
     (owner, 2026-10-08: "remove the text leave it only arrows … also remove
     that All writing"); the titles are kept for a screen reader. */
  const rowStart = html.indexOf('<div class="blog-more__row">');
  const row = html.slice(rowStart, html.indexOf("</nav>", rowStart));
  assert.equal((row.match(/<svg class="blog-more__arrow"/g) ?? []).length, 2);
  assert.match(row, /<span class="visually-hidden">Most failures happen between systems<\/span>/);
  assert.match(row, /<span class="visually-hidden">Migration is the project<\/span>/);
  assert.doesNotMatch(row, /blog-more__all|blog-more__name|All writing/);
  /* The piece never offers itself. */
  assert.doesNotMatch(html, /href="\/blog\/what-phase-one-does-not-include"/);
  /* The arrows are the last thing before the footer: no "Let’s build what
     your business needs next." (owner, 2026-10-08: "remove this section"),
     and no "Operating from Kosova" in the bar over the opening. */
  assert.doesNotMatch(html, /class="service-cta"|Let’s build/);
  assert.match(html, /<header class="blog-article__head" data-article-hero="true">/);
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(
    CSS,
    /:root:has\(\[data-article-hero\]\) \.site-nav__place,\s*:root:has\(\[data-contact-hero\]\) \.site-nav__place \{\s*visibility: hidden;/,
  );
});

/* Owner, 2026-10-08: "also from contact page delete this: Operating from
   Kosova" — the bar's line, hidden while Contact's opening is on the page. */
test("Contact says no Operating from Kosova", async () => {
  const html = await (await render("/contact")).text();
  assert.match(html, /<section class="contact" aria-labelledby="contact-title" data-service-hero="true" data-contact-hero="true">/);
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(CSS, /:root:has\(\[data-contact-hero\]\) \.site-nav__place \{\s*visibility: hidden;/);
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
  /* No address on file, so no LIVE WEBSITE at all (site check, 2026-10-09:
     it looked like a button and went nowhere); its rule stays for the day
     there is one. */
  assert.doesNotMatch(intro, /project-live|LIVE WEBSITE/);
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
  /* No second story yet, so no Next Project arrow at all (site check,
     2026-10-09). */
  assert.doesNotMatch(page, /project-out__link--next|Next Project/);
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
  /* (Once, in the helper every entrance of this kind uses since 2026-10-09.) */
  assert.match(readFileSync(new URL("../lib/play-on-arrival.ts", import.meta.url), "utf8"), /once: true/);
  assert.match(code, /const START = "top 85%";/);

  /* **Smoother, more elegant** — the same day. Each block arrives as it comes
     into view rather than one timeline for a composition taller than the
     screen; nothing overshoots, and the mark neither rises nor grows. */
  assert.doesNotMatch(code, /back\.out|scale: 0\.72|y: still \? 0 : 90/);
  /* (The section's own trigger drew its rules until 2026-10-06; they simply
     stand now.) */
  for (const block of [/RISE, paused: true \}\), left, START\);/, /\.to\(rightLines, \{ \.\.\.shown, \.\.\.RISE \}, 0\.2\),\s*right,\s*START,\s*\);/, /copy,\s*"top 92%",\s*\);/]) {
    assert.match(code, block, `${block} has no trigger of its own`);
  }

  /* **A block the page arrives at, or past, still plays** — owner,
     2026-10-09: "sometimes when i scroll in mobile version i dont se at all
     Human Creativity". Back to a page jumps the scroll past a block while
     the page is measured, and a jump seen during a measure takes no action;
     so every entrance of this kind waits paused and lib/play-on-arrival
     plays it on the way in from either side, or from a measure that finds
     the page at or past it — once. The same fix in all seven, from the
     site check of the same day. */
  const helper = readFileSync(new URL("../lib/play-on-arrival.ts", import.meta.url), "utf8");
  assert.match(helper, /onEnter: play,\s*onEnterBack: play,\s*onRefresh: \(self\) => \{\s*if \(self\.progress > 0\) play\(\);/);
  assert.match(helper, /if \(played\) return;\s*played = true;/);
  assert.match(helper, /entrance\.restart\(true\)/);
  for (const file of [
    "components/home/FusionReveal.tsx",
    "components/home/AboutIntroReveal.tsx",
    "components/home/ExpertiseReveal.tsx",
    "components/home/ProductsReveal.tsx",
    "components/home/SelectedWorkReveal.tsx",
    "components/layout/FooterReveal.tsx",
    "components/blog/BlogEntriesReveal.tsx",
  ]) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    assert.match(source, /import \{ playOnArrival \} from "\.\.\/\.\.\/lib\/play-on-arrival";/, `${file} does not use the arrival helper`);
    assert.doesNotMatch(source, /scrollTrigger: |once: true/, `${file} still ties an entrance to a play-once trigger`);
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

  /* And the arrow does not move: the pixel arrows' dot-by-dot rebuild is off
     on a rolling control, which keeps only the colour change. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(CSS, /\[data-roll\]:hover \.pixel-arrow--animated > span,\s*\[data-roll\]:focus-visible \.pixel-arrow--animated > span \{\s*animation:\s*none;/);
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

    /* Nothing invented: the company is named as what is on file — no legal
       form, no registration number, since none is on file — and the only
       provider named is the one Mardal uses (Namecheap: the owner's word and
       mardal.co's own mail servers, 2026-10-09). No bracket left. */
    const prose = main.replace(/<[^>]*>/g, " ");
    assert.doesNotMatch(prose, /\b(L\.?L\.?C|SH\.?P\.?K|GmbH|Ltd)\b/, `${path} names a legal form nobody gave`);
    assert.doesNotMatch(prose, /\b(Google Analytics|Vercel|Cloudflare|Netlify|AWS|Mailchimp)\b/, `${path} names a provider nobody chose`);
    assert.doesNotMatch(prose, /\[[A-Za-z][^\]]{1,90}\]/, `${path} still has a bracket`);
    assert.match(prose, /Last updated: 9 October 2026\./);
  }

  const privacy = await (await render("/privacy")).text();
  assert.match(privacy, /our hosting provider, Namecheap, records/);
  assert.match(privacy, /Namecheap hosts both/);
  assert.match(privacy, /no longer than 12 months after it ends/);
  const terms = await (await render("/terms")).text();
  assert.match(terms, /governed by the law of the Republic of Kosovo/);
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

/* **The Blog opens as the other pages do, and lists each piece as one wide
   entry** — owner, 2026-10-08: "change the hero as others, then i want to
   have also new aproach on apearing the blogs cards". */
test("the Blog opens as the others and lists its pieces on the lines", async () => {
  const response = await render("/blog");
  assert.equal(response.status, 200);
  const html = await response.text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));

  const opening = main.slice(main.indexOf('class="services-hero services-hero--blog"'), main.indexOf("</section>"));
  assert.ok(opening.length > 0, "the Blog does not open on the services' hero");
  assert.match(opening, /<span class="services-hero__mark" aria-hidden="true"><\/span>Blog<\/p>/);
  assert.deepEqual(
    [...opening.replace(/<!-- -->/g, "").matchAll(/<span class="services-hero__title-line">(.*?)<\/span>(?=<span class="services-hero__title-line">|<\/h1>)/g)].map((m) => m[1].replace(/<[^>]+>/g, "")),
    ["Notes on the things", "we’re exploring."],
  );
  assert.equal((main.match(/<span class="services-rules__line"><\/span>/g) ?? []).length, 5);

  /* **Three to a row, the picture only under the pointer** — owner,
     2026-10-08: "i would like in 3 blog post in on row and maybe only image
     on hover". "Writing" on the first line; each card its reading time and
     date, a field holding its thesis and the picture, the title. */
  assert.match(main, /<h2 class="blog-row__label" id="blog-index-title">Writing<\/h2>/);
  const cards = [...main.matchAll(/<li class="blog-card" data-blog-entry="true"><a class="blog-card__link" href="\/blog\/([a-z0-9-]+)">/g)];
  assert.equal(cards.length, 3);
  /* The picture, not the thesis — "i want image to be visible not text". */
  assert.doesNotMatch(main, /blog-card__thesis/);
  assert.equal((main.match(/<h3 class="blog-card__title" data-blog-entry-title="true">/g) ?? []).length, 3);
  assert.match(main, /min read/);
  assert.doesNotMatch(main, /blog-entry__|blog-grid|service-hero__aside/);

  /* ⚠ The pictures are stock stand-ins and must not ship: delete this with
     the commit that puts the pieces' own pictures in. */
  assert.equal((main.match(/ src="https:\/\/picsum\.photos\/seed\/mardal-blog-/g) ?? []).length, 3);

  /* Under the pointer the picture is revealed again: the red sweeps over it
     and lifts off, the picture settling. */
  const CSSB = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(CSSB, /\.blog-card__link:hover \.blog-card__field::after,[^{]*\{\s*animation: blog-curtain/);
  assert.match(CSSB, /@keyframes blog-curtain/);
  assert.doesNotMatch(CSSB, /\.blog-card__image \{[^}]*clip-path: inset\(100%/);
  assert.match(CSSB, /\.blog-cards \{[^}]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
});

/* Owner, 2026-10-08: "i see often this outline" (round Menu), and "move the
   menu to the right to the edge of the vertical line". */
test("Menu draws no ring after a click unless Tab is pressed, and ends on the last line", () => {
  const header = readFileSync(new URL("../components/layout/SiteHeader.tsx", import.meta.url), "utf8");
  /* After a click the browser draws the ring for any key (Escape, Space, an
     arrow, measured), so only Tab may bring it back. */
  assert.match(header, /if \(event\.key === "Tab"\) header\.removeAttribute\("data-pressed"\);/);
  assert.doesNotMatch(header, /const keyed = \(\) => header\.removeAttribute/);

  /* One pixel on the right of the bar at every width: the last line stands a
     whole pixel inside the column's edge. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const pads = [...CSS.matchAll(/\.site-nav \{[^}]*?padding: ([^;]+);/g)].map((m) => m[1]);
  assert.equal(pads.length, 3, `the bar is padded in ${pads.length} places`);
  for (const pad of pads) assert.match(pad, /^\S+ 1px \S+ 0$/, `the bar keeps a right padding: ${pad}`);
});

/* Owner, 2026-10-09: "in mobile i want a project to show like this so that
   right that we have in desktop here we have at the bottom". */
test("a phone holds the project's pages too, the small ones in a row along the foot", async () => {
  const page = await (await render("/case-studies/healthcare-office-website")).text();
  const showcase = page.match(/<section class="project-showcase"[\s\S]*?<\/section>/)?.[0] ?? "";
  /* The frame is placed along the small pages, and slides with them. */
  assert.match(showcase, /<div class="project-showcase__strip"><div class="project-showcase__track"><ol class="project-showcase__thumbs">[\s\S]*<\/ol><span class="project-showcase__window" aria-hidden="true"><\/span><\/div><\/div>/);

  const source = readFileSync(new URL("../components/case-studies/ProjectShowcase.tsx", import.meta.url), "utf8");
  assert.match(source, /media\.add\(\{ wide: WIDE, phone: PHONE \}/);
  assert.match(source, /const PHONE = "\(max-width: 40rem\)";/);

  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const phone = CSS.slice(CSS.indexOf("/* A phone holds the pages as a desktop does"));
  const block = phone.slice(0, phone.indexOf("\n  .project-out__link {"));
  assert.match(block, /\.project-showcase__stage \{[^}]*container-type: size;/);
  assert.match(block, /\.project-showcase__thumbs \{\s*display: flex;/);
  assert.match(block, /\.project-showcase__strip \{[^}]*overflow: hidden;/);
  assert.doesNotMatch(block, /\.project-showcase__strip \{\s*display: none/);
  assert.doesNotMatch(block, /\.project-showcase \{\s*height: auto/);
});

/* Owner, 2026-10-09: "in mobile make Menu text little bigger and move up
   little because is not in same horisontal line with the logo", then "make
   it also in desktop little bigger and then move little up both logo and
   menu so to have same margin as other sides". */
test("MENU is a step larger and shares the wordmark's middle; the bar's top margin is the side margin", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  /* One size rule for every width: 18px on a phone, about 20 on a desktop. */
  assert.doesNotMatch(CSS, /\.mobile-menu-toggle \{\s*font-size: 1\.125rem;/);
  /* "Operating from Kosova" hangs under the wordmark on a phone rather than
     stacking: stacked, it made the group taller than the wordmark and MENU,
     centred on the row, stood 11.5px below it. */
  assert.match(CSS, /@media \(max-width: 30rem\) \{\s*\.site-nav__lead \{\s*position: relative;\s*\}\s*\.site-nav__place \{\s*position: absolute;/);
  assert.doesNotMatch(CSS, /\.site-nav__lead \{\s*flex-direction: column;/);
  /* Every width since 2026-10-09 ("here whatever is best", of phones and
     tablets): the gutter above the bar (or the notch's room), no padding or
     floor in the bar, MENU's 44px of finger room given back. */
  assert.match(CSS, /\n\.site-header \{\s*--header-pad: max\(var\(--page-gutter\), env\(safe-area-inset-top, 0px\)\);/);
  assert.match(CSS, /\n\.site-nav \{\s*min-height: 0;\s*padding-block: 0;/);
  assert.match(CSS, /\n\.mobile-menu-toggle \{\s*height: auto;\s*padding-block: 13px;\s*margin-block: -13px;/);
  assert.doesNotMatch(CSS, /\.site-header \{\s*padding-top: 0\.75rem;/);
  assert.doesNotMatch(CSS, /\.mobile-menu-toggle \{\s*height: 2\.75rem;/);
  /* On touch the band the bar returns on keeps the gutter under the
     wordmark as well. */
  assert.match(CSS, /@media \(max-width: 64rem\), \(hover: none\) \{\s*\.site-header \{\s*padding-bottom: var\(--page-gutter\);/);
  /* The page keeps its room under the bar. */
  assert.match(CSS, /--header-space: calc\(var\(--header-pad-top\) \+ var\(--header-bar\)\);/);
});

/* Site check, 2026-10-09: the phone menu's Start a project, email and phone
   were 21px tall on a touch screen. */
test("the phone menu's foot links have a finger's height on a touch screen", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const coarse = CSS.slice(CSS.indexOf("@media (pointer: coarse) {"));
  assert.match(coarse, /\.mobile-menu__cta \{\s*padding-block: 14px;\s*margin-block: -14px;/);
  assert.match(coarse, /\.mobile-menu__foot \.mobile-menu__link \{\s*display: inline-block;\s*padding-block: 12px;\s*margin-block: -12px;/);
});

/* ── The site check of 2026-10-09: steps 3, 4, 5, 9 and 10 ── */

test("a wrong address has a page of the site's own, light, with a way home", async () => {
  const response = await render("/no-such-page");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /<h1 class="legal__page-title" id="not-found-title">Page not found<\/h1>/);
  const home = html.match(/<a [^>]*class="legal__button"[^>]*>/)?.[0] ?? "";
  assert.match(home, /href="\/"/, "the 404 has no way home");
  assert.match(html, /<footer class="site-footer"/);
  assert.doesNotMatch(html, /This page could not be found/);
});

test("the Contents list's other headings are readable, the one being read in ink", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(CSS, /\.article-contents__link \{[^}]*color: var\(--ink-muted\);/);
  assert.match(CSS, /--ink-muted: #5e5a69;/);
});

test("the keyboard's first stop on every page skips the bar", async () => {
  const html = await (await render("/about")).text();
  const body = html.slice(html.indexOf("<body"));
  assert.match(body, /^<body[^>]*><a class="skip-link" href="#main-content">Skip to content<\/a>/);
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(CSS, /\.skip-link \{[^}]*transform: translateY\(/);
  assert.match(CSS, /\.skip-link:focus-visible \{\s*transform: none;/);
  const link = readFileSync(new URL("../components/layout/SkipLink.tsx", import.meta.url), "utf8");
  assert.match(link, /main\.focus\(\{ preventScroll: true \}\)/);
});

test("search engines are kept out until launch, and have a sitemap of every page", () => {
  const robots = readFileSync(new URL("../app/robots.ts", import.meta.url), "utf8");
  assert.match(robots, /rules: \{ userAgent: "\*", disallow: "\/" \}/);
  assert.match(robots, /sitemap: `\$\{siteUrl\}\/sitemap\.xml`/);
  const sitemap = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  for (const path of ['"/services"', '"/products"', '"/case-studies"', '"/about"', '"/blog"', '"/contact"', '"/privacy"', '"/terms"', '"/cookies"']) {
    assert.ok(sitemap.includes(path), `${path} is not in the sitemap`);
  }
  assert.match(sitemap, /blog\.posts\.map/);
});

test("every page has a link preview of its own, with the picture", async () => {
  for (const [path, title] of [["/services", "Services — Mardal"], ["/blog/between-systems", "Most failures happen between systems — Mardal"]]) {
    const html = await (await render(path)).text();
    assert.match(html, new RegExp(`<meta property="og:title" content="${title}"`), `${path} has no preview title`);
    assert.match(html, /<meta property="og:image" content="[^"]*\/og-image\.png"/, `${path} has no preview picture`);
  }
  assert.ok(readFileSync(new URL("../public/og-image.png", import.meta.url)).length > 1000);
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(layout, /metadataBase/);
  assert.match(layout, /twitter: \{ card: "summary_large_image" \}/);
});
