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

  /* One line now, set here rather than in the page: where a line turns is a
     decision about the copy, not about the markup.

     Owner's words, and they change what the page is about. "Systems we built /
     and handed over" was written from Mardal's side — what was made, and that
     it left. "Customer stories" is written from the reader's: the entries are
     the customer's, and the reader is here to find one that looks like them.
     The cards were already going that way, headed by sector and asking who it
     was for before what it was.

     Broken after "Customer", and broken here rather than left to wrap: the two
     words stack, which is what lets the type go up. Eight characters is the
     longest line now against a measure cut for twenty-one, and that spare
     measure is exactly what the size spends. */
  titleLines: ["Customer", "stories"],

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

  /* What a card's two lines are called.
     They were three — Replaced, Does now, Client owns — set to answer the hero's
     promise in its own three parts. Owner's change: who it was for, then what it
     was. The hero still promises the three, and the description is where they go
     now rather than in a column each.

     **Client is the field this site is not yet allowed to fill.** PRODUCT.md
     records that per-client sign-off for naming those companies in public was
     never recorded, so it stays a bracket until that decision is made — the one
     slot on this page where a plausible guess would do real damage. */
  fields: {
    client: "Client",
    description: "Description",
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
 * so every card carries a plate of its own and no two are alike.
 *
 * There is no title field and that is deliberate rather than missing: the card
 * is headed by its sector. A project has no name that can be written here — the
 * name is the client's, and naming them is the decision that has not been made.
 *
 * When the real entries arrive: fill the brackets, or delete this array and let
 * the empty state stand. The one thing that must never happen is a bracket
 * reaching the page — a plausible guess in one of these is worse than a gap.
 */
export const clientEntries = [
  { slug: "entry-01", sector: "finance" },
  { slug: "entry-02", sector: "finance" },
  /* The one entry with a page behind it. `story` is what makes the card a link:
     everything else on this index is a card that goes nowhere, because nowhere
     is where it should go until someone has written the story. */
  { slug: "healthcare-office-website", sector: "healthcare", story: true },
  { slug: "entry-04", sector: "healthcare" },
  { slug: "entry-05", sector: "manufacturing" },
  { slug: "entry-06", sector: "automotive" },
  { slug: "entry-07", sector: "retail" },
  { slug: "entry-08", sector: "logistics" },
].map((entry) => ({
  ...entry,
  client: "[Client name]",
  description:
    "[What the system replaced, what it does now, and what the client owns]",
  /* **A placeholder off someone else's server, and it must not ship.**
   *
   * Owner asked for real pictures in the box to judge the card against, and
   * there are none: this repo holds no project photography, and PRODUCT.md
   * forbids inventing what these systems look like. So these are stock frames
   * from picsum.photos, seeded per entry so each card draws a different one and
   * the same one every reload.
   *
   * Three reasons this is temporary and not a decision:
   *   — stock photography is on this site's rejected list. It reads as generic
   *     on sight, and every one of these is a photograph of something that has
   *     nothing to do with the work.
   *   — it is a live request to a third party on every card, which is a network
   *     dependency this site does not otherwise have.
   *   — 640x360 is 16:9, which is the plate's ratio, so a real screenshot drops
   *     into the same box later without the grid moving.
   *
   * What replaces them is a screenshot of the delivered system, cleared for
   * publication alongside the client name. Until then the drawn plate this
   * displaced is one commit back and is the honest version.
   */
  image: `https://picsum.photos/seed/mardal-${entry.slug}/640/360`,
}));

export type ClientEntry = (typeof clientEntries)[number];

/**
 * The pilot story. One project written out in full, so the shape of a story
 * page can be judged before six more are poured into it.
 *
 * **What it is, is the owner's statement about his own work: a website built
 * for a healthcare office.** That is a description of the job rather than a
 * claim about a client, which is the only kind of sentence this page may make
 * while per-client sign-off is not on file. The client stays a bracket, no
 * outcome is claimed, and no number appears anywhere — PRODUCT.md records zero
 * quantified results and none may be invented to fill a page out.
 *
 * Everything with a bracket round it is a slot. The headings are not: they are
 * the three the index has promised since the hero was written, asked here at
 * length instead of in a column.
 *
 * The pictures are stock and must go. See `image` above for why.
 */
export const pilotStory = {
  slug: "healthcare-office-website",
  sector: "healthcare",

  /* Two authored lines, the way every heading on this site is set — where the
     line turns is a decision about the copy, not about the markup. */
  titleLines: ["A website for a", "healthcare office"],

  /* What the tab says. Not the heading: a heading can be two lines and a title
     cannot, and "A website for a healthcare office — Mardal" is what a shared
     link has to read as. */
  title: "A website for a healthcare office",

  lede: "[One line: what the office needed, and what was built for it.]",

  cover: "https://picsum.photos/seed/mardal-healthcare-cover/1600/900",

  /* The facts, in the order a reader asks for them: who it was for, what
     sector, what the job was, when it left. Every value is a slot. */
  facts: [
    { label: "Client", value: "[Client name]" },
    { label: "Sector", value: "Healthcare" },
    { label: "Work", value: "[What was built]" },
    { label: "Handed over", value: "[Month, year]" },
  ],

  /* The three questions the whole page exists to answer, and the same three the
     hero has been promising: what it replaced, what it does now, what the
     client owns. On a card they are one line each; here they have room. */
  sections: [
    {
      id: "replaced",
      heading: "What it replaced",
      body: "[What the office was working with before, and what about it did not work.]",
    },
    {
      id: "now",
      heading: "What it does now",
      body: "[What the site does for the office and for the people who visit it.]",
    },
    {
      id: "owns",
      heading: "What the client owns",
      body: "[The source, the content, the domain, the hosting — named, because handover is the part of this the positioning argues about.]",
    },
  ],

  gallery: [
    "https://picsum.photos/seed/mardal-healthcare-a/1200/900",
    "https://picsum.photos/seed/mardal-healthcare-b/1200/900",
  ],

  backLabel: "All customer stories",
  cta: "Get in touch",
} as const;
