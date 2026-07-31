"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DESKTOP_QUERY =
  "(min-width: 64.0625rem) and (prefers-reduced-motion: no-preference)";
const STACKED_QUERY =
  "(max-width: 64rem), (prefers-reduced-motion: reduce)";

/**
 * Maps vertical page progress to a horizontal editorial journey on desktop.
 * Tablet, mobile, and reduced-motion users keep a native vertical document.
 */
export function AiAutomationOfferingsScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>(
      "[data-service-offerings]",
    );
    const viewport = section?.querySelector<HTMLElement>(
      "[data-service-viewport]",
    );
    const stage = section?.querySelector<HTMLElement>("[data-service-stage]");
    const track = section?.querySelector<HTMLElement>("[data-service-track]");
    const cards = section
      ? Array.from(
          section.querySelectorAll<HTMLElement>("[data-service-card]"),
        )
      : [];
    const groupLinks = section
      ? Array.from(
          section.querySelectorAll<HTMLAnchorElement>(
            "[data-service-group-link]",
          ),
        )
      : [];
    const nextLink = section?.querySelector<HTMLAnchorElement>(
      "[data-service-next-link]",
    );
    const nextLabel = nextLink?.querySelector<HTMLElement>(
      "[data-service-next-label]",
    );
    const currentTitle = section?.querySelector<HTMLElement>(
      "[data-service-current-title]",
    );

    if (
      !section ||
      !viewport ||
      !stage ||
      !track ||
      cards.length === 0 ||
      !nextLink ||
      !nextLabel ||
      !currentTitle
    ) {
      return;
    }

    const automationCard = cards.find(
      (card) => card.dataset.serviceGroup === "1",
    );
    const media = gsap.matchMedia();
    let activeGroup = -1;
    let activeCard = -1;
    let titleTween: gsap.core.Tween | undefined;

    const updateGroup = (groupIndex: number) => {
      if (activeGroup === groupIndex && nextLabel.textContent) return;
      activeGroup = groupIndex;

      groupLinks.forEach((link, index) => {
        const isActive = index === groupIndex;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      if (groupIndex === 0 && automationCard) {
        nextLink.href = `#${automationCard.id}`;
        nextLabel.textContent = "Automation";
      } else {
        nextLink.href = "#service-cta-title";
        nextLabel.textContent = "Let’s build";
      }
    };

    const updateCard = (cardIndex: number, immediate = false) => {
      if (activeCard === cardIndex) return;

      const card = cards[cardIndex];
      if (!card) return;

      activeCard = cardIndex;
      updateGroup(Number(card.dataset.serviceGroup ?? 0));

      const nextTitle = card.dataset.serviceTitle ?? "";
      titleTween?.kill();

      if (currentTitle.textContent === nextTitle) return;

      if (immediate) {
        currentTitle.textContent = nextTitle;
        gsap.set(currentTitle, { clearProps: "opacity,transform" });
        return;
      }

      titleTween = gsap.to(currentTitle, {
        autoAlpha: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          currentTitle.textContent = nextTitle;
          titleTween = gsap.fromTo(
            currentTitle,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.36,
              ease: "power3.out",
              overwrite: true,
            },
          );
        },
      });
    };

    updateCard(0, true);

    media.add(DESKTOP_QUERY, () => {
      let jumpTween: gsap.core.Tween | undefined;

      const distance = () =>
        Math.max(0, track.scrollWidth - stage.clientWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top+=20 top",
          end: () => `+=${Math.max(distance() + window.innerWidth * 0.45, 1)}`,
          pin: viewport,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const translatedDistance = self.progress * distance();
            const nearestCardIndex = cards.reduce(
              (nearestIndex, card, index) =>
                Math.abs(card.offsetLeft - translatedDistance) <
                Math.abs(cards[nearestIndex].offsetLeft - translatedDistance)
                  ? index
                  : nearestIndex,
              0,
            );

            updateCard(nearestCardIndex);
          },
        },
      });

      const trigger = horizontalTween.scrollTrigger;

      const scrollToProgress = (progress: number) => {
        if (!trigger) return;
        jumpTween?.kill();

        const scrollState = { value: trigger.scroll() };
        const destination =
          trigger.start + (trigger.end - trigger.start) * progress;

        jumpTween = gsap.to(scrollState, {
          value: destination,
          duration: 1.05,
          ease: "power3.inOut",
          overwrite: true,
          onUpdate: () => window.scrollTo(0, scrollState.value),
        });
      };

      const progressForCard = (card: HTMLElement) => {
        const maxDistance = distance();
        return maxDistance > 0
          ? gsap.utils.clamp(0, 1, card.offsetLeft / maxDistance)
          : 0;
      };

      const handleGroupClick = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        const target = section.querySelector<HTMLElement>(link.hash);
        if (!target) return;
        event.preventDefault();
        scrollToProgress(progressForCard(target));
      };

      groupLinks.forEach((link) =>
        link.addEventListener("click", handleGroupClick),
      );

      const handleNextClick = (event: Event) => {
        event.preventDefault();

        if (activeGroup === 0 && automationCard) {
          scrollToProgress(progressForCard(automationCard));
          return;
        }

        if (trigger) {
          scrollToProgress(1);
          window.setTimeout(() => {
            window.scrollTo({ top: trigger.end + 2, behavior: "smooth" });
          }, 1080);
        }
      };

      nextLink.addEventListener("click", handleNextClick);
      void document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        jumpTween?.kill();
        nextLink.removeEventListener("click", handleNextClick);
        groupLinks.forEach((link) =>
          link.removeEventListener("click", handleGroupClick),
        );
        horizontalTween.kill();
        titleTween?.kill();
        gsap.set(track, { clearProps: "transform" });
        gsap.set(currentTitle, { clearProps: "opacity,visibility,transform" });
      };
    });

    media.add(STACKED_QUERY, () => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (first, second) =>
                second.intersectionRatio - first.intersectionRatio,
            )[0];

          if (visibleEntry) {
            const card = visibleEntry.target as HTMLElement;
            updateCard(cards.indexOf(card), true);
          }
        },
        {
          rootMargin: "-25% 0px -55% 0px",
          threshold: [0, 0.25, 0.5, 0.75],
        },
      );

      cards.forEach((card) => observer.observe(card));
      return () => observer.disconnect();
    });

    return () => media.revert();
  }, []);

  return null;
}
