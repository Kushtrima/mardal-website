"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const DESKTOP_QUERY =
  "(min-width: 64.0625rem) and (prefers-reduced-motion: no-preference)";
const MOBILE_QUERY =
  "(max-width: 48rem) and (prefers-reduced-motion: no-preference)";
const STACKED_QUERY =
  "(min-width: 48.0625rem) and (max-width: 64rem), (prefers-reduced-motion: reduce)";

/**
 * Maps vertical page progress to a horizontal editorial journey on desktop.
 * Smartphones use a pinned vertical stack, while tablets and reduced-motion
 * users keep a native vertical document.
 */
export function ServiceOfferingsScroll() {
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
    const skipLink = section?.querySelector<HTMLAnchorElement>(
      "[data-service-skip]",
    );
    const currentTitle = section?.querySelector<HTMLElement>(
      "[data-service-current-title]",
    );
    const ctaTitle = document.querySelector<HTMLElement>(
      ".service-cta__title[id]",
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

    const media = gsap.matchMedia();
    let activeGroup = -1;
    let activeCard = -1;
    let titleTween: gsap.core.Tween | undefined;

    const firstCardForGroup = (groupIndex: number) =>
      cards.find(
        (card) => Number(card.dataset.serviceGroup ?? 0) === groupIndex,
      );

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

      const nextGroupIndex = groupIndex + 1;
      const nextGroupCard = firstCardForGroup(nextGroupIndex);

      if (nextGroupCard) {
        nextLink.href = `#${nextGroupCard.id}`;
        nextLabel.textContent =
          groupLinks[nextGroupIndex]?.textContent?.trim() || "Next services";
      } else {
        nextLink.href = ctaTitle ? `#${ctaTitle.id}` : "#contact";
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
      let groupSwitchTween: gsap.core.Timeline | undefined;
      let skipTransition: gsap.core.Tween | undefined;
      let skipOverlay: HTMLElement | undefined;
      let skipInteractionCleanup: (() => void) | undefined;
      let isSkipping = false;
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
          onUpdate: (self) => {
            if (!isSkipping) renderServices(self.progress);
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

      const showProgressWithTransition = (progress: number) => {
        if (!trigger) return;
        jumpTween?.kill();
        groupSwitchTween?.kill();

        const targetIndex = Math.min(
          Math.floor(progress * cards.length),
          cards.length - 1,
        );
        updateCard(targetIndex);

        const destination =
          trigger.start + (trigger.end - trigger.start) * progress;

        gsap.set(stage, { autoAlpha: 1, x: 0 });
        groupSwitchTween = gsap
          .timeline()
          .to(stage, {
            autoAlpha: 0,
            x: -28,
            duration: 0.28,
            ease: "power2.in",
          })
          .add(() => {
            trigger.scroll(destination);
            renderServices(progress);
            ScrollTrigger.update();
          })
          .fromTo(
            stage,
            { autoAlpha: 0, x: 32 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.44,
              ease: "power3.out",
            },
          );
      };

      const handleGroupClick = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        const target = section.querySelector<HTMLElement>(link.hash);
        if (!target) return;
        event.preventDefault();
        showProgressWithTransition(progressForCard(target));
      };

      groupLinks.forEach((link) =>
        link.addEventListener("click", handleGroupClick),
      );

      const handleSkipClick = (event: Event) => {
        const target = skipLink
          ? document.querySelector<HTMLElement>(skipLink.hash)
          : null;

        if (!skipLink || !target || isSkipping) return;
        event.preventDefault();

        jumpTween?.kill();
        groupSwitchTween?.kill();
        skipTransition?.kill();
        skipInteractionCleanup?.();
        skipOverlay?.remove();
        gsap.set(stage, { autoAlpha: 1, x: 0 });
        isSkipping = true;

        const smoother = ScrollSmoother.get();
        const startingScroll = smoother?.scrollTop() ?? window.scrollY;
        smoother?.paused(true);

        const overlay = document.createElement("div");
        const transitionTrack = document.createElement("div");
        const currentFrame = document.createElement("div");
        const targetFrame = document.createElement("div");
        const currentView = viewport.cloneNode(true) as HTMLElement;
        const targetView = target.cloneNode(true) as HTMLElement;
        const footer = document.querySelector<HTMLElement>(".site-footer");
        const footerView = footer?.cloneNode(true) as HTMLElement | undefined;

        overlay.className =
          "service-skip-transition service-page service-page--crm-solutions";
        overlay.setAttribute("aria-hidden", "true");
        const sectionStyles = window.getComputedStyle(section);
        overlay.style.setProperty(
          "--service-surface",
          sectionStyles.getPropertyValue("--service-surface"),
        );
        overlay.style.setProperty(
          "--service-ink",
          sectionStyles.getPropertyValue("--service-ink"),
        );
        transitionTrack.className = "service-skip-transition__track";
        currentFrame.className =
          "service-skip-transition__frame service-skip-transition__frame--current";
        targetFrame.className =
          "service-skip-transition__frame service-skip-transition__frame--target";
        currentView.removeAttribute("style");

        currentFrame.append(currentView);
        targetFrame.append(targetView);
        if (footerView) targetFrame.append(footerView);
        transitionTrack.append(currentFrame, targetFrame);
        overlay.append(transitionTrack);
        document.body.append(overlay);
        skipOverlay = overlay;

        let hasSettled = false;
        const settleSkip = (
          moveToTarget: boolean,
          completedNaturally = false,
        ) => {
          if (hasSettled) return;
          hasSettled = true;

          skipInteractionCleanup?.();
          skipInteractionCleanup = undefined;
          if (!completedNaturally) skipTransition?.kill();
          skipTransition = undefined;

          smoother?.paused(false);

          if (moveToTarget) {
            if (smoother) {
              smoother.scrollTo(target, false, "top top");
            } else {
              window.scrollTo({
                top: window.scrollY + target.getBoundingClientRect().top,
                behavior: "auto",
              });
            }
            history.pushState(null, "", skipLink.hash);
          } else if (smoother) {
            smoother.scrollTop(startingScroll);
          } else {
            window.scrollTo({ top: startingScroll, behavior: "auto" });
          }

          ScrollTrigger.update();

          const revealPage = () => {
            overlay.remove();
            if (skipOverlay === overlay) skipOverlay = undefined;
            isSkipping = false;
          };

          if (completedNaturally) {
            window.requestAnimationFrame(revealPage);
          } else {
            revealPage();
          }
        };

        const nudgeSkip = (delta: number) => {
          if (!skipTransition || delta === 0) return;
          const nextProgress = gsap.utils.clamp(
            0,
            1,
            skipTransition.progress() +
              delta / Math.max(window.innerHeight * 1.15, 1),
          );
          skipTransition.progress(nextProgress);
        };

        const handleManualWheel = (wheelEvent: WheelEvent) => {
          wheelEvent.preventDefault();
          nudgeSkip(wheelEvent.deltaY);
        };
        let touchStartY: number | undefined;
        const handleManualTouchStart = (touchEvent: TouchEvent) => {
          touchStartY = touchEvent.touches[0]?.clientY;
        };
        const handleManualTouchMove = (touchEvent: TouchEvent) => {
          const currentY = touchEvent.touches[0]?.clientY;
          if (touchStartY === undefined || currentY === undefined) return;
          touchEvent.preventDefault();
          nudgeSkip(touchStartY - currentY);
          touchStartY = currentY;
        };
        const handleManualKey = (keyEvent: KeyboardEvent) => {
          const eventTarget = keyEvent.target as HTMLElement | null;
          if (
            eventTarget?.matches(
              "input, textarea, select, button, [contenteditable='true']",
            )
          ) {
            return;
          }

          const movesForward =
            keyEvent.key === "ArrowDown" ||
            keyEvent.key === "PageDown" ||
            keyEvent.key === "End" ||
            (keyEvent.key === " " && !keyEvent.shiftKey);
          const movesBackward =
            keyEvent.key === "ArrowUp" ||
            keyEvent.key === "PageUp" ||
            keyEvent.key === "Home" ||
            (keyEvent.key === " " && keyEvent.shiftKey);

          if (movesForward || movesBackward) {
            keyEvent.preventDefault();
            nudgeSkip((movesForward ? 1 : -1) * window.innerHeight * 0.2);
          }
        };

        window.addEventListener("wheel", handleManualWheel, {
          capture: true,
          passive: false,
        });
        window.addEventListener("touchstart", handleManualTouchStart, {
          capture: true,
          passive: true,
        });
        window.addEventListener("touchmove", handleManualTouchMove, {
          capture: true,
          passive: false,
        });
        window.addEventListener("keydown", handleManualKey, true);
        skipInteractionCleanup = () => {
          window.removeEventListener("wheel", handleManualWheel, true);
          window.removeEventListener(
            "touchstart",
            handleManualTouchStart,
            true,
          );
          window.removeEventListener("touchmove", handleManualTouchMove, true);
          window.removeEventListener("keydown", handleManualKey, true);
        };

        skipTransition = gsap.to(transitionTrack, {
          y: -window.innerHeight,
          duration: 1.5,
          ease: "sine.in",
          overwrite: true,
          onComplete: () => settleSkip(true, true),
        });
      };

      skipLink?.addEventListener("click", handleSkipClick);

      const handleNextClick = (event: Event) => {
        event.preventDefault();

        const nextGroupCard = firstCardForGroup(activeGroup + 1);
        if (nextGroupCard) {
          scrollToProgress(progressForCard(nextGroupCard));
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
        groupSwitchTween?.kill();
        skipTransition?.kill();
        skipInteractionCleanup?.();
        skipOverlay?.remove();
        ScrollSmoother.get()?.paused(false);
        skipLink?.removeEventListener("click", handleSkipClick);
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
        gsap.set(stage, { clearProps: "opacity,visibility,transform" });
      };
    });

    media.add(MOBILE_QUERY, () => {
      section.classList.add("is-mobile-service-stack");

      let jumpTween: gsap.core.Tween | undefined;
      let groupSwitchTween: gsap.core.Timeline | undefined;
      const cardContent = cards.map((card) =>
        Array.from(
          card.querySelectorAll<HTMLElement>(
            ".service-card__mobile-title, .service-card__body, .service-card__number",
          ),
        ),
      );

      cards.forEach((card, index) => {
        gsap.set(card, {
          autoAlpha: 1,
          yPercent: index === 0 ? 0 : 105,
          zIndex: index + 1,
        });
      });
      gsap.set(cardContent.flat(), { autoAlpha: 1, y: 0 });
      updateCard(0, true);

      const mobileTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.max(
              (cards.length - 1) * window.innerHeight * 1.08,
              1,
            )}`,
          pin: viewport,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const cardIndex = Math.min(
              Math.round(self.progress * (cards.length - 1)),
              cards.length - 1,
            );
            updateCard(cardIndex, true);
          },
        },
      });

      cards.slice(1).forEach((incomingCard, transitionIndex) => {
        mobileTimeline
          .to(
            cardContent[transitionIndex],
            {
              autoAlpha: 0,
              y: -12,
              duration: 0.34,
              stagger: 0.025,
            },
            transitionIndex,
          )
          .fromTo(
            incomingCard,
            { autoAlpha: 1, yPercent: 105 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
            },
            transitionIndex + 0.08,
          );
      });

      const trigger = mobileTimeline.scrollTrigger;

      const scrollToCard = (card: HTMLElement) => {
        if (!trigger) return;
        const cardIndex = cards.indexOf(card);
        if (cardIndex < 0) return;

        jumpTween?.kill();
        const scrollState = { value: trigger.scroll() };
        const progress =
          cards.length > 1 ? cardIndex / (cards.length - 1) : 0;
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

      const showCardWithTransition = (card: HTMLElement) => {
        if (!trigger) return;
        const cardIndex = cards.indexOf(card);
        if (cardIndex < 0) return;

        jumpTween?.kill();
        groupSwitchTween?.kill();
        const progress =
          cards.length > 1 ? cardIndex / (cards.length - 1) : 0;
        const destination =
          trigger.start + (trigger.end - trigger.start) * progress;

        updateCard(cardIndex, true);
        gsap.set(stage, { autoAlpha: 1, x: 0 });
        groupSwitchTween = gsap
          .timeline()
          .to(stage, {
            autoAlpha: 0,
            x: -28,
            duration: 0.28,
            ease: "power2.in",
          })
          .add(() => {
            trigger.scroll(destination);
            mobileTimeline.progress(progress);
            updateCard(cardIndex, true);
            ScrollTrigger.update();
          })
          .fromTo(
            stage,
            { autoAlpha: 0, x: 32 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.44,
              ease: "power3.out",
            },
          );
      };

      const handleGroupClick = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        const target = section.querySelector<HTMLElement>(link.hash);
        if (!target) return;
        event.preventDefault();
        showCardWithTransition(target);
      };

      groupLinks.forEach((link) =>
        link.addEventListener("click", handleGroupClick),
      );

      const handleNextClick = (event: Event) => {
        event.preventDefault();

        const nextGroupCard = firstCardForGroup(activeGroup + 1);
        if (nextGroupCard) {
          scrollToCard(nextGroupCard);
          return;
        }

        if (trigger) {
          jumpTween?.kill();
          const scrollState = { value: trigger.scroll() };
          jumpTween = gsap.to(scrollState, {
            value: trigger.end + 2,
            duration: 1.05,
            ease: "power3.inOut",
            overwrite: true,
            onUpdate: () => window.scrollTo(0, scrollState.value),
          });
        }
      };

      nextLink.addEventListener("click", handleNextClick);
      void document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        jumpTween?.kill();
        groupSwitchTween?.kill();
        nextLink.removeEventListener("click", handleNextClick);
        groupLinks.forEach((link) =>
          link.removeEventListener("click", handleGroupClick),
        );
        mobileTimeline.kill();
        titleTween?.kill();
        section.classList.remove("is-mobile-service-stack");
        gsap.set(cards, {
          clearProps: "opacity,visibility,transform,zIndex",
        });
        gsap.set(cardContent.flat(), {
          clearProps: "opacity,visibility,transform",
        });
        gsap.set(currentTitle, { clearProps: "opacity,visibility,transform" });
        gsap.set(stage, { clearProps: "opacity,visibility,transform" });
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
