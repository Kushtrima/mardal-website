/**
 * Careers, and the three roles that are open.
 *
 * The first of the twelve unwritten pages to be written — it rendered
 * PlaceholderPage until today. See content/placeholders.ts for the other
 * eleven, and take this file as the shape: a page leaves that module and gets
 * one of its own.
 *
 * What is NOT here is as deliberate as what is. PRODUCT.md records that team
 * names, roles and company detail have not been supplied, and that the house
 * answer to an unsupplied fact is a bracket left unfilled rather than a
 * plausible guess. So there is no team size on this page, no salary, no start
 * date, no seniority and no list of requirements — every one of those would be
 * invented. `commitment` is a bracket for exactly that reason: the owner gave
 * the location and did not give the hours.
 *
 * The role copy is not invented. It is written from what this site already
 * publishes about the work — the five service pages and the three products —
 * so a candidate reading a role and then reading /services finds the same
 * company described twice.
 */

import { contactEmail } from "./home";

/** The one fact the owner supplied about these roles, written once. */
const location = "Gjilan or remote";

/**
 * The hours were not supplied. Left as a bracket rather than guessed — see the
 * note above, and PRODUCT.md's "Never invent facts". Filling this in is one
 * edit here and the page follows.
 */
const commitment = "[Full-time / part-time]";

export const careers = {
  title: "Careers",
  description: "Open roles at Mardal.",
  /**
   * Set as explicit lines, so the break falls in the same place at every width
   * rather than wherever the column runs out.
   *
   * The owner's own line, and the third one this page has carried. Two of mine
   * were rejected and both had the same fault: "Build the systems / businesses
   * run on." and "Build software / people work inside." are each a statement
   * about what Mardal makes, on the one page a reader has come to for what it
   * is like to work there. His is about the people, which is what a careers
   * page is for.
   *
   * Broken after "starts" rather than after "with": 17 characters against 20,
   * which is the closer pair, and it turns at a phrase rather than mid-one.
   *
   * Neither line turns at any width, which on this site is a rule rather than a
   * hope — where a heading breaks is a decision about the copy. Measured rather
   * than assumed: the longer line renders 468px at 72px, and the narrowest case
   * is a 320px window, where the title floors at 40px and the gutter at 16px a
   * side, giving 225px of line in 288px of column. 63px spare at the worst
   * width, so this needs none of the `--hero-line` machinery the Clients pages
   * carry for their longer titles.
   */
  titleLines: ["Great work starts", "with the right team."],
  support: "Three roles are open.",
  /* The way out of the hero is down the page rather than off it: the roles are
     the reason someone is here, and the hero's job is to reach them. */
  heroCta: "See the roles",
  heroCtaHref: "#roles",

  rolesId: "roles",
  /** The heading over the list, carried for a screen reader. The rules under
   *  the opening say what the section is to anyone reading the page. */
  rolesLabel: "Open roles",
  factLabels: { location: "Location", commitment: "Commitment" },
  /* The row opens the role rather than opening an email. It said "Apply" and
     went straight to a mailto, which asked someone to write an application
     before they had read what they were applying for. */
  moreLabel: "Read the role",

  roles: [
    {
      id: "ux-ui-designer",
      title: "UX/UI Designer",
      location,
      commitment,
      copy:
        "The screens people sit in all day: admin panels, portals, and the internal tools a business runs on. Dense information made legible — what a screen states first, what it holds back, and how a repeated task is made short. Figma, and enough care about the handover that what ships is what was drawn.",
      lede:
        "Design the interfaces a business works inside, not the ones it advertises with.",
      body: [
        {
          id: "the-work",
          title: "The work",
          copy: [
            "Most of what we build is operational: an admin panel somebody opens at nine and closes at five, a portal a customer uses under time pressure, a tool that replaces a spreadsheet three people were keeping in parallel. The screens are dense because the work is, and the design question is almost never how it looks first — it is what the screen states, what it defers, and what it refuses to show at all.",
            "You would own that end to end for a project: the structure of the thing, the states nobody remembers to ask for, the empty and error cases, and the handover. We build in one stylesheet with a fixed token set and three type sizes, so a design that respects the system ships intact and one that fights it is rebuilt twice.",
          ],
        },
        {
          id: "what-you-bring",
          title: "What you bring",
          copy: [
            "Work you can walk us through — the reasoning, not just the frames. We would rather see one dense interface you argued about than ten landing pages.",
            "Figma to a standard someone else can build from, an eye for typography and spacing that holds up when the content is ugly, and enough familiarity with how a front end is actually assembled that your handover is a conversation rather than a translation.",
          ],
        },
      ],
    },
    {
      id: "ai-specialist",
      title: "AI Specialist",
      location,
      commitment,
      copy:
        "Applied AI on real operations rather than demonstrations. Retrieval, prompts, evaluation, and the safety work that decides what a system must not say. The model is rarely the hard part; knowing what to do when it is wrong usually is.",
      lede:
        "Put models to work on a company's real operations, and be honest about where they fail.",
      body: [
        {
          id: "the-work",
          title: "The work",
          copy: [
            "Retrieval over a business's own documents and records, agents that carry out a step rather than describe it, classification and extraction on the material that arrives by email all day. The interesting part is rarely the model call. It is what goes into the context, how a wrong answer is caught, and what the system does when it does not know.",
            "You would build the evaluation alongside the feature, because a change that improves one answer and quietly ruins nine is the standard failure here and nothing but a measurement finds it. Where the work touches people rather than records — our own product does — the safety layer is a first-class piece of engineering: what must never be said, when to stop, and where to hand off.",
          ],
        },
        {
          id: "what-you-bring",
          title: "What you bring",
          copy: [
            "Something you have actually shipped that used a model in anger, and a clear account of what it got wrong. Retrieval, prompting and evaluation as things you have tuned rather than read about.",
            "Enough general engineering to own a feature: the data going in, the service around it, and the cost and latency it runs at. Python or TypeScript; we use both.",
          ],
        },
      ],
    },
    {
      id: "front-end-developer",
      title: "Front-End Developer",
      location,
      commitment,
      copy:
        "The web side of all of it: React and Next.js, typed, server-rendered, and holding up on a phone. You would work beside the design rather than downstream of it, and close to the systems the interface talks to — most of what we build sits over data a business already has.",
      lede:
        "Build the front of everything we ship, close to the design and close to the data.",
      body: [
        {
          id: "the-work",
          title: "The work",
          copy: [
            "React and Next.js on the App Router, typed throughout, server-rendered by default with the interactive parts kept small and deliberate. Client work, our own products, and this site — which is built the same way and is a fair sample of the standard.",
            "You would sit beside the design rather than downstream of it, and close to whatever the interface is talking to: most of what we build sits over data a company already has, in a system nobody is going to replace. Accessibility and how it behaves on a slow phone are part of the work, not a pass at the end.",
          ],
        },
        {
          id: "what-you-bring",
          title: "What you bring",
          copy: [
            "Something running that you can show us and talk about honestly, including the part you would do differently. TypeScript you are comfortable in, React you understand rather than recite, and CSS you write on purpose.",
            "A habit of reading the design closely enough to notice what it did not say, and asking rather than guessing.",
          ],
        },
      ],
    },
  ],

  /**
   * The section every role page ends its writing on, before the form.
   *
   * Shared rather than written three times, because it is about the company
   * and not the role — and because three copies of one paragraph drift.
   *
   * Every statement here is on the record. English-only is an owner decision
   * (PRODUCT.md, 2026-08-05), hybrid is what the owner gave for these roles,
   * the small core is owner-confirmed, and the customer is the positioning the
   * rest of the site is written to. Nothing about hours, pay, headcount or
   * process, because none of that has been supplied.
   */
  howWeWork: {
    id: "how-we-work",
    title: "How we work",
    copy: [
      "English is the working language, and that is a decision rather than an accident — the writing, the code and the conversations are all in it.",
      "Hybrid. The office is in Gjilan and the work does not have to be done there.",
      "The team is small, so you would be close to whoever is deciding, and what you build is what ships rather than a stage in somebody else's process. Most of the client work is for mid-sized companies in Switzerland, Germany and Austria.",
    ],
  },

  /**
   * The application, and the one part of this site that takes something in
   * rather than putting something out.
   *
   * `noUploadNote` is what the form says when the site has no bucket to put a
   * file in, which is the state this repository is in today — `.openai/
   * hosting.json` has `r2: null`, so no binding is created. It is written as
   * copy rather than as an error string because a reader should be told what
   * to do instead, not that something failed.
   */
  apply: {
    id: "apply",
    title: "Apply",
    lede:
      "Send a CV and, if you have one, something you have built. We read everything that arrives.",
    fields: {
      name: "Your name",
      email: "Email",
      cv: "CV",
      cvHint: "PDF, up to 8 MB",
      /* The native control's own words are "Choose File" and "No file chosen",
         set in the browser's font at the browser's size — the loudest thing on
         a page that sets everything else itself. These replace them. */
      cvChoose: "Choose a file",
      cvChange: "Choose another",
      cvEmpty: "No file chosen yet",
      link: "Something you have built",
      linkHint: "A link to your work",
      note: "Anything you want to add",
      noteHint: "Anything the CV does not cover",
    },
    submit: "Send application",
    sending: "Sending…",
    /**
     * Marked on every field rather than counted off in a sentence.
     *
     * It said "Only the first three are required", which asks a reader to
     * number the fields and match them against a line they have already
     * scrolled past — and it is wrong the moment a field is added anywhere but
     * the end. Both words are used, on all five, so nothing has to be inferred
     * from the absence of the other.
     */
    requiredTag: "Required",
    optionalTag: "Optional",
    success:
      "Received. We will read it and come back to you at the address above.",
    failure:
      "That did not send. Email it to {email} and we will pick it up there.",
    noUploadNote:
      "File uploads are not switched on for this site yet. Email your CV to {email} and say which role.",
    /** Said the moment a file is chosen rather than held back until submit —
     *  the two things the endpoint will refuse, in the words a reader can act
     *  on. `{max}` is filled from the same constant the endpoint caps at. */
    cvTooLarge: "That file is over {max} MB. Try exporting it again.",
    cvNotPdf: "That is not a PDF. Export or print it to PDF and choose it again.",
  },

  /** The same closing block every service page ends on, so a reader who came
   *  here from one of them lands on a foot they have already met. */
  cta: {
    title: "Nothing here fits?\nTell us what you do.",
    label: "Get in touch",
    href: `mailto:${contactEmail}`,
  },
} as const;
