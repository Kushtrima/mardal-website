/**
 * The products' page.
 *
 * **Its opening is the services page's, in other words** — owner,
 * 2026-10-07: "Recreate Product page, make same hero banner but with
 * different text adapt a text that explakin product pages". The words were
 * written for him at that request, from what the homepage already says of
 * the products ("Our products begin with a real need, not a trend …") and
 * nothing more — no product, date or figure the site does not already state.
 * His to replace. The body comes next.
 */

import type { PageHeroContent } from "../components/services/ServicesHero";

/** The page's name in the tab, and its line for search results. */
export const productsPage = {
  title: "Products",
  description: "The products Mardal builds, in one place.",
} as const;

/** The opening: its label, the heading in its four lines, and the note. */
export const productsHero = {
  label: "Products",
  /* Four lines in the services' measure — the first as long as theirs,
     the second the longest — so the heading stands at their size and ends
     on the same rules. */
  titleLines: [
    "Mardal also builds its own",
    "products to test its thinking before",
    "it goes into the work",
    "for clients",
  ],
  titleStop: ".",
  note: "Each one starts from a real need, not a trend. We explore, build, test and refine it, then bring what we learn into every project we take on.",
} as const satisfies PageHeroContent;

/**
 * **What the products are, before them** — owner, 2026-10-07: "before you
 * put those two prodyct i need also to explain little a paragraf … our
 * company works also in product that are not for client, those product ar in
 * AI field and other … a professional paragraf and a title if you see fit".
 * Written for him from that and nothing more; his to replace. Set as the
 * homepage's products are: a label, the heading in its lines with the red
 * full stop, the paragraph under it.
 */
export const productsIntro = {
  labelLines: ["Built", "in-house"],
  titleLines: ["Products of our own,", "not made for a client"],
  titleStop: ".",
  summary:
    "Alongside our client work, Mardal designs and builds products of its own. No client commissions them and none is made to a brief: we choose the problem and take it from the first idea to a working product ourselves. Some are built on artificial intelligence, others on everyday needs. Both below are still in development.",
} as const;
