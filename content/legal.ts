/**
 * Privacy, Terms and Cookies — owner, 2026-10-08: "now we have to work on
 * privacy, terms and Cookies, then to create a cookies design for accepting
 * editing etc that fits our design".
 *
 * **Written from what the site does, and nothing else.** Checked in the code
 * the day it was written: the site sets no cookies and keeps nothing in the
 * browser except the cookie choice (lib/consent.ts); it runs no analytics or
 * advertising; its fonts are its own files. One form takes personal data —
 * the letter on /contact (name, company, topic, email, message) — and it is
 * not connected to anything yet: it hands the visitor an email instead.
 * (The careers pages and their applications were deleted on 2026-10-08.)
 *
 * **Every bracket is a fact not on file**, and none may be guessed: the
 * company's registered name and number, the hosting and email providers, how
 * long anything is kept, the governing law, the date the pages are published.
 * The text is a plain draft for the owner and his lawyer, not legal advice.
 */

export type LegalSection = {
  readonly title: string;
  readonly paragraphs: readonly string[];
  /** A way back to the cookie panel, under this section's words. */
  readonly action?: "cookie-settings";
};

/* A plain page — owner, 2026-10-08: "for privacy term etc don need the
   hero banner only normal page titles then text under it in classic way":
   the title, one line under it saying what the page covers, then each
   heading with its words under it. */
export type LegalPageContent = {
  readonly title: string;
  readonly description: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
};

const company =
  "Mardal, a company registered in Kosovo [registered name and number], Rr. “Isa Boletini”, 6000 Gjilan, Kosovo";

const updated = "Last updated: [date of publication].";

export const privacyPage = {
  title: "Privacy",
  description: "What Mardal collects through this website, why, and what you can ask of us.",
  intro:
    "This policy covers mardal.co and the letter on its contact page.",
  sections: [
    {
      title: "Who is responsible",
      paragraphs: [
        `${company}, is responsible for the personal data described on this page. Write to info@mardal.co about anything here.`,
      ],
    },
    {
      title: "What we collect",
      paragraphs: [
        "When you write to us with the letter on the contact page: your name, your company if you give it, the topic you choose, your email address and your message.",
        "When you open any page: the technical details every visit to a website carries — your IP address, your browser and the time — which our hosting provider [name] records to deliver the site and keep it secure.",
        "We do not use analytics or advertising tools, and we do not build profiles of the people who visit.",
      ],
    },
    {
      title: "Why we use it",
      paragraphs: [
        "To answer your message and talk about your project: this is needed to take the steps you ask for before any agreement.",
        "To run this website and keep it secure, which is our legitimate interest.",
      ],
    },
    {
      title: "Who else sees it",
      paragraphs: [
        "Only the services we need to run the website and to send and receive email: [hosting provider] and [email provider]. We do not sell personal data, and we do not share it for marketing.",
        "[Where those providers keep data, and the safeguards for any transfer outside Kosovo, the EU or Switzerland.]",
      ],
    },
    {
      title: "How long we keep it",
      paragraphs: [
        "Messages: [how long after the conversation ends]. Server records: [how long the hosting provider keeps them].",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "You can ask to see the personal data we hold about you, to correct it, to delete it, to limit how we use it, to object to its use, or to receive it in a format you can take elsewhere. Where we rely on your consent, you can withdraw it at any time.",
        "Write to info@mardal.co. If you think we have handled your data wrongly, you can also complain to the Information and Privacy Agency of Kosovo, or to the data protection authority where you live or work.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "When what we collect, or why, changes, this page changes with it.",
        updated,
      ],
    },
  ],
} as const satisfies LegalPageContent;

export const termsPage = {
  title: "Terms",
  description: "The terms for using the Mardal website.",
  intro:
    "Using mardal.co means accepting these terms. Work for clients is always agreed separately, in writing.",
  sections: [
    {
      title: "Who we are",
      paragraphs: [
        `This website is run by ${company}. Email info@mardal.co or call +383 49 210 999.`,
      ],
    },
    {
      title: "What this site is for",
      paragraphs: [
        "It describes what Mardal does and how to reach us. Nothing on it is an offer: every engagement is set out in a written agreement with its own scope, price and terms.",
      ],
    },
    {
      title: "Using the site",
      paragraphs: [
        "You may read, link to and share its pages. You may not copy its design, text, images or code for your own use, try to break or overload it, or use its forms to send anything unlawful or unsolicited.",
      ],
    },
    {
      title: "Our content",
      paragraphs: [
        "The text, design, code and images on this site belong to Mardal or are used with permission. The names and marks of products and of other companies belong to their owners.",
      ],
    },
    {
      title: "Accuracy and liability",
      paragraphs: [
        "We take care that what the site says is right, but it is provided as it is and can change without notice. As far as the law allows, Mardal is not liable for loss that comes from using the site or from relying on it. Nothing here limits a liability the law does not allow to be limited.",
      ],
    },
    {
      title: "Other websites",
      paragraphs: [
        "Links to other websites are there for convenience. We do not control them and are not responsible for what they contain.",
      ],
    },
    {
      title: "Law and changes",
      paragraphs: [
        "[The law that governs these terms, and the courts that hear disputes.]",
        "We may change these terms; the version on this page is the one that applies.",
        updated,
      ],
    },
  ],
} as const satisfies LegalPageContent;

export const cookiesPage = {
  title: "Cookies",
  description: "What the Mardal website keeps on your device, and how you decide.",
  intro:
    "Today this site sets no cookies. It keeps one thing on your device: your answer to the cookie question.",
  sections: [
    {
      title: "What they are",
      paragraphs: [
        "Cookies, and similar storage in your browser, are small pieces of information a website keeps on your device so it can remember something from one page or visit to the next.",
      ],
    },
    {
      title: "What this site keeps",
      paragraphs: [
        "Necessary: your cookie choice, kept in your browser's storage under the name “mardal-consent”, so the question is not asked on every page. It holds what you chose and when, and nothing that identifies you.",
        "Analytics: none at present. If we add a tool that measures visits, it will run only if you allow it.",
        "We do not use advertising or tracking cookies.",
      ],
    },
    {
      title: "Your choice",
      paragraphs: [
        "On your first visit a panel at the foot of the screen asks. “Accept all” allows every kind, “Necessary only” allows nothing optional, and “Settings” lets you choose one by one. You can change your answer at any time, here, and you can clear or block site storage in your browser's settings.",
      ],
      action: "cookie-settings",
    },
    {
      title: "Changes",
      paragraphs: [
        "If we add anything to this list, this page will say so, and the site will ask you again.",
        updated,
      ],
    },
  ],
} as const satisfies LegalPageContent;

/** The panel that asks — the consent design (components/consent). */
export const consent = {
  label: "Cookies",
  text: "We keep only what the site needs to work. Anything more, such as measuring visits, only with your permission.",
  more: { label: "Read more", href: "/cookies" },
  acceptAll: "Accept all",
  necessaryOnly: "Necessary only",
  settings: "Settings",
  save: "Save choices",
  /* On the Cookies page: the way back to the panel. */
  change: "Change cookie settings",
  categories: [
    {
      key: "necessary",
      name: "Necessary",
      text: "Remembers your answer to this question. Always on.",
      locked: true,
    },
    {
      key: "analytics",
      name: "Analytics",
      text: "Would let us see which pages are read, to make them better. None runs today; off unless you allow it.",
      locked: false,
    },
  ],
} as const;
