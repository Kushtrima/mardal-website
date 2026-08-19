/**
 * Careers, and the three roles on it.
 *
 * The first of the unwritten pages to be written, so this file is also the
 * assertion that it left them: /careers must no longer be the placeholder, and
 * the placeholder suite's table is one shorter for it.
 *
 * The load-bearing test here is the last one. PRODUCT.md's first house rule is
 * never invent facts, and a careers page is the single easiest place on a site
 * to break it — salary, team size, seniority, start dates and benefits are all
 * things a listing is expected to carry and none of them has been supplied.
 * The page carries two facts per role because two were given. That is asserted
 * rather than trusted to whoever edits the copy next.
 *
 * Asserted against the rendered HTML, and the copy written out rather than
 * imported: a test that reads the same module the page reads asserts only that
 * a file equals itself.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

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

/**
 * The markup alone, with the RSC payload stripped out.
 *
 * The response is the page followed by the flight data that rebuilds it, and
 * the payload is not prose — it is full of React's own `"$"` markers, so a
 * check for a currency symbol matched the framework rather than the copy.
 * Every "this must not appear" assertion below reads this instead of the whole
 * response.
 */
const markup = (html) => html.replace(/<script[\s\S]*?<\/script>/g, "");

const roles = [
  { id: "ux-ui-designer", title: "UX/UI Designer" },
  { id: "ai-specialist", title: "AI Specialist" },
  { id: "front-end-developer", title: "Front-End Developer" },
];

test("Careers is a written page now, not a placeholder", async () => {
  const response = await render("/careers");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Careers — Mardal<\/title>/i);

  /* It rendered PlaceholderPage until today. Both halves of that page are
     checked, because either one surviving would mean the route did not
     actually change hands. */
  assert.doesNotMatch(html, />Working</, "/careers is still the placeholder");
  assert.doesNotMatch(html, /service-hero__eyebrow/, "/careers is still the placeholder");

  assert.match(html, /class="service-hero__title"/);
  assert.match(html, />Great work starts</);
  assert.match(html, />with the right team\.</);
  /* Both lines this replaced, asserted absent. Each was a statement about what
     Mardal makes on the page a reader came to for what it is like to work
     there, and each was written before the other was rejected — so the pull
     back towards them is real and worth a guard. */
  assert.doesNotMatch(html, /Build the systems/);
  assert.doesNotMatch(html, /Build software/);
  assert.match(html, /Three roles are open\./);

  /* The hero's way out goes down the page rather than off it — every other
     hero here ends on an email and it is the wrong ending for this one. */
  assert.match(html, /href="#roles"/);
  assert.match(html, />See the roles/);
  assert.match(html, /id="roles"/);

  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});

test("the Careers opening is sized by two rules that meet", () => {
  /* Owner asked for it bigger, twice — once for the page and once for a phone —
     and the second ask is why this page carries two font-size rules where the
     rest of the site carries one clamp and no breakpoint override.

     The reason is the copy. `with the right team.` is 6.505em, and a 320px
     window leaves a 288px column, so holding the authored break caps the
     heading at 44px however much room the page has. Below 48rem the break is
     given up, the spans go inline, and the browser balances the sentence — the
     longest WORD is 1.851em, so the ceiling there is 155px rather than 44. */
  const sized = [...CSS.matchAll(
    /\.service-page--careers \.service-hero__title \{([^}]*)\}/g,
  )].filter((match) => /font-size/.test(match[1]));

  assert.equal(
    sized.length,
    2,
    `the Careers opening is sized by ${sized.length} rules; it should be one for a phone and one above`,
  );

  const clamps = sized.map((m) => {
    const c = m[1].match(/clamp\(([\d.]+)rem,\s*([\d.]+)vw,\s*([\d.]+)rem\)/);
    assert.ok(c, "a Careers title rule is not sized with a clamp");
    return { floorRem: +c[1], slopeVw: +c[2], ceilRem: +c[3] };
  });

  /* Ordered by where they appear: the page rule first, the phone rule inside
     the 48rem query below it. */
  const [page, phone] = clamps;
  assert.deepEqual(page, { floorRem: 2.25, slopeVw: 9.4, ceilRem: 6.5 });
  assert.deepEqual(phone, { floorRem: 3.5, slopeVw: 17, ceilRem: 4.5 });

  /* ★ The invariant, and the bug it was written for: the two must MEET.

     The phone rule tops out at its ceiling well before 768px, so the heading is
     at `phone.ceilRem` when the page rule takes over one pixel later — and the
     page rule opens at `slope × 7.69`. At 7.2vw that was 55px against 72, so
     the heading stepped backwards by 17px crossing its own breakpoint, which
     reads as the page shrinking as the window grows. */
  const BREAKPOINT_PX = 769;
  const phoneEndsAt = phone.ceilRem * 16;
  const pageStartsAt = (page.slopeVw * BREAKPOINT_PX) / 100;
  assert.ok(
    pageStartsAt >= phoneEndsAt,
    `the heading is ${phoneEndsAt}px at 768 and ${pageStartsAt.toFixed(1)}px at 769 — it steps backwards crossing its own breakpoint`,
  );

  /* Neither rule may put a line past its column. The page rule is bounded by
     the authored break at 6.505em; the phone rule by the longest word, since
     the sentence is balanced there rather than broken. Both checked in the
     browser across twelve widths from 320 to 1440 — nothing overflows, and the
     tightest is 320px with 22px spare. */
  const LONGEST_AUTHORED_EM = 6.505;
  const COLUMN_AT_769 = 707;
  assert.ok(
    pageStartsAt * LONGEST_AUTHORED_EM < COLUMN_AT_769,
    "the page rule opens wider than the column it opens into",
  );

  /* And the reason it can be this large at all: no artwork, so the intro takes
     the whole column instead of the eight of twelve that keeps a heading clear
     of a 30rem pattern. Without it the heading read at 544px on a 1024 window
     with 944 standing empty beside it. */
  assert.match(
    CSS,
    /\.service-page--careers \.service-hero__intro \{\s*grid-column: 1 \/ -1;/,
    "the Careers hero reserves room for artwork it does not have",
  );

  /* The phone fix that belongs with the aside rules and was not copied with
     them. `grid-column: 7 / -1` on a two-column phone grid builds five implicit
     columns, and their gaps take the width out of the heading beside them —
     Clients found this and carries the override; the pages that inherited its
     aside inherited the bug. Measured at 320: the intro was 224px of a 288px
     row before, and is the whole 288 after. */
  assert.match(
    CSS,
    /\.service-page--clients \.service-hero__aside,\s*\.service-page--placeholder \.service-hero__aside,\s*\.service-page--careers \.service-hero__aside \{\s*grid-column: 1 \/ -1;/,
    "the pages sharing the Clients aside do not share its phone fix, so their headings lose width to implicit columns",
  );

  /* The phone rule only works if the two spans are separated. They are rendered
     adjacent, which is invisible while they are blocks and reads `startswith`
     the moment they are inline — and a `::after { content: " " }` version of
     this shipped joined with every measurement passing, because pseudo-element
     content is not in `textContent`. The space is a real text node now. */
  assert.match(
    CSS,
    /\.service-page--careers \.service-hero__title-line \{\s*display: inline;/,
    "the phone rule no longer sets the spans inline",
  );

  /* ── The foot of the hero on a phone ──

     Owner: put the support line on the right and lift it off the bottom. Both
     were consequences of the base phone rule, which pins the support to the
     bottom-LEFT and the way in to the bottom-RIGHT — a pair that frames the
     artwork standing between them on a service page, and simply sits in
     opposite corners on a hero that has none.

     `position: static` is the whole of the fix and the one line that would be
     lost first: without it the two are still absolute and everything else here
     is inert. Measured across six phone widths — both flush right, the
     sentence over the way in, 57px off the bottom of the hero. */
  /* Every rule in the stylesheet as { selector, body }, so a rule can be found
     by what it declares. Matching `[^}]*` back from a declaration finds
     whatever block happened to precede it — there are eight `position: static`
     in this file and the first attempt at this reported the wrong one. */
  const rules = [...CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
    selector: m[1],
    body: m[2],
  }));

  const phoneFoot = rules.find(
    (r) => /position: static/.test(r.body) && /service-hero__support/.test(r.selector),
  );
  assert.ok(phoneFoot, "no hero foot is brought back into flow on a phone");

  /* All three families, not just the one the owner was looking at. The rule is
     shared, and so was the bug: measured at 320px before the fix, the sentence
     ended at 894px while the link began at 880 — on /case-studies, on every
     sector route, and on all eleven unwritten pages. Only the Blog escaped, and
     only because it does not use this aside.

     `position: static` is the line that would be lost first. Without it the two
     are still absolute and everything else here is inert. */
  for (const family of ["clients", "placeholder", "careers"]) {
    for (const part of ["support", "cta"]) {
      assert.match(
        phoneFoot.selector,
        new RegExp(`\\.service-page--${family} \\.service-hero__${part}\\b`),
        `--${family} heroes leave their ${part} absolute on a phone, where it overlaps the other`,
      );
    }
  }

  /* And the way in ends on the same edge as the sentence. The shared rule sets
     `align-self: flex-start`, which is right on a desktop where the block is
     wide and the two make a corner — on a phone it left the link floating 74 to
     95px inside an edge everything else met. */
  const edge = rules.find(
    (r) => /align-self: flex-end/.test(r.body) && /service-hero__cta/.test(r.selector),
  );
  assert.ok(edge, "nothing puts the way in on the edge on a phone");
  for (const family of ["clients", "placeholder", "careers"]) {
    assert.match(
      edge.selector,
      new RegExp(`\\.service-page--${family} \\.service-hero__cta\\b`),
      `on --${family} the way in does not end on the same edge as the sentence`,
    );
  }
});

test("three roles, each one a record and each one an address", async () => {
  const html = await (await render("/careers")).text();

  assert.equal(
    (html.match(/class="role"/g) ?? []).length,
    roles.length,
    "the page is not showing three roles",
  );

  for (const role of roles) {
    assert.match(
      html,
      new RegExp(`class="role" id="${role.id}"|id="${role.id}"[^>]*class="role"`),
      `${role.title} cannot be linked to`,
    );
    assert.match(
      html,
      new RegExp(`class="role__title">${role.title.replace("/", "/")}<`),
      `${role.title} is not on the page`,
    );

    /* The row opens the role. It used to open an email, which asked someone to
       write an application before they had read what they were applying for. */
    assert.match(
      html,
      new RegExp(`href="/careers/${role.id}"`),
      `${role.title} does not open`,
    );
  }

  /* Ruled rows, not cards. A card grid is one of this site's standing
     rejections, and the arrangement is the reason the rules are there. */
  assert.match(html, /class="role-list"/);
  assert.equal((html.match(/class="role__more"/g) ?? []).length, 3);

  /* The whole row is the link rather than the title alone — two targets for one
     destination and the smaller one is the one people miss. Which also means
     nothing inside it may be an anchor of its own: an `a` inside an `a` is not
     markup a browser can make sense of. */
  assert.doesNotMatch(html, /<a[^>]*class="role"[^>]*>(?:(?!<\/a>)[\s\S])*?<a[\s>]/);

  /* The house rules, as everywhere else. */
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<(section|div|p|h[1-6]|article|li|a|span)[^>]* style="/);
});

test("the page states the two facts it was given and invents none", async () => {
  const html = await (await render("/careers")).text();

  /* Given by the owner: hybrid, Gjilan or remote. Three roles, so three of
     each label — a fact appearing twice would mean a role lost one. */
  assert.equal((html.match(/>Location</g) ?? []).length, 3);
  assert.equal((html.match(/>Gjilan or remote</g) ?? []).length, 3);

  /* NOT given: the hours. It stands as an unfilled bracket, which is
     PRODUCT.md's stated answer to a fact nobody has supplied — and it is
     asserted so that filling it in is a decision rather than a drive-by. */
  assert.equal((html.match(/>Commitment</g) ?? []).length, 3);
  /* Matched as the `dd` it is rendered as, not as the bare string. The
     response carries the RSC payload after the markup, so anything without an
     angle bracket to anchor on is counted twice — this read 6 for 3 roles. */
  assert.equal(
    (html.match(/<dd>\[Full-time \/ part-time\]<\/dd>/g) ?? []).length,
    3,
  );

  /* And the ones that must never appear until somebody supplies them. Every
     item here is a thing a careers page is expected to carry and this company
     has not published: salary, seniority, team size, a start date. The page is
     shorter for their absence and that is the correct trade. */
  const prose = markup(html);

  for (const invented of [
    /salary/i,
    /€|\$|EUR|CHF/,
    /\byears? of experience\b/i,
    /\b(junior|senior|mid-level)\b/i,
    /\bteam of \d/i,
    /\bstart date\b/i,
    /\bbenefits\b/i,
  ]) {
    assert.doesNotMatch(prose, invented, `/careers states something unsupplied: ${invented}`);
  }
});
