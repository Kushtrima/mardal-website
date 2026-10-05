/**
 * A word that rolls under the pointer — owner, 2026-10-05: "when hover the
 * arrows dont move but text all text in same time to rotate like vertically".
 *
 * The word twice in one cell: on hover the first turns up and away about the
 * axis of a cube half a line behind it while the second turns in from below,
 * the whole word at once. The copy is hidden from the screen reader, so the
 * control is named once.
 *
 * The control it sits in carries `data-roll`; the stylesheet turns the faces
 * when that control is hovered or focused (see `.roll` in globals.css). VIEW
 * ALL and the bar's Menu both wear it, and anything beside the word — an
 * arrow, a plus — stays still.
 */
export function RollingLabel({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll__face">{children}</span>
      <span className="roll__face roll__face--next" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
