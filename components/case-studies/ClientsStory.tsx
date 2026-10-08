import Link from "next/link";
import { Container } from "../layout/Container";
import { SiteFooter } from "../layout/SiteFooter";
import { SectionEnter } from "../motion/SectionEnter";
import { ServicesFooterRules } from "../services/ServicesFooterRules";
import { RollingLabel } from "../ui/RollingLabel";
import { ProjectHeroReveal } from "./ProjectHeroReveal";
import { ProjectShowcase } from "./ProjectShowcase";
import { pilotStory } from "../../content/case-studies";
import { industries } from "../../content/home";

/**
 * One customer's story — the page a card on the index opens.
 *
 * **A new approach — owner, 2026-10-08**, from three references: "hero with
 * big images", then the project in a paragraph with its record under it,
 * "then changellens etc", then the delivered pages shown one after the next.
 * So, in that order, on the page's four columns and its five lines:
 *
 * — the opening: one picture across the whole screen, its lines drawn over
 *   it, and from the middle line the industry and the project's name;
 * — the project: its name on the second line, a paragraph from the middle
 *   line to the edge, the record two by two under it, and the way to the live
 *   site;
 * — the account: what it replaced, what it does now, what the client owns;
 * — the pages, one after the next (ProjectShowcase);
 * — the way back to every story.
 *
 * The earlier pages (a record down the left beside the reading, and four
 * bodies before it) are in the history.
 */
export function ClientsStory() {
  const sector = industries.find(
    (industry) => industry.id === pilotStory.sector,
  );

  return (
    <>
      <SectionEnter />

      <main className="project-page" id="main-content">
        {/* The page's five lines, grey, from the top to the foot; the
            opening and the pages draw over them. */}
        <ServicesFooterRules />

        <section
          className="project-hero"
          aria-labelledby="project-title"
          /* The bar turns white over the picture, and says no "Operating
             from Kosova" over it (the stylesheet). */
          data-bar-dark
          data-project-hero
        >
          <ProjectHeroReveal />

          <div className="project-hero__media" aria-hidden="true">
            {/* Decorative, so alt is empty: a stock frame standing in for a
                shot of the delivered site. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="project-hero__image"
              src={pilotStory.heroImage}
              srcSet={`${pilotStory.heroImage.replace("/2400/1500", "/1200/750")} 1200w, ${pilotStory.heroImage} 2400w`}
              sizes="100vw"
              alt=""
              width="2400"
              height="1500"
              loading="eager"
              fetchPriority="high"
              data-project-hero-image
            />
          </div>

          {/* The page's lines, over the picture. */}
          <div
            className="services-rules project-hero__rules"
            aria-hidden="true"
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <span className="services-rules__line" key={index} />
            ))}
          </div>

          <Container className="project-hero__inner">
            <p className="project-hero__meta" data-project-hero-meta>
              <span className="project-hero__mark" aria-hidden="true" />
              {sector?.title ?? pilotStory.sector}
            </p>
            <h1
              className="project-hero__title"
              id="project-title"
              data-project-hero-title
            >
              {pilotStory.name}
            </h1>
          </Container>
        </section>

        <section
          className="project-intro"
          aria-labelledby="project-intro-title"
          data-route-section
        >
          <Container
            className="project-intro__inner"
            data-enter
            data-enter-mode="fade"
          >
            {/* Where a reference shows the client's logo: there is none on
                file, so its name stands there in words. */}
            <h2 className="project-intro__name" id="project-intro-title">
              {pilotStory.name}
            </h2>

            <p className="project-intro__summary">{pilotStory.summary}</p>

            <dl className="project-intro__record">
              {pilotStory.record.map((fact) => (
                <div className="project-intro__fact" key={fact.label}>
                  <dt className="project-intro__label">{fact.label}</dt>
                  <dd className="project-intro__value">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {/* No address is on file: it stands without a link until one
                is, rather than linking anywhere. */}
            {pilotStory.live.href ? (
              <a
                className="project-live"
                href={pilotStory.live.href}
                data-roll
                target="_blank"
                rel="noreferrer"
              >
                <RollingLabel>{pilotStory.live.label}</RollingLabel>
                <ProjectArrow />
              </a>
            ) : (
              <p className="project-live" aria-disabled="true">
                <span>{pilotStory.live.label}</span>
                <ProjectArrow />
              </p>
            )}
          </Container>
        </section>

        <section
          className="project-account"
          aria-labelledby="project-account-title"
          data-route-section
        >
          {/* Still: no effect on the scroll at all — owner, 2026-10-08, after
              a reveal and a held version: "remove all on scroll leave it as
              it was in normal state". */}
          <Container data-enter data-enter-mode="none">
            <h2 className="visually-hidden" id="project-account-title">
              {pilotStory.title}
            </h2>
            {pilotStory.passages.map((passage) => (
              <article className="project-passage" key={passage.id}>
                <h3 className="project-passage__title">{passage.heading}</h3>
                <div className="project-passage__copy">
                  {passage.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </Container>
        </section>

        <ProjectShowcase
          title={pilotStory.showcase.title}
          pages={pilotStory.showcase.pages}
          previous={pilotStory.showcase.previous}
          next={pilotStory.showcase.next}
          page={pilotStory.showcase.page}
        />

        {/* Back from the second line, Next Project ending on the fourth: two
            long arrows and no words on the page — owner, 2026-10-08: "remove
            text only leave it arrows but make longer arrows also when hover
            to tourn in red". The words stay for a screen reader. There is no
            second story yet, so Next Project stands without a link until
            there is one. */}
        <nav className="project-out" aria-label={pilotStory.way.label}>
          <Container className="project-out__inner">
            <Link
              className="project-out__link project-out__link--back"
              href="/case-studies"
            >
              <LongArrow back />
              <span className="visually-hidden">{pilotStory.way.back}</span>
            </Link>
            {pilotStory.way.nextHref ? (
              <Link
                className="project-out__link project-out__link--next"
                href={pilotStory.way.nextHref}
              >
                <span className="visually-hidden">{pilotStory.way.next}</span>
                <LongArrow />
              </Link>
            ) : (
              <p
                className="project-out__link project-out__link--next"
                aria-disabled="true"
              >
                <span className="visually-hidden">{pilotStory.way.next}</span>
                <LongArrow />
              </p>
            )}
          </Container>
        </nav>
      </main>

      {/* The grey lines on to the foot of the page. */}
      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}

/** VIEW ALL's thin arrow, up and to the right. */
function ProjectArrow() {
  return (
    <svg
      className="project-arrow"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 14 14 2M4.5 2H14v9.5" />
    </svg>
  );
}

/** A long thin arrow, back or on — the pages' Previous and Next draw the
 *  same. */
function LongArrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      className="project-out__arrow"
      viewBox="0 0 64 12"
      aria-hidden="true"
      focusable="false"
    >
      <path d={back ? "M63 6H1M7 1 1 6l6 5" : "M1 6h62M57 1l6 5-6 5"} />
    </svg>
  );
}
