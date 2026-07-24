const parts = ["small", "middle", "large", "ball"] as const;

export function AnimatedSupportImage() {
  return (
    <svg
      className="why-card__image why-card__image--support"
      viewBox="0 0 1416 1111"
      role="img"
      aria-label="Animated support orbit"
    >
      <defs>
        {parts.map((part) => (
          <mask
            id={`support-${part}-mask`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1416"
            height="1111"
            key={part}
          >
            <image
              href={`/card-icons/support-mask-${part}.png`}
              width="1416"
              height="1111"
            />
          </mask>
        ))}
      </defs>

      <image href="/card-icons/support.png" width="1416" height="1111" />

      <g aria-hidden="true">
        {parts.map((part) => (
          <rect
            className={`support-color-part support-color-part--${part}`}
            x="0"
            y="0"
            width="1416"
            height="1111"
            mask={`url(#support-${part}-mask)`}
            key={part}
          />
        ))}
      </g>

      <image
        className="support-outline-overlay"
        href="/card-icons/support.png"
        width="1416"
        height="1111"
        aria-hidden="true"
      />
    </svg>
  );
}
