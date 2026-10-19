"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import gsap from "gsap";
import { RollingLabel } from "../ui/RollingLabel";
import { contactEmail } from "../../content/home";
import { contactPage } from "../../content/contact";

/**
 * The form on the Contact page, written as a letter with blanks in it.
 *
 * Owner, 2026-09-13, after a plain form and then a box with no form in it:
 * minimal, yet extra. So there is no field chrome at all — no boxes, no labels
 * standing over fields, no tags. The form is one short letter, and the places
 * to write are the redaction bars this site already draws: a bar where a word
 * is missing, which pales once something is written on it. Every blank has a
 * real label for a screen reader; the sentence around it is what a sighted
 * reader needs.
 *
 * **Three clauses, three lines.** The owner kept the blanks inside the
 * sentences and asked for symmetry: the running text broke wherever the column
 * ran out, each blank took the width of its own words, and one blank ended up
 * alone on a line. So each clause has a line of its own, and the last blank on
 * every line runs to the letter's right edge — see `.letter__clause`.
 *
 * The one authored moment is the blanks drawing themselves in from their left
 * edge as the page arrives — the homepage boxes' redraw, given to the letter.
 *
 * ── Where a message goes ──
 *
 * Into the visitor's own email app. The site is plain files on GitHub Pages
 * (owner, 2026-10-19; see next.config.ts), with no server and no mail service
 * behind it, so Send checks the blanks and then offers a link that opens the
 * visitor's email app with the letter already written. Nothing typed here is
 * lost, and nothing claims to have been sent.
 */

type Status = "idle" | "not-configured";
type Needed = "name" | "email" | "message";

/** Deliberately loose: it catches a typo, and the email app does the rest. */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function read(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** The letter as an email, for when the site cannot send it itself — the same
 *  sentences the visitor filled in, in the same order, with the punctuation
 *  the page leaves to its line breaks. */
function asEmail(data: FormData) {
  const { letter } = contactPage;
  const name = read(data, "name");
  const company = read(data, "company");
  const topic =
    letter.topics.find((entry) => entry.value === read(data, "topic")) ??
    letter.topics[0];

  const from = company ? ` ${letter.company.before} ${company}` : "";
  const body = [
    letter.greeting,
    "",
    `${letter.name.before} ${name}${from}, ${letter.topic.before} ${topic.phrase}.`,
    `${letter.email.before} ${read(data, "email")}.`,
    "",
    read(data, "message"),
  ]
    .join("\n")
    /* CRLF, which is what RFC 6068 asks a `mailto:` body to break lines with. */
    .replace(/\r?\n/g, "\r\n");

  const subject = company ? `Enquiry from ${name}, ${company}` : `Enquiry from ${name}`;

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function LetterForm() {
  const { letter } = contactPage;
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [flagged, setFlagged] = useState<Needed[]>([]);
  const [problem, setProblem] = useState("");
  const [fallback, setFallback] = useState("");

  /* The blanks draw in from their left edge, one after another, a beat after
     the page arrives. A layout effect, so the first frame already has them
     closed rather than drawn and then taken away; cleared when it is done, so
     nothing is left clipping a field someone is typing in. */
  useLayoutEffect(() => {
    const root = formRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blanks = root.querySelectorAll<HTMLElement>("[data-blank]");
    const tween = gsap.fromTo(
      blanks,
      { clipPath: "inset(0% 100% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.45,
        clearProps: "clipPath",
      },
    );

    return () => {
      tween.kill();
    };
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const data = new FormData(element);

    const missing = (["name", "email", "message"] as const).filter(
      (key) => !read(data, key),
    );
    const badEmail = !missing.includes("email") && !EMAIL.test(read(data, "email"));
    const wrong: Needed[] = badEmail ? [...missing, "email"] : [...missing];

    setFlagged(wrong);
    setProblem(
      missing.length
        ? letter.missing.replace(
            "{fields}",
            new Intl.ListFormat("en", { type: "conjunction" }).format(
              missing.map((key) => letter.needed[key]),
            ),
          )
        : badEmail
          ? letter.badEmail
          : "",
    );

    if (wrong.length) {
      element.querySelector<HTMLElement>(`[name="${wrong[0]}"]`)?.focus();
      return;
    }

    setFallback(asEmail(data));
    setStatus("not-configured");
  }

  /* A blank stops being marked the moment it is written in. */
  function onInput(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as Needed;
    if (!flagged.includes(field)) return;

    const next = flagged.filter((key) => key !== field);
    setFlagged(next);
    if (!next.length) setProblem("");
  }

  const invalid = (key: Needed) => (flagged.includes(key) ? true : undefined);

  const line = problem ? (
    problem
  ) : status === "not-configured" ? (
    <>
      {letter.notConfigured} <a href={fallback}>{letter.notConfiguredLink}</a>
    </>
  ) : null;

  return (
    <form
      ref={formRef}
      className="letter"
      noValidate
      aria-label={letter.label}
      onSubmit={onSubmit}
      onInput={onInput}
    >
      <p className="letter__line">{letter.greeting}</p>

      <p className="letter__line letter__clause">
        <span className="letter__words">{letter.name.before}</span>
        <label className="visually-hidden" htmlFor={`${id}-name`}>
          {letter.name.label}
        </label>
        <input
          className="letter__blank letter__blank--short"
          id={`${id}-name`}
          type="text"
          name="name"
          autoComplete="name"
          placeholder={letter.name.placeholder}
          required
          aria-invalid={invalid("name")}
          data-blank
        />
        <span className="letter__words">{letter.company.before}</span>
        <label className="visually-hidden" htmlFor={`${id}-company`}>
          {letter.company.label}
        </label>
        <input
          className="letter__blank letter__blank--fill"
          id={`${id}-company`}
          type="text"
          name="company"
          autoComplete="organization"
          placeholder={letter.company.placeholder}
          data-blank
        />
      </p>

      <p className="letter__line letter__clause">
        <span className="letter__words">{letter.topic.before}</span>
        <label className="visually-hidden" htmlFor={`${id}-topic`}>
          {letter.topic.label}
        </label>
        {/* Wrapped so the chevron can be drawn: a `<select>` takes no
            pseudo-elements of its own. The wrapper is the line's last blank,
            so it is the one that runs to the edge. */}
        <span className="letter__choice letter__blank--fill" data-blank>
          <select
            className="letter__blank letter__blank--choice"
            id={`${id}-topic`}
            name="topic"
            defaultValue=""
          >
            {letter.topics.map((topic) => (
              <option key={topic.phrase} value={topic.value}>
                {topic.phrase}
              </option>
            ))}
          </select>
        </span>
      </p>

      <p className="letter__line letter__clause">
        <span className="letter__words">{letter.email.before}</span>
        <label className="visually-hidden" htmlFor={`${id}-email`}>
          {letter.email.label}
        </label>
        <input
          className="letter__blank letter__blank--fill"
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder={letter.email.placeholder}
          required
          aria-invalid={invalid("email")}
          data-blank
        />
      </p>

      <label className="letter__line letter__lead" htmlFor={`${id}-message`}>
        {letter.message.before}
      </label>
      <textarea
        className="letter__blank letter__blank--block"
        id={`${id}-message`}
        name="message"
        rows={3}
        placeholder={letter.message.placeholder}
        required
        aria-invalid={invalid("message")}
        data-blank
      />

      <div className="letter__foot">
        {/* Beside Send, and `aria-live` so a reader who cannot see it appear
            is still told. Empty, and so hidden, until there is something to
            say. */}
        <p className="letter__status" role="status" aria-live="polite">
          {line}
        </p>

        <button className="letter__send" data-roll type="submit">
          <RollingLabel>{letter.send}</RollingLabel>
          <SendArrow />
        </button>
      </div>
    </form>
  );
}

/** VIEW ALL's thin arrow, up and to the right: the site's button — owner,
 *  2026-10-08: "chnage the button SEND to our button" (it carried the pixel
 *  arrow). */
function SendArrow() {
  return (
    <svg
      className="letter__send-arrow"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 14 14 2M4.5 2H14v9.5" />
    </svg>
  );
}
