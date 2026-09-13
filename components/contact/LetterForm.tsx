"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import gsap from "gsap";
import { PixelArrow } from "../ui/PixelArrow";
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
 * To `/api/contact`, which today answers that sending is not switched on — the
 * site has no mail service yet, see the route. The form turns that answer into a
 * link that opens the visitor's own email app with the letter already written,
 * so nothing typed here is lost. Wiring the route changes nothing in this file.
 *
 * `action` and `method` are set, as on the Careers form, so the letter still
 * posts without JavaScript.
 */

export const CONTACT_ENDPOINT = "/api/contact";

type Status = "idle" | "sending" | "sent" | "not-configured" | "failed";
type Needed = "name" | "email" | "message";

/** Deliberately loose: the endpoint's own check, said early. */
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
  const doneRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [flagged, setFlagged] = useState<Needed[]>([]);
  const [problem, setProblem] = useState("");
  const [fallback, setFallback] = useState("");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });

  /** The letter is on the page for every state but one. */
  const open = status !== "sent";

  /* The blanks draw in from their left edge, one after another, a beat after
     the page arrives. A layout effect, so the first frame already has them
     closed rather than drawn and then taken away; cleared when it is done, so
     nothing is left clipping a field someone is typing in. */
  useLayoutEffect(() => {
    if (!open) return;
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
  }, [open]);

  /* The letter is replaced by the answer, so focus goes to the answer —
     otherwise it would be left on a button that no longer exists. */
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    /* Held before the first `await`: React clears `currentTarget` once the
       handler has returned. */
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

    setStatus("sending");

    try {
      const response = await fetch(CONTACT_ENDPOINT, { method: "POST", body: data });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (response.ok && result.ok) {
        setSentTo({ name: read(data, "name"), email: read(data, "email") });
        setStatus("sent");
        return;
      }

      if (result.error === "sending-not-configured") {
        setFallback(asEmail(data));
        setStatus("not-configured");
        return;
      }

      setStatus("failed");
    } catch {
      setStatus("failed");
    }
  }

  /* A blank stops being marked the moment it is written in. */
  function onInput(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as Needed;
    if (!flagged.includes(field)) return;

    const next = flagged.filter((key) => key !== field);
    setFlagged(next);
    if (!next.length) setProblem("");
  }

  if (!open) {
    return (
      <div
        className="letter letter--sent"
        ref={doneRef}
        tabIndex={-1}
        role="status"
      >
        <p className="letter__line">
          {letter.sentTitle.replace("{name}", sentTo.name)}
        </p>
        <p className="letter__note">
          {letter.sent.replace("{email}", sentTo.email)}
        </p>
        <button
          className="letter__send"
          type="button"
          onClick={() => {
            setFlagged([]);
            setProblem("");
            setStatus("idle");
          }}
        >
          {letter.again}
          <PixelArrow
            className="letter__send-arrow"
            direction="up-right"
            size="small"
          />
        </button>
      </div>
    );
  }

  const invalid = (key: Needed) => (flagged.includes(key) ? true : undefined);

  const line = problem ? (
    problem
  ) : status === "not-configured" ? (
    <>
      {letter.notConfigured} <a href={fallback}>{letter.notConfiguredLink}</a>
    </>
  ) : status === "failed" ? (
    <>
      {letter.failed} <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
    </>
  ) : null;

  return (
    <form
      ref={formRef}
      className="letter"
      action={CONTACT_ENDPOINT}
      method="post"
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

        <button
          className="letter__send"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? letter.sending : letter.send}
          <PixelArrow
            className="letter__send-arrow"
            direction="up-right"
            size="small"
          />
        </button>
      </div>
    </form>
  );
}
