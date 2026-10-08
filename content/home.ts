/**
 * Single source of truth for every word on the homepage.
 *
 * Components import from here instead of holding their own copy, so text and
 * the contact address are edited in one place. Keep this file free of JSX and
 * components: it is data only.
 */


/**
 * The seven sectors, written once.
 *
 * They are read in two places now — the Solutions section down the homepage and
 * the Clients menu in the header — so they are declared before either and both
 * are built from this. It is the same argument the menu itself is here for: two
 * copies of a list are two lists, and they drift.
 *
 * Each one is a section on the homepage and nothing more; none has a page. That
 * is why the menu hrefs below are written `/#id` rather than `#id`. Spelled
 * that way they resolve from every page on the site — from the Blog or a
 * service page the sector is a real destination, and from the homepage itself
 * the browser reads it as the same document and simply scrolls, so nothing is
 * reloaded for the shorter form's sake.
 */
/**
 * ⚠ **Each of these lines is longer than the owner wrote it.** 2026-08-27: add
 * more services for each industry. Twenty more kinds of organisation, twenty
 * five to forty five, two or three a sector.
 *
 * **They are mine, and they are categories rather than claims.** Every one names
 * a KIND of organisation that exists in that sector — payment providers, dental
 * practices, freight forwarders — not a client, a capability or a number. That
 * is the same thing the original words did; nothing here says Mardal has worked
 * for one of them, and the page carries no count of them any more either.
 *
 * **The grammar is load-bearing.** `audiencesOf` splits these on commas and the
 * final `and`, so no phrase may contain an `and` of its own and every one has to
 * be a noun phrase that stands alone. `tests/rendered-html.test.mjs` rejoins
 * them and compares against the sentence they came from, which is what catches
 * a line rewritten past that rule.
 */
export const industries = [
  {
    id: "finance",
    title: "Finance",
    descriptor:
      "Banks, insurance companies, fintech platforms, payment providers, asset managers, credit unions and financial service providers.",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    descriptor:
      "Hospitals, clinics, pharmacies, dental practices, diagnostic laboratories, care providers and organizations delivering health services.",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    descriptor:
      "Factories, production companies, engineering firms, component suppliers, assembly plants and businesses managing industrial operations.",
  },
  {
    id: "automotive",
    title: "Automotive",
    descriptor:
      "Dealerships, repair services, parts distributors, fleet operators, leasing companies, vehicle platforms and mobility companies.",
  },
  {
    id: "retail",
    title: "Retail",
    descriptor:
      "Physical stores, e-commerce businesses, marketplaces, wholesalers, franchise networks and consumer-focused brands.",
  },
  {
    id: "logistics",
    title: "Logistics",
    descriptor:
      "Transport companies, warehouses, freight forwarders, courier networks, distributors and delivery service providers.",
  },
  {
    id: "public-sector",
    title: "Public Sector",
    descriptor:
      "Government institutions, municipalities, public agencies, schools, utilities and organizations providing public services.",
  },
] as const;

/**
 * The organisations a descriptor names, as its own words.
 *
 * The seven sectors are the section's headings; these are its content. Read end
 * to end they are a portrait of everyone Mardal builds for — banks, pharmacies,
 * factories, warehouses, municipalities — and that breadth is the claim the
 * section is making. `IndustriesSection` sets them as one run.
 *
 * **Split from the descriptor rather than written out beside it.** A second copy
 * of the same words is a second thing to keep in step, and this one would drift
 * the first time a sector's line was edited. The split is safe on this copy
 * because no phrase contains its own `and` — checked, and pinned in
 * `rendered-html.test.mjs` by rejoining them and comparing against the
 * descriptor they came from, so a rewrite that breaks the rule fails rather
 * than quietly producing half a phrase.
 */
function audiencesOf(descriptor: string): string[] {
  return descriptor
    .replace(/\.$/, "")
    .split(/,\s*|\s+and\s+/)
    .map((phrase) => phrase.trim())
    .filter(Boolean);
}

/**
 * The services, in the two halves the owner split them into on 2026-10-03:
 * Development, then Creative.
 *
 * Development leads because building and connecting systems is the position
 * (PRODUCT.md); Creative is the work that stands beside it. The order inside
 * each half is the owner's as well.
 *
 * Names only since 2026-10-08: each had a page of its own in the old design,
 * and the owner had them deleted ("delete it all", "we dont have seperate
 * pages for those links") — every service is on the services page's wheel.
 * The names are still the contact letter's topics (content/contact.ts).
 */
const serviceGroups = [
  {
    label: "Development",
    items: [
      { label: "Websites" },
      { label: "Software" },
      { label: "CRM Solution" },
      { label: "AI & Automation" },
    ],
  },
  {
    label: "Creative",
    items: [
      { label: "Branding & Logo" },
      { label: "UX/UI Design" },
      { label: "Print Design" },
    ],
  },
] as const;

/* One service, whichever half it is in. Named so the two halves can be run
   together: left to infer from a union of two tuples, `flatMap` gives up and
   calls every item `unknown`. */
type ServiceName = (typeof serviceGroups)[number]["items"][number];

/** The seven by name, the two halves run together, in the owner's order —
 *  the contact letter's topics (content/contact.ts). */
export const serviceNames: readonly ServiceName[] = serviceGroups.flatMap<ServiceName>(
  (group) => group.items,
);

/**
 * The site's menu, and the only copy of it.
 *
 * The header renders it as the mega menu and the footer renders it as its link
 * columns, so the two cannot say different things — which they did while this
 * lived inside the header component.
 *
 * Names only. The redesign of 2026-10-03 put a line of description under each
 * name, and the owner took them straight out: "why explanation under each menu
 * that is very bad". Do not put them back.
 */
export const menu = [
  {
    key: "services",
    label: "Services",
    eyebrow: "Mardal Services",
    description: "Build, connect, and automate the systems behind your growth.",
    href: "/services",
    /* **The word goes to the services' page** — owner, 2026-10-06: "when i
       click services dosen open new page but opens sub service? we need our
       new pages". It was a disclosure (owner's call, 2026-08-24, for Services,
       Products and Company alike: disclosures, not destinations) while
       /services was a placeholder; it is the wheel of every service now, so
       the word is a page, as Clients is. Products followed on 2026-10-08.

       A separate field rather than blanking `href`, because the address is
       still true — `/services` is a real route and the page behind it is real,
       if only as a placeholder — and the header is not the only thing reading
       this list. Emptying the href to make the word un-clickable would be
       encoding a presentation choice as a missing fact.

       Clients is the one entry that stays both, and carries `false` rather than
       nothing so the field is a decision on every entry instead of an
       exception someone has to notice is absent. */
    panelOnly: false,
    /* No panel and no links under the word: the services' own pages were
       deleted on 2026-10-08, and every service is on this page's wheel. */
    items: [],
  },
  /* Solutions is deliberately not here. The seven industries have no pages of
     their own, so every entry it carried was an anchor back to a run further
     down the homepage — a menu that only ever scrolled you. The section itself
     is untouched and still on the homepage; it is reached by reading the page
     rather than by being sent there. Both the header and the footer read this
     list, so it is gone from the two of them at once. */
  {
    key: "products",
    label: "Products",
    eyebrow: "Mardal Products",
    description: "Focused digital products designed and built by Mardal.",
    href: "/products",
    /* A page, as Services is — owner, 2026-10-08, of the two products'
       own pages: "delete it all", "we dont have seperate pages for those
       links". Both products are on the products page. */
    panelOnly: false,
    items: [],
  },
  /* The only entry in the bar that is both a page and a list. `href` is a route
     rather than an anchor, so the word itself is a link and clicking it goes to
     the page; `items` is not empty, so hovering it opens the panel. The header
     reads those two facts separately and needs no flag from here.

     What the panel holds is the seven sectors, which is the honest answer to
     what a menu called Clients can say while PRODUCT.md still forbids naming a
     client in public: not who they are, but what they do. It names nobody.

     The same seven were a group of their own, Solutions, and came out of the
     header and the footer on 2026-08-09 because they were a menu that only ever
     scrolled you. They are back under a word that now has somewhere to go, and
     written `/#id` so they resolve from every page rather than only from the
     homepage.

     Before this it was a panel holding a single ArvenaAI anchor pointing at a
     section on no page — and PRODUCT.md is explicit that it could never point at
     the Clients page either, since ArvenaAI is an unreleased in-house product
     and must not be written as a delivered client outcome. It lives under
     Products.

     "Clients" rather than "Case Studies". The route stays /case-studies — the
     hero's drawing is generated from that slug, so moving it would redraw the
     page. */
  {
    key: "case-studies",
    label: "Clients",
    eyebrow: "Mardal Clients",
    description: "The sectors we build for, and what each client owns.",
    href: "/case-studies",
    /* The one word in the bar that still goes somewhere on a press. */
    panelOnly: false,
    /* **No panel.** It held the seven sectors, each going to the Clients page
       with itself already chosen. The owner replaced that taxonomy on
       2026-08-25 — the index is a rail of disciplines now and there is no
       sector view to send anyone to — so the seven routes went and this went
       with them.

       Which returns Clients to a plain link, and the header needs no flag to
       know that: `hasPanel` is `items.length > 0`, so an empty list means the
       word is a link with no chevron and no panel, exactly as it was before the
       sectors were put in it.

       An empty array rather than the field being deleted, so every entry in
       this menu still answers the same two questions. */
    items: [],
  },
  /* **About is one page, and Contact a word of its own** — owner,
     2026-10-08, of the menu's About (a parent holding About, Blog, Careers
     and Contact): "i want to remain only one page about", and "add contact".
     So both are plain links, as Clients is. Blog stays in the footer;
     Careers was deleted the same day. (This entry was Company, a panel of
     those four.) */
  {
    key: "about",
    label: "About",
    eyebrow: "Inside Mardal",
    description: "Meet the people, thinking, and culture behind our work.",
    href: "/about",
    panelOnly: false,
    items: [],
  },
  {
    key: "contact",
    label: "Contact",
    eyebrow: "Contact",
    description: "Start a project with Mardal.",
    href: "/contact",
    panelOnly: false,
    items: [],
  },
] as const;

export const contactEmail = "info@mardal.co";

/** The words beside the wordmark in the bar. "Kosova" from the owner's comp of
 *  2026-10-03; "Operating from Kosova" on his word of 2026-10-05. Mardal is a
 *  registered Kosovo company (PRODUCT.md). */
export const brandPlace = "Operating from Kosova";

/** The menu button's word — owner, 2026-10-03: "instead of two horisontal for
 *  burger menu lets try MENU +". The same word open and shut; the mark beside
 *  it says which (a plus, a minus while it is open). Sentence case since
 *  2026-10-05, from the owner's screenshot of "Menu -¦-". */
export const menuButton = "Menu";

/**
 * The homepage's opening, the owner's concept of 2026-10-03: the heading and a
 * band of the photograph first, then — as the page is scrolled — the photograph
 * opens to the whole screen, the heading goes to its foot in white and the
 * sentence arrives above it. Every word is his comp's, line for line, in his
 * capitals.
 *
 * The red square is in the photograph itself, not drawn by the page. (Tried
 * in bright orange on 2026-10-03 and put back to his red the same day.) Since
 * 2026-10-05 it is the site's red, #ff3300, on the owner's word ("make also th
 * ebox on herobanner with same color"): the square alone was recoloured, edge
 * and grain kept, into house-hero-1540-ff3300.webp. The untouched original,
 * house-hero-1540.webp, is still in public/ — one line back if he wants it.
 */
export const houseHero = {
  titleLines: ["HOUSE OF CREATIVITY", "& TECHNOLOGY"],
  supportLines: [
    "Good design and Development creates real value.",
    "We create for people, businesses and society.",
  ],
  image: {
    src: "/house-hero-1540-ff3300.webp",
    width: 1540,
    height: 1021,
    alt: "A woman and a man in traditional dress walking past, blurred by their movement, with a red square between them.",
  },
} as const;

/**
 * The line under the hero: the two halves of how the work is made.
 *
 * The heading is one sentence broken into three pieces so the plus can be set
 * between them as a drawn mark rather than a character. `spoken` is what a
 * screen reader is given in place of that mark, since a CSS shape says nothing.
 */
export const fusion = {
  /* Human Creativity reads first — owner's call, 2026-08-24, and the two
     halves swapped rather than the component being taught which side to put
     which on. The field names say where the words go and that is all the
     header needs to know; nothing else on the site reads either of them. Since
     the owner's comp of 2026-10-05 the stylesheet places the two halves apart
     — "left" up by the second rule, "right" lower, beside the plus, from the
     third — by the `data-fusion-half` the component writes from these. */
  left: ["Human", "Creativity"],
  right: ["Artificial", "Intelligence"],
  /* The drawn plus is hidden from the accessible tree, so this is the whole of
     what the heading is read as — it has to follow the eye's order, or a
     screen reader is given the old sentence off a page that now says the
     other. */
  spoken: "Human Creativity plus Artificial Intelligence",
  /* The first sentence alone, as the owner's comp of 2026-10-05 sets it; the
     second ("Together, these strengths…") is not in it. */
  copy:
    "We unite the power and precision of artificial intelligence with the imagination and originality of human creativity, creating technology that thinks smarter, feels more human, and unlocks new possibilities.",
} as const;

/**
 * Selected Work, under Human Creativity + Artificial Intelligence — the
 * owner's comp of 2026-10-05: the heading, VIEW ALL, and two pieces of work,
 * a tall picture and a wide one, three lines under each.
 *
 * Every word is his comp's, line for line. Both pieces read "Buhler" in it;
 * they are set as he drew them, not filled in with a second client.
 *
 * ⚠ The picture is cut from his screenshot of the comp, 607×764 — the only
 * copy of it on this machine. It is soft on a 2x screen; the original file
 * replaces it at the same path. Both pieces use it: the wide one is the same
 * photograph at the same scale, cut lower (his comp, measured).
 *
 * No piece links anywhere: there is no Buhler page, and a card that opens
 * nothing is the promise this site refuses to make (see `work.items`). VIEW
 * ALL goes to the case-studies index, which exists.
 *
 * (Three in a row with a hover that opened the picture was tried the same day
 * and reverted on his word: "i dont like the selectec work design, revers as
 * it was".)
 */
export const selectedWork = {
  id: "selected-work",
  /* Capitals, written as he wrote them — owner, 2026-10-05: "make in lletter
     in upperc case SELECTED WORK" — like VIEW ALL beside it. */
  titleLines: ["SELECTED", "WORK"],
  viewAll: { label: "VIEW ALL", href: "/case-studies" },
  items: [
    {
      key: "buhler-tall",
      shape: "tall",
      name: "Buhler",
      services: "Software, CRM",
      location: "Switzerland",
      image: {
        src: "/selected-work-buhler.webp",
        width: 607,
        height: 764,
        alt: "A phone showing the Bühler Law website, resting on the arm of a chair.",
      },
    },
    {
      key: "buhler-wide",
      shape: "wide",
      name: "Buhler",
      services: "Software, CRM",
      location: "Switzerland",
      image: {
        src: "/selected-work-buhler.webp",
        width: 607,
        height: 764,
        alt: "A phone showing the Bühler Law website, resting on the arm of a chair.",
      },
    },
  ],
  /* **Two more, in a format of their own** — owner, 2026-10-05: "add more two
     project to the homepage in differen format"; "change format of prject not
     same" (of a row that only turned the first round); then, of two squares
     each on its own row with its lines beside it, "i want those two last …
     to be near each other". So: two squares side by side, close, on the
     page's second and third columns, their lines under them. ⚠ Buhler again,
     as every piece in his comps reads; his own projects replace them when he
     sends them. */
  features: [
    {
      key: "buhler-feature-1",
      name: "Buhler",
      services: "Software, CRM",
      location: "Switzerland",
      image: {
        src: "/selected-work-buhler.webp",
        width: 607,
        height: 764,
        alt: "A phone showing the Bühler Law website, resting on the arm of a chair.",
      },
    },
    {
      key: "buhler-feature-2",
      name: "Buhler",
      services: "Software, CRM",
      location: "Switzerland",
      image: {
        src: "/selected-work-buhler.webp",
        width: 607,
        height: 764,
        alt: "A phone showing the Bühler Law website, resting on the arm of a chair.",
      },
    },
  ],
} as const;

/**
 * "about" — the owner's comp of 2026-10-05, under Selected Work: the word with
 * its "o" set as the site's red square, and beside it the paragraph. Every word
 * is his, line for line; the "o" stays in the heading for anyone who reads it
 * rather than sees it (the square carries it, visually hidden).
 */
/** His lines, as his comp breaks them. Set one to a line from 56rem up —
 *  where his longest still fits the column; the paragraph's size follows the
 *  window down to its floor — and run together as one paragraph below that.
 *  No single measure
 *  could break them his way in this face: his first line sets wider than his
 *  third would with the next word added. */
const aboutIntroLines = [
  "We’re a small team of curious humans who create work we’re proud of for people",
  "and brands we believe in. With collaboration at the heart of every project, we",
  "identify what skills are required and then bring the best people together to",
  "create something truly extraordinary. Combining strategy, branding, web design",
  "and development, we build digital experiences that transform the way people",
  "connect and interact with brands.",
] as const;

export const aboutIntro = {
  id: "about",
  title: { before: "ab", letter: "o", after: "ut" },
  copyLines: aboutIntroLines,
  copy: aboutIntroLines.join(" "),
} as const;

/**
 * "Our expertise" — the owner's comp of 2026-10-05, under "about": two words,
 * each behind a red cross, and under the pointer each opens its services.
 *
 * Each row's five are his, word for word — owner, 2026-10-06, a list for
 * each of the three (his numbering, and the notes between the lists on what
 * he left out and why, are not part of it).
 */
export const expertise = {
  id: "expertise",
  labelLines: ["Our", "expertise"],
  /* Bottom right — owner, 2026-10-06: "on the rigt bottom of this section add
     button VIEW ALL". Selected Work's own, to every service. */
  viewAll: { label: "VIEW ALL", href: "/services" },
  groups: [
    {
      key: "creative",
      title: "Creative",
      items: ["Branding", "UX/UI Design", "Web Design", "Product Design", "Social Media Design"],
    },
    {
      key: "development",
      title: "Development",
      items: ["Websites", "Web Platforms", "Mobile Apps", "Custom Software", "CRM Solutions"],
    },
    /* A third row, under Development — owner, 2026-10-06: "add another one
       under development at Artificial Intelegence", then "change ai to this:
       AI + Automation" — a typed plus ("make it a normal +"). */
    {
      key: "ai",
      title: "AI + Automation",
      items: [
        "AI Assistants",
        "AI Integrations",
        "Workflow Automation",
        "Sales & CRM Automation",
        "Customer Service Automation",
      ],
    },
  ],
} as const;

export const services = {
  id: "services",
  eyebrow: "What we do",
  title: "Services built around the way you work.",
  summary:
    "From applied AI to connected platforms, we remove friction, speed up delivery, and give teams room to grow.",
  /* Read by `ServicesSection`, which no page renders — see the note on
     `#services` being dead site-wide. Kept in step with the menu anyway: a list
     of services that still names a deleted one is a trap for whoever revives
     this, and it costs four lines to not set it. */
  items: [
    {
      id: "ux-ui-branding",
      title: "Branding",
      description: "Design and identity, made to be built.",
    },
    {
      id: "web-platforms",
      title: "Websites",
      description: "Fast, intuitive digital products built to grow.",
    },
    {
      id: "custom-software",
      title: "Software",
      description: "Build the software your business actually needs.",
    },
    {
      id: "crm-solutions",
      title: "CRM Solution",
      description: "Give customer-facing teams one clear place to work.",
    },
    {
      id: "ai-automation",
      title: "AI & Automation",
      description:
        "Turn repetitive work into intelligent, dependable workflows.",
    },
  ],
} as const;

export const solutions = {
  id: "solutions",
  eyebrow: "Who we build for",
  title: "Technology shaped around the realities of your sector.",
  lede: "Built across industries",
  /**
   * The same line, broken where the owner broke it: `Built across` / `industries`.
   *
   * Authored rather than left to the box, which is this site's practice for a
   * heading — the hero and the About page both carry their own breaks, for the
   * same reason: where a heading turns is a decision about the copy, not a
   * consequence of how wide its column happens to be that day.
   *
   * `lede` stays as the unbroken sentence. It is what a screen reader is given
   * and what anything else reading this object gets.
   */
  ledeLines: ["Built across", "industries"],
  /* The seven, from the one declaration at the top of this file. The header's
     Clients panel is built from the same list, so a sector cannot be renamed in
     one place and not the other. */
  items: industries,
  /* The way on from the run, and it now goes somewhere. It read `Explore` and
     pointed at `#contact` — seven sectors naming an audience and then sending
     you to an email address, because when it was written there was nowhere else
     to be sent.

     `All` is doing work in the label rather than decorating it: every name above
     it goes to that sector's own page now, so this is the one that does not
     narrow. It is also the word the Clients index already uses at the foot of
     its own list for exactly this job, which is why it is that word and not
     `Explore everything`.

     Here rather than in the component because copy lives in content — and note
     `products.cta` is a different label with its own history. The two have
     drifted once already and there is an assertion holding them apart. */
  cta: "Explore All",
  ctaHref: "/case-studies",
} as const;

export const products = {
  id: "products",
  /** The label, two lines on the first rule as "Our / expertise" is. */
  labelLines: ["Mardal", "Products"],
  /** Set as explicit lines, so the break falls in the same place at every
   *  width and the step below it is a decision rather than a wrap. The full
   *  stop is drawn as a square of the site's red, as about's "o" is; the
   *  character itself stays for a screen reader and for anyone who copies it. */
  titleLines: ["We build what", "should exist"],
  titleStop: ".",
  summary:
    "Our products begin with a real need, not a trend. We explore, build, test, and refine each idea into a useful digital experience, then bring that knowledge into every solution and partnership we create.",
  /** Photographs, not screenshots: neither has an interface worth showing
   *  yet, so each image stands for what the product is about rather
   *  than claiming to be the product. */
  items: [
    {
      id: "arvena-ai",
      title: "Arvena AI",
      status: "In development",
      description:
        "Applied AI for mental-health support, built around safety and consent. The hard part was never the conversation — it is knowing what not to say, when to step back, and how to hand someone on to real help.",
      image:
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A footbridge running into woodland.",
      year: "2025",
    },
    {
      id: "ftesa",
      title: "Ftesa.co",
      status: "In development",
      description:
        "Self-service digital invitations, personalised for every guest. Everyone invited gets their own invitation and their own link, and the replies come back to one place instead of scattered across a dozen chats.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A long table laid for guests.",
      year: "2026",
    },
  ],
  /** The product cards only. `ctaHref` below is read by half the site — every
   *  service hero and CTA block points at it — but this label is read by
   *  `ProductsSection` and nowhere else, which is why the cards could be
   *  changed without touching the "Get in touch" the service pages still use.
   *
   *  Sentence case because every call to action on this site is: Hire us,
   *  Start a project, Let's build, Explore. Tracked upper case is the voice of
   *  the small labels here, not of the links. */
  cta: "Explore more",
  ctaHref: "mailto:info@mardal.co",
} as const;

export const contact = {
  id: "contact",
  eyebrow: "Have something in mind?",
  /** Set as explicit lines, so the break falls in the same place at every
   *  width rather than wherever the column happens to run out. */
  titleLines: ["Let’s build", "smarter"],
  body:
    "Tell us what you want to improve, automate, or create. We’ll help turn it into a practical digital solution.",
  cta: "Start a conversation",
} as const;

export const footer = {
  statement: "Technology that works for people and moves business forward.",
  /**
   * Where and how to reach Mardal — all of it real, supplied by the owner.
   *
   * The phone is written with the spaces it is read with and dialled without
   * them; the address keeps its typographic quotes rather than the typewriter
   * pair, the way every other apostrophe on the page is set.
   */
  details: [
    {
      label: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      short: "EMAIL",
    },
    {
      label: "Phone",
      value: "+383 49 210 999",
      href: "tel:+38349210999",
      short: "TEL",
    },
    /* Street, then postcode and city — the order an address is written in,
       and the order that survives a phone.
     *
     * The value column is 134px wide on a 320 screen and the address is
     * thirty characters, so it wraps wherever it is put. Written city-first
     * it broke straight after the opening quote, `“Isa` on one line and
     * `Boletini”` on the next; hard spaces inside the name fix that but leave
     * `Gjilan,` alone on a line, because the name will not fit beside it.
     * This way it breaks once, at the comma, into two lines that each say
     * something. It also puts 6000 next to the city, where it reads as a
     * postcode rather than as a number left over from the street. */
    {
      label: "Address",
      value: "Rr. “Isa Boletini”, 6000 Gjilan",
      href: "",
      short: "STR",
    },
  ],
  /**
   * Drawn rather than named, and not yet links: the accounts exist but their
   * addresses have not been given, and a guessed profile URL is worse than a
   * mark that waits for one.
   */
  socialLabel: "Follow",
  /** The way back up, written now that it is a word and an arrow rather than
   *  an arrow in a ring. */
  backToTop: "Back to top",
  /** The footer's first column — owner's reference of 2026-10-05, a "Menu"
   *  over the site's pages. Since 2026-10-08 (owner: "based on what we have
   *  on menu what you suggest to change on footer", then "yes") the bar's
   *  own words in the bar's order, read from `menu` so the two cannot say
   *  different things, then Blog, which is the footer's alone. No Home: the
   *  bar has none either, and the wordmark is the way home. */
  pagesTitle: "Menu",
  pages: [
    ...menu.map(({ label, href }) => ({ label, href })),
    { label: "Blog", href: "/blog" },
  ],
  social: ["instagram", "facebook", "linkedin"],
  /**
   * The three a company site is expected to carry, each a route rather than
   * a `#privacy` that resolved nowhere at all; written on 2026-10-08
   * (content/legal.ts).
   */
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;
