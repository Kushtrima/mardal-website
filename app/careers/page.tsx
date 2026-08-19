import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { SectionEnter } from "../../components/motion/SectionEnter";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { PixelArrow } from "../../components/ui/PixelArrow";
import { careers } from "../../content/careers";

export const metadata: Metadata = {
  title: careers.title,
  description: careers.description,
};

/**
 * Careers, and the first of the twelve unwritten pages to be written.
 *
 * Built on the same bones as every other page here — `service-hero` and its
 * `data-service-hero-*` hooks are the site's editorial page opening rather than
 * anything to do with services — so it arrives and dissolves as the Blog,
 * Clients and the five service pages do.
 *
 * No artwork, and the hero's foot gathered into one block: the arrangement
 * Clients arrived at when its plate came out and the unwritten pages took when
 * the owner removed theirs. Three pages share those rules now.
 */
export default function CareersPage() {
  return (
    <>
      <SectionEnter />
      <ServicePageEntry />

      <main
        className="service-page service-page--careers"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero service-hero--bare"
          aria-labelledby="careers-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="careers-title"
                data-service-hero-title
              >
                {/* The leading space matters and is invisible until it does.
                    The spans are rendered adjacent with nothing between them,
                    which is fine while they are blocks — and on a phone they
                    are set inline so the sentence can be balanced at a size the
                    authored break cannot reach, and without this it reads
                    `startswith`. Inside the span rather than between them, so
                    no Fragment is needed, and it collapses to nothing when the
                    span is a block again. */}
                {careers.titleLines.map((line, index) => (
                  <span className="service-hero__title-line" key={line}>
                    {index > 0 ? " " : null}
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div className="service-hero__aside">
              <p className="service-hero__support" data-service-hero-support>
                {careers.support}
              </p>

              {/* Down the page rather than off it. Every other hero here ends
                  on an email, and it is the wrong ending for this one — the
                  roles are what a reader came for and they are one screen
                  below. The address is an id on this page, so the guard that
                  no link points at an anchor its page has not got covers it. */}
              <a
                className="service-hero__cta"
                href={careers.heroCtaHref}
                data-service-hero-cta
              >
                {careers.heroCta}
                <PixelArrow
                  className="service-hero__cta-arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </div>
          </Container>

          <div
            className="service-hero__blur"
            aria-hidden="true"
            data-service-hero-blur
          />
          <div
            className="service-hero__fade"
            aria-hidden="true"
            data-service-hero-fade
          />
        </section>

        {/* The roles as a record, not as cards.
            A row states the job once and is passed, which is how an opening is
            actually read: the name and its two facts, what the work is, and the
            way in. Ruled between rather than boxed — three panels would be a
            card grid, and a card grid is a rejection on this site.

            Each row is its own anchor, so a role can be sent as an address even
            though it has no page of its own yet. */}
        <section
          className="careers-roles"
          id={careers.rolesId}
          aria-labelledby="careers-roles-title"
          data-route-section
        >
          <Container data-enter data-enter-mode="fade">
            <h2 className="visually-hidden" id="careers-roles-title">
              {careers.rolesLabel}
            </h2>

            <ul className="role-list">
              {careers.roles.map((role) => (
                <li key={role.id}>
                  {/* The whole row is the link, the way a blog card is: a title
                      that opens and a row that does not is two targets for one
                      destination, and the smaller one is the one people miss.
                      The id rides on the link so a single role is still an
                      address on this page as well as a page of its own. */}
                  <a
                    className="role"
                    id={role.id}
                    href={`/careers/${role.id}`}
                  >
                  <div className="role__id">
                    <h3 className="role__title">{role.title}</h3>

                    {/* Two facts, and only the two that are known. Everything a
                        listing usually adds — salary, seniority, start date,
                        team size — would be invented, and PRODUCT.md is
                        explicit that a gap beats a plausible guess. */}
                    <dl className="role__facts">
                      <div className="role__fact">
                        <dt>{careers.factLabels.location}</dt>
                        <dd>{role.location}</dd>
                      </div>
                      <div className="role__fact">
                        <dt>{careers.factLabels.commitment}</dt>
                        <dd>{role.commitment}</dd>
                      </div>
                    </dl>
                  </div>

                  <p className="role__copy">{role.copy}</p>

                  {/* Inside the link, so a span rather than an anchor — the
                      row is already the target and an anchor in an anchor is
                      not markup a browser can make sense of. */}
                  <span className="role__more">
                    {careers.moreLabel}
                    <PixelArrow
                      className="role__arrow"
                      direction="up-right"
                      size="small"
                    />
                  </span>
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section
          className="service-cta"
          aria-labelledby="careers-cta-title"
          data-route-section
        >
          <Container>
            <div
              className="service-cta__inner"
              data-enter
              data-enter-mode="none"
            >
              <h2 className="service-cta__title" id="careers-cta-title">
                {careers.cta.title}
              </h2>

              <a className="service-cta__link" href={careers.cta.href}>
                {careers.cta.label}
                <PixelArrow
                  className="service-cta__arrow"
                  direction="up-right"
                  size="small"
                />
              </a>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
