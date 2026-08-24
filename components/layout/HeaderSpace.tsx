/**
 * The room the bar used to take up in the page.
 *
 * The header is `position: fixed` and rendered once in the root layout, out of
 * every page's flow — so without this each page would start its content under
 * the bar and every hero would move up by the bar's height.
 *
 * It is a spacer in the exact place the header was rather than padding on a
 * container, and that is deliberate: three separate rules already measure this
 * page's top from the same two tokens — `.service-hero__inner` sizes itself to
 * `100svh` minus the bar, `.story-hero__art` reaches the window by rising the
 * bar's height, and the mega menu's ground clears it — so the geometry is only
 * unchanged if the space stays exactly where it was, at exactly its old size.
 */
export function HeaderSpace() {
  return <div className="header-space" aria-hidden="true" />;
}
