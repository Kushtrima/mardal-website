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
 * the wheel's top once the opening's feet have gone — on a phone as on a
 * desktop, since the wheel is held on both. Less motion: the opening's stand
 * still, and these run the whole section.
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

    /* Held: they reach up as the opening's feet go up. */
    const tween = gsap.fromTo(
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

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(lines, { clearProps: "top" });
    };
  }, []);

  return (
    <div className="services-rules services-rules--grey" ref={ref} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <span className="services-rules__line" key={index} />
      ))}
    </div>
  );
}
