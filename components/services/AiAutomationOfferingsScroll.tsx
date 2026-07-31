"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
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
    gsap.registerPlugin(ScrollTrigger, Observer);

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
      let gestureTween: gsap.core.Tween | undefined;
      let gestureObserver: Observer | undefined;
      let currentStep = 0;
      let gestureLocked = false;
      let gestureHasStopped = true;
      let gestureIsAnimating = false;
      const journeyState = { progress: 0 };
      const wordGroups = cards.map((card) =>
        Array.from(card.querySelectorAll<HTMLElement>("[data-service-word]")),
      );
      const numbers = cards.map((card) =>
        card.querySelector<HTMLElement>("[data-service-number]"),
      );

      const distance = () =>
        Math.max(cards.length * window.innerHeight * 0.92, 1);

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
        const followingIndex = Math.min(currentIndex + 2, cards.length - 1);
        const isSlowArrival =
          numbers[currentIndex]?.textContent?.trim() === "03" &&
          numbers[nextIndex]?.textContent?.trim() === "04";
        const transitionStart = isSlowArrival ? 0.45 : 0.7;
        const transitionProgress =
          nextIndex === currentIndex
            ? 0
            : gsap.utils.clamp(
                0,
                1,
                (localProgress - transitionStart) / (1 - transitionStart),
              );
        const easedTransition =
          transitionProgress *
          transitionProgress *
          (3 - 2 * transitionProgress);
        const cardWidth = cards[0]?.getBoundingClientRect().width ?? 0;
        const cardGap = Math.max(stage.clientWidth - cardWidth * 2, 0);
        const columnOffset = cardWidth + cardGap;

        cards.forEach((card, index) => {
          const isCurrent = index === currentIndex;
          const isNext = index === nextIndex && nextIndex !== currentIndex;
          const isFollowing =
            index === followingIndex && followingIndex !== nextIndex;

          gsap.set(card, {
            autoAlpha: isCurrent
              ? 1
              : isNext
                ? 1
                : isFollowing
                  ? easedTransition
                  : 0,
            x: isCurrent
              ? 0
              : isNext
                ? (1 - easedTransition) * columnOffset
                : isFollowing
                  ? (2 - easedTransition) * columnOffset
                  : 0,
            zIndex: isFollowing ? 3 : isNext ? 2 : isCurrent ? 1 : 0,
          });
        });

        renderWordExit(wordGroups[currentIndex], localProgress);

        if (nextIndex !== currentIndex) {
          gsap.set(wordGroups[nextIndex], {
            autoAlpha: 1,
            x: 0,
          });
        }

        if (followingIndex !== nextIndex) {
          gsap.set(wordGroups[followingIndex], {
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
          gsap.set(nextNumber, { opacity: 1 });
        }

        const followingNumber = numbers[followingIndex];
        if (followingIndex !== nextIndex && followingNumber) {
          gsap.set(followingNumber, { opacity: easedTransition });
        }

        updateCard(easedTransition >= 0.5 ? nextIndex : currentIndex);
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
          onEnter: (self) => {
            currentStep = Math.min(
              Math.round(self.progress * cards.length),
              cards.length - 1,
            );
            gestureLocked = false;
            gestureHasStopped = true;
            gestureObserver?.enable();
          },
          onEnterBack: (self) => {
            currentStep = Math.min(
              Math.round(self.progress * cards.length),
              cards.length - 1,
            );
            gestureLocked = false;
            gestureHasStopped = true;
            gestureObserver?.enable();
          },
          onLeave: () => gestureObserver?.disable(),
          onLeaveBack: () => gestureObserver?.disable(),
          onUpdate: (self) => {
            renderServices(self.progress);

            if (!gestureIsAnimating) {
              currentStep = Math.min(
                Math.round(self.progress * cards.length),
                cards.length - 1,
              );
            }
          },
        },
      });

      const trigger = horizontalTween.scrollTrigger;

      const animateToStep = (nextStep: number) => {
        if (!trigger) return;

        const destination =
          trigger.start +
          (trigger.end - trigger.start) * (nextStep / cards.length);
        const scrollState = { value: trigger.scroll() };

        gestureTween?.kill();
        gestureIsAnimating = true;
        gestureTween = gsap.to(scrollState, {
          value: destination,
          duration: 1.15,
          ease: "power3.inOut",
          overwrite: true,
          onUpdate: () => window.scrollTo(0, scrollState.value),
          onComplete: () => {
            currentStep = nextStep;
            gestureIsAnimating = false;

            if (gestureHasStopped) {
              gestureLocked = false;
            }
          },
        });
      };

      const moveOneService = (direction: -1 | 1) => {
        gestureHasStopped = false;

        if (gestureLocked || gestureIsAnimating || !trigger) return;

        gestureLocked = true;
        const nextStep = currentStep + direction;

        if (nextStep < 0 || nextStep >= cards.length) {
          gestureObserver?.disable();
          gestureLocked = false;
          window.scrollTo(
            0,
            direction > 0 ? trigger.end + 2 : trigger.start - 2,
          );
          return;
        }

        animateToStep(nextStep);
      };

      gestureObserver = Observer.create({
        target: window,
        type: "wheel",
        wheelSpeed: -1,
        tolerance: 10,
        preventDefault: true,
        lockAxis: true,
        onUp: () => moveOneService(1),
        onDown: () => moveOneService(-1),
        onStopDelay: 0.26,
        onStop: () => {
          gestureHasStopped = true;

          if (!gestureIsAnimating) {
            gestureLocked = false;
          }
        },
      });
      gestureObserver.disable();

      if (trigger?.isActive) {
        currentStep = Math.min(
          Math.round(trigger.progress * cards.length),
          cards.length - 1,
        );
        gestureObserver.enable();
      }

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
        gestureTween?.kill();
        gestureObserver?.kill();
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
