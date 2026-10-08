/**
 * Every piece draws something of its own.
 *
 * A new post gets its pattern for free — `composePattern` seeds itself from the
 * slug — so there is nothing to remember when one is written. This is the guard
 * on that promise: if two pieces ever come out looking the same, or if a post
 * is added and its drawing does not appear, the build fails here rather than
 * being noticed on the page months later.
 *
 * Asserted against the rendered HTML rather than the component, so it is
 * testing what a reader actually receives.
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

function slugs(html) {
  return new Set(
    [...html.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map(
      (match) => match[1],
    ),
  );
}

/* **A professional piece — owner, 2026-10-08**: "remove that design inside
   the blog when open because there needs to be image … on the right to be
   title online offline when scrollin in the middle to be text". The drawing
   that opened every piece is gone: each piece opens on its own picture, and
   its headings stand down the right for the reader to follow. */
test("every piece opens on its own picture, and its headings are listed beside it", async () => {
  const index = await (await render("/blog")).text();
  const published = slugs(index);
  assert.ok(published.size >= 3, "expected the index to list the pieces");

  const covers = new Set();
  for (const slug of published) {
    const response = await render(`/blog/${slug}`);
    assert.equal(response.status, 200, `/blog/${slug} did not render`);
    const html = await response.text();
    const article = html.slice(html.indexOf('<article class="blog-article">'), html.indexOf("</article>"));

    /* No drawing: a picture, the whole width. */
    assert.doesNotMatch(article, /blog-art\b|<svg[^>]*class="blog-art/);
    const cover = article.match(/<img class="blog-article__cover-image" src="([^"]+)"/)?.[1];
    assert.ok(cover, `/blog/${slug} opens on no picture`);
    covers.add(cover);

    /* Every heading in the text has an address, and the list down the right
       names each of them, in order. */
    const headings = [...article.matchAll(/<h2 class="blog-article__heading" id="([a-z0-9-]+)">([^<]*)<\/h2>/g)];
    assert.ok(headings.length > 0, `/blog/${slug} has no headings`);
    const listed = [...article.matchAll(/<a class="article-contents__link" href="#([a-z0-9-]+)"/g)].map((m) => m[1]);
    assert.deepEqual(listed, headings.map((m) => m[1]), `/blog/${slug} lists headings it has not got`);

    /* One face: the title and the headings in the site's display face. */
    assert.match(article, /<h1 class="blog-article__title">/);
  }
  assert.equal(covers.size, published.size, "two pieces open on the same picture");
});
