import type { Metadata } from "next";

const SITE_NAME = "Mardal";

/** The picture every preview carries unless a page brings its own: the
 *  wordmark on white, 1200×630 (public/og-image.png). Written relative, and so
 *  are the canonicals below: until launch Next.js writes them against the
 *  deployment's own address, the preview's; from launch against mardal.co
 *  (`metadataBase` in app/layout.tsx, set by lib/launch.ts). */
export const previewImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** A page's own picture for its previews — a case study's cover. */
export type PreviewImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * **A page's title and description, and its link preview from the same two**
 * — site check, 2026-10-09: no page had preview tags, so a link sent on
 * WhatsApp, LinkedIn or Facebook showed no title card. A page that sets its
 * own `openGraph` replaces the layout's whole (Next's merge is shallow), so
 * each page passes its two lines through here rather than leaving every
 * preview with the homepage's — and with no picture, which the same merge
 * drops, so the picture is named here as well.
 *
 * **And its one address** (SEO-PLAN.md, step 1.3): every page names its own
 * canonical, here rather than in the layout, which every page would inherit
 * and so point at the homepage.
 */
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  type: "website" | "article" = "website",
  image: PreviewImage = previewImage,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en",
      url: path,
      title: `${title} — ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}
