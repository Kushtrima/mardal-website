import { Container } from "../layout/Container";
import { HeaderSpace } from "../layout/HeaderSpace";
import { SiteFooter } from "../layout/SiteFooter";
import { CookieSettingsButton } from "../consent/CookieSettingsButton";
import { ServicesFooterRules } from "../services/ServicesFooterRules";
import { ServicesRules } from "../services/ServicesRules";
import {
  consent,
  cookiesPage,
  privacyPage,
  termsPage,
  type LegalPageContent,
} from "../../content/legal";

const PAGES = {
  privacy: privacyPage,
  terms: termsPage,
  cookies: cookiesPage,
} as const satisfies Record<string, LegalPageContent>;

export type LegalPageKey = keyof typeof PAGES;

/**
 * **Privacy, Terms and Cookies** — owner, 2026-10-08: "now we have to work on
 * privacy, terms and Cookies", then "don need the hero banner only normal
 * page titles then text under it in classic way". So a document: the page's
 * title, one line under it saying what the page covers, then each heading
 * with its words under it — one reading column from the second line to the
 * fourth, on the page's lines (red, turning grey, as the other pages').
 * Still — no entrance — because these are pages people read closely.
 */
export function LegalPage({ page }: { page: LegalPageKey }) {
  const content: LegalPageContent = PAGES[page];

  return (
    <>
      <main className="legal-page" id="main-content">
        <ServicesRules />
        <HeaderSpace />

        <section className="legal" aria-labelledby="legal-title">
          <Container className="legal__inner">
            <div className="legal__body">
              <h1 className="legal__page-title" id="legal-title">
                {content.title}
              </h1>
              <p className="legal__intro">{content.intro}</p>

              {content.sections.map((section) => (
                <article className="legal__section" key={section.title}>
                  <h2 className="legal__title">{section.title}</h2>
                  <div className="legal__copy">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.action === "cookie-settings" ? (
                      <CookieSettingsButton label={consent.change} />
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}
