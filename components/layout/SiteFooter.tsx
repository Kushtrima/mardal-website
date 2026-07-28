import Link from "next/link";
import { Container } from "./Container";
import { RedactedLines } from "../home/RedactedLines";
import {
  contact,
  contactEmail,
  footer,
  products,
  services,
  solutions,
} from "../../content/home";

const columns = [
  { title: "Services", links: services.items },
  { title: "Solutions", links: solutions.items },
  { title: "Products", links: products.items },
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
 * Under that, the links: laid out on space rather than ruled into columns,
 * because the ruled version read as four boxes of links dressed up.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" id={contact.id}>
      <Container wide>
        <div className="site-footer__close">
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

          {/* The site's own motif, in the four brand colours: the half of the
              footer beside the closing line was empty white, and the bars are
              the one drawing this site owns. */}
          <RedactedLines className="site-footer__bars" />
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {columns.map((column) => (
            <div className="site-footer__column" key={column.title}>
              <h3 className="eyebrow site-footer__column-title">
                {column.title}
              </h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.id}>
                    <a className="site-footer__link" href={`#${link.id}`}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="site-footer__column">
            <h3 className="eyebrow site-footer__column-title">Company</h3>
            <ul>
              {footer.sections.map((link) => (
                <li key={link.href}>
                  <a className="site-footer__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="site-footer__meta">
          <Link
            className="site-footer__brand"
            href="/"
            aria-label="Mardal home"
          >
            {/* Supplied vector wordmark is already optimized and self-contained. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/SVG/logo.svg" alt="Mardal" width="694" height="164" />
          </Link>

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
      </Container>
    </footer>
  );
}
