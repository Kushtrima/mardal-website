import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { RedactedLines } from "./RedactedLines";
import { difference } from "../../content/home";

/**
 * Four tints across five boxes. The second row starts one colour further on,
 * so no box touches another of its own colour, beside it or above it. The
 * sixth cell of the grid is left empty.
 */
const TINTS = ["one", "two", "three", "four", "one"] as const;

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

        {/* The first column is left empty so the two paragraphs sit over the
            second and third box. */}
        <RevealGroup
          className="difference-intro"
          preset="upSmall"
          stagger={0.1}
        >
          {difference.intro.map((paragraph) => (
            <p className="difference-intro__text" key={paragraph} data-reveal-item>
              {paragraph}
            </p>
          ))}
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
              id={item.id}
              key={item.id}
              data-reveal-item
            >
              {/* The title sits on the colour, over the bars, set on the two
                  lines the content gives it rather than wherever it wraps. */}
              <div className="difference-card__panel">
                <RedactedLines />
                {/* A dash in the corner that closes into a cross on hover. */}
                <span className="difference-card__toggle" aria-hidden="true" />
                <h3 className="difference-card__title">
                  {item.lines.map((line) => (
                    <span className="difference-card__title-line" key={line}>
                      {line}
                    </span>
                  ))}
                </h3>
              </div>
            </li>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
