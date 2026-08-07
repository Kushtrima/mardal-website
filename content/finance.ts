/**
 * The Finance solutions page.
 *
 * The first of the industry pages, and the pilot the rest will be cut from.
 *
 * Nothing here is new positioning. The title specialises the solutions heading
 * the homepage already carries to one sector, and the support line is word for
 * word the descriptor the industries list already gives Finance. Sector pages
 * are where invented claims creep in easiest, so this one says only what the
 * site already says.
 */
export const finance = {
  slug: "finance",
  eyebrow: "Solutions by Industry",
  title: "Finance",
  lede: "Built for the way finance works.",
  /* Two lines, set here rather than in the page: where the line turns is a
     decision about the copy, not about the markup.
     Both are measured against the title's own 13.5ch measure, which came out at
     439px, and the longest of them is 395px. That margin is the point. The
     first draft read "Technology shaped around / the realities of finance."
     and both lines overran, so a two-line title set itself as four and broke
     mid-phrase. `ch` scales with the font size and so does the text, so a line
     that fits at one viewport fits at all of them. */
  titleLines: ["Built for the way", "finance works."],
  support:
    "Banks, insurance companies, fintech platforms and financial service providers.",
  heroCta: "Let’s build",

  /* Three columns, because the overview grid gives the copy three of its four
     tracks and places each paragraph in one of them. A fourth would wrap under
     the first and read as an orphan. */
  overview: {
    title: "Work that has to be right the first time",
    columns: [
      "We start with how the work actually moves: where a record enters, which systems have to agree on it, who signs it off, and what has to be provable afterwards. In finance the last of those is rarely optional, so it shapes what gets built rather than being added at the end.",
      "Much of the work is connecting things that already exist. Core systems, payment providers, customer records and reporting tools tend to arrive from different decades, and the job is making them behave as one without replacing all of them at once.",
      "The rest is the software your team touches every day: portals, internal tools, onboarding, reporting, and the automation that takes out the repeated handling in between. We build what the process needs and leave the parts that already work alone.",
    ],
  },

  /* The five services the site already sells, said again in this sector's
     terms and pointed at their own pages. Nothing here is a new capability;
     an industry page that invents one is how a site starts promising work it
     has not described anywhere else. */
  build: {
    title: "What we build for finance",
    items: [
      {
        id: "ai-automation",
        title: "AI & Automation",
        href: "/services/ai-automation",
        copy: "Document handling, routine checks and the repeated back-office steps in between, done the same way every time and logged as they go.",
      },
      {
        id: "system-integration",
        title: "System Integration",
        href: "/services/system-integration",
        copy: "Core systems, payment providers and reporting tools made to agree with one another, without replacing any of them first.",
      },
      {
        id: "crm-solutions",
        title: "CRM Solutions",
        href: "/services/crm-solutions",
        copy: "One place for the people who deal with customers to see who they are talking to and what has already happened.",
      },
      {
        id: "custom-software",
        title: "Custom Software",
        href: "/services/custom-software",
        copy: "The internal tools a process needs when nothing off the shelf fits the way the work is actually done.",
      },
      {
        id: "web-platforms-apps",
        title: "Web Platforms & Apps",
        href: "/services/web-platforms-apps",
        copy: "Customer-facing portals and applications, built to be quick to use and to stay maintainable afterwards.",
      },
    ],
  },

  /* Line breaks are the copy's, not the layout's: .service-cta__title is
     white-space: pre-line for exactly this. */
  cta: {
    title: "Let’s build\nwhat finance\nneeds next.",
    label: "Get in touch",
  },
} as const;
