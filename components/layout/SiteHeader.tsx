"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_MENU } from "../../lib/breakpoints";
import { HEADER_AT_REST, nextHeaderState } from "../../lib/header-reveal";
import { RollingLabel } from "../ui/RollingLabel";
import { Container } from "./Container";
import { brandPlace, footer, menu, menuButton } from "../../content/home";

/**
 * The bar and the menu.
 *
 * **One menu, behind one burger, at every width — owner, 2026-10-03:** "i dont
 * like it i want BIG MENU so Only BURGER menu". The bar is the wordmark and the
 * burger and nothing else. Its class names still say `mobile-menu`, after
 * where it began.
 *
 * **Inside it, since 2026-10-05** — after three goes the owner turned down
 * ("uncovensional", "no logic", "somthing different") and an hour in the
 * site's red: a white sheet coming down over the page like a blind, with four
 * words on it, grey at rest and black in hand — Services, Products, Clients,
 * About, starting on the email's rule with the red plus in front. Three of
 * them are parents: pointed at, focused or pressed, their pages open in a
 * list to the right on a wide window, under the word on a phone. Clients is
 * a page. Along the foot, "Start a project" and the ways to reach Mardal.
 *
 * What came before the burger — the words in the bar and a white sheet down
 * the right — is in backup/2026-10-03-site-header/, with how to put it back.
 */

type MenuLink = { readonly label: string; readonly href: string };
type MenuGroup = {
  readonly label: string;
  readonly items: readonly MenuLink[];
};

/**
 * What the sheet lists, in order, read from the one `menu` the footer reads
 * too: four words. Services and Products are parents — they open their pages
 * and go nowhere themselves (owner's call, 2026-08-24: disclosures, not
 * destinations), Services in its two halves, Development and Creative
 * (2026-10-03). Clients is a page. The fourth is the company's own four pages
 * under the name of the first of them — owner, 2026-10-05: "maybe Blog
 * carreers and contact to be under About".
 */
type MenuEntry =
  | {
      readonly kind: "parent";
      readonly key: string;
      readonly label: string;
      /* Headed halves (Services), or one list with no heading of its own. */
      readonly groups: readonly MenuGroup[];
      readonly headed: boolean;
    }
  | { readonly kind: "page"; readonly key: string; readonly label: string; readonly href: string };

/**
 * **The row the bar opens on a desktop** — owner, 2026-10-05: "no big menu
 * but when hover to aper menu on the left so in same text as Menu … Home,
 * Services, Products, Clients, about … only as a text not with bacground",
 * then "when click inside to have all services and other not as a sublink".
 * Five words, each a page that holds everything under it: the services'
 * page lists all seven, the products' page all three. Home came out and
 * Contact went in — owner, 2026-10-08: "remove HOME link from header add
 * contact" (the wordmark still goes home). Read from `menu`, so no word or
 * address is written twice.
 */
const BAR_LINKS: readonly MenuLink[] = menu.map((item) => ({
  label: item.label,
  href: item.href,
}));

const ENTRIES: readonly MenuEntry[] = menu.map((item): MenuEntry => {
  if (item.panelOnly) {
    /* Headed halves where an entry has them — Services did, until it became a
       page of its own (2026-10-06); none does now. */
    const halves = (item as { readonly groups?: readonly MenuGroup[] }).groups ?? null;
    return {
      kind: "parent",
      key: item.key,
      label: item.label,
      groups: halves ?? [{ label: item.label, items: item.items }],
      headed: halves !== null,
    };
  }
  return { kind: "page", key: item.key, label: item.label, href: item.href };
});

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  /* A phone's pace for the arrival: the same motion, shorter. */
  const [compact, setCompact] = useState(false);
  /* Whether a parent opens under the pointer: only where there is a mouse
     and the panel stands beside the words. Asked of the pointer, not of the
     window's width — a narrow desktop window still has a mouse, and asking
     the width left one parent open while the pointer lit another. */
  const [hoverOpen, setHoverOpen] = useState(false);
  /* The parent whose pages are open, if any. */
  const [openParent, setOpenParent] = useState<string | null>(null);
  /* The bar's row of pages on a desktop: opened and closed by a press of
     Menu, never by the pointer alone. */
  const [barOpen, setBarOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  function closeMenu() {
    setMenuOpen(false);
    setOpenParent(null);
  }

  /**
   * **The wordmark, on the homepage, goes back to its beginning** —
   * owner, 2026-10-05: "when Click logo or home page needs to move up at the
   * begining". A link to the page you are on goes nowhere, so on the homepage
   * the press scrolls it back to the top instead, through the smoother when
   * there is one so the opening plays back on the way up; anywhere else it is
   * the ordinary link home.
   */
  function toHomeTop(event: React.MouseEvent<HTMLAnchorElement>) {
    closeMenu();
    setBarOpen(false);
    if (pathname !== "/") return;
    event.preventDefault();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(0, !still);
    else window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  }

  /* A parent's page: one ruled row, its name and VIEW ALL's thin arrow. */
  function menuLink(link: MenuLink) {
    const isCurrent = link.href.startsWith("/") && pathname === link.href;

    return (
      <li className="mobile-menu__item" key={link.href}>
        <a
          className="mobile-menu__link"
          href={link.href}
          aria-current={isCurrent ? "page" : undefined}
          onClick={closeMenu}
        >
          <span className="mobile-menu__link-text">{link.label}</span>
          <svg
            className="mobile-menu__link-arrow"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2 14 14 2M4.5 2H14v9.5" />
          </svg>
        </a>
      </li>
    );
  }

  /**
   * The arrival, in reading order, each time the sheet opens: as the
   * blind comes down, the four words rise out of their own lines one close
   * behind the next, the foot's hairline draws from the left, and the foot
   * fades up once the words can be read. The sheet itself fades in by CSS; this moves
   * what is on it. Closing is the sheet's own fade, and the next opening starts
   * every part from its beginning again.
   */
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const rules = sheet.querySelectorAll<HTMLElement>("[data-menu-rule]");
    const words = sheet.querySelectorAll<HTMLElement>("[data-menu-word]");
    const fades = sheet.querySelectorAll<HTMLElement>("[data-menu-fade]");
    const targets = [...rules, ...words, ...fades];

    gsap.killTweensOf(targets);
    if (!menuOpen) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rules, { scaleX: 1 });
      gsap.set(words, { yPercent: 0 });
      gsap.set(fades, { autoAlpha: 1, y: 0 });
      return;
    }

    const pace = compact ? 0.8 : 1;
    /* The words wait for the blind: it is most of the way down by then. */
    const after = 0.3;
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1 * pace,
          ease: "expo.out",
          stagger: 0.08,
        },
        after,
      )
      .fromTo(
        rules,
        { scaleX: 0, transformOrigin: "0% 50%" },
        {
          scaleX: 1,
          duration: 1.1 * pace,
          ease: "expo.inOut",
        },
        after + 0.15,
      )
      .fromTo(
        fades,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7 * pace,
          ease: "power3.out",
          stagger: 0.04,
        },
        after + 0.45,
      );

    return () => {
      timeline.kill();
    };
  }, [menuOpen, compact]);

  /**
   * Which pace, asked of the stylesheet's own query rather than a second one —
   * see lib/breakpoints.ts for why a complement cannot be written exactly.
   * Answered on every change, not once, so a window resized while the menu is
   * open plays its next arrival at its new width's pace.
   */
  useEffect(() => {
    const phone = window.matchMedia(MOBILE_MENU);
    /* The stylesheet's own line for the stacked menu (the panel under the
       word) — see "Inside the menu" in globals.css. */
    const stacked = window.matchMedia("(max-width: 40rem)");
    const mouse = window.matchMedia("(hover: hover)");
    const queries = [phone, stacked, mouse];

    function sync() {
      const hover = mouse.matches && !stacked.matches;
      setCompact(phone.matches);
      setHoverOpen(hover);
      /* Wherever the bar stops opening its row (a window narrowed to a
         phone's), an open row closes — here, where that is learnt, rather
         than in an effect watching for it. */
      if (!hover) setBarOpen(false);
    }

    sync();
    queries.forEach((query) => query.addEventListener("change", sync));

    return () => {
      queries.forEach((query) => query.removeEventListener("change", sync));
    };
  }, []);

  /* The open row closes on Escape, on a press anywhere else, on scrolling
     down (owner, 2026-10-05: "it can close when scrolling down"), and
     wherever the bar stops opening it (the media sync above). */
  useEffect(() => {
    if (!barOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setBarOpen(false);
    }
    function onPress(event: PointerEvent) {
      if (!barRef.current?.contains(event.target as Node)) setBarOpen(false);
    }
    /* Down only, and past a few pixels, so a trackpad's settle does not
       count; scrolling back up leaves it open. */
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (y > lastY + 4) setBarOpen(false);
      else if (y < lastY) lastY = y;
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
      window.removeEventListener("scroll", onScroll);
    };
  }, [barOpen]);

  /* **No ring after a press** — owner, 2026-10-06: "why sometines we have
     that outline red in menu". The ring is for the keyboard, but a phone can
     still draw it round Menu after a tap, where focus is handed to it. So the
     header keeps how it was last used: a press hides the ring, and Tab — the
     key that moves through the page — brings it back.

     Tab only — owner, 2026-10-08, again: "i see often this outline". Any key
     brought it back, and after Menu was clicked the browser draws the ring
     for any key at all: Escape to close the row, Space or an arrow to scroll
     (measured: every one of them drew it). */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const pressed = () => header.setAttribute("data-pressed", "");
    const keyed = (event: KeyboardEvent) => {
      if (event.key === "Tab") header.removeAttribute("data-pressed");
    };
    document.addEventListener("pointerdown", pressed, true);
    document.addEventListener("keydown", keyed, true);
    return () => {
      document.removeEventListener("pointerdown", pressed, true);
      document.removeEventListener("keydown", keyed, true);
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
      setOpenParent(null);
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
              onClick={toHomeTop}
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

          {/* Menu, and the row of pages a press of it opens to its left on a
              desktop. A phone, or anything without a pointer, opens the sheet
              below instead. */}
          <div
            className={`site-nav__menu${barOpen ? " is-open" : ""}`}
            ref={barRef}
          >
            <ul className="bar-menu" id="bar-menu" aria-label="Pages">
              {BAR_LINKS.map((link) => (
                <li className="bar-menu__item" key={link.href}>
                  <Link
                    className="bar-menu__link"
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setBarOpen(false)}
                    data-roll
                  >
                    <RollingLabel>{link.label}</RollingLabel>
                  </Link>
                </li>
              ))}
            </ul>

            {/* "Menu" and a drawn plus — owner, 2026-10-03, in place of the
                two lines; split into four strokes on 2026-10-05, and a plus
                whether open or not. */}
            <button
              className="mobile-menu-toggle"
              type="button"
              ref={toggleRef}
              aria-expanded={menuOpen || barOpen}
              aria-controls="mobile-navigation"
              data-roll
              onClick={() => {
                if (hoverOpen) {
                  setBarOpen((open) => !open);
                  return;
                }
                if (menuOpen) {
                  closeMenu();
                  return;
                }
                setOpenParent(null);
                setMenuOpen(true);
              }}
            >
              {/* The word rolls under the pointer, as VIEW ALL's does; the
                  plus beside it stays still (owner, 2026-10-05). */}
              <span className="mobile-menu-toggle__label">
                <RollingLabel>{menuButton}</RollingLabel>
              </span>
              <span className="mobile-menu-toggle__plus" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </Container>

      <div
        className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`}
        id="mobile-navigation"
        ref={sheetRef}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : true}
      >
        <Container className="mobile-menu__content">
          {/* The entries, big, down the left. A parent's pages open in its
              panel — to the right on a wide window, under the word on a
              phone — when it is pointed at, focused or pressed; pointing at
              a page closes it again, so the panel only ever shows the pages
              of the word in hand. */}
          <ul className="mobile-menu__pages">
            {ENTRIES.map((entry) => {
              /* The word, in a mask the height of its line, so it can rise out
                 of it; and doubled, so it can roll. */
              const word = (
                <span className="mobile-menu__word">
                  <span className="mobile-menu__word-inner" data-menu-word>
                    <RollingLabel>{entry.label}</RollingLabel>
                  </span>
                </span>
              );

              if (entry.kind === "page") {
                const isCurrent = pathname === entry.href;

                return (
                  <li key={entry.key}>
                    <Link
                      className="mobile-menu__page"
                      href={entry.href}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={closeMenu}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse" && hoverOpen) setOpenParent(null);
                      }}
                      data-roll
                    >
                      {/* The plus in front of every word, a page's too —
                          owner, 2026-10-06: "not all pages ave + we need to
                          have all". */}
                      <span className="mobile-menu__slot" aria-hidden="true">
                        <span className="mobile-menu__plus" />
                      </span>
                      {word}
                    </Link>
                  </li>
                );
              }

              const isOpen = openParent === entry.key;
              const panelId = `mobile-menu-panel-${entry.key}`;
              const isCurrent = entry.groups.some((group) =>
                group.items.some((link) => pathname === link.href),
              );

              return (
                <li key={entry.key} className="mobile-menu__parent">
                  <button
                    className={`mobile-menu__page${isCurrent ? " is-current" : ""}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    data-roll
                    /* Where the pointer opens it, a press only ever opens it
                       (the pointer got there first, and a press must not
                       shut what it is pointing at); elsewhere a press opens
                       and shuts it. */
                    onClick={() =>
                      setOpenParent(hoverOpen || !isOpen ? entry.key : null)
                    }
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse" && hoverOpen) setOpenParent(entry.key);
                    }}
                    onFocus={() => {
                      if (hoverOpen) setOpenParent(entry.key);
                    }}
                  >
                    {/* In front of the word, on its middle (owner,
                        2026-10-05): a plus that folds to a minus while its
                        pages are open — the Menu button's own mark. */}
                    <span className="mobile-menu__slot" aria-hidden="true">
                      <span className="mobile-menu__plus" />
                    </span>
                    {word}
                  </button>

                  <div
                    className={`mobile-menu__panel${isOpen ? " is-open" : ""}`}
                    id={panelId}
                  >
                    <div className="mobile-menu__panel-inner">
                      {entry.groups.map((group) => {
                        const headingId = `mobile-menu-group-${group.label.toLowerCase()}`;

                        return (
                          <div className="mobile-menu__group" key={group.label}>
                            {entry.headed ? (
                              <p className="mobile-menu__group-title" id={headingId}>
                                {group.label}
                              </p>
                            ) : null}
                            <ul
                              className="mobile-menu__links"
                              aria-labelledby={entry.headed ? headingId : undefined}
                              aria-label={entry.headed ? undefined : entry.label}
                            >
                              {group.items.map(menuLink)}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* The way in — to the contact page, which is a form since
              2026-09-13 — and the ways to reach Mardal. */}
          <div className="mobile-menu__foot" data-menu-fade>
            <span className="mobile-menu__rule" aria-hidden="true" data-menu-rule />
            <a
              className="mobile-menu__cta"
              data-roll
              href="/contact"
              onClick={closeMenu}
            >
              <RollingLabel>Start a project</RollingLabel>
              {/* VIEW ALL's thin arrow; still while the word rolls. */}
              <svg
                className="mobile-menu__arrow"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2 14 14 2M4.5 2H14v9.5" />
              </svg>
            </a>
            {footer.details.map((detail) => (
              <p className="mobile-menu__contact" key={detail.label}>
                <span className="visually-hidden">{`${detail.label}: `}</span>
                {detail.href ? (
                  <a className="mobile-menu__link" href={detail.href}>
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </p>
            ))}
          </div>
        </Container>
      </div>
    </header>
  );
}
