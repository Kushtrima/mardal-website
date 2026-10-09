import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SkipLink } from "../components/layout/SkipLink";
import { previewImage } from "../lib/page-metadata";
import { CookieConsent } from "../components/consent/CookieConsent";
import { RouteTransition } from "../components/motion/RouteTransition";
import { SmoothScroll } from "../components/motion/SmoothScroll";

/**
 * The page may use the whole screen, notch and home bar included
 * (`viewport-fit: cover`); the page's gutters and the bar keep their content
 * clear of them (`env(safe-area-inset-*)` in globals.css). Owner, 2026-10-06:
 * the responsive and mobile pass.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Mardal — House of Creativity & Technology",
    template: "%s — Mardal",
  },
  description: "We build the technology behind your growth.",
  openGraph: {
    type: "website",
    siteName: "Mardal",
    locale: "en",
    title: "Mardal — House of Creativity & Technology",
    description: "We build the technology behind your growth.",
    /* The homepage's preview, and the fallback for any page without its
       own; the pages' come from lib/page-metadata (site check, 2026-10-09). */
    images: [previewImage],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    /* Not the -white one any more: it colours itself from the browser's own
       theme, which is a different setting from the page's. */
    icon: [{ url: "/mardal-mark.svg", type: "image/svg+xml" }],
    shortcut: "/mardal-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* First in the page, so it is the first stop of Tab; fixed, so
            outside the wrapper as the bar is. */}
        <SkipLink />

        {/* **Outside the wrapper, and that is the whole reason it is here.**
            ScrollSmoother translates `#smooth-content` on every frame, and a
            transform makes its element the containing block for any `fixed`
            descendant — so a fixed bar inside the wrapper is fixed to the
            content and scrolls away with it, which is exactly what it used to
            do. Out here it is fixed to the window and can hide and return.

            One header for the whole site, rather than the twelve places that
            each rendered their own. Each of those now renders `<HeaderSpace />`
            in its place to keep the room the bar took up in the page. */}
        <SiteHeader />

        {/* The cookie panel: fixed to the window like the bar, so outside the
            content ScrollSmoother moves for the same reason. */}
        <CookieConsent />

        {/* ScrollSmoother scrolls this content itself rather than letting the
            browser do it, so it has to own a wrapper of its own. Without the
            plugin running these are two ordinary divs and the page scrolls
            normally. */}
        <div id="smooth-wrapper">
          <div id="smooth-content">{children}</div>
        </div>

        {/* Fades `#smooth-content` between routes and renders nothing itself.
            Outside the wrapper because it is a listener rather than a thing on
            the page, and because a component that fades that element must not be
            inside it. */}
        <RouteTransition />

        <SmoothScroll />
      </body>
    </html>
  );
}
