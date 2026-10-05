"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_MENU } from "../../lib/breakpoints";
import { HEADER_AT_REST, nextHeaderState } from "../../lib/header-reveal";
import { PixelArrow } from "../ui/PixelArrow";
import { RollingLabel } from "../ui/RollingLabel";
import { Container } from "./Container";
import { brandPlace, footer, menu, menuButton } from "../../content/home";

/**
 * The bar and the menu.
 *
 * **One menu, behind one burger, at every width — owner, 2026-10-03:** "i dont
 * like it i want BIG MENU so Only BURGER menu". The bar is the wordmark and the
 * burger and nothing else. The menu is the sheet the phone already had, grown
 * into the whole screen on a wide window: the four words set big down the left,
 * the list of whichever one you are on to the right of them. Its class names
 * still say `mobile-menu`, after where it began.
 *
 * What it replaced — the words in the bar and a white sheet down the right — is
 * in backup/2026-10-03-site-header/, with how to put it back.
 */

/**
 * The two lines the sheet carries at its foot, in the order the owner asked for
 * them: the street, then the number.
 *
 * Picked out of `footer.details` by label rather than retyped. The phone and the
 * address are written once, in content/home.ts, and the day one of them changes
 * the sheet must not be the place still saying the old one.
 */
const SHEET_CONTACT = ["Address", "Phone"].flatMap((label) =>
  footer.details.filter((detail) => detail.label === label),
);

type NavigationKey = (typeof menu)[number]["key"];

type MenuLink = { readonly label: string; readonly href: string };
type MenuGroup = {
  readonly label: string;
  readonly items: readonly MenuLink[];
};

/**
 * The halves an entry's list is split into, or null for a list that is one.
 * Services is the only entry with groups — Development and Creative, owner,
 * 2026-10-03 — and the menu sets a heading over each half.
 */
function groupsOf(entry: (typeof menu)[number]): readonly MenuGroup[] | null {
  return "groups" in entry ? entry.groups : null;
}

/** The list a wide menu opens on, so its right-hand side is never empty. */
const FIRST_LIST: NavigationKey = "services";

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  /* Whether the menu was already open the last time the motion ran, so a
     change of list is not played as an arrival. */
  const wasOpenRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /* The list being read: on a phone, null is the four words and a key is that
     word's list sliding over them; on a wide window both are on screen, and
     this is which list stands to the right of the words. */
  const [activeMenu, setActiveMenu] = useState<NavigationKey | null>(null);
  /* The list rendered in the detail. It lags `activeMenu` on a phone, so the
     list does not empty while it is sliding away. */
  const [displayMenu, setDisplayMenu] = useState<NavigationKey>(FIRST_LIST);
  /* Which arrangement the stylesheet is drawing. False on the server and on
     the first paint, which is also the phone's — see the effect that sets it. */
  const [wide, setWide] = useState(false);

  const displayItem =
    menu.find((item) => item.key === displayMenu) ?? menu[0];
  const displayGroups = groupsOf(displayItem);

  function closeMenu() {
    setMenuOpen(false);
    setActiveMenu(null);
  }

  function showList(key: NavigationKey) {
    setDisplayMenu(key);
    setActiveMenu(key);
  }

  function detailLink(link: MenuLink) {
    const isCurrent = link.href.startsWith("/") && pathname === link.href;

    return (
      <li key={link.label} data-mobile-detail-entry>
        <a
          className={`mobile-menu__detail-link${isCurrent ? " is-current" : ""}`}
          href={link.href}
          aria-current={isCurrent ? "page" : undefined}
          onClick={closeMenu}
        >
          <span>{link.label}</span>
        </a>
      </li>
    );
  }

  /**
   * The two arrangements, and the motion inside each.
   *
   * On a phone the words and a list take turns: choosing a word slides the
   * words out and its list in, and Back reverses it. On a wide window both
   * stand at once, so choosing a word only brings its list up on the right.
   * The sheet itself fades in by CSS; this moves what is on it.
   */
  useLayoutEffect(() => {
    const index = indexRef.current;
    const detail = detailRef.current;
    if (!index || !detail) return;

    const indexEntries = index.querySelectorAll<HTMLElement>(
      "[data-mobile-menu-entry]",
    );
    const detailEntries = detail.querySelectorAll<HTMLElement>(
      "[data-mobile-detail-entry]",
    );
    /* The words themselves, each inside a mask the height of its line, and
       what follows them: the counts, the way in, the foot. */
    const words = index.querySelectorAll<HTMLElement>("[data-menu-word]");
    const counts = index.querySelectorAll<HTMLElement>(".mobile-menu__count");
    const wayIn = index.querySelectorAll<HTMLElement>(".mobile-menu__cta-row");
    const foot = footRef.current;
    const targets = [
      index,
      detail,
      ...indexEntries,
      ...detailEntries,
      ...words,
      ...counts,
      ...(foot ? [foot] : []),
    ];
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = menuOpen;

    gsap.killTweensOf(targets);
    if (!menuOpen) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (wide) {
      /* Nothing slides here, so whatever a phone left on the two columns —
         an offset, a fade — is cleared before anything else is said. */
      gsap.set([index, detail], { clearProps: "all" });

      if (reducedMotion) {
        gsap.set([...indexEntries, ...detailEntries, ...counts], {
          autoAlpha: 1,
          y: 0,
        });
        gsap.set(words, { yPercent: 0 });
        if (foot) gsap.set(foot, { autoAlpha: 1, y: 0 });
        return;
      }

      if (!wasOpen) {
        /* The arrival, in reading order. The words rise out of their own line,
           one close behind the next, while the blind is still coming down; the
           counts, the way in and the foot follow once the words can be read.
           Each word is masked, so it is uncovered where it stands rather than
           floating in from somewhere else. */
        gsap.set(indexEntries, { autoAlpha: 1, y: 0 });
        gsap.fromTo(
          words,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            delay: 0.12,
          },
        );
        gsap.fromTo(
          counts,
          { autoAlpha: 0, y: 6 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
            delay: 0.55,
          },
        );
        gsap.fromTo(
          wayIn,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.5 },
        );
        if (foot) {
          gsap.fromTo(
            foot,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.6 },
          );
        }
      }

      /* The list comes up into the column on every change, quick enough that
         reading across the words is not a queue. */
      gsap.fromTo(
        detailEntries,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.03,
          delay: wasOpen ? 0 : 0.3,
        },
      );
      return;
    }

    if (reducedMotion) {
      gsap.set(index, {
        autoAlpha: activeMenu ? 0 : 1,
        pointerEvents: activeMenu ? "none" : "auto",
        xPercent: 0,
      });
      gsap.set(detail, {
        autoAlpha: activeMenu ? 1 : 0,
        pointerEvents: activeMenu ? "auto" : "none",
        xPercent: 0,
      });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    if (activeMenu) {
      gsap.set(detail, { pointerEvents: "auto", visibility: "visible" });
      timeline.to(
        index,
        { autoAlpha: 0, duration: 0.36, pointerEvents: "none", xPercent: -14 },
        0,
      );
      timeline.fromTo(
        detail,
        { autoAlpha: 0, xPercent: 18 },
        { autoAlpha: 1, duration: 0.48, xPercent: 0 },
        0.06,
      );
      timeline.fromTo(
        detailEntries,
        { autoAlpha: 0, x: 18 },
        {
          autoAlpha: 1,
          duration: 0.42,
          ease: "power3.out",
          stagger: 0.035,
          x: 0,
        },
        0.17,
      );
    } else {
      gsap.set(index, { pointerEvents: "auto", visibility: "visible" });
      timeline.to(
        detail,
        { autoAlpha: 0, duration: 0.34, pointerEvents: "none", xPercent: 18 },
        0,
      );
      timeline.fromTo(
        index,
        { autoAlpha: 0, xPercent: -10 },
        { autoAlpha: 1, duration: 0.46, xPercent: 0 },
        0.04,
      );
      timeline.fromTo(
        indexEntries,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.04,
          y: 0,
        },
        0.12,
      );
      /* The same rise out of the line the wide menu has, at a phone's pace. */
      timeline.fromTo(
        words,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.05 },
        0.12,
      );
      if (foot) gsap.set(foot, { clearProps: "opacity,visibility,transform" });
    }

    return () => {
      timeline.kill();
      gsap.killTweensOf(targets);
    };
  }, [activeMenu, displayMenu, menuOpen, wide]);

  /**
   * Which arrangement, asked of the stylesheet's own query rather than a second
   * one — see lib/breakpoints.ts for why a complement cannot be written exactly.
   *
   * Answered on every change, not once: a window widened past the line while
   * the menu is open has to stop being a phone's menu there and then. Crossing
   * it puts the menu on its starting list for the side it lands on — the four
   * words on a phone, the first list beside them on a wide window — rather than
   * leaving it half in the other arrangement.
   */
  useEffect(() => {
    const phone = window.matchMedia(MOBILE_MENU);

    function sync() {
      const isWide = !phone.matches;
      setWide(isWide);
      setDisplayMenu(FIRST_LIST);
      setActiveMenu(isWide ? FIRST_LIST : null);
    }

    sync();
    phone.addEventListener("change", sync);

    return () => {
      phone.removeEventListener("change", sync);
    };
  }, []);

  /**
   * While it is open the page underneath holds still: the body is locked, and
   * the smoother — which takes the wheel itself, so a locked body alone does not
   * stop it — is paused. Escape closes it and hands focus back to the burger.
   */
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setActiveMenu(null);
      toggleRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      smoother?.paused(false);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  /**
   * The bar's own opening, from the old homepage hero's first beat.
   * `gsap.from`, so a reader whose JavaScript never arrives still has a bar.
   */
  useLayoutEffect(() => {
    if (!navigationRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = gsap.from(navigationRef.current, {
      autoAlpha: 0,
      duration: 0.75,
      ease: "power3.out",
      y: -24,
    });

    return () => {
      animation.revert();
    };
  }, []);

  /**
   * Hide going down, come back going up.
   *
   * `window.scrollY` rather than the smoother: the smoother eases the content
   * towards the real scroll position and the document still scrolls natively.
   * The state is an attribute and the movement is CSS, so the stylesheet holds
   * all three moving parts — the slide, the ground, the padding — and switches
   * them off under reduced motion in one place.
   */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let reading = { ...HEADER_AT_REST, lastY: window.scrollY };
    let frame = 0;

    const read = () => {
      frame = 0;
      /* Held by the homepage's opening while it is pinned (HouseHeroMotion):
         that scroll moves the opening, not the page, so the bar stays where
         it was at the top — on the photograph, with no ground of its own. */
      if (document.documentElement.hasAttribute("data-header-hold")) {
        reading = { state: "top", lastY: window.scrollY, travel: 0 };
        if (header.dataset.header !== "top") header.dataset.header = "top";
        return;
      }
      const next = nextHeaderState(reading, window.scrollY);
      if (next.state !== reading.state) header.dataset.header = next.state;
      reading = next;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    /* Told, rather than inferred: an open menu pins the bar on screen from the
       effect below, and this is how the reading agrees with what is painted. */
    const onPinned = () => {
      reading = { ...reading, state: "shown", travel: 0 };
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    header.addEventListener("mardal:header-shown", onPinned);

    return () => {
      window.removeEventListener("scroll", onScroll);
      header.removeEventListener("mardal:header-shown", onPinned);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /**
   * The bar is drawn in white while a dark ground stands behind it.
   *
   * It has no ground of its own (owner, 2026-10-03: "remove the bacground when
   * scroll"), so once the page is scrolled MENU stands straight on whatever
   * passes under it — and black on the footer's black, or on the homepage's
   * photograph, is nothing. Anything dark marks itself `data-bar-dark`; this
   * reads where they are painted, every frame, so it follows the smoother's
   * easing and a pinned section's growth rather than the raw scroll position.
   */
  useEffect(() => {
    const nav = navigationRef.current;
    if (!nav) return;
    const root = document.documentElement;

    const watch = () => {
      const bar = nav.getBoundingClientRect();
      const line = bar.top + bar.height / 2;
      let dark = false;
      for (const ground of document.querySelectorAll<HTMLElement>(
        "[data-bar-dark]",
      )) {
        const box = ground.getBoundingClientRect();
        if (box.height > 0 && box.top <= line && box.bottom >= line) {
          dark = true;
          break;
        }
      }
      if (dark !== root.hasAttribute("data-header-on-dark")) {
        root.toggleAttribute("data-header-on-dark", dark);
      }
    };

    gsap.ticker.add(watch);
    return () => {
      gsap.ticker.remove(watch);
      root.removeAttribute("data-header-on-dark");
    };
  }, []);

  /* An open menu brings a hidden bar back: the button that closes it is on
     the bar. */
  useEffect(() => {
    const header = headerRef.current;
    if (!header || !menuOpen) return;
    if (header.dataset.header === "hidden") header.dataset.header = "shown";
    header.dispatchEvent(new CustomEvent("mardal:header-shown"));
  }, [menuOpen]);

  /* On a phone the words step aside while a list is open; on a wide window
     they never do. */
  const indexAway = !wide && activeMenu !== null;

  return (
    <header
      className={`site-header${menuOpen ? " site-header--mobile-menu-open" : ""}`}
      ref={headerRef}
      /* The resting state, rendered rather than set on mount: the stylesheet
         keys the bar's ground and padding off this attribute, so a bar that
         arrives without one paints the scrolled treatment for a frame. */
      data-header="top"
    >
      <Container>
        <nav
          className="site-nav"
          aria-label="Main navigation"
          ref={navigationRef}
        >
          {/* The wordmark and, beside it, where Mardal is — the owner's comp
              of 2026-10-03, which keeps the wordmark exactly as it was. */}
          <div className="site-nav__lead">
            <Link
              className="brand"
              href="/"
              aria-label="Mardal home"
              onClick={closeMenu}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="brand-logo"
                src="/SVG/logo.svg"
                alt="Mardal"
                width="694"
                height="164"
              />
            </Link>
            <span className="site-nav__place">{brandPlace}</span>
          </div>

          {/* "Menu" and a drawn plus — owner, 2026-10-03, in place of the two
              lines; split into four strokes on 2026-10-05. A minus while the
              menu is open. */}
          <button
            className="mobile-menu-toggle"
            type="button"
            ref={toggleRef}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            data-roll
            onClick={() => {
              if (menuOpen) {
                closeMenu();
                return;
              }
              setMenuOpen(true);
              setDisplayMenu(FIRST_LIST);
              setActiveMenu(wide ? FIRST_LIST : null);
            }}
          >
            {/* The word rolls under the pointer, as VIEW ALL's does; the plus
                beside it stays still (owner, 2026-10-05). */}
            <span className="mobile-menu-toggle__label">
              <RollingLabel>{menuButton}</RollingLabel>
            </span>
            <span className="mobile-menu-toggle__plus" aria-hidden="true" />
          </button>
        </nav>
      </Container>

      <div
        className={`mobile-menu${wide ? " mobile-menu--wide" : ""}${
          menuOpen ? " mobile-menu--open" : ""
        }`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : true}
      >
        <Container className="mobile-menu__content">
          <div className="mobile-menu__viewport">
            <div
              className="mobile-menu__index"
              ref={indexRef}
              aria-hidden={indexAway}
              inert={indexAway ? true : undefined}
            >
              <ul className="mobile-menu__index-list">
                {menu.map((item) => {
                  /* Services, Products and Company open their lists and go
                     nowhere — owner's call, 2026-08-24: disclosures, not
                     destinations. Clients is the one word that is a page. */
                  const isLink = item.href.startsWith("/") && !item.panelOnly;
                  const isCurrent = isLink
                    ? pathname === item.href
                    : pathname === item.href ||
                      item.items.some((link) => pathname === link.href);
                  const className = `mobile-menu__index-link${
                    isCurrent ? " is-current" : ""
                  }`;
                  /* How many pages are behind the word, in front of it — owner,
                     2026-10-03: "numbers put in front", and the arrows that
                     stood after the words taken out. The count is a fact the
                     list states again, so it is for the eye only. Clients is
                     one page and has none, but keeps the slot, so all four
                     words start on one line. Then the word, in a mask the
                     height of its line, so it can rise out of it. */
                  const name = (
                    <span className="mobile-menu__name">
                      <sup className="mobile-menu__count" aria-hidden="true">
                        {item.items.length > 0 ? item.items.length : null}
                      </sup>
                      <span className="mobile-menu__word">
                        <span className="mobile-menu__word-inner" data-menu-word>
                          {item.label}
                        </span>
                      </span>
                    </span>
                  );

                  return (
                    <li key={item.key} data-mobile-menu-entry>
                      {isLink ? (
                        <Link
                          className={className}
                          href={item.href}
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={closeMenu}
                        >
                          {name}
                        </Link>
                      ) : (
                        <button
                          className={className}
                          type="button"
                          aria-controls="mobile-menu-detail"
                          aria-expanded={activeMenu === item.key}
                          onClick={() => showList(item.key)}
                          /* On a wide window the list beside the words
                             follows the pointer and the keyboard, so reading
                             across them needs no click. */
                          onPointerEnter={(event) => {
                            if (wide && event.pointerType === "mouse") {
                              showList(item.key);
                            }
                          }}
                          onFocus={() => {
                            if (wide) showList(item.key);
                          }}
                        >
                          {name}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* The way in, under the words: to the contact page, which is a
                  form since 2026-09-13. */}
              <div className="mobile-menu__cta-row" data-mobile-menu-entry>
                <a
                  className="mobile-menu__cta"
                  data-roll
                  href="/contact"
                  onClick={closeMenu}
                >
                  <RollingLabel>Start a project</RollingLabel>
                  <PixelArrow
                    className="mobile-menu__cta-arrow"
                    direction="up-right"
                    size="small"
                  />
                </a>
              </div>
            </div>

            <div
              className="mobile-menu__detail"
              id="mobile-menu-detail"
              ref={detailRef}
              aria-hidden={activeMenu === null}
              inert={activeMenu ? undefined : true}
            >
              {/* Services in its two halves, each under its heading; the other
                  lists as one. One wrapper, so the column still sees one list
                  followed by the way back. */}
              {displayGroups ? (
                <div className="mobile-menu__detail-groups">
                  {displayGroups.map((group) => {
                    const headingId = `mobile-menu-group-${group.label.toLowerCase()}`;

                    return (
                      <div className="mobile-menu__detail-group" key={group.label}>
                        <p
                          className="eyebrow mobile-menu__detail-heading"
                          id={headingId}
                          data-mobile-detail-entry
                        >
                          {group.label}
                        </p>
                        <ul
                          className="mobile-menu__detail-list"
                          aria-labelledby={headingId}
                        >
                          {group.items.map(detailLink)}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ul className="mobile-menu__detail-list">
                  {displayItem.items.map(detailLink)}
                </ul>
              )}

              {/* A phone's way back to the four words. A wide window shows
                  both at once, so it has nothing to go back to and the
                  stylesheet takes this away there.

                  Owner, 2026-08-27: the word is Back — it printed the
                  section's own name, which reads as a link deeper in rather
                  than the way out. The label keeps the section for a screen
                  reader, which meets this button with no list in view. */}
              <button
                className="mobile-menu__back"
                data-roll
                type="button"
                aria-label={`Back to the main menu from ${displayItem.label}`}
                onClick={() => setActiveMenu(null)}
                data-mobile-detail-entry
              >
                <PixelArrow
                  className="mobile-menu__back-arrow"
                  direction="left"
                  size="small"
                />
                <span><RollingLabel>Back</RollingLabel></span>
              </button>
            </div>
          </div>

          {/* The foot, as little as it can be — owner, 2026-10-03: "the section
              at bottom with numbers social medai etc make a better minimal
              aproach". One quiet line: where Mardal is and its number. The
              social marks left it; the footer still carries them. */}
          <div className="mobile-menu__foot" ref={footRef}>
            <dl className="mobile-menu__contact">
              {SHEET_CONTACT.map((detail) => (
                <div className="mobile-menu__contact-row" key={detail.label}>
                  <dt className="visually-hidden">{detail.label}</dt>
                  <dd className="mobile-menu__contact-value">
                    {detail.href ? (
                      <a
                        className="mobile-menu__contact-link"
                        href={detail.href}
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </div>
    </header>
  );
}
