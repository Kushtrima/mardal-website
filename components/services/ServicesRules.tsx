"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * **The services page's five hairlines** — the four columns' edges across the
 * page column, where the page's [data-ruled] draws them, in the red (owner,
 * 2026-10-06: "make in orange not grey"), from the top of the page to the foot
 * of the wheel. Drawn as five lines rather than one repeated background so
 * each stands on a whole pixel — the background put some on a pixel and some
 * between two, and the ones on a pixel read bolder ("one of the middle
 * vertical line is bolder than other").
 *
 * **One line, all the way down** — owner, 2026-10-06, on a phone: "i can see
 * a spacebetween the vertical line also the vertical line is not till the
 * bottom". They were two: the opening's, stretched down by the scroll, and
 * the wheel's own, inside the held section, reaching up to meet them. On a
 * phone the page moves on its own and the held section's lines are moved
 * after it, a frame or more late, so the join opened while it scrolled; and
 * the held section is a short screen tall, so below it, with the address bar
 * gone, there were none. Now they lie in the page itself, over the opening
 * and the whole of the wheel's held stretch, so nothing has to keep up: they
 * go up with the page, and through the held section — which has no ground —
 * they reach past the foot of any screen. The footer's (ServicesFooterRules)
 * carry on from their end.
 *
 * **And turn to the grey the wheel's are** — owner, 2026-10-06: "from red to
 * grey need to be in that way that we cant see". Each turns from the red to
 * the page's grey, one after the next, as the opening is scrolled away — the
 * whole line at once, so there is never a red one over a grey one.
 */

/** Where the first starts to turn grey, and the gap to the next, in
 *  screens. */
const GREY_AT = 0.35;
const GREY_STEP = 0.04;
/** How long each takes to turn, in screens. */
const GREY_RUN = 0.3;
/** The five's last one done. */
const GREY_DONE = GREY_AT + GREY_STEP * 4 + GREY_RUN;

export function ServicesRules() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    gsap.registerPlugin(ScrollTrigger);

    const rules = [...box.children] as HTMLElement[];
    /* The wheel's grey, read off the page's token. A change of colour, not
       a movement, so it runs with reduced motion too. */
    const grey = getComputedStyle(box).getPropertyValue("--line-grid-vertical").trim();
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: box,
        start: 0,
        end: () => "+=" + window.innerHeight * GREY_DONE,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    rules.forEach((rule, index) => {
      timeline.to(
        rule,
        { backgroundColor: grey, ease: "none", duration: GREY_RUN },
        GREY_AT + GREY_STEP * index,
      );
    });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      gsap.set(rules, { clearProps: "backgroundColor" });
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
