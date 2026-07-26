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

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container wide>
        <div className="site-footer__top">
          <div className="site-footer__intro">
            <Link
              className="site-footer__brand"
              href="/"
              aria-label="Mardal home"
            >
              {/* Supplied vector wordmark is already optimized and self-contained. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/SVG/logo.svg" alt="Mardal" width="694" height="164" />
            </Link>

            <p className="site-footer__statement">{footer.statement}</p>

            <a className="site-footer__email" href={`mailto:${contactEmail}`}>
              {contactEmail}
              <span aria-hidden="true">→</span>
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
        </div>

        <div className="site-footer__meta">
          <span>{`© ${new Date().getFullYear()} Mardal`}</span>
          <a className="site-footer__top-link" href="#main-content">
            Back to top
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
