import { houseHero } from "../../content/home";
import { Container } from "../layout/Container";
import { HouseHeroMotion } from "./HouseHeroMotion";

/**
 * The homepage's opening — the owner's concept of 2026-10-03.
 *
 * Served as its first state: the heading at the top and the photograph as a
 * band across the page column under it. Scrolling opens the photograph to the
 * whole screen, takes the heading to its foot in white and brings the sentence
 * in above it (HouseHeroMotion). Rendered this way round so the first paint is
 * the first state: a page that arrived in its last state would jump back the
 * moment the script ran.
 *
 * The photograph's frame stands inside the band (`data-house-slot`) and is
 * grown out of it, so the band is where the frame starts on the server and on
 * every resize, without a number for it anywhere.
 *
 * It replaced "Innovation lives here." over the bar field, which was deleted
 * on the owner's word the same day.
 */
export function HouseHero() {
  return (
    <section
      className="house-hero"
      aria-labelledby="house-hero-title"
      data-house-hero
    >
      <Container className="house-hero__inner">
        <h1
          className="house-hero__title"
          id="house-hero-title"
          data-house-title
        >
          {houseHero.titleLines.map((line) => (
            <span className="house-hero__title-line" key={line}>
              {line}
            </span>
          ))}
        </h1>

        <div className="house-hero__slot" data-house-slot>
          <div className="house-hero__frame" data-house-frame data-bar-dark>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="house-hero__image"
              src={houseHero.image.src}
              alt={houseHero.image.alt}
              width={houseHero.image.width}
              height={houseHero.image.height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <p className="house-hero__support" data-house-support>
          {houseHero.supportLines.map((line) => (
            <span className="house-hero__support-line" key={line}>
              {line}
            </span>
          ))}
        </p>
      </Container>

      <HouseHeroMotion />
    </section>
  );
}
