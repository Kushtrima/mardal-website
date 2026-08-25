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
export const industries = [
  {
    id: "finance",
    title: "Finance",
    descriptor:
      "Banks, insurance companies, fintech platforms and financial service providers.",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    descriptor:
      "Hospitals, clinics, pharmacies and organizations delivering health services.",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    descriptor:
      "Factories, production companies and businesses managing industrial operations.",
  },
  {
    id: "automotive",
    title: "Automotive",
    descriptor:
      "Dealerships, repair services, vehicle platforms and mobility companies.",
  },
  {
    id: "retail",
    title: "Retail",
    descriptor:
      "Physical stores, e-commerce businesses and consumer-focused brands.",
  },
  {
    id: "logistics",
    title: "Logistics",
    descriptor:
      "Transport companies, warehouses, distributors and delivery service providers.",
  },
  {
    id: "public-sector",
    title: "Public Sector",
    descriptor:
      "Government institutions, municipalities and organizations providing public services.",
  },
] as const;

/**
 * The site's menu, and the only copy of it.
 *
 * The header renders it as the mega menu and the footer renders it as its link
 * columns, so the two cannot say different things — which they did while this
 * lived inside the header component.
 */
export const menu = [
  {
    key: "services",
    label: "Services",
    eyebrow: "Mardal Services",
    description: "Build, connect, and automate the systems behind your growth.",
    href: "/services",
    /* **The word opens the panel and goes nowhere.** Owner's call, 2026-08-24,
       for Services, Products and Company alike: they are disclosures, not
       destinations.

       A separate field rather than blanking `href`, because the address is
       still true — `/services` is a real route and the page behind it is real,
       if only as a placeholder — and the header is not the only thing reading
       this list. Emptying the href to make the word un-clickable would be
       encoding a presentation choice as a missing fact.

       Clients is the one entry that stays both, and carries `false` rather than
       nothing so the field is a decision on every entry instead of an
       exception someone has to notice is absent. */
    panelOnly: true,
    items: [
      /* The order is the owner's, 2026-08-24, and so is the shape of the list:
         System Integration deleted outright, UX/UI & Branding added at the top,
         and Web Platforms & Apps renamed to Website & Apps with its route moved
         to match.

         Four of the five are written and have a page of their own. UX/UI &
         Branding is an address with a placeholder behind it until the copy
         arrives — see content/placeholders.ts, the same arrangement Company's
         entries have. /services is a placeholder too, and since the word above
         these no longer links to it, nothing in the header or the footer reaches
         it any more.

         This list is also the difference boxes' list and the footer's. Those
         read the same order from `difference` below, which is kept in step with
         this one by hand — a site that names its five services in two orders on
         one page is the thing to avoid. */
      /* Renamed on 2026-08-25, and the routes followed an hour later on the
         owner's word — so a label and its address say the same thing again.
         `next.config.ts` redirects all four of the old ones; nothing that was
         ever linked stops resolving. */
      { label: "Branding", href: "/services/branding" },
      { label: "Websites", href: "/services/websites" },
      { label: "Software", href: "/services/software" },
      { label: "CRM Solution", href: "/services/crm-solution" },
      /* Last, and moved there on the owner's word 2026-08-25 — it sat third,
         in the middle of the run. */
      { label: "AI & Automation", href: "/services/ai-automation" },
    ],
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
    panelOnly: true,
    items: [
      { label: "Arvena AI", href: "/products/arvena-ai" },
      { label: "Ftesa.co", href: "/products/ftesa" },
      { label: "Ihrauto", href: "/products/ihrauto" },
    ],
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
  {
    key: "company",
    label: "Company",
    eyebrow: "Inside Mardal",
    description: "Meet the people, thinking, and culture behind our work.",
    href: "/company",
    panelOnly: true,
    items: [
      /* `Team` was here and is gone — owner's call, 2026-08-12: the people go
         inside About rather than standing as an entry of their own. It is the
         right way round for what there is to say. PRODUCT.md records a core of
         roughly two to five with real roles that may be published, and no names
         supplied — a page for that is a page with one paragraph on it, and a
         menu entry pointing at it promises more than About would.

         Nothing else moves. Both menus and the footer read this array, so the
         entry leaves all three at once, and the assertions that count them are
         followed down in the same commit. */
      { label: "About", href: "/about" },
      /* Blog is the one of the four that is written. About, Careers and
         Contact are addresses with a placeholder behind them; so is the word
         Company above them. See content/placeholders.ts. */
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export const contactEmail = "info@mardal.co";

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
     header needs to know; nothing else on the site reads either of them, and
     the stylesheet has no rule that treats one half differently from the
     other. */
  left: ["Human", "Creativity"],
  right: ["Artificial", "Intelligence"],
  /* The drawn plus is hidden from the accessible tree, so this is the whole of
     what the heading is read as — it has to follow the eye's order, or a
     screen reader is given the old sentence off a page that now says the
     other. */
  spoken: "Human Creativity plus Artificial Intelligence",
  copy:
    "We unite the power and precision of artificial intelligence with the imagination and originality of human creativity, creating technology that thinks smarter, feels more human, and unlocks new possibilities. Together, these strengths help us build solutions that solve challenges, transform how businesses work, and deliver lasting impact.",
} as const;

export const whyMardal = {
  label: "Why Mardal?",
  titleLines: ["Build smarter.", "Scale faster."],
  copy:
      "We help your business work better by building and connecting the technology you use every day, from AI and automation to CRM, custom software, web platforms and apps. Everything is shaped around your team, your processes and the way your business actually works.",
  cards: [
    {
      position: "one",
      art: "columns",
      label: "Applied AI",
      title: "Solving real business problems with AI",
      copy: "We use AI where it can make work faster, decisions clearer, and services more useful.",
    },
    {
      position: "two",
      art: "cycle",
      label: "Automation",
      title: "Less repetition. More progress.",
      copy: "We automate routine work so your team can focus on customers, decisions, and growth.",
    },
    {
      position: "three",
      art: "handoff",
      label: "Connected Systems",
      title: "Everything working together",
      copy: "We connect your CRM, software, data, and platforms so information moves without unnecessary manual work.",
    },
    {
      position: "four",
      art: "orbit",
      label: "Technology Partnership",
      title: "Built with you. Improved as you grow.",
      copy: "We stay involved beyond launch, adapting and improving your technology as your business changes.",
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

/**
 * The six coloured boxes: the five services the menu names, and the way of
 * working the site claims alongside them.
 *
 * Each carries the id its menu entry links to, so the Services menu lands on
 * the box for that service instead of nowhere.
 */
export const difference = {
  id: "difference",
  titleLines: ["What Makes Us", "Different."],
  /** Two columns under the heading, set against the second and third box. */
  intro: [
    "Five connected services. One team. Our designers, engineers and AI specialists work together across design and branding, websites, apps, automation, CRM and custom software, from strategy to delivery.",
    "Instead of managing separate teams and disconnected tools, you get one partner that makes everything work together—helping your business move faster, adapt more easily and grow with less complexity.",
  ],
  /* The menu's five, in the menu's order. The ids are NOT renamed with the
     labels: they are the keys `lib/isometric.ts` draws each box from and the
     anchors this section answers to, and renaming them would move two things
     that have nothing to do with what the box is called. `web-platforms` is
     the box now labelled Websites. */
  items: [
    /* One line each now. These are authored breaks, and three of the four
       names stopped having anything to break after the rename — a single
       word in a two-line array would set the second line empty. */
    { id: "ux-ui-branding", lines: ["Branding"] },
    { id: "web-platforms", lines: ["Websites"] },
    { id: "custom-software", lines: ["Software"] },
    { id: "crm-solutions", lines: ["CRM", "Solution"] },
    { id: "ai-automation", lines: ["AI &", "Automation"] },
  ],
} as const;

export const solutions = {
  id: "solutions",
  eyebrow: "Who we build for",
  title: "Technology shaped around the realities of your sector.",
  lede: "Built across industries",
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
  eyebrow: "Mardal Products",
  /** Set as explicit lines, so the break falls in the same place at every
   *  width and the step below it is a decision rather than a wrap. */
  titleLines: ["We build what", "should exist."],
  summary:
    "Our products begin with a real need, not a trend. We explore, build, test, and refine each idea into a useful digital experience, then bring that knowledge into every solution and partnership we create.",
  /** Photographs, not screenshots: none of the three has an interface worth
   *  showing yet, so each image stands for what the product is about rather
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
      field: "Mental health",
      year: "2025",
    },
    {
      id: "ihrauto",
      title: "Ihrauto",
      status: "In development",
      description:
        "Workshop operations, from first call to final invoice. One record follows the car through booking, parts, labour and payment, so the same details are not typed again at every stage.",
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A workshop wall hung with tools.",
      field: "Automotive",
      year: "2024",
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
      field: "Events",
      year: "2026",
    },
  ],
  /** All three known, and the years supplied by the owner. Which year it is
   *  — started, or due — has not been said, so the label stays the neutral
   *  one it was. */
  factLabels: { status: "Status", field: "Field", year: "Year" },
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
  social: ["instagram", "facebook", "linkedin"],
  /**
   * The three a company site is expected to carry. None of them is written
   * yet, but each is a route now rather than a `#privacy` that resolved
   * nowhere at all — the page behind it says so in the site's own voice
   * instead of the link dying under the pointer. See content/placeholders.ts.
   */
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;
