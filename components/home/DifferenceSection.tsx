import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { difference } from "../../content/home";

export function DifferenceSection() {
  return (
    <section
      className="difference-section"
      id={difference.id}
      aria-labelledby="difference-title"
      data-route-section
    >
      <Container wide>
        <RevealGroup stagger={0.12}>
          <h2
            className="display-heading difference-title"
            id="difference-title"
            data-reveal-item
          >
            {difference.titleLines.map((line) => (
              <span className="difference-title__line" key={line}>
                {line}
              </span>
            ))}
          </h2>
        </RevealGroup>

        <RevealGroup
          as="ul"
          className="difference-grid"
          preset="upSmall"
          stagger={0.09}
        >
          {difference.items.map((item) => (
            <li className="difference-item" key={item.title} data-reveal-item>
              <h3 className="difference-item__title">{item.title}</h3>
              <p className="difference-item__copy">{item.copy}</p>
            </li>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
