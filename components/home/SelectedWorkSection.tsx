import Link from "next/link";
import { Container } from "../layout/Container";
import { selectedWork } from "../../content/home";
import { deliveredEntries, stories } from "../../content/case-studies";
import { SelectedWorkReveal } from "./SelectedWorkReveal";
import { RollingLabel } from "../ui/RollingLabel";

/**
 * A piece of work as its project page has it: the name and the location
 * from the page's record, the picture from its card, the way in to the page.
 * (The service is the piece's own word, in `selectedWork`.) A name in
 * `selectedWork` with no page behind it fails the build rather than showing
 * a piece that opens nothing.
 */
function piece(slug: string) {
  const story = stories.find((entry) => entry.slug === slug);
  const card = deliveredEntries.find((entry) => entry.slug === slug);
  if (!story || !card) throw new Error(`Selected Work names "${slug}", which has no project page`);
  const fact = (label: string) => story.record.find((line) => line.label === label)?.value ?? "";
  return {
    href: `/case-studies/${slug}`,
    name: story.name,
    location: fact("LOCATION:"),
    src: card.image,
    srcSet: "imageSrcSet" in card && typeof card.imageSrcSet === "string" ? card.imageSrcSet : undefined,
  };
}

/** The frame each place gives its picture, as its width and height. */
const FRAMES = { tall: [607, 764], wide: [603, 427], square: [1000, 1000] } as const;

/** One piece: the picture in its frame, the three lines under it, the whole
 *  of it the way in to the project. The picture says nothing a reader needs —
 *  the name is right under it — so its alt is empty, as on the Clients
 *  cards. */
function Piece({
  slug,
  service,
  frame,
}: {
  slug: string;
  service: string;
  frame: keyof typeof FRAMES;
}) {
  const work = piece(slug);
  const [width, height] = FRAMES[frame];
  return (
    <Link className="selected-work__link" href={work.href}>
      <figure className="selected-work__figure">
        <div className="selected-work__frame" data-selected-work-frame>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="selected-work__image"
            src={work.src}
            srcSet={work.srcSet}
            sizes="(max-width: 40rem) 100vw, 50vw"
            alt=""
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            data-selected-work-image
          />
        </div>
        <figcaption className="selected-work__meta" data-selected-work-meta>
          <span className="selected-work__meta-line">{work.name}</span>
          <span className="selected-work__meta-line">{service}</span>
          <span className="selected-work__meta-line">{work.location}</span>
        </figcaption>
      </figure>
    </Link>
  );
}

/**
 * Selected Work — the owner's comp of 2026-10-05, under Human Creativity +
 * Artificial Intelligence.
 *
 * The heading at the opening's size with VIEW ALL standing on its last
 * baseline, then two pieces side by side on the page's halves: a tall picture
 * and a wide one, three lines under each. The halves meet on the middle rule of
 * the section above, so the two sections share one grid.
 *
 * The pieces are the owner's projects (2026-10-16), each opening its page;
 * they read their lines from that page (see `selectedWork` in
 * content/home.ts). No hover treatment yet — none has been asked for.
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
              key={item.project}
              data-selected-work-item
            >
              <Piece slug={item.project} service={item.service} frame={item.shape} />
            </li>
          ))}
        </ul>

        {/* Two more, in a format of their own: two squares side by side, close,
            on the page's second and third columns. */}
        <ul className="selected-work__features">
          {selectedWork.features.map((item) => (
            <li
              className="selected-work__feature"
              key={item.project}
              data-selected-work-item
              data-selected-work-feature
            >
              <Piece slug={item.project} service={item.service} frame="square" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
