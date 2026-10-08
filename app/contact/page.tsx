import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { LetterForm } from "../../components/contact/LetterForm";
import { contactPage } from "../../content/contact";
import { ServicesFooterRules } from "../../components/services/ServicesFooterRules";

export const metadata: Metadata = {
  title: contactPage.title,
  description: contactPage.description,
};

/**
 * Contact.
 *
 * The question and its sentence on top, and under them, on the right half, a
 * letter to write in — its words set as the page's paragraph, its blanks drawn
 * as the site's redaction bars with the display face inside them. See
 * `LetterForm`.
 *
 * **Nothing else.** The email, phone and address came off on the owner's word:
 * the footer under the page carries all three.
 *
 * **No hero in front of it.** Every other page here opens on a full-screen
 * heading, and on this one that screen would stand between a reader who has
 * already decided to get in touch and the letter. The role page is the
 * precedent: its opening IS the content.
 *
 * The question arrives the way the other pages' openings do — ServicePageEntry
 * animates whatever carries its hooks — and the letter's blanks draw themselves
 * in a beat later.
 */
export default function ContactPage() {
  return (
    <>
      <ServicePageEntry />

      <main
        className="service-page service-page--contact"
        id="main-content"
        data-service-page
      >
        {/* The page's five lines, grey, from its top to its foot — owner,
            2026-10-08: "add the vertical lines to the rest of the pages". */}
        <ServicesFooterRules />
        <HeaderSpace />

        <section
          className="contact"
          aria-labelledby="contact-title"
          data-service-hero
        >
          <Container className="contact__inner">
            <div className="contact__intro">
              <h1
                className="contact__title"
                id="contact-title"
                data-service-hero-title
              >
                {/* A real space between the lines, so the heading reads as one
                    sentence to anything that joins its text. */}
                {contactPage.titleLines.map((line, index) => (
                  <span className="contact__title-line" key={line}>
                    {index > 0 ? " " : null}
                    {line}
                  </span>
                ))}
              </h1>

              <p className="contact__lede" data-service-hero-support>
                {contactPage.lede}
              </p>
            </div>

            <div className="contact__panel">
              <LetterForm />
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}
