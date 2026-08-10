/**
 * Clients.
 *
 * The page exists before the studies do. That is deliberate and it is the same
 * order the Blog was built in: the opening is designed first, the pieces land
 * into it afterwards.
 *
 * Called Case Studies until the menu it hangs off stopped being a panel: one
 * word in the bar, straight here. The route and the drawing's seed still read
 * `case-studies`, which is the only place that name survives.
 *
 * **Nothing in here names a client, and nothing may until the owner says so.**
 * PRODUCT.md records that the delivered archive — EN NUR, Spitex Schwab AG,
 * Stolzbau, Henor, ANDI SPORT, ZEN, Jetonikeramika — may now be described as
 * Mardal's work, but that per-client sign-off for naming those companies in
 * public was never separately recorded. So the hero speaks about the work and
 * not about who it was for. When the answer comes, it changes the studies, not
 * this file.
 *
 * ArvenaAI does not belong here either. The menu promised an ArvenaAI case study
 * at an anchor that existed on no page — that anchor is gone now, and it must
 * not be replaced by a link to this page: ArvenaAI is an unreleased in-house
 * product and PRODUCT.md is explicit that it must never be written as a
 * delivered client outcome. Products is where it lives.
 */
/**
 * The unfiltered view, named once so the route, the page and the filter cannot
 * disagree about it. Not one of the seven and deliberately not in that list —
 * "all" is a state the page can be in rather than a sector anyone works in, and
 * putting it in `industries` would put it in the header menu too.
 */
export const ALL_SECTORS = "all";

export const caseStudies = {
  /* The seed the hero's drawing is generated from, and the route it is served
     at. Deliberately not renamed with the title: the drawing is derived from
     this string, so changing it would redraw the page for the sake of a word in
     a URL. */
  slug: "case-studies",

  /* What the tab says, and it has to be the word that was clicked to get here.
     The menu entry is "Clients" now — one link straight to this page. */
  title: "Clients",
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

  /* The filter's own words. "All" is not a sector, so it is named here rather
     than smuggled into the list of seven. */
  filterAll: "All",
  filterLabel: "Filter delivered work by sector",

  /* What a card's three lines are called. They are the hero's promise broken
     into its parts — the support line above already says the page will tell you
     what each one replaced, what it does now and what the client owns, so the
     card answers in the same three words rather than inventing headings. */
  fields: {
    replaced: "Replaced",
    now: "Does now",
    owns: "Client owns",
  },

  /* Read when a sector has nothing in it. The same voice the Blog's empty state
     uses, and true of every sector today. */
  empty: {
    title: "Nothing published yet.",
    copy:
      "The work is delivered; the writing is not. Entries land here as they are written.",
  },
} as const;

/**
 * PROTOTYPE DATA — slots, not work. **Never publish a bracket.**
 *
 * Every field below is a placeholder, and it has to be. PRODUCT.md records that
 * the delivered archive may be described as Mardal's work but that per-client
 * sign-off for naming those companies in public was never recorded — and what
 * those systems actually replaced is not written down anywhere this file could
 * read even if the names were cleared. So nothing here describes a real
 * project, and the array exists for one reason: so the filter above it can be
 * looked at and judged before anyone writes eight case studies into a shape
 * nobody has approved.
 *
 * The spread across sectors is arbitrary and deliberately uneven — two sectors
 * carry nothing, so the per-sector empty state is on screen and can be judged
 * too. It is not a claim about where the work was done.
 *
 * `slug` is what the drawing is generated from, exactly as a blog piece's is,
 * so every card carries a mark of its own and no two are alike.
 *
 * When the real entries arrive: fill the brackets, or delete this array and let
 * the empty state stand. The one thing that must never happen is a bracket
 * reaching the page — a plausible guess in one of these is worse than a gap.
 */
export const clientEntries = [
  { slug: "entry-01", sector: "finance" },
  { slug: "entry-02", sector: "finance" },
  { slug: "entry-03", sector: "healthcare" },
  { slug: "entry-04", sector: "healthcare" },
  { slug: "entry-05", sector: "manufacturing" },
  { slug: "entry-06", sector: "automotive" },
  { slug: "entry-07", sector: "retail" },
  { slug: "entry-08", sector: "logistics" },
].map((entry, index) => ({
  ...entry,
  title: `[Project ${String(index + 1).padStart(2, "0")}]`,
  replaced: "[What the system replaced]",
  now: "[What it does now]",
  owns: "[What the client owns after handover]",
}));

export type ClientEntry = (typeof clientEntries)[number];
