import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * One movement, three verbs, no copies.
 *
 * The page transition and the Clients filter make the same movement, and for a
 * while they shared the numbers but not the tweens — four hand-written copies of
 * two tweens. One of the four was incomplete in a way nothing could catch: the
 * page transition's stuck-navigation recovery restored `opacity` and never
 * mentioned `filter`, so on the one path that recovery exists for the whole site
 * was left under an inline `blur(7px)` with no way back but a reload.
 *
 * It could not be caught because it is a runtime state on an element, invisible
 * to any assertion on markup and unreachable without a browser. What can be
 * checked is that nobody writes the tween themselves any more.
 */

const ROOT = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, ROOT), "utf8");

const LIB = read("lib/page-transition.ts");
const CONSUMERS = [
  ["RouteTransition", read("components/motion/RouteTransition.tsx")],
  ["ClientsIndex", read("components/case-studies/ClientsIndex.tsx")],
];

/** Source with comments stripped — these checks are about what the code does. */
const code = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("the three verbs are the only movement anyone writes", () => {
  for (const [name, source] of CONSUMERS) {
    const body = code(source);
    assert.doesNotMatch(
      body,
      /gsap\.(to|from|fromTo|set)\(/,
      `${name} has gone back to writing its own tween — the fifth copy is where the next incomplete one comes from`,
    );
    assert.match(
      body,
      /from "\.\.\/\.\.\/lib\/page-transition"/,
      `${name} does not use the shared movement`,
    );
  }
});

test("coming back always hands the properties back", () => {
  /* `clearProps` is the whole bug. A tween that restores opacity and leaves the
     inline filter behind is the site stuck blurred, and it is the difference
     between the copy that was wrong and the three that were right. */
  const fadeIn = LIB.match(/export function fadeIn[\s\S]*?\n\}/)?.[0];
  assert.ok(fadeIn, "lib/page-transition.ts no longer exports fadeIn");
  assert.match(fadeIn, /opacity:\s*1/);
  assert.match(fadeIn, /filter:\s*"blur\(0px\)"/);
  assert.match(fadeIn, /clearProps:\s*"[^"]*filter/);
  assert.match(fadeIn, /clearProps:\s*"[^"]*pointerEvents/);
});

test("going out always starts the filter from a number", () => {
  /* `filter` defaults to `none`, which GSAP cannot interpolate from — it has
     driven a filter far past its target in this codebase before. */
  const fadeOut = LIB.match(/export function fadeOut[\s\S]*?\n\}/)?.[0];
  assert.ok(fadeOut, "lib/page-transition.ts no longer exports fadeOut");
  assert.match(fadeOut, /\{\s*filter:\s*"blur\(0px\)"\s*\}/);
  assert.match(fadeOut, /pointerEvents:\s*"none"/);
});

test("the recovery restores and disarms", () => {
  /* The timer exists for a navigation that never lands. It has to put the page
     back AND disarm the arrival, or the transition it was holding gets spent on
     whatever moves the path next — which on the Clients page is a filter press,
     not a navigation. */
  const route = code(CONSUMERS[0][1]);
  const recovery = route.match(/setTimeout\(\(\) => \{[\s\S]*?\}, STUCK_MS\)/)?.[0];
  assert.ok(recovery, "the stuck-navigation recovery has gone");
  assert.match(recovery, /fadeIn\(/, "the recovery no longer brings the page back");
  assert.match(
    recovery,
    /armedRef\.current = null/,
    "the recovery leaves the arrival armed",
  );
});

test("Back cancels a navigation that is still leaving", () => {
  /* A press starts a fade and hands the route to a timer half a second later.
     Press Back inside that half second — exactly when a reader who has changed
     their mind does — and the timer still fired, pushing them forward into the
     page they had just turned away from. Two navigations from one press. */
  const route = code(CONSUMERS[0][1]);
  const onPop = route.match(/function onPop\(\)[\s\S]*?\n    \}/)?.[0];
  assert.ok(onPop, "the popstate handler has gone");
  assert.match(
    onPop,
    /clearTimeout\(pushRef\.current\)/,
    "Back no longer cancels the pending push",
  );
});

test("only a click starts a page at the top", () => {
  /* Going back is a return, not an arrival: the reader had a place on that page
     and the browser is restoring it. Forcing 0 whatever brought you here landed
     every Back at the top of a page someone had already read half of, which is
     the one thing Back exists to undo. */
  const route = code(CONSUMERS[0][1]);
  assert.match(
    route,
    /armedRef\.current = "history"/,
    "the arm no longer records how the reader arrived",
  );
  const scroll = route.match(/if \(arrivedBy === "click"\) \{[\s\S]*?\n    \}/)?.[0];
  assert.ok(
    scroll,
    "the scroll-to-top is no longer conditional on having arrived by click",
  );
  assert.match(scroll, /scrollTo\(0/);
});
