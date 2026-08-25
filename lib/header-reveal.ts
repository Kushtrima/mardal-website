/**
 * Whether the bar is on screen, and why.
 *
 * The decision lives here rather than in the effect that applies it for the
 * same reason `lib/nav-keys.ts` does: it is the rule, it has edges worth
 * writing down, and none of it leaves a trace in markup that a render test
 * could read.
 *
 *   "top"    — the page has not been scrolled far enough for any of this to
 *              apply. The bar is where it has always been, on the page rather
 *              than over it, and it is the only state that paints no ground.
 *   "shown"  — scrolled, and the reader has asked for the bar back by moving
 *              far enough up the page to mean it.
 *   "hidden" — scrolled, moving down. Out of the way.
 */
export type HeaderState = "top" | "shown" | "hidden";

/**
 * The reading, carried between frames.
 *
 * `travel` is the run so far in ONE direction, not the distance from the last
 * frame — which is the whole substance of this module. A threshold on a single
 * frame's delta is a threshold on scroll SPEED: flick hard enough and one frame
 * clears any number you pick, so the bar answers a fast twitch and ignores a
 * slow deliberate pull. Accumulating until the direction reverses asks the
 * question that was actually meant — how far has this reader gone up — and a
 * gentle scroll earns the bar at the same point a sharp one does.
 */
export type HeaderReading = {
  state: HeaderState;
  lastY: number;
  travel: number;
};

/** Where the page starts, before anything has been read. */
export const HEADER_AT_REST: HeaderReading = {
  state: "top",
  lastY: 0,
  travel: 0,
};

/**
 * How far down the page the bar is left alone.
 *
 * Roughly its own height rather than a round number: below this the bar has not
 * finished leaving on its own, and hiding something still half on screen reads
 * as a flicker rather than as a decision.
 */
export const HEADER_REVEAL_AFTER = 96;

/**
 * How far a frame has to move to count as movement at all.
 *
 * **This exists because the page is scrolled by ScrollSmoother and not by the
 * browser.** The smoother eases the content towards the real scroll position,
 * so a gesture that has visibly stopped is still reporting movement for a few
 * frames, and one of those can be a pixel the other way. Without it, drift at
 * the end of a scroll reverses the run and empties the accumulator.
 */
export const HEADER_DIRECTION_DEADZONE = 4;

/** Downward run before the bar gets out of the way. Short: leaving should not
 *  need to be asked for twice. */
export const HEADER_HIDE_TRAVEL = 24;

/**
 * Upward run before the bar comes back.
 *
 * Five times the hide distance, and deliberately asymmetric — owner's call,
 * 2026-08-24, after the first build brought it back the instant the page moved
 * up at all. Coming back is an interruption over what is being read, so it
 * should take a scroll that meant it; getting out of the way is not, so it
 * should not.
 */
export const HEADER_REVEAL_TRAVEL = 120;

/** "top" has been left behind. The bar is over the page now, and stays until a
 *  downward run earns the hide. */
function settled(state: HeaderState): HeaderState {
  return state === "top" ? "shown" : state;
}

/** The next reading, given the one before it and where the page is now. */
export function nextHeaderState(
  previous: HeaderReading,
  y: number,
): HeaderReading {
  /* Near the top the bar belongs to the page, whichever way the reader is
     going — checked before the direction, so scrolling down through the first
     96px does not hide a bar that has not left yet. The run resets with it:
     travel measured across a return to the top is not a run. */
  if (y <= HEADER_REVEAL_AFTER) return { state: "top", lastY: y, travel: 0 };

  const delta = y - previous.lastY;

  /* Not movement. `lastY` advances anyway so a slow scroll still accumulates
     frame by frame, but `travel` is left alone — drift must not reverse a run
     that is still going. */
  if (Math.abs(delta) < HEADER_DIRECTION_DEADZONE) {
    return {
      state: settled(previous.state),
      lastY: y,
      travel: previous.travel,
    };
  }

  /* A reversal starts the run again from this frame rather than netting off
     against the old one, so turning around does not have to undo the distance
     already travelled before it counts for anything. */
  const reversed = delta > 0 !== previous.travel > 0;
  const travel = reversed ? delta : previous.travel + delta;

  let state = settled(previous.state);
  if (travel >= HEADER_HIDE_TRAVEL) state = "hidden";
  else if (travel <= -HEADER_REVEAL_TRAVEL) state = "shown";

  return { state, lastY: y, travel };
}

/**
 * How far the page may move under an open mega menu before it is dismissed.
 *
 * Not zero, and the reason is the same one `HEADER_DIRECTION_DEADZONE` exists
 * for: ScrollSmoother eases the content towards the real scroll position, so it
 * can still be reporting movement from a gesture that finished before the menu
 * was opened. At zero the panel would close on that settling and look as though
 * it had refused to open.
 */
export const MENU_SCROLL_TOLERANCE = 8;

/**
 * Whether an open mega menu survives the page being at `y`.
 *
 * **Closing on scroll rather than locking the scroll, and that is a decision
 * about what kind of thing this panel is.** It opens on HOVER — no press, no
 * deliberate act — and it is dismissed by moving the pointer away, so there is
 * no visible control that closes it. A page that stops scrolling because the
 * pointer drifted over a word, with nothing on screen saying why or how to
 * release it, is the exact failure this repo already carries a scar from: the
 * mobile menu once held `overflow: hidden` on the body with its own Close
 * button off-screen, and Escape was the only way out.
 *
 * Scrolling is an unambiguous statement that the reader wants the page rather
 * than the menu. Answering it by taking the page away inverts that.
 */
export function menuSurvivesScroll(openedAt: number, y: number): boolean {
  return Math.abs(y - openedAt) <= MENU_SCROLL_TOLERANCE;
}
