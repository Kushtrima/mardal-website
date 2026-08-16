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

/** The rectangles of every drawing carrying `className`, one string each.
 *
 *  Deduplicated, because the rendered document carries the RSC payload after
 *  the markup and every drawing therefore appears more than once. Collapsing
 *  identical strings is also exactly the comparison being made: two pieces that
 *  drew the same thing would collapse into one entry and fail the count. */
function drawings(html, className) {
  const svgs = html.matchAll(
    new RegExp(`<svg[^>]*class="${className}"[^>]*>(.*?)</svg>`, "gs"),
  );

  return new Set([...svgs].map((match) => match[1]));
}

function slugs(html) {
  return new Set(
    [...html.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map(
      (match) => match[1],
    ),
  );
}

test("every published piece draws its own pattern", async () => {
  const response = await render("/blog");
  assert.equal(response.status, 200);

  const html = await response.text();
  const published = slugs(html);

  assert.ok(published.size >= 3, "expected the index to list the pieces");

  /* The index draws nothing of its own. Every card used to close its headline
     with the piece's drawing at mark density — the same picture the piece opens
     on, one size down — and it has been taken off: the drawing belongs to the
     piece, and the reader meets it there. Asserted rather than assumed, so that
     it stays off. */
  assert.equal(
    drawings(html, "blog-card__mark").size,
    0,
    "a card is drawing a mark again",
  );

  /* The promise moved with the drawing. It is the plates that have to differ
     now, and there is one to a piece, so every piece is rendered and they are
     compared as a set — two pieces that drew the same thing collapse into one
     entry and fail the count, exactly as two identical marks used to. */
  const plates = new Set();

  for (const slug of published) {
    const piece = await render(`/blog/${slug}`);
    assert.equal(piece.status, 200, `/blog/${slug} did not render`);

    const [plate] = drawings(await piece.text(), "blog-art");
    assert.ok(plate, `/blog/${slug} opened on no drawing at all`);
    plates.add(plate);
  }

  assert.equal(
    plates.size,
    published.size,
    `${published.size} pieces but ${plates.size} distinct drawings — two pieces share one`,
  );
});

test("a piece opens on its own drawing, at plate size", async () => {
  const response = await render("/blog/between-systems");
  assert.equal(response.status, 200);

  const html = await response.text();
  const plates = drawings(html, "blog-art");

  assert.equal(plates.size, 1, "expected exactly one plate on a piece");

  const [plate] = plates;
  const rectangles = [...plate.matchAll(/<rect/g)].length;

  /* The plate is its own grid, not the mark enlarged, and the two must not
     converge. The three published pieces draw 49, 57 and 64 here against 17-18
     for a mark, so 28 sits clear of both: below it the plate has collapsed
     towards mark density, and it is low enough not to fail the day a sparse
     slug comes out at the quiet end. */
  assert.ok(
    rectangles >= 28,
    `the plate drew only ${rectangles} rectangles; it is not at plate density`,
  );
});
