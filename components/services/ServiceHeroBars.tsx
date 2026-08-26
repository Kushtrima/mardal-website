import {
  bandsOf,
  barsPath,
  trailingOffset,
  type Pattern,
} from "../../lib/pattern-drift";

/**
 * A service hero pattern drawn as elements rather than masked out of a PNG.
 *
 * Server-rendered on purpose. The drawing is in the HTML, so it is there with
 * scripting off, before hydration, and for a reader who has asked for no
 * motion — `PatternDrift` only moves groups that are already on the page.
 *
 * **Each band is drawn twice.** The second copy stands one canvas width away on
 * the side its band travels from, which is what makes the belt seamless: after
 * a lap of exactly that width the trailing copy is standing where the leading
 * one started. Until something moves them, and for anyone nothing moves them
 * for, that copy is outside the viewBox and clipped away — so the resting
 * artwork is the trace, unchanged, and the machinery costs nothing to look at.
 *
 * **One path per copy, not one rect per bar.** Two `<rect>` elements sharing an
 * edge are rasterised separately and leave a pale line along it, which the owner
 * saw as soon as the belt was up; subpaths of one path do not. It is also what
 * made it affordable to put the trace's one-pixel slivers back, since subpaths
 * are not elements — and both changes were needed. See `barsPath` for the
 * numbers.
 *
 * Takes the artwork rather than knowing one, because the other three heroes are
 * still PNG masks and will want this when their turn comes.
 */
export function ServiceHeroBars({
  className,
  pattern: { width, height, bars },
}: {
  className: string;
  pattern: Pattern;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
      data-pattern-bars
    >
      {bandsOf(bars).map((band) => (
        <g
          key={band.index}
          data-pattern-band={band.index}
          data-pattern-direction={band.direction}
          data-pattern-duration={band.duration}
        >
          <path d={barsPath(band.bars)} />
          <path
            d={barsPath(band.bars)}
            transform={`translate(${trailingOffset(band.direction, width)} 0)`}
          />
        </g>
      ))}
    </svg>
  );
}
