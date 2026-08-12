import assert from "node:assert/strict";
import test from "node:test";
import { navTriggerIntent } from "../lib/nav-keys.ts";

/* The header's panel is shared and sits after the whole list of triggers, so a
   keyboard cannot reach it by tabbing — the next trigger takes focus and swaps
   the panel first. These two keys are the way in. See lib/nav-keys.ts. */

test("the arrows are the way into a panel", () => {
  assert.equal(navTriggerIntent("ArrowDown", true), "enter-first");
  assert.equal(navTriggerIntent("ArrowUp", true), "enter-last");
});

test("Enter is left alone, because it means two different things on this bar", () => {
  /* Three entries are buttons whose Enter toggles the panel; Clients is a link
     whose Enter must go to /case-studies. Claiming Enter here would break one of
     the two. */
  assert.equal(navTriggerIntent("Enter", true), "pass");
  assert.equal(navTriggerIntent(" ", true), "pass");
});

test("nothing else is claimed, so Tab and Escape keep working", () => {
  /* Tab must stay the browser's: a reader who does not want the panel has to be
     able to run past the word. Escape is the document handler's, which closes the
     menu and puts focus back on the trigger. */
  for (const key of ["Tab", "Escape", "ArrowLeft", "ArrowRight", "Home", "End", "a"]) {
    assert.equal(navTriggerIntent(key, true), "pass", `${key} should pass`);
  }
});

test("an entry with no panel never swallows a key", () => {
  /* No symptom today — all four entries have children. The first one added
     without them would otherwise stop the page scrolling on ArrowDown and open
     nothing in return. */
  for (const key of ["ArrowDown", "ArrowUp", "Enter", "Tab"]) {
    assert.equal(navTriggerIntent(key, false), "pass", `${key} with no panel`);
  }
});
