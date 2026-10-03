import Link from "next/link";
import { Container } from "../layout/Container";
import { work } from "../../content/home";
import { WorkReveal } from "./WorkReveal";

/**
 * Selected work: five pieces, scattered, under covers that come off.
 *
 * Owner, 2026-08-27, under Built across industries: five of the works from the
 * Clients page, not a generic design, GSAP allowed, and almost no text — a
 * company name somewhere.
 *
 * **The pictures are the section, and the words under each are facts.** The
 * first build read "minimal text" as "no pictures" and set the five names alone,
 * at the header size, under bars. His answer was the correct one: "only names,
 * no images, nothing." A section about work has to show the work. Under each
 * picture it was the name alone until 2026-09-30, when the owner asked for his
 * own portfolio's four lines: the company, then industry, service and place.
 *
 * **Scattered, not gridded.** Five plates on one grid row of twelve columns,
 * each in its own run of columns, each dropped by its own amount — so no two
 * share a top, a foot or a size. It is the arrangement the owner asked for on
 * the About page in his own words — smaller, and not aligned, something creative
 * — applied to the one other place on this site that sets a group of pictures. A
 * card grid is on this site's rejected list and five equal boxes in a row is the
 * logo strip every competitor has; neither is this.
 *
 * **The covers are the redaction bars**, which are the one motif this site owns.
 * Each plate arrives under a solid tint and the covers come off one at a time as
 * the block is watched, left to right — so the section resolves from five
 * colours into five pictures. Nothing moves, nothing scales: the only thing that
 * happens is that the covers leave.
 *
 * ⚠ **Nothing here is Mardal's.** The names are the Clients page's placeholders
 * and the pictures are stock frames off a third party's server. Both are pinned
 * in `tests/rendered-html.test.mjs`, beside the assertions holding the same two
 * things on the Clients index — see `content/home.ts`.
 *
 * The reveal is in `WorkReveal`. What matters here is that the markup is the
 * FINISHED state: the pictures are plain `img`s and the covers are empty spans
 * the stylesheet leaves collapsed. A reader with no JavaScript, or one who has
 * asked for no motion, gets the five pictures — the design arriving rather than
 * a fallback for it.
 */
export function WorkSection() {
  return (
    <section
      className="work-section"
      id={work.id}
      aria-labelledby="work-title"
      data-route-section
    >
      <WorkReveal />

      <Container className="work-layout">
        <h2 className="work-title" id="work-title">
          {work.title}
        </h2>

        <ul className="work-scatter" data-work-scatter>
          {work.items.map((item) => (
            <li className="work-piece" key={item.slug}>
              {/* **The link wraps the whole piece, picture and lines.** On the
                  Clients index it wraps the plate alone and carries an
                  `aria-label`, because the name there is an `h3` outside it and
                  the anchor would otherwise announce itself with nothing to say.
                  Here the lines are inside, so the link is named by what it
                  shows — the company first, then its industry, service and
                  place — and no label is written.

                  `data-opens` is the hook the hover treatment hangs off, and it
                  is on the link rather than on the `li` so that the treatment and
                  the click target are the same element. Nothing about it is a
                  Clients class: the stylesheet answers to `[data-opens]` and
                  `[data-opens-mark]`, so this section adopts the whole thing —
                  the picture darkening under a drawn cross — without a line of
                  CSS written for it. See `href` in `content/home.ts` for why
                  every piece is allowed to carry it. */}
              <Link className="work-piece__link" href={item.href} data-opens>
                {/* The tint is the plate's own ground as well as its cover,
                    which is what the Clients card does and for the same reason:
                    it is what stands in the box while a remote frame is in
                    flight, and what is left there if it never arrives. A plate
                    whose picture fails is a coloured panel rather than a broken
                    one.

                    `data-opens-mark` says "this is the box the treatment paints
                    in" — the wash and the cross are its two pseudo-elements. */}
                <div className="work-piece__plate" data-opens-mark>
                  {/* Decorative, so `alt` is empty. Describing one of these to a
                      screen reader would be describing a placeholder — they are
                      photographs of nothing to do with the work. The dimensions
                      are the intrinsic 16:9 the frame arrives at, so the scatter
                      does not move as the pictures land. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="work-piece__art"
                    src={item.image}
                    alt=""
                    width="640"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* The cover. Empty, silent, and collapsed until `WorkReveal`
                      puts it on. It sits above the hover treatment as well as
                      above the picture — see the stylesheet — so a pointer
                      arriving before the covers have left finds a plain tint
                      rather than a cross drawn on one. */}
                  <span
                    className="work-piece__cover"
                    aria-hidden="true"
                    data-work-cover
                  />
                </div>

                {/* The name, then three facts in the quieter grey, one to a
                    line — owner, 2026-09-30, from his own portfolio. All four
                    at paragraph size in the normal face: this site has three
                    sizes and anything that is not a heading is this one. */}
                <p className="work-piece__name">{item.name}</p>
                <p className="work-piece__industry">{item.industry}</p>
                <p className="work-piece__service">{item.service}</p>
                <p className="work-piece__location">{item.location}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
