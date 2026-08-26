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
   * The section under the photograph, in the owner's own words.
   *
   * **The first facts this page has been given**, and every one of them is his:
   * 2008, a first small studio, a turn towards UX/UI, branding, websites and
   * software from 2020, and a rename to Mardal with new offices. Until this
   * arrived the page carried no year, no headcount and no history, because
   * nothing had been supplied and PRODUCT.md's answer to an unsupplied fact is
   * an absence rather than a plausible guess.
   *
   * That rule has not loosened; it has simply been answered. What is still not
   * here is anything he did NOT say — no team size, no client count, no city for
   * the new offices, no name for what the studio was called before. Every one of
   * those is a sentence a reader would expect next, and every one would be
   * invented. The test that used to assert no year at all now asserts that the
   * only years on the page are these two.
   *
   * One character changed from what he sent: `Mardal ,with` to `Mardal, with`.
   * A misplaced comma is a typo, not a phrasing, and it is the only edit.
   */
  story: {
    title: "Built Over Time",
    paragraphs: [
      "Our story began in 2008, when we opened our first small studio with a lot of enthusiasm and a simple idea: to create meaningful digital work. Over time, that small beginning evolved into something more focused, experienced, and ambitious.",
      "From 2020, we began concentrating more on UX/UI, branding, websites, and software. Today, that journey continues under a new name: Mardal, with new offices, expanded services, and a clearer focus on the work we do and the direction we want to take.",
    ],
  },

  /**
   * Three more rooms, under the history.
   *
   * **In the order they are arranged, left to right**, not the order they were
   * sent. They are placed on columns 1-4, 5-7 and 8-12, and for a while the
   * markup ran glass, window, timber while the page ran glass, timber, window —
   * so the middle picture was last for anything reading the document, and the
   * phone stacked them in an order the desktop never shows.
   *
   * Two upright and one wide, which is what shapes the arrangement: the tall one
   * holds the left for the whole block, the wide one sits across the top right,
   * and the second upright hangs under it and indented, so the group reads as a
   * composition rather than as a row of three.
   *
   * **Each keeps its own proportions.** They are 0.728, 0.854 and 1.5, and
   * forcing the two uprights to a shared ratio would crop one of them to make a
   * pair out of things that are not a pair. The difference is the arrangement's
   * material, not a problem with it.
   *
   * Three rungs each rather than one file, the same reason the plate above has
   * five: these are drawn at about a third to a half of the column, and a phone
   * has no use for 5472 pixels of the wide one. `sizes` names the fraction of
   * the page each occupies, so the browser can pick before layout exists.
   *
   * **The alts describe the rooms and do not say whose they are**, exactly as
   * the plate's does — nothing states that any of these is Mardal's own office,
   * and an `alt` is where an invented fact goes unchecked.
   */
  rooms: [
    {
      name: "glass",
      /** The asset stem. Kept apart from `name`, which is the CSS modifier:
       *  the files are prefixed and the class is not, and building one out of
       *  the other shipped `/glass-700.webp` against `about-glass-700.webp`. */
      file: "about-glass",
      widths: [700, 1050, 1400],
      width: 1397,
      height: 1920,
      /* Left, and the tallest thing in the block. */
      sizes: "(max-width: 48rem) calc(100vw - 2 * clamp(1rem, 4vw, 2.5rem)), 32vw",
      alt: "An office seen through a glass partition at night: desks with monitors under a run of linear pendant lights, and a large plant in the foreground.",
    },
    {
      name: "timber",
      /** The asset stem. Kept apart from `name`, which is the CSS modifier:
       *  the files are prefixed and the class is not, and building one out of
       *  the other shipped `/glass-700.webp` against `about-glass-700.webp`. */
      file: "about-timber",
      widths: [700, 1050, 1400],
      width: 1639,
      height: 1920,
      /* Upright, hanging under the wide one and indented from the right. */
      sizes: "(max-width: 48rem) calc(100vw - 2 * clamp(1rem, 4vw, 2.5rem)), 24vw",
      alt: "A bright open-plan floor: timber desks and a timber-framed glass room, daylight through tall curtained windows.",
    },
    {
      name: "window",
      /** The asset stem. Kept apart from `name`, which is the CSS modifier:
       *  the files are prefixed and the class is not, and building one out of
       *  the other shipped `/glass-700.webp` against `about-glass-700.webp`. */
      file: "about-window",
      widths: [900, 1400, 2000],
      width: 5472,
      height: 3648,
      /* Wide, across the top right. */
      sizes: "(max-width: 48rem) calc(100vw - 2 * clamp(1rem, 4vw, 2.5rem)), 40vw",
      alt: "Desks along a wall of floor-to-ceiling windows, with blinds half drawn and a view over open ground beyond.",
    },
  ],

  /**
   * How the studio works, under the three rooms. The owner's words, verbatim.
   *
   * **The first thing this page says about its people**, and every part of it is
   * his: no layers, no middlemen, direct contact with whoever is doing the work,
   * and a team of engineers, designers, AI researchers and psychologists.
   *
   * What is still absent is what he did not say — how many of any of them, where
   * they are, what "quickly" means in weeks. Those are the sentences a reader
   * expects next and every one would be invented. Note that the disciplines are
   * named WITHOUT counts, which is what keeps them a description of the team
   * rather than a claim about its size.
   *
   * **It says the same thing as the hero's line**, deliberately or not: "Our
   * core team is small on purpose" up there, "Small by choice" here. Two
   * statements of one idea, about a screen apart. His call — it reads as a theme
   * rather than a repeat, and cutting either would be editing his copy — but
   * worth knowing they are the same sentence twice.
   */
  values: {
    title: "Small by choice",
    paragraphs: [
      "No layers. No middlemen. You work directly with the people shaping the strategy, designing the experience, and building the final product.",
      "Our team brings together engineers, designers, AI researchers, and psychologists, people who understand technology, design, and how people think and behave.",
      "We keep the process open, move quickly, and focus on work that creates real value. Expectations are made clear from the start, so everyone stays aligned throughout the project. We believe the best work comes from strong collaboration, clear communication, and relationships built on trust.",
    ],
  },

  /**
   * The products side, under the note on how the studio works. Verbatim.
   *
   * **On white, on the owner's instruction** — "but in white background". The
   * yellow runs from the big photograph to the end of `values`, and this sits
   * after it, so the page has two grounds and this section is the second. The
   * drain was retimed to finish before this arrives rather than under it; see
   * `SectionWash`.
   *
   * The claims here are all his and all unquantified: own products, own tools,
   * testing ideas in the real world. No product is named, no number of them is
   * given, and no outcome is measured — "often translating directly into value
   * for our clients" is the strongest thing said and it says `often`, not a
   * figure. The three products this company does have are named on the homepage;
   * pulling them in here would be a connection nobody asked me to draw.
   */
  venture: {
    title: "AI-native venture studio",
    paragraphs: [
      "We are also a venture studio. We create our own products because building things ourselves keeps us moving beyond the perspective of a consultant or traditional design studio.",
      "Our products are the backbone of how we keep evolving as innovators. They allow us to test ideas in the real world, build our own tools, and move beyond the limitations of relying only on existing platforms — often translating directly into value for our clients.",
      "AI is changing how creative work gets made, and we want to show that it can be an enabler of better creative thinking, not a shortcut around it. The aim is real value, not simply adding a layer of AI to existing workflows.",
    ],
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
