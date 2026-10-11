import { Container } from "../layout/Container";
import { HeaderSpace } from "../layout/HeaderSpace";
import { SiteFooter } from "../layout/SiteFooter";
import { RollingLabel } from "../ui/RollingLabel";
import { ServicesFooterRules } from "../services/ServicesFooterRules";
import { ServicesHero } from "../services/ServicesHero";
import { ServicesRules } from "../services/ServicesRules";
import {
  nearshoringHero,
  nearshoringParts,
  nearshoringSources,
} from "../../content/nearshoring";
import { servicesIndexActions } from "../../content/services-index";

/**
 * **Nearshoring from Kosovo** — SEO-PLAN.md, step 2.5 (owner, 2026-10-11:
 * "English first then De and AL"). In the service pages' hand: the opening,
 * each part as a case study tells its account (the heading on the second
 * line, the words from the middle line, its links under them), then where
 * the facts come from, and the two ways in.
 */
export function NearshoringPage() {
  return (
    <>
      <main
        className="service-page service-page--nearshoring"
        id="main-content"
        data-service-page
      >
        <ServicesRules />
        <HeaderSpace />
        <ServicesHero hero={nearshoringHero} name="nearshoring" />

        <section className="project-account service-hub" aria-label="Nearshoring from Kosovo">
          <Container data-enter data-enter-mode="none">
            {nearshoringParts.map((part) => (
              <article className="project-passage" id={part.id} key={part.id}>
                <h2 className="project-passage__title">{part.heading}</h2>
                <div className="project-passage__copy">
                  {part.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {part.links ? (
                    <ul className="service-hub__related-list nearshoring__links">
                      {part.links.map((link) => (
                        <li key={link.href}>
                          <a className="services-wheel__cta" href={link.href} data-roll>
                            <RollingLabel>{link.label}</RollingLabel>
                            <Arrow />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}

            {/* Where the facts about Kosovo come from, each to its source. */}
            <div className="project-passage">
              <h2 className="project-passage__title">Sources</h2>
              <ul className="project-passage__copy service-hub__related-list">
                {nearshoringSources.map((source) => (
                  <li key={source.href}>
                    <a
                      className="services-wheel__cta nearshoring__source"
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-roll
                    >
                      <RollingLabel>{source.label}</RollingLabel>
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* The services' two ways in. */}
            <div className="project-passage">
              <div className="project-passage__copy services-wheel__actions service-hub__actions">
                {servicesIndexActions.map((action) => (
                  <a className="services-wheel__cta" href={action.href} key={action.label} data-roll>
                    <RollingLabel>{action.label}</RollingLabel>
                    <Arrow />
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}

/** VIEW ALL's thin arrow, up and to the right; still while the word rolls. */
function Arrow() {
  return (
    <svg className="services-wheel__arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2 14 14 2M4.5 2H14v9.5" />
    </svg>
  );
}
