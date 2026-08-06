import { Container } from "../layout/Container";
import { fusion } from "../../content/home";

/**
 * Artificial Intelligence + Human Creativity.
 *
 * The plus is drawn in CSS rather than typed. A "+" glyph belongs to whichever
 * face is set and would arrive at that face's own weight and optical size,
 * which is not the mark this composition wants: it is a rule of the heading's
 * own height standing between the two halves. Drawn, it is square by
 * construction and scales with the type.
 *
 * That leaves nothing for a screen reader to read at the join, so the heading
 * carries its own spoken name and the mark is hidden from the tree.
 */
export function FusionSection() {
  return (
    <section
      className="fusion-section"
      id="approach"
      aria-labelledby="fusion-title"
      data-route-section
    >
      <Container>
        <h2 className="fusion-title" id="fusion-title" aria-label={fusion.spoken}>
          <span className="fusion-title__half">
            {fusion.left.map((line) => (
              <span className="fusion-title__line" key={line}>
                {line}
              </span>
            ))}
          </span>

          <span className="fusion-plus" aria-hidden="true" />

          <span className="fusion-title__half">
            {fusion.right.map((line) => (
              <span className="fusion-title__line" key={line}>
                {line}
              </span>
            ))}
          </span>
        </h2>

        <p className="fusion-copy">{fusion.copy}</p>
      </Container>
    </section>
  );
}
