"use client";

import { skipLink } from "../../content/home";

/**
 * **Past the bar, for the keyboard** — site check, 2026-10-09: no page had a
 * way to skip the wordmark and MENU. The first stop of Tab on every page, out
 * of sight until it is reached.
 *
 * It also hands the focus to the page itself: ScrollSmoother takes every
 * click on a `#` link to glide there (SmoothScroll), which stops the browser
 * moving the focus, so the next Tab would start from the bar again.
 */
export function SkipLink() {
  return (
    <a
      className="skip-link"
      href="#main-content"
      onClick={() => {
        const main = document.getElementById("main-content");
        if (!main) return;
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }}
    >
      {skipLink}
    </a>
  );
}
