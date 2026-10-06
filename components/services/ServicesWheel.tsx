"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../layout/Container";
import { RollingLabel } from "../ui/RollingLabel";
import { ServicesWheelRules } from "./ServicesWheelRules";
import type { ServiceIndexEntry } from "../../content/services-index";

/**
 * **The services, turned like a wheel** — owner, 2026-10-06, from a reference
 * (a Framer page of names on a curve): "when we enter in services the
 * services to be on the left and as i scroll into services on the right side
 * to apear all the content for that service simple as that and instead of
 * that arrow to be our +"; then "the text of services on the left to be much
 * smaller only the main service to be littlle bigger also to be on the left
 * edge", with his list of eighteen in three groups.
 *
 * What the reference does, measured: one name every line, the one at the
 * middle of the screen pushed out to the right and the ones around it less
 * and less — a bell curve, about two names either side — a fixed mark at the
 * middle on the left, and the list turned by the wheel and settling on a
 * name. Here: the section is held while the page is scrolled through it, the
 * list moves with the scroll and comes to rest on a service, the mark
 * is the Menu's plus in the site's red, and the service at the mark has its
 * content on the right. Every line is black, at one size and one line apart —
 * owner, 2026-10-06: "all the text to be in same px even the titles … the
 * main text not to be bigger", then "all th etext to be with sape vertical
 * space between" — and each group's name stands in the line above its first
 * service, underlined in the red while one of its services is at the mark.
 *
 * On a phone there is no room for both: the services simply stand one under
 * the next, each with its content (the stylesheet), and nothing is held.
 */

/** Scroll per service, in screen heights. */
const STEP_SCROLL = 0.22;
/** The bulge: how far the middle name stands out, in its own size — enough
 *  to clear the mark beside it at the names' smaller size. */
const BULGE = 2.6;
/** The bell's width, in lines (the reference's, measured: 2.07). */
const SPREAD = 2.07;
/** Line to line, in the names' size — wider since 2026-10-06 ("add more
 *  space between each services"); the same under a group's name as under a
 *  service. */
const PITCH = 2.1;
/** When the hand stops, how far past a service the scroll must have gone, in
 *  services, to go on to the next one that way — less, and it is an
 *  accident, and the list returns. */
const INTENT = 0.15;

export function ServicesWheel({
  entries,
  actions,
}: {
  entries: readonly ServiceIndexEntry[];
  actions: readonly { readonly label: string; readonly href: string }[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;
    /* Every line of the wheel — group names and services — in order: a
       line's place is its index here. */
    const lines = [...section.querySelectorAll<HTMLElement>("[data-wheel-line]")];
    const items = lines.filter((line) => line.hasAttribute("data-wheel-item"));
    const slots = items.map((item) => lines.indexOf(item));
    /* Each service's group: the nearest group name above it. */
    const groupLines = lines.filter((line) => !line.hasAttribute("data-wheel-item"));
    const groupOf = items.map((item) => {
      let at = lines.indexOf(item);
      while (at > 0 && lines[at].hasAttribute("data-wheel-item")) at -= 1;
      return lines[at];
    });
    const panels = [...section.querySelectorAll<HTMLElement>("[data-wheel-panel]")];
    const count = items.length;
    if (count < 2) return;

    const wide = window.matchMedia("(min-width: 40.0625rem)");
    let trigger: ScrollTrigger | undefined;
    let active = -1;
    /* **Nothing is chosen before the section is reached** — owner,
       2026-10-06: "whn enter the section first to be selc the service then to
       aper the right text not before", and its group underlined "only when
       you enter in one section zoen". */
    let engaged = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* A position between two services is a place between their lines. */
    const slotAt = (position: number) => {
      const low = Math.max(0, Math.min(count - 1, Math.floor(position)));
      const high = Math.min(count - 1, low + 1);
      return slots[low] + (slots[high] - slots[low]) * (position - low);
    };

    const place = (position: number) => {
      /* The names' size: the list's, which every line is measured in. */
      const size = parseFloat(getComputedStyle(lines[0].parentElement ?? lines[0]).fontSize);
      const centre = slotAt(position);
      lines.forEach((line, index) => {
        const distance = index - centre;
        const bell = Math.exp(-(distance * distance) / (2 * SPREAD * SPREAD));
        const x = BULGE * size * bell;
        const y = distance * PITCH * size;
        line.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
      const nearest = engaged
        ? Math.min(count - 1, Math.max(0, Math.round(position)))
        : -1;
      if (nearest !== active) {
        active = nearest;
        items.forEach((item, index) =>
          item.classList.toggle("is-active", index === nearest),
        );
        panels.forEach((panel, index) =>
          panel.toggleAttribute("data-active", index === nearest),
        );
        groupLines.forEach((line) =>
          line.classList.toggle("is-current", nearest >= 0 && groupOf[nearest] === line),
        );
      }
    };

    /* **The list moves with the hand** — owner, 2026-10-06: "i need to be
       more intuitive its still move not in the right wyay". It had been made
       to step a service at a time on a spring of its own, on top of the
       page's own easing: measured, it stood still in one frame of six under a
       slow scroll and kept going for three seconds after a brisk one had
       stopped. Now it goes exactly as far as the page does, eased only as the
       whole page is, and answers the first touch. Chosen from the moment the
       section is held (resting on the first service is progress 0, which
       ScrollTrigger does not count as active), and let go only by scrolling
       back above it. */
    const follow = (self: ScrollTrigger) => {
      engaged = self.scroll() >= self.start - 1;
      place(self.progress * (count - 1));
    };

    /* To a place in the page: through the smoother's own easing when there
       is one — the way a wheel's scroll goes — or the browser's. */
    const travel = (target: number) => {
      if (ScrollSmoother.get()) window.scrollTo(0, target);
      else window.scrollTo({ top: target, behavior: still.matches ? "auto" : "smooth" });
    };

    /* **It always comes to rest on a service** — owner, 2026-10-06: "to move
       + in the midle of the service not to move in free will so to be in
       purpose". The moment the hand stops, the place the page is heading for
       is moved on to the next service the way it was going — or back, if it
       had barely left one — so the one easing that is already carrying the
       list ends exactly there: one movement, not a stop and a second push.
       Nearest alone would send a mouse's single notch, less than half a
       service on a tall screen, back where it started. Not ScrollTrigger's
       snap: after every snap the smoother let the next scroll go by unheard —
       a mouse's first notch moved nothing at all (measured, 2026-10-06). */
    const settle = () => {
      if (!trigger) return;
      const now = window.scrollY;
      if (now < trigger.start - 1 || now > trigger.end + 1) return;
      const step = (trigger.end - trigger.start) / (count - 1);
      const at = (now - trigger.start) / step;
      const index = Math.min(
        count - 1,
        Math.max(0, trigger.direction > 0 ? Math.ceil(at - INTENT) : Math.floor(at + INTENT)),
      );
      const target = Math.round(trigger.start + index * step);
      if (Math.abs(now - target) > 1) travel(target);
    };

    const build = () => {
      trigger?.kill();
      trigger = undefined;
      lines.forEach((line) => (line.style.transform = ""));
      if (!wide.matches) return;

      place(0);
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + window.innerHeight * STEP_SCROLL * (count - 1),
        pin: true,
        invalidateOnRefresh: true,
        onToggle: follow,
        onUpdate: follow,
      });
    };

    /* A name pressed takes the wheel to it. */
    const onPress = (event: Event) => {
      const index = items.indexOf(
        (event.currentTarget as HTMLElement).closest("[data-wheel-item]") as HTMLElement,
      );
      if (!trigger || index < 0) return;
      travel(trigger.start + ((trigger.end - trigger.start) * index) / (count - 1));
    };
    const buttons = items.map((item) => item.querySelector("button"));
    buttons.forEach((button) => button?.addEventListener("click", onPress));

    build();
    wide.addEventListener("change", build);
    ScrollTrigger.addEventListener("scrollEnd", settle);
    return () => {
      ScrollTrigger.removeEventListener("scrollEnd", settle);
      wide.removeEventListener("change", build);
      buttons.forEach((button) => button?.removeEventListener("click", onPress));
      trigger?.kill();
    };
  }, []);

  return (
    <section
      className="services-wheel"
      ref={sectionRef}
      aria-label="Services"
      data-services-wheel
    >
      {/* Grey hairlines, in as the opening's orange ones go — a trial. */}
      <ServicesWheelRules />

      <Container className="services-wheel__inner">
        <div className="services-wheel__stage">
          {/* The mark at the middle: the Menu's plus, in the red. */}
          <span className="services-wheel__mark" aria-hidden="true" />

          <ol className="services-wheel__list">
            {entries.map((entry, index) => (
              <Fragment key={`${entry.group}-${entry.label}`}>
                {/* Each group's name in the line above its first service. */}
                {index === 0 || entries[index - 1].group !== entry.group ? (
                  <li className="services-wheel__group" aria-hidden="true" data-wheel-line>
                    {entry.group}
                  </li>
                ) : null}
                <li className="services-wheel__item" data-wheel-line data-wheel-item>
                  <button className="services-wheel__name" type="button">
                    {entry.label}
                  </button>
                </li>
              </Fragment>
            ))}
          </ol>
        </div>

        <div className="services-wheel__panels">
          {entries.map((entry) => (
            <article
              className="services-wheel__panel"
              key={`${entry.group}-${entry.label}`}
              data-wheel-panel
            >
              {/* Only what it says, no heading over it — owner, 2026-10-06:
                  "delete title for each and for example Creative only
                  paragraf and other text". The name stays for a phone, where
                  there is no wheel to name it, and for a screen reader. */}
              <h2 className="services-wheel__title">{entry.label}</h2>
              {entry.summary ? (
                <p className="services-wheel__summary">{entry.summary}</p>
              ) : null}

              {entry.lists.length ? (
                <div
                  className={`services-wheel__chapters${
                    entry.lists.length === 1 ? " services-wheel__chapters--one" : ""
                  }`}
                >
                  {entry.lists.map((list, listIndex) => (
                    <div
                      className="services-wheel__chapter"
                      key={list.title ?? `list-${listIndex}`}
                    >
                      {list.title ? (
                        <h3 className="services-wheel__chapter-title">{list.title}</h3>
                      ) : null}
                      <ul className="services-wheel__items">
                        {list.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Two ways in — owner, 2026-10-06: "write to us and other
                  Book a meeting so two buttons". */}
              <div className="services-wheel__actions">
                {actions.map((action) => (
                  <a
                    className="services-wheel__cta"
                    href={action.href}
                    key={action.label}
                    data-roll
                  >
                    <RollingLabel>{action.label}</RollingLabel>
                    {/* VIEW ALL's thin arrow; still while the word rolls. */}
                    <svg
                      className="services-wheel__arrow"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M2 14 14 2M4.5 2H14v9.5" />
                    </svg>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
