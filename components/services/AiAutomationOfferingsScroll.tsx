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
        x: -28,
        duration: 0.28,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          currentTitle.textContent = nextTitle;
          titleTween = gsap.fromTo(
            currentTitle,
            { autoAlpha: 0, x: 32 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.44,
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
      const journeyState = { progress: 0 };
      const wordGroups = cards.map((card) =>
        Array.from(card.querySelectorAll<HTMLElement>("[data-service-word]")),
      );
      const numbers = cards.map((card) =>
        card.querySelector<HTMLElement>("[data-service-number]"),
      );

      const distance = () =>
        Math.max(cards.length * window.innerHeight * 0.72, 1);

      const renderWordExit = (words: HTMLElement[], progress: number) => {
        const groupSize = 3;
        const groupCount = Math.max(Math.ceil(words.length / groupSize), 1);
        const fadeProgress = gsap.utils.clamp(
          0,
          1,
          (progress - 0.04) / 0.72,
        );

        words.forEach((word, index) => {
          const groupIndex = Math.floor(index / groupSize);
          const groupStart =
            groupCount === 1
              ? 0
              : (groupIndex / (groupCount - 1)) * 0.78;
          const groupProgress = gsap.utils.clamp(
            0,
            1,
            (fadeProgress - groupStart) / 0.22,
          );
          const easedProgress =
            groupProgress * groupProgress * (3 - 2 * groupProgress);
          const opacity = 1 - easedProgress;

          gsap.set(word, {
            autoAlpha: opacity,
            x: easedProgress * -14,
          });
        });
      };

      const renderServices = (progress: number) => {
        const journeyPosition = progress * cards.length;
        const currentIndex = Math.min(
          Math.floor(journeyPosition),
          cards.length - 1,
        );
        const localProgress = gsap.utils.clamp(
          0,
          1,
          journeyPosition - currentIndex,
        );
        const nextIndex = Math.min(currentIndex + 1, cards.length - 1);
        const nextOpacity =
          nextIndex === currentIndex
            ? 0
            : gsap.utils.clamp(0, 1, (localProgress - 0.7) / 0.3);
        const easedNextOpacity = 1 - Math.pow(1 - nextOpacity, 3);

        cards.forEach((card, index) => {
          const isCurrent = index === currentIndex;
          const isNext = index === nextIndex && nextOpacity > 0;
          gsap.set(card, {
            autoAlpha: isCurrent ? 1 : isNext ? easedNextOpacity : 0,
            x: isNext ? (1 - easedNextOpacity) * 64 : 0,
            zIndex: isNext ? 2 : isCurrent ? 1 : 0,
          });
        });

        renderWordExit(wordGroups[currentIndex], localProgress);

        if (nextIndex !== currentIndex) {
          gsap.set(wordGroups[nextIndex], {
            autoAlpha: 1,
            x: 0,
          });
        }

        const currentNumber = numbers[currentIndex];
        if (currentNumber) {
          gsap.set(currentNumber, {
            opacity: gsap.utils.clamp(0, 1, (0.88 - localProgress) / 0.18),
          });
        }

        const nextNumber = numbers[nextIndex];
        if (nextIndex !== currentIndex && nextNumber) {
          gsap.set(nextNumber, { opacity: easedNextOpacity });
        }

        updateCard(easedNextOpacity >= 0.5 ? nextIndex : currentIndex);
      };

      renderServices(0);

      const horizontalTween = gsap.to(journeyState, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top-=60 top",
          end: () => `+=${Math.max(distance() + window.innerWidth * 0.45, 1)}`,
          pin: viewport,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            renderServices(self.progress);
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
        const cardIndex = cards.indexOf(card);
        return cards.length > 0
          ? gsap.utils.clamp(0, 1, cardIndex / cards.length)
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
        gsap.set(cards, {
          clearProps: "opacity,visibility,transform,zIndex",
        });
        gsap.set(wordGroups.flat(), {
          clearProps: "opacity,visibility,transform",
        });
        gsap.set(
          numbers.filter((number): number is HTMLElement => number !== null),
          { clearProps: "opacity" },
        );
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
