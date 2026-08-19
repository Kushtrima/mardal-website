"use client";

import { useId, useState } from "react";
import { PixelArrow } from "../ui/PixelArrow";
import { careers } from "../../content/careers";

/**
 * The application form, and the one place on this site that takes something in.
 *
 * Rewritten once already, on the owner looking at it. Three things were unclear
 * and each is answered in the markup rather than in a sentence above it:
 *
 *   Which fields are required was a line saying "only the first three are" —
 *   which asks a reader to count, and is wrong the moment a field is inserted
 *   anywhere but the end. Every field says which it is now, on its own row, in
 *   the same place each time.
 *
 *   The CV control was the browser's own: a "Choose File" button in the
 *   browser's font at the browser's size, beside the words "No file chosen". It
 *   was the loudest thing on a page that sets everything else itself. The input
 *   is still the real one — clipped rather than removed, so it keeps its
 *   keyboard behaviour — and a label drives it.
 *
 *   The hints sat under the rule, which put each one nearer the next field than
 *   the one it described. They sit against their own field now, and the space
 *   between fields is larger than the space inside one.
 *
 * `action` and `method` are set on purpose. With JavaScript the submit is
 * intercepted and answered in place; without it the browser posts the form
 * itself and the application still arrives.
 */

export const MAX_CV_BYTES = 8 * 1024 * 1024;
export const APPLY_ENDPOINT = "/api/careers/apply";

const MAX_CV_MB = Math.round(MAX_CV_BYTES / 1024 / 1024);

type Status = "idle" | "sending" | "sent" | "failed" | "no-upload";

/**
 * Label on the left, whether it has to be filled in on the right. One row on
 * every field, so the answer is always in the same place rather than in a
 * sentence above the form that asks the reader to count.
 *
 * Declared out here, not inside ApplyForm. Written inside, it was a different
 * function object on every render — React treats that as a different component
 * type, unmounts the old row and mounts a new one, and does it on every
 * keystroke. Nothing in this row holds state, so nothing visibly broke, which
 * is exactly why it would have stayed.
 */
function Head({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required: boolean;
}) {
  return (
    <div className="apply-field__head">
      <label className="apply-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      <span className="apply-field__tag" data-required={required}>
        {required ? careers.apply.requiredTag : careers.apply.optionalTag}
      </span>
    </div>
  );
}

/** The one address, written once in the content and dropped into whichever
 *  sentence needs it, so two messages cannot name different ones. */
const withEmail = (line: string) => line.replace("{email}", "info@mardal.co");

export function ApplyForm({ role, roleTitle }: { role: string; roleTitle: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const fieldId = useId();
  const { apply } = careers;

  /* Checked when the file is chosen rather than held back until submit. Both
     are the endpoint's own rules said early — it checks them again, because a
     check in a browser is a courtesy and not a guarantee. */
  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setFileName(file ? file.name : "");
    setStatus("idle");
    setMessage("");

    if (!file) {
      setFileError("");
      return;
    }

    if (file.size > MAX_CV_BYTES) {
      setFileError(apply.cvTooLarge.replace("{max}", String(MAX_CV_MB)));
      return;
    }

    /* On the name here, because the bytes are not readable without opening the
       file. The endpoint reads the leading bytes and is the one that decides. */
    if (!/\.pdf$/i.test(file.name)) {
      setFileError(apply.cvNotPdf);
      return;
    }

    setFileError("");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(APPLY_ENDPOINT, { method: "POST", body: data });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (response.ok && result.ok) {
        setStatus("sent");
        setMessage(apply.success);
        form.reset();
        setFileName("");
        return;
      }

      /* The one failure that is not a failure of the application. There is no
         bucket wired to this site yet, so the reader is told where to send it
         instead rather than told that something went wrong. */
      if (result.error === "uploads-not-configured") {
        setStatus("no-upload");
        setMessage(withEmail(apply.noUploadNote));
        return;
      }

      if (result.error === "cv-too-large") {
        setStatus("failed");
        setMessage(apply.cvTooLarge.replace("{max}", String(MAX_CV_MB)));
        return;
      }

      if (result.error === "cv-not-pdf") {
        setStatus("failed");
        setMessage(apply.cvNotPdf);
        return;
      }

      setStatus("failed");
      setMessage(withEmail(apply.failure));
    } catch {
      setStatus("failed");
      setMessage(withEmail(apply.failure));
    }
  }

  return (
    <form
      className="apply-form"
      action={APPLY_ENDPOINT}
      method="post"
      encType="multipart/form-data"
      onSubmit={onSubmit}
    >
      {/* Which role this is, carried by the form rather than by the address, so
          an application that arrives without JavaScript is still sorted. */}
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="roleTitle" value={roleTitle} />

      <div className="apply-form__grid">
        <div className="apply-field">
          <Head htmlFor={`${fieldId}-name`} label={apply.fields.name} required />
          <input
            className="apply-field__input"
            id={`${fieldId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </div>

        <div className="apply-field">
          <Head htmlFor={`${fieldId}-email`} label={apply.fields.email} required />
          <input
            className="apply-field__input"
            id={`${fieldId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="apply-field apply-field--wide">
          <Head htmlFor={`${fieldId}-cv`} label={apply.fields.cv} required />

          {/* The real input, clipped rather than removed: `display: none` would
              take it out of the tab order and off the keyboard with it. The
              label drives it by `for`, and the focus ring is drawn on the label
              when the input has focus, since the input cannot be seen. */}
          <div className="apply-file">
            <input
              className="visually-hidden apply-file__input"
              id={`${fieldId}-cv`}
              name="cv"
              type="file"
              accept="application/pdf,.pdf"
              required
              aria-describedby={`${fieldId}-cv-hint`}
              onChange={onFileChange}
            />

            <label className="apply-file__button" htmlFor={`${fieldId}-cv`}>
              {fileName ? apply.fields.cvChange : apply.fields.cvChoose}
            </label>

            <span className="apply-file__name" data-chosen={Boolean(fileName)}>
              {fileName || apply.fields.cvEmpty}
            </span>
          </div>

          {/* Both live here: what is accepted, and — once something is chosen
              that will not be — why. Said at the field the moment the file is
              picked rather than after the whole form has been sent. */}
          <p
            className="apply-field__hint"
            id={`${fieldId}-cv-hint`}
            data-error={Boolean(fileError)}
            role={fileError ? "alert" : undefined}
          >
            {fileError || apply.fields.cvHint}
          </p>
        </div>

        <div className="apply-field apply-field--wide">
          <Head
            htmlFor={`${fieldId}-link`}
            label={apply.fields.link}
            required={false}
          />
          <input
            className="apply-field__input"
            id={`${fieldId}-link`}
            name="link"
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-describedby={`${fieldId}-link-hint`}
          />
          <p className="apply-field__hint" id={`${fieldId}-link-hint`}>
            {apply.fields.linkHint}
          </p>
        </div>

        <div className="apply-field apply-field--wide">
          <Head
            htmlFor={`${fieldId}-note`}
            label={apply.fields.note}
            required={false}
          />
          <textarea
            className="apply-field__input apply-field__textarea"
            id={`${fieldId}-note`}
            name="note"
            rows={4}
            aria-describedby={`${fieldId}-note-hint`}
          />
          <p className="apply-field__hint" id={`${fieldId}-note-hint`}>
            {apply.fields.noteHint}
          </p>
        </div>
      </div>

      <div className="apply-form__foot">
        <button
          className="apply-form__submit"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? apply.sending : apply.submit}
          <PixelArrow
            className="apply-form__arrow"
            direction="up-right"
            size="small"
          />
        </button>

        {/* One line, in the place the answer belongs — beside the button that
            was pressed. `aria-live` because a reader who cannot see it appear
            still has to be told the application arrived. */}
        <p
          className="apply-form__status"
          data-state={status}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>

      <noscript>
        <p className="apply-field__hint">{withEmail(apply.noUploadNote)}</p>
      </noscript>
    </form>
  );
}
