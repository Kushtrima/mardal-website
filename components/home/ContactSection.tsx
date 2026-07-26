import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { Button } from "../ui/Button";
import { contact, contactEmail } from "../../content/home";

export function ContactSection() {
  const mailto = `mailto:${contactEmail}`;

  return (
    <section
      className="contact-section"
      id={contact.id}
      aria-labelledby="contact-title"
      data-route-section
    >
      <Container wide>
        <RevealGroup className="contact-inner" stagger={0.1}>
          <p className="section-label" data-reveal-item>
            {contact.eyebrow}
          </p>

          {/* Masked lines, so the page closes on the same gesture the hero
              opens with. */}
          <h2 className="contact-title" id="contact-title">
            {contact.titleLines.map((line) => (
              <span className="contact-title__mask" key={line}>
                <span data-reveal-item>{line}</span>
              </span>
            ))}
          </h2>

          <p className="section-lede contact-lede" data-reveal-item>
            {contact.body}
          </p>

          <div className="contact-actions" data-reveal-item>
            <Button href={mailto} size="large">
              {contact.cta}
            </Button>
            <a className="contact-email" href={mailto}>
              {contactEmail}
            </a>
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
