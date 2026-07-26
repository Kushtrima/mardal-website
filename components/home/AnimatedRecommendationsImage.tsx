export function AnimatedRecommendationsImage() {
  return (
    <svg
      className="why-card__image why-card__image--recommendations"
      viewBox="0 0 1254 1254"
      role="img"
      aria-label="Animated system handoff"
    >
      <defs>
        <mask
          id="recommendation-rear-wall-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1254"
          height="1254"
        >
          <image
            href="/card-icons/recommendations-wall-rear.png"
            width="1254"
            height="1254"
          />
        </mask>
        <mask
          id="recommendation-front-wall-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1254"
          height="1254"
        >
          <image
            href="/card-icons/recommendations-wall-front.png"
            width="1254"
            height="1254"
          />
        </mask>
        <mask
          id="recommendation-right-wall-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1254"
          height="1254"
        >
          <image
            href="/card-icons/recommendations-wall-right.png"
            width="1254"
            height="1254"
          />
        </mask>
        <mask
          id="recommendation-left-wall-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1254"
          height="1254"
        >
          <image
            href="/card-icons/recommendations-wall-left.png"
            width="1254"
            height="1254"
          />
        </mask>
      </defs>

      <rect
        className="recommendation-wall recommendation-wall--rear"
        width="1254"
        height="1254"
        mask="url(#recommendation-rear-wall-mask)"
      />
      <rect
        className="recommendation-wall recommendation-wall--right"
        width="1254"
        height="1254"
        mask="url(#recommendation-right-wall-mask)"
      />
      <rect
        className="recommendation-wall recommendation-wall--front"
        width="1254"
        height="1254"
        mask="url(#recommendation-front-wall-mask)"
      />
      <rect
        className="recommendation-wall recommendation-wall--left"
        width="1254"
        height="1254"
        mask="url(#recommendation-left-wall-mask)"
      />

      <image
        className="recommendation-outline"
        href="/card-icons/recommendations.png"
        width="1254"
        height="1254"
      />
    </svg>
  );
}
