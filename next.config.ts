import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * **Plain files, published by GitHub Pages** — owner, 2026-10-19, choosing
   * how mardal.co goes online: "why vercel i have my personal website directly
   * from github". Pages serves files and runs no code, so `next build` writes
   * every page out as HTML into `out/`, and `.github/workflows/pages.yml`
   * publishes that folder. Tried before it was chosen: every page and every
   * picture loaded from the plain files, served the way Pages serves them —
   * `/about` from `about.html`.
   *
   * What a server did here and plain files cannot: the contact letter has no
   * endpoint to post to, so it becomes an email in the visitor's own app (see
   * `components/contact/LetterForm.tsx`); and there are no redirects. The old
   * addresses they caught were renamed and deleted pages from before launch,
   * never public on mardal.co.
   */
  output: "export",

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
};

export default nextConfig;
