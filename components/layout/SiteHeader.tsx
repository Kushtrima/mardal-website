"use client";

import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { PixelArrow } from "../ui/PixelArrow";
import { Container } from "./Container";
import { footer, menu } from "../../content/home";

type NavigationKey = (typeof menu)[number]["key"];

/**
 * How far past the bar or the names the pointer may stray before the menu is
 * counted as left.
 *
 * The region it pads is the bar and the list, NOT the white ground. The ground
 * reaches the top, right and bottom edges of the window, so treating it as the
 * menu meant more than half the screen counted as being on it: moving down or
 * right to read the page kept it open, and only going left onto the hero closed
 * it. The menu, as far as anyone using it is concerned, is the words.
 */
const KEEP_OPEN_PADDING = 24;

export const SiteHeader = forwardRef<HTMLElement>(function SiteHeader(
  _props,
  navigationRef,
) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuGroundRef = useRef<HTMLDivElement>(null);
  const mobileIndexRef = useRef<HTMLDivElement>(null);
  const mobileDetailRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  /* Whether the panel was already open the last time the effect below ran. */
  const megaMenuWasOpenRef = useRef(false);
  const [activeMenu, setActiveMenu] = useState<NavigationKey>("services");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] =
    useState<NavigationKey | null>(null);
  const [mobileDisplayMenu, setMobileDisplayMenu] =
    useState<NavigationKey>("services");
  const activeItem =
    menu.find((item) => item.key === activeMenu) ?? menu[0];
  const mobileItem =
    menu.find((item) => item.key === mobileDisplayMenu) ?? menu[0];

  function clearCloseTimer() {
    if (closeTimerRef.current === undefined) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = undefined;
  }

  function openMegaMenu(menu: NavigationKey) {
    clearCloseTimer();
    setActiveMenu(menu);
    setMegaMenuOpen(true);
  }

  /* 170ms before, which was insurance against a gap between the bar and the
     panel that no longer exists: the ground reaches the top of the window and
     the bar is drawn on it, so there is nothing to cross and nothing to
     forgive. What is left is only enough to ignore a pointer clipping a corner
     on its way past. */
  function scheduleMegaMenuClose(delay = 60) {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setMegaMenuOpen(false);
    }, delay);
  }

  useLayoutEffect(() => {
    const menu = megaMenuRef.current;
    if (!menu) return;

    const entries = menu.querySelectorAll("[data-mega-entry]");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    /* Whether this run is an arrival or a change of list. The effect answers to
       both the open flag and the active menu, and cannot tell them apart from
       its inputs alone. */
    const wasOpen = megaMenuWasOpenRef.current;
    megaMenuWasOpenRef.current = megaMenuOpen;

    const ground = megaMenuGroundRef.current;

    gsap.killTweensOf([menu, ground, entries]);

    if (reducedMotion) {
      gsap.set(menu, {
        autoAlpha: megaMenuOpen ? 1 : 0,
        pointerEvents: megaMenuOpen ? "auto" : "none",
      });
      gsap.set(ground, { autoAlpha: 1 });
      gsap.set(entries, { autoAlpha: 1, clipPath: "none" });
      return;
    }

    /* The panel does not move. The ground lightens where it stands and the
       names are uncovered on it, one after the next.

       The ground is a fade, and slow — no edge travels across it. It was a wipe
       for one version, on the argument that it would match the names and the
       footer rules; asked directly, a wipe is not what smooth means here. An
       edge crossing this much of the screen is an event, and the ground is
       meant to be the thing the menu is written on, not something that
       announces itself.

       What it must not do is take the names with it, and that is what its own
       layer buys. The panel's opacity used to carry both, so every name faded
       AND wiped — two motions on the same word, neither finishing what it
       started. Now the ground fades and only the names are clipped.

       Clipped rather than faded or slid: a fade makes a word arrive everywhere
       at once and says nothing about direction, and a slide moves the word off
       the line it belongs on. An inset from the right leaves each name exactly
       where it will end up and only chooses when it can be seen.

       All of that is the ARRIVAL, and it belongs to arriving. Moving from one
       menu to the next along the bar is not an arrival: the ground is already
       there and the reader is already reading. Switching changes the list and
       nothing else. */
    if (megaMenuOpen) {
      gsap.set(menu, {
        autoAlpha: 1,
        pointerEvents: "auto",
        visibility: "visible",
      });

      if (wasOpen) {
        gsap.set(ground, { autoAlpha: 1 });
        /* Up on the spot. This is a change of subject, not an entrance, so it
           stays where it is — but at 180ms it read as a flicker rather than a
           change, so it is nearly twice that now: long enough to see one list
           become another, short enough that running along the bar is not a
           queue. */
        gsap.fromTo(
          entries,
          { autoAlpha: 0, clipPath: "none", y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
            /* Enough of a run that the list arrives as a list rather than all
               at once, and short enough that the last name is in place inside
               half a second. */
            stagger: 0.045,
          },
        );
        return;
      }

      /* The ground lightens in place, slowly, and without an edge. */
      gsap.fromTo(
        ground,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.6,
          /* Gentle at both ends. A power2 out arrives at speed and stops, which
             on a plain lightening reads as the white snapping the last of the
             way. */
          ease: "power1.inOut",
        },
      );

      gsap.fromTo(
        entries,
        { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          /* Long enough to be read as a wipe rather than a flash, and eased at
             both ends so no word snaps into place. */
          duration: 0.55,
          ease: "power2.inOut",
          /* Held back until the ground is halfway up, so the names are read on
             white rather than over the page showing through it. */
          delay: 0.22,
          /* Seven items is the longest menu, so the last one starts at 0.33s
             after that. The first names are readable early, which is what
             matters: you are choosing from the top of the list while the foot
             of it is still arriving. */
          stagger: 0.055,
        },
      );
      return;
    }

    /* Out on a fade, not a wipe. Reversing the uncover would draw the eye back
       across words that are on their way out, and the panel has no movement of
       its own to carry the exit. */
    gsap.to(menu, {
      autoAlpha: 0,
      /* Quick, and deliberately not matched to the arrival. Coming in, the white
         is the thing being looked at and can take its time; going out it is in
         the way of whatever was wanted instead, and every millisecond of it is
         spent waiting. */
      duration: 0.18,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(menu, { pointerEvents: "none" });
      },
    });
  }, [activeMenu, megaMenuOpen]);

  useLayoutEffect(() => {
    if (!mobileMenuOpen) return;

    const index = mobileIndexRef.current;
    const detail = mobileDetailRef.current;
    if (!index || !detail) return;

    const indexEntries = index.querySelectorAll<HTMLElement>(
      "[data-mobile-menu-entry]",
    );
    const detailEntries = detail.querySelectorAll<HTMLElement>(
      "[data-mobile-detail-entry]",
    );
    const targets = [index, detail, ...indexEntries, ...detailEntries];
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.killTweensOf(targets);

    if (reducedMotion) {
      gsap.set(index, {
        autoAlpha: mobileActiveMenu ? 0 : 1,
        pointerEvents: mobileActiveMenu ? "none" : "auto",
        xPercent: 0,
      });
      gsap.set(detail, {
        autoAlpha: mobileActiveMenu ? 1 : 0,
        pointerEvents: mobileActiveMenu ? "auto" : "none",
        xPercent: 0,
      });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    if (mobileActiveMenu) {
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
    }

    return () => {
      timeline.kill();
      gsap.killTweensOf(targets);
    };
  }, [mobileActiveMenu, mobileDisplayMenu, mobileMenuOpen]);

  useEffect(() => {
    function handlePointerDown(event: globalThis.PointerEvent) {
      if (
        megaMenuOpen &&
        !headerRef.current?.contains(event.target as Node)
      ) {
        setMegaMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setMegaMenuOpen(false);
      setMobileMenuOpen(false);
      setMobileActiveMenu(null);
      headerRef.current
        ?.querySelector<HTMLElement>('[data-nav-trigger][aria-expanded="true"]')
        ?.focus();
    }

    /**
     * Closes the menu once the pointer is off it, decided by where the pointer
     * IS rather than by an event saying it left.
     *
     * There is a React onPointerLeave on the header already, and on paper it
     * covers this: the panel is a descendant, so moving onto it is not leaving.
     * In practice the menu was staying open. Rather than guess at why, this
     * asks the only question that matters — is the pointer over the bar or over
     * the panel — and answers it on every move. A miscounted enter or leave
     * cannot strand it open, because nothing is being counted.
     */
    function handlePointerMove(event: globalThis.PointerEvent) {
      if (event.pointerType !== "mouse") return;

      const panel = megaMenuRef.current;
      if (!panel) return;

      const bar = panel.closest(".site-nav");
      const list = panel.querySelector(".mega-menu__links");
      const legal = panel.querySelector(".mega-menu__legal");

      const inside = (box: DOMRect | undefined) =>
        !!box &&
        event.clientX >= box.left - KEEP_OPEN_PADDING &&
        event.clientX <= box.right + KEEP_OPEN_PADDING &&
        event.clientY >= box.top - KEEP_OPEN_PADDING &&
        event.clientY <= box.bottom + KEEP_OPEN_PADDING;

      const boxOf = (element: Element | null) =>
        element?.getBoundingClientRect();

      /* Each box on its own, never their union. A union is a bounding box, and
         a bounding box of these two covers a great deal that belongs to
         neither: the bar runs the full width of the page and the list hangs
         below its right-hand end, so their union is a band clear across the
         screen, three hundred pixels deep. Moving left off the names, into the
         hero, stayed inside it.
         The padding is what joins them where they should be joined — the bar
         ends around 90 and the names start around 130, and 24 either side
         closes that gap without inventing any others. */
      if (
        inside(boxOf(bar)) ||
        inside(boxOf(list)) ||
        inside(boxOf(legal))
      ) {
        clearCloseTimer();
        return;
      }

      scheduleMegaMenuClose();
    }

    /* The pointer can also leave without ever being seen outside: off the top
       of the page into the browser's own chrome, or out of the window
       altogether. No pointermove is delivered for that, so the last thing seen
       is a position still on the menu and it would stay open behind whatever
       was switched to. */
    function handleDocumentLeave() {
      scheduleMegaMenuClose();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    if (megaMenuOpen) {
      document.addEventListener("pointermove", handlePointerMove);
      document.documentElement.addEventListener(
        "pointerleave",
        handleDocumentLeave,
      );
      window.addEventListener("blur", handleDocumentLeave);
    }

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handleDocumentLeave,
      );
      window.removeEventListener("blur", handleDocumentLeave);
      clearCloseTimer();
    };
  }, [megaMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 70.0625rem)");

    function handleViewportChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setMobileMenuOpen(false);
        setMobileActiveMenu(null);
      }
    }

    desktopViewport.addEventListener("change", handleViewportChange);

    return () => {
      desktopViewport.removeEventListener("change", handleViewportChange);
    };
  }, []);

  return (
    <header
      /* The open menu is a white ground, and the bar is drawn ON it from the
         links rightward — so while it is open those words are white on white.
         This is the hook that turns them over. The wordmark is not included:
         it sits in the first column, to the left of where the ground begins,
         and stays on the page's black. */
      className={`site-header${
        mobileMenuOpen ? " site-header--mobile-menu-open" : ""
      }${megaMenuOpen ? " site-header--mega-open" : ""}`}
      ref={headerRef}
      onPointerEnter={clearCloseTimer}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") scheduleMegaMenuClose();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          scheduleMegaMenuClose(80);
        }
      }}
    >
      <Container>
        <nav
          className="site-nav"
          aria-label="Main navigation"
          ref={navigationRef}
        >
          <Link className="brand" href="/" aria-label="Mardal home">
            {/* Supplied vector wordmark is already optimized and self-contained. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="brand-logo"
              src="/SVG/logo.svg"
              alt="Mardal"
              width="694"
              height="164"
            />
          </Link>

          <ul className="nav-list">
            {menu.map((item) => (
              <li key={item.key}>
                <button
                  className="nav-link nav-trigger"
                  type="button"
                  aria-expanded={megaMenuOpen && activeMenu === item.key}
                  aria-controls="desktop-mega-menu"
                  data-nav-trigger
                  onClick={() => {
                    if (megaMenuOpen && activeMenu === item.key) {
                      setMegaMenuOpen(false);
                      return;
                    }

                    openMegaMenu(item.key);
                  }}
                  onFocus={() => openMegaMenu(item.key)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                      openMegaMenu(item.key);
                    }
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMegaMenuOpen(false);
              setMobileActiveMenu(null);
              setMobileMenuOpen((open) => !open);
            }}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>

          <Button className="hero-nav-cta" href="#contact">
            Hire us
          </Button>

          <div
            className="mega-menu"
            id="desktop-mega-menu"
            ref={megaMenuRef}
            aria-hidden={!megaMenuOpen}
            inert={megaMenuOpen ? undefined : true}
          >
            {/* The white, as its own layer. It used to be the panel's own
                background, which meant the only way to bring it in was to fade
                the panel — and that faded the names with it, on top of the wipe
                they were already doing. Given a layer of its own it can be
                drawn across on its own. */}
            <div className="mega-menu__ground" ref={megaMenuGroundRef} />

            <ul className="mega-menu__links">
              {activeItem.items.map((item) => (
                <li key={item.label} data-mega-entry>
                  <a
                    className="mega-menu__link"
                    href={item.href}
                    onClick={() => setMegaMenuOpen(false)}
                  >
                    <span className="mega-menu__label">{item.label}</span>
                    <PixelArrow
                      className="mega-menu__arrow"
                      direction="up-right"
                      size="compact"
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* The same line the footer carries, in the corner the panel
                leaves empty. It is the one place these can be reached without
                first travelling the whole page. */}
            <div className="mega-menu__legal" data-mega-entry>
              <span className="mega-menu__copy">
                {`© ${new Date().getFullYear()} Mardal`}
              </span>

              {footer.legal.map((link) => (
                <a
                  className="mega-menu__legal-link"
                  href={link.href}
                  key={link.href}
                  onClick={() => setMegaMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </Container>

      <div
        className={`mobile-menu${mobileMenuOpen ? " mobile-menu--open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!mobileMenuOpen}
        inert={mobileMenuOpen ? undefined : true}
      >
        <Container className="mobile-menu__content">
          <div className="mobile-menu__viewport">
            <div
              className="mobile-menu__index"
              ref={mobileIndexRef}
              aria-hidden={mobileActiveMenu !== null}
              inert={mobileActiveMenu ? true : undefined}
            >
              <ul className="mobile-menu__index-list">
                {menu.map((item) => (
                  <li key={item.key} data-mobile-menu-entry>
                    <button
                      className={`mobile-menu__index-link${
                        item.key === "services" &&
                        pathname.startsWith("/services")
                          ? " is-current"
                          : ""
                      }`}
                      type="button"
                      aria-controls="mobile-menu-detail"
                      onClick={() => {
                        setMobileDisplayMenu(item.key);
                        setMobileActiveMenu(item.key);
                      }}
                    >
                      <span>{item.label}</span>
                      <PixelArrow
                        className="mobile-menu__index-arrow"
                        direction="up-right"
                        shape="square"
                        size="small"
                        variant="corner"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="mobile-menu__detail"
              id="mobile-menu-detail"
              ref={mobileDetailRef}
              aria-hidden={mobileActiveMenu === null}
              inert={mobileActiveMenu ? undefined : true}
            >
              <ul className="mobile-menu__detail-list">
                {mobileItem.items.map((link) => {
                  const isCurrent =
                    link.href.startsWith("/") && pathname === link.href;

                  return (
                    <li key={link.label} data-mobile-detail-entry>
                      <a
                        className={`mobile-menu__detail-link${
                          isCurrent ? " is-current" : ""
                        }`}
                        href={link.href}
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileActiveMenu(null);
                        }}
                      >
                        <span>{link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <button
                className="mobile-menu__back"
                type="button"
                aria-label={`Back to the main menu from ${mobileItem.label}`}
                onClick={() => setMobileActiveMenu(null)}
                data-mobile-detail-entry
              >
                <PixelArrow
                  className="mobile-menu__back-arrow"
                  direction="left"
                  size="small"
                />
                <span>{mobileItem.label}</span>
              </button>
            </div>
          </div>

          <Button
            className="mobile-menu__cta"
            href="#contact"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileActiveMenu(null);
            }}
          >
            <span>Start a project</span>
            <PixelArrow
              className="mobile-menu__cta-arrow"
              direction="up-right"
              size="small"
            />
          </Button>
        </Container>
      </div>
    </header>
  );
});
