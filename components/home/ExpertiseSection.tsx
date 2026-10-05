import { Container } from "../layout/Container";
import { expertise } from "../../content/home";
import { ExpertiseReveal } from "./ExpertiseReveal";
import { RollingLabel } from "../ui/RollingLabel";

/**
 * "Our expertise" — the owner's comp of 2026-10-05, under "about".
 *
 * The label on the first rule; then two rows, each a red cross standing just
 * before its word, the word on the third rule. Under the pointer a row opens
 * the services under its word — his second comp, Creative's four — and the
 * next row gives way. The word is a button as well, so a tap or the keyboard
 * opens it where there is no pointer to hover (ExpertiseReveal keeps its
 * `aria-expanded`).
 */
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
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
