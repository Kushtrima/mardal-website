import Link from "next/link";
import { Container } from "./Container";
import { FooterReveal } from "./FooterReveal";
import { SocialIcon } from "./SocialIcon";
import { RollingLabel } from "../ui/RollingLabel";
import { contact, footer, menu } from "../../content/home";

/** The services, the one menu group with pages of its own behind every entry. */
const services = menu.find((group) => group.key === "services");

/**
 * The footer closes the page rather than just ending it.
 *
 * ── Redesigned 2026-10-05, to the owner's reference ──
 *
 * After a white version ("to cheap"), a black one, and two goes at its links,
 * the owner sent a reference: "try this version maybe you can addapt with our
 * information also the logo without icon". So, as it is drawn there, on the
 * page's own grid: white, black ink, one size of type.
 *
 *   - three lists from the second rule — Menu (the pages that are there),
 *     Services, and Contact — each a heading over its lines
 *   - the wordmark, without the ring, from the second rule to the edge of the
 *     page, at the size of the page
 *   - one line under it: the year on the first rule, the legal links on the
 *     next three, and the way back up at the far end
 *
 * The 2026-08-27 panel is in `backup/2026-08-27-site-footer/`.
 */
/**
 * `ruled`: the homepage's hairlines run on through the footer to the foot of
 * the page (owner, 2026-10-05: "all the way down"). Only the homepage asks for
 * them; every other page's footer stays plain.
 */
export function SiteFooter({ ruled = false }: { ruled?: boolean } = {}) {
  return (
    <footer
      className="site-footer"
      id={contact.id}
      data-ruled={ruled ? true : undefined}
      data-footer
    >
      <FooterReveal />

      <Container className="site-footer__layout">
        <div className="site-footer__columns" data-footer-fade>
          <nav className="site-footer__group" aria-labelledby="footer-group-pages">
            <h2 className="site-footer__group-title" id="footer-group-pages">
              {footer.pagesTitle}
            </h2>
            <ul className="site-footer__links">
              {footer.pages.map((link) => (
                <li key={link.href}>
                  <a className="site-footer__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {services ? (
            <nav
              className="site-footer__group"
              aria-labelledby="footer-group-services"
            >
              <h2 className="site-footer__group-title" id="footer-group-services">
                {services.label}
              </h2>
              <ul className="site-footer__links">
                {services.items.map((link) => (
                  <li key={link.href}>
                    <a className="site-footer__link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="site-footer__detail">
            <h2 className="site-footer__group-title">Contact</h2>
            <ul className="site-footer__links">
              {footer.details.map((detail) => (
                <li className="site-footer__detail-value" key={detail.label}>
                  {detail.href ? (
                    <a className="site-footer__link" href={detail.href}>
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </li>
              ))}
              {/* Marks, not links: the accounts exist but their addresses
                  have not been given, and a guessed profile URL is worse
                  than a mark that waits for one. */}
              <li className="site-footer__social">
                {footer.social.map((name) => (
                  <SocialIcon key={name} name={name} />
                ))}
              </li>
            </ul>
          </div>
        </div>

        {/* The wordmark without the ring, the width of the page from the
            second rule, rising out of its line on arrival. */}
        <div className="site-footer__brand-mask">
          <Link
            className="site-footer__brand"
            href="/"
            aria-label="Mardal home"
            data-footer-brand
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/SVG/logo-wordmark.svg" alt="" width="481" height="91" />
          </Link>
        </div>

        {/* The year, the legal links, and the way back up. */}
        <div className="site-footer__legal" data-footer-fade>
          <span className="site-footer__copy">
            {`© ${new Date().getFullYear()} Mardal`}
          </span>

          {footer.legal.map((link) => (
            <a className="site-footer__link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}

          <a
            className="site-footer__top-link"
            href="#main-content"
            data-scroll-direct
            data-roll
          >
            <RollingLabel>{footer.backToTop}</RollingLabel>
            {/* VIEW ALL's thin arrow, turned to point up; still while the
                word rolls. */}
            <svg
              className="site-footer__arrow"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M8 14.5V2M2.5 7.5 8 2l5.5 5.5" />
            </svg>
          </a>
        </div>
      </Container>
    </footer>
  );
}
