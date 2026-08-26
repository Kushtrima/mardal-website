import { Container } from "../layout/Container";
import { fusion } from "../../content/home";
import { FusionReveal } from "./FusionReveal";

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
 *
 * **The mark is two spans rather than two pseudo-elements**, since 2026-08-26:
 * `FusionReveal` draws it one stroke at a time as the section is scrolled, and a
 * tween cannot reach a `::before`. Nothing about how it looks changed.
 */
export function FusionSection() {
  return (
    <section
      className="fusion-section"
      id="approach"
      aria-labelledby="fusion-title"
      data-route-section
      data-fusion
      /* **It declines the site's section entrance.** A block that holds itself
         in place cannot also be arriving: a pin is measured while its ancestor's
         lag is still applied and then rests exactly that far out. SectionEnter
         reads this off the section when it finds no inner block to move. */
      data-enter-mode="none"
    >
      <FusionReveal />

      <Container className="fusion-container">
        <h2 className="fusion-title" id="fusion-title" aria-label={fusion.spoken}>
          <span className="fusion-title__half" data-fusion-half="left">
            {fusion.left.map((line) => (
              <span className="fusion-title__line" key={line}>
                {line}
              </span>
            ))}
          </span>

          {/* Drawn rather than typed, and now drawn a stroke at a time. The two
              spans exist so each can be animated; a `::before` cannot be
              tweened. */}
          <span className="fusion-plus" aria-hidden="true" data-fusion-plus>
            <span
              className="fusion-plus__stroke fusion-plus__stroke--up"
              data-fusion-up
            />
            <span
              className="fusion-plus__stroke fusion-plus__stroke--across"
              data-fusion-across
            />
          </span>

          <span className="fusion-title__half" data-fusion-half="right">
            {fusion.right.map((line) => (
              <span className="fusion-title__line" key={line}>
                {line}
              </span>
            ))}
          </span>
        </h2>

        <p className="fusion-copy" data-fusion-copy>{fusion.copy}</p>
      </Container>
    </section>
  );
}
