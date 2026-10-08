"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Container } from "../layout/Container";

/**
 * **The delivered pages, one after the next** — owner, 2026-10-08, from a
 * reference: the pages large in the middle columns (the second line to the
 * fourth), "Previous" and "Next" on the left, and every page in small down
 * the right with a frame over the part in view. On the white page ("here
 * bacground in white" — the reference's ground was charcoal).
 *
 * Held for as long as the pages take to pass (a ScrollTrigger pin — `sticky`
 * cannot work under ScrollSmoother): scrolling moves the pages up through the
 * middle, the frame down the small ones, and the page nearest the middle is
 * the current one. Previous, Next and a small page each scroll to a page.
 *
 * A phone: no hold — the pages one under the next across the page, the left
 * and right columns gone; there is no room beside them.
 */

const WIDE = "(min-width: 40.0625rem)";

export function ProjectShowcase({
  title,
  pages,
  previous,
  next,
  page,
}: {
  title: string;
  pages: readonly string[];
  previous: string;
  next: string;
  page: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLOListElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const currentRef = useRef(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const list = pagesRef.current;
    const strip = stripRef.current;
    const frame = windowRef.current;
    if (!section || !stage || !list || !strip || !frame) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const distance = () => Math.max(0, list.scrollHeight - stage.clientHeight);

    /* The frame over the small pages: as tall as the share of the pages in
       view, as far down as the scroll has come. The current page: the one
       whose middle is nearest the middle of the screen. */
    function place(progress: number) {
      const share = Math.min(1, stage!.clientHeight / list!.scrollHeight);
      const height = strip!.clientHeight * share;
      gsap.set(frame, { height, y: progress * (strip!.clientHeight - height) });

      const middle = progress * distance() + stage!.clientHeight / 2;
      let nearest = 0;
      let best = Infinity;
      [...list!.children].forEach((child, index) => {
        const item = child as HTMLElement;
        const gap = Math.abs(item.offsetTop + item.offsetHeight / 2 - middle);
        if (gap < best) {
          best = gap;
          nearest = index;
        }
      });
      if (nearest !== currentRef.current) {
        currentRef.current = nearest;
        setCurrent(nearest);
      }
    }

    const media = gsap.matchMedia();
    media.add(WIDE, () => {
      const travel = gsap.to(list, { y: () => -distance(), ease: "none" });
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: true,
        animation: travel,
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => place(self.progress),
      });
      place(0);

      return () => {
        triggerRef.current = null;
      };
    });

    return () => media.revert();
  }, []);

  /** Scroll to a page: its middle to the middle of the screen. */
  function goTo(index: number) {
    const trigger = triggerRef.current;
    const stage = stageRef.current;
    const list = pagesRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!trigger || !stage || !list || !item) return;

    const span = trigger.end - trigger.start;
    const offset = item.offsetTop + item.offsetHeight / 2 - stage.clientHeight / 2;
    const target = trigger.start + Math.min(span, Math.max(0, offset));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(target, !still);
    else window.scrollTo({ top: target, behavior: still ? "auto" : "smooth" });
  }

  const last = pages.length - 1;

  return (
    <section
      className="project-showcase"
      ref={sectionRef}
      aria-labelledby="project-showcase-title"
    >
      <h2 className="visually-hidden" id="project-showcase-title">
        {title}
      </h2>

      <Container className="project-showcase__inner">
        <div className="project-showcase__nav">
          <button
            className="project-showcase__step"
            type="button"
            disabled={current === 0}
            onClick={() => goTo(current - 1)}
          >
            <span>{previous}</span>
            <LineArrow back />
          </button>
          <button
            className="project-showcase__step"
            type="button"
            disabled={current === last}
            onClick={() => goTo(current + 1)}
          >
            <span>{next}</span>
            <LineArrow />
          </button>
        </div>

        <div className="project-showcase__stage" ref={stageRef}>
          <ol className="project-showcase__pages" ref={pagesRef}>
            {pages.map((src, index) => (
              <li className="project-showcase__page" key={src}>
                {/* Stock frames standing in for screenshots of the
                    delivered site: decorative, so alt is empty. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  srcSet={`${src.replace("/1600/1000", "/800/500")} 800w, ${src} 1600w`}
                  sizes="(max-width: 40rem) 100vw, 50vw"
                  alt=""
                  width="1600"
                  height="1000"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="project-showcase__strip" ref={stripRef}>
          <ol className="project-showcase__thumbs">
            {pages.map((src, index) => (
              <li key={src}>
                <button
                  className="project-showcase__thumb"
                  type="button"
                  aria-label={`${page} ${index + 1}`}
                  aria-current={current === index ? "true" : undefined}
                  onClick={() => goTo(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src.replace("/1600/1000", "/320/200")}
                    alt=""
                    width="320"
                    height="200"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </li>
            ))}
          </ol>
          <span
            className="project-showcase__window"
            ref={windowRef}
            aria-hidden="true"
          />
        </div>
      </Container>
    </section>
  );
}

/** A long thin arrow under Previous and Next, as the reference draws them. */
function LineArrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      className="project-showcase__arrow"
      viewBox="0 0 64 12"
      aria-hidden="true"
      focusable="false"
    >
      <path d={back ? "M63 6H1M7 1 1 6l6 5" : "M1 6h62M57 1l6 5-6 5"} />
    </svg>
  );
}
