/**
 * A role, opened — and the endpoint that receives an application for it.
 *
 * Two things are asserted here that nothing else on this site needs. The first
 * is that these pages are pinned rather than stuck: `position: sticky` cannot
 * hold the rail on a page ScrollSmoother is translating, and a stylesheet that
 * quietly grew a `sticky` would look right in a browser with JavaScript off and
 * wrong in every real one. The second is the apply endpoint, which is the only
 * thing on this site that takes something in — so it is the only thing here
 * that can be handed a file it should refuse.
 *
 * The endpoint is exercised through the worker rather than by importing the
 * handler, because the binding it reads is handed down by `worker/index.ts` on
 * the way past (see lib/worker-env.ts). Passing a `CV` in the env is therefore
 * both how a bucket is faked and how the real path is proved.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

/** Top-level `@media` blocks, as { condition, body } — the same walk
 *  reduced-motion.test.mjs does, and for the same reason: a rule's meaning here
 *  is the query it is written inside, which no substring search recovers. */
function mediaBlocks(css) {
  const blocks = [];
  let depth = 0;
  let current = null;

  for (const line of css.split("\n")) {
    const trimmed = line.trim();

    if (depth === 0 && trimmed.startsWith("@media")) {
      current = {
        condition: trimmed.replace(/^@media\s*/, "").replace(/\s*\{\s*$/, ""),
        body: [],
      };
    } else if (current) {
      current.body.push(line);
    }

    depth += (line.match(/\{/g) ?? []).length;
    depth -= (line.match(/\}/g) ?? []).length;

    if (depth === 0 && current) {
      current.body = current.body.join("\n");
      blocks.push(current);
      current = null;
    }
  }

  return blocks;
}

async function fetchWorker(path, init = {}, env = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, init),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      ...env,
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const render = (path) => fetchWorker(path, { headers: { accept: "text/html" } });

const roles = [
  { id: "ux-ui-designer", title: "UX/UI Designer" },
  { id: "ai-specialist", title: "AI Specialist" },
  { id: "front-end-developer", title: "Front-End Developer" },
];

test("every role opens onto a page of its own", async () => {
  for (const role of roles) {
    const response = await render(`/careers/${role.id}`);
    assert.equal(response.status, 200, `/careers/${role.id} does not render`);

    const html = await response.text();

    assert.match(
      html,
      new RegExp(`<title>${role.title} — Careers — Mardal</title>`, "i"),
      `${role.title} has the wrong title`,
    );

    /* The rail: what a reader has to keep while going down the page. The role's
       name is the page's one h1 — there is no hero above it, which is what
       makes the rail the opening rather than a caption. */
    assert.match(html, /class="role-page__rail"/, `${role.title} has no rail`);
    assert.match(
      html,
      new RegExp(`class="role-page__title" id="role-title">${role.title}<`),
      `${role.title} is not named in its rail`,
    );
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);

    /* The same two facts the list carries, and still only two. */
    assert.equal((html.match(/class="role__fact"/g) ?? []).length, 2);
    assert.match(html, />Gjilan or remote</);
    assert.match(html, /<dd>\[Full-time \/ part-time\]<\/dd>/);

    /* The writing, and the section that is about the company rather than the
       role — written once in the content and read by all three. */
    assert.match(html, /class="role-page__body"/);
    assert.match(html, /id="role-the-work"/, `${role.title} does not say what the work is`);
    assert.match(html, /id="role-what-you-bring"/);
    assert.match(html, /id="role-how-we-work"/);
    assert.match(html, /English is the working language/);

    /* There was an "Open roles" link above the rail. The owner deleted it, and
       its absence is load-bearing rather than incidental: it sat inside the
       rail and pushed the role's name a line below the sentence beside it,
       which is the misalignment he had asked to fix one change earlier. Put it
       back and that reopens.

       So the rail opens on the role's name with nothing before it, and the two
       columns start together because there is nothing to arrange. */
    assert.doesNotMatch(
      html,
      /role-page__back/,
      `${role.title} has the deleted back link again`,
    );
    assert.match(
      html,
      /class="role-page__rail"><h1 class="role-page__title"/,
      `${role.title} has something standing above its name, which drops the name below the writing beside it`,
    );

    assert.match(html, /class="site-nav"/);
    assert.doesNotMatch(html, /<(section|div|p|h[1-6]|article|li|a|span)[^>]* style="/);

    /* The rail's way in is an anchor down this same page, which is a new shape
       for this site — every other in-page link here is the header's or the
       footer's. The placeholder suite holds the same guard for the pages it
       covers and does not reach these, so it is repeated where it applies. */
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
    const dead = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]))]
      .filter((anchor) => !ids.has(anchor));
    assert.deepEqual(dead, [], `/careers/${role.id} links to #${dead.join(", #")}`);
  }

  /* Three roles are open. A fourth address is a wrong address, not a role with
     nothing in it — the same argument the sector routes are written on. */
  assert.equal((await render("/careers/nonsense")).status, 404);
  assert.equal((await render("/careers/apply")).status, 404);
});

test("the rail is pinned, not stuck", async () => {
  /* The finding this guards, in one line: ScrollSmoother moves the page by
     transforming its content inside a wrapper that is fixed and never scrolls,
     so `position: sticky` has no scrolling ancestor to measure against and
     simply travels away with everything else. ProductsPin hit it on the
     homepage first and says so in the same words.

     A `sticky` added to either of these two elements would look correct with
     JavaScript disabled and be wrong in every browser that runs the site. */
  for (const selector of ["role-page__rail", "role-page__layout"]) {
    const rule = CSS.slice(CSS.indexOf(`.${selector} {`));
    const body = rule.slice(0, rule.indexOf("}"));
    assert.doesNotMatch(
      body,
      /position:\s*sticky/,
      `.${selector} uses position: sticky, which cannot hold under ScrollSmoother`,
    );
  }

  /* And the pin exists at all. The rail holds still because a ScrollTrigger
     pins it, so the page that has no pin has a rail that scrolls away. */
  const pin = readFileSync(
    new URL("../components/careers/RolePin.tsx", import.meta.url),
    "utf8",
  );
  assert.match(pin, /pin: rail/);
  assert.match(pin, /pinSpacing: false/);

  /* The pin's width and the stylesheet's have to be the same number: pinned
     while the columns are side by side, torn down once they stack. They are
     written in two places because one is JavaScript and the other is CSS, so
     the pairing is the thing that can rot. */
  assert.match(pin, /TWO_COLUMN_MIN_PX = 64 \* 16/);
  /* Found by walking the top-level `@media` blocks rather than by slicing
     between two selectors — the first attempt cut at `.apply-form__grid`, which
     happens to be written above the query, so it was searching a region the
     rule was not in and failed while the CSS was correct. */
  const collapsing = mediaBlocks(CSS).filter((block) =>
    /\.role-page__layout \{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/.test(
      block.body,
    ),
  );

  assert.equal(
    collapsing.length,
    1,
    `expected exactly one query to stack the role columns, found ${collapsing.length}`,
  );
  /* Two columns and no rows. The name and the sentence are each the first thing
     in their own column, so they begin on the same line because nothing is
     above either — rows here would mean something had been put back over one
     of them. This spent one commit as three grid areas holding a place for the
     back link; deleting the link is the better version of the same fix. */
  const layout = CSS.slice(CSS.indexOf(".role-page__layout {"));
  assert.doesNotMatch(
    layout.slice(0, layout.indexOf("}")),
    /grid-template-rows/,
    "the role layout has rows again, which means something is standing above a column",
  );

  assert.match(
    collapsing[0].condition,
    /max-width:\s*64rem/,
    `the stylesheet stacks the role columns at "${collapsing[0].condition}" while the pin lets go at 64rem — between the two widths the rail scrolls away`,
  );
});

test("the form says which fields it needs, and does it in its own type", async () => {
  const html = await (await render("/careers/ai-specialist")).text();
  const form = html.slice(html.indexOf("<form"), html.indexOf("</form>"));

  /* Owner: "make this part more clear". It used to say "Only the first three
     are required" above the fields — which asks a reader to count, and goes
     wrong the moment a field is inserted anywhere but the end. Every field
     carries its own answer now. */
  assert.doesNotMatch(html, /only the first three/i);
  assert.equal(
    (form.match(/data-required="true"/g) ?? []).length,
    3,
    "the three required fields are not all marked",
  );
  assert.equal(
    (form.match(/data-required="false"/g) ?? []).length,
    2,
    "the two optional fields are not all marked",
  );

  /* The CV control was the browser's: `Choose File` in the browser's font at
     the browser's size, beside `No file chosen`, on a page that sets every
     other letter itself. */
  assert.match(form, /class="apply-file__button"/, "the file control is unstyled again");
  assert.match(form, />No file chosen yet</);

  /* And the part that is easy to get wrong while making it look right: the real
     input has to survive. Clipped by `.visually-hidden`, never `display: none`
     — which would take it off the keyboard along with the screen, and a file
     picker is one of the few controls a reader cannot work around. */
  assert.match(
    form,
    /class="visually-hidden apply-file__input"/,
    "the file input is no longer the clipped real one",
  );
  const hidden = CSS.slice(CSS.indexOf(".visually-hidden {"));
  assert.doesNotMatch(
    hidden.slice(0, hidden.indexOf("}")),
    /display:\s*none/,
    ".visually-hidden hides with display: none, which takes the file input off the keyboard",
  );
  /* Clipped means invisible, so the ring has to be drawn on the label instead
     or the control is reachable and gives no sign of it. */
  assert.match(CSS, /\.apply-file__input:focus-visible \+ \.apply-file__button/);

  /* Each hint belongs to its own control by name as well as by position — the
     three that have one are wired, so a hint read aloud arrives with the field
     rather than after it. */
  assert.equal((form.match(/aria-describedby/g) ?? []).length, 3);
  for (const hint of ["PDF, up to 8 MB", "A link to your work"]) {
    assert.match(form, new RegExp(hint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

/** A real PDF's first bytes, and a file that only claims to be one. */
const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
const ZIP = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);

function application(fields = {}, bytes = PDF) {
  const body = new FormData();
  const base = {
    name: "A Candidate",
    email: "candidate@example.com",
    role: "ai-specialist",
    roleTitle: "AI Specialist",
  };
  for (const [key, value] of Object.entries({ ...base, ...fields })) {
    if (value !== undefined) body.set(key, value);
  }
  if (bytes) {
    body.set("cv", new File([bytes], "cv.pdf", { type: "application/pdf" }));
  }
  return { method: "POST", body };
}

const post = async (fields, env, bytes) => {
  const response = await fetchWorker(
    "/api/careers/apply",
    application(fields, bytes),
    env,
  );
  return { status: response.status, body: await response.json() };
};

test("an application with nowhere to go is told so, not swallowed", async () => {
  /* The state this repository is actually in: `.openai/hosting.json` has
     `"r2": null`, so vite.config.ts creates no bucket and the binding is
     undefined. A form that accepted a CV here and dropped it would be worse
     than no form, so the endpoint says which of the two happened and the page
     turns it into a sentence pointing at the email. */
  const { status, body } = await post({}, {});
  assert.equal(status, 503);
  assert.equal(body.error, "uploads-not-configured");
});

test("the endpoint refuses what it should and stores what it should", async () => {
  const stored = [];
  const CV = {
    put: async (key, value, options) => {
      stored.push({ key, bytes: value.byteLength, meta: options.customMetadata });
    },
  };

  assert.equal((await post({ name: "" }, { CV })).body.error, "missing-fields");
  assert.equal((await post({ email: "not-an-address" }, { CV })).body.error, "bad-email");
  assert.equal((await post({}, { CV }, null)).body.error, "missing-cv");

  /* The one that matters most: `accept="application/pdf"` is a courtesy the
     browser pays and anyone posting directly ignores. The first five bytes are
     what the file is, so a zip renamed cv.pdf and declared as a PDF is caught
     on its contents rather than on its label. */
  assert.equal((await post({}, { CV }, ZIP)).body.error, "cv-not-pdf");

  /* The role becomes a path segment in the key, and it arrives in a hidden
     field — which means it arrives from whoever is posting. */
  assert.equal((await post({ role: "../../secrets" }, { CV })).body.error, "unknown-role");

  assert.equal(stored.length, 0, "something was stored that should have been refused");

  const good = await post({ link: "https://example.dev", note: "Hello." }, { CV });
  assert.equal(good.status, 200);
  assert.equal(good.body.ok, true);
  assert.equal(stored.length, 1);

  /* Stored under a name the endpoint composed. Never the uploaded filename: it
     can carry slashes and dots, and this is a path. */
  assert.match(stored[0].key, /^applications\/ai-specialist\/[\d-]+T[\d-]+Z-[0-9a-f-]{36}\.pdf$/);
  assert.equal(stored[0].meta.email, "candidate@example.com");
  assert.equal(stored[0].meta.link, "https://example.dev");
  assert.equal(stored[0].meta.roleTitle, "AI Specialist");

  /* NOT asserted here, and said out loud rather than left as a gap: the 8 MB
     cap. Calling worker.fetch with a synthetic Request hangs on a multipart
     body of about a megabyte or more — the body needs pumping that no real
     transport is doing — so a 9 MB case cannot run in this harness. It was
     checked over HTTP against the dev server instead: 9 MB returns 413
     cv-too-large. If this ever becomes testable here, it belongs above. */
});
