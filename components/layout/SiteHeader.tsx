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

export const SiteHeader = forwardRef<HTMLElement>(function SiteHeader(
  _props,
  navigationRef,
) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
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

  function scheduleMegaMenuClose(delay = 170) {
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

    gsap.killTweensOf([menu, entries]);

    if (reducedMotion) {
      gsap.set(menu, {
        autoAlpha: megaMenuOpen ? 1 : 0,
        pointerEvents: megaMenuOpen ? "auto" : "none",
      });
      gsap.set(entries, { autoAlpha: 1, clipPath: "none" });
      return;
    }

    /* The panel does not move. The ground fades up and the words are uncovered
       left to right inside it, one after the next — the same direction the
       footer rules wipe in, so the two read as one idea.

       Clipped rather than faded or slid: a fade makes a word arrive everywhere
       at once and says nothing about direction, and a slide moves the word off
       the line it belongs on. An inset from the right leaves each name exactly
       where it will end up and only chooses when you can see it.

       All of that is the ARRIVAL, and it belongs to arriving. Moving from one
       menu to the next along the bar is not an arrival: the ground is already
       there and the reader is already reading, so re-running it would flash the
       white and re-deal the names on every word passed over. Switching swaps
       the list and leaves the panel alone. */
    if (megaMenuOpen) {
      gsap.set(menu, { pointerEvents: "auto", visibility: "visible" });

      if (wasOpen) {
        gsap.set(menu, { autoAlpha: 1 });
        gsap.set(entries, { autoAlpha: 1, clipPath: "none" });
        return;
      }

      /* The ground on its own, and quicker than the words: it has to be under
         them before they are worth reading. */
      gsap.fromTo(
        menu,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
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
          /* Seven items is the longest menu, so the last one starts at 0.33s
             and the run is done by about 0.88s. The first three names are
             readable inside 400ms, which is what matters: you are choosing
             from the top of the list while the foot of it is still arriving. */
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
      /* Slower than it was, to match the ground coming up. A 200ms exit against
         a 400ms arrival reads as the white being snatched away. */
      duration: 0.32,
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

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
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
