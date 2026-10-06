"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RULES_REACH } from "./ServicesRules";

/**
 * **The wheel's own hairlines, in the page's grey** — owner, 2026-10-06:
 * "after the vertical disaper i want to aper grey vertical line in service
 * just to try how it looks", then "from red to grey need to be in that way
 * that we cant see". The same five as the opening's (ServicesRules), each on
 * a whole pixel, through the wheel's section and on into the footer's.
 *
 * They take over from the opening's where those end, so the two never lie
 * over each other (a hairline drawn twice reads darker): the opening's feet
 * stop RULES_REACH of a screen into the wheel, so these start there; and as
 * the wheel is held and the opening goes on up, they reach up after it, to
 * the wheel's top once the opening's feet have gone. On a phone nothing is
 * held, so the two simply meet where they meet. Less motion: the opening's
 * stand still, and these run the whole section.
 */
export function ServicesWheelRules() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    const section = box?.closest("section");
    if (!box || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const lines = [...box.children] as HTMLElement[];
    const reach = () => window.innerHeight * RULES_REACH;
    const media = gsap.matchMedia();

    /* Held: they reach up as the opening's feet go up. */
    media.add("(min-width: 40.0625rem)", () => {
      gsap.fromTo(
        lines,
        { top: reach },
        {
          top: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + reach(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    /* A phone: they start where the opening's end, and stay. */
    media.add("(max-width: 40rem)", () => {
      gsap.set(lines, { top: reach });
    });

    return () => media.revert();
  }, []);

  return (
    <div className="services-rules services-rules--grey" ref={ref} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <span className="services-rules__line" key={index} />
      ))}
    </div>
  );
}
