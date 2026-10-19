import type { MetadataRoute } from "next";
import { siteUrl } from "../content/home";
import { siteIsLive } from "../lib/launch";

/** Written once, at build, and served as a file: GitHub Pages runs no code
 *  (next.config.ts). */
export const dynamic = "force-static";

/**
 * **Kept out of search until launch** — site check, 2026-10-09: there was no
 * robots file at all. Every crawler is asked to stay away while the site is
 * a preview (the preview's deploy also sends `X-Robots-Tag: noindex`). At
 * launch `siteIsLive` turns (lib/launch.ts) and every crawler is let in, the
 * AI search ones too (SEO-PLAN.md, step 1.1); nothing else changes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteIsLive
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
