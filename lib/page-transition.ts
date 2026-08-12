/**
 * The one description of how this site changes what is on screen.
 *
 * Two places move content out and bring different content back: the transition
 * between pages, and the Clients index swapping its work when a sector is
 * chosen. They were asked to be the same movement, so the numbers live here once
 * rather than being written twice and drifting — which is the same argument the
 * menu is in `content/home.ts` for.
 *
 * ── The shape of it ──
 * Out faster than in. Leaving should feel like a decision taken and arriving like
 * something settling; equal halves read as a machine cycling. Both were less than
 * half this at first and the change was over before it registered as a change.
 *
 * ── Why opacity and blur and nothing else ──
 * Neither changes layout, so nothing any ScrollTrigger measured moves — and on
 * the page transition the thing being faded is `#smooth-content`, whose
 * transform ScrollSmoother writes on every frame, so anything positional there
 * would be two things fighting over one property.
 *
 * Opacity alone reads as a light being turned down. A little blur with it reads
 * as the content leaving.
 *
 * ── The one trap ──
 * **Always animate `filter` from an explicit `blur(0px)`.** It defaults to
 * `none`, which is not a number, and GSAP asked to interpolate from that has
 * driven a filter far past its target in this codebase before — the cards went
 * nearly black.
 */

/** Seconds the outgoing content takes to leave. */
export const OUT = 0.5;

/** Seconds the incoming content takes to arrive. */
export const IN = 0.85;

/** Pixels of blur at the far end of both halves. */
export const BLUR = 7;
