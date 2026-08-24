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
    /* suppressHydrationWarning because the script below writes an attribute on
       this element before React reaches it, which is otherwise reported as a
       mismatch. It covers this element's own attributes, not the tree under. */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies a remembered choice before the first paint.

            A remembered choice only — with nothing stored this writes nothing,
            because `color-scheme: light dark` on :root already lets the browser
            follow the system setting on its own, with no script and no flash.
            So this runs for one case: someone who pressed the toggle and
            disagreed with their own system.

            It has to be inline and it has to be in the head. Anything deferred
            runs after the first frame, and on a page whose dark canvas is #000
            that is a black flash on the way to a white one — which is the whole
            thing worth avoiding. */}
        {/* A plain script rather than next/script. `beforeInteractive` was the
            obvious choice and does not work here: with inline content it never
            reaches the server-rendered HTML at all, which is the one thing this
            has to do. React logs a development warning about script tags inside
            components — it is about client re-renders, which this does not need
            and never gets. The tag is in the head of the served document, which
            is what was checked. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("mardal-theme");' +
              'if(t==="light"||t==="dark")' +
              "document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
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
