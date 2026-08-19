/**
 * The eleven pages that exist as an address before they exist as writing.
 *
 * Every word in the header and the footer used to promise a page; four of them
 * pointed at nothing at all and five only scrolled the homepage, which from any
 * other page meant nothing happened. Each one is a route now, and behind it a
 * page that says so.
 *
 * Twelve until 2026-08-19, when Careers was written and left the set. The row
 * for it came out of the table below and tests/careers.test.mjs took over —
 * a page graduating out of here is the point of the arrangement, and the count
 * moving is how it is noticed.
 *
 * The copy is written out here rather than imported from
 * `content/placeholders.ts`, deliberately: a test that reads the same module
 * the page reads asserts only that a file equals itself. These are the strings
 * a reader receives, and changing one of them has to be a decision made twice.
 *
 * Asserted against the rendered HTML for the same reason every other page test
 * here is — `next dev` and the worker these tests load do not agree on the
 * order they write attributes in, so nothing below matches a whole tag.
 */

import assert from "node:assert/strict";
import test from "node:test";

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const literal = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Route, the name it is given, what it says it will hold, and the way out. */
const pages = [
  {
    path: "/products",
    label: "Products",
    support: "The products we are building for ourselves.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  {
    path: "/products/arvena-ai",
    label: "Arvena AI",
    support: "Applied AI for mental-health support.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  {
    path: "/products/ftesa",
    label: "Ftesa.co",
    support: "Digital invitations, personal to every guest.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  {
    path: "/products/ihrauto",
    label: "Ihrauto",
    support: "Workshop operations, from booking to invoice.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  {
    path: "/services",
    label: "Services",
    support: "The five ways we work, gathered in one place.",
    cta: "See a service page",
    ctaHref: "/services/ai-automation",
  },
  {
    path: "/company",
    label: "Company",
    support: "Who we are and how we work.",
    cta: "Why Mardal",
    ctaHref: "/#company",
  },
  {
    path: "/about",
    label: "About",
    support: "The people and the thinking behind the work.",
    cta: "Why Mardal",
    ctaHref: "/#company",
  },
  {
    path: "/contact",
    label: "Contact",
    support: "Email, phone and address are in the footer.",
    cta: "Get in touch",
    ctaHref: "mailto:info@mardal.co",
  },
  {
    path: "/privacy",
    label: "Privacy",
    support: "How personal data is handled here.",
    cta: "Get in touch",
    ctaHref: "mailto:info@mardal.co",
  },
  {
    path: "/terms",
    label: "Terms",
    support: "The terms this site is used under.",
    cta: "Get in touch",
    ctaHref: "mailto:info@mardal.co",
  },
  {
    path: "/cookies",
    label: "Cookies",
    support: "What this site stores, and why.",
    cta: "Get in touch",
    ctaHref: "mailto:info@mardal.co",
  },
];

test("every unwritten page is a page", async () => {
  for (const page of pages) {
    const response = await render(page.path);
    assert.equal(response.status, 200, `${page.path} does not render`);

    const html = await response.text();

    /* Named in the tab and named on the page. The root layout completes the
       title as "%s — Mardal"; the eyebrow is the only thing on the page that
       tells the twelve apart, so a page that lost it would be indistinguishable
       from the other eleven and would still pass everything below. */
    assert.match(
      html,
      new RegExp(`<title>${literal(page.label)} — Mardal</title>`, "i"),
      `${page.path} has the wrong title`,
    );
    assert.match(
      html,
      new RegExp(`service-hero__eyebrow[^>]*>\\s*${literal(page.label)}\\s*<`),
      `${page.path} does not name itself`,
    );

    /* And arrives with the heading rather than sitting there ahead of it. The
       hook is the whole of that — ServicePageEntry moves what it is given, and
       this is the only hero on the site that gives it an eyebrow, so nothing
       else would catch its loss. */
    assert.match(
      html,
      /data-service-hero-eyebrow="true"/,
      `${page.path} names itself before the page arrives`,
    );

    /* The heading, which is the whole point of the page and is the same on all
       twelve. Two hand-broken lines, matched as the spans they are written as
       rather than as one string, since nothing joins them in the markup. */
    assert.match(html, />Working</, `${page.path} does not say it`);
    assert.match(html, />on it\.</, `${page.path} does not say it`);

    assert.match(
      html,
      new RegExp(literal(page.support)),
      `${page.path} does not say what it will hold`,
    );

    /* The way out, and the reason the page is worth having: a reader who
       wanted Products has been given nothing unless they are also told where
       the products are today. Both halves checked — a label with no href is a
       dead end and an href with no label cannot be read. */
    assert.match(html, new RegExp(`>${literal(page.cta)}`), `${page.path} has no way out`);
    assert.match(
      html,
      new RegExp(`href="${literal(page.ctaHref)}"`),
      `${page.path} points nowhere`,
    );

    /* The house rules, on every one of them: one h1, and no element carrying a
       style attribute. Both are asserted for the homepage already; a page
       template rendered twelve times is exactly where a breach would spread. */
    assert.equal(
      (html.match(/<h1[\s>]/g) ?? []).length,
      1,
      `${page.path} has the wrong number of h1s`,
    );
    assert.doesNotMatch(
      html,
      /<(section|div|p|h[1-6]|article|li|a|span)[^>]* style="/,
      `${page.path} carries an inline style`,
    );

    assert.match(html, /class="site-nav"/, `${page.path} has no header`);
    assert.match(html, /<footer class="site-footer"/, `${page.path} has no footer`);
  }
});

test("the unwritten heroes carry no artwork", async () => {
  /* Owner's call, looking at Products and Company: the redaction bars come out.

     They were not arbitrary — everywhere else on this site that drawing is
     decoration standing in for writing, and on these twelve it stood in for
     writing that is genuinely not there, which is the one place the motif is
     literal. That is exactly why this is asserted rather than left to whoever
     reads the component next: it is a decision that reads as an omission.

     Checked on all of them, because the pull is to put it back on the ones the
     owner did not name. */
  for (const page of pages) {
    const html = await (await render(page.path)).text();

    assert.doesNotMatch(
      html,
      /service-hero__pattern/,
      `${page.path} has artwork in its hero again`,
    );
    assert.doesNotMatch(
      html,
      /service-hero__lines|viewBox="0 \d+ 716 336"/,
      `${page.path} is drawing the redaction bars again`,
    );

    /* And what replaced it. The support line and the way in were the two ends
       of the hero's bottom row, which only reads as an arrangement while there
       is a drawing between them — the same thing Clients found when its plate
       came out, which is why both pages now share these rules. Losing the block
       would put them back at opposite edges of an empty row and nothing above
       would notice. */
    assert.match(
      html,
      /class="service-hero__aside"/,
      `${page.path} leaves its foot at two opposite edges`,
    );
  }
});

test("no link on the site points at an anchor its page has not got", async () => {
  /* The state this whole change exists to reach. Before it, `#privacy` and
     `#careers` resolved nowhere at all, and `#products`, `#company` and the
     three product anchors resolved only on the homepage — read from the Blog or
     a service page they were dead too, which is the failure this catches and a
     count of links never would.

     Checked on a page from each family, since the header and the footer are the
     same on all of them and a dead anchor in either would show up on any. */
  for (const path of ["/", "/privacy", "/blog", "/case-studies", "/services/ai-automation"]) {
    const html = await (await render(path)).text();
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
    const dead = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]))]
      .filter((anchor) => !ids.has(anchor));

    assert.deepEqual(dead, [], `${path} links to #${dead.join(", #")}`);
  }
});
