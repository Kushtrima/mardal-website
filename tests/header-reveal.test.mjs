import assert from "node:assert/strict";
import test from "node:test";
import {
  HEADER_AT_REST,
  MENU_SCROLL_TOLERANCE,
  menuSurvivesScroll,
  HEADER_DIRECTION_DEADZONE,
  HEADER_HIDE_TRAVEL,
  HEADER_REVEAL_AFTER,
  HEADER_REVEAL_TRAVEL,
  nextHeaderState,
} from "../lib/header-reveal.ts";

/* The bar is fixed to the window now, so it has to decide for itself when to be
   on screen. The decision is here rather than in the effect that applies it
   because it has edges — see lib/header-reveal.ts. */

/** Walk the page from `from` to `to` in frames of `step`, and report where the
 *  bar ended up. Frames rather than one jump, because the rule accumulates. */
function scroll(reading, from, to, step = 8) {
  let current = reading;
  const direction = to > from ? 1 : -1;
  for (let y = from; direction > 0 ? y <= to : y >= to; y += step * direction) {
    current = nextHeaderState(current, y);
  }
  return current;
}

const DEEP = HEADER_REVEAL_AFTER + 900;

test("near the top the bar belongs to the page, whichever way you are going", () => {
  assert.equal(nextHeaderState(HEADER_AT_REST, 0).state, "top");
  assert.equal(scroll(HEADER_AT_REST, 0, 40).state, "top");
  assert.equal(nextHeaderState(HEADER_AT_REST, HEADER_REVEAL_AFTER).state, "top");
});

test("scrolling down past it hides the bar", () => {
  assert.equal(scroll(HEADER_AT_REST, 0, DEEP).state, "hidden");
});

test("scrolling back up brings it back", () => {
  const down = scroll(HEADER_AT_REST, 0, DEEP);
  assert.equal(scroll(down, DEEP, DEEP - HEADER_REVEAL_TRAVEL - 40).state, "shown");
});

/* **The owner's correction, 2026-08-24: it came back the instant the page moved
   up at all.** Coming back is an interruption over what is being read, so it has
   to be asked for. Held as "less than the reveal distance does nothing, more
   than it works" rather than as the number itself. */
test("a short pull up is not enough to bring it back", () => {
  /* An absolute distance, not one derived from the constant. Written as
     `HEADER_REVEAL_TRAVEL - 40` this test silently inverts if the constant is
     ever set below 40: the "pull up" becomes a scroll DOWN and it passes for
     the wrong reason — which is exactly what it did when the constant was
     lowered to prove the test flips. */
  const NUDGE = 40;
  assert.ok(NUDGE < HEADER_REVEAL_TRAVEL, "the nudge must be a short one");

  const down = scroll(HEADER_AT_REST, 0, DEEP);
  const nudge = scroll(down, DEEP, DEEP - NUDGE);
  assert.equal(nudge.state, "hidden");

  /* And carrying on from that same nudge does reach it — so the run
     accumulates rather than each gesture starting over. */
  const further = scroll(nudge, nudge.lastY, nudge.lastY - 80);
  assert.equal(further.state, "shown");
});

/* Getting out of the way is not an interruption, so it is not made to wait the
   same distance. This is the asymmetry, asserted as an ordering rather than as
   two magic numbers. */
test("leaving takes less than returning", () => {
  assert.ok(HEADER_HIDE_TRAVEL < HEADER_REVEAL_TRAVEL);

  const shown = scroll(HEADER_AT_REST, 0, DEEP - HEADER_REVEAL_TRAVEL - 40);
  const back = scroll(shown, shown.lastY, shown.lastY - 200);
  assert.equal(back.state, "shown");
  assert.equal(scroll(back, back.lastY, back.lastY + HEADER_HIDE_TRAVEL + 16).state, "hidden");
});

/* **Why the run accumulates instead of reading one frame's delta.** A threshold
   on a single frame is a threshold on scroll SPEED — a hard flick clears any
   number in one frame while a slow deliberate pull never does. Both of these
   travel the same distance; both must reach the same answer. */
test("a slow pull earns the bar at the same point a fast one does", () => {
  const down = scroll(HEADER_AT_REST, 0, DEEP);
  const distance = HEADER_REVEAL_TRAVEL + 40;
  const slow = scroll(down, DEEP, DEEP - distance, HEADER_DIRECTION_DEADZONE + 1);
  const fast = scroll(down, DEEP, DEEP - distance, 60);
  assert.equal(slow.state, "shown");
  assert.equal(fast.state, "shown");
});

/* The smoother eases the content towards the real scroll position, so a gesture
   that has visibly stopped still reports movement for a few frames and one of
   them can be a pixel the other way. That must not empty a run in progress. */
test("a pixel of drift does not reverse a run", () => {
  const down = scroll(HEADER_AT_REST, 0, DEEP);
  let up = scroll(down, DEEP, DEEP - (HEADER_REVEAL_TRAVEL - 30));
  up = nextHeaderState(up, up.lastY + 1);
  up = nextHeaderState(up, up.lastY - 1);
  assert.equal(scroll(up, up.lastY, up.lastY - 60).state, "shown");
});

test("returning to the top resets the run", () => {
  const down = scroll(HEADER_AT_REST, 0, DEEP);
  const home = scroll(down, DEEP, 0, 60);
  assert.equal(home.state, "top");
  assert.equal(home.travel, 0);
});

/* **The mega menu closes when the page moves, rather than stopping it moving.**
   The owner asked for the opposite — lock the scroll while the pointer is on
   the panel — and the panel is the wrong kind of thing for that: it opens on
   hover and is dismissed by the pointer leaving, so a locked page would have no
   visible way out. This repo already carries that scar on the mobile menu. */
test("an open menu survives the page settling, and not a real scroll", () => {
  /* The smoother can still be easing a gesture that finished before the menu
     opened. Closing on that would look like a panel refusing to open. */
  assert.equal(menuSurvivesScroll(2000, 2000), true);
  assert.equal(menuSurvivesScroll(2000, 2000 + MENU_SCROLL_TOLERANCE), true);
  assert.equal(menuSurvivesScroll(2000, 2000 - MENU_SCROLL_TOLERANCE), true);

  /* Past it, either way, the reader has asked for the page. */
  assert.equal(menuSurvivesScroll(2000, 2000 + MENU_SCROLL_TOLERANCE + 1), false);
  assert.equal(menuSurvivesScroll(2000, 2000 - MENU_SCROLL_TOLERANCE - 1), false);

  /* Measured from where the menu opened, not from the last frame — a slow
     scroll that never moves more than the tolerance between frames still adds
     up to leaving. */
  assert.equal(menuSurvivesScroll(0, 400), false);
});
