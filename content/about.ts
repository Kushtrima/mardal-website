/**
 * About, and the sentence the owner wrote for it.
 *
 * The third of the unwritten pages to be written, after Careers and Branding,
 * and it leaves `content/placeholders.ts` the same way they did — an entry
 * deleted there, a route written here. The count goes from eleven to ten.
 *
 * **Only the hero exists.** Owner, 2026-08-26: "we will work on about us page;
 * first add this text as big text in hero banner", and then the heading and the
 * line under it. So this file holds two sentences and nothing else. Nothing
 * about the founding, the number of people, the names or the way the studio
 * works has been supplied, and PRODUCT.md's standing answer to an unsupplied
 * fact is a bracket or an absence rather than a plausible guess — which on a
 * page ABOUT the company is the one place a guess would do the most damage.
 */

import { contactEmail } from "./home";

export const about = {
  title: "About",
  description:
    "Mardal is a Kosovo-based innovation studio working across branding, websites, software and AI.",

  /**
   * The owner's line, verbatim.
   *
   * His second for this page. The first was the whole studio description — "Get
   * to know Mardal, a Kosovo-based innovation studio working across branding,
   * websites, Software and AI visibility." — set as four authored lines, and it
   * was replaced within the hour. It is kept here because it is still the only
   * sentence that says what Mardal is and where it is, and nothing on the site
   * says either yet.
   *
   * Broken at the comma, which is the only real joint the sentence has:
   *
   *     A studio shaped by people,    26ch
   *     ideas, and progress.          20ch
   *
   * Both other breaks were tried and are worse. After `by` leaves a preposition
   * hanging at the end of a line and splits the phrase it governs; at both
   * commas gives 26 / 7 / 13, which is not three lines, it is one and a stumble.
   *
   * Where a heading turns is a decision about the copy on this site, so the page
   * sets its own size and measure to hold this break at every width — see
   * `.service-page--about` in the stylesheet, and `--hero-line` for how the
   * number was measured.
   */
  titleLines: ["A studio shaped by people,", "ideas, and progress."],

  /**
   * The owner's line, verbatim, at the foot of the hero on the left.
   *
   * **The only claim this page makes**, and it is his: a small team, on purpose,
   * and skilled. Everything a reader would expect around it — how small, who,
   * since when — is unsupplied, and PRODUCT.md's standing answer to an
   * unsupplied fact is an absence rather than a plausible guess.
   *
   * It is 113 characters against the 16ch measure the five service heroes hold
   * their support to, so this page widens and quietens it rather than setting a
   * paragraph at 40px — see the stylesheet.
   */
  support:
    "Our core team is small on purpose, but highly skilled, so you get the right talent and expertise, all the time.",

  /**
   * The way out. Every hero on this site ends on one, and until there are
   * sections below this one there is nowhere else for it to go — the
   * placeholder pointed at `/#company`, which was the nearest real thing while
   * this page was not itself real.
   */
  cta: "Get in touch",
  ctaHref: `mailto:${contactEmail}`,
} as const;
