/**
 * **The services page's grey hairlines, on through the footer** — owner,
 * 2026-10-06: "the grey vertical lines need to go to the end also in
 * footer". The wheel's five, each on a whole pixel, standing still; the
 * footer's own [data-ruled] draws them as one background, lighter and uneven
 * against these, so where the two met the line changed.
 */
export function ServicesFooterRules() {
  return (
    <div className="services-rules services-rules--grey" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <span className="services-rules__line" key={index} />
      ))}
    </div>
  );
}
