/**
 * Contact.
 *
 * **Rebuilt four times on 2026-09-13, the day it was first written**, each time
 * on the owner's word — too many things; a plain form; the homepage's bar box
 * with no form — until the form became a letter with blanks in it, which he
 * kept. Then the page was pared down around the letter: the email, phone and
 * address came off, since the footer under the page carries all three, and the
 * question went to the top with the letter under it.
 *
 * So this file holds the question, its sentence, and every word of the letter.
 *
 * **Nothing here is a new fact.** The heading and the sentence are the words
 * approved for the homepage contact section — `contact` in home.ts. No opening
 * hours, reply time or map: none has been supplied, and PRODUCT.md's answer to
 * an unsupplied fact is an absence.
 */

import { serviceNames } from "./home";

/**
 * How each service reads inside the letter, keyed by its name
 * (`serviceNames` in content/home.ts — the menu's list until 2026-10-08).
 *
 * That list is the source — the owner reorders and renames it there — so
 * a service added to it without a phrase here stops the build rather
 * than quietly missing from the letter.
 */
const PHRASES: Record<string, string> = {
  Websites: "a website",
  Software: "software",
  "CRM Solution": "a CRM",
  "AI & Automation": "AI and automation",
  /* Was "branding" while the menu said Branding. Since 2026-10-03 it says
     Branding & Logo, and someone who came for a logo should find it here. */
  "Branding & Logo": "a brand or a logo",
  "UX/UI Design": "UX/UI design",
  "Print Design": "print design",
};

const serviceItems: readonly { readonly label: string }[] = serviceNames;

/** The choices in the letter's one drop-down: the sentence as it reads before
 *  anything is chosen, the services in the owner's order, and the rest. */
const topics = [
  { value: "", phrase: "a project" },
  ...serviceItems.map((item) => {
    const phrase = PHRASES[item.label];
    if (!phrase) {
      throw new Error(`the contact letter has no phrase for the service "${item.label}"`);
    }
    return { value: item.label, phrase };
  }),
  { value: "Something else", phrase: "something else" },
];

export const contactPage = {
  title: "Contact",
  description: "Write to Mardal, in Gjilan, Kosovo.",

  /** The approved `contact.eyebrow` as the heading, broken after `something`:
   *  the only break that does not split a phrase. */
  titleLines: ["Have something", "in mind?"],

  /** The first sentence of the approved `contact.body`. The second promises an
   *  outcome and says "solution", which is on the banned list. */
  lede: "Tell us what you want to improve, automate, or create.",

  /**
   * The letter, word for word.
   *
   * Each blank carries the words that come before it, what it shows while it is
   * empty, and the label a screen reader is given — the sentence around a blank
   * is what a sighted reader needs, and it is not a label.
   *
   * **Three clauses, three lines** — see `.letter__clause`. The punctuation
   * that ended each clause is gone from the page with the line breaks that
   * replaced it; the email the letter becomes still carries it.
   */
  letter: {
    label: "Write to Mardal",
    greeting: "Hello Mardal,",
    name: { before: "My name is", placeholder: "your name", label: "Your name" },
    company: {
      before: "from",
      placeholder: "your company",
      label: "Your company, optional",
    },
    topic: {
      before: "and I would like to talk about",
      label: "What it is about, optional",
    },
    topics,
    email: {
      before: "You can reach me at",
      placeholder: "your email",
      label: "Your email",
    },
    /* A visible label, the one blank that has one: it is a line of the letter
       and a label at once. */
    message: {
      before: "Here is what I have in mind:",
      placeholder: "a few lines are enough",
    },

    send: "Send",
    sending: "Sending…",

    /* Said once, beside Send, rather than under each blank: a letter with a
       message under every missing word would stop reading as a letter. */
    needed: { name: "your name", email: "your email", message: "a few lines" },
    missing: "Add {fields} to send it.",
    badEmail: "That email address does not look complete.",

    sentTitle: "Thank you, {name}.",
    /** The answer a sent letter gets. */
    sent: "Received. We will read it and come back to you at {email}.",
    again: "Write another",

    /* Today's answer — see app/api/contact/route.ts. The link opens the
       visitor's own email app with the letter already written in it. */
    notConfigured: "Sending from the website is not switched on yet.",
    notConfiguredLink: "Send it from your email app",
    failed: "That did not send. Write to us at",
  },
} as const;
