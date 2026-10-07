import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * **This folder is the project, whatever lies above it.** A stray
   * package-lock.json in the home folder made `next dev` take the whole home
   * folder as its root: it watched far more than it should, macOS refused it
   * the Desktop ("reading dir /Users/kushtrim/Desktop — Operation not
   * permitted", 2026-10-07), the server died, and in between it went on
   * serving stylesheets edits had already changed. Started from here, as
   * `npm run dev` always is.
   */
  turbopack: {
    root: process.cwd(),
  },

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
      /* ── The service routes, renamed to match their labels on 2026-08-25 ──
         The labels changed first and the addresses followed an hour later, so
         every one of these was live and linkable in between.

         `web-platforms-apps` is the oldest and points at the FINAL address
         rather than at `website-apps`, which is where it went when it was
         written. A redirect to a redirect works and costs a second round trip
         for no reason; more to the point, a chain is a thing that breaks
         silently the day a middle link is tidied away. */
      {
        source: "/services/web-platforms-apps",
        destination: "/services/websites",
        permanent: true,
      },
      {
        source: "/services/website-apps",
        destination: "/services/websites",
        permanent: true,
      },
      {
        source: "/services/ux-ui-branding",
        destination: "/services/branding",
        permanent: true,
      },
      {
        source: "/services/custom-software",
        destination: "/services/software",
        permanent: true,
      },
      {
        source: "/services/crm-solutions",
        destination: "/services/crm-solution",
        permanent: true,
      },
      /* The industry taxonomy came off Clients on 2026-08-25 — seven
         prerendered sector views and the story nested under one of them.

         The story is FIRST and the sector view second, and the order is the
         whole of it: both patterns start `/case-studies/:something`, so a
         two-segment address matches the one-segment rule's `:sector` if that
         rule is reached first, and the story would be redirected to the index
         instead of to itself. */
      {
        source: "/case-studies/:sector/:story",
        destination: "/case-studies/:story",
        permanent: true,
      },
      {
        /* **Named, not `:sector`.** A bare parameter here matches ANY single
           segment under /case-studies — including the story's own new address,
           `/case-studies/healthcare-office-website`, which this sent to the
           index instead of serving. Redirects run before routing, so the page
           never got a chance to answer.

           So the seven that existed are listed. Anything else under
           /case-studies is either a story or a 404, and both are the router's
           to decide rather than this file's. */
        source:
          "/case-studies/:sector(finance|healthcare|manufacturing|automotive|retail|logistics|public-sector)",
        destination: "/case-studies",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
