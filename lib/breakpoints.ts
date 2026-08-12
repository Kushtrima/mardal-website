/**
 * The one query that decides whether the mobile menu is the navigation.
 *
 * ── Why this exists ──
 * It was written out three times — once in the stylesheet, twice in JavaScript —
 * and the copies disagreed. `globals.css` switches to the mobile menu at
 * `(max-width: 64rem), (hover: none)`. `SiteHeader` asked
 * `(min-width: 70.0625rem)`, a number that appears nowhere in the stylesheet, and
 * `SmoothScroll` asked `(min-width: 48rem)`. Both were stale copies of a boundary
 * that had moved, and each gap was a real trap:
 *
 *   — 1025 to 1120px on a mouse: the stylesheet has taken the menu and its Close
 *     button off the screen, the header's guard has not fired, and the body is
 *     still locked to `overflow: hidden`. Nothing visible scrolls or closes.
 *   — Any tablet: the stylesheet hands over on `hover: none` at every width, and
 *     a guard that only asks about width force-closed the menu on rotation — on a
 *     device where that menu is the only navigation there is.
 *   — 769 to 1024px, and every tablet: ScrollSmoother ran under a `position:
 *     fixed` panel, which pins it to the page rather than the screen.
 *
 * ── Why it is the menu's query and not the desktop's ──
 * The obvious shape is a `DESKTOP` constant that each consumer tests positively.
 * That needs a complement of `(max-width: 64rem), (hover: none)`, and **an exact
 * one cannot be written this way**: `min-width: 64.0625rem` is 1025px, so a
 * viewport at 1024.5 — ordinary under browser zoom or a fractional device pixel
 * ratio — matches neither query and falls into the same hole, one pixel wide.
 * The repo's own `64.0625rem` convention has that hole in it.
 *
 * So nobody computes a complement. This is the stylesheet's query, character for
 * character, and "desktop" is spelled `!matches` at the two places that need it.
 * There is no arithmetic left to get wrong.
 *
 * ── The one copy that cannot be removed ──
 * CSS cannot export a media query, so this string and the `@media` rule in
 * `globals.css` are two copies of one fact. `tests/breakpoints.test.mjs` reads
 * both and fails if they stop being identical — which is the only way to keep a
 * copy honest.
 */
export const MOBILE_MENU = "(max-width: 64rem), (hover: none)";
