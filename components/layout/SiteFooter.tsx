import Link from "next/link";
import { Container } from "./Container";
import { contactEmail, footer } from "../../content/home";

/**
 * Two lines and a rule.
 *
 * The previous footer repeated nineteen links the header's menu already
 * carries, in four ruled columns, several of them pointing at sections that do
 * not exist. None of that is what a footer is for. What is left is the one
 * thing a visitor might actually want from the bottom of the page — a way to
 * reach Mardal — and the four places to go next.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container wide>
        <div className="site-footer__lead">
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

          <nav className="site-footer__nav" aria-label="Footer">
            {footer.sections.map((section) => (
              <a
                className="site-footer__link"
                href={section.href}
                key={section.href}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>

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
