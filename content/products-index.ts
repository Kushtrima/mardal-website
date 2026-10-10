/**
 * The products' page.
 *
 * **Its opening is the services page's, in other words** — owner,
 * 2026-10-07: "Recreate Product page, make same hero banner but with
 * different text adapt a text that explakin product pages". The words were
 * written for him at that request, from what the homepage already says of
 * the products ("Our products begin with a real need, not a trend …") and
 * nothing more — no product, date or figure the site does not already state.
 * His to replace — and replaced: since 2026-10-10 the heading and the note
 * are the owner's own words. The body comes next.
 */

import type { PageHeroContent } from "../components/services/ServicesHero";

/** The page's name in the tab, and its line for search results. */
export const productsPage = {
  title: "Products",
  description: "The products Mardal builds, in one place.",
} as const;

/** The opening: its label, the heading in its lines, and the note. */
export const productsHero = {
  label: "Products",
  /* The owner's own words, 2026-10-10, set as he wrote them, in three lines
     broken where the sentence turns. The heading is sized from the second,
     the longest (`--hero-fit` in globals.css), so a change of line changes
     its size. */
  titleLines: [
    "Our own digital products,",
    "continuously developed and improved",
    "by the Mardal team",
  ],
  titleStop: ".",
  note: "We try new technologies and approaches while continuing to update and improve the products we’ve built.",
} as const satisfies PageHeroContent;

/**
 * **What the products are, before them** — owner, 2026-10-07: "before you
 * put those two prodyct i need also to explain little a paragraf … our
 * company works also in product that are not for client, those product ar in
 * AI field and other … a professional paragraf and a title if you see fit".
 * Written for him from that and nothing more; his to replace. Set as the
 * homepage's products are: a label, the heading in its lines with the red
 * full stop, the paragraph under it.
 *
 * Replaced 2026-10-10 by the owner's own heading and two paragraphs, set as
 * he wrote them; the heading broken where its phrase turns.
 */
export const productsIntro = {
  labelLines: ["Built", "in-house"],
  titleLines: ["The Philosophy", "Behind Our Products"],
  titleStop: ".",
  summary: [
    "We create products that address different needs. One is an AI-powered mental health platform developed in collaboration with mental health professionals. The other is a digital invitation platform that makes creating, personalizing, and sharing invitations for weddings and other celebrations easier.",
    "Before developing a product, we spend time researching the problem, understanding user needs, and evaluating possible solutions. We test our assumptions, explore different approaches, and use what we learn to guide the design and development process. As our products evolve, we continue testing, gathering feedback, and making improvements to ensure they remain useful, accessible, and relevant to the people who use them.",
  ],
} as const;
