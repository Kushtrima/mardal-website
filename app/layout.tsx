import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "../components/motion/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={geistSans.variable}>
        {/* ScrollSmoother scrolls this content itself rather than letting the
            browser do it, so it has to own a wrapper of its own. Without the
            plugin running these are two ordinary divs and the page scrolls
            normally. */}
        <div id="smooth-wrapper">
          <div id="smooth-content">{children}</div>
        </div>

        <SmoothScroll />
      </body>
    </html>
  );
}
