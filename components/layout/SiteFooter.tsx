import Link from "next/link";
import { Container } from "./Container";
import {
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
 * The last thing the page says, set in the page's own vocabulary: the closing
 * line at the header size rather than buried as small print, the four link
 * groups ruled into columns the way the products are, and one arrow link —
 * the same one the industries and the products use.
 *
 * The address is given its own line because it is the only route to Mardal
 * that works: every other way in points at a section that is not built yet.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container wide>
        <div className="site-footer__lead">
          <p className="site-footer__statement">{footer.statement}</p>

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
          {columns.map((column) => (
            <div className="site-footer__column" key={column.title}>
              <h2 className="eyebrow site-footer__column-title">
                {column.title}
              </h2>
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
            <h2 className="eyebrow site-footer__column-title">Company</h2>
            <ul>
              {footer.company.map((link) => (
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
