"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * How far the page is scrolled while the opening is held, in screen heights.
 * Long enough that the photograph opens at reading pace rather than in a flick,
 * short enough that nobody wonders whether the page has stuck.
 */
const HOLD = 1.1;

/** Space between the sentence and the heading under it, in the final state —
 *  the comp's 66px from the sentence's foot to the heading's capitals, less
 *  the heading's own half-leading. */
const SUPPORT_GAP = 46;

/**
 * The opening's one movement, scrubbed by the scroll (HouseHero).
 *
 * The section is pinned while the photograph's frame grows out of its band to
 * the whole screen, the heading travels from the top of the screen to its foot
 * and turns white as the photograph reaches it, and the sentence comes up above
 * the heading at the end. Every distance is read from the layout on each
 * refresh — the band, the heading's height, the padding — so nothing here
 * holds a size of its own.
 *
 * While the section is held the bar is held with it (`data-header-hold`, read
 * by SiteHeader): it would otherwise leave the top state on the first 96px of a
 * scroll that, here, is moving the opening rather than the page. The bar turns
 * white over the photograph by itself: the frame is marked `data-bar-dark`.
 */
export function HouseHeroMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector<HTMLElement>("[data-house-hero]");
    if (!hero) return;
    const title = hero.querySelector<HTMLElement>("[data-house-title]");
    const slot = hero.querySelector<HTMLElement>("[data-house-slot]");
    const frame = hero.querySelector<HTMLElement>("[data-house-frame]");
    const support = hero.querySelector<HTMLElement>("[data-house-support]");
    if (!title || !slot || !frame || !support) return;

    const root = document.documentElement;
    const setFlag = (name: string, on: boolean) => {
      if (on === root.hasAttribute(name)) return;
      if (on) root.setAttribute(name, "");
      else root.removeAttribute(name);
    };


    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* No movement asked for: the opening stays in its first state, and the
         stylesheet shows the sentence on the band. */
      return;
    }

    /* Measured in the section's own box, without transforms: offsets ignore the
       heading's travel, which is what lets a refresh mid-scroll measure the
       layout rather than the animation. */
    const padBottom = () => parseFloat(getComputedStyle(hero).paddingBottom);
    const titleEnd = () => hero.clientHeight - padBottom() - title.offsetHeight;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => "+=" + window.innerHeight * HOLD,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setFlag("data-header-hold", self.progress < 1),
          onLeave: () => setFlag("data-header-hold", false),
          onEnterBack: () => setFlag("data-header-hold", true),
          onRefresh: (self) =>
            setFlag("data-header-hold", window.scrollY < self.end),
        },
      });

      /* The frame grows out of the band to every edge of the section. */
      timeline.fromTo(
        frame,
        { top: 0, right: 0, bottom: 0, left: 0 },
        {
          top: () => -slot.offsetTop,
          left: () => -slot.offsetLeft,
          right: () => -(hero.clientWidth - slot.offsetLeft - slot.offsetWidth),
          bottom: () =>
            -(hero.clientHeight - slot.offsetTop - slot.offsetHeight),
          duration: 1,
        },
        0,
      );

      /* The heading goes down to the foot of the screen with it. */
      timeline.fromTo(
        title,
        { y: 0 },
        { y: () => titleEnd() - title.offsetTop, duration: 1 },
        0,
      );

      /* And turns from the page's ink to white as the photograph comes up
         behind it — mixed in the stylesheet, so it follows the theme. */
      timeline.fromTo(
        title,
        { "--house-mix": 0 },
        { "--house-mix": 1, duration: 0.4, ease: "none" },
        0.3,
      );

      /* The sentence last, above the heading's final place, once the
         photograph is all there is. */
      timeline.fromTo(
        support,
        {
          top: () => titleEnd() - SUPPORT_GAP - support.offsetHeight,
          bottom: "auto",
          autoAlpha: 0,
          y: 24,
        },
        {
          top: () => titleEnd() - SUPPORT_GAP - support.offsetHeight,
          bottom: "auto",
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        0.82,
      );

      /* A moment held at the end before the page moves on. */
      timeline.to({}, { duration: 0.12 });
    }, hero);

    return () => {
      context.revert();
      setFlag("data-header-hold", false);
    };
  }, []);

  return null;
}
