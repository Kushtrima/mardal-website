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
   * The photograph under the hero, and what is said about it.
   *
   * The owner's file, `Open office-1.webp` off his desktop, 4000x2250 and 16:9.
   * It replaced a 739x415 one, which is why the plate can be full width now:
   * the first file was drawn at its own resolution at 736px and would have been
   * a 3.68x upscale on a retina screen at the page width.
   *
   * **Five widths rather than one.** The original is 1.2MB, and a phone that
   * needs 1200px of it should not be sent 4000. `sizes="100vw"` tells the
   * browser the plate is the page width, and it takes the rung it needs — 107KB
   * on a phone against 947KB for the whole thing.
   *
   * **The alt describes the room and does not say whose it is.** Nothing I have
   * been told says this is Mardal's own office, and on a page ABOUT the company
   * a caption is a claim: "our studio in Gjilan" would be a fact invented in an
   * `alt` attribute, where it is least likely to be checked. Written as what is
   * in the picture, which is true either way. One edit if he tells me otherwise.
   */
  photo: {
    /**
     * How many vertical slices the plate is drawn in.
     *
     * The owner's pick from four entrances, 2026-08-26, after three others were
     * replaced: slices that arrive staggered and land flush. Five because it is
     * what he chose from, and because it echoes the redaction bars the service
     * heroes carry — the same language, on a photograph.
     */
    slices: 5,
    /** The rung a browser takes if it ignores `srcset` entirely. */
    src: "/about-office-2400.webp",
    widths: [1200, 1800, 2400, 3200, 4000],
    /** The source's own pixels, so the box reserves the right shape before it
     *  loads and nothing below it jumps. */
    width: 4000,
    height: 2250,
    alt: "An open-plan office: desks with monitors and mesh chairs, glass-walled rooms beyond, and daylight from a full-height window.",
  },

  /**
   * The way out. Every hero on this site ends on one, and until there are
   * sections below this one there is nowhere else for it to go — the
   * placeholder pointed at `/#company`, which was the nearest real thing while
   * this page was not itself real.
   */
  cta: "Get in touch",
  ctaHref: `mailto:${contactEmail}`,
} as const;
