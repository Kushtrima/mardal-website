import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The one route this site has ever moved.
   *
   * `/services/web-platforms-apps` became `/services/website-apps` on
   * 2026-08-24 when the owner renamed the service. Nothing inside the site
   * points at the old address any more — the menu, the footer and the tests
   * were all followed down in the same change — so this is for what is outside
   * it: anything already linked or bookmarked, and the crawlers that will have
   * read the old path off `main`.
   *
   * Permanent, because the page did not move temporarily.
   */
  async redirects() {
    return [
      {
        source: "/services/web-platforms-apps",
        destination: "/services/website-apps",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
