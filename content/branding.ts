/**
 * The Branding service page.
 *
 * ── What it is ──
 * The first of the five to be written from nothing rather than moved: it was a
 * placeholder route from 2026-08-24 until the owner asked for it on 2026-08-25.
 * It leaves `content/placeholders.ts`, which is the arrangement that module
 * describes — an entry deleted there, a route written here, and nothing else on
 * the site touched.
 *
 * ── The three chapters, and why they are named as they are ──
 * A brand is decided, then drawn, then built into things. Chapter one is the
 * thinking a name and a look have to survive; chapter two is the thing itself;
 * chapter three is everything that makes it hold once other people are using
 * it. The order is a sequence a client goes through rather than a menu.
 *
 * They were called Foundations, Identity and The System for an hour, and the
 * owner was right to push back. Every other page here names its chapters for
 * what they ARE and in the words a buyer would use — CRM Solutions runs
 * `CRM Strategy · CRM Implementation · CRM Operations`, which is the same
 * three-part shape as this page. Abstractions were the odd one out on the site
 * rather than a voice it has.
 *
 * **Brand Implementation deliberately echoes CRM Implementation.** Same word,
 * same site, same meaning: the point where a decision stops being a document
 * and starts being something that runs. On this page it is literal — the
 * chapter ends in the codebase.
 *
 * The last one earns its place from what this company already sells. Mardal
 * builds the software the brand ends up living inside, so the handover is not a
 * PDF and a folder of logos — it is components, tokens and rules that the build
 * reads. That is the honest thing this service has that a design studio's does
 * not, and it is the argument for buying it here.
 *
 * ── What is deliberately not claimed ──
 * No results, no numbers, no named clients. PRODUCT.md records zero quantified
 * outcomes anywhere on this site and no per-client sign-off for naming anyone,
 * so every example below is written as what the WORK is rather than what it
 * achieved: a described situation and what was made for it. Nothing here says
 * a brand increased anything.
 */
export const branding = {
  title: "Branding",
  description:
    "Naming, identity and the design system a brand needs to survive being built.",
  heroTitleLines: [
    "A brand that holds",
    "once it is built.",
  ],
  support: "Identity, and the system that keeps it intact.",
  heroCta: "Let’s build",
  chapters: [
    {
      id: "brand-strategy",
      title: "Brand Strategy",
      description:
        "The decisions a logo cannot make for you: who the brand is talking to, what it is claiming, and what it is called.",
      services: [
        {
          id: "positioning",
          title: "Positioning",
          copy: "Work out what the business actually offers, who it is for, and what makes choosing it a reasonable decision — before any of it is drawn.",
          items: [
            "Define the audience and what they are deciding between",
            "Agree what the business claims and what it does not",
            "Find the difference that is true rather than flattering",
            "Write it down as something the whole team can repeat",
          ],
          example:
            "A company selling to two very different buyers cannot say one thing to both. We separate the two, agree what is true of each, and write the sentence the business leads with in each case.",
        },
        {
          id: "naming",
          title: "Naming",
          copy: "Names for a company, a product or a feature, checked for the things that make a good name unusable.",
          items: [
            "Generate candidates against an agreed brief",
            "Check availability of domains and social handles",
            "Read each one aloud in the languages it will be used in",
            "Narrow to a short list with the reasons written down",
          ],
          example:
            "A product name that reads well in English turns out to be difficult to say in the market it launches in. We find that before the launch rather than after it, and the shortlist records why each candidate survived or did not.",
        },
        {
          id: "tone-of-voice",
          title: "Tone of Voice",
          copy: "How the brand writes: the words it uses, the ones it avoids, and how it sounds when something has gone wrong.",
          items: [
            "Set the tone for the situations the business is actually in",
            "Write the phrases that are used often enough to be decided once",
            "Agree what is never said, and why",
            "Cover the difficult messages, not only the confident ones",
          ],
          example:
            "An error message, a price rise and a first hello are three different jobs. The voice covers all three, so the person writing the third one is not inventing the tone from nothing.",
        },
      ],
    },
    {
      id: "visual-identity",
      title: "Visual Identity",
      description:
        "The brand as something you can see: drawn, set in type, and given a palette that works everywhere it has to.",
      services: [
        {
          id: "logo-marks",
          title: "Logo & Marks",
          copy: "A primary mark and the smaller forms it has to take, drawn to survive being reproduced badly.",
          items: [
            "Draw the primary mark and its variants",
            "Test it small, in one colour, and on a photograph",
            "Set the clear space and the minimum size",
            "Deliver every file format the business will be asked for",
          ],
          example:
            "A mark that reads beautifully on a website has to survive a stitched shirt, a favicon and a black-and-white invoice. The variants exist so nobody has to improvise one at the moment they need it.",
        },
        {
          id: "typography-colour",
          title: "Typography & Colour",
          copy: "A type scale and a palette chosen for the places the brand actually appears, and checked for contrast rather than assumed.",
          items: [
            "Choose faces that are licensed for every intended use",
            "Set a scale, so sizes are decided once rather than per page",
            "Build a palette with the roles each colour plays",
            "Check text and interface contrast against WCAG AA",
          ],
          example:
            "A palette that looks right in a presentation can be unreadable as small text on a screen. Every pairing is checked at the size it will be used, and the ones that fail are recorded as failing rather than quietly used anyway.",
        },
        {
          id: "brand-assets",
          title: "Brand Assets",
          copy: "The drawn parts of a brand that are not the logo: iconography, patterns, the way photography is treated, and how a document is laid out.",
          items: [
            "Draw an icon set that belongs to the same hand as the mark",
            "Define how photographs are chosen, cropped and treated",
            "Design the templates the business sends out most often",
            "Cover print as well as screen, where print is real",
          ],
          example:
            "A proposal, an invoice and a slide deck leave the company more often than the website changes. They are designed as part of the brand rather than rebuilt by whoever is sending one.",
        },
      ],
    },
    {
      id: "brand-implementation",
      title: "Brand Implementation",
      description:
        "What turns a brand into something that survives other people using it — and, here, something the build can read directly.",
      services: [
        {
          id: "design-system",
          title: "Design System",
          copy: "The identity expressed as components and tokens rather than as a document: the pieces an interface is assembled from, and the values behind them.",
          items: [
            "Build the components a product is actually made of",
            "Name colour, type and spacing as tokens, not as screenshots",
            "Cover the states — hover, focus, error, empty, loading",
            "Keep one source that design and development both read",
          ],
          example:
            "A button exists once, with every state drawn and every value named. When the brand changes, it changes in one place and every screen that uses it follows, rather than each being found and corrected.",
        },
        {
          id: "brand-guidelines",
          title: "Brand Guidelines",
          copy: "The rules written down for the people who will use the brand without you in the room — short enough to be read, specific enough to settle an argument.",
          items: [
            "Show the correct use beside the incorrect one",
            "Cover the decisions that come up repeatedly",
            "Say what is fixed and what is open to judgement",
            "Keep it to what someone will actually read",
          ],
          example:
            "A new supplier is sent the guidelines and produces something that belongs to the brand without a conversation. That is the test — not the length of the document.",
        },
        {
          id: "handover",
          title: "Handover",
          copy: "Everything delivered in a form the next person can use: files organised, fonts licensed to the business, and the system connected to whatever it is built in.",
          items: [
            "Hand over source files, not only exports",
            "Transfer or licence the fonts to the business itself",
            "Connect the tokens to the codebase where there is one",
            "Walk the team through it while there is still time to ask",
          ],
          example:
            "The brand is built into the product rather than described beside it. Mardal builds the software these brands live inside, so the handover ends in the codebase rather than in a folder.",
        },
      ],
    },
  ],
  cta: {
    title: "Let’s build\nsomething worth\nputting your name on.",
    label: "Get in touch",
  },
} as const;
