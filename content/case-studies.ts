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

  /* The record, and it lives down the left of the page rather than in a row
     across it. What a reader checks before deciding to read: who it was for,
     what sector, what was built, which service it was.

     "Handed over" was a fifth and the owner took it out. It read as a date
     field, and a date is the one thing on this record that could not be a slot
     for long — a bracket where a month should be reads as an oversight rather
     than a decision, and the real one is not written down anywhere this repo
     can reach. Four facts that can all be filled honestly beat five where one
     is waiting on an archive nobody has.

     Every value here is still a slot. Client is the one that cannot be filled
     at all until per-client sign-off exists. */
  facts: [
    { label: "Client", value: "[Client name]" },
    { label: "Sector", value: "Healthcare" },
    { label: "Work", value: "[What was built]" },
    { label: "Services", value: "[Which of the five]" },
  ],

  /* The reading, down the right. Three states in the order the hero has been
     promising since it was written — what it replaced, what it does now, what
     the client owns — with the pictures set between them rather than collected
     at either end.

     **One picture each, and three paragraphs each.** Two other arrangements
     were built and rejected on the page before this one, and both are recorded
     here rather than left to be rediscovered: a passage carrying two pictures
     made its own entry half as long again as its neighbours (879px against
     618), so the section stopped reading as a list of three; and a passage
     carrying none turned that entry into a band of text across the width, which
     is a different kind of row rather than a quieter one. Owner's call both
     times. Same shape three times, and the reading is what differs.

     `paragraphs` is a list because it was `body` and `more` and then needed a
     third, which is a rename in two files if the count is in the field names
     and nothing at all if it is not. Every one is a slot and has to be: the
     office cannot be named until sign-off is on file, and nothing about what it
     ran on before is written down anywhere this repo can read. */
  passages: [
    {
      id: "replaced",
      heading: "What it replaced",
      paragraphs: [
        "[What the office was working with before. Two or three sentences on the state of things — where the information lived, who had to touch it, and what a patient had to do to get an answer. State it, do not complain about it.]",
        "[The second paragraph: what that cost them week to week, and which part of it was the reason they picked up the phone.]",
        "[The third paragraph: what they had already tried before they called, and the reason it did not hold.]",
      ],
      image: "https://picsum.photos/seed/mardal-healthcare-a/1600/1000",
    },
    {
      id: "now",
      heading: "What it does now",
      paragraphs: [
        "[What the site does for the office and for the people who visit it. Name the things that changed for someone outside the building, not the technology that changed inside it.]",
        "[The second paragraph: what a patient can do now that they could not do at all, and what the office stopped doing by hand.]",
        "[The third paragraph: what the office does with the time it used to spend on this, and what it now knows that it could not see before.]",
      ],
      image: "https://picsum.photos/seed/mardal-healthcare-b/1600/1000",
    },
    {
      id: "owns",
      heading: "What the client owns",
      paragraphs: [
        "[Named one by one — the repository and who holds it, the domain and the DNS, the hosting account and the bill, the content and who can change it without calling anyone.]",
        "[The second paragraph: what they can change without calling anyone, and who they would call if they wanted to.]",
        "[The third paragraph: what keeps running if they never call again — what renews itself, what does not, and where that is written down for whoever comes next.]",
      ],
      /* This one has twice been argued out of a picture and twice been given one
         back: what the client owns is a list of holdings, and a holding is not a
         thing a photograph can show. Owner's call, both times, and the second
         time was after seeing the alternative on the page. Recorded so it is not
         re-litigated a third time — the real frame here is a shot of the handover
         itself, the repository or the account in their name. */
      image: "https://picsum.photos/seed/mardal-healthcare-c/1600/1000",
    },
  ],

  /* The right half of the opening. Stock, like every other picture on this page
     and under the same guard — the real one is a shot of the delivered site.
     Cut tall rather than wide: it fills a half-window column, so a landscape
     frame would crop to its middle strip and lose whatever it was of. */
  heroImage: "https://picsum.photos/seed/mardal-healthcare-hero/1200/1600",

  /* The plate under the record, and the biggest thing on the page. It comes
     after the four facts and before the account: the record says what the job
     was, this shows it, and the reading explains it.

     Cut wide — it stands in a column rather than a window, so a tall frame
     would crop to a strip of its middle. */
  plate: "https://picsum.photos/seed/mardal-healthcare-plate/2000/1125",

  /* Three short paragraphs about the client company, side by side above the
     plate. No headings: three labels over three thirty-word paragraphs is more
     label than paragraph, and the row reads as one statement in three parts.

     **Back to slots, and they have to be.** These were three paragraphs about
     Mardal, which could be written because the company's own position is
     settled and owner-confirmed. About the client they cannot: the office
     cannot be named until per-client sign-off is on file, and nothing about who
     they are, how they ran or what they needed is written down anywhere this
     repo can reach. A plausible description of a healthcare practice would read
     perfectly and be an invention.

     What each slot asks for is deliberate — who they are, how they ran, what
     they needed — because that is the order a reader meets a stranger in, and
     it is the part of the story the passages below do not tell. */
  about: [
    "[Who the office is: what kind of practice it is, who it serves and roughly how big it is — described, not named, until sign-off is on file.]",
    "[How it ran before: where the information lived, who kept it, and what somebody outside the building had to do to reach it.]",
    "[What it needed: the thing that made them look for help, stated the way they would state it rather than the way a supplier would.]",
  ],

  backLabel: "All customer stories",
  cta: "Get in touch",
} as const;
