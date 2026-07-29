import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { IsometricArt } from "../ui/IsometricArt";
import { services } from "../../content/home";

export function ServicesSection() {
  return (
    <section
      className="services-section"
      id={services.id}
      aria-labelledby="services-title"
      data-route-section
    >
      <Container>
        <RevealGroup className="services-intro" stagger={0.12}>
          <p className="section-label" data-reveal-item>
            {services.eyebrow}
          </p>
          <h2
            className="section-title services-title"
            id="services-title"
            data-reveal-item
          >
            {services.title}
          </h2>
        </RevealGroup>

        <RevealGroup className="services-grid" preset="card" stagger={0.09}>
          {services.items.map((service) => (
            <article
              className="service-tile"
              id={service.id}
              key={service.id}
              data-reveal-item
            >
              <h3 className="service-tile__title">{service.title}</h3>
              <p className="service-tile__copy">{service.description}</p>

              <div className="service-tile__art">
                <IsometricArt scene={service.id} />
              </div>
            </article>
          ))}

          {/* Sits in the sixth cell, mirroring the Why Mardal grid where the
              copy takes a cell of its own. */}
          <p className="section-lede services-lede" data-reveal-item>
            {services.summary}
          </p>
        </RevealGroup>
      </Container>
    </section>
  );
}
