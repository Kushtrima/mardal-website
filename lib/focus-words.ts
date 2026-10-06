import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/**
 * **A heading's words come into focus** — the entrance the owner kept for
 * the services page's opening on 2026-10-06 ("before was one with the blur
 * that i like it"), and asked for on the homepage's the same day ("apply
 * this also in HOUSE OF CREATIVITY in home page").
 *
 * GSAP's SplitText splits the heading into its words, once the face is in
 * so they are measured in it; the words come into focus one after the next
 * in reading order — out of a blur, faint and a little low. No masks: they
 * would clip the blur. When it is done the split is undone, so the heading
 * is its own text again, its letter-spacing as it was.
 *
 * The heading waits hidden in the stylesheet (with script, and only for a
 * reader who has not asked for less motion) until it is split; this shows
 * it. `then` adds what follows to the same timeline. Returns the undoing.
 */

const FROM = { opacity: 0, filter: "blur(12px)", yPercent: 18 };
const TO = {
  opacity: 1,
  filter: "blur(0px)",
  yPercent: 0,
  duration: 1.1,
  ease: "power3.out",
  stagger: 0.07,
};

export function focusWords(
  heading: HTMLElement,
  then?: (timeline: gsap.core.Timeline) => void,
): () => void {
  gsap.registerPlugin(SplitText);
  let split: SplitText | undefined;
  let timeline: gsap.core.Timeline | undefined;
  let gone = false;

  document.fonts.ready.then(() => {
    if (gone) return;
    split = SplitText.create(heading, { type: "words" });
    gsap.set(split.words, FROM);
    gsap.set(heading, { visibility: "visible" });

    timeline = gsap
      .timeline({ delay: 0.1, onComplete: () => split?.revert() })
      .to(split.words, TO, 0);
    then?.(timeline);
  });

  return () => {
    gone = true;
    timeline?.kill();
    split?.revert();
    gsap.set(heading, { clearProps: "visibility" });
  };
}
