import { Container } from "../layout/Container";
import { whyMardal } from "../../content/home";

/**
 * Why Mardal, rebuilt 2026-08-26 from a reference the owner sent.
 *
 * Four boxes, each a number, a short title, a lot of air and a plus mark in the
 * bottom corner. It was four animated isometric drawings with a label, a serif
 * title and a line of copy; owner: remove the animation icons and use these
 * titles. The previous section is kept whole in `backup/2026-08-26-why-mardal/`.
 *
 * **The number is the position, not a stored value.** A number in the content
 * can disagree with where its card sits, and `01` on the second box is the sort
 * of thing nobody notices until a client does. Padded to two digits because the
 * reference sets them that way and because `9` then `10` is a step in width the
 * eye reads as a wobble in the column.
 */
export function WhyMardal() {
  return (
    <section
      className="why-section"
      id="company"
      aria-labelledby="why-title"
      data-route-section
    >
      <Container>
        <div className="why-intro">
          <p className="why-label">
            {whyMardal.label}
          </p>
          <h2 className="why-title" id="why-title">
            {whyMardal.titleLines.map((line) => (
              <span className="why-title__line" key={line}>
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="why-grid">
          <p className="why-copy">
            {whyMardal.copy}
          </p>

          {whyMardal.cards.map((card, index) => (
            <article
              className={`why-card why-card--${card.position}`}
              key={card.position}
            >
              <p className="why-card__number">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h3 className="why-card__title">{card.title}</h3>

              {/* **Always here, and always readable.** The pointer reveals it;
                  it is never taken out of the accessible tree or out of the
                  layout to do that, so a screen reader has it at rest and the
                  card is the same height either way — a paragraph that arrives
                  by growing its box would push the row on every hover.

                  Where there is no pointer it simply shows: the rule that hides
                  it is inside `@media (hover: hover)`, so a phone gets the text
                  rather than a card with no way to open it. */}
              <p className="why-card__copy">{card.copy}</p>

              {/* The reference's corner mark, and it is a mark rather than a
                  control: nothing here opens, so it is hidden from the
                  accessible tree instead of being announced as something to
                  press. `card-plus` is the site's own plus — the product cards
                  carry it — sized up and filled here. It gives way to the copy
                  on hover, as it does in the reference. */}
              <span className="card-plus why-card__mark" aria-hidden="true" />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
