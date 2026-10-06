"use client";

import { useEffect } from "react";
import { focusWords } from "../../lib/focus-words";

/**
 * **"HOUSE OF CREATIVITY & TECHNOLOGY" comes into focus** — owner,
 * 2026-10-06: "apply this also in HOUSE OF CREATIVITY in home page", of the
 * services page's opening. Its words, one after the next, out of a blur
 * (focusWords). Only the words move, so the scroll that carries the heading
 * as one block (HouseHeroMotion) is untouched. Less motion: it is simply
 * there.
 */
export function HouseHeroReveal() {
  useEffect(() => {
    const title = document.querySelector<HTMLElement>("[data-house-title]");
    if (!title) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return focusWords(title);
  }, []);

  return null;
}
