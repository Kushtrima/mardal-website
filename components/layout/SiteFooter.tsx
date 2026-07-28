import Link from "next/link";
import { Container } from "./Container";
import { FooterBars } from "./FooterBars";
import {
  contact,
  contactEmail,
  footer,
  products,
  services,
  solutions,
} from "../../content/home";

const groups = [
  {
    title: "Services",
    links: services.items.map((item) => ({
      label: item.title,
      href: `#${item.id}`,
    })),
  },
  {
    title: "Solutions",
    links: solutions.items.map((item) => ({
      label: item.title,
      href: `#${item.id}`,
    })),
  },
  {
    title: "Products",
    links: products.items.map((item) => ({
      label: item.title,
      href: `#${item.id}`,
    })),
  },
  { title: "Company", links: footer.sections },
] as const;

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

          {/* The reference shows the ring alone. It is the leftmost square of
              the supplied wordmark — 163.92 of its 694.25 units — so the box
              crops to that rather than carrying a second asset. */}
          <Link className="site-footer__mark" href="/" aria-label="Mardal home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/SVG/logo.svg" alt="Mardal" width="694" height="164" />
          </Link>

          <div className="site-footer__body-grid">
          <div className="site-footer__words">
            <p className="section-label">{contact.eyebrow}</p>

            <h2 className="site-footer__title">
              {contact.titleLines.map((line) => (
                <span className="site-footer__title-line" key={line}>
                  {line}
                </span>
              ))}
            </h2>

            <p className="site-footer__body">{contact.body}</p>

            <a className="site-footer__email" href={`mailto:${contactEmail}`}>
              {contactEmail}
              <svg
                className="site-footer__arrow"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3.5 12h16.5M13.5 5.5 20 12l-6.5 6.5" />
              </svg>
            </a>
          </div>

          <nav className="site-footer__nav" aria-label="Footer">
            {groups.map((group) => (
              <div className="site-footer__group" key={group.title}>
                <h3 className="eyebrow site-footer__group-title">
                  {group.title}
                </h3>

                <ul className="site-footer__links">
                  {group.links.map((link) => (
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
          <span className="site-footer__copy">
            {`© ${new Date().getFullYear()} Mardal`}
          </span>

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
        </div>
      </Container>
    </footer>
  );
}
