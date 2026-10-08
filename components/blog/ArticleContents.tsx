"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * **The piece's headings down the right, the one being read lit** — owner,
 * 2026-10-08: "make as a professional blog so on the right to be title
 * online offline when scrollin in the middle to be text". The text in the
 * middle columns; here, from the fourth line, every heading of the piece:
 * the one whose section is on screen in ink with the red mark beside it
 * ("online"), the others in grey ("offline"). Pressing one takes the reader
 * to it.
 *
 * Held beside the text while it is read — a ScrollTrigger pin, since
 * `sticky` cannot work under ScrollSmoother — only where there is a column
 * for it (from 64rem); narrower, the list is not shown and the text takes
 * the width.
 */

export type ArticleHeading = { readonly id: string; readonly text: string };

const WIDE = "(min-width: 64.0625rem)";
/** Where the list is held, and where a heading counts as being read. */
const HOLD_TOP = 120;

export function ArticleContents({
  label,
  headings,
}: {
  label: string;
  headings: readonly ArticleHeading[];
}) {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const nav = navRef.current;
    const body = document.querySelector<HTMLElement>("[data-article-body]");
    if (!nav || !body) return;
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    media.add(WIDE, () => {
      /* Held from the top of the text to its foot. */
      ScrollTrigger.create({
        trigger: body,
        start: `top top+=${HOLD_TOP}`,
        end: () => `+=${Math.max(0, body.offsetHeight - nav.offsetHeight)}`,
        pin: nav,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      /* A heading is being read once it has passed a third of the way up
         the screen; before the first, none is. */
      headings.forEach((heading, index) => {
        const element = document.getElementById(heading.id);
        if (!element) return;
        ScrollTrigger.create({
          trigger: element,
          start: "top 35%",
          onEnter: () => setActive(index),
          onLeaveBack: () => setActive(index - 1),
        });
      });
    });

    return () => media.revert();
  }, [headings]);

  function go(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(element, !still, `top ${HOLD_TOP}px`);
    else element.scrollIntoView({ behavior: still ? "auto" : "smooth" });
  }

  return (
    <nav className="article-contents" ref={navRef} aria-label={label}>
      <p className="article-contents__label">{label}</p>
      <ol className="article-contents__list">
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <a
              className="article-contents__link"
              href={`#${heading.id}`}
              aria-current={active === index ? "true" : undefined}
              onClick={(event) => go(event, heading.id)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
