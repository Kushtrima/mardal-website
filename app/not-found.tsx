import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../components/layout/Container";
import { HeaderSpace } from "../components/layout/HeaderSpace";
import { SiteFooter } from "../components/layout/SiteFooter";
import { ServicesFooterRules } from "../components/services/ServicesFooterRules";
import { ServicesRules } from "../components/services/ServicesRules";
import { RollingLabel } from "../components/ui/RollingLabel";
import { notFoundPage } from "../content/not-found";

export const metadata: Metadata = {
  title: notFoundPage.title,
};

/**
 * **A wrong address** — site check, 2026-10-09. Set as the documents are
 * (Privacy, Terms, Cookies: components/legal/LegalPage.tsx), with their
 * classes: the page's lines, the title, one line under it, and the site's
 * word-and-arrow way home. Light, like every page here — Next.js's own 404
 * turned black on a screen in dark mode.
 */
export default function NotFound() {
  return (
    <>
      <main className="legal-page" id="main-content">
        <ServicesRules />
        <HeaderSpace />

        <section className="legal" aria-labelledby="not-found-title">
          <Container className="legal__inner">
            <div className="legal__body">
              <h1 className="legal__page-title" id="not-found-title">
                {notFoundPage.title}
              </h1>
              <p className="legal__intro">{notFoundPage.text}</p>
              <Link className="legal__button" data-roll href="/">
                <RollingLabel>{notFoundPage.home}</RollingLabel>
                <svg
                  className="legal__button-arrow"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M2 14 14 2M4.5 2H14v9.5" />
                </svg>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}
