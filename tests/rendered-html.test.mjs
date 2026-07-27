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

/** Every anchor the header menu links to, except the four Company pages that
 *  do not exist yet (#about, #team, #blog, #careers). */
const menuAnchors = [
  "solutions",
  "finance",
  "healthcare",
  "manufacturing",
  "automotive",
  "retail",
  "logistics",
  "public-sector",
  "products",
  "arvena-ai",
  "ftesa",
  "ihrauto",
  "contact",
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
  assert.match(html, /Shaped Around You/);
  assert.match(html, /Beyond Handover/);
  assert.match(html, /Built across industries/);
  assert.match(html, /class="industry-art__ring"/);
  assert.match(html, /Physical stores, e-commerce businesses/);
  assert.match(html, /Products are how we test our thinking/);
  assert.match(html, /In development/);
  assert.match(html, /moves you forward/);
  assert.match(html, /Start a conversation/);
  assert.match(html, /hello@mardal\.com/);

  // The services, solutions, case study and process sections are gone: these
  // strings live in the sections themselves, not in the menu that links to them.
  assert.doesNotMatch(html, /Services built around the way you work/);
  assert.doesNotMatch(html, /Compliance-aware systems/);
  assert.doesNotMatch(html, /shaped into a product|Case study in progress/);
  assert.doesNotMatch(html, /A simple path from idea to working software/);

  // Footer — closes on the oversized wordmark.
  assert.match(html, /<footer class="site-footer"/);
  assert.match(html, /Technology that works for people and moves business/);
  assert.match(html, /© \d{4} Mardal/);
  assert.match(html, /class="site-footer__nav"/);
  assert.match(html, /Back to top/);
  // No oversized wordmark: the footer logo stays at brand size.
  assert.doesNotMatch(html, /site-footer__wordmark/);

  // Shared machinery
  assert.match(html, /data-route-section/);
  assert.match(html, /data-reveal-item/);

  // The isometric drawings, one per product.
  assert.match(html, /class="iso-art"/);
  assert.match(html, /class="iso-block iso-block--phase-/);
  assert.match(html, /Animated isometric cards fanned out/);
  assert.equal((html.match(/class="iso-art"/g) ?? []).length, 3);

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
