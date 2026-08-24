"use client";

import { useSyncExternalStore } from "react";
import { cn } from "../../lib/cn";

/* Where the choice is kept, and the same key the pre-paint script in
   app/layout.tsx reads. If you rename it, rename it there too — the script runs
   before React does and there is nothing to catch a mismatch. */
const STORAGE_KEY = "mardal-theme";

type Theme = "light" | "dark";

/* The theme is not React state — it lives on the document element, it can be
   changed by the system underneath us, and it is written once before React has
   even started. So it is read as an external store rather than mirrored into
   state: the server snapshot is null, which is what makes the first render
   theme-blind and the hydration honest. */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(onChange: () => void) {
  /* Two of these render — one in the mega menu, one in the mobile sheet — and
     subscribing both to the same set is what keeps them agreeing. */
  const query = window.matchMedia("(prefers-color-scheme: light)");

  listeners.add(onChange);
  query.addEventListener("change", onChange);

  return () => {
    listeners.delete(onChange);
    query.removeEventListener("change", onChange);
  };
}

/* What the page is actually set to right now, which is not the same question as
   what the visitor has chosen. An explicit choice lives on the root as a
   data-theme; with no choice made the page is following the system, and the
   only way to know which way that fell is to ask. */
function getSnapshot(): Theme | null {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") {
    return chosen;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getServerSnapshot(): Theme | null {
  return null;
}

/* A ring with eight dots around it — a sun, drawn in dots rather than in rays.
 *
 * Dots rather than lines because that is already how this site draws a small
 * mark: PixelArrow is a dot matrix, its dots are round by default, and the
 * arrows beside every name in this same menu are built from them. A sun of
 * strokes would have been a stock icon; a sun of dots belongs to the set.
 *
 * The eight are on a radius of 8 at the compass points, written out as rounded
 * literals rather than generated. Geometry computed with Math.sin differs in the
 * last digit between the server and the browser, and React reports that as a
 * hydration mismatch — it has happened here before.
 *
 * The markup rendered on the server carries no theme in it. That is deliberate
 * — the server has no way to know which way the page will land, and a label or
 * a pressed state written into the SSR pass would be a mismatch on every load
 * where the visitor's system disagrees with the default. So the word is fixed,
 * the mark carries the state by being drawn in the page's own ink, and
 * `aria-pressed` is filled in once there is a document to ask.
 */
export function ThemeToggle({
  className,
  onToggle,
}: {
  className?: string;
  /* Both places this sits are panels that were opened to get to it, and both
     want closing once it has been pressed. */
  onToggle?: () => void;
}) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = getSnapshot() === "light" ? "dark" : "light";

    /* The attribute is the whole switch. Every colour in the stylesheet is a
       light-dark() pair read through `color-scheme`, so moving this one value
       turns the page over — there is no class list to keep in step. */
    document.documentElement.dataset.theme = next;
    emit();

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Private mode, or storage turned off. The page still turns over; it just
         will not be remembered, which is a better outcome than throwing. */
    }

    onToggle?.();
  };

  return (
    <button
      aria-label="Switch between the light and dark page"
      aria-pressed={theme === null ? undefined : theme === "light"}
      className={cn("theme-toggle", className)}
      onClick={toggle}
      suppressHydrationWarning
      type="button"
    >
      <svg
        aria-hidden="true"
        className="theme-toggle__mark"
        focusable="false"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3.6" />
        <g className="theme-toggle__rays">
          <circle cx="12" cy="4" r="1.35" />
          <circle cx="17.66" cy="6.34" r="1.35" />
          <circle cx="20" cy="12" r="1.35" />
          <circle cx="17.66" cy="17.66" r="1.35" />
          <circle cx="12" cy="20" r="1.35" />
          <circle cx="6.34" cy="17.66" r="1.35" />
          <circle cx="4" cy="12" r="1.35" />
          <circle cx="6.34" cy="6.34" r="1.35" />
        </g>
      </svg>
      <span className="theme-toggle__label">Theme</span>
    </button>
  );
}
