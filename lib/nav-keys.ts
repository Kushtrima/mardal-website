/**
 * What a key pressed on one of the header's panel triggers should do.
 *
 * ── The problem this exists to answer ──
 * The bar has one shared panel and it is rendered AFTER the whole list of
 * triggers, which is what lets a pointer run along the words without the panel
 * closing underneath it. For a keyboard that arrangement was a dead end: Tab
 * from Services goes to Products, Products opens its own panel on focus, and the
 * Services panel a reader was about to enter is gone before they reach it. Only
 * the last entry's panel was ever reachable, because only it has nothing after
 * it to tab to. Five service-page links were unreachable from the header.
 *
 * Moving the panel next to each trigger would fix it and cost the pointer
 * behaviour, so the panel stays where it is and the keyboard gets a way in of
 * its own: a deliberate key that moves focus into the panel the trigger has
 * already opened.
 *
 * ── Why the arrows and not Enter ──
 * `ArrowDown` and `ArrowUp` are what a disclosure navigation is expected to
 * answer to, and — more importantly here — they are the only keys that can mean
 * one thing on both kinds of trigger. Three of the four entries are buttons
 * whose Enter already toggles the panel; Clients is a link whose Enter must
 * navigate to its page. A key that entered the panel on Enter would either break
 * that link or behave differently on one word than on its neighbours.
 *
 * ── Why a function in lib rather than a branch in the component ──
 * The same reason `createWheelGate` is here: this is the decision, and the
 * component is only the wiring. Written inline it is three conditions nobody can
 * test without a browser; written here it is the contract, and
 * tests/nav-keys.test.mjs holds it — including the case that has no visible
 * symptom, which is that an entry with no panel must never claim the key.
 */

/**
 * `enter-first` and `enter-last` mean: this key is ours, take the default action
 * and move focus into the panel. `pass` means leave the key alone — the browser,
 * the link or the button owns it.
 */
export type NavTriggerIntent = "enter-first" | "enter-last" | "pass";

export function navTriggerIntent(
  key: string,
  hasPanel: boolean,
): NavTriggerIntent {
  /* A word with nothing behind it never swallows a key. Every entry has a panel
     today, so this branch has no symptom yet — which is exactly why it is
     asserted: the first entry added without children would otherwise stop the
     page scrolling on ArrowDown and give nothing back. */
  if (!hasPanel) return "pass";

  if (key === "ArrowDown") return "enter-first";
  if (key === "ArrowUp") return "enter-last";

  return "pass";
}
