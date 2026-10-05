import { Container } from "../layout/Container";
import { aboutIntro } from "../../content/home";
import { AboutIntroReveal } from "./AboutIntroReveal";

/**
 * "about" — the owner's comp of 2026-10-05, under Selected Work.
 *
 * The word at the headings' size with its "o" set as a square of the site's
 * red, standing on the baseline at the height of the lowercase; the paragraph
 * beside it from the second rule, its first capitals level with the top of the
 * "b". On the page's grid like the sections around it, and ruled with them.
 */
export function AboutIntroSection() {
  const { before, letter, after } = aboutIntro.title;

  return (
    <section
      className="about-intro"
      /* The page's hairlines run through it — see [data-ruled] in globals.css. */
      data-ruled
      id={aboutIntro.id}
      aria-labelledby="about-intro-title"
      data-route-section
      data-about-intro
      /* Its own entrance, AboutIntroReveal; the site's section entrance
         moving the same block at the same moment would fight it. */
      data-enter-mode="none"
    >
      <AboutIntroReveal />

      <Container className="about-intro__layout">
        <h2 className="about-intro__title" id="about-intro-title">
          <span className="about-intro__line">
            {/* What rises: the line is the mask it rises out of. */}
            <span className="about-intro__rise" data-about-line>
              {before}
              {/* The "o", drawn as the red square; the letter is still there
                  for a screen reader and for anyone who copies the word. */}
              <span className="about-intro__mark" data-about-mark>
                <span className="visually-hidden">{letter}</span>
              </span>
              {after}
            </span>
          </span>
        </h2>

        <p className="about-intro__copy" data-about-copy>
          {aboutIntro.copyLines.map((line, index) => (
            <span className="about-intro__copy-line" key={line}>
              {/* The space keeps the words apart where the lines run on. */}
              {index < aboutIntro.copyLines.length - 1 ? `${line} ` : line}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
