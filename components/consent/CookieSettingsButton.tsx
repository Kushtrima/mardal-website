"use client";

import { RollingLabel } from "../ui/RollingLabel";
import { openConsent } from "../../lib/consent";

/** The Cookies page's way back to the panel, at its settings: the site's
 *  word-and-arrow button. */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      className="legal__button"
      type="button"
      data-roll
      onClick={openConsent}
    >
      <RollingLabel>{label}</RollingLabel>
      <svg
        className="legal__button-arrow"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M2 14 14 2M4.5 2H14v9.5" />
      </svg>
    </button>
  );
}
