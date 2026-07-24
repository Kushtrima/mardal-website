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

test("server-renders the Mardal hero", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Mardal — Innovation lives here<\/title>/i);
  assert.match(html, /Innovation/);
  assert.match(html, /lives here/);
  assert.match(html, /technology behind/);
  assert.match(html, /Why Mardal/);
  assert.match(html, /Ship smarter software/);
  assert.match(html, /enterprise AI/);
  assert.match(html, /IPO Access/);
  assert.match(html, /Recurring Investment/);
  assert.match(html, /24\/7 Support/);
  assert.match(html, /Recommendations/);
  assert.match(html, /Mardal Services/);
  assert.match(html, /AI &amp; Automation/);
  assert.match(html, /Solutions by Industry/);
  assert.match(html, /Financial Services/);
  assert.match(html, /Mardal Products/);
  assert.match(html, /Arvena AI/);
  assert.match(html, /Mardal Projects/);
  assert.match(html, /Inside Mardal/);
  assert.match(html, /Careers/);
  assert.match(html, /Start a project/);
  assert.match(html, /Animated investment columns/);
  assert.match(html, /class="ipo-column ipo-column--phase-1"/);
  assert.match(html, /Animated recurring investment orbit/);
  assert.match(html, /class="recurring-sphere recurring-sphere--one"/);
  assert.match(html, /Animated support orbit/);
  assert.match(html, /class="support-color-part support-color-part--small"/);
  assert.match(html, /Animated recommendation handoff/);
  assert.match(html, /class="recommendation-wall recommendation-wall--front"/);
  assert.match(html, /card-icons\/recommendations\.png/);
  assert.match(html, /class="hero-line"/);
  assert.match(html, /fill="currentColor"/);
  assert.match(html, /Hire us/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
