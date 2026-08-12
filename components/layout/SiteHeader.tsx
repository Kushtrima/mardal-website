"use client";

import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navTriggerIntent } from "../../lib/nav-keys";
import { Button } from "../ui/Button";
import { PixelArrow } from "../ui/PixelArrow";
import { Container } from "./Container";
import { footer, menu } from "../../content/home";

type NavigationKey = (typeof menu)[number]["key"];

/**
 * How far past the white sheet the pointer may stray before the menu is counted
 * as left.
 *
 * Only one edge is ever really tested against this. The sheet reaches the top,
 * right and bottom of the window, so the single edge there is anything to cross
 * is the left one, onto the page beside it — and the slop forgives a pointer
 * clipping that edge on its way down the names.
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
  /**
   * A request to put focus inside the panel, held until the panel is actually
   * there to receive it.
   *
   * It cannot be done in the key handler. Opening the panel is a state change, so
   * at the moment the key is pressed the panel may still be the closed one — and
   * a closed panel is `inert`, which means `focus()` on anything inside it does
   * nothing at all and fails silently. Held as state instead, the effect below
   * runs after the commit that removed `inert`, which is the first moment the
   * links exist and can take focus.
   */
  const [panelEntry, setPanelEntry] = useState<"first" | "last" | null>(null);
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

  /* At once, not on the timer. The timer is for a pointer that has wandered off
     the panel and may yet come back; this is for one that has arrived somewhere
     with no panel behind it, and waiting 60ms there would leave the last menu's
     list standing under a word that does not own it.

     It matters because the triggers sit inside the panel's own box — that is
     what keeps the menu open while you run along the bar — so nothing else in
     here would close it. Reaching a plain link has to say so itself. */
  function closeMegaMenu() {
    clearCloseTimer();
    setMegaMenuOpen(false);
  }

  /* 170ms before, which was insurance against a gap between the bar and the
     panel that no longer exists: the ground reaches the top of the window and
     the bar is drawn on it, so there is nothing to cross and nothing to
     forgive. What is left is only enough to ignore a pointer clipping a corner
     on its way past. */
  function scheduleMegaMenuClose(delay = 60) {
    /* Once, and then left alone. This used to clear the pending timer and start
       a new one on every call, which is fine for a single event and wrong for
       the one thing that actually calls it: a pointer moving off the menu fires
       pointermove the whole way, and every one of those restarted the
       countdown. The menu would not close while the mouse was moving — only
       once it stopped, somewhere else entirely, which is indistinguishable from
       it not closing at all.

       It is also why this kept passing here. A scripted hover jumps to a
       coordinate and stops, so the timer always got to run; a hand never
       stops. */
    if (closeTimerRef.current !== undefined) return;

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = undefined;
      setMegaMenuOpen(false);
    }, delay);
  }

  useLayoutEffect(() => {
    const menu = megaMenuRef.current;
    if (!menu) return;

    /* Three sets, because the foot belongs to two of the three moves and not to
       the third. It arrives with the names and it leaves with them, but running
       along the bar does not change it — the same small print and the same way
       in are already there — so replaying it on every switch was the panel
       announcing something that had not happened.

       It gets a handle of its own all the same, because "not replayed" turned
       out to mean "never put back". The foot is the LAST element in `entries`,
       so the arrival un-covers it last of all — with the seven sectors under
       Clients its edge does not even start travelling until 0.6s in and does
       not land until 1.15s. Move along the bar inside that second, which is
       exactly what running along a menu is, and the switch below kills the
       arrival mid-wipe and then restores only the names. The foot stayed at
       `inset(0 100% 0 0)` — clipped to nothing — and no later switch ever
       touched it again, so the legal line and the way in were simply gone for
       the rest of the visit. */
    const entries = menu.querySelectorAll(
      "[data-mega-entry], [data-mega-foot]",
    );
    const names = menu.querySelectorAll("[data-mega-entry]");
    const foot = menu.querySelectorAll("[data-mega-foot]");
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
        /* The foot is not replayed here — it is put back. A switch may have
           interrupted an arrival that had not finished uncovering it, and this
           branch is the only thing that runs afterwards, so if it does not
           state the foot's resting position nothing ever will. Set rather than
           tweened, for the same reason the list is not re-staggered: the small
           print and the way in did not change, so they have nowhere to arrive
           from. Caught mid-wipe it lands early, which is a great deal better
           than the alternative it replaces. */
        gsap.set(foot, { autoAlpha: 1, clipPath: "none", y: 0 });
        /* Up on the spot. This is a change of subject, not an entrance, so it
           stays where it is — but at 180ms it read as a flicker rather than a
           change, so it is nearly twice that now: long enough to see one list
           become another, short enough that running along the bar is not a
           queue. */
        gsap.fromTo(
          names,
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
        /* `y` is stated even though the arrival does not use it, because the
           switch does: a switch killed part-way leaves its names somewhere
           between 14 and 0, and an arrival that only speaks about the clip
           would inherit that offset and keep it. Every branch has to say where
           everything it can reach is standing, or the one that stays quiet is
           the one that strands something. */
        { autoAlpha: 1, clipPath: "inset(0 100% 0 0)", y: 0 },
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

    /* The arrival, run backwards.
       This was a flat 180ms fade of the whole panel, on the argument that an
       exit is in the way of whatever was wanted instead. That is true of its
       length and not of its shape: leaving on a fade meant the menu left in a
       way it never arrived, and the one motion the panel has was only ever seen
       half of.
       So the same two layers, the same order reversed. The names are covered
       from the bottom up, each by the edge that uncovered it travelling back
       the way it came, and the ground darkens last — the white is the thing
       the names are written on, so it cannot go before them. */
    gsap.set(menu, { pointerEvents: "none" });

    gsap.to(entries, {
      clipPath: "inset(0 100% 0 0)",
      duration: 0.4,
      ease: "power2.inOut",
      /* From the end: the last name to arrive is the first to go, which is what
         makes this read as the arrival reversed rather than a second, different
         wipe that happens to run the other way. */
      stagger: { each: 0.04, from: "end" },
    });

    gsap.to(ground, {
      autoAlpha: 0,
      duration: 0.45,
      ease: "power1.inOut",
      /* Held back the way the names were held back coming in, so the last name
         is covered as the white is going rather than after it has gone.
         The whole exit lands at 0.63s against the arrival's 1.10s. A true
         reversal at full length would leave the white standing in front of the
         page for over a second after the pointer had already left it, and the
         old fade was right about that much. */
      delay: 0.18,
      onComplete: () => {
        gsap.set(menu, { autoAlpha: 0 });
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

  /**
   * Hands focus to the panel once the panel exists.
   *
   * Waits on `megaMenuOpen` as well as the request, because those two arrive in
   * the same commit and the panel is `inert` until they do. `activeMenu` is a
   * dependency for the case where the key opens a different entry than the one
   * showing: the links are rebuilt for the new entry, and focus has to land in
   * the list a reader asked for rather than the one that was up.
   *
   * `.mega-menu__link` is the entry list only — the panel's foot also holds the
   * legal links and the way in, and `first` has to mean the first name in the
   * menu rather than the first focusable thing in the box.
   */
  useEffect(() => {
    if (!panelEntry || !megaMenuOpen) return;

    const links = megaMenuRef.current?.querySelectorAll<HTMLElement>(
      ".mega-menu__link",
    );

    /* Cleared either way. A request that cannot be met has to be dropped rather
       than left standing, or the next unrelated render would spend it. */
    setPanelEntry(null);
    if (!links?.length) return;

    (panelEntry === "first" ? links[0] : links[links.length - 1]).focus();
  }, [panelEntry, megaMenuOpen, activeMenu]);

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
     * asks the only question that matters — is the pointer over the panel — and
     * answers it on every move. A miscounted enter or leave cannot strand it
     * open, because nothing is being counted.
     */
    function handlePointerMove(event: globalThis.PointerEvent) {
      if (event.pointerType !== "mouse") return;

      const panel = megaMenuRef.current;
      if (!panel) return;

      /* The white sheet, and nothing else. It is what anyone using this sees as
         the menu, so it is what being on the menu has to mean.
         This tested three boxes before — the bar, the names, the legal line —
         and was wrong in both directions at once. The sheet runs the full
         height of the window while the names sit in the top few centimetres of
         it, so the five hundred pixels of empty white between the names and the
         legal line counted as outside: the menu closed under a pointer that was
         plainly still on it. And the bar runs on past the logo, well clear of
         the white, so it counted a pointer over the wordmark as still on the
         menu.
         One box covers both, and the trigger row needs no box of its own: the
         panel starts at the grid line the nav content starts at, less the band
         down its left, so the triggers are inside it at every width. */
      const box = panel.getBoundingClientRect();

      if (
        event.clientX >= box.left - KEEP_OPEN_PADDING &&
        event.clientX <= box.right + KEEP_OPEN_PADDING &&
        event.clientY >= box.top - KEEP_OPEN_PADDING &&
        event.clientY <= box.bottom + KEEP_OPEN_PADDING
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
            {menu.map((item) => {
              /* Two questions, asked separately, both answered by the entry
                 itself rather than by a flag set for the header's benefit.

                 A word whose href is a route has a page, so it is a link and
                 clicking it goes there. A word with children has a panel, so
                 hovering it opens them and it carries the chevron that says so.
                 Services, Products and Company are the second without the first
                 — their hrefs are anchors to sections that are not on the page —
                 so they stay buttons, with nothing to navigate to and a panel to
                 toggle. Clients is the first entry to be both. */
              const isPage = item.href.startsWith("/");
              const hasPanel = item.items.length > 0;

              /* Arriving at a word does the same thing whichever element it is:
                 open its list, or close whatever list is open if it has none.
                 The closing half matters because the words sit inside the
                 panel's own box — that is what keeps it open while you run
                 along the bar — so a word with nothing behind it is the only
                 thing that can say so. */
              const reach = () =>
                hasPanel ? openMegaMenu(item.key) : closeMegaMenu();

              /* The keyboard's way into the panel, and the reason it needs one:
                 the panel is shared and rendered after this whole list, so Tab
                 from a trigger lands on the NEXT trigger, which opens its own
                 panel on focus. A reader tabbing along the bar watched the list
                 they wanted disappear before they could reach it, and only the
                 last entry's panel — the one with nothing after it to tab to —
                 was ever reachable. Five service-page links could not be got at
                 from the header by keyboard at all.

                 Which keys mean this lives in lib/nav-keys.ts with its own test,
                 not here: it is the decision, and it includes one case with no
                 symptom yet (an entry with no children must not swallow the key).

                 The panel this focuses is already the right one — arriving at the
                 word opened it — so this is a focus move and not an open. */
              const onTriggerKeyDown = (
                event: ReactKeyboardEvent<HTMLElement>,
              ) => {
                const intent = navTriggerIntent(event.key, hasPanel);
                if (intent === "pass") return;

                /* Only now. Taken earlier this would stop the page scrolling on
                   every ArrowDown pressed anywhere on the bar. */
                event.preventDefault();
                openMegaMenu(item.key);
                setPanelEntry(intent === "enter-first" ? "first" : "last");
              };

              return (
                <li key={item.key}>
                  {isPage ? (
                    <Link
                      className={`nav-link${hasPanel ? " nav-trigger" : ""}`}
                      href={item.href}
                      /* No onClick: the click belongs to the link. The panel is
                         opened by arriving at the word and closed by leaving
                         it, which is the whole of its behaviour here — a word
                         that both goes somewhere and toggles something on the
                         same press would be neither. */
                      aria-expanded={
                        hasPanel
                          ? megaMenuOpen && activeMenu === item.key
                          : undefined
                      }
                      aria-controls={hasPanel ? "desktop-mega-menu" : undefined}
                      aria-current={
                        pathname === item.href ? "page" : undefined
                      }
                      data-nav-trigger={hasPanel || undefined}
                      id={hasPanel ? `nav-trigger-${item.key}` : undefined}
                      onFocus={reach}
                      onKeyDown={onTriggerKeyDown}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") reach();
                      }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className="nav-link nav-trigger"
                      type="button"
                      aria-expanded={megaMenuOpen && activeMenu === item.key}
                      aria-controls="desktop-mega-menu"
                      data-nav-trigger
                      id={`nav-trigger-${item.key}`}
                      onClick={() => {
                        if (megaMenuOpen && activeMenu === item.key) {
                          setMegaMenuOpen(false);
                          return;
                        }

                        openMegaMenu(item.key);
                      }}
                      onFocus={reach}
                      onKeyDown={onTriggerKeyDown}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") reach();
                      }}
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              );
            })}
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

          {/* Named by the word that opened it. One panel serves all four
              entries, so without this a reader who has just moved focus into it
              is told only "navigation" and has to infer which list they are
              standing in from the links themselves. */}
          <div
            className="mega-menu"
            id="desktop-mega-menu"
            ref={megaMenuRef}
            aria-hidden={!megaMenuOpen}
            aria-labelledby={`nav-trigger-${activeMenu}`}
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

            {/* The foot of the panel, on the two edges the names above it run
                between: the small print on the left, the way in on the right.
                One element as far as the animation is concerned. */}
            <div className="mega-menu__foot" data-mega-foot>
              {/* The same line the footer carries. It is the one place these
                  can be reached without first travelling the whole page. */}
              <div className="mega-menu__legal">
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

              {/* Moved off the bar. It stood there in white on the black
                  header, and the header had to repaint it black every time the
                  menu opened underneath it. Here it only ever stands on white
                  and can simply be the ink. */}
              <Button
                className="mega-menu__cta"
                href="#contact"
                variant="secondary"
                onClick={() => setMegaMenuOpen(false)}
              >
                Hire us
              </Button>
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
                {menu.map((item) => {
                  /* Only the first of the bar's two questions is asked here,
                     because the second one is about hovering and there is no
                     hovering on a phone. A word with a page is a link to it and
                     a tap goes there — which is what a tap on Clients means on
                     the desktop bar too. Its seven sectors are a hover
                     affordance and stay one; on this screen they are read on
                     the homepage, in the section they belong to.
                     The index keeps its own mark either way, so the list still
                     reads as one list — here the arrow means the page rather
                     than the screen behind the word. */
                  const isLink = item.href.startsWith("/");
                  const isCurrent = isLink
                    ? pathname === item.href
                    : item.key === "services" &&
                      pathname.startsWith("/services");
                  const className = `mobile-menu__index-link${
                    isCurrent ? " is-current" : ""
                  }`;
                  const mark = (
                    <PixelArrow
                      className="mobile-menu__index-arrow"
                      direction="up-right"
                      shape="square"
                      size="small"
                      variant="corner"
                    />
                  );

                  return (
                    <li key={item.key} data-mobile-menu-entry>
                      {isLink ? (
                        <Link
                          className={className}
                          href={item.href}
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileActiveMenu(null);
                          }}
                        >
                          <span>{item.label}</span>
                          {mark}
                        </Link>
                      ) : (
                        <button
                          className={className}
                          type="button"
                          aria-controls="mobile-menu-detail"
                          onClick={() => {
                            setMobileDisplayMenu(item.key);
                            setMobileActiveMenu(item.key);
                          }}
                        >
                          <span>{item.label}</span>
                          {mark}
                        </button>
                      )}
                    </li>
                  );
                })}
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
