"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RollingLabel } from "../ui/RollingLabel";
import { consent } from "../../content/legal";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
} from "../../lib/consent";

/**
 * **The cookie panel** — owner, 2026-10-08: "create a cookies design for
 * accepting editing etc that fits our design".
 *
 * In red and white — owner, 2026-10-08: "make this Cookies popup in red and
 * white and maybe little bigger more professional": the red ground, white
 * words, from the middle line to the right edge at the foot of the screen,
 * the white plus beside its label as the openings have it. "Accept all" and
 * "Necessary only" are the same solid white button, so saying no is as easy
 * as saying yes; "Settings" is the site's word-and-arrow button and turns
 * the same panel to the two kinds of storage, each with a switch; Necessary
 * cannot be turned off.
 *
 * It asks once: on a first visit, eight seconds after the visitor arrives, and
 * never again until the question changes (lib/consent.ts). The Cookies page
 * opens it again at its settings. It does not hold the page — nothing behind
 * it is blocked or dimmed — and it does not take the focus unless asked for.
 *
 * Outside the scrolling content (app/layout.tsx), as the header is: fixed to
 * the window, not to the page ScrollSmoother moves.
 */

type View = "ask" | "settings";

/** How long a first visit goes on before the panel asks — owner, 2026-10-08:
 *  "show popup 8 sec later after person enter in the website, not
 *  immediately" — and the leaving fade. The panel lives in the layout, so
 *  moving to another page in those seconds does not restart the wait. */
const ARRIVE_MS = 8000;
const LEAVE_MS = 420;

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [view, setView] = useState<View>("ask");
  const [analytics, setAnalytics] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const focusOnOpen = useRef(false);

  useEffect(() => {
    let arrive: number | undefined;
    if (!readConsent()) {
      arrive = window.setTimeout(() => setOpen(true), ARRIVE_MS);
    }

    const reopen = () => {
      window.clearTimeout(arrive);
      setAnalytics(readConsent()?.analytics ?? false);
      setView("settings");
      setLeaving(false);
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(arrive);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  /* Asked for from the Cookies page: the focus goes to the first switch
     that can be changed, so a keyboard lands where the choice is. */
  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    panelRef.current
      ?.querySelector<HTMLElement>('[role="switch"]:not([aria-disabled="true"])')
      ?.focus();
  }, [open, view]);

  function answer(withAnalytics: boolean) {
    writeConsent(withAnalytics);
    setLeaving(true);
    window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
      setView("ask");
    }, LEAVE_MS);
  }

  if (!open) return null;

  return (
    <section
      className="consent"
      ref={panelRef}
      aria-label={consent.label}
      data-state={leaving ? "out" : "in"}
      data-view={view}
    >
      <p className="consent__label">
        <span className="consent__mark" aria-hidden="true" />
        {consent.label}
      </p>

      {view === "ask" ? (
        <>
          <p className="consent__text">
            {consent.text}{" "}
            <Link className="consent__more" href={consent.more.href}>
              {consent.more.label}
            </Link>
          </p>
          <div className="consent__actions">
            <button
              className="consent__button consent__button--solid"
              type="button"
              data-roll
              onClick={() => answer(true)}
            >
              <RollingLabel>{consent.acceptAll}</RollingLabel>
            </button>
            <button
              className="consent__button consent__button--solid"
              type="button"
              data-roll
              onClick={() => answer(false)}
            >
              <RollingLabel>{consent.necessaryOnly}</RollingLabel>
            </button>
            <button
              className="consent__button consent__button--text"
              type="button"
              data-roll
              onClick={() => {
                setAnalytics(readConsent()?.analytics ?? false);
                focusOnOpen.current = true;
                setView("settings");
              }}
            >
              <RollingLabel>{consent.settings}</RollingLabel>
              <svg
                className="consent__arrow"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2 14 14 2M4.5 2H14v9.5" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <>
          <ul className="consent__kinds">
            {consent.categories.map((kind) => {
              const on = kind.locked || analytics;
              return (
                <li className="consent__kind" key={kind.key}>
                  <div className="consent__kind-words">
                    <p className="consent__kind-name" id={`consent-${kind.key}`}>
                      {kind.name}
                    </p>
                    <p className="consent__kind-text">{kind.text}</p>
                  </div>
                  <button
                    className="consent__switch"
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-labelledby={`consent-${kind.key}`}
                    aria-disabled={kind.locked ? "true" : undefined}
                    onClick={() => {
                      if (!kind.locked) setAnalytics((was) => !was);
                    }}
                  >
                    <span className="consent__knob" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="consent__actions">
            <button
              className="consent__button consent__button--solid"
              type="button"
              data-roll
              onClick={() => answer(analytics)}
            >
              <RollingLabel>{consent.save}</RollingLabel>
            </button>
            <button
              className="consent__button consent__button--solid"
              type="button"
              data-roll
              onClick={() => answer(true)}
            >
              <RollingLabel>{consent.acceptAll}</RollingLabel>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
