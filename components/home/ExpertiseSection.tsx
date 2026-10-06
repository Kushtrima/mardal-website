import Link from "next/link";
import { Container } from "../layout/Container";
import { expertise } from "../../content/home";
import { ExpertiseReveal } from "./ExpertiseReveal";
import { RollingLabel } from "../ui/RollingLabel";

/**
 * "Our expertise" — the owner's comp of 2026-10-05, under "about".
 *
 * The label on the first rule; then three rows (Artificial Intelligence added
 * on 2026-10-06), each a red cross on the second rule with its word straight
 * after it. Under the pointer a row opens
 * the services under its word — his second comp, Creative's four — and the
 * next row gives way. The word is a button as well, so a tap or the keyboard
 * opens it where there is no pointer to hover (ExpertiseReveal keeps its
 * `aria-expanded`).
 */
/* Every service of all three rows — see `.expertise__sizer`. */
const allServices = expertise.groups.flatMap((group) => group.items);

export function ExpertiseSection() {
  return (
    <section
      className="expertise"
      /* The page's hairlines run through it — see [data-ruled] in globals.css. */
      data-ruled
      id={expertise.id}
      aria-labelledby="expertise-title"
      data-route-section
      data-expertise
      /* Its own entrance, ExpertiseReveal; the site's section entrance
         moving the same block at the same moment would fight it. */
      data-enter-mode="none"
    >
      <ExpertiseReveal />

      <Container className="expertise__layout">
        <h2 className="expertise__label" id="expertise-title" data-expertise-label>
          {expertise.labelLines.map((line) => (
            <span className="expertise__label-line" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <ul className="expertise__list">
          {expertise.groups.map((group) => (
            /* The whole row is the hover: its word turns red and rolls
               (RollingLabel, `data-roll`) while its services open. */
            <li
              className="expertise__row"
              key={group.key}
              data-expertise-row
              data-roll
            >
              {/* Drawn, not typed, and drawn a stroke at a time on arrival. */}
              <span className="expertise__cross" aria-hidden="true">
                <span
                  className="expertise__stroke expertise__stroke--up"
                  data-expertise-up
                />
                <span
                  className="expertise__stroke expertise__stroke--across"
                  data-expertise-across
                />
              </span>

              <div className="expertise__body">
                <h3 className="expertise__title">
                  <button
                    className="expertise__toggle"
                    type="button"
                    aria-expanded="false"
                    aria-controls={`expertise-${group.key}`}
                    data-expertise-toggle
                  >
                    {/* What rises: the line is the mask it rises out of. */}
                    <span className="expertise__word-line">
                      <span className="expertise__word" data-expertise-word>
                        <RollingLabel>{group.title}</RollingLabel>
                      </span>
                    </span>
                  </button>
                </h3>

                <div className="expertise__panel" id={`expertise-${group.key}`}>
                  <ul className="expertise__subs">
                    {group.items.map((item) => (
                      <li className="expertise__sub" key={item}>
                        {/* The word, on its own redaction bar. */}
                        <span className="expertise__sub-word">{item}</span>
                      </li>
                    ))}
                    {/* Unseen and of no height: every row's services, so
                        each list is as wide as the widest of all three and
                        the three start from one line. */}
                    <li className="expertise__sizer" aria-hidden="true">
                      {allServices.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Selected Work's VIEW ALL, at the section's bottom right: its word
            rolls under the pointer, its thin arrow stays still. */}
        <Link className="expertise__all" href={expertise.viewAll.href} data-roll>
          <RollingLabel>{expertise.viewAll.label}</RollingLabel>
          <svg
            className="expertise__all-arrow"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2 14 14 2M4.5 2H14v9.5" />
          </svg>
        </Link>
      </Container>
    </section>
  );
}
