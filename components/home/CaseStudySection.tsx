import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { IsometricArt } from "../ui/IsometricArt";
import { caseStudy } from "../../content/home";

export function CaseStudySection() {
  return (
    <section
      className="case-section"
      id={caseStudy.id}
      aria-labelledby="case-title"
      data-route-section
    >
      {/* The menu links to the project itself as well as to the section. */}
      <span className="anchor-target" id={caseStudy.anchor} aria-hidden="true" />

      <Container wide>
        <RevealGroup className="case-layout" stagger={0.09}>
          <div className="case-intro">
            <p className="section-label" data-reveal-item>
              {caseStudy.eyebrow}
            </p>
            <h2
              className="section-title case-title"
              id="case-title"
              data-reveal-item
            >
              {caseStudy.title}
            </h2>
            <p className="section-lede case-lede" data-reveal-item>
              {caseStudy.body}
            </p>
            <p className="case-status" data-reveal-item>
              {caseStudy.chip}
            </p>
          </div>

          <div className="case-visual" data-reveal-item>
            <IsometricArt scene="case-study" />
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
