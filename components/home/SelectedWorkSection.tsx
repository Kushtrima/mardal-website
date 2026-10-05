import Link from "next/link";
import { Container } from "../layout/Container";
import { selectedWork } from "../../content/home";
import { SelectedWorkReveal } from "./SelectedWorkReveal";
import { RollingLabel } from "../ui/RollingLabel";

/**
 * Selected Work — the owner's comp of 2026-10-05, under Human Creativity +
 * Artificial Intelligence.
 *
 * The heading at the opening's size with VIEW ALL standing on its last
 * baseline, then two pieces side by side on the page's halves: a tall picture
 * and a wide one, three lines under each. The halves meet on the middle rule of
 * the section above, so the two sections share one grid.
 *
 * The pieces open nothing (see `selectedWork` in content/home.ts), so they
 * carry no hover: the site gives a pointer effect only to a card that goes
 * somewhere.
 */
export function SelectedWorkSection() {
  return (
    <section
      className="selected-work"
      /* The page's hairlines run through it — see [data-ruled] in globals.css. */
      data-ruled
      id={selectedWork.id}
      aria-labelledby="selected-work-title"
      data-route-section
      data-selected-work
      /* Its own entrance, SelectedWorkReveal; the site's section entrance
         moving the same block at the same moment would fight it. */
      data-enter-mode="none"
    >
      <SelectedWorkReveal />

      <Container>
        <div className="selected-work__head">
          <h2 className="selected-work__title" id="selected-work-title">
            {selectedWork.titleLines.map((line) => (
              <span className="selected-work__title-line" key={line}>
                {/* What rises: the line is the mask it rises out of. */}
                <span className="selected-work__rise" data-selected-work-line>
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <Link
            className="selected-work__all"
            href={selectedWork.viewAll.href}
            data-selected-work-all
            data-roll
          >
            {/* The label rolls under the pointer (RollingLabel). */}
            <RollingLabel>{selectedWork.viewAll.label}</RollingLabel>
            {/* A thin arrow, up and to the right, as the comp draws it. It
                stays still while the word rolls. */}
            <svg
              className="selected-work__all-arrow"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M2 14 14 2M4.5 2H14v9.5" />
            </svg>
          </Link>
        </div>

        <ul className="selected-work__list">
          {selectedWork.items.map((item) => (
            <li
              className={`selected-work__item selected-work__item--${item.shape}`}
              key={item.key}
              data-selected-work-item
            >
              <figure className="selected-work__figure">
                <div className="selected-work__frame" data-selected-work-frame>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="selected-work__image"
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    decoding="async"
                    data-selected-work-image
                  />
                </div>
                <figcaption
                  className="selected-work__meta"
                  data-selected-work-meta
                >
                  <span className="selected-work__meta-line">{item.name}</span>
                  <span className="selected-work__meta-line">
                    {item.services}
                  </span>
                  <span className="selected-work__meta-line">
                    {item.location}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* Two more, in a format of their own: two squares side by side, close,
            on the page's second and third columns. */}
        <ul className="selected-work__features">
          {selectedWork.features.map((item) => (
            <li
              className="selected-work__feature"
              key={item.key}
              data-selected-work-item
              data-selected-work-feature
            >
              <figure className="selected-work__figure">
                <div className="selected-work__frame" data-selected-work-frame>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="selected-work__image"
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    decoding="async"
                    data-selected-work-image
                  />
                </div>
                <figcaption
                  className="selected-work__meta"
                  data-selected-work-meta
                >
                  <span className="selected-work__meta-line">{item.name}</span>
                  <span className="selected-work__meta-line">
                    {item.services}
                  </span>
                  <span className="selected-work__meta-line">
                    {item.location}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
