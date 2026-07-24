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
import { Button } from "../ui/Button";
import { Container } from "./Container";

const navigation = [
  {
    key: "services",
    label: "Services",
    eyebrow: "Mardal Services",
    description: "Build, connect, and automate the systems behind your growth.",
    href: "#services",
    items: [
      { label: "AI & Automation", href: "#ai-automation" },
      { label: "System Integration", href: "#system-integration" },
      { label: "CRM Solutions", href: "#crm-solutions" },
      { label: "Custom Software", href: "#custom-software" },
      { label: "Web Platforms", href: "#web-platforms" },
    ],
  },
  {
    key: "solutions",
    label: "Solutions",
    eyebrow: "Solutions by Industry",
    description: "Technology shaped around the realities of your sector.",
    href: "#solutions",
    items: [
      { label: "Financial Services", href: "#financial-services" },
      { label: "Healthcare", href: "#healthcare" },
      { label: "Manufacturing", href: "#manufacturing" },
      { label: "Automotive", href: "#automotive" },
      { label: "Public Sector", href: "#public-sector" },
    ],
  },
  {
    key: "products",
    label: "Products",
    eyebrow: "Mardal Products",
    description: "Focused digital products designed and built by Mardal.",
    href: "#products",
    items: [
      { label: "Arvena AI", href: "#arvena-ai" },
      { label: "Ftesa.co", href: "#ftesa" },
      { label: "Ihrauto", href: "#ihrauto" },
    ],
  },
  {
    key: "case-studies",
    label: "Case Studies",
    eyebrow: "Mardal Projects",
    description: "See how our ideas become useful, working products.",
    href: "#case-studies",
    items: [{ label: "ArvenaAI", href: "#arvena-ai-case-study" }],
  },
  {
    key: "company",
    label: "Company",
    eyebrow: "Inside Mardal",
    description: "Meet the people, thinking, and culture behind our work.",
    href: "#company",
    items: [
      { label: "About", href: "#about" },
      { label: "Team", href: "#team" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
] as const;

type NavigationKey = (typeof navigation)[number]["key"];

export const SiteHeader = forwardRef<HTMLElement>(function SiteHeader(
  _props,
  navigationRef,
) {
  const headerRef = useRef<HTMLElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const [activeMenu, setActiveMenu] = useState<NavigationKey>("services");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] =
    useState<NavigationKey | null>("services");
  const activeItem =
    navigation.find((item) => item.key === activeMenu) ?? navigation[0];

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

    gsap.killTweensOf([menu, entries]);

    if (reducedMotion) {
      gsap.set(menu, {
        autoAlpha: megaMenuOpen ? 1 : 0,
        pointerEvents: megaMenuOpen ? "auto" : "none",
        y: 0,
      });
      return;
    }

    if (megaMenuOpen) {
      gsap.set(menu, { pointerEvents: "auto", visibility: "visible" });
      gsap.fromTo(
        menu,
        { autoAlpha: 0, scaleY: 0.985, y: -12 },
        {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power3.out",
          scaleY: 1,
          transformOrigin: "top center",
          y: 0,
        },
      );
      gsap.fromTo(
        entries,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          delay: 0.05,
          duration: 0.38,
          ease: "power3.out",
          stagger: 0.035,
          y: 0,
        },
      );
      return;
    }

    gsap.to(menu, {
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(menu, { pointerEvents: "none", y: -8 });
      },
      y: -8,
    });
  }, [activeMenu, megaMenuOpen]);

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
      if (event.matches) setMobileMenuOpen(false);
    }

    desktopViewport.addEventListener("change", handleViewportChange);

    return () => {
      desktopViewport.removeEventListener("change", handleViewportChange);
    };
  }, []);

  return (
    <header
      className="site-header"
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
      <Container wide>
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
            {navigation.map((item) => (
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
            <div className="mega-menu__meta">
              <p className="mega-menu__eyebrow" data-mega-entry>
                {activeItem.eyebrow}
              </p>
              <p className="mega-menu__description" data-mega-entry>
                {activeItem.description}
              </p>
              <a
                className="mega-menu__view-all"
                href={activeItem.href}
                data-mega-entry
                onClick={() => setMegaMenuOpen(false)}
              >
                View all {activeItem.label}
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <ul className="mega-menu__links">
              {activeItem.items.map((item, index) => (
                <li key={item.label} data-mega-entry>
                  <a
                    className="mega-menu__link"
                    href={item.href}
                    onClick={() => setMegaMenuOpen(false)}
                  >
                    <span className="mega-menu__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mega-menu__label">{item.label}</span>
                    <span className="mega-menu__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </Container>

      <div
        className={`mobile-menu${mobileMenuOpen ? " mobile-menu--open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!mobileMenuOpen}
        inert={mobileMenuOpen ? undefined : true}
      >
        <Container className="mobile-menu__content" wide>
          <div className="mobile-menu__categories">
            {navigation.map((item) => {
              const isOpen = mobileActiveMenu === item.key;

              return (
                <div className="mobile-menu__category" key={item.key}>
                  <button
                    className="mobile-menu__category-trigger"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setMobileActiveMenu((current) =>
                        current === item.key ? null : item.key,
                      );
                    }}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                  </button>

                  <div
                    className={`mobile-menu__submenu${
                      isOpen ? " mobile-menu__submenu--open" : ""
                    }`}
                  >
                    <div>
                      <p className="mobile-menu__eyebrow">{item.eyebrow}</p>
                      <ul>
                        {item.items.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <a
                        className="mobile-menu__view-all"
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View all {item.label} ↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="mobile-menu__cta" href="#contact">
            Start a project
          </Button>
        </Container>
      </div>
    </header>
  );
});
