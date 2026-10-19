import type { MetadataRoute } from "next";
import { blog } from "../content/blog";
import { stories } from "../content/case-studies";
import { siteUrl } from "../content/home";

/** Written once, at build, and served as a file: GitHub Pages runs no code
 *  (next.config.ts). */
export const dynamic = "force-static";

/**
 * **Every page there is, for search engines** — site check, 2026-10-09: there
 * was no sitemap. Read from the same lists the pages are built from, so a
 * new piece or story is in it without anyone remembering to add it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/services",
    "/products",
    "/case-studies",
    ...stories.map((story) => `/case-studies/${story.slug}`),
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
  ].map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));

  const pieces = blog.posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [...pages, ...pieces];
}
