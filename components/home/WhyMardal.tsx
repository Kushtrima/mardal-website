import { Container } from "../layout/Container";
import { whyMardal } from "../../content/home";
import { AnimatedIpoImage } from "./AnimatedIpoImage";
import { AnimatedRecommendationsImage } from "./AnimatedRecommendationsImage";
import { AnimatedRecurringImage } from "./AnimatedRecurringImage";
import { AnimatedSupportImage } from "./AnimatedSupportImage";

const artwork = {
  columns: AnimatedIpoImage,
  cycle: AnimatedRecurringImage,
  handoff: AnimatedRecommendationsImage,
  orbit: AnimatedSupportImage,
} as const;

export function WhyMardal() {
  return (
    <section
      className="why-section"
      id="company"
      aria-labelledby="why-title"
      data-route-section
    >
      <Container wide>
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

          {whyMardal.cards.map((card) => {
            const Art = artwork[card.art];

            return (
              <article
                className={`why-card why-card--${card.position}`}
                key={card.position}
              >
                <div className="why-card__art">
                  <Art />
                </div>

                {/* Held in the corner rather than in the flow, so the drawing
                    can take the card's full width. */}
                <p className="why-card__label">{card.label}</p>

                <h3 className="why-card__title">{card.title}</h3>
                <p className="why-card__copy">{card.copy}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
