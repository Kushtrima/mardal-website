import type { Metadata } from "next";

const SITE_NAME = "Mardal";

/** The picture every preview carries: the wordmark on white, 1200×630
 *  (public/og-image.png). Written relative: on Vercel, Next.js writes it
 *  against the deployment's own address — the preview's now, the launched
 *  site's later — so no address is set by hand (`metadataBase`). */
export const previewImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/**
 * **A page's title and description, and its link preview from the same two**
 * — site check, 2026-10-09: no page had preview tags, so a link sent on
 * WhatsApp, LinkedIn or Facebook showed no title card. A page that sets its
 * own `openGraph` replaces the layout's whole (Next's merge is shallow), so
 * each page passes its two lines through here rather than leaving every
 * preview with the homepage's — and with no picture, which the same merge
 * drops, so the picture is named here as well.
 */
export function pageMetadata(
  title: string,
  description: string,
  type: "website" | "article" = "website",
): Metadata {
  return {
    title,
    description,
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en",
      title: `${title} — ${SITE_NAME}`,
      description,
      images: [previewImage],
    },
  };
}
