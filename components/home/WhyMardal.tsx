import { Container } from "../layout/Container";
import { AnimatedIpoImage } from "./AnimatedIpoImage";
import { AnimatedRecommendationsImage } from "./AnimatedRecommendationsImage";
import { AnimatedRecurringImage } from "./AnimatedRecurringImage";
import { AnimatedSupportImage } from "./AnimatedSupportImage";

const cards = [
  {
    position: "one",
    label: "IPO Access",
    title: "Be one of the first public investors",
  },
  {
    position: "two",
    label: "Recurring Investment",
    title: "Invest automatically",
  },
  {
    position: "three",
    label: "24/7 Support",
    title: "Here for you any time",
  },
  {
    position: "four",
    label: "Recommendations",
    title: "Get help with your first trade",
  },
] as const;

export function WhyMardal() {
  return (
    <section className="why-section" id="company" aria-labelledby="why-title">
      <Container wide>
        <div className="why-intro">
          <p className="why-label">Why Mardal?</p>
          <h2 className="why-title" id="why-title">
            Ship smarter software
            <br />
            with enterprise AI
          </h2>
        </div>

        <div className="why-grid">
          <p className="why-copy">
            We build intelligent solutions that combine AI and automation, CRM
            systems, custom software, and scalable web platforms to streamline
            operations and support business growth.
          </p>

          {cards.map((card) => (
            <article
              className={`why-card why-card--${card.position}`}
              key={card.position}
            >
              <div className="why-card__header">
                <p className="why-card__label">{card.label}</p>
                <span className="why-card__plus" aria-hidden="true" />
              </div>

              <h3 className="why-card__title">{card.title}</h3>

              <div className="why-card__art">
                {card.position === "one" ? (
                  <AnimatedIpoImage />
                ) : card.position === "two" ? (
                  <AnimatedRecurringImage />
                ) : card.position === "three" ? (
                  <AnimatedSupportImage />
                ) : (
                  <AnimatedRecommendationsImage />
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
