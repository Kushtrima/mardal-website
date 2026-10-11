import { Container } from "../layout/Container";
import { HeaderSpace } from "../layout/HeaderSpace";
import { SiteFooter } from "../layout/SiteFooter";
import { RollingLabel } from "../ui/RollingLabel";
import { ServicesFooterRules } from "./ServicesFooterRules";
import { ServicesHero } from "./ServicesHero";
import { ServicesRules } from "./ServicesRules";
import { stories } from "../../content/case-studies";
import { servicesIndexActions } from "../../content/services-index";
import {
  hubServices,
  serviceAnchor,
  serviceHubs,
  type ServiceHub,
} from "../../content/service-pages";

/**
 * **A service page** — SEO-PLAN.md, step 2.1 (owner, 2026-10-11: "make it
 * what is best"). In the site's own hand, from pieces it already has:
 *
 * — the opening of /services, at its size, on the page's five lines;
 * — each service as a case study tells its account: the name on the second
 *   line, the owner's paragraph from the middle line, and what it includes
 *   under it, each with the services' small red plus, in two columns;
 * — the real projects that show the work, by name, each to its page;
 * — the services' two ways in, Write to us and Book a meeting.
 */
export function ServiceHubPage({ hub }: { hub: ServiceHub }) {
  const related = hub.related
    .map((slug) => stories.find((story) => story.slug === slug))
    .filter((story) => story !== undefined);

  return (
    <>
      <main
        className="service-page service-page--hub"
        id="main-content"
        data-service-page
      >
        <ServicesRules />
        <HeaderSpace />
        <ServicesHero hero={hub.hero} name="service-hub" />

        <section className="project-account service-hub" aria-label={hub.name}>
          <Container data-enter data-enter-mode="none">
            {hubServices(hub).map((service) => (
              <article
                className="project-passage service-hub__service"
                id={serviceAnchor(service.label)}
                key={service.label}
              >
                <h2 className="project-passage__title">{service.label}</h2>
                <div className="project-passage__copy">
                  {service.summary ? <p>{service.summary}</p> : null}
                  {service.lists.map((list, index) => (
                    <div
                      className="services-wheel__chapters services-wheel__chapters--one"
                      key={list.title ?? `list-${index}`}
                    >
                      <ul className="services-wheel__items">
                        {list.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            ))}

            {related.length ? (
              <div className="project-passage service-hub__related">
                <h2 className="project-passage__title">Related work</h2>
                <ul className="project-passage__copy service-hub__related-list">
                  {related.map((story) => (
                    <li key={story.slug}>
                      <a
                        className="services-wheel__cta"
                        href={`/case-studies/${story.slug}`}
                        data-roll
                      >
                        <RollingLabel>{story.title}</RollingLabel>
                        <Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* The other kinds of work, each to its page, and all of them on
                the services' wheel. */}
            <div className="project-passage service-hub__related">
              <h2 className="project-passage__title">More services</h2>
              <ul className="project-passage__copy service-hub__related-list">
                {serviceHubs
                  .filter((other) => other.slug !== hub.slug)
                  .map((other) => (
                    <li key={other.slug}>
                      <a
                        className="services-wheel__cta"
                        href={`/services/${other.slug}`}
                        data-roll
                      >
                        <RollingLabel>{other.name}</RollingLabel>
                        <Arrow />
                      </a>
                    </li>
                  ))}
                <li>
                  <a className="services-wheel__cta" href="/services" data-roll>
                    <RollingLabel>All services</RollingLabel>
                    <Arrow />
                  </a>
                </li>
              </ul>
            </div>

            {/* The services' two ways in. */}
            <div className="project-passage">
              <div className="project-passage__copy services-wheel__actions service-hub__actions">
                {servicesIndexActions.map((action) => (
                  <a
                    className="services-wheel__cta"
                    href={action.href}
                    key={action.label}
                    data-roll
                  >
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
    <svg
      className="services-wheel__arrow"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 14 14 2M4.5 2H14v9.5" />
    </svg>
  );
}
