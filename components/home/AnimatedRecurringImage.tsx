const spheres = [
  { cx: 709, cy: 258, radius: 33, phase: "one" },
  { cx: 709, cy: 392, radius: 43, phase: "two" },
  { cx: 709, cy: 526, radius: 57, phase: "three" },
] as const;

const layers = [
  { outerX: 345, outerY: 198, innerX: 290, innerY: 165, phase: "one" },
  { outerX: 290, outerY: 165, innerX: 236, innerY: 132, phase: "two" },
  { outerX: 236, outerY: 132, innerX: 180, innerY: 100, phase: "three" },
  { outerX: 180, outerY: 100, innerX: 124, innerY: 70, phase: "four" },
  { outerX: 124, outerY: 70, innerX: 0, innerY: 0, phase: "five" },
] as const;

function ellipseRingPath(
  outerX: number,
  outerY: number,
  innerX: number,
  innerY: number,
) {
  const outerPath = [
    `M ${709 - outerX} 526`,
    `A ${outerX} ${outerY} 0 1 0 ${709 + outerX} 526`,
    `A ${outerX} ${outerY} 0 1 0 ${709 - outerX} 526`,
    "Z",
  ];

  if (innerX === 0 || innerY === 0) {
    return outerPath.join(" ");
  }

  return [
    ...outerPath,
    `M ${709 - innerX} 526`,
    `A ${innerX} ${innerY} 0 1 0 ${709 + innerX} 526`,
    `A ${innerX} ${innerY} 0 1 0 ${709 - innerX} 526`,
    "Z",
  ].join(" ");
}

export function AnimatedRecurringImage() {
  return (
    <svg
      className="why-card__image why-card__image--recurring"
      viewBox="0 0 1417 1110"
      role="img"
      aria-label="Animated recurring investment orbit"
    >
      <defs>
        {spheres.map((sphere) => (
          <clipPath id={`recurring-sphere-${sphere.phase}`} key={sphere.phase}>
            <circle cx={sphere.cx} cy={sphere.cy} r={sphere.radius + 3} />
          </clipPath>
        ))}
      </defs>

      <g aria-hidden="true">
        {layers.map((layer) => (
          <path
            className={`recurring-layer recurring-layer--${layer.phase}`}
            d={ellipseRingPath(
              layer.outerX,
              layer.outerY,
              layer.innerX,
              layer.innerY,
            )}
            fillRule="evenodd"
            key={layer.phase}
          />
        ))}
      </g>

      <image
        href="/card-icons/recurring-investment.png"
        width="1417"
        height="1110"
      />

      {spheres.map((sphere) => (
        <circle
          className="recurring-sphere__cover"
          cx={sphere.cx}
          cy={sphere.cy}
          r={sphere.radius + 3}
          key={`cover-${sphere.phase}`}
        />
      ))}

      {spheres.map((sphere) => (
        <g
          className={`recurring-sphere recurring-sphere--${sphere.phase}`}
          key={sphere.phase}
        >
          <circle
            className="recurring-sphere__fill"
            cx={sphere.cx}
            cy={sphere.cy}
            r={sphere.radius}
          />
          <image
            className="recurring-sphere__source"
            clipPath={`url(#recurring-sphere-${sphere.phase})`}
            href="/card-icons/recurring-investment.png"
            width="1417"
            height="1110"
          />
        </g>
      ))}
    </svg>
  );
}
