/**
 * Where an application lands.
 *
 * The one endpoint on this site that takes something in, and the reason it is
 * written defensively: everything it receives is a stranger's, including the
 * file. It checks the type and the size itself rather than trusting the
 * `accept` attribute that asked for a PDF, reads the leading bytes rather than
 * the declared MIME type, and stores under a name it composes rather than the
 * one the upload supplied.
 *
 * ── The gap, stated plainly ──
 *
 * This repository has no storage provisioned. `.openai/hosting.json` carries
 * `"r2": null`, so `vite.config.ts` creates no bucket binding at all and
 * `env.CV` is undefined. Rather than accept a CV and drop it, the handler says
 * so — `uploads-not-configured` — and the form turns that into a sentence
 * telling the applicant to email it instead. Nothing is silently lost.
 *
 * Switching it on is one field: set `"r2": "CV"` in `.openai/hosting.json` and
 * provision the bucket. Everything below is already written against it.
 */

import { workerEnv } from "../../../../lib/worker-env";

/** Matches the form's own cap, and is the one that actually binds. */
const MAX_CV_BYTES = 8 * 1024 * 1024;

/** `%PDF-`. A browser will report whatever MIME type it likes for a file that
 *  was renamed; the first five bytes are what the file is. */
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d];

const MAX_TEXT = 4000;

function fail(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

/** Whatever came out of the form, stripped of the control characters that
 *  would break the metadata it is written into, and cut to a length. */
function text(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x1F\x7F]/g, " ").trim().slice(0, MAX_TEXT);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("unreadable");
  }

  const name = text(form.get("name"));
  const email = text(form.get("email"));
  const role = text(form.get("role"));
  const roleTitle = text(form.get("roleTitle"));
  const link = text(form.get("link"));
  const note = text(form.get("note"));
  const cv = form.get("cv");

  if (!name || !email || !role) return fail("missing-fields");
  /* Deliberately not a full address grammar — that argument has no end and
     rejects real addresses. One @ with something either side is the check that
     catches a typo without turning anyone away. */
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("bad-email");
  /* The role arrives in a hidden field, which means it arrives from whoever is
     posting, and it becomes a path segment below. Constrained to the shape a
     slug has rather than trusted. */
  if (!/^[a-z][a-z0-9-]{0,63}$/.test(role)) return fail("unknown-role");
  if (!(cv instanceof File) || cv.size === 0) return fail("missing-cv");
  if (cv.size > MAX_CV_BYTES) return fail("cv-too-large", 413);

  const head = new Uint8Array(await cv.slice(0, PDF_MAGIC.length).arrayBuffer());
  if (PDF_MAGIC.some((byte, index) => head[index] !== byte)) {
    return fail("cv-not-pdf");
  }

  /* Checked after the file, so a misconfigured site and a working one reject a
     bad upload identically — an applicant should not learn that their CV was
     acceptable only once the bucket exists. */
  const bucket = workerEnv().CV;
  if (!bucket) return fail("uploads-not-configured", 503);

  /* Composed here, never taken from the upload. A filename that arrives from a
     browser can carry slashes, dots and anything else, and this is a path.
     Time first so the bucket lists in the order applications arrived. */
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const key = `applications/${role}/${stamp}-${crypto.randomUUID()}.pdf`;

  /* Buffered rather than streamed, and not for want of trying: `cv.stream()`
     and `cv` itself are both the DOM's types, and the R2 binding's are the
     Workers ones. Their `ReadableStream` differ (the Workers one carries
     `values` and an async iterator), so a File will not pass as a Blob and the
     stream will not pass as a stream — the same DOM-versus-Workers collision
     cloudflare-env.d.ts was written about. An ArrayBuffer has no stream inside
     it and is the one shape both agree on. Safe because the size is capped at 8
     MB above, well inside a Worker's memory. */
  const body = await cv.arrayBuffer();

  try {
    await bucket.put(key, body, {
      httpMetadata: { contentType: "application/pdf" },
      /* The application itself, kept beside the file rather than in a database
         this site does not have. */
      customMetadata: { name, email, role, roleTitle, link, note },
    });
  } catch {
    return fail("storage-failed", 502);
  }

  return Response.json({ ok: true });
}
