import type { MetadataRoute } from "next";
import { siteUrl } from "../content/home";

/**
 * **Kept out of search until launch** — site check, 2026-10-09: there was no
 * robots file at all. Every crawler is asked to stay away while the site is
 * a preview (the preview's deploy also sends `X-Robots-Tag: noindex`). At
 * launch, `disallow` becomes `allow: "/"` and nothing else changes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
