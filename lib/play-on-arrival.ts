import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * **Plays an entrance once its block comes into view — and also when the page
 * arrives already at or past the block.**
 *
 * Owner, 2026-10-09: "sometimes when i scroll in mobile version i dont se at
 * all Human Creativity". Coming Back to a page puts the scroll below a block
 * in one jump while the page is still being measured, and ScrollTrigger takes
 * no action for a jump it sees during a measure (`stateChanged && !_refreshing`
 * in its update). An entrance tied to the trigger with `toggleActions` then
 * never plays, and the block stays in its hidden start state — reproduced on
 * the homepage, Back from Clients: Human Creativity 52px down in its mask.
 *
 * So the entrance waits paused (`paused: true`, its delay in its own vars)
 * and this plays it: on the way in from above, on the way in from below
 * after a jump, or as soon as a measure finds the page at or past the block.
 * Once, whichever comes first; `restart(true)` keeps the entrance's delay.
 * An entrance built only when it starts (the blog's focusWords) is passed as
 * the function that starts it.
 */
export function playOnArrival(
  entrance: gsap.core.Animation | (() => void),
  trigger: Element,
  start: string,
) {
  let played = false;
  const play = () => {
    if (played) return;
    played = true;
    if (typeof entrance === "function") entrance();
    else entrance.restart(true);
  };

  return ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: play,
    onEnterBack: play,
    onRefresh: (self) => {
      if (self.progress > 0) play();
    },
  });
}
