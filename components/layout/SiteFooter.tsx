import Link from "next/link";
import { PixelArrow } from "../ui/PixelArrow";
import { Container } from "./Container";
import { SocialIcon } from "./SocialIcon";
import { contact, contactEmail, footer, menu } from "../../content/home";

/**
 * The columns down here: Services, Products, Company.
 *
 * Clients is left out, and by name rather than by a rule, because leaving it
 * out is a decision about this one entry and not a shape its data has. Its list
 * is the seven sectors, and a footer column of sector anchors is exactly what
 * came out of this file on 2026-08-09 — seven links that only ever scrolled the
 * homepage, in a column that made that more visible rather than less. The
 * header offers them on hover, where they cost a column nothing.
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
 * ── Rebuilt 2026-08-27, and then cut back to what was wanted ──
 *
 * Four arrangements in a day and the owner's last word settled it: no vertical
 * lines, no name spelled out at the foot, and the ring back where it was. The
 * purple panel all of this replaced is in `backup/2026-08-27-site-footer/`.
 *
 * So what is left is the plainest of the four, and deliberately: the mark, the
 * closing line and the way back up across the top; one band of small print —
 * three menus and the ways to reach us; the year and the three legal links. No
 * ornament at all. `FooterBars` is no longer imported here and the traced field
 * it draws is not on the page; the file stays, because the arrangement it was
 * traced for could be asked for again and the tracing is the expensive part.
 *
 * What the four passes leave behind, and what is worth keeping: the panel names
 * its two colours once (black, white ink, 20:1 against the 2.88:1 the lavender
 * carried), the paragraph under the closing line is gone, and the contact block
 * is three facts under one spoken heading rather than four labelled cells.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" id={contact.id}>
      <Container>
        <div className="site-footer__panel">
          {/* The one line that is an invitation rather than a list, and the way
              back up on the far edge. */}
          <div className="site-footer__lead">
            <div className="site-footer__lead-words">
              {/* The ring alone. It is the leftmost square of the supplied
                  wordmark — 163.92 of its 694.25 units — so the box crops to it
                  rather than carrying a second asset. */}
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

              <h2 className="site-footer__title">
                {contact.titleLines.map((line) => (
                  <span className="site-footer__title-line" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            <a
              className="site-footer__top-link"
              href="#main-content"
              aria-label="Back to top"
              data-scroll-direct
            >
              <PixelArrow
                className="site-footer__arrow site-footer__arrow--up"
                direction="up"
                size="small"
              />
            </a>
          </div>

          {/* Everything functional, in one band of small type: three menus and
              the ways to reach us, all on one row of columns. It is the utility
              of the page and it is set as utility. */}
          <div className="site-footer__columns">
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

            <dl className="site-footer__details">
              <div className="site-footer__detail">
                <dt className="site-footer__detail-label">
                  <span className="site-footer__detail-full">Contact</span>
                </dt>
                {footer.details.map((detail) => (
                  <dd className="site-footer__detail-value" key={detail.label}>
                    {detail.href ? (
                      <a className="site-footer__link" href={detail.href}>
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                ))}
                {/* Marks, not links: the accounts exist but their addresses
                    have not been given, and a guessed profile URL is worse
                    than a mark that waits for one. */}
                <dd className="site-footer__detail-value site-footer__social">
                  {footer.social.map((name) => (
                    <SocialIcon key={name} name={name} />
                  ))}
                </dd>
              </div>
            </dl>
          </div>

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
