/**
 * No link on the site points at an anchor its page has not got.
 *
 * Kept from the placeholder pages' tests (tests/placeholder-pages.test.mjs)
 * when the last of those pages was deleted — owner, 2026-10-08, of the old
 * service, product and Company pages: "delete it all", "we dont have
 * seperate pages for those links". The pages went; this check was never
 * about them.
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

test("no link on the site points at an anchor its page has not got", async () => {
  /* The state the placeholder pages existed to reach. Before them, `#privacy` and
     `#careers` resolved nowhere at all, and `#products`, `#company` and the
     three product anchors resolved only on the homepage — read from the Blog or
     another page they were dead too, which is the failure this catches and a
     count of links never would.

     Checked on a page from each family, since the header and the footer are the
     same on all of them and a dead anchor in either would show up on any. */
  for (const path of ["/", "/privacy", "/blog", "/case-studies", "/services"]) {
    const html = await (await render(path)).text();
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
    const dead = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]))]
      .filter((anchor) => !ids.has(anchor));

    assert.deepEqual(dead, [], `${path} links to #${dead.join(", #")}`);
  }
});
