/**
 * Contact.
 *
 * **Rebuilt four times on 2026-09-13, the day it was first written**, each time
 * on the owner's word. The first version carried too many things — facts with
 * copy buttons, topic boxes, a tag on every field. The second kept its left
 * column, which he liked, and put a plain form on the right; the third put the
 * homepage's bar box there instead, with no form. What he asked for in the end
 * is a form that is minimal, yet extra.
 *
 * So the right side is a letter: one short note in the display face with blanks
 * in it, and the blanks are the redaction bars this site already draws. This
 * file holds the left column's words and every word of that letter.
 *
 * **Nothing here is a new fact.** The email, the number and the address are the
 * footer's, read out of `footer.details` so the two cannot disagree. The heading
 * and the sentence are the words approved for the homepage contact section —
 * `contact` in home.ts. No opening hours, reply time or map: none has been
 * supplied, and PRODUCT.md's answer to an unsupplied fact is an absence.
 */

import { footer, menu } from "./home";

type DetailLabel = (typeof footer.details)[number]["label"];

/** A line of the footer's contact block, found by its label rather than by its
 *  position, so reordering the footer cannot hand this page the wrong fact. */
function detail(label: DetailLabel) {
  const found = footer.details.find((entry) => entry.label === label);
  if (!found) throw new Error(`footer.details in content/home.ts has no ${label}`);
  return found;
}

const email = detail("Email");
const phone = detail("Phone");
const address = detail("Address");

/**
 * How each service reads inside the letter, keyed by its label in the menu.
 *
 * The menu's list is the source — the owner reorders and renames it there — so
 * a service added to the menu without a phrase here stops the build rather
 * than quietly missing from the letter.
 */
const PHRASES: Record<string, string> = {
  Branding: "branding",
  Websites: "a website",
  Software: "software",
  "CRM Solution": "a CRM",
  "AI & Automation": "AI and automation",
};

const services = menu.find((group) => group.key === "services");
if (!services) throw new Error("the menu in content/home.ts has no services group");
const serviceItems: readonly { readonly label: string }[] = services.items;

/** The choices in the letter's one drop-down: the sentence as it reads before
 *  anything is chosen, the five services in the menu's order, and the rest. */
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
  description: "Email, phone and address for Mardal in Gjilan, Kosovo.",

  /** The approved `contact.eyebrow` as the heading, broken after `something`:
   *  the only break that does not split a phrase. */
  titleLines: ["Have something", "in mind?"],

  /** The first sentence of the approved `contact.body`. The second promises an
   *  outcome and says "solution", which is on the banned list. */
  lede: "Tell us what you want to improve, automate, or create.",

  details: [
    { label: "Email", value: email.value, href: email.href },
    { label: "Phone", value: phone.value, href: phone.href },
    /* The footer leaves the country off for room. This page has the room, and a
       reader in Zürich is better told. */
    { label: "Address", value: `${address.value}, Kosovo`, href: "" },
  ],

  /**
   * The letter on the right, word for word.
   *
   * Each blank carries the words that come before it, what it shows while it is
   * empty, and the label a screen reader is given — the sentence around a blank
   * is what a sighted reader needs, and it is not a label.
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
    /* Starts with its comma: it follows the company blank directly. */
    topic: {
      before: ", and I would like to talk about",
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
    /** The Careers form's answer, word for word, so the two forms on this site
     *  answer alike. */
    sent: "Received. We will read it and come back to you at {email}.",
    again: "Write another",

    /* Today's answer — see app/api/contact/route.ts. The link opens the
       visitor's own email app with the letter already written in it. */
    notConfigured: "Sending from the website is not switched on yet.",
    notConfiguredLink: "Send it from your email app",
    failed: "That did not send. Write to us at",
  },
} as const;
