import Link from "next/link";
import { Container } from "./Container";
import { FooterBars } from "./FooterBars";
import { contact, contactEmail, footer, menu } from "../../content/home";

/**
 * The site's menu, less Case Studies — the header still offers it, but its one
 * entry does not earn a column of its own down here.
 */
const groups = menu.filter((group) => group.key !== "case-studies");

/**
 * The footer closes the page rather than just ending it.
 *
 * The page has had no working call to action since the contact section came
 * off it — "Hire us" in the header and every Explore on the way down point at
 * an anchor that is not there, and the address at the very bottom was the only
 * way in. That section's words were written and approved and have been sitting
 * unused in the content file since; they close the page here.
 *
 * All of it sits on one panel traced from the reference: the accent colour,
 * the ring alone in the top corner, and the white bar field standing off the
 * bottom-right edge.
 *
 * The reference's panel is half as tall as it is wide and almost entirely
 * empty. To keep that shape while carrying this much, the bars and the words
 * share the bottom of the panel rather than queueing: the field owns the right
 * 58.4%, and the year and the way back up are held to the left of it.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" id={contact.id}>
      <Container wide>
        <div className="site-footer__panel">
          <FooterBars />

          <div className="site-footer__body-grid">
            <div className="site-footer__words">
              <h2 className="site-footer__title">
                {contact.titleLines.map((line) => (
                  <span className="site-footer__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h2>

              <p className="site-footer__body">{contact.body}</p>

              {/* The reference shows the ring alone. It is the leftmost square
                  of the supplied wordmark — 163.92 of its 694.25 units — so
                  the box crops to it rather than carrying a second asset. */}
              <Link
                className="site-footer__mark"
                href="/"
                aria-label="Mardal home"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/SVG/logo.svg"
                  alt="Mardal"
                  width="694"
                  height="164"
                />
              </Link>
          </div>

          <nav className="site-footer__nav" aria-label="Footer">
            {groups.map((group) => (
              <div className="site-footer__group" key={group.key}>
                <h3 className="eyebrow site-footer__group-title">
                  {group.label}
                </h3>

                <ul className="site-footer__links">
                  {group.items.map((link) => (
                    <li key={link.href}>
                      <a className="site-footer__link" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

          <div className="site-footer__meta">
            {/* Kept in this row rather than the one below it, so it sits above
                the bars instead of among them. */}
            <a className="site-footer__top-link" href="#main-content">
              Back to top
              <svg
                className="site-footer__arrow site-footer__arrow--up"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 20.5V4M5.5 10.5 12 4l6.5 6.5" />
              </svg>
            </a>
          </div>

          {/* Directly under the rule, and left of the bar field the same way
              the row below it is. */}
          <dl className="site-footer__details">
            {footer.details.map((detail) => (
              <div className="site-footer__detail" key={detail.label}>
                <dt className="site-footer__detail-label">{detail.label}</dt>
                <dd className="site-footer__detail-value">
                  {detail.href ? (
                    <a className="site-footer__link" href={detail.href}>
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}

            <div className="site-footer__detail">
              <dt className="site-footer__detail-label">
                {footer.socialLabel}
              </dt>
              {/* Names, not links: there are no accounts to point at yet, and a
                  link that goes nowhere is worse than one that is not there. */}
              <dd className="site-footer__detail-value site-footer__social">
                {footer.social.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </dd>
            </div>
          </dl>

          {/* The foot of the panel, held to the left of the bar field. */}
          <div className="site-footer__legal">
            <span className="site-footer__copy">
              {`© ${new Date().getFullYear()} Mardal`}
            </span>

            {footer.legal.map((link) => (
              <a
                className="site-footer__link"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
