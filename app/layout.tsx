import type { Metadata } from "next";
import "./globals.css";
import { RouteTransition } from "../components/motion/RouteTransition";
import { SmoothScroll } from "../components/motion/SmoothScroll";

export const metadata: Metadata = {
  title: {
    default: "Mardal — Innovation lives here",
    template: "%s — Mardal",
  },
  description: "We build the technology behind your growth.",
  icons: {
    icon: [{ url: "/mardal-mark-white.svg", type: "image/svg+xml" }],
    shortcut: "/mardal-mark-white.svg",
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
