const columns = [
  { x: 634, top: 188, bottom: 1006, phase: 1 },
  { x: 553, top: 282, bottom: 958, phase: 3 },
  { x: 716, top: 332, bottom: 958, phase: 5 },
  { x: 470, top: 389, bottom: 912, phase: 2 },
  { x: 798, top: 398, bottom: 912, phase: 4 },
  { x: 553, top: 474, bottom: 958, phase: 5 },
  { x: 716, top: 477, bottom: 958, phase: 3 },
  { x: 389, top: 596, bottom: 864, phase: 4 },
  { x: 879, top: 535, bottom: 864, phase: 2 },
  { x: 470, top: 674, bottom: 912, phase: 1 },
  { x: 798, top: 596, bottom: 912, phase: 5 },
  { x: 553, top: 746, bottom: 958, phase: 2 },
  { x: 634, top: 704, bottom: 1006, phase: 4 },
] as const;

function Pillar({
  x,
  top,
  bottom,
  phase,
}: (typeof columns)[number]) {
  const halfWidth = 42;
  const depth = 24;

  return (
    <g className={`ipo-column ipo-column--phase-${phase}`}>
      <polygon
        className="ipo-column__face ipo-column__face--left"
        points={`${x - halfWidth},${top + depth} ${x},${top + depth * 2} ${x},${bottom} ${x - halfWidth},${bottom - depth}`}
      />
      <polygon
        className="ipo-column__face ipo-column__face--right"
        points={`${x},${top + depth * 2} ${x + halfWidth},${top + depth} ${x + halfWidth},${bottom - depth} ${x},${bottom}`}
      />
      <polygon
        className="ipo-column__face ipo-column__face--top"
        points={`${x},${top} ${x + halfWidth},${top + depth} ${x},${top + depth * 2} ${x - halfWidth},${top + depth}`}
      />
    </g>
  );
}

export function AnimatedIpoImage() {
  return (
    <svg
      className="why-card__image why-card__image--ipo"
      viewBox="300 150 670 900"
      role="img"
      aria-label="Animated investment columns"
    >
      {columns.map((column, index) => (
        <Pillar {...column} key={`${column.x}-${column.top}-${index}`} />
      ))}
    </svg>
  );
}
