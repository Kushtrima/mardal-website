import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * Contact.
 *
 * Rebuilt four times the day it was first written, each time on the owner's
 * word — too many things; a plain form; a box with no form — until the right
 * side became what he asked for: a form that is minimal, yet extra. It is a
 * letter with blanks in it, and the blanks are the site's redaction bars.
 *
 * So this file holds what the page is for — the question, the three ways in,
 * and the letter — and the absence of what came out, because each of those
 * things is small enough to come back without anyone deciding it should.
 *
 * The copy is written out rather than imported, for the reason every page test
 * here gives: a test that reads the module the page reads asserts only that a
 * file equals itself.
 */

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

async function fetchWorker(path, init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
      ...init,
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const render = async (path) => {
  const response = await fetchWorker(path);
  return { status: response.status, html: await response.text() };
};

/** The markup alone, with the RSC payload stripped — see careers.test.mjs. */
const markup = (html) => html.replace(/<script[\s\S]*?<\/script>/g, "");

/** What is between `<main>` and `</main>`: the page, without the header and the
 *  footer every page shares. */
const mainOf = (html) => {
  const page = markup(html);
  return page.slice(page.indexOf("<main"), page.indexOf("</main>"));
};

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("Contact is a written page", async () => {
  const { status, html } = await render("/contact");
  assert.equal(status, 200);

  assert.match(html, /<title>Contact — Mardal<\/title>/i);
  assert.doesNotMatch(html, /Working[\s\S]{0,40}on it\./);
  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});

test("the left column: the question, a sentence and the three ways in", async () => {
  const page = mainOf((await render("/contact")).html);

  /* React writes `<!-- -->` between adjacent text children; stripped, because
     the marker is React's business and the words are the assertion. */
  const lines = [
    ...page.matchAll(/<span class="contact__title-line">(.*?)<\/span>/g),
  ].map((m) => m[1].replace(/<!-- -->/g, ""));
  assert.deepEqual(lines, ["Have something", " in mind?"]);
  assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1);

  assert.match(page, /Tell us what you want to improve, automate, or create\./);
  assert.doesNotMatch(page, /practical digital solution/);

  /* No full-screen hero in front of it: on this page the reader has already
     decided to get in touch. */
  assert.doesNotMatch(page, /class="service-hero/);

  /* The footer's three facts, and the country the footer leaves off.

     The address carries the footer's hard spaces — they keep `“Isa Boletini”`
     on one line and `6000` beside its city — so they are written out as
     escapes. Typed, a hard space and a space look the same, and a version of
     this line failed on exactly that. */
  assert.match(page, /<dt>Email<\/dt><dd><a href="mailto:info@mardal\.co">info@mardal\.co<\/a><\/dd>/);
  assert.match(page, /<dt>Phone<\/dt><dd><a href="tel:\+38349210999">\+383 49 210 999<\/a><\/dd>/);
  assert.match(
    page,
    /<dt>Address<\/dt><dd>Rr\. “Isa Boletini”, 6000 Gjilan, Kosovo<\/dd>/,
  );
  assert.equal((page.match(/class="contact__detail"/g) ?? []).length, 3);
});

test("the right column is a letter, and the blanks are where you write", async () => {
  const page = mainOf((await render("/contact")).html);
  const form = page.slice(page.indexOf("<form"), page.indexOf("</form>"));
  assert.ok(form.startsWith("<form"), "there is no letter on the page");

  /* Case-insensitive, because the renderer writes React's own spelling —
     `noValidate` — and HTML attribute names are case-insensitive. */
  const open = form.slice(0, form.indexOf(">") + 1);
  assert.match(open, /class="letter"/);
  assert.match(open, /action="\/api\/contact"/);
  assert.match(open, /method="post"/i);
  assert.match(open, /novalidate/i);

  /* The letter reads as a letter. */
  const text = form.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  for (const words of [
    "Hello Mardal,",
    "My name is",
    ", and I would like to talk about",
    "You can reach me at",
    "Here is what I have in mind:",
  ]) {
    assert.ok(text.includes(words), `the letter has lost "${words}"`);
  }

  /* Read tag by tag, so the order a renderer writes attributes in cannot pass or
     fail anything. */
  const tag = (pattern) => form.match(pattern)?.[0] ?? "";
  const blanks = {
    name: tag(/<input[^>]*\sname="name"[^>]*>/),
    company: tag(/<input[^>]*\sname="company"[^>]*>/),
    topic: tag(/<select[^>]*\sname="topic"[^>]*>/),
    email: tag(/<input[^>]*\sname="email"[^>]*>/),
    message: tag(/<textarea[^>]*\sname="message"[^>]*>/),
  };
  for (const [name, html] of Object.entries(blanks)) {
    assert.ok(html, `the letter has no ${name} blank`);
  }
  assert.match(blanks.email, /type="email"/);
  for (const name of ["name", "email", "message"]) {
    assert.match(blanks[name], /\srequired/i, `${name} is not required`);
  }
  assert.doesNotMatch(blanks.company, /\srequired/i, "company is required");
  assert.match(blanks.name, /placeholder="your name"/);

  /* Every blank has a real label, though the letter around it is what a
     sighted reader reads. */
  const ids = [
    ...form.matchAll(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"/g),
  ].map((m) => m[1]);
  assert.equal(ids.length, 5);
  for (const id of ids) {
    assert.match(form, new RegExp(`<label[^>]*for="${escape(id)}"`), `blank ${id} has no label`);
  }

  /* The topics read inside the sentence, in the menu's order. */
  const options = [...form.matchAll(/<option[^>]*>([^<]*)<\/option>/g)].map((m) =>
    m[1].replace(/&amp;/g, "&"),
  );
  assert.deepEqual(options, [
    "a project",
    "branding",
    "a website",
    "software",
    "a CRM",
    "AI and automation",
    "something else",
  ]);

  /* One button, and it sends. */
  const buttons = [...form.matchAll(/<button[^>]*>/g)];
  assert.equal(buttons.length, 1, "the letter has more than one button");
  assert.match(buttons[0][0], /type="submit"/);
  assert.match(form, />Send<span class="pixel-arrow/);

  /* Five bars draw in: four blanks in the sentences and the message. */
  assert.equal((form.match(/data-blank="true"/g) ?? []).length, 5);

  /* And what the earlier versions carried, which the owner turned down. */
  for (const gone of [
    /type="radio"/,
    />Copy</,
    /Time zone/,
    /Required<|Optional</,
    /class="contact-form/,
    /contact__bars|Start a project/,
  ]) {
    assert.doesNotMatch(page, gone, `${gone} is back on the page`);
  }
});

/** A letter as the form posts it. */
function letter(fields = {}) {
  const body = new FormData();
  const base = {
    name: "A Visitor",
    company: "Example AG",
    topic: "Software",
    email: "visitor@example.com",
    message: "Three of our systems do not talk to each other.",
  };
  for (const [key, value] of Object.entries({ ...base, ...fields })) {
    if (value !== undefined) body.set(key, value);
  }
  return { method: "POST", body };
}

const post = async (fields) => {
  const response = await fetchWorker("/api/contact", letter(fields));
  return { status: response.status, body: await response.json() };
};

test("a letter with nowhere to go is told so, not swallowed", async () => {
  /* The state this repository is in: no mail service. Accepting a letter here
     and dropping it would be worse than no form, so the endpoint says which of
     the two happened and the letter offers the visitor's own email instead. */
  const { status, body } = await post({});
  assert.equal(status, 503);
  assert.deepEqual(body, { ok: false, error: "sending-not-configured" });
});

test("the endpoint checks what it needs before anything else", async () => {
  assert.equal((await post({ name: "" })).body.error, "missing-fields");
  assert.equal((await post({ email: "" })).body.error, "missing-fields");
  assert.equal((await post({ message: "   " })).body.error, "missing-fields");
  assert.equal((await post({ email: "not-an-address" })).body.error, "bad-email");

  /* Company and topic are optional at the endpoint as well as in the letter. */
  assert.equal(
    (await post({ company: undefined, topic: undefined })).body.error,
    "sending-not-configured",
  );

  const unreadable = await fetchWorker("/api/contact", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "not a form",
  });
  assert.equal(unreadable.status, 400);
});

test("the letter answers honestly, and draws its blanks in once", () => {
  const code = readFileSync(
    new URL("../components/contact/LetterForm.tsx", import.meta.url),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");

  assert.match(code, /"use client"/);
  assert.match(code, /fetch\(CONTACT_ENDPOINT/);
  assert.match(code, /result\.error === "sending-not-configured"/);
  assert.match(code, /encodeURIComponent\(body\)/);
  assert.match(code, /aria-invalid=\{invalid\(/);

  /* The draw-in is the one authored moment, and a reader who asked for no
     motion never gets it — the guard comes before the tween is built. */
  const guard = code.indexOf("prefers-reduced-motion: reduce");
  const tween = code.indexOf("gsap.fromTo");
  assert.ok(guard > 0 && tween > guard, "the blanks animate for a reader who asked for no motion");
  assert.match(code, /clipPath: "inset\(0% 100% 0% 0%\)"/);
  assert.match(code, /clearProps: "clipPath"/);
});

test("the blanks are the site's bars, and stay light on the dark page", () => {
  const rule = (selector) => {
    const at = CSS.indexOf(`\n${selector} {`);
    assert.ok(at > 0, `${selector} has no rule`);
    return CSS.slice(at, CSS.indexOf("}", at));
  };

  assert.match(rule(".contact__inner"), /grid-template-columns:\s*repeat\(12, minmax\(0, 1fr\)\)/);
  assert.match(rule(".contact__intro"), /grid-column:\s*1 \/ span 5/);
  assert.match(rule(".contact__panel"), /grid-column:\s*7 \/ -1/);

  const blank = rule(".letter__blank");
  /* Solid while empty, pale once written. */
  assert.match(blank, /background:\s*var\(--tint-lilac-bar\)/);
  assert.match(rule(".letter__blank:not(:placeholder-shown)"), /background:\s*var\(--tint-lilac\)/);
  /* A tint does not turn over with the theme, so neither may what is written
     on it. */
  assert.match(blank, /color-scheme:\s*light/);
  assert.match(blank, /field-sizing:\s*content/);
  assert.match(rule(".letter__blank::placeholder"), /font-style:\s*italic/);

  const stack = CSS.indexOf("@media (max-width: 64rem)", CSS.indexOf("\n.contact {"));
  assert.ok(stack > 0, "the contact page never stacks");
  assert.match(
    CSS.slice(stack, CSS.indexOf("\n}", stack)),
    /\.contact__intro,\s*\n\s*\.contact__panel \{\s*grid-column:\s*1 \/ -1/,
  );
});

test("the page states the facts it was given and invents none", async () => {
  const { html } = await render("/contact");
  const prose = mainOf(html).replace(/<[^>]*>/g, " ");

  for (const invented of [
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\bmon\s*[–-]\s*fri\b/i,
    /\b\d{1,2}[:.]\d{2}\b/,
    /\b\d{1,2}\s*(am|pm)\b/i,
    /\bopening hours\b|\boffice hours\b/i,
    /\bwithin \d|\b24\s*\/\s*7\b|\bbusiness days?\b|\bworking days?\b/i,
    /whatsapp|viber|telegram|skype/i,
    /\b(19|20)\d{2}\b/,
  ]) {
    assert.doesNotMatch(prose, invented, `/contact states something unsupplied: ${invented}`);
  }

  assert.doesNotMatch(
    markup(html),
    /<iframe|google\.[a-z.]+\/maps|openstreetmap\.org|maps\.apple\.com/i,
    "/contact embeds or links a map nobody asked for",
  );
});

test("the house rules hold: no inline style, no dead anchor", async () => {
  const { html } = await render("/contact");

  assert.doesNotMatch(
    html,
    /<(section|div|p|h[1-6]|article|li|a|span|dl|dt|dd|form|button|label|input|select|textarea)[^>]* style="/,
  );

  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  const dead = [
    ...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])),
  ].filter((anchor) => !ids.has(anchor));
  assert.deepEqual(dead, [], `/contact links to #${dead.join(", #")}`);
});

test("the header's way in goes to this page now", async () => {
  /* "Hire us" and "Start a project" went to the footer's `#contact` while this
     page only said "Working on it". */
  const html = markup((await render("/")).html);

  for (const name of ["mega-menu__cta", "mobile-menu__cta"]) {
    const tag = html.match(
      new RegExp(`<a[^>]*class="(?:[^"]*\\s)?${name}(?:\\s[^"]*)?"[^>]*>`),
    )?.[0];
    assert.ok(tag, `${name} is not rendered`);
    assert.match(tag, /href="\/contact"/, `${name} does not go to /contact`);
  }

  /* The footer keeps its id, so anything still pointing at `#contact` resolves. */
  assert.match(html, /<footer class="site-footer" id="contact"/);
});
