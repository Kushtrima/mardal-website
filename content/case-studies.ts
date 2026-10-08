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

import type { PageHeroContent } from "../components/services/ServicesHero";

/**
 * **The opening is the services page's, in the clients' words** — owner,
 * 2026-10-08: "change the hero of Client to be same design as in product and
 * service that style of course add a appropriate text", then his own words
 * for both: "use this text for title: … and this for paragraf: …". Verbatim;
 * only his " - " set as the site's spaced dash and his apostrophe curled, as
 * the services' note has it.
 */
export const clientsHero = {
  label: "Clients",
  /* Three lines, broken where the sentences turn: the second, the longest,
     ends a few pixels short of the edge (measured), the first set in to the
     second rule as on the other two pages. */
  titleLines: [
    "Every project here started",
    "with a real problem. Every one of them",
    "ended with a measurable result",
  ],
  titleStop: ".",
  note: "We don’t show work to impress. We show it to prove a point — that strategy, design, and execution working together produce real outcomes most agencies only pitch about, but rarely deliver.",
} as const satisfies PageHeroContent;

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

  /* What a card's two lines are called.
     They were three — Replaced, Does now, Client owns — set to answer the hero's
     promise in its own three parts. Owner's change: who it was for, then what it
     was. The hero still promises the three, and the description is where they go
     now rather than in a column each.

     **Client is the field this site is not yet allowed to fill.** PRODUCT.md
     records that per-client sign-off for naming those companies in public was
     never recorded, so it stays a bracket until that decision is made — the one
     slot on this page where a plausible guess would do real damage. */
  /**
   * **FILTERS, under the opening** — owner, 2026-10-08, with a picture of
   * "-¦- FILTERS": "under the hero add this then when click to open …", then
   * "i want when open menu to open on the left horisontally as menu, then to
   * be selectd only All and active with red underline". The seven are his
   * list, in his order, after All; All is chosen when the page arrives. It
   * replaced the rail down the left that held the same seven (owner: remove
   * it).
   *
   * The seven read as the five services split where a service covers two
   * distinct crafts. They are deliberately NOT generated from the services
   * list: that list is what Mardal sells and this one is what it has made.
   */
  filters: {
    /* In capitals here, as his picture has it, rather than by the stylesheet. */
    button: "FILTERS",
    label: "Filter the work",
    /* Every entry; first in the row, and chosen when the page arrives. */
    all: "All",
    items: [
      "UX/UI Design",
      "Branding",
      "Websites",
      "Applications",
      "Software",
      "CRM",
      "AI & Automation",
    ],
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
/**
 * ⚠ **INVENTED NAMES. NOT MARDAL CLIENTS. MUST NOT SHIP.**
 *
 * Owner asked on 2026-08-25 for names on the cards instead of `[Client name]`,
 * so the layout could be judged against real-looking words rather than
 * brackets. These eight are made up. Not one of them is a company Mardal has
 * worked for, and none of them is a company at all as far as anyone here knows.
 *
 * The reason they cannot ship is not that they are placeholders — it is what
 * page they are on. This is Clients, under a heading that reads "Customer
 * stories" and a line promising "delivered work". Eight invented companies
 * there are not lorem ipsum; they are a claimed client list, and a reader has
 * no way to tell them from the real archive.
 *
 * The real archive is in PRODUCT.md — EN NUR, Spitex Schwab AG, Stolzbau,
 * Henor, ANDI SPORT, ZEN, Jetonikeramika — and it may be DESCRIBED as Mardal's
 * work. What was never recorded is per-client sign-off for naming those
 * companies in public. That is still the outstanding decision, and it is the
 * only thing that replaces this list.
 *
 * `tests/rendered-html.test.mjs` pins all eight, next to the assertion that
 * pins the stock photographs, for the same reason: so publishing this page
 * means deleting a test on purpose rather than forgetting one.
 *
 * ⚠ **The disciplines on each entry are invented too**, and for the same reason:
 * the rail filters on them, so the filter needs something to filter. They are
 * spread so every one of the seven holds between two and four entries — a
 * filter whose every view holds one card is the failure the sector routes had,
 * and it is a design decision being judged here, not a record of what was
 * built. They go when the real ones arrive, with the names.
 *
 * Locations are deliberately unspecific — owner's word — and they are countries
 * rather than cities or addresses. PRODUCT.md puts the buyer in DACH and the
 * company in Kosovo, so a country is the largest true thing that can be said
 * while the names under them are not.
 */
export const clientEntries = [
  {
    slug: "entry-01",
    sector: "finance",
    name: "Nordvik",
    location: "Switzerland",
    disciplines: ["UX/UI Design", "Branding", "Websites"],
  },
  {
    slug: "entry-02",
    sector: "finance",
    name: "Alturi",
    location: "Germany",
    disciplines: ["Software", "CRM"],
  },
  /* The one entry with a page behind it. `story` is what makes the card a link:
     everything else on this index is a card that goes nowhere, because nowhere
     is where it should go until someone has written the story. */
  {
    slug: "healthcare-office-website",
    sector: "healthcare",
    story: true,
    name: "Solvei",
    location: "Switzerland",
    disciplines: ["UX/UI Design", "Websites"],
  },
  {
    slug: "entry-04",
    sector: "healthcare",
    name: "Marren",
    location: "Austria",
    disciplines: ["Applications", "Software"],
  },
  {
    slug: "entry-05",
    sector: "manufacturing",
    name: "Brekk",
    location: "Germany",
    disciplines: ["Software", "AI & Automation"],
  },
  {
    slug: "entry-06",
    sector: "automotive",
    name: "Vantor",
    location: "Kosovo",
    disciplines: ["CRM", "Applications"],
  },
  {
    slug: "entry-07",
    sector: "retail",
    name: "Lumea",
    location: "Switzerland",
    disciplines: ["UX/UI Design", "Branding", "Websites"],
  },
  {
    slug: "entry-08",
    sector: "logistics",
    name: "Kestrel",
    location: "Germany",
    disciplines: ["AI & Automation", "Software", "Applications"],
  },
].map((entry) => ({
  ...entry,
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
   *   — 640x360 is 16:9. The plate is no longer that shape — it is 70% as wide
   *     at the same height since 2026-08-25, so `object-fit: cover` crops the
   *     sides — but the intrinsic size is what reserves the box before the
   *     picture arrives, and a real screenshot at any 16:9 size drops in
   *     without the grid moving.
   *
   * What replaces them is a screenshot of the delivered system, cleared for
   * publication alongside the client name. Until then the drawn plate this
   * displaced is one commit back and is the honest version.
   */
  /* Square since 2026-10-08, when the cards took three shapes (wide, box,
     portrait): one square frame crops to any of them. */
  image: `https://picsum.photos/seed/mardal-${entry.slug}/1200/1200`,
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
/** The entry the story is told for: its card's name heads the page, and its
 *  services are the record's. */
const pilotEntry = clientEntries.find((entry) => "story" in entry)!;

export const pilotStory = {
  slug: "healthcare-office-website",
  sector: "healthcare",

  /* What the tab says, and what a shared link reads as. The page's big
     heading is the entry's name (below), as the card it was opened from. */
  title: "A website for a healthcare office",

  /* The page's big heading: the name on the card it was opened from. */
  name: pilotEntry.name,

  lede: "[One line: what the office needed, and what was built for it.]",

  /**
   * **The page, a new approach — owner, 2026-10-08**, from three references:
   * "hero with big images", then the project in a paragraph with its record
   * under it, "then changellens etc", then a showcase of the delivered pages
   * one after the next. Every bracket is still a slot: the office cannot be
   * named until per-client sign-off is on file, and nothing about the job is
   * written down anywhere this repo can read — no date, no tools, no address
   * for the live site, no logo. Where a reference showed one of those, this
   * page shows what it can say truthfully or leaves the slot.
   */

  /* The opening: one picture across the whole screen. Stock, like every
     picture on this page — the real one is a shot of the delivered site. */
  heroImage: "https://picsum.photos/seed/mardal-healthcare-hero/2400/1500",

  /* The project in a few sentences, set large beside its name. */
  summary:
    "[Two or three sentences: who the office is and what the project was — what Mardal built for them, and what it had to make easier. Described, not named, until sign-off is on file.]",

  /* The record under it, two by two. Industry and services are what the
     entry already says; the challenge and the solution are slots. */
  record: [
    { label: "INDUSTRY:", value: "Healthcare" },
    { label: "SERVICES:", value: pilotEntry.disciplines.join(", ") },
    { label: "CHALLENGE:", value: "[The problem, in one line.]" },
    { label: "SOLUTION:", value: "[What was built, in one line.]" },
  ],

  /* The way to the delivered site. No address is on file, so it stands
     without a link until one is. */
  live: { label: "LIVE WEBSITE", href: null as string | null },

  /* The account, under the record — what it replaced, what it does now, what
     the client owns: the three the Clients page has promised since it was
     written. Every paragraph is a slot. */
  passages: [
    {
      id: "replaced",
      heading: "What it replaced",
      paragraphs: [
        "[What the office was working with before. Two or three sentences on the state of things — where the information lived, who had to touch it, and what a patient had to do to get an answer. State it, do not complain about it.]",
        "[The second paragraph: what that cost them week to week, and which part of it was the reason they picked up the phone.]",
      ],
    },
    {
      id: "now",
      heading: "What it does now",
      paragraphs: [
        "[What the site does for the office and for the people who visit it. Name the things that changed for someone outside the building, not the technology that changed inside it.]",
        "[The second paragraph: what a patient can do now that they could not do at all, and what the office stopped doing by hand.]",
      ],
    },
    {
      id: "owns",
      heading: "What the client owns",
      paragraphs: [
        "[Named one by one — the repository and who holds it, the domain and the DNS, the hosting account and the bill, the content and who can change it without calling anyone.]",
        "[The second paragraph: what keeps running if they never call again, and where that is written down for whoever comes next.]",
      ],
    },
  ],

  /* The delivered pages, one after the next, on a dark ground; the pages in
     small down the right, the way back and forward on the left. Stock frames
     standing in for screenshots of the delivered site. */
  showcase: {
    title: "The website, page by page",
    previous: "Previous",
    next: "Next",
    page: "Page",
    pages: [
      "https://picsum.photos/seed/mardal-healthcare-page-1/1600/1000",
      "https://picsum.photos/seed/mardal-healthcare-page-2/1600/1000",
      "https://picsum.photos/seed/mardal-healthcare-page-3/1600/1000",
      "https://picsum.photos/seed/mardal-healthcare-page-4/1600/1000",
      "https://picsum.photos/seed/mardal-healthcare-page-5/1600/1000",
      "https://picsum.photos/seed/mardal-healthcare-page-6/1600/1000",
    ],
  },

  /* The page's foot: Back on the left, Next Project on the right — owner,
     2026-10-08: "in the end to have button on the right Next Project and on
     the left to be Back". This is the only story written, so there is no
     next one to go to yet: it stands without a link until there is. */
  way: {
    label: "More projects",
    back: "Back",
    next: "Next Project",
    nextHref: null as string | null,
  },
} as const;
