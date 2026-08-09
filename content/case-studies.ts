/**
 * Case Studies.
 *
 * The page exists before the studies do. That is deliberate and it is the same
 * order the Blog was built in: the opening is designed first, the pieces land
 * into it afterwards.
 *
 * **Nothing in here names a client, and nothing may until the owner says so.**
 * PRODUCT.md records that the delivered archive — EN NUR, Spitex Schwab AG,
 * Stolzbau, Henor, ANDI SPORT, ZEN, Jetonikeramika — may now be described as
 * Mardal's work, but that per-client sign-off for naming those companies in
 * public was never separately recorded. So the hero speaks about the work and
 * not about who it was for. When the answer comes, it changes the studies, not
 * this file.
 *
 * ArvenaAI does not belong here either. The menu has been promising an ArvenaAI
 * case study at an anchor that exists on no page; it is an unreleased in-house
 * product and PRODUCT.md is explicit that it must never be written as a
 * delivered client outcome. Products is where it lives.
 */
export const caseStudies = {
  slug: "case-studies",
  title: "Case Studies",
  lede:
    "Delivered work: what each system replaced, what it does now, and what the client owns.",

  /* Two lines, set here rather than in the page: where the line turns is a
     decision about the copy, not about the markup. Both sit inside the hero
     title's measure, which is the smaller of 21ch and the room left before the
     artwork — 16 characters each here against that 21.

     "handed over" rather than "delivered" twice. Handover is the part of this
     the positioning actually argues about: the client owns the source, the
     schema and the deployment pipeline, so a page of finished work should say
     the work left. */
  titleLines: ["Systems we built", "and handed over."],

  /* A promise about what a study contains, which is a promise this site can
     keep, rather than a claim about results, which it cannot: PRODUCT.md
     records zero quantified claims anywhere and no client outcome on file. */
  support:
    "What each one replaced, what it does now, and what the client owns.",

  heroCta: "Get in touch",
} as const;
