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

    let trigger: ScrollTrigger | undefined;

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

      /* The heading goes down to the foot of the screen with it, as one —
         owner, 2026-10-05: "this text needs to move together as before" (the
         two lines were tried apart the same evening). */
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

      /* **"Operating from Kosova" goes down to the bottom right** — owner,
         2026-10-05: first "i wan this text to be here", the right end of the
         band; then "by default … not on scroll then after scrollin you can
         move in other position"; then "i dont want to move up i want to move
         down at bottom right". It stands at the band's right end on arrival
         (the stylesheet puts it there) and, as the photograph opens to the
         whole screen, goes down the right edge to the foot of it, its
         baseline on the heading's last one, which comes down the left side
         at the same time — white wherever the photograph is behind it (below).
         Read from the layout each refresh: offsets, which no transform moves,
         in the section's own frame, which is the screen's while it is held. */
      const place = hero.querySelector<HTMLElement>("[data-house-place]");
      if (place) {
        const offsetY = (node: HTMLElement) => {
          let y = 0;
          let at: HTMLElement | null = node;
          while (at && at !== hero) {
            y += at.offsetTop;
            at = at.offsetParent as HTMLElement | null;
          }
          return y;
        };
        /* The heading's last baseline, where it comes to rest: 0.205 of its
           size above its box's foot at its leading; the words' own baseline
           0.145 of theirs above their foot at theirs. */
        const drop = () => {
          const headingFoot = hero.clientHeight - padBottom();
          const headingSize = parseFloat(getComputedStyle(title).fontSize);
          const wordsSize = parseFloat(getComputedStyle(place).fontSize);
          const foot = headingFoot - headingSize * 0.205 + wordsSize * 0.145;
          return foot - place.offsetHeight - offsetY(place);
        };
        /* **Slower than the rest** — owner, 2026-10-05: "only Operation from
           Kosova maybe slower". Its own trigger over the same held stretch,
           with a longer catch-up than the opening's: it trails the scroll and
           glides into its place after the heading has landed, rather than
           keeping step with it. */
        gsap.fromTo(
          place,
          { y: 0 },
          {
            y: () => drop(),
            ease: "power1.inOut",
            scrollTrigger: {
              /* The opening's own stretch, read off its trigger: a trigger
                 on the held section itself is measured from after the hold,
                 and would never run while the section is held. */
              start: () => timeline.scrollTrigger?.start ?? 0,
              end: () =>
                timeline.scrollTrigger?.end ?? window.innerHeight * HOLD,
              scrub: 2.4,
              invalidateOnRefresh: true,
              /* **Slow going down, home with the heading going up** — owner,
                 2026-10-06: "i want this to come to the original place same
                 with big text". Scrolling back, its catch-up is skipped, so
                 it returns in step with the heading instead of arriving after
                 it. */
              onUpdate: (self) => {
                if (self.direction < 0) self.getTween()?.progress(1);
              },
            },
          },
        );
      }

      /* A moment held at the end before the page moves on. */
      timeline.to({}, { duration: 0.12 });

      trigger = timeline.scrollTrigger;
    }, hero);

    /* **White only over the photograph.** The words and the photograph's
       edge travel at different paces, so which one is behind the words is
       asked of where both are painted, every frame, rather than of the
       scroll: black over the page, white over the picture. */
    const place = hero.querySelector<HTMLElement>("[data-house-place]");
    const onPhoto = () => {
      if (!place) return;
      const words = place.getBoundingClientRect();
      const picture = frame.getBoundingClientRect();
      const middle = words.top + words.height / 2;
      const over =
        middle >= picture.top &&
        middle <= picture.bottom &&
        words.right >= picture.left &&
        words.left <= picture.right;
      place.classList.toggle("is-on-photo", over);
    };
    gsap.ticker.add(onPhoto);

        /* **The opening keeps pace with a resize.** The pin holds the section at
       pixel sizes, and ScrollTrigger measures again only 0.2s after the last
       resize event — so while a window was dragged the band and the photograph
       kept their old width and caught up after the drag, behind the heading,
       whose size is in vw. Owner, 2026-10-05: "when i resize the content is not
       reizeing in same pace as page its move later". While the opening is on
       screen this trigger measures again on every frame of a resize; the
       page-wide refresh still runs after it. The update after each refresh
       matters: a refresh leaves the trigger's progress at 0 until the next
       scroll, so without it the next frame's refresh would take that 0 as
       where the opening stood and close the photograph back into its band
       halfway through the drag. On a touch-only screen a change of height
       alone is the address bar coming and going while the page scrolls, which
       ScrollTrigger itself ignores, so this does too. */
    let lastWidth = window.innerWidth;
    let resizeFrame = 0;
    const onResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        const widthChanged = window.innerWidth !== lastWidth;
        lastWidth = window.innerWidth;
        if (!trigger || (ScrollTrigger.isTouch === 1 && !widthChanged)) return;
        if (window.scrollY >= trigger.end + window.innerHeight) return;
        trigger.refresh();
        ScrollTrigger.update();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(onPhoto);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeFrame);
      context.revert();
      setFlag("data-header-hold", false);
    };
  }, []);

  return null;
}
