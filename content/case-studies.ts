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
  /* His new words for it, 2026-10-10, as he wrote them. */
  note: "We don’t show work to impress. We show it to demonstrate how strategy, design, and execution come together to deliver real results, not just promises.",
} as const satisfies PageHeroContent;

export const caseStudies = {
  /* The seed the hero's drawing is generated from, and the route it is served
     at. Deliberately not renamed with the title: the drawing is derived from
     this string, so changing it would redraw the page for the sake of a word in
     a URL. */
  slug: "case-studies",

  /* What the tab says: the word that was clicked to get here first — the
     menu entry is "Clients" — then what is here, as people search for it
     (SEO-PLAN.md, step 1.4). The line for search results names the real projects. */
  title: "Clients: Case Studies in Websites and Software",
  lede:
    "Case studies of websites and software Mardal built for clients in Switzerland and Kosovo: Spitex Schwab AG in Bern, En-Nur and Jetonikeramika.",

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
 * **The delivered work, kept apart from the placeholders** — owner,
 * 2026-10-11: "add one project … so i have this project also in my personal
 * portfolio". Real, and named on his word: PRODUCT.md has the archive cleared
 * to be named as Mardal's work since 2026-08-05. Not in `clientEntries`,
 * because About borrows those eight as invented examples and a real client
 * must not land among them.
 *
 * Its disciplines are those of the rail's seven its own page bears out —
 * the product design and the custom Laravel application — and CRM on the
 * owner's word (2026-10-11: "also at filter add at Software, Crm"), so the
 * filter finds it under all three. Its picture is his, the same as its
 * page's opening (owner, 2026-10-11: "for hero banner and for the cover
 * image in galler[y]").
 */
export const deliveredEntries = [
  {
    slug: "en-nur",
    sector: "community",
    story: true,
    name: "En-Nur",
    location: "Switzerland",
    disciplines: ["UX/UI Design", "Software", "CRM"],
    image: "/en-nur-hero-2376.webp",
    imageSrcSet: "/en-nur-hero-1200.webp 1200w, /en-nur-hero-2376.webp 2376w",
  },
  /* The second — owner, 2026-10-11: "now we have new one:
     Jetonikeramika". Its disciplines are the two of the rail's seven his
     page bears out: the product design, and the website it is. Its picture
     is his, the same as its page's opening — since 2026-10-16 his
     jetonicover64.avif ("use this image for cover in jetonikeramika"). */
  {
    slug: "jetonikeramika",
    sector: "retail",
    story: true,
    name: "Jetonikeramika",
    location: "Kosovo",
    disciplines: ["UX/UI Design", "Websites"],
    image: "/jetonikeramika-hero-1920.avif",
    imageSrcSet: "/jetonikeramika-hero-1200.avif 1200w, /jetonikeramika-hero-1920.avif 1920w",
  },
  /* The third — owner, 2026-10-11: "now this project:
     https://kushtrimarifi.com/work/spitex.html". Named as recorded, legal
     suffix included. Its disciplines are the two of the rail's seven his
     page bears out: the product design, and the website it is. Its picture
     is his, the same as its page's opening ("here you have image for cover
     and herobanner"). */
  {
    slug: "spitex-schwab",
    sector: "healthcare",
    story: true,
    name: "Spitex Schwab AG",
    location: "Switzerland",
    disciplines: ["UX/UI Design", "Websites"],
    image: "/spitex-schwab-hero-2000.webp",
    imageSrcSet: "/spitex-schwab-hero-1200.webp 1200w, /spitex-schwab-hero-2000.webp 2000w",
  },
  /* The fourth — owner, 2026-10-15: "now we have new project we have a
     logo", from https://kushtrimarifi.com/work/baren.html. A brand identity,
     so of the rail's seven it is Branding alone. Its picture is his, the
     same as its page's opening ("use this image for cover"). */
  {
    slug: "baren",
    sector: "construction",
    story: true,
    name: "Bären Baugruppe AG",
    location: "Switzerland",
    disciplines: ["Branding"],
    image: "/baren-hero-2000.webp",
    imageSrcSet: "/baren-hero-1200.webp 1200w, /baren-hero-2000.webp 2000w",
  },
  /* The fifth — owner, 2026-10-15: "now continue with this new project
     branding", from https://kushtrimarifi.com/work/riesen.html. Branding
     alone, as Bären is. Its picture is his, the same as its page's opening
     ("use this image for cover"). */
  {
    slug: "riesen",
    sector: "construction",
    story: true,
    /* With its AG — owner, 2026-10-15: "also after name add AG". */
    name: "Riesen Holzbau AG",
    location: "Switzerland",
    disciplines: ["Branding"],
    image: "/riesen-hero-2560.webp",
    imageSrcSet: "/riesen-hero-1200.webp 1200w, /riesen-hero-2560.webp 2560w",
  },
  /* The sixth — owner, 2026-10-16: "now lets add new project", from
     https://kushtrimarifi.com/work/wmk.html. A brand identity and its system,
     so of the rail's seven it is Branding alone. Its picture is his, the same
     as its page's opening ("use this for cover"). */
  {
    slug: "wmk",
    sector: "education",
    story: true,
    name: "WMK",
    location: "Switzerland",
    disciplines: ["Branding"],
    image: "/wmk-hero-2000.jpg",
    imageSrcSet: "/wmk-hero-1200.jpg 1200w, /wmk-hero-2000.jpg 2000w",
  },
  /* The seventh — owner, 2026-10-21: "now you need to woek on new project
     this is the website live", https://dora-tec.ch/, whose footer credits
     us. A website, so of the rail's seven it is the two a website is: the
     product design and the website. Its picture is his, the same as its
     page's opening (2026-10-21: "use this for cover first"). */
  {
    slug: "doratec",
    sector: "construction",
    story: true,
    name: "Doratec GmbH",
    location: "Switzerland",
    disciplines: ["UX/UI Design", "Websites"],
    image: "/doratec-hero-1920.avif",
    imageSrcSet: "/doratec-hero-1200.avif 1200w, /doratec-hero-1920.avif 1920w",
  },
];

/** **Hidden for now** — owner, 2026-10-21: "Hide this project: Riesen Holzbau
 *  AG at the moment", then "now hide lso Baren logo project" and "hide  WMK also
 *  from mardal". A project named here has no card, no page and no line in
 *  the sitemap, and the homepage fails its build if it names one. Its entry
 *  above, its story below and its pictures stay as they are, so taking it off
 *  this list, and putting it back on the homepage (`selectedWork` in
 *  content/home.ts), shows it again. */
export const hiddenProjects: readonly string[] = ["riesen", "baren", "wmk"];

/** Every card on the Clients page: the delivered work and nothing else —
 *  owner, 2026-10-15: "remove the samples project in the clients page leave it
 *  only what are active those 3" — less any hidden for now. The eight
 *  placeholders above stay in the file because About borrows their names and
 *  the pilot story is built on one. */
export const clientsWork = deliveredEntries.filter(
  (entry) => !hiddenProjects.includes(entry.slug),
);

/** One project written out in full — the shape every story page takes. */
export type Story = {
  readonly slug: string;
  /** What the tab says, and what a shared link reads as. */
  readonly title: string;
  /** The page's big heading: the name on the card it was opened from. */
  readonly name: string;
  /** Beside the red square in the opening, and first in the record. */
  readonly industry: string;
  readonly lede: string;
  readonly heroImage: string;
  /** A picture of our own at its widths; a stock frame is offered at two
   *  widths from its address, so it needs none. */
  readonly heroSrcSet?: string;
  /** Its link-preview picture, 1200×630 JPEG cut from the cover — what
   *  WhatsApp, LinkedIn and Facebook show (SEO-PLAN.md, step 1.4). */
  readonly ogImage?: string;
  readonly summary: string;
  readonly record: readonly { readonly label: string; readonly value: string }[];
  readonly live: { readonly label: string; readonly href: string | null };
  readonly passages: readonly {
    readonly id: string;
    readonly heading: string;
    readonly paragraphs: readonly string[];
  }[];
  readonly showcase: {
    readonly title: string;
    readonly previous: string;
    readonly next: string;
    readonly page: string;
    /** Each page and what it shows. A screenshot of our own says what is on
     *  it, for Google Images and a screen reader; a stock frame says nothing
     *  (SEO-PLAN.md, step 1.6). Its width and height are the file's own:
     *  they decide its shape on the page (a wide one runs from line to line)
     *  before it has loaded, and a test reads each file to keep them true. */
    readonly pages: readonly {
      readonly src: string;
      readonly width: number;
      readonly height: number;
      readonly alt: string;
    }[];
  };
  readonly way: {
    readonly label: string;
    readonly back: string;
    readonly next: string;
    readonly nextHref: string | null;
  };
};

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
 * Everything with a bracket round it is a slot. The headings are not: since
 * 2026-10-11 they are Situation, Challenge, Research and Solution (the
 * owner's), in place of the three the index had promised.
 *
 * The pictures are stock and must go. See `image` above for why.
 */
/** The entry the story is told for: its card's name heads the page, and its
 *  services are the record's. */
const pilotEntry = clientEntries.find((entry) => "story" in entry)!;

export const pilotStory = {
  slug: "healthcare-office-website",
  industry: "Healthcare",

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

  /* The record under it, two by two — owner, 2026-10-11: "here we need to
     have industry, sevice, location and stack" (the challenge and the
     solution moved down, into the account). Industry, services and location
     are what the entry already says; nothing about the tools is on file, so
     the stack is a slot. */
  record: [
    { label: "INDUSTRY:", value: "Healthcare" },
    { label: "SERVICES:", value: pilotEntry.disciplines.join(", ") },
    { label: "LOCATION:", value: pilotEntry.location },
    { label: "STACK:", value: "[What it was built with.]" },
  ],

  /* The way to the delivered site. No address is on file, so it stands
     without a link until one is. */
  live: { label: "LIVE WEBSITE", href: null as string | null },

  /* The account, under the record: situation, challenge, research, solution
     — owner, 2026-10-11, in place of what it replaced / what it does now /
     what the client owns: challenge and solution moved down from the record,
     "more professinally to add also Situation or problem" before them, then
     "yes add research" between the two. Every paragraph is a slot, and the
     research is only what was actually done: no invented interviews or
     numbers. */
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "[Where the office stood before the project. Two or three sentences on the state of things — who they are, where the information lived, who had to touch it, and what a patient had to do to get an answer. State it, do not complain about it.]",
        "[The second paragraph: who the website is for, and what they came to it for.]",
      ],
    },
    {
      id: "challenge",
      heading: "Challenge",
      paragraphs: [
        "[The problem the project had to solve: what it cost the office week to week, and which part of it was the reason they picked up the phone.]",
        "[The second paragraph: what made it hard — the constraint, the deadline, or what had to keep working while it changed.]",
      ],
    },
    {
      id: "research",
      heading: "Research",
      paragraphs: [
        "[What was looked at before anything was designed, and how: conversations with the office, a review of the old site, the sites patients compare it with, any visitor data on file. Only what actually happened.]",
        "[The second paragraph: what the research showed, and which finding shaped the solution most.]",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "[What Mardal built, and the decisions that mattered. Name the things that changed for someone outside the building, not the technology that changed inside it.]",
        "[The second paragraph: what a patient can do now that they could not do at all, what the office stopped doing by hand, and what the client owns and keeps running on its own.]",
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
    pages: [1, 2, 3, 4, 5, 6].map((n) => ({
      src: `https://picsum.photos/seed/mardal-healthcare-page-${n}/1600/1000`,
      width: 1600,
      height: 1000,
      alt: "",
    })),
  },

  /* The page's foot: Back on the left, Next Project on the right — owner,
     2026-10-08: "in the end to have button on the right Next Project and on
     the left to be Back". Next Project stands without a link until it is
     given one. */
  way: {
    label: "More projects",
    back: "Back",
    next: "Next Project",
    nextHref: null as string | null,
  },
} as const satisfies Story;

/**
 * **En-Nur** — owner, 2026-10-11: "analyze the text inside
 * https://kushtrimarifi.com/work/ennur.html but you need to copy only what we
 * need", then "only take what we need". His own case study, word for word,
 * set in this page's places:
 *
 *   — the name, industry, services, location, stack and live address from
 *     its facts (his `·` lists written with commas, as the record's are);
 *   — the summary from "Company", his "I designed and built" as Mardal's
 *     "We";
 *   — Situation from "The problem"'s first paragraph, Challenge from its
 *     other two, Research from "Discovery", Solution from "Solution".
 *
 * Left on his page: Users, System design, Design, Development (its tools are
 * the stack) and Outcome, and every section's sub-heading. His straight
 * apostrophes are curled, as everywhere on this site. The pages are his own
 * screenshots, and the opening picture (the card's too) is his.
 */
export const ennurStory = {
  slug: "en-nur",
  /* His portfolio's own title for it, less his name. */
  title: "En-Nur — Laravel Membership & Donations App",
  name: "En-Nur",
  industry: "Religious, Community",
  lede: "A Laravel membership and donations app for En-Nur, a mosque community in Switzerland.",
  /* His picture for the opening — owner, 2026-10-11: "use this image for
     hero banner and for the cover image in galler[y]" (mosque.jpg from his
     Desktop, 2376×1584, as WebP at 1200 and at its full width). */
  heroImage: "/en-nur-hero-2376.webp",
  heroSrcSet: "/en-nur-hero-1200.webp 1200w, /en-nur-hero-2376.webp 2376w",
  ogImage: "/og-en-nur.jpg",
  summary:
    "En-Nur is a mosque community in Switzerland. Its members, people of every age who live in the community, pay a monthly membership fee and also give donations, and the community depends on both to operate. Membership is not a one-off sign-up but an ongoing relationship, which means the system behind it is used constantly rather than occasionally. We designed and built that system in 2025.",
  record: [
    { label: "INDUSTRY:", value: "Religious, Community" },
    { label: "SERVICES:", value: "Product Design, Full-Stack Development, Payments" },
    { label: "LOCATION:", value: "Switzerland" },
    {
      label: "STACK:",
      value: "Figma, Laravel, PHP, Eloquent ORM, Blade, MySQL, Stripe, PHPMailer, Render",
    },
  ],
  live: { label: "LIVE WEBSITE", href: "https://xhamia-en-nur.ch/" as string | null },
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "The community managed memberships and donations through third-party software. It was expensive and inflexible, but the core issue was that it had never been built for a mosque. Generic membership tools are designed around the average association, so they arrive with their own assumptions about how members register, how fees are collected and how money is reported. The community’s actual requirements had to be squeezed into fields and processes designed for someone else, and the ones that didn’t fit simply weren’t supported.",
      ],
    },
    {
      id: "challenge",
      heading: "Challenge",
      paragraphs: [
        "The result was a tool the people running the community spent their time working around rather than with. Work the software should have done still happened by hand, and every month they paid a subscription for a system that didn’t match how they operate.",
        "They needed a system built around their own requirements, at a cost that made sense for a community organisation, and one they would own rather than rent.",
      ],
    },
    {
      id: "research",
      heading: "Research",
      paragraphs: [
        "Discovery meant working through, with the people who run the community, the questions any system has to answer before it can be designed. Who can become a member and how they register. When a monthly payment falls due and what happens if it’s missed. How donations differ from membership fees and how each needs to be recorded. What the admins need to see at the end of every month.",
        "Those answers became the brief, and anything that didn’t serve them didn’t get built.",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "The admin dashboard carries the complexity. Members, payments, donations and reporting all live here, because this is where the work of running the community happens. Payment status is visible across the whole membership, so the question of who is up to date has an immediate answer.",
        "The member dashboard stays simple. Three things: your details, your payments, your status. A member can update their information and see exactly where they stand without having to ask anyone, which also spares the admins a whole category of questions.",
        "Reminders are automated. When a payment falls due, the system sends the reminder itself. Admins no longer have to work out each month who needs one.",
        "Donations are kept separate from membership fees. They are different kinds of money with different meanings, so they are recorded separately and reported separately. Admins get clear donation reporting without having to untangle it from membership payments first.",
      ],
    },
  ],
  /* The laptop shot of 2026-10-11 first — owner, 2026-10-16: "the first one
     is alredy ok" — then his eight new screenshots in their number order
     ("en1 put second en2 third"), each his JPEG unchanged, in its own shape
     ("dont change the format of images"); the earlier seven are gone. */
  showcase: {
    ...pilotStory.showcase,
    title: "The platform, page by page",
    pages: [
      { src: "/en-nur-1.avif", width: 1300, height: 855, alt: "En-Nur membership app on a laptop: the administrator panel with quick actions and community totals" },
      { src: "/en-nur-2.jpg", width: 1635, height: 1616, alt: "En-Nur administrator panel: quick actions, the community overview of members, income and donations, and membership renewals" },
      { src: "/en-nur-3.jpg", width: 1639, height: 1620, alt: "En-Nur payment management: totals by status, search and filters, and the list of every payment" },
      { src: "/en-nur-4.jpg", width: 1629, height: 1358, alt: "En-Nur administrator form for creating a member account with a username" },
      { src: "/en-nur-5.jpg", width: 1622, height: 1068, alt: "En-Nur payment, step one: choose a membership amount in CHF and pay by TWINT, Stripe or cash" },
      { src: "/en-nur-6.jpg", width: 1642, height: 1562, alt: "En-Nur TWINT payment: a QR code to scan with the TWINT app, beside the payment summary" },
      { src: "/en-nur-7.jpg", width: 1148, height: 1087, alt: "En-Nur cash payment instructions: the payment details and the reference to bring" },
      { src: "/en-nur-8.jpg", width: 1625, height: 1598, alt: "En-Nur user management: members with their roles, verified email, payments and registration date" },
      { src: "/en-nur-9.jpg", width: 1678, height: 1768, alt: "En-Nur member profile: the account summary of contributions, donations and payments, and the profile form" },
    ],
  },
  way: pilotStory.way,
} as const satisfies Story;

/**
 * **Jetonikeramika** — owner, 2026-10-11: "now we have new one:
 * Jetonikeramika here you have the link:
 * https://kushtrimarifi.com/work/jetonikeramika.html". Taken as En-Nur's
 * was, only what this page needs, word for word:
 *
 *   — the name, industry, services, location, stack and live address from
 *     its facts (his `·` lists with the record's commas; his "Agency: Mardal"
 *     left out, on Mardal's own site);
 *   — the summary from "Company", its last sentence in Mardal's voice ("The
 *     project came to Mardal in 2026, and we led …" for his "Mardal brought
 *     the project to me in 2026, and I led …");
 *   — "The problem" is one paragraph: its first two sentences are the
 *     Situation, its last the Challenge;
 *   — Research from "Research" (his "I researched" as "We researched"),
 *     Solution from "Solution".
 *
 * Left on his page: Design, Development, Outcome and every sub-heading. His
 * straight apostrophes are curled. The pages are his own screenshots, and
 * the opening picture (the card's too) is his.
 */
export const jetonikeramikaStory = {
  slug: "jetonikeramika",
  /* His portfolio's own title for it, less his name. */
  title: "Jetonikeramika — Tile Showroom Website",
  name: "Jetonikeramika",
  industry: "Ceramics & Tiles",
  lede: "A website for Jetonikeramika, a ceramics and tiles showroom in Kosovo.",
  /* His picture for the opening — owner, 2026-10-16: "use this image for
     cover in jetonikeramika" (jetonicover64.avif from his Desktop,
     1920×1280): his AVIF unchanged at its full width, and an AVIF at 1200
     for a phone, the same type and shape ("dont change the format of
     images"). It replaced the cover-s.jpg of 2026-10-11. */
  heroImage: "/jetonikeramika-hero-1920.avif",
  heroSrcSet: "/jetonikeramika-hero-1200.avif 1200w, /jetonikeramika-hero-1920.avif 1920w",
  ogImage: "/og-jetonikeramika.jpg",
  summary:
    "Jetonikeramika’s business happens in a 2,500 m² showroom, where customers see, touch and choose premium ceramics and tiles for bathrooms and living spaces. It sells to private clients and contractors alike. The project came to Mardal in 2026, and we led the research, design and build.",
  record: [
    { label: "INDUSTRY:", value: "Ceramics & Tiles" },
    { label: "SERVICES:", value: "Research, Product Design, Development, Analytics" },
    { label: "LOCATION:", value: "Kosovo" },
    {
      label: "STACK:",
      value:
        "Figma, WordPress (custom theme), PHP, JavaScript ES6+, Intersection Observer API, Google Analytics 4",
    },
  ],
  live: { label: "LIVE WEBSITE", href: "https://jetonikeramika.com/" as string | null },
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "Building Jetonikeramika’s first website raised a question before any design did: what was it for? A high-end ceramics brand could easily become an online catalogue competing on product specs, but that isn’t how this company sells.",
      ],
    },
    {
      id: "challenge",
      heading: "Challenge",
      paragraphs: [
        "The site had to express its philosophy, the brands it carries and the range it offers, in a way that matched what a customer feels on arrival at the showroom.",
      ],
    },
    {
      id: "research",
      heading: "Research",
      paragraphs: [
        "We researched how ceramics and interior brands present themselves in the Kosovo market, and asked the client how their customers get from first hearing of the brand to buying.",
        "The answer was clear. Sales are made in person at the showroom, with advertising bringing people in, and none of them happen online. So a visitor to the website is not yet a buyer. They are someone deciding whether the showroom is worth the trip.",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "The philosophy leads. The homepage opens with what the company stands for, not a product grid. For a brand competing on quality rather than price, that story is the reason to choose it.",
        "The catalogue informs the visit. Brands and ranges are presented so visitors can understand the breadth of what’s available and arrive at the showroom already knowing what interests them. The final choice is made in person, under real light, with the product in hand.",
        "The showroom is the call to action. Where another site would push a Buy button, this one points to the showroom: where it is, when it’s open and how to get there. That trip is the outcome the whole site is built around.",
      ],
    },
  ],
  /* His eight screenshots of the site, in his order — owner, 2026-10-11
     (jetoni1–jetoni8 from his Desktop, unchanged, as
     public/jetonikeramika-*.avif; the 16:10 frame trims a sliver off the
     1.52 ones top and foot, and off the laptop shot's sides). */
  showcase: {
    ...pilotStory.showcase,
    pages: [
      { src: "/jetonikeramika-1.avif", width: 1466, height: 860, alt: "Jetonikeramika website on a laptop: the dark homepage opening with the headline “Tile with style”" },
      { src: "/jetonikeramika-2.avif", width: 1500, height: 987, alt: "Jetonikeramika homepage: the showroom, unique tile models, sanitary ware, planning and professional installation" },
      { src: "/jetonikeramika-3.avif", width: 1500, height: 987, alt: "Jetonikeramika “Our inspiration” section, about tiles for kitchens, bathrooms and living rooms" },
      { src: "/jetonikeramika-4.avif", width: 1500, height: 987, alt: "Jetonikeramika page on new ceramic models, opening on green wall tiles in a shower" },
      { src: "/jetonikeramika-5.avif", width: 1500, height: 987, alt: "Jetonikeramika product categories: bathroom, floor, porcelain and terrace tiles, mosaic, decor and travertine" },
      { src: "/jetonikeramika-6.avif", width: 1300, height: 855, alt: "Jetonikeramika projects page: residential developments and venues fitted with its tiles" },
      { src: "/jetonikeramika-7.avif", width: 1300, height: 855, alt: "Jetonikeramika showroom page: views of the showroom" },
      { src: "/jetonikeramika-8.avif", width: 1500, height: 987, alt: "Jetonikeramika “Our exclusive showroom” page: the story of its showroom in Gjilan" },
    ],
  },
  way: pilotStory.way,
} as const satisfies Story;

/**
 * **Spitex Schwab AG** — owner, 2026-10-11: "now this project:
 * https://kushtrimarifi.com/work/spitex.html". Taken as the other two were,
 * only what this page needs, word for word:
 *
 *   — the name, industry, services, location, stack and live address from
 *     its facts (his `·` lists with the record's commas);
 *   — the summary from "Company", his "came to me" as "came to us";
 *   — Situation and Challenge from "The problem"'s two paragraphs;
 *   — Research from "Research", his "I" and "me" as Mardal's "we" and "us"
 *     (we went through, told us, we then reviewed, we reorganised);
 *   — Solution from "Solution".
 *
 * Left on his page: Users (his own clinical-psychology background with it),
 * Design, Development, Outcome and every sub-heading. His straight
 * apostrophes are curled. The pages are his own screenshots, and the
 * opening picture (the card's too) is his.
 */
export const spitexSchwabStory = {
  slug: "spitex-schwab",
  /* His portfolio's own title for it, less his name. */
  title: "Spitex Schwab AG — Home Care Website, Bern",
  name: "Spitex Schwab AG",
  industry: "Home Care",
  lede: "A website for Spitex Schwab AG, an independent home-care provider in Bern.",
  /* His picture for the opening — owner, 2026-10-11: "here you have image for
     cover and herobanner" (eldery-cover.jpg from his Desktop, 2000×1333, as
     WebP at 1200 and at its full width). */
  heroImage: "/spitex-schwab-hero-2000.webp",
  heroSrcSet: "/spitex-schwab-hero-1200.webp 1200w, /spitex-schwab-hero-2000.webp 2000w",
  ogImage: "/og-spitex-schwab.jpg",
  summary:
    "Spitex Schwab AG is an independent home-care provider based in Bern. Its nurses and carers support people of all ages in their own homes, so they can keep their independence there, with services ranging from basic and medical care to psychiatric, palliative and oncology care, dementia support, a children’s Spitex and Spitexpress, a 24-hour emergency service. Spitex Schwab came to us directly in 2025.",
  record: [
    { label: "INDUSTRY:", value: "Home Care" },
    { label: "SERVICES:", value: "Research, Product Design, Accessibility, Development" },
    { label: "LOCATION:", value: "Bern, Switzerland" },
    { label: "STACK:", value: "Figma, WordPress (custom theme), PHP, Vanilla JavaScript, SCSS" },
  ],
  live: { label: "LIVE WEBSITE", href: "https://spitexschwab.ch/" as string | null },
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "Before this project, everything Spitex Schwab had to say about itself was in printed brochures. They worked for people already in contact with the company. For anyone searching online, the company did not exist.",
      ],
    },
    {
      id: "challenge",
      heading: "Challenge",
      paragraphs: [
        "That gap matters more in home care than in most sectors. The need for care often arrives suddenly, after a fall or a hospital stay, and people look for help quickly and under pressure.",
      ],
    },
    {
      id: "research",
      heading: "Research",
      paragraphs: [
        "The work started with a content audit. Together with the client we went through the brochures and every service Spitex Schwab offers, a long list written for print and for people who already knew the company. The client also told us something that shaped everything after it: in most cases, first contact comes from a son or daughter arranging care for a parent, not from the person who needs it.",
        "We then reviewed leading Spitex organisations across Switzerland, looking at how they explain their services, how they handle first contact, and how quickly a relative can find what they need. The review turned up one thing worth keeping and one worth fixing. The design of the best sites was simple and uncluttered, with no visual overload, and that became the benchmark for the look. The problem was the information. Explaining care properly takes words, so the amount of text was not the issue in itself. The issue was where it lived: information was scattered across the site, and a relative had to piece answers together from several pages.",
        "That set the priority for the information architecture. We reorganised Spitex Schwab’s services under five headings a relative can grasp at once, care, household help, personal support, coordination and the 24-hour Spitexpress, with one page per service, so every answer sits in one predictable place.",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "Text large enough to read without effort. Body text is set larger than usual, so nobody has to zoom in or lean closer, and a tired reader can take in a page at a glance.",
        "The phone number never leaves the screen. For many families the first step is a conversation, not a form. The number stays in view throughout the site, so calling is always the easiest thing to do.",
        "Care described in everyday words. Services are explained the way a relative would ask about them, not in the terminology of the care sector.",
        "Fewer steps to contact. Getting in touch takes as few steps as possible, and the contact form asks only for what Spitex needs to call back.",
      ],
    },
  ],
  /* His eight screenshots of the site, in his order — owner, 2026-10-11
     (spitex1–spitex8 from his Desktop, unchanged, as
     public/spitex-schwab-*.avif; the 16:10 frame trims a sliver off the
     1.52 ones top and foot, and off the laptop shot's sides). */
  showcase: {
    ...pilotStory.showcase,
    pages: [
      { src: "/spitex-schwab-1.avif", width: 1466, height: 860, alt: "Spitex Schwab AG website on a laptop: the teal homepage, “Pflege und Unterstützung für Seniorinnen und Familien”" },
      { src: "/spitex-schwab-2.avif", width: 1300, height: 855, alt: "Spitex Schwab AG homepage: five large navigation boxes over a teal-washed photo" },
      { src: "/spitex-schwab-3.avif", width: 1300, height: 855, alt: "Spitex Schwab AG care introduction, with the phone button “Beratung und Anmeldung” in the header" },
      { src: "/spitex-schwab-4.avif", width: 1500, height: 990, alt: "Spitex Schwab AG household help page, its services listed in everyday words" },
      { src: "/spitex-schwab-5.avif", width: 1300, height: 855, alt: "Spitex Schwab AG section on needs-based care in Bern, with the heart logo" },
      { src: "/spitex-schwab-6.avif", width: 1500, height: 990, alt: "Spitex Schwab AG “Pflege & Betreuung in vertrauter Umgebung”: text in a solid teal panel over a photo" },
      { src: "/spitex-schwab-7.avif", width: 1500, height: 990, alt: "Spitex Schwab AG “Warum uns wählen?” section with expandable reasons beside a care photo" },
      { src: "/spitex-schwab-8.avif", width: 1300, height: 855, alt: "Spitex Schwab AG services menu open: dementia, psychiatry, palliative and oncology care, wound care and transport" },
    ],
  },
  way: pilotStory.way,
} as const satisfies Story;

/**
 * **Bären Baugruppe AG** — owner, 2026-10-15: "now we have new project we
 * have a logo … you can take the text you need for this project and images
 * i will send you later" (https://kushtrimarifi.com/work/baren.html). Taken
 * as the other three were, word for word:
 *
 *   — the name, industry, services, location and the company's address from
 *     its facts (his `·` lists with the record's commas); a logo has no
 *     stack, so the record's fourth line is his Deliverables;
 *   — the summary from "Who they are", his "came to me" as "came to us",
 *     and his 2024 as 2026 (owner, 2026-10-15: "change this: Business
 *     Leaders AG in 2024. to 2026");
 *   — Situation and Challenge from "Before", its one paragraph cut where it
 *     turns to what the client wanted;
 *   — Solution from "The lettering", his "I" as "we", then "Four states".
 *
 * No Research: his page has none, and none is invented. Left on his page:
 * Agency, The palette, Voice and imagery, In the field, After, and every
 * sub-heading. His straight apostrophes are curled. The link is the
 * company's own site, which Mardal did not build, so it reads as his page
 * writes it — its address — rather than LIVE WEBSITE. The opening picture
 * (the card's too) and the nine pages are his.
 */
export const barenStory = {
  slug: "baren",
  /* His portfolio's own title for it, less his name. */
  title: "Bären Baugruppe AG — Logo & Brand Identity",
  name: "Bären Baugruppe AG",
  industry: "Construction & Roofing",
  lede: "A logo and brand identity for Bären Baugruppe AG, a Swiss construction company near Bern.",
  /* His picture for the opening — owner, 2026-10-15: "use this image for
     cover" (baren-hero.jpg from his Desktop, 2000×1120, as WebP at 1200 and
     at its full width; q72, since the tiles' fine grain made q80 2.5 times
     Spitex's weight for nothing the eye can find at 1:1). */
  heroImage: "/baren-hero-2000.webp",
  heroSrcSet: "/baren-hero-1200.webp 1200w, /baren-hero-2000.webp 2000w",
  ogImage: "/og-baren.jpg",
  summary:
    "Bären Baugruppe AG is a Swiss construction company based in Urtenen-Schönbühl, near Bern. It started out as a roofing contractor and has grown into a building group covering roofing and sheet-metal work, flat roofs, façades, building protection, coatings, painting and renovation, and even drone inspections of tall buildings. It is also a major sponsor in Swiss sport, above all football. The project came to us through Business Leaders AG in 2026.",
  record: [
    { label: "INDUSTRY:", value: "Construction & Roofing" },
    { label: "SERVICES:", value: "Logo Design, Lettering, Brand Identity" },
    { label: "LOCATION:", value: "Urtenen-Schönbühl, Switzerland" },
    {
      label: "DELIVERABLES:",
      value:
        "Logo and lettering, Bear symbol, Colour palette, Typography, Identity pattern, Photography direction, Brand workbook, Site and sponsorship applications",
    },
  ],
  live: { label: "BAEREN-BAUGRUPPE-AG.CH", href: "https://baeren-baugruppe-ag.ch/" as string | null },
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "The previous logo was simply the word Bären, set in type with nothing else. It named the company but gave it no mark of its own: nothing to recognise at a distance, nothing that could stand alone on a helmet or a hoarding, and no sign of the animal the name refers to.",
      ],
    },
    {
      id: "challenge",
      heading: "Challenge",
      paragraphs: [
        "The client wanted something new and distinctive, a self-contained mark that holds more of the company than a word alone could.",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "We started with the type. The plain lettering was replaced with a heavy, forward-leaning italic that gives the word real weight. Then, instead of placing a bear beside the name, we built it into the letters. A red bear walks through the middle of the word, taking the place of parts of the Ä and the R, with its legs standing in for their strokes and the umlaut dots still sitting above it.",
        "The name and the animal are now one shape. Bären means bears, and the logo says it twice at once, in words and in image, without needing a symbol next to it. The italic slant and the bear’s direction of travel point the same way, forward in the reading direction, which gives the mark its momentum. Below it, Baugruppe AG is set light and widely spaced, a calm counterweight to the heavy name.",
        "In the word. The primary logo: black letters with the red bear walking through them. This is the version for white grounds, print and anywhere full colour can be reproduced.",
        "Carved into the letters. In one colour, white on black or black on white, the bear is not drawn at all. Its outline stays cut into the Ä and the R, so the animal is still there as negative space. The idea survives even when the colour can’t.",
        "On its own. The red bear works as a standalone symbol, small enough for the brim of a hard hat and other spaces where the full name would be too wide.",
        "As a pattern. The letter fragments that frame the bear are repeated in white on red to form the identity pattern. The bear itself is left out, implied by the shapes around it, so the pattern belongs to Bären even though the logo never appears in it.",
      ],
    },
  ],
  /* His ten pictures, in his order — owner, 2026-10-15: "here you have
     images to put inside the project", then "dont change the format of
     images", then (2026-10-16) the football team "in the end": each is HIS
     FILE, UNCHANGED — the two JPEGs as JPEGs, the seven AVIFs as AVIFs, the
     WebP as WebP, each at its own size and shape. The gallery shows
     a picture whole in its 16:10 place (globals.css), so the square palette
     and the slides with words on their edges are neither cropped nor
     padded. */
  showcase: {
    ...pilotStory.showcase,
    pages: [
      { src: "/baren-1.jpg", width: 2948, height: 1720, alt: "Bären Baugruppe AG logo, the red bear walking through the black lettering, over a faded photo of roofers on a metal roof" },
      { src: "/baren-2.jpg", width: 1672, height: 941, alt: "Bären Baugruppe AG roofer in a white hard hat with the logo, reading plans beside a company van with the red bear" },
      { src: "/baren-3.avif", width: 1500, height: 1500, alt: "Bären Baugruppe AG primary logo on white: the red bear in the Ä and the R, Baugruppe AG set light beneath" },
      { src: "/baren-4.avif", width: 1500, height: 1500, alt: "Bären Baugruppe AG colour palette: black, dark grey #4D4D4D, primary red #E40625, lighter red #F0484A and white" },
      { src: "/baren-5.avif", width: 1500, height: 877, alt: "Bären Baugruppe AG typography sheet: Humanist 777 in light, regular and bold, with paragraph and header samples" },
      { src: "/baren-6.avif", width: 1500, height: 877, alt: "Bären Baugruppe AG identity pattern: the letter fragments around the bear, repeated in white on red" },
      { src: "/baren-7.avif", width: 1500, height: 877, alt: "Bären Baugruppe AG photography direction: a roofer carrying tiles, beside the white logo on black and notes on the imagery" },
      { src: "/baren-8.avif", width: 1500, height: 877, alt: "Bären Baugruppe AG roofing slide: a grid of tiled-roof photographs on the brand red, marked Switzerland, Roofing, 2025" },
      { src: "/baren-9.avif", width: 1200, height: 1200, alt: "Bären Baugruppe AG site banner on a building-site fence: the white logo on black, the address and the list of services" },
      { src: "/baren-10.webp", width: 850, height: 636, alt: "Bären Baugruppe AG as a football sponsor: the team in white kits with the Bären logo, lined up before a Bären banner" },
    ],
  },
  way: pilotStory.way,
} as const satisfies Story;

/**
 * **Riesen Holzbau** — owner, 2026-10-15: "now continue with this new
 * project branding: https://kushtrimarifi.com/work/riesen.html -- take the
 * text you needed". Taken as Bären's was, word for word:
 *
 *   — the name, industry, services, location and Deliverables from its
 *     facts (his `·` lists with the record's commas);
 *   — "The contest" is one paragraph that holds both the summary and the
 *     situation, so it is shared out in his order: the company and how the
 *     project came to us as the summary, the old logo and the contest as the
 *     Situation. His "came to me … where I was working at the time" is "came
 *     to us", the clause about his job dropped; "mine was chosen, and I then
 *     developed it" is "ours … we";
 *   — Solution from "The idea", then "Anatomy of the mark".
 *
 * No Challenge and no Research: his page states neither, and neither is
 * invented. Left on his page: Agency, Colour, On the building site, Since
 * then, and every sub-heading. His straight apostrophes are curled.
 *
 * The company's site is not linked: riesenholzbau.ch answered 500 on
 * 2026-10-15 (a WordPress error page, every address), and the page shows a
 * link only once one is set. Its address stays here, ready — set `href` to
 * "https://riesenholzbau.ch/" when it is back. The opening picture (the
 * card's too) and the seven pages are his.
 */
export const riesenStory = {
  slug: "riesen",
  /* His portfolio's own title for it, less his name; the company's name with
     its AG, here and on the heading (owner, 2026-10-15: "also after name add
     AG"). */
  title: "Riesen Holzbau AG — Timber Construction Logo",
  name: "Riesen Holzbau AG",
  industry: "Timber Construction",
  lede: "A logo and brand identity for Riesen Holzbau AG, a Swiss timber construction company.",
  /* His picture for the opening — owner, 2026-10-15: "use this image for
     cover" (cover-ww.webp from his Desktop, 2560×1440: his file unchanged at
     its full width, and as WebP at 1200). */
  heroImage: "/riesen-hero-2560.webp",
  heroSrcSet: "/riesen-hero-1200.webp 1200w, /riesen-hero-2560.webp 2560w",
  ogImage: "/og-riesen.jpg",
  summary:
    "Riesen Holzbau AG has built in timber since 1997: houses, cabins and custom wooden projects. The project came to us through Business Leaders AG.",
  record: [
    { label: "INDUSTRY:", value: "Timber Construction" },
    { label: "SERVICES:", value: "Logo Design, Brand Identity" },
    { label: "LOCATION:", value: "Switzerland" },
    {
      label: "DELIVERABLES:",
      value:
        "Brand positioning, Icon and wordmark, Colour palette, Brand workbook, Print applications, Workwear",
    },
  ],
  live: { label: "RIESENHOLZBAU.CH", href: null as string | null },
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "Its original logo had dated and no longer represented the company Riesen had become, so it ran a small design contest to find a new identity. Five concepts were presented, ours was chosen, and we then developed it into the full identity.",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "Holzbau means timber construction, and the icon says exactly that in one shape: a house made of wood. Its outline is the plain silhouette of a house, a pitched roof over straight walls. Inside it, instead of a door or windows, sits the end grain of a tree trunk, its growth rings running across the facade.",
        "The mark holds two kinds of form in balance. The house is geometric, drawn on a strict grid with the roof pitch and the walls fixed by construction lines. The wood is organic and uneven, grown rather than drawn. That meeting of the built and the grown is what a timber construction company does every day, and it is what makes the mark recognisably Riesen’s rather than any builder’s.",
        "The house. A pentagon set on a construction grid, with the roof angle and wall lines fixed by guides that extend beyond the shape. It gives the mark a stable, architectural base that reads instantly as a building.",
        "The rings. The growth rings radiate from the bottom corner, where the heart of the trunk would be, and widen as they move outward, so the house appears to have been cut from the end of a log.",
        "The outer edge. Toward the roofline the rings give way to a solid band with an irregular edge, like the bark at the outside of a trunk, which carries the organic character right up to the geometric outline.",
        "The wordmark. Riesen Holzbau AG is set in wide, extended capitals with larger initials, a steady horizontal line of type that echoes a timber beam. A rule underneath runs the full width of the logo and grounds the whole composition like a sill.",
        "The tagline. Stolz auf Holz, proud of wood, is the only handwritten element in the identity. Set in a loose script beneath the rule, it adds a human voice to an otherwise engineered logo: the signature of people who work with their hands.",
      ],
    },
  ],
  /* His eleven pictures — owner, 2026-10-15: "now add those images inside
     the project", then "add also those", then "delete those two" (the vans
     on the country road) "and dont change the format of images", then
     (2026-10-16) riesen2 "before this image", the logo on charcoal. So:
     box-cover, riesen1, reisen342, Team-scaled and riesen122 in the order he
     sent them, then riesen2–7 in number order — each HIS FILE, UNCHANGED: its own type
     (AVIF, JPEG, WebP), its own size, its own shape. The gallery shows a
     picture whole in its 16:10 place (globals.css), so none is cropped or
     padded to fit. */
  showcase: {
    ...pilotStory.showcase,
    pages: [
      { src: "/riesen-1.avif", width: 1200, height: 1200, alt: "Riesen Holzbau AG carpenters in brown branded shirts fixing the topping-out tree with its ribbons to the timber frame" },
      { src: "/riesen-2.jpg", width: 2946, height: 1716, alt: "Riesen Holzbau AG logo in white, the house cut from a log beside the wordmark and Stolz auf Holz, over the team in brown" },
      { src: "/riesen-3.jpg", width: 2048, height: 1536, alt: "Riesen Holzbau AG van at a building site under scaffolding, lettered Holzbau, Schreinerei, Spenglerei, Fenster" },
      { src: "/riesen-4.jpg", width: 2560, height: 1709, alt: "Riesen Holzbau AG team in brown branded workwear in front of two company vans and the timber store" },
      { src: "/riesen-5.webp", width: 2560, height: 1707, alt: "Riesen Holzbau AG carpenter in brown workwear and an orange helmet sealing the joint of a timber wall panel" },
      { src: "/riesen-6.avif", width: 1300, height: 1300, alt: "Riesen Holzbau AG logo in wood brown on white: the house cut from a log, the wordmark and Stolz auf Holz" },
      { src: "/riesen-7.avif", width: 1300, height: 1300, alt: "Riesen Holzbau AG logo in timber tan on charcoal: the house cut from a log, the wordmark and Stolz auf Holz" },
      { src: "/riesen-8.avif", width: 1300, height: 1300, alt: "Riesen Holzbau AG icon on its construction grid: the outline of a house filled with the growth rings of a log" },
      { src: "/riesen-9.avif", width: 1300, height: 1300, alt: "Riesen Holzbau AG colour palette: wood browns from #734C40, charcoal greys from #333333 and timber tones to #D9BB92" },
      { src: "/riesen-10.avif", width: 1471, height: 861, alt: "Riesen Holzbau AG team at lunch in brown branded workwear, round a table on a base of stacked wood" },
      { src: "/riesen-11.avif", width: 1200, height: 1200, alt: "Riesen Holzbau AG carpenter in an orange helmet on site, the logo embroidered on the brown sweatshirt" },
    ],
  },
  way: pilotStory.way,
} as const satisfies Story;

/**
 * **WMK** — owner, 2026-10-16: "now lets add new project:
 * https://kushtrimarifi.com/work/wmk.html". Taken as the others were, word
 * for word:
 *
 *   — the name, industry, services, location and Deliverables from its
 *     facts (his `·` lists with the record's commas);
 *   — the summary from "Company", its two paragraphs as one, his "I worked
 *     with WMK directly" as "We worked";
 *   — Situation and Challenge from "The brief"'s two paragraphs, as
 *     Spitex's came from "The problem";
 *   — Research from "Research", his "I went through" as "we went through";
 *   — Solution from "The logo", his "directions I explored" as "we
 *     explored", then "The system".
 *
 * Left on his page: Colour, Typography, Applications, Outcome and every
 * sub-heading.
 *
 * The academy's site is not linked: the address his page gives,
 * akade-wmk.ch, is not registered (the .ch registry has no such domain,
 * 2026-10-16), and the page shows a link only once one is set. The
 * opening picture (the card's too) and the ten pages are his.
 */
export const wmkStory = {
  slug: "wmk",
  /* His portfolio's own title for it, less his name. */
  title: "WMK Zurich — Marketing Academy Branding",
  name: "WMK",
  industry: "Education",
  lede: "A brand identity for WMK, a private marketing academy in Zurich.",
  /* His picture for the opening — owner, 2026-10-16: "use this for cover"
     (covers-wmk.jpg from his Desktop, 2000×1333). His JPEG unchanged at its
     full width, and a JPEG at 1200 for a phone: the same type and shape, as
     he asked of his pictures ("dont change the format of images"). */
  heroImage: "/wmk-hero-2000.jpg",
  heroSrcSet: "/wmk-hero-1200.jpg 1200w, /wmk-hero-2000.jpg 2000w",
  ogImage: "/og-wmk.jpg",
  summary:
    "WMK is a private academy in Zurich that teaches modern marketing and communication, from building an online presence to performance marketing, content strategy and consumer psychology. Its students are marketing professionals, career changers and company employees building new skills. The name carries its subjects: Wirtschaft, Marketing, Kommunikation. The academy was new, so this was a brand built from nothing. We worked with WMK directly in 2026.",
  record: [
    { label: "INDUSTRY:", value: "Education" },
    { label: "SERVICES:", value: "Brand Identity, Brand System, Art Direction" },
    { label: "LOCATION:", value: "Zurich, Switzerland" },
    {
      label: "DELIVERABLES:",
      value:
        "Brand strategy, Logotype, Colour palette, Typography, Graphic pattern, Photography style, Brand guidelines, Stationery, Digital and print assets",
    },
  ],
  live: { label: "AKADE-WMK.CH", href: null as string | null },
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "A new academy has no reputation yet, so its brand has to supply the credibility that years would normally provide. At the same time, WMK teaches the newest parts of marketing, and a brand that looked like a traditional institution would contradict what it teaches. It had to feel academic and current at once.",
      ],
    },
    {
      id: "challenge",
      heading: "Challenge",
      paragraphs: [
        "The client added one clear instruction: keep the logo simple, and put the richness into the branding around it.",
      ],
    },
    {
      id: "research",
      heading: "Research",
      paragraphs: [
        "Before designing anything, we went through a wide range of academies and business schools. Almost all of them had the same kind of brand: a simple mark, a simple concept, and nothing wrong with either. The problem was that simplicity had made them similar. Few of them gave a reason to remember one over another.",
        "The client had said the same thing in their own words: they wanted to be different, above all in colour and in branding. The research showed where that difference could come from. Simplicity in the logo was worth keeping, because it is what makes an academy look clear and trustworthy. Colour and the system around the mark were where the category had nothing to say, so that is where WMK would speak.",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "The mark is the three initials set in a heavy grotesque with tight spacing, so they read as one solid block. A thin vertical rule separates them from the three words they stand for, Wirtschaft, Marketing and Kommunikation, stacked in a lighter weight.",
        "The logo explains itself. An acronym on its own expects the reader to already know the name. Here the meaning sits right beside it, so a first-time visitor learns what WMK teaches in the same glance that shows them the name. For an academy nobody had heard of yet, that did more work than a symbol could. Of the early directions we explored, this one answered the brief most directly, and it was accepted immediately.",
        "The logo also steps down with the space it has. Where there is room, the full lockup appears with all three words. In tighter spaces the initials stand alone, and over photography the brand often signs off with just Akademie and WMK in small type, leaving the images and the pattern to do the rest.",
        "Because the logo stays simple, the character of the brand lives in three elements around it.",
        "The first is a pattern of vertical white bars in different lengths, set in staggered rows. The bars stand for movement. Marketing and technology are fields that never stand still, and the people learning them are moving too, from one skill and one stage of their career to the next. Offset at different heights, the bars read as momentum rather than as a fixed grid. The pattern can be packed densely to fill a poster on its own, thinned out to sit behind a headline, or reduced to a handful of strokes over a photograph.",
        "The second is photography. The images show learners in real settings, and every photograph is set in a purple duotone, so pictures from different sources share one voice while the people in them stay the focus.",
        "The third is the logo itself used as a supergraphic: the letters W, M and K enlarged and cropped at the edge of the format, so even a fragment of a letter is recognisably WMK. Headlines complete the voice with short, confident statements, such as Good marketing tells a story, set in capitals and sometimes turned vertical to run the full height of a poster.",
      ],
    },
  ],
  /* His ten pictures in number order — owner, 2026-10-16: "add those
     images inside the project" (wmk1–wmk10.avif). Each is his file,
     unchanged, in its own shape ("dont change the format of images"); the
     gallery shows the square ones whole. */
  showcase: {
    ...pilotStory.showcase,
    pages: [
      { src: "/wmk-1.avif", width: 1500, height: 878, alt: "WMK logo lockup, the three initials beside Wirtschaft, Marketing, Kommunikation, over students in a purple duotone" },
      { src: "/wmk-2.avif", width: 1500, height: 1500, alt: "WMK full logo on the darkest purple: the initials, the rule and the three words, with Akademie above" },
      { src: "/wmk-3.avif", width: 1500, height: 1500, alt: "WMK colour palette: the four deep purples #31014B, #440566, #52097A and #5B0A87" },
      { src: "/wmk-4.avif", width: 1500, height: 877, alt: "WMK typography sheet: Arial in light, regular and bold, with paragraph and header samples on purple" },
      { src: "/wmk-5.avif", width: 1500, height: 877, alt: "WMK foundation posters: the bar pattern alone, with the headline Good marketing tells a story, and over a photograph" },
      { src: "/wmk-6.avif", width: 1500, height: 877, alt: "WMK layout with students walking past flags in the purple duotone, the cropped initials running along the foot" },
      { src: "/wmk-7.avif", width: 1000, height: 1000, alt: "WMK square social post: a smiling student in the purple duotone, the bar pattern and Akademie WMK" },
      { src: "/wmk-8.avif", width: 1000, height: 1000, alt: "WMK square post: students in the purple duotone, the bars, and a paragraph about the academy under Akademie WMK" },
      { src: "/wmk-9.avif", width: 1500, height: 877, alt: "WMK on a wall-sized digital display in a dark room, the bars and the logo at architectural scale, a visitor in front" },
      { src: "/wmk-10.avif", width: 1500, height: 877, alt: "WMK landscape layout on purple: the bar pattern above the logo and a paragraph, Akademie in the corner" },
    ],
  },
  way: pilotStory.way,
} as const satisfies Story;

/**
 * **Doratec GmbH** — owner, 2026-10-21: "now you need to woek on new project
 * this is the website live: so i need from you to write the text by yourself
 * not to copy othe project but to write new text for this:
 * https://dora-tec.ch/". The first story with no case study of his behind
 * it: every line is written for it, from what the live site shows, read page
 * by page that day. Its footer credits us: "Created by: MARDAL.CO".
 *
 *   — the company from its Unternehmen page and its imprint: a young family
 *     business with more than twenty years in windows and doors, Oftringen;
 *   — the range from its product pages: five window systems, four Pirnar door
 *     collections, lift-and-slide doors in five constructions;
 *   — the menu's keyboard handling from the page's own script.
 *
 * Not stated, because the site does not say it: how and when the project
 * came to us, and what it has achieved since.
 */
export const doratecStory = {
  slug: "doratec",
  title: "Doratec GmbH — Windows and Doors Website, Oftringen",
  name: "Doratec GmbH",
  industry: "Windows and Doors",
  lede: "A website for Doratec GmbH, a family business in Oftringen that sells and installs windows and doors.",
  /* His picture for the opening and the card — owner, 2026-10-21: "i have
     not asked to put any images … use this for cover first" (cover2.jpg from
     his Desktop, 1920×1280, as AVIF at 1200 and at its full width). */
  heroImage: "/doratec-hero-1920.avif",
  heroSrcSet: "/doratec-hero-1200.avif 1200w, /doratec-hero-1920.avif 1920w",
  ogImage: "/og-doratec.jpg",
  summary:
    "Doratec GmbH is a young family business in Oftringen, in the canton of Aargau, whose team brings more than twenty years of experience in selling and installing windows and doors. It supplies windows in PVC, aluminium, wood and wood-aluminium, front doors, lift-and-slide doors and the insect screens and window sills that go with them, working with partners such as VEKA, Schüco, Siegenia and Pirnar.",
  record: [
    { label: "INDUSTRY:", value: "Windows and Doors" },
    { label: "SERVICES:", value: "Information Architecture, UX/UI Design, Development" },
    { label: "LOCATION:", value: "Oftringen, Switzerland" },
    { label: "STACK:", value: "WordPress, Elementor, Vanilla JavaScript, CSS" },
  ],
  live: { label: "LIVE WEBSITE", href: "https://dora-tec.ch/" as string | null },
  passages: [
    {
      id: "situation",
      heading: "Situation",
      paragraphs: [
        "Doratec’s range is wide: five window systems in four materials, four collections of front doors and lift-and-slide doors in five constructions, each line from a different manufacturer with its own datasheets and product names. The people it serves are planning a renovation, a conversion or a new build, and most of them buy windows once in a long while.",
      ],
    },
    {
      id: "challenge",
      heading: "Challenge",
      paragraphs: [
        "Windows are chosen on figures: how well the frame insulates, how much noise the glass keeps out, how deep the profile is and which fittings hold it. Those figures decide comfort and heating costs for decades, but manufacturers publish them for installers. The site had to let a homeowner compare one window with another, find a front door they like, and see what happens after the first call.",
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      paragraphs: [
        "We built the site around what people come to buy. Under Products the menu holds four pages, windows, front doors, sliding doors and accessories, with projects, the company and contact beside it. The homepage opens on the same range: a slider with a slide each for PVC, for aluminium windows, for doors and for wood and wood-aluminium, then four tiles that step down the page into the product pages.",
        "Every window system is set out the same way. Each of the five has one block: what it is and what it suits, a cut through its profile, and a table of its figures that starts with its thermal insulation. Someone weighing a PVC window against a wood-aluminium one reads two blocks built alike instead of two datasheets.",
        "Front doors are chosen by eye, so their page leads with pictures. A strip of door models moves across the page, then the four collections, Optimum, Premium, Ultimum Pure and Ultimum Multilevel, each show their models in a grid, with the full catalogue a click away as a PDF.",
        "The homepage answers what a first-time buyer wants to know next: what happens after they call. Four numbered steps, consultation, planning, manufacturing and installation, take the job from the first conversation to the fitted window.",
        "The partners are on show. A moving strip carries the brands Doratec works with, VEKA, Schüco, Siegenia, aluplast, Procural and Pirnar, and the homepage gives five reasons to choose Doratec windows: quality, trust, innovation, design and security.",
        "Getting in touch is one step from any page. The phone number and email address sit in every footer, and the contact page adds the opening hours and a short form that asks which product the enquiry is about, so each one reaches Doratec already sorted.",
        "The menu also works without a mouse. Enter, Space or the down arrow opens the products menu on its first page, the arrow keys move through it, and Escape closes it and returns to where you were; a screen reader is told whether it is open.",
      ],
    },
  ],
  /* His seven pictures of the site — owner, 2026-10-21: "now delete the
     images you have add at dora and add those new images" (dora1–dora7 from
     his Desktop, unchanged, as public/doratec-1–7.webp), in his numbering:
     the homepage from its opening down, then the windows page. */
  showcase: {
    ...pilotStory.showcase,
    pages: [
      { src: "/doratec-1.webp", width: 2690, height: 1706, alt: "Doratec GmbH homepage: “Fenster und Türen aus Kunststoff in Perfektion” over a white modern house, with the slider’s arrows" },
      { src: "/doratec-2.webp", width: 2682, height: 1510, alt: "Doratec GmbH homepage: four product tiles, windows, front doors, sliding doors and accessories, stepping down the page" },
      { src: "/doratec-3.webp", width: 2686, height: 1510, alt: "Doratec GmbH “Ihr Spezialist für Fenster & Türen”: the introduction above folding glass doors open onto a lake" },
      { src: "/doratec-4.webp", width: 2688, height: 1504, alt: "Doratec GmbH “So Arbeiten wir bei Doratec”: consultation, planning, manufacturing and installation as four numbered steps" },
      { src: "/doratec-5.webp", width: 2686, height: 1508, alt: "Doratec GmbH “Unsere Projekte”: a red band with its arrows and “Alle ansehen” above a carousel of houses" },
      { src: "/doratec-6.webp", width: 2684, height: 1506, alt: "Doratec GmbH “5 gute Gründe für Doratec-Fenster”: quality, trust and innovation beside photographs of modern houses" },
      { src: "/doratec-7.webp", width: 2686, height: 1514, alt: "Doratec GmbH windows page: six benefits, from security and sound insulation to steel-reinforced frames, beside a kitchen window" },
    ],
  },
  way: pilotStory.way,
} as const satisfies Story;

/** Every story written out, each at /case-studies/<slug> — less any hidden
 *  for now (`hiddenProjects`), whose story stays written, with no page.
 *
 *  The pilot is not one of them since launch, 2026-10-19: its client is
 *  invented and its pictures are stock (SEO-PLAN.md, step 1.2), so it came
 *  out with the samples. Its object stays, because every real story above is
 *  built on its showcase and its way out. */
export const stories: readonly Story[] = [
  ennurStory,
  jetonikeramikaStory,
  spitexSchwabStory,
  barenStory,
  riesenStory,
  wmkStory,
  doratecStory,
].filter((story) => !hiddenProjects.includes(story.slug));
