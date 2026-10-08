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
   * Addresses that moved, and pages that went.
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
      /* ── The old design's own pages, deleted on 2026-10-08 ── owner, of
         every service's and product's page: "delete it all", "we dont have
         seperate pages for those links". Every service is on the services
         page's wheel and both products are on the products page, so each
         address goes to where its words are now rather than to a 404.
         Temporary, so a page written at one of these addresses later is not
         hidden behind a redirect a browser has kept. */
      {
        source:
          "/services/:service(websites|software|crm-solution|ai-automation|branding|ux-ui-design|print-design)",
        destination: "/services",
        permanent: false,
      },
      {
        source: "/products/:product(arvena-ai|ftesa)",
        destination: "/products",
        permanent: false,
      },
      /* ── The service routes, renamed to match their labels on 2026-08-25 ──
         The labels changed first and the addresses followed an hour later, so
         every one of these was live and linkable in between. Since
         2026-10-08 they go straight to the services page, the pages they
         went to having been deleted.

         `web-platforms-apps` is the oldest and points at the FINAL address
         rather than at `website-apps`, which is where it went when it was
         written. A redirect to a redirect works and costs a second round trip
         for no reason; more to the point, a chain is a thing that breaks
         silently the day a middle link is tidied away. */
      {
        source: "/services/web-platforms-apps",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/website-apps",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/ux-ui-branding",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/custom-software",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/crm-solutions",
        destination: "/services",
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
