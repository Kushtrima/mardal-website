/**
 * **A page's structured data, in its HTML** — SEO-PLAN.md, step 1.5. Server
 * rendered, so the crawlers that run no JavaScript (the AI ones) read it too.
 * `<` is written as its escape so nothing in the data can close the tag.
 */
const LESS_THAN = /</g;
const ESCAPED_LESS_THAN = String.fromCharCode(92) + "u003c";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(LESS_THAN, ESCAPED_LESS_THAN),
      }}
    />
  );
}
