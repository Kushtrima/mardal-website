/**
 * Where a letter from the Contact page lands.
 *
 * Written the way the Careers endpoint is: everything it receives is a
 * stranger's, so it checks what it needs itself rather than trusting the form
 * that asked for it.
 *
 * ── The gap, stated plainly ──
 *
 * This site has no mail service. Nothing in `.openai/hosting.json` or
 * `vite.config.ts` provides one, and which to use is the owner's decision rather
 * than this file's. So a letter that passes every check is answered
 * `sending-not-configured` instead of being accepted and dropped, and the form
 * turns that answer into a link that opens the visitor's own email app with the
 * letter already written. Nothing is silently lost.
 *
 * Switching it on is this handler: deliver the letter to info@mardal.co where
 * the 503 is returned below, and answer `{ ok: true }`. PRODUCT.md also asks for
 * the Privacy page to exist before a form collects personal data for real.
 */

const MAX_LINE = 320;
const MAX_MESSAGE = 5000;

function fail(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

/** One line: every control character out, line breaks included, and cut to a
 *  length. */
function line(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x1F\x7F]/g, " ").trim().slice(0, MAX_LINE);
}

/** A paragraph: line breaks kept, every other control character out. */
function paragraph(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, " ")
    .trim()
    .slice(0, MAX_MESSAGE);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("unreadable");
  }

  const name = line(form.get("name"));
  const email = line(form.get("email"));
  const message = paragraph(form.get("message"));

  if (!name || !email || !message) return fail("missing-fields");
  /* Deliberately not a full address grammar — one @ with something either side
     catches a typo without turning a real address away. */
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("bad-email");

  /* Checked after the letter, so a site with no mail service and one with a
     mail service refuse a bad letter identically. */
  return fail("sending-not-configured", 503);
}
