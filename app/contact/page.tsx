import type { Metadata } from "next";
import { Container } from "../../components/layout/Container";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { ServicePageEntry } from "../../components/services/ServicePageEntry";
import { LetterForm } from "../../components/contact/LetterForm";
import { contactPage } from "../../content/contact";

export const metadata: Metadata = {
  title: contactPage.title,
  description: contactPage.description,
};

/**
 * Contact.
 *
 * One screen: the question, a sentence and the three ways to reach Mardal on
 * the left — the column the owner kept through every version — and on the right
 * a letter to write in, its blanks drawn as the site's redaction bars. See
 * `LetterForm`.
 *
 * **No hero in front of it.** Every other page here opens on a full-screen
 * heading, and on this one that screen would stand between a reader who has
 * already decided to get in touch and the ways to do it. The role page is the
 * precedent: its opening IS the content.
 *
 * The left column arrives the way the other pages do — ServicePageEntry
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

              {/* Before the letter in the document, so on a phone the number
                  and the address come first — for a lot of readers they are
                  the whole reason for the visit. */}
              <dl className="contact__details" data-service-hero-cta>
                {contactPage.details.map((detail) => (
                  <div className="contact__detail" key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>
                      {detail.href ? (
                        <a href={detail.href}>{detail.value}</a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="contact__panel">
              <LetterForm />
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
