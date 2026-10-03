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
  assert.match(hero, /<img class="house-hero__image" src="\/house-hero-1540\.webp" alt="[^"]+" width="1540" height="1021"/);
  assert.doesNotMatch(html, /data-hero-line/);

  /* The bar names where Mardal is, beside the wordmark. */
  assert.match(html, /<span class="site-nav__place">Kosova<\/span>/);
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
  /* **The seven are a legend now, not a run.** The section was rebuilt on
     2026-08-26 as a roll call of the twenty-five organisations the descriptors
     name; the sector titles moved to the side of it as keys that light their own
     words. `industries-item` and everything under it is gone with the run.

     Still seven, and still not links — that half of the assertion is what it
     always was. */
  const keys = [
    ...html.matchAll(/<(\w+) class="industries-key" id="([\w-]+)" data-key="\2"/g),
  ];
  assert.equal(keys.length, 7);
  assert.deepEqual([...new Set(keys.map((m) => m[1]))], ["li"]);
  assert.doesNotMatch(html, /class="industries-item/);

  /* The way out is still a link, and it is the only one on this section. */
  assert.match(html, /<a [^>]*class="industries-explore"[^>]*href="\/case-studies"|<a [^>]*href="\/case-studies"[^>]*class="industries-explore"/);

  /* And nothing here promises a press: the finger came off with the link, and
     the keys that replaced the names are `li`, not buttons — seven tab stops
     that only tint some words is a worse outcome than no tab stop, because the
     words they light are already black. */
  assert.doesNotMatch(html, /class="industries-key[^"]*"[^>]*data-cursor/);
  assert.doesNotMatch(html, /<button[^>]*industries-key|<a[^>]*industries-key/);

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
  /* MENU and a drawn plus (owner, 2026-10-03), where the two lines were — the
     same word open and shut; the mark folds to a minus. */
  assert.match(bar, /class="mobile-menu-toggle__label">MENU</);
  assert.match(bar, /class="mobile-menu-toggle__plus" aria-hidden="true"/);
  assert.doesNotMatch(bar, /mobile-menu-toggle__bars|CLOSE/);

  /* **No ground, and MENU alone once the page has moved** — owner, 2026-10-03:
     "remove the bacground when scroll in and when scrollin to be visible only
     MENU +". So the bar has no ground layer and never slides off; what leaves is
     the wordmark and its place. Read from the stylesheet, since the states are
     attributes the server never writes. */
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(CSS, /\.site-header::before|\.site-header\[data-header="hidden"\]/);
  assert.match(
    CSS,
    /\.site-header:not\(\[data-header="top"\]\):not\(\.site-header--mobile-menu-open\)\s*\.site-nav__lead\s*\{[^}]*opacity:\s*0/,
  );
  assert.match(CSS, /\.mobile-menu-toggle\[aria-expanded="true"\] \.mobile-menu-toggle__plus::after\s*\{[^}]*scaleX\(0\)/);
  /* A minus only while the menu is open; under the pointer the plus turns
     slowly instead, at its own size — he wanted neither the minus nor a bigger
     plus on hover. */
  assert.match(CSS, /\.mobile-menu-toggle\[aria-expanded="false"\]:hover \.mobile-menu-toggle__plus\s*\{\s*transform:\s*rotate\(180deg\);\s*\}/);
  assert.doesNotMatch(CSS, /\.mobile-menu-toggle:hover \.mobile-menu-toggle__plus::after/);
  /* And under the pointer the whole button is the site's red — #fb000e, the
     owner's, which took the lilac's place everywhere on 2026-10-03. */
  assert.match(CSS, /--tint-red:\s*#fb000e;/);
  assert.doesNotMatch(CSS, /--tint-lilac/);
  assert.match(CSS, /\.mobile-menu-toggle:hover\s*\{\s*color:\s*var\(--tint-red\);\s*\}/);

  /* With no ground of its own, the bar turns white over anything dark, which
     marks itself: the opening's photograph and the footer's black panel. */
  assert.match(html, /class="house-hero__frame" data-house-frame="true" data-bar-dark="true"/);
  assert.match(html, /class="site-footer__panel" data-bar-dark="true"/);
  assert.doesNotMatch(bar, />(Services|Products|Clients|Company|Hire us)</);
  assert.doesNotMatch(html, /mega-menu|nav-trigger|site-nav__actions/);

  /* The menu is closed on arrival and out of the tab order while it is. */
  const sheet = html.match(/<div class="mobile-menu"[^>]*>/)?.[0];
  assert.ok(sheet, "the menu is not rendered");
  assert.match(sheet, /id="mobile-navigation"/);
  assert.match(sheet, /aria-hidden="true"/);
  assert.match(sheet, /inert=""/);

  /* **The four words, in order.** Services, Products and Company open their
     lists and go nowhere — owner's call, 2026-08-24: disclosures, not
     destinations — and Clients is the one word that is a page. */
  const index = html.match(/<ul class="mobile-menu__index-list">[\s\S]*?<\/ul>/)?.[0];
  assert.ok(index, "the menu has no words");
  assert.deepEqual(
    [...index.matchAll(/data-menu-word="true">([^<]*)</g)].map((m) => m[1]),
    ["Services", "Products", "Clients", "Company"],
  );

  /* Beside each word with a list, how many pages are behind it — a fact the
     list states again, so it is hidden from screen readers. Clients is one
     page and has none. */
  assert.deepEqual(
    [...index.matchAll(/class="mobile-menu__count" aria-hidden="true">(\d+)</g)].map((m) => m[1]),
    ["7", "3", "4"],
  );
  for (const label of ["Services", "Products", "Company"]) {
    assert.match(
      index,
      new RegExp(`<button ([^>]*)>(?:(?!</button>)[\\s\\S])*data-menu-word="true">${label}<`),
      `${label} is not a button in the menu`,
    );
  }
  const clients = index.match(/<a [^>]*>(?:(?!<\/a>)[\s\S])*data-menu-word="true">Clients</)?.[0];
  assert.ok(clients, "Clients is not a link in the menu");
  assert.match(clients, /href="\/case-studies"/);

  /* **The seven services, in two halves, in the owner's order.** Split into
     Development and Creative on 2026-10-03, Development first; it was one list
     of five. The list the menu opens on is Services, so it is the one the page
     is served with. Compared as a STRUCTURE — which half each name is under,
     and in what order — because the names on their own passed while the order
     was anything at all. */
  const services = html.match(
    /<div class="mobile-menu__detail-groups">[\s\S]*?class="mobile-menu__back"/,
  )?.[0];
  assert.ok(services, "the services list is not rendered in its two halves");
  assert.deepEqual(
    services
      .split('<div class="mobile-menu__detail-group">')
      .slice(1)
      .map((half) => ({
        heading: half.match(/mobile-menu__detail-heading"[^>]*>([^<]*)</)?.[1],
        names: [...half.matchAll(/class="mobile-menu__detail-link[^"]*"[^>]*><span>([^<]*)</g)].map(
          (m) => m[1],
        ),
      })),
    [
      {
        heading: "Development",
        names: ["Websites", "Software", "CRM Solution", "AI &amp; Automation"],
      },
      {
        /* Branding & Logo is the menu's word only; the page behind it is
           still Branding, at the same address. */
        heading: "Creative",
        names: ["Branding &amp; Logo", "UX/UI Design", "Print Design"],
      },
    ],
  );

  /* Each half is a list named by its heading, so a screen reader entering it
     hears "Creative" rather than a bare list of three. */
  for (const half of ["development", "creative"]) {
    assert.match(
      services,
      new RegExp(`<ul class="mobile-menu__detail-list" aria-labelledby="mobile-menu-group-${half}">`),
      `the ${half} list is not named by its heading`,
    );
  }

  /* Names only — no line of description under any of them. The dropdown of
     the same day shipped with one and the owner took them out: "why
     explanation under each menu that is very bad". */
  assert.doesNotMatch(html, /__summary/);

  /* "Hire us" left with the bar; the way in is "Start a project", in the
     menu under the four words. */
  assert.doesNotMatch(html, /Hire us/);
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
  // The paragraph under it came off on 2026-08-27, owner's call: `Let's build
  // smarter` says it, and a sentence explaining a two-word sentence is a
  // sentence too many. `contact.body` is still written in the content file, so
  // this is the only thing standing between it and quietly coming back.
  assert.doesNotMatch(html, /Tell us what you want to improve/);
  assert.doesNotMatch(html, /practical digital solution/);
  assert.doesNotMatch(html, /site-footer__body/);
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
  // The ring alone, cropped from the wordmark rather than a second asset. It
  // came off for one pass on 2026-08-27, when the footer's mark was the name
  // set at the size of the panel; the owner asked for the icon back and the
  // spelled-out name gone, so the raster — and the filter that colours it — is
  // load-bearing again. See theme.test.mjs.
  assert.match(html, /class="site-footer__mark"/);
  assert.doesNotMatch(html, /site-footer__sign/);
  // **No bar field on the page.** The traced arrangement is still in
  // `FooterBars.tsx` — the tracing is the expensive part and the layout it was
  // drawn for could be asked for again — but nothing imports it, and the owner
  // asked for the vertical lines gone. This is what would catch it coming back
  // unnoticed.
  assert.doesNotMatch(html, /site-footer__bars/);
  // 14 in the three menu groups — seven Services, three Products, four Company —
  // the email and the phone in the details block, and the three legal links in
  // the foot. The address is not a link and the social marks are not links yet.
  // 17 until UX/UI Design and Print Design joined Services on 2026-10-03, 18
  // until Team came out of Company on 2026-08-12, 19 while Case Studies had a
  // column down here, and 25 before `1fbc8cf` took Solutions out.
  assert.equal((html.match(/class="site-footer__link"/g) ?? []).length, 19);
  // **Team is gone from every menu, not just this one.** The header panels and
  // this footer all read the same array, so an entry that survived in one of
  // them would mean something had been copied that should have been shared.
  assert.doesNotMatch(html, />Team</);
  assert.doesNotMatch(html, /href="#team"/);
  // The retired class was `site-footer__column`, singular. Matched as a whole
  // class name and not as a substring: the band of small print added on
  // 2026-08-27 is `site-footer__columns`, and a loose match called that the
  // dead one coming back.
  assert.doesNotMatch(html, /class="site-footer__column"/);
  // ── The shape of the panel ──
  //
  // Four arrangements in one day, then cut back to the plainest of them: the
  // mark, the closing line and the way back up across the top; one band of
  // small print; the year and the legal links. No ornament. The names the
  // earlier passes used are asserted gone so none of them can half-return —
  // `__meta` when the bars sat in a corner, `__head`/`__grid` when the panel
  // was one filled field, `__slab`/`__index` when it was split in two, and
  // `__sign` when the name was set at the size of the panel.
  assert.doesNotMatch(
    html,
    /site-footer__meta|site-footer__head|site-footer__grid|site-footer__words|site-footer__slab|site-footer__index/,
  );
  const bandOrder = ["__lead", "__columns", "__legal"].map((band) =>
    html.indexOf(`site-footer${band}`),
  );
  assert.ok(
    bandOrder.every((at, i) => at > 0 && (i === 0 || at > bandOrder[i - 1])),
    `footer bands out of order: ${bandOrder.join(", ")}`,
  );
  // The mark stands over the closing line, with the way back up opposite them.
  assert.match(
    html,
    /class="site-footer__lead">[\s\S]*?site-footer__mark[\s\S]*?site-footer__title[\s\S]*?site-footer__top-link/,
  );
  // How to reach Mardal — all of it real, and the phone dialable.
  //
  // One `dl` entry now rather than four. The three facts and the marks are one
  // address between them, so they share a heading instead of each carrying
  // EMAIL / PHONE / ADDRESS / FOLLOW over it — four headings for a row that
  // reads itself. The heading is spoken and not drawn; see the base rule on
  // `__detail-full`.
  assert.equal((html.match(/class="site-footer__detail"/g) ?? []).length, 1);
  assert.match(html, /site-footer__detail-full">Contact</);
  assert.match(html, /href="tel:\+38349210999"[^>]*>\+383 49 210 999</);
  // Street first, then postcode and city — the order it is written in,
  // and the one that breaks into two lines a phone can hold.
  assert.match(html, /Rr\.\u00a0\u201cIsa\u00a0Boletini\u201d, 6000\u00a0Gjilan/);
  // **The abbreviations are retired, and that is the point of asserting it.**
  // Each row used to be named twice — EMAIL / PHONE / ADDRESS on the wide panel
  // and EMAIL: TEL: STR: on a phone, where a 90px column of full words cost
  // more than it said. There are no rows any more: the three facts sit under
  // one spoken heading, so there is nothing left to abbreviate, and the pair of
  // spans that had to be kept in step with each other is gone with them.
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
  // Every section on the page is one, including Why Mardal.
  assert.match(html, /class="why-section"[^>]*data-route-section/);
  /* Six since 2026-08-27: Selected work went in under Built across industries.
     Counted rather than listed, so a section added without one is caught — the
     entrance is applied by `SectionEnter` to `main > section[data-route-section]`
     and a section without the attribute simply never arrives. */
  assert.equal((html.match(/<section class="[^"]*"[^>]*data-route-section/g) ?? []).length, 6);

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
    ...html.matchAll(/class="mobile-menu__detail-link[^"]*" href="(\/services\/[^"]+)"/g),
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
  const clientsLink = html.match(/<a [^>]*>(?:(?!<\/a>)[\s\S])*data-menu-word="true">Clients</)?.[0];
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

test("the Why Mardal boxes are a number, a title and a mark", async () => {
  const html = await (await render("/")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const at = main.indexOf('<div class="why-grid">');
  assert.ok(at > 0, "the Why Mardal grid is not on the page");
  const grid = main.slice(at, main.indexOf("</section>", at));

  const cards = grid.match(/<article class="why-card why-card--\w+"[\s\S]*?<\/article>/g) ?? [];
  assert.equal(cards.length, 4, `found ${cards.length} boxes`);

  cards.forEach((card, index) => {
    /* **The number is the position, written by the component.** A number stored
       beside its title can disagree with where the card sits, and `01` on the
       second box is the sort of thing nobody notices until a client does.
       Padded, because `9` then `10` is a step in width the eye reads as a
       wobble down the column. */
    const number = String(index + 1).padStart(2, "0");
    assert.match(
      card,
      new RegExp(`<p class="why-card__number">${number}</p>`),
      `box ${index + 1} does not carry ${number}`,
    );
    assert.match(
      card,
      new RegExp(`<h3 class="why-card__title">${WHY_TITLES[index]}</h3>`),
      `box ${index + 1} is not "${WHY_TITLES[index]}"`,
    );

    /* A mark, not a control: nothing here opens, so it is silent to a screen
       reader rather than announced as something to press. */
    assert.match(card, /<span class="card-plus why-card__mark" aria-hidden="true"/);

    /* **The paragraph is in the markup at rest.** The pointer reveals it; it is
       never removed from the document to be hidden, so a screen reader has it
       whether or not a pointer ever crosses the card, and a phone — which has
       no hover to give — simply shows it. A hover-only disclosure that is not
       in the DOM is content nobody without a mouse can reach. */
    assert.match(
      card,
      new RegExp(`<p class="why-card__copy">${WHY_COPY[index]}`),
      `box ${index + 1} has no paragraph, or not its own`,
    );
    assert.doesNotMatch(card, /aria-hidden="true"[^>]*why-card__copy|why-card__copy[^>]*hidden/);
  });

  /* **Nothing of the section it replaced.** It carried an animated isometric
     drawing per card, a label in the opposite corner and a line of copy under
     each title; all three are gone and the copy went with them. Asserted as
     absences because the failure being caught is a half-applied revert — one
     card left with its drawing, or a stray label — which reads as a bug rather
     than as a design. The whole previous section is in
     `backup/2026-08-26-why-mardal/`. */
  for (const gone of [
    "why-card__art",
    "why-card__label",
    "why-card__image",
    "Applied AI",
    "Connected Systems",
    "Technology Partnership",
    "Solving real business problems",
  ]) {
    assert.ok(!grid.includes(gone), `${gone} is still in the Why Mardal grid`);
  }

  /* The lede above them is untouched — he changed the boxes, not the section. */
  assert.match(grid, /class="why-copy"/);
  assert.match(grid, /We help your business work better/);
});

test("the Why Mardal box is built on air and a floor", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  const at = CSS.indexOf(".why-card {");
  assert.ok(at > 0, "the box has no rule");
  const card = CSS.slice(at, CSS.indexOf("\n}", at));

  /* **The air is the design.** Measured off the reference: its card is 672 by
     795, a portrait of 1.183, holding a number, a title and a mark with the rest
     empty. 36vw is that ratio at this grid's own column — a third of the page
     less its gutters is about 445px at 1440, and 1.183 of it is 526 against the
     518 this gives. Without it, removing the drawing left four squat boxes with
     the plus tucked under the title. */
  assert.match(card, /min-height:\s*clamp\(19rem, 36vw, 33rem\)/);
  assert.match(card, /flex-direction:\s*column/);

  /* The mark is pinned to the card's floor by the column's own spare space,
     which is also why the empty middle needs no filler element. */
  const mark = CSS.indexOf(".why-card__mark {");
  assert.ok(mark > 0, "the mark has no rule");
  assert.match(CSS.slice(mark, CSS.indexOf("}", mark)), /margin-top:\s*auto/);

  /* **All four titles sit on one line**, which is what the cap has to allow.
     Measured in the real face at this tracking: `We understand business` is
     8.54em, `We think strategically` 7.78, `Engagement` 4.20, `Technology`
     3.93. It was 8.4em, which broke the longest onto a second line while the
     other three stayed on one. */
  const title = CSS.indexOf(".why-card__title {");
  assert.ok(title > 0, "the title has no rule");
  /* Comments stripped before the absence is checked. The note explaining WHY the
     reserved second line went says `min-height` in prose, and a guard read
     against the raw rule matches its own explanation — which is a test that
     passes on the comment and would go on passing if the declaration came
     back. */
  const rule = CSS.slice(title, CSS.indexOf("\n}", title)).replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  assert.match(rule, /max-width:\s*9em/);
  assert.doesNotMatch(rule, /min-height/);

  /* **Its own size, not `--text-heading`.** Owner: a little bigger. That token
     is on twelve rules across the site, and moving it would take every one of
     them along for a change asked of these four boxes.

     Lifted rather than capped higher, the same reason as `--text-copy`: the old
     `clamp(24px, 2.35vw, 30px)` was already at its ceiling from 1277 up, so
     raising only the ceiling gives a 1280 window a third of a pixel. Lifted,
     1280 goes 30.0 to 33.3 and 1440 goes 30.0 to 34.0. */
  assert.match(rule, /font-size:\s*clamp\(1\.625rem, 2\.6vw, 2\.125rem\)/);
  assert.doesNotMatch(rule, /var\(--text-heading\)/);

  /* Figures in a column: `01` over `02` sits a hair out of line without this. */
  const number = CSS.indexOf(".why-card__number {");
  assert.ok(number > 0, "the number has no rule");
  const figures = CSS.slice(number, CSS.indexOf("\n}", number)).replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  assert.match(figures, /font-variant-numeric:\s*tabular-nums/);

  /* **The same coral as the plus, at rest and on hover both.** Owner: the
     numbers in the mark's colour. It was `--ink-muted` going to `--accent`
     under the pointer, which is the reference's behaviour; one colour throughout
     is his.

     ⚠ 2.31:1 on the grey panel, against the 4.5:1 WCAG asks of text this size —
     3:1 applies only from 24px and these are about 20. The mark can be under it
     because it is `aria-hidden` and decorative; a number is neither. `#df0303`
     is the same hue at 4.56:1. Recorded, not enforced: it is his colour, and the
     point of the assertion is that nobody changes it without meeting the note. */
  assert.match(figures, /color:\s*var\(--why-mark\)/);
  assert.doesNotMatch(figures, /--ink-muted/);

  /* **The number is the paragraph's size**, owner 2026-08-26 — and it is the
     same TOKEN, not the number that token happens to resolve to, so the two stay
     equal when either moves. One of them moved today: the whole copy ramp was
     lifted for a 16in laptop.

     Compared rather than pinned, so tuning the pair stays free while the
     equality does not. */
  const paragraph = CSS.indexOf(".why-card__copy {");
  const sizeOf = (from) => {
    const rule = CSS.slice(from, CSS.indexOf("\n}", from)).replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    const value = rule.match(/font-size:\s*([^;]+);/);
    assert.ok(value, "no font-size");
    return value[1].trim();
  };
  assert.equal(sizeOf(number), sizeOf(paragraph));

  /* **The paragraph is plain where there is no pointer.** Its base rule sets no
     opacity and no transform: everything that hides it lives in the hover query
     below, so a phone gets the text instead of a card it cannot open. */
  const copy = CSS.indexOf(".why-card__copy {");
  assert.ok(copy > 0, "the paragraph has no rule");
  const base = CSS.slice(copy, CSS.indexOf("\n}", copy)).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(base, /opacity|transform|display|visibility/);
  assert.match(base, /margin:\s*auto 0 0/);

  /* And the hiding is inside `@media (hover: hover)`, which is the whole of
     that guarantee. */
  const query = CSS.indexOf("@media (hover: hover) {", copy);
  assert.ok(query > 0, "the reveal is not behind a hover query");
  const hover = CSS.slice(query, CSS.indexOf("\n}\n", query));
  assert.match(hover, /\.why-card__copy \{[\s\S]*?opacity:\s*0/);
  /* **The travel and the curve are the owner's, 2026-08-27** — 3rem on the even
     curve, up from 1.5rem on the front-loaded one. Both pinned, because the pair
     is the whole of the change: `--ease-standard` puts most of the move in its
     first quarter, and over this distance that is the throw the paragraph was
     asked to stop being. Either one alone undoes it. */
  assert.match(hover, /transform:\s*translateY\(3rem\)/);
  assert.match(
    hover,
    /\.why-card__copy \{[\s\S]*?transform var\(--duration-slow\) var\(--ease-handover\)/,
  );
  assert.match(hover, /\.why-card:hover \.why-card__copy/);

  /* **Opacity and transform only — never display, visibility or height.** The
     first two take the paragraph out of the accessible tree; the third changes
     the card's height, and a row that resizes every time a pointer crosses one
     of four boxes is the jump this avoids. */
  const reveal = hover.slice(hover.indexOf(".why-card:hover .why-card__copy"));
  assert.doesNotMatch(reveal.slice(0, reveal.indexOf("}")), /display|visibility|height/);

  /* **The plus is the owner's coral, and its own token.** 2026-08-26, with the
     value. It is the same `#fd7979` as `--tint-clay-bar` and deliberately not an
     alias of it: that one is AI & Automation's, the pattern on its hero and the
     mark on its homepage box, and pointing this at it would mean the next change
     to that service's colour silently repainting four plusses on an unrelated
     section.

     2.56:1 on the white disc, under the 3:1 WCAG asks of a meaningful graphic —
     and this one is not one: it is `aria-hidden`, nothing opens, and it carries
     nothing the card does not already show. The purple it replaces was 4.94. */
  assert.match(CSS, /--why-mark:\s*#fd7979/);
  const plus = CSS.indexOf(".why-card__mark::before,");
  assert.ok(plus > 0, "the plus has no rule");
  const strokes = CSS.slice(plus, CSS.indexOf("\n}", plus)).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(strokes, /background:\s*var\(--why-mark\)/);
  assert.doesNotMatch(strokes, /var\(--accent\)|var\(--tint-clay-bar\)/);

  /* **The plus becomes a minus, and is not removed.** Owner, 2026-08-26: do not
     remove it on hover, make it a `-`. It was fading out with the paragraph,
     which left the corner empty.

     The two strokes are the disc's `::before` and `::after`, one horizontal and
     one turned 90deg, so the minus is the upright one laid down on the other —
     turned rather than hidden, because fading it out gives the same still image
     and none of the sense that the mark closed. */
  assert.match(
    hover,
    /\.why-card:hover \.why-card__mark::after[\s\S]*?transform:\s*translate\(-50%, -50%\) rotate\(0deg\)/,
  );
  assert.doesNotMatch(hover, /\.why-card:hover \.why-card__mark,[\s\S]{0,120}?opacity:\s*0/);

  /* **The turn keeps the paragraph's clock and the paragraph's curve** — owner,
     2026-08-27. The copy moved to `--duration-slow` / `--ease-handover` and the
     mark was left on `--duration-base` / `--ease-standard`; 200ms apart on two
     different curves is visible, and the corner finished turning while the text
     was still rising, so one hover read as two events.

     Compared rather than pinned. Both are the card opening, and what has to hold
     is that they are the SAME pair — tuning the reveal stays free, taking the
     mark along with it does not. */
  const timingOf = (selector) => {
    const at = hover.indexOf(selector);
    assert.ok(at > 0, `no rule for ${selector}`);
    const rule = hover.slice(at, hover.indexOf("}", at)).replace(/\/\*[\s\S]*?\*\//g, "");
    const transform = rule.match(/transform (var\(--duration-[\w-]+\) var\(--ease-[\w-]+\))/);
    assert.ok(transform, `no transform timing on ${selector}`);
    return transform[1];
  };
  assert.equal(
    timingOf(".why-card__mark::after {"),
    timingOf(".why-card__copy {"),
    "the mark and the paragraph have come apart",
  );

  /* **And the number no longer changes under the pointer.** It went to
     `--accent` there — grey at rest, coloured on hover, which is the reference's
     behaviour. The owner has made it the mark's colour at rest instead, so there
     is nothing left for the hover to say: coral turning purple would be the card
     changing colour rather than opening. */
  assert.doesNotMatch(hover, /\.why-card:hover \.why-card__number/);
});

test("the Why Mardal boxes are a light grey panel on the page's own ground", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  /* **The section paints the page's ground and nothing of its own**, and it has
     been three other things in a day. The owner asked for `#faff89` inside this
     section, and it went through a flat fill on this box — a hard line across
     the top, because a rectangle has edges at every opacity — a gradient inside
     the box, which lost the line but arrived as a shape travelling up the window
     while the header and the sections either side stayed white, and then a
     page-wide wash on every surface that paints. Then: take the yellow out
     completely and make the boxes light grey.

     Asserted as an absence as much as a value. Each of those three left
     something behind — a token, a gradient, a client component — and a stray one
     is a colour nobody asked for arriving on scroll. */
  const at = CSS.indexOf(".why-section {");
  assert.ok(at > 0, "the section has no rule");
  const section = CSS.slice(at, CSS.indexOf("\n}", at)).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(section, /background:\s*var\(--canvas\)/);
  assert.doesNotMatch(section, /linear-gradient|--why-ground/);
  /* Comments stripped, and the declaration form matched rather than the name.
     The note on `--why-mark` explains that it is deliberately not an alias of
     `--tint-clay-bar`, "the same reason `--why-ground` was not an alias of
     `--wash-about`" — and a guard read against the raw file matches that
     sentence and reports the token as still present. */
  const declared = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(declared, /--why-ground\s*:/);

  const why = readFileSync(
    new URL("../components/home/WhyMardal.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(why, /WhyWash|WhyGround/);
  for (const driver of ["WhyWash", "WhyGround"]) {
    assert.throws(
      () =>
        readFileSync(
          new URL(`../components/home/${driver}.tsx`, import.meta.url),
          "utf8",
        ),
      `${driver}.tsx is back, and the yellow with it`,
    );
  }

  /* **`--surface-raised`, not a grey written here.** It is the site's own answer
     to exactly this — a panel raised off the page rather than a second colour on
     it — and it is defined as a few percent of the OPPOSITE of the ground, so it
     lifts on the white page and on the black one alike. A literal `#f3f3f3`
     would be a light grey card on a light page and a light grey card on a dark
     one.

     It lands at #f3f3f3 over white against the #f8f9f9 of the reference: a shade
     deeper, the same idea. */
  const card = CSS.indexOf(".why-card {");
  const rule = CSS.slice(card, CSS.indexOf("\n}", card)).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(rule, /background:\s*var\(--surface-raised\)/);
  assert.doesNotMatch(rule, /var\(--surface\)|var\(--canvas\)|#[0-9a-f]{3,8}/i);
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

test("the fusion reveal draws the mark and uncovers the words", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const code = readFileSync(
    new URL("../components/home/FusionReveal.tsx", import.meta.url),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");

  /* **The stylesheet no longer draws the plus too.** Leaving the pseudo-elements
     behind would put two crossbars in the mark, one of them undrawable. */
  const strokes = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(strokes, /\.fusion-plus::(before|after)/);

  /* **And nothing is hidden in CSS.** No clip-path, no opacity: the start state
     is written by the reveal on its first frame, so a page with the script
     blocked shows the heading whole rather than a permanently clipped one. */
  const half = strokes.indexOf(".fusion-title__half {");
  assert.ok(half > 0, "the half has no rule");
  const rule = strokes.slice(half, strokes.indexOf("}", half));
  assert.match(rule, /will-change:\s*clip-path/);
  assert.doesNotMatch(rule, /clip-path:\s*inset|opacity/);

  /* It pins, and for long enough that the strokes read as being drawn rather
     than as appearing — under about two screens they simply arrive. */
  assert.match(code, /const HOLD = 2\.5;/);
  assert.match(code, /pin: true/);
  assert.match(code, /start: "top top"/);
  assert.match(code, /"\+=" \+ window\.innerHeight \* HOLD/);
  assert.match(code, /scrub: 0\.4/);

  /* **The upright draws out of its own foot.** The origin at the bottom is what
     makes `scaleY` run upward instead of from the middle — the difference
     between a line being drawn and a line being stretched, and the one
     declaration the whole idea rests on. */
  assert.match(code, /transformOrigin: "50% 100%"/);
  assert.match(code, /\{ scaleY: 0,/);

  /* And the crossbar opens from the centre, a little past its width and back.
     The one ease on this page that overshoots. */
  assert.match(code, /transformOrigin: "50% 50%"/);
  assert.match(code, /"back\.out\(1\.7\)"/);

  /* **Clipped, not sized.** A width animated across a heading re-wraps it on
     every frame; a clip leaves the type laid out at its final size. The insets
     run past the box by a fifth of an em so ascenders and descenders are never
     shaved by a rounding difference. */
  assert.match(code, /clipPath: "inset\(-0\.2em 100% -0\.2em 0\)"/);
  assert.match(code, /clipPath: "inset\(-0\.2em 0 -0\.2em 100%\)"/);
  assert.doesNotMatch(code, /width:|maxWidth:/);

  /* The two halves close on the mark from opposite edges, the right four percent
     behind the left so the pair reads as a pair rather than as one movement
     mirrored. */
  assert.match(code, /const LEFT = \{ at: 0\.5, run: 0\.3 \}/);
  assert.match(code, /const RIGHT = \{ at: 0\.54, run: 0\.3 \}/);

  /* **Reduced motion keeps the order and drops the travel.** Being drawn is the
     idea rather than the decoration, so the strokes still draw and the clips
     still open; what goes is everything that flies. */
  assert.match(code, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(code, /y: still \? 0 : 90/);
  assert.match(code, /y: still \? 0 : 48/);

  /* An empty tween holding the end, and it is not filler: a scrub maps the whole
     scroll to the timeline's duration, so without it the paragraph lands at the
     exact moment the pin lets go. */
  assert.match(code, /timeline\.to\(\{\}, \{ duration: HELD \}/);

  /* Reverted on unmount, or a route change leaves a pin and its spacer behind on
     a page that no longer has the section. */
  assert.match(code, /context\.revert\(\)/);
});

test("the Why boxes start where the Fusion block starts", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const bare = CSS.replace(/\/\*[\s\S]*?\*\//g, "");

  /* **One left edge for both sections, and it is a grid line.**

     Fusion was centred on a 700 measure and the boxes sat on equal thirds — two
     rules that can only agree at ONE window width, solved: 2207px. At 1808 they
     were 65px apart and the distance grew with the window, which is the kind of
     near-miss that reads as a mistake rather than a decision.

     Both ways of closing it were built. Deriving the boxes' first column from
     the centred edge — `calc(50% - measure / 2 - gap)` — aligned exactly and
     cost the brick, because a first column narrower than the other two cannot
     hold a card. The owner wants the brick, so the Fusion block moved onto the
     grid instead. */
  assert.match(bare, /--statement-measure:\s*700px/);
  assert.match(bare, /--column-gap:\s*clamp\(0\.65rem, 0\.9vw, 0\.85rem\)/);

  /* The measure is kept and the centring is gone: the block is three columns of
     the page's own grid with its content on 2 to 3. */
  const fusion = bare.indexOf(".container.fusion-container {");
  assert.ok(fusion > 0, "the fusion column has no rule");
  const container = bare.slice(fusion, bare.indexOf("\n}", fusion));
  assert.match(container, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(container, /gap:\s*var\(--column-gap\)/);
  assert.doesNotMatch(container, /max-width/);

  const placed = bare.indexOf(".fusion-title,\n.fusion-copy {");
  assert.ok(placed > 0, "the fusion content is not placed on the grid");
  const rule = bare.slice(placed, bare.indexOf("\n}", placed));
  assert.match(rule, /grid-column:\s*2 \/ -1/);
  assert.match(rule, /max-width:\s*var\(--statement-measure\)/);

  /* **The three grids are the same three columns.** The Fusion container, the
     Why heading and the Why cards — a column count or a gap changed in one and
     not the others puts the heading, the boxes and the statement above them out
     of line with each other. */
  for (const selector of [".why-intro {", ".why-grid {"]) {
    const at = bare.indexOf(selector);
    assert.ok(at > 0, `${selector} has no rule`);
    const grid = bare.slice(at, bare.indexOf("\n}", at));
    assert.match(grid, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(grid, /gap:\s*var\(--column-gap\)/, `${selector} sets its own gap`);
  }

  /* The identity, checked as arithmetic rather than as a string: three equal
     columns and one gap put every one of these blocks on the same line. */
  for (const V of [1025, 1200, 1440, 1808, 2560]) {
    const gutter = Math.min(Math.max(0.04 * V, 16), 40);
    const gap = Math.min(Math.max(0.009 * V, 10.4), 13.6);
    const column = (V - 2 * gutter - 2 * gap) / 3;
    const line = gutter + column + gap;
    assert.ok(column > 200, `a column is ${column}px at ${V}`);
    /* **And the statement is the smaller of its measure and its column**, which
       is what a `max-width` does everywhere else on this site. It gets the full
       700 from about 1130 up; between the 64rem split and there the two columns
       are the narrower of the two and it sits at 627 to 700. That is the block
       narrowing gracefully, not a break — but it is a real change from the
       centred version, which held 700 down to a 780px window. */
    const statement = Math.min(700, 2 * column + gap);
    assert.ok(statement >= 600, `the statement block is ${statement}px at ${V}`);
    assert.ok(line > gutter, `the line is at the gutter at ${V}`);
  }

  /* **The brick: 2 and 3 on the first row, 1 and 2 on the second.** It steps
     left by exactly one column as it comes down, which is only true while the
     three columns are equal — and is why the alignment is solved on the Fusion
     block rather than here. It was briefly a 2x2 in the right-hand two thirds
     and the owner asked for the arrangement back. */
  const places = ["one", "two", "three", "four"].map((name) => {
    const at = bare.indexOf(`.why-card--${name} {`);
    assert.ok(at > 0, `card ${name} has no placement`);
    const card = bare.slice(at, bare.indexOf("}", at));
    return {
      column: card.match(/grid-column:\s*(\d+)/)?.[1],
      row: card.match(/grid-row:\s*(\d+)/)?.[1],
    };
  });
  assert.deepEqual(places, [
    { column: "2", row: "1" },
    { column: "3", row: "1" },
    { column: "1", row: "2" },
    { column: "2", row: "2" },
  ]);
});

test("the industries section is a roll call, and it is all legible", async () => {
  const html = await (await render("/")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const at = main.indexOf('class="industries-section"');
  assert.ok(at > 0, "the industries section is not on the page");
  const section = main.slice(at, main.indexOf("</section>", at));

  /* **The twenty-five organisations the seven descriptors name, run together.**
     The sector titles used to BE the content; they are a legend beside it now.

     Split from the descriptors rather than written out beside them — a second
     copy of the same words is a second thing to keep in step. This is the check
     that the split still produces the descriptor it came from: rejoin the
     phrases of a sector with the commas and the `and`, and the sentence has to
     come back whole. It fails the day a line is rewritten with an `and` inside
     one of its phrases. */
  const WHO = {
    finance: "Banks, insurance companies, fintech platforms, payment providers, asset managers, credit unions and financial service providers.",
    healthcare: "Hospitals, clinics, pharmacies, dental practices, diagnostic laboratories, care providers and organizations delivering health services.",
    manufacturing: "Factories, production companies, engineering firms, component suppliers, assembly plants and businesses managing industrial operations.",
    automotive: "Dealerships, repair services, parts distributors, fleet operators, leasing companies, vehicle platforms and mobility companies.",
    retail: "Physical stores, e-commerce businesses, marketplaces, wholesalers, franchise networks and consumer-focused brands.",
    logistics: "Transport companies, warehouses, freight forwarders, courier networks, distributors and delivery service providers.",
    "public-sector": "Government institutions, municipalities, public agencies, schools, utilities and organizations providing public services.",
  };


  let counted = 0;
  for (const [sector, descriptor] of Object.entries(WHO)) {
    const said = [
      ...section.matchAll(
        new RegExp(`<span class="industries-who" data-sector="${sector}">([^<]+)</span>`, "g"),
      ),
    ].map((m) => m[1]);
    assert.ok(said.length > 0, `${sector} names nobody`);
    counted += said.length;

    const rejoined =
      said.length > 1
        ? `${said.slice(0, -1).join(", ")} and ${said[said.length - 1]}.`
        : `${said[0]}.`;
    assert.equal(
      rejoined.toLowerCase(),
      descriptor.toLowerCase(),
      `${sector}'s words do not rejoin into its descriptor`,
    );
  }
  /* Forty five, up from twenty five: the owner asked for more per sector on
     2026-08-27 and the extra twenty are written in `content/home.ts` with a note
     saying they are mine. They are categories, not claims — a kind of
     organisation that exists in the sector, never a client. */
  assert.equal(counted, 45);

  /* **The heading is broken where the owner broke it**, and it is spans rather
     than a `<br>` — this site authors its heading breaks, because where a
     heading turns is a decision about the copy and not a consequence of how wide
     its column happens to be that day.

     `aria-label` carries the sentence whole: the two spans render adjacent, and
     without it a screen reader reads `Built acrossindustries`. */
  assert.match(
    section,
    /<h2 class="industries-title" id="industries-title" aria-label="Built across industries">/,
  );
  assert.match(section, /<span class="industries-title__line">Built across<\/span>/);
  assert.match(section, /<span class="industries-title__line">industries<\/span>/);
  assert.doesNotMatch(section, /<br/);

  /* **Three blocks came out on the owner's word**: the kicker over the heading,
     the line under it, and the tally that counted the run. Asserted as absences,
     because each was added deliberately and the temptation on the next pass is
     to put one back to fill a gap.

     The way out stays. It is the only thing in this section that goes
     anywhere. */
  assert.doesNotMatch(section, /industries-kicker|Who we build for/);
  assert.doesNotMatch(section, /industries-lede|Technology shaped around/);
  assert.doesNotMatch(section, /industries-tally|kinds of organisation/);

  /* **Nothing is dimmed, and nothing needs to be.** The section it replaced held
     one industry and took the other six almost to the ground — six of seven
     unreadable at any moment, on a list whose whole job is naming an audience.
     No `data-active` survives, and neither does the machinery that set it. */
  assert.doesNotMatch(section, /data-active/);

  /* And no client component drives it: the highlight is `:has()` in the
     stylesheet, so it works before hydration and on a page whose script never
     arrives. */
  /* Comments stripped first. The component's own note explains what came out —
     "the ScrollTrigger that drove them" — and a guard read against the raw file
     matches that sentence and reports the machinery as still present. */
  const code = readFileSync(
    new URL("../components/home/IndustriesSection.tsx", import.meta.url),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(code, /"use client"/);
  assert.doesNotMatch(code, /ScrollTrigger|createWheelGate|useEffect|useState/);

  /* The run is one paragraph to a screen reader, not twenty-five fragments. */
  assert.match(section, /<p class="industries-run" aria-label="Banks, insurance/);

  /* **There is real whitespace between the phrases, and it is load-bearing.**
     The spans are written adjacent, so the only break opportunities in this
     paragraph were the spaces INSIDE phrases — and the moment a phrase was told
     not to break, the whole run became one unbreakable word and ran off the
     page at full width.

     A no-break space before each separator and an ordinary one after: the dot
     stays with the phrase it follows and the line may turn after it. */
  assert.match(section, /<\/span>\u00a0<span class="industries-run__dot"/);
  assert.match(section, /<\/span> <span class="industries-who"/);
});

test("the roll call adds a rule and never takes one away", () => {
  const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const bare = CSS.replace(/\/\*[\s\S]*?\*\//g, "");

  /* **The highlight is drawn under a phrase; the others are untouched.** That
     inversion is the whole point of the rebuild — the section it replaced made
     six of seven rows unreadable to emphasise one — so what is asserted is that
     the lit rule GROWS a background and that nothing anywhere dims a sibling. */
  const who = bare.indexOf(".industries-who {");
  assert.ok(who > 0, "the words have no rule");
  const rest = bare.slice(who, bare.indexOf("\n}", who));
  assert.match(rest, /background-size:\s*0% 0\.07em/);
  assert.match(rest, /transition:\s*background-size/);
  assert.match(rest, /linear-gradient\(var\(--sector\), var\(--sector\)\)/);
  assert.doesNotMatch(rest, /opacity/);

  /* **Grey at rest, ink on hover** — owner, 2026-08-27 — and the distinction
     from the section this replaced is the number, not the idea. That one held
     one industry and took the other six to about 1.5:1: six of seven singled out
     as unreadable. This is uniform. `--ink-muted` measures 6.68:1 on the canvas,
     AA for small text and this is large, so the whole run reads before a pointer
     ever arrives.

     A token, not a literal: a grey written into this rule is a grey nobody has
     measured. `--ink-quiet` is 3.53:1 on the light canvas and 3.51 on the dark,
     both above the 3:1 floor for large text, and this run is large by
     construction at 29 to 48px. Nothing else on the site uses it. */
  const runColour = bare.indexOf(".industries-run {");
  assert.match(
    bare.slice(runColour, bare.indexOf("\n}", runColour)),
    /color:\s*var\(--ink-quiet\)/,
  );
  /* ⚠ **1.61:1, well under the line.** WCAG asks 3:1 of large text. Asked for
     six times — 6.68, 3.53, 3.07, 2.47, 1.94, this — with the number given each
     time. The owner's call, and settled.

     What keeps it from being the fault this section was rebuilt to fix: that one
     took six of seven rows to about 1.5 while leaving one black, so most of the
     section was unreadable and singled out as such. This is uniform, it is a
     resting state, every phrase goes to full ink the moment its sector is
     pointed at from either end, and the names beside it are black throughout. */
  assert.match(bare, /--ink-quiet:\s*#cccbd2;/);

  /* **The gap before the way out is on the container, not on the link.** It was
     `margin-top` on `.industries-explore` and it did nothing twice: a shared
     tap-target rule further down the file gives that class
     `margin-block: -0.6875rem` to cancel its own padding, and being later with
     the same specificity it won. A column gap cannot be overridden by the
     child. */
  const rollBlock = bare.indexOf(".industries-roll {");
  const rollRule = bare.slice(rollBlock, bare.indexOf("\n}", rollBlock));
  assert.match(rollRule, /flex-direction:\s*column/);
  assert.match(rollRule, /gap:\s*clamp\(5rem, 13vh, 9rem\)/);
  const way = bare.indexOf(".industries-explore {");
  assert.doesNotMatch(bare.slice(way, bare.indexOf("\n}", way)), /margin-top/);

  const lit = bare.indexOf(".industries-layout:has(");
  assert.ok(lit > 0, "there is no lit state");
  const rule = bare.slice(lit, bare.indexOf("\n}", lit));
  assert.match(rule, /background-size:\s*100% 0\.07em/);
  /* Full ink, which is the other half of what hovering adds to the words. */
  assert.match(rule, /color:\s*var\(--ink\)/);
  assert.doesNotMatch(rule, /opacity/);

  /* **The names rest in ink and take their tint on hover** — owner, 2026-08-27:
     black, and on hover change to the specific colour. They rested in the muted
     grey and went to ink before that.

     ⚠ His call, made after the numbers. The names are about 17px, where AA asks
     4.5:1 — the large-text 3:1 does not apply until 24 — and as type on the
     canvas only Finance clears it: 4.94, then Retail 2.56, Public Sector 2.43,
     Logistics 1.97, Automotive 1.84, Healthcare 1.68, Manufacturing 1.41.

     What keeps it defensible: the tint is a hover state, the name is fully black
     at rest, and nothing is available only in colour — the words it lights go to
     ink at the same moment. */
  const named = bare.indexOf(".industries-layout:has(", bare.indexOf("\n}", lit));
  assert.ok(named > 0, "the names do not light");
  const nameRule = bare.slice(named, bare.indexOf("\n}", named));
  assert.match(nameRule, /color:\s*var\(--sector\)/);
  assert.doesNotMatch(nameRule, /background-size/);

  const keyRest = bare.indexOf(".industries-key {");
  assert.match(
    bare.slice(keyRest, bare.indexOf("\n}", keyRest)),
    /color:\s*var\(--ink\)/,
  );

  /* **Either end lights the pair.** Owner, 2026-08-27: hovering the run should
     activate its part the way hovering the name does. So a sector answers to a
     pointer on its name OR on any of its words, and the name and the words
     respond together — the legend is a second entrance rather than the only
     one.

     All seven name themselves twice, and both halves are checked: a sector
     missing its `[data-sector]:hover` condition lights only from the legend,
     which is the state this replaced and looks identical from a screenshot. */
  for (const sector of [
    "finance",
    "healthcare",
    "manufacturing",
    "automotive",
    "retail",
    "logistics",
    "public-sector",
  ]) {
    assert.ok(
      rule.includes(`:has([data-key="${sector}"]:hover, [data-sector="${sector}"]:hover)`),
      `${sector} does not light from both ends`,
    );
    assert.ok(
      rule.includes(`.industries-who[data-sector="${sector}"]`),
      `${sector} does not light its words`,
    );
    assert.ok(
      nameRule.includes(`.industries-key[data-key="${sector}"]`) &&
        nameRule.includes(`:has([data-key="${sector}"]:hover, [data-sector="${sector}"]:hover)`),
      `${sector} does not light its name from both ends`,
    );
  }

  /* **Ragged, not justified.** The design this came from justified the run and
     at this size it opened word gaps wide enough to read as columns of their
     own. Justification spreads slack across word spaces, and two- and
     three-word noun phrases at 2rem have almost none to spread it over. */
  const run = bare.indexOf(".industries-run {");
  assert.ok(run > 0, "the run has no rule");
  const runRule = bare.slice(run, bare.indexOf("\n}", run));
  assert.doesNotMatch(runRule, /text-align/);

  /* **23em, and the number is the difference between the design and the build.**

     The first build gave the run the whole two-column block — 1,147px at a 1808
     window, which is 34em of this face: six long lines, and a block wider than
     it is tall. Measured in the real face at this tracking, the twenty-five
     phrases and their separators are 183.1em end to end, so:

         20em   11 lines
         23em   10 lines      <- the design
         26em    9 lines
         30em    7 lines
         34em    6 lines      <- what shipped first

     Same type size in both. The measure is the whole of what made one read as a
     statement and the other as a caption. In `em`, so the line count holds at
     every size rather than re-breaking as the clamp grows. */
  assert.match(runRule, /max-width:\s*26em/);
  /* **2.44vw is the type scaled to the column, not the column shrunk to the
     type.** The run takes about 63% of the window and 26em of it is 2.44
     hundredths — 29.3px in a 743px column at 1200, 44.1px in an 1,147px column
     at 1808. The version before this one capped the measure at 23em and left the
     type at 34px, which gave the design's measure and none of its proportion: a
     792px strip inside an 1,147px column with dead space beside it. */
  assert.match(runRule, /font-size:\s*clamp\(1\.25rem, 2\.44vw, 3rem\)/);

  /* And a phrase never breaks across two lines above the phone: these are names
     for kinds of organisation, and `financial service providers` split over
     three lines reads as three fragments. */
  const nowrap = bare.indexOf("@media (min-width: 48rem)");
  assert.ok(nowrap > 0, "the phrases can break anywhere");
  assert.match(bare.slice(nowrap, nowrap + 200), /\.industries-who \{\s*white-space: nowrap/);

  /* **A colour per sector, set once for the dot and the words together.** The
     first build gave every dot one neutral and lit every phrase in one accent,
     which is a legend promising a colour the highlight does not deliver.

     Six of the seven already existed — `--accent` and the five tint bars — and
     `--sector-public` is the only new value. Asserted as PAIRS: a mapping that
     names the key without the words, or the words without the key, is a sector
     whose dot and underline disagree. */
  const sectors = {
    finance: "var(--accent)",
    healthcare: "var(--tint-mint-bar)",
    manufacturing: "var(--tint-butter-bar)",
    automotive: "var(--tint-sky-bar)",
    retail: "var(--tint-clay-bar)",
    logistics: "var(--tint-red-bar)",
    "public-sector": "var(--sector-public)",
  };
  for (const [sector, colour] of Object.entries(sectors)) {
    const pair = new RegExp(
      `\\.industries-key\\[data-key="${sector}"\\],\\s*\\n\\s*\\.industries-who\\[data-sector="${sector}"\\] \\{\\s*--sector: ${colour.replace(/[()\-]/g, "\\$&")};`,
    );
    assert.match(bare, pair, `${sector} does not map its key and its words to one colour`);
  }
  assert.match(bare, /--sector-public:\s*#4fb98a/);

  /* **Nothing beside the names.** They were dots, then short rules, and the
     owner took the mark off entirely on 2026-08-27: on hover, change the colour
     of the text and nothing else. Asserted as an absence in both the stylesheet
     and the markup, because the temptation on the next pass is to put a mark
     back to carry the sector's colour. */
  assert.ok(bare.indexOf(".industries-key__dot") === -1, "the legend still has a mark");

  /* And the colour it changes to is `--ink`, not the sector's own. The tints are
     drawn to be a ground or a rule and several are unreadable as type — butter
     measures 1.33:1 on the canvas, so `Manufacturing` would vanish at the moment
     it was pointed at. The tint stays where it works, under the words. */
  assert.match(rule, /color:\s*var\(--ink\)/);

  /* The section sits on the page's three columns, with the roll where the
     Fusion statement and the Why boxes start. */
  const layout = bare.indexOf(".industries-layout {");
  const grid = bare.slice(layout, bare.indexOf("\n}", layout));
  assert.match(grid, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(grid, /gap:\s*var\(--column-gap\)/);
  const roll = bare.indexOf(".industries-roll {");
  assert.match(bare.slice(roll, bare.indexOf("}", roll)), /grid-column:\s*2 \/ -1/);
});

test("selected work is five pictures, scattered, under covers", async () => {
  const html = await (await render("/")).text();
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const at = main.indexOf('class="work-section"');
  assert.ok(at > 0, "the selected work section is not on the page");
  const section = main.slice(at, main.indexOf("</section>", at));

  /* ⚠ **THE FIVE NAMES ON THE HOMEPAGE ARE INVENTED AND MUST NOT SHIP.**

     The same assertion the Clients page carries over the same eight, and it is
     here for the one thing that page does not have: this is the front door.
     Clients is a page a reader chooses to open; the homepage is the one they
     land on. None of these is a company Mardal has worked for. The real archive
     is in PRODUCT.md, behind a naming decision nobody has made.

     Delete this in the same commit that puts real names in — and note it will
     not go quietly: `content/home.ts` slices these off `clientEntries`, so the
     Clients page's assertion and this one fail together, which is the point. */
  assert.deepEqual(
    [...section.matchAll(/<p class="work-piece__name">([^<]*)</g)].map((m) => m[1]),
    ["Nordvik", "Alturi", "Solvei", "Marren", "Brekk"],
  );
  /* **Under each name, three facts — owner, 2026-09-30, from his own portfolio's
     featured work:** industry, service and place, one to a line, in that order.
     Read off the same entries as the names, so they are as invented as the
     names and go when they go. Every discipline an entry lists is on its
     service line, because the Clients rail files it under each of them. */
  assert.deepEqual(
    [...section.matchAll(/<li class="work-piece">([\s\S]*?)<\/li>/g)].map((piece) =>
      [
        ...piece[1].matchAll(
          /<p class="work-piece__(name|industry|service|location)">([^<]*)<\/p>/g,
        ),
      ].map((m) => `${m[1]}: ${m[2]}`),
    ),
    [
      ["name: Nordvik", "industry: Finance", "service: UX/UI Design, Branding, Websites", "location: Switzerland"],
      ["name: Alturi", "industry: Finance", "service: Software, CRM", "location: Germany"],
      ["name: Solvei", "industry: Healthcare", "service: UX/UI Design, Websites", "location: Switzerland"],
      ["name: Marren", "industry: Healthcare", "service: Applications, Software", "location: Austria"],
      ["name: Brekk", "industry: Manufacturing", "service: Software, AI &amp; Automation", "location: Germany"],
    ],
  );

  /* ⚠ **AND THE FIVE PICTURES ARE STOCK, ON A THIRD PARTY'S SERVER.** The same
     guard the Clients index carries over its eight, for the same reason and now
     on the page that matters most: stock photography is on this site's rejected
     list, every one of these frames is of something with nothing to do with the
     work, and it is a live request to picsum.photos on every plate. Delete it in
     the commit that puts real screenshots in.

     Counted as five DISTINCT seeds, not five matches: this route is
     server-rendered, so the RSC payload after the markup repeats every `src`. */
  const seeds = new Set(
    [...section.matchAll(/https:\/\/picsum\.photos\/seed\/([a-z0-9-]+)/g)].map(
      (m) => m[1],
    ),
  );
  assert.equal(seeds.size, 5);

  /* Decorative, so every one of them is silent to a screen reader — describing a
     placeholder to somebody is worse than saying nothing. And every one carries
     its intrinsic size, so the scatter does not move as the frames land. */
  assert.equal((section.match(/class="work-piece__art"/g) ?? []).length, 5);
  assert.doesNotMatch(section, /class="work-piece__art"[^>]*alt="[^"]+"/);
  assert.equal(
    (section.match(/class="work-piece__art"[^>]*width="640" height="360"/g) ?? []).length,
    5,
  );

  /* **The finished state is what is server-rendered.** Every cover is an empty
     span the stylesheet leaves collapsed, and `WorkReveal` is what puts them on
     before taking them off. So this asserts the thing a reader without
     JavaScript gets: five pictures, and five covers that show nothing. A reveal
     that hid the pictures in the markup would pass every other assertion in this
     file and ship a blank section to anyone whose script never arrived. */
  assert.equal(
    (section.match(/class="work-piece__cover" aria-hidden="true" data-work-cover/g) ?? [])
      .length,
    5,
  );

  /* Little text, which is what was asked for: one label, and four short lines
     under each picture. The
     label heads the section rather than captioning it, so it is the `h2` the
     section is named by — and it is the Clients rail's own two words, so a
     reader who follows this through meets the phrase it promised. */
  assert.match(section, /<h2 class="work-title" id="work-title">Selected work<\/h2>/);
  assert.match(section, /aria-labelledby="work-title"/);

  /* **Every piece opens something, and the plus is why that is not optional.**

     Owner, 2026-08-27: the same hover as the Clients card — the picture darkens
     and a cross is drawn on it. That treatment is written in the stylesheet for
     `[data-opens]`/`[data-opens-mark]` and the note over it is explicit that it
     belongs only to a card that goes somewhere: a plus under the pointer on a
     card answering with an empty page is the promise this site refuses. So this
     asserts the pair — five links, and the two hooks on every one of them.

     Five anchors and no more: the section has no CTA of its own, because the
     pieces ARE the way through and `Explore All` sits immediately above them. */
  const links = [...section.matchAll(/<a ([^>]*)>/g)].map((m) => m[1]);
  assert.equal(links.length, 5);
  for (const attrs of links) {
    assert.match(attrs, /class="work-piece__link"/);
    /* `data-opens` is written bare in JSX and React renders it `="true"`, which
       is the same string the Clients card produces from `"true"`. Matched with
       the `=` so it cannot be satisfied by `data-opens-mark` instead. */
    assert.match(attrs, /\sdata-opens="true"/, `a piece opens nothing: ${attrs}`);
  }
  assert.equal((section.match(/class="work-piece__plate" data-opens-mark/g) ?? []).length, 5);

  /* **The one with a story goes to the story; the other four go to the index.**
     Not to a page nobody has written — that is the one thing the Clients index
     refuses for its own seven, and the refusal is the same here. Asserted as a
     shape rather than as five strings so a second story landing does not fail
     this, only a piece pointed at nothing would. */
  const hrefs = links.map((attrs) => attrs.match(/href="([^"]*)"/)[1]);
  assert.equal(hrefs.filter((href) => href === "/case-studies").length, 4);
  assert.deepEqual(
    hrefs.filter((href) => href !== "/case-studies"),
    ["/case-studies/healthcare-office-website"],
  );

  /* The link is named by the company, because the name is INSIDE it. The Clients
     card wraps the plate alone and has to carry an `aria-label` for that reason;
     an anchor here whose only content was an image with an empty alt would
     announce itself as "link" with nothing to say. */
  assert.doesNotMatch(section, /<a [^>]*class="work-piece__link"[^>]*aria-label/);
  assert.equal((section.match(/<p class="work-piece__name">/g) ?? []).length, 5);

  /* No bracket reached the page — the one failure mode a placeholder list has
     that is worse than the placeholders. */
  assert.doesNotMatch(section, /\[Client|\[Project|\[Location\]/);
});
