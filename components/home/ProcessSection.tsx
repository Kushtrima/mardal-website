import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { workProcess } from "../../content/home";

export function ProcessSection() {
  return (
    <section
      className="process-section"
      id={workProcess.id}
      aria-labelledby="process-title"
      data-route-section
    >
      <Container wide>
        <RevealGroup className="process-intro" stagger={0.12}>
          <p className="section-label" data-reveal-item>
            {workProcess.eyebrow}
          </p>
          <h2
            className="section-title process-title"
            id="process-title"
            data-reveal-item
          >
            {workProcess.title}
          </h2>
          <p className="section-lede process-lede" data-reveal-item>
            {workProcess.summary}
          </p>
        </RevealGroup>

        <RevealGroup className="process-track" stagger={0.14}>
          <span
            className="process-track__line"
            aria-hidden="true"
            data-reveal-line
          />

          <ol className="process-steps">
            {workProcess.steps.map((step, index) => (
              <li className="process-step" key={step.title} data-reveal-item>
                <span className="process-step__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__copy">{step.description}</p>
              </li>
            ))}
          </ol>
        </RevealGroup>
      </Container>
    </section>
  );
}
