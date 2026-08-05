import type { Metadata } from "next";
import { Container } from "../../../components/layout/Container";
import { SiteHeader } from "../../../components/layout/SiteHeader";
import { ServicePageEntry } from "../../../components/services/ServicePageEntry";
import { PixelArrow } from "../../../components/ui/PixelArrow";
import { webPlatformsApps } from "../../../content/web-platforms-apps";
import { products } from "../../../content/home";

export const metadata: Metadata = {
  title: webPlatformsApps.title,
  description: webPlatformsApps.description,
};

export default function WebPlatformsAppsPage() {
  return (
    <>
      <ServicePageEntry />

      <main
        className="service-page service-page--web-platforms-apps"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section
          className="service-hero"
          aria-labelledby="web-platforms-apps-title"
          data-service-hero
        >
          <Container className="service-hero__inner">
            <div className="service-hero__intro">
              <h1
                className="service-hero__title"
                id="web-platforms-apps-title"
                data-service-hero-title
              >
                {webPlatformsApps.heroTitleLines.map((line) => (
                  <span className="service-hero__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div
              className="service-hero__pattern service-hero__pattern--web-platforms-apps"
              aria-hidden="true"
              data-service-hero-pattern
            />

            <p className="service-hero__support" data-service-hero-support>
              {webPlatformsApps.support}
            </p>

            <a
              className="service-hero__cta"
              href={products.ctaHref}
              data-service-hero-cta
            >
              {webPlatformsApps.heroCta}
              <PixelArrow
                className="service-hero__cta-arrow"
                direction="up-right"
                size="small"
              />
            </a>
          </Container>
        </section>
      </main>
    </>
  );
}
