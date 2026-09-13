import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * Contact.
 *
 * Rebuilt four times the day it was first written, each time on the owner's
 * word — too many things; a plain form; a box with no form — until the form
 * became what he kept: a letter with blanks in it, the blanks drawn as the
 * site's redaction bars. Then pared down around it: the email, phone and address
 * came off, the question went on top, the letter under it, and the letter's
 * words went to the plain face with the display face kept for the blanks.
 *
 * So this file holds what the page is for — the question and the letter — and
 * the absence of what came out, because each of those things is small enough
 * to come back without anyone deciding it should.
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

/** Every rule in the stylesheet with this exact selector, top level only. */
const rule = (selector) => {
  const at = CSS.indexOf(`\n${selector} {`);
  assert.ok(at > 0, `${selector} has no rule`);
  return CSS.slice(at, CSS.indexOf("}", at));
};

test("Contact is a written page", async () => {
  const { status, html } = await render("/contact");
  assert.equal(status, 200);

  assert.match(html, /<title>Contact — Mardal<\/title>/i);
  assert.doesNotMatch(html, /Working[\s\S]{0,40}on it\./);
  assert.match(html, /class="site-nav"/);
  assert.match(html, /<footer class="site-footer"/);
});

test("on top: the question and its sentence, and nothing else", async () => {
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

  /* **The email, phone and address are off the page — owner, 2026-09-13.** The
     footer under it carries all three, so nothing is lost; a second copy here
     was a second place to read the same facts. Asserted against the page and
     not the footer, which must keep them. */
  assert.doesNotMatch(page, /contact__details|<dl/);
  assert.doesNotMatch(page, /href="mailto:|href="tel:/);
  assert.doesNotMatch(page, /Isa Boletini/);
  assert.match(markup((await render("/contact")).html), /<footer[\s\S]*info@mardal\.co/);

  /* And the letter comes after the question, not beside it. */
  assert.ok(
    page.indexOf('class="contact__title"') < page.indexOf("<form"),
    "the letter comes before the question",
  );
});

test("under it, a letter, and the blanks are where you write", async () => {
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
    "from",
    "and I would like to talk about",
    "You can reach me at",
    "Here is what I have in mind:",
  ]) {
    assert.ok(text.includes(words), `the letter has lost "${words}"`);
  }

  /* Three clauses, three lines: broken where the sentence turns, not where the
     column runs out. */
  assert.equal((form.match(/class="letter__line letter__clause"/g) ?? []).length, 3);

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

test("the letter is set as the page's paragraph, and only the blanks in the display face", () => {
  /* Owner, 2026-09-13: Arial, then smaller, then "make text as paragraph" — so
     the letter's words take the paragraph's own face and size, the sentence
     under the heading, and the display face stays in the fields. Both halves,
     because swapping them back is one word in each rule. */
  const letterRule = rule(".letter");
  assert.match(letterRule, /font-family:\s*var\(--type-body\)/);
  assert.match(letterRule, /font-size:\s*var\(--text-copy\)/);
  assert.doesNotMatch(letterRule, /--type-title|--text-heading|--type-plain/);
  /* The Arial token went with its only reader. */
  assert.doesNotMatch(CSS, /--type-plain/);

  /* A paragraph's distance between the letter's parts, not a line's — owner:
     more vertical distance between. */
  assert.match(rule(".letter__line + .letter__line"), /margin-top:\s*1\.25em/);

  /* **Symmetry — owner, 2026-09-13: the letter as it was, but symmetrical.**
     Each clause its own line, and the last blank on every line runs to the
     letter's right edge, so every line ends where the message ends. Nothing
     sizes a blank to its own words any more — that is what clipped "your nam"
     and gave every bar a length of its own. */
  assert.match(rule(".letter__clause"), /display:\s*flex/);
  assert.match(rule(".letter__blank--fill"), /flex:\s*1 1 6em/);
  assert.match(rule(".letter__blank--short"), /flex:\s*0 0 clamp\(6em, 30%, 9em\)/);
  assert.doesNotMatch(rule(".letter__blank"), /field-sizing/);
  assert.doesNotMatch(CSS, /\.letter__rows|\.letter__prompt/);
  /* And the topic, before anything is chosen, looks as empty as the others. */
  assert.match(CSS, /\.letter__blank--choice:has\(option\[value=""\]:checked\)\s*\{[^}]*--tint-lilac-bar/);

  const blank = rule(".letter__blank");
  assert.match(blank, /font-family:\s*var\(--type-title\)/);
  /* After `font: inherit`, or the shorthand would put the plain face back — and
     the size with it, which is why the quarter up is written after it too. */
  assert.ok(
    blank.indexOf("font: inherit") < blank.indexOf("font-family: var(--type-title)"),
    "the blank's face is reset by the `font` shorthand written after it",
  );
  assert.ok(
    blank.indexOf("font: inherit") < blank.indexOf("font-size: 1.25em"),
    "the blank's size is reset by the `font` shorthand written after it",
  );

  /* Solid while empty, pale once written, italic while it is only a prompt. */
  assert.match(blank, /background:\s*var\(--tint-lilac-bar\)/);
  assert.match(rule(".letter__blank:not(:placeholder-shown)"), /background:\s*var\(--tint-lilac\)/);
  assert.match(rule(".letter__blank::placeholder"), /font-style:\s*italic/);
  /* A tint does not turn over with the theme, so neither may what is written
     on it. */
  assert.match(blank, /color-scheme:\s*light/);
});

test("the question on the left, the letter under it on the right, one column when narrow", () => {
  assert.match(rule(".contact__inner"), /grid-template-columns:\s*repeat\(12, minmax\(0, 1fr\)\)/);

  /* Owner, 2026-09-13: the form on the right, not the left — and still under
     the question, which is what the explicit second row holds. Without it the
     letter would rise beside the heading, the arrangement he moved it out of. */
  assert.match(rule(".contact__intro"), /grid-column:\s*1 \/ span 7/);
  const panel = rule(".contact__panel");
  assert.match(panel, /grid-column:\s*7 \/ -1/);
  assert.match(panel, /grid-row:\s*2/);

  const stack = CSS.indexOf("@media (max-width: 64rem)", CSS.indexOf("\n.contact {"));
  assert.ok(stack > 0, "the contact page never widens");
  assert.match(
    CSS.slice(stack, CSS.indexOf("\n}", stack)),
    /\.contact__intro,\s*\n\s*\.contact__panel \{\s*grid-column:\s*1 \/ -1/,
  );

  /* The rules for the facts went with the facts. */
  assert.doesNotMatch(CSS, /\.contact__details?\b/);
});

test("the prompts in the blanks are white, and their contrast is said out loud", () => {
  /* Owner, 2026-09-13: the placeholder text in white — the four prompts, and the
     drop-down's "a project" with its chevron while nothing is chosen. */
  assert.match(rule(".letter__blank::placeholder"), /color:\s*var\(--accent-contrast\)/);
  assert.match(
    CSS,
    /\.letter__blank--choice:has\(option\[value=""\]:checked\)\s*\{[^}]*color:\s*var\(--accent-contrast\)/,
  );
  assert.match(CSS, /\.letter__choice:has\(option\[value=""\]:checked\)\s*\{[^}]*color:\s*var\(--accent-contrast\)/);

  /* White only because the light half of the token is white and the bars pin
     the light scheme. */
  assert.match(CSS, /--accent-contrast:\s*light-dark\(#ffffff,/);
  assert.match(rule(".letter__blank"), /color-scheme:\s*light/);

  /* And the open list stays readable: some systems colour its options with the
     select's own colour, which would be white on a white menu. */
  assert.match(CSS, /\.letter__blank--choice option\s*\{[^}]*color:\s*var\(--ink\)/);

  /* ⚠ Not a failure — a record, as theme.test.mjs keeps the footer's. White on
     the empty bar is about 2:1, under AA even for large text; the owner asked
     for it, and what is not acceptable is it being forgotten. So the number is
     computed from the two values in the stylesheet and printed on every run. */
  const bar = CSS.match(/--tint-lilac-bar:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(bar, "the empty bar's colour is not a hex this can read");
  const channel = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const contrast = 1.05 / (luminance(bar) + 0.05);
  console.log(
    `    contact blanks: white prompt on ${bar} is ${contrast.toFixed(2)}:1` +
      (contrast >= 3 ? "" : " — under AA even for large text, kept on the owner's word"),
  );
  assert.ok(contrast > 1.5, "the white prompt has disappeared into its bar");
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
