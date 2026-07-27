import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { RedactedLines } from "./RedactedLines";
import { difference } from "../../content/home";

/** One tint per card, in the order the cards are read. */
const TINTS = ["one", "two", "three", "four"] as const;

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
          {difference.items.map((item, index) => (
            <li
              className={`difference-card difference-card--${TINTS[index % TINTS.length]}`}
              key={item.title}
              data-reveal-item
            >
              {/* The title sits on the colour, over the bars. */}
              <div className="difference-card__panel">
                <RedactedLines />
                <h3 className="difference-card__title">{item.title}</h3>
              </div>

              <p className="difference-card__copy">{item.copy}</p>
            </li>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
