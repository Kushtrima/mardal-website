import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { IsometricArt } from "../ui/IsometricArt";
import { solutions } from "../../content/home";

export function SolutionsStrip() {
  return (
    <section
      className="solutions-section"
      id={solutions.id}
      aria-labelledby="solutions-title"
      data-route-section
    >
      <Container wide>
        <RevealGroup className="solutions-intro" stagger={0.12}>
          <p className="section-label" data-reveal-item>
            {solutions.eyebrow}
          </p>
          <h2
            className="section-title solutions-title"
            id="solutions-title"
            data-reveal-item
          >
            {solutions.title}
          </h2>
        </RevealGroup>

        <RevealGroup
          as="ul"
          className="solutions-strip"
          preset="upSmall"
          stagger={0.07}
        >
          {solutions.items.map((industry, index) => (
            <li
              className="solution-cell"
              id={industry.id}
              key={industry.id}
              data-reveal-item
            >
              {/* A mark, not an illustration: it sets the rhythm across the
                  band, so it is hidden from assistive technology. */}
              <span className="solution-cell__mark" aria-hidden="true">
                <IsometricArt scene="sector-mark" phase={index} />
              </span>

              <h3 className="solution-cell__name">{industry.title}</h3>
              <p className="solution-cell__descriptor">{industry.descriptor}</p>
            </li>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
