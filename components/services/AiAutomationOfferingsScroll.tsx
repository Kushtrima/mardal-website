"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Turns the service offerings into one pinned stack.
 *
 * The section stays in one viewport position while each new panel rises from
 * below and lands directly on the previous one. The covered text fades away
 * as the new content takes its exact position.
 */
export function AiAutomationOfferingsScroll() {
  useEffect(() => {
    let context: gsap.Context | undefined;
    let gestureObserver: Observer | undefined;
    let scrollTween: gsap.core.Tween | undefined;

    const frame = window.requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(
        "[data-service-offerings]",
      );
      if (!section) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-service-offering]",
        section,
      );
      if (cards.length < 2) return;

      gsap.registerPlugin(ScrollTrigger, Observer);

      /* Phones keep native touch scrolling, while each editorial group is
         revealed by the scroll position that brings it into view. This gives
         the mobile layout deliberate motion without trapping long service
         descriptions inside a pinned viewport. */
      if (!window.matchMedia("(min-width: 48.0625rem)").matches) {
        context = gsap.context(() => {
          cards.forEach((card) => {
            const title = card.querySelector<HTMLElement>(
              ".service-offering__title, .service-offering__group-title",
            );
            const overviewLabel = card.querySelector<HTMLElement>(
              ".service-offering__section-label--overview",
            );
            const overview = card.querySelector<HTMLElement>(
              ".service-offering__copy",
            );
            const capabilitiesLabel = card.querySelector<HTMLElement>(
              ".service-offering__section-label--capabilities",
            );
            const capabilityItems = gsap.utils.toArray<HTMLElement>(
              ".service-offering__list li",
              card,
            );
            const exampleLabel = card.querySelector<HTMLElement>(
              ".service-offering__section-label--example",
            );
            const example = card.querySelector<HTMLElement>(
              ".service-offering__example-block",
            );

            const revealGroups = [
              title ? [title] : [],
              [overviewLabel, overview].filter(
                (element): element is HTMLElement => Boolean(element),
              ),
              [capabilitiesLabel, ...capabilityItems].filter(
                (element): element is HTMLElement => Boolean(element),
              ),
              [exampleLabel, example].filter(
                (element): element is HTMLElement => Boolean(element),
              ),
            ].filter((group) => group.length > 0);

            revealGroups.forEach((group, groupIndex) => {
              gsap.fromTo(
                group,
                {
                  autoAlpha: 0,
                  y: groupIndex === 0 ? 32 : 52,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  stagger: groupIndex === 2 ? 0.035 : 0.06,
                  ease: "none",
                  scrollTrigger: {
                    trigger: group[0],
                    start: "top 92%",
                    end: "top 68%",
                    scrub: 0.55,
                  },
                },
              );
            });
          });
        }, section);

        void document.fonts.ready.then(() => ScrollTrigger.refresh());
        return;
      }

      section.classList.add("is-scroll-stack");

      context = gsap.context(() => {
        const titleFor = (card: HTMLElement) =>
          gsap.utils.toArray<HTMLElement>(
            [
              ".service-offering__title",
              ".service-offering__group-title",
            ].join(", "),
            card,
          );

        const detailsFor = (card: HTMLElement) =>
          gsap.utils.toArray<HTMLElement>(
            [
              ".service-offering__section-label",
              ".service-offering__copy",
              ".service-offering__list",
              ".service-offering__example-block",
            ].join(", "),
            card,
          );

        const contentFor = (card: HTMLElement) => [
          ...titleFor(card),
          ...detailsFor(card),
        ];

        cards.forEach((card, index) => {
          const entryOffset = card.classList.contains(
            "service-offering--group",
          )
            ? 50
            : 78;

          gsap.set(card, {
            autoAlpha: 1,
            yPercent: index === 0 ? 0 : entryOffset,
            zIndex: index + 1,
          });

          gsap.set(titleFor(card), {
            autoAlpha: index === 0 ? 1 : 0,
            y: 0,
          });

          gsap.set(detailsFor(card), {
            autoAlpha: index === 0 ? 1 : 0,
            y: index === 0 ? 0 : "60vh",
          });

          const guides = card.querySelector<HTMLElement>(
            ".service-offering__guides",
          );

          if (guides) {
            gsap.set(guides, { autoAlpha: index === 0 ? 1 : 0 });
          }
        });

        const lastCardIndex = cards.length - 1;
        let currentCardIndex = 0;
        let gestureLocked = false;
        let gestureHasStopped = true;
        let isAnimating = false;

        const animateToCard = (nextCardIndex: number) => {
          if (!activeTrigger) return;

          const start = activeTrigger.start + 1;
          const end = activeTrigger.end - 1;
          const targetScroll = gsap.utils.clamp(
            start,
            end,
            activeTrigger.start +
              (activeTrigger.end - activeTrigger.start) *
                (nextCardIndex / lastCardIndex),
          );
          const scrollPosition = { value: activeTrigger.scroll() };

          scrollTween?.kill();
          isAnimating = true;

          scrollTween = gsap.to(scrollPosition, {
            value: targetScroll,
            duration: 0.9,
            ease: "power2.inOut",
            overwrite: true,
            onUpdate: () => activeTrigger?.scroll(scrollPosition.value),
            onComplete: () => {
              currentCardIndex = nextCardIndex;
              isAnimating = false;

              if (gestureHasStopped) {
                gestureLocked = false;
              }
            },
          });
        };

        const moveOneCard = (direction: -1 | 1) => {
          gestureHasStopped = false;

          if (gestureLocked || isAnimating || !activeTrigger) return;

          gestureLocked = true;
          const nextCardIndex = currentCardIndex + direction;

          if (nextCardIndex < 0 || nextCardIndex > lastCardIndex) {
            const exitScroll =
              direction > 0 ? activeTrigger.end + 2 : activeTrigger.start - 2;

            gestureObserver?.disable();
            gestureLocked = false;
            activeTrigger.scroll(exitScroll);
            return;
          }

          animateToCard(nextCardIndex);
        };

        gestureObserver = Observer.create({
          target: window,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 10,
          preventDefault: true,
          allowClicks: true,
          lockAxis: true,
          onUp: () => moveOneCard(1),
          onDown: () => moveOneCard(-1),
          onStopDelay: 0.22,
          onStop: () => {
            gestureHasStopped = true;

            if (!isAnimating) {
              gestureLocked = false;
            }
          },
        });
        gestureObserver.disable();

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () =>
              `+=${window.innerHeight * (cards.length - 1) * 1.15}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: (self) => {
              currentCardIndex = Math.round(self.progress * lastCardIndex);
              gestureLocked = false;
              gestureHasStopped = true;
              gestureObserver?.enable();
            },
            onEnterBack: (self) => {
              currentCardIndex = Math.round(self.progress * lastCardIndex);
              gestureLocked = false;
              gestureHasStopped = true;
              gestureObserver?.enable();
            },
            onLeave: () => gestureObserver?.disable(),
            onLeaveBack: () => gestureObserver?.disable(),
          },
        });

        const activeTrigger = timeline.scrollTrigger;

        if (activeTrigger?.isActive) {
          currentCardIndex = Math.round(
            activeTrigger.progress * lastCardIndex,
          );
          gestureObserver.enable();
        }

        cards.slice(1).forEach((card, index) => {
          const coveredCard = cards[index];
          const coveredContent = contentFor(coveredCard);
          const incomingTitle = titleFor(card);
          const incomingDetails = detailsFor(card);
          const coveredGuides = coveredCard.querySelector<HTMLElement>(
            ".service-offering__guides",
          );
          const incomingGuides = card.querySelector<HTMLElement>(
            ".service-offering__guides",
          );

          timeline
            .to(
              coveredContent,
              {
                autoAlpha: 0,
                y: -18,
                duration: 0.2,
                ease: "none",
              },
              index,
            )
            .set(
              card,
              {
                autoAlpha: 1,
                yPercent: 0,
              },
              index + 0.18,
            )
            .to(
              incomingTitle,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.36,
                ease: "power1.out",
              },
              index + 0.18,
            );

          if (incomingDetails.length > 0) {
            timeline.to(
              incomingDetails,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.52,
                ease: "none",
              },
              index + 0.48,
            );
          }

          if (coveredGuides && incomingGuides) {
            timeline
              .set(incomingGuides, { autoAlpha: 1 }, index + 1)
              .set(coveredGuides, { autoAlpha: 0 }, index + 1);
          } else if (coveredGuides) {
            timeline.to(
              coveredGuides,
              {
                autoAlpha: 0,
                duration: 0.2,
                ease: "none",
              },
              index + 0.18,
            );
          } else if (incomingGuides) {
            timeline.to(
              incomingGuides,
              {
                autoAlpha: 1,
                duration: 0.3,
                ease: "none",
              },
              index + 0.2,
            );
          }
        });
      }, section);

      void document.fonts.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      window.cancelAnimationFrame(frame);
      scrollTween?.kill();
      gestureObserver?.kill();
      context?.revert();

      const section = document.querySelector<HTMLElement>(
        "[data-service-offerings]",
      );
      section?.classList.remove("is-scroll-stack");
    };
  }, []);

  return null;
}
