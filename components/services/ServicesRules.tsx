"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * **The services page's five hairlines** — the four columns' edges across the
 * page column, where the page's [data-ruled] draws them, in the red (owner,
 * 2026-10-06: "make in orange not grey"), from the top of the page to the foot
 * of the opening. Drawn as five lines rather than one repeated background so
 * each stands on a whole pixel — the background put some on a pixel and some
 * between two, and the ones on a pixel read bolder ("one of the middle
 * vertical line is bolder than other") — and so each can move on its own.
 *
 * **They go down with the scroll** — owner, 2026-10-06: "the vertical lines
 * stop at the end as they are by defaul but as i scroll don also the
 * vertical move dosnw with the scrolll", and, before it, "one more down one
 * more up and disaper before reaches the next section". At rest they end at
 * the opening's foot; scrolled, their feet go down the page as far as it has
 * been scrolled, so they always reach the bottom of the screen and are never
 * seen to end — and back up as it comes back.
 *
 * **And turn to the grey the wheel's are** — owner, 2026-10-06: "from red to
 * grey need to be in that way that we cant see". Rather than fade out over
 * grey ones fading in, each turns from the red to the page's grey, one after
 * the next, before the wheel's (ServicesWheelRules) take over from their
 * feet: one line all the way down, never two over each other.
 */

/** How far the scroll takes them, in screens — the wheel is at the top
 *  after one. The wheel's own lines start this far down it. */
export const RULES_REACH = 0.85;
/** Where the first starts to turn grey, and the gap to the next, in
 *  screens. */
const GREY_AT = 0.35;
const GREY_STEP = 0.04;
/** How long each takes to turn, in screens. */
const GREY_RUN = 0.3;

export function ServicesRules() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const rules = [...box.children] as HTMLElement[];
    /* The wheel's grey, read off the page's token. */
    const grey = getComputedStyle(box).getPropertyValue("--line-grid-vertical").trim();
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: box,
        start: 0,
        end: () => "+=" + window.innerHeight * RULES_REACH,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    rules.forEach((rule, index) => {
      /* Its foot as far down the page as the page has gone up: its length
         and the scroll, over its length. */
      timeline
        .fromTo(
          rule,
          { scaleY: 1, transformOrigin: "50% 0%" },
          {
            scaleY: () =>
              (rule.offsetHeight + window.innerHeight * RULES_REACH) / rule.offsetHeight,
            ease: "none",
            duration: RULES_REACH,
          },
          0,
        )
        .to(
          rule,
          { backgroundColor: grey, ease: "none", duration: GREY_RUN },
          GREY_AT + GREY_STEP * index,
        );
    });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      gsap.set(rules, { clearProps: "transform,backgroundColor" });
    };
  }, []);

  return (
    <div className="services-rules" ref={ref} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <span className="services-rules__line" key={index} />
      ))}
    </div>
  );
}
