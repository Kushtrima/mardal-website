/**
 * **The cookie choice** — what the consent panel asks and remembers (owner,
 * 2026-10-08: "create a cookies design for accepting editing etc").
 *
 * Kept in the browser's storage under one name, with the version of the
 * question it answers: raise `CONSENT_VERSION` when the list on the Cookies
 * page grows, and everyone is asked again, as that page promises. Nothing
 * optional runs today; anything added later reads `readConsent()` first and
 * listens for `CONSENT_EVENT`.
 */

export const CONSENT_KEY = "mardal-consent";
export const CONSENT_VERSION = 1;
/** Fired on `window` with the new choice whenever it is saved. */
export const CONSENT_EVENT = "mardal:consent";
/** Fired on `window` to open the panel at its settings (Cookies page). */
export const CONSENT_OPEN_EVENT = "mardal:consent-open";

export type Consent = {
  readonly v: number;
  readonly analytics: boolean;
  readonly at: string;
};

/** The saved choice, or null if none, or if it answered an older question.
 *  Storage can be missing or refuse (a private window): that reads as none. */
export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<Consent>;
    if (saved?.v !== CONSENT_VERSION || typeof saved.analytics !== "boolean") {
      return null;
    }
    return saved as Consent;
  } catch {
    return null;
  }
}

/** Saves the choice and tells the page. If storage refuses, the choice still
 *  holds for this visit — the panel simply asks again next time. */
export function writeConsent(analytics: boolean): Consent {
  const choice: Consent = {
    v: CONSENT_VERSION,
    analytics,
    at: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
  } catch {
    /* Private window or blocked storage: nothing to do. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
  return choice;
}

/** Opens the panel at its settings. */
export function openConsent() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
