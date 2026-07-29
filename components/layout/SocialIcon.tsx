/**
 * The three social marks, drawn rather than fetched.
 *
 * Line drawings at the same weight as every other icon on the site — the
 * arrows on the products, the way back up — so they read as part of the set
 * rather than as three logos pasted in. Each is built from the same parts: a
 * container the size of the box, and the letter or lens inside it.
 *
 * No brand colour and no filled badge. Everything on the footer panel is one
 * white on one purple, and a red-blue-and-blue row of roundels would be the
 * only place on the page where that stops being true.
 */
const SIZE = 24;

type Name = "instagram" | "facebook" | "linkedin";

/** What each one is, for the people who cannot see it. */
export const SOCIAL_LABELS: Record<Name, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

export function SocialIcon({ name }: { name: Name }) {
  return (
    <svg
      className="social-icon"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={SOCIAL_LABELS[name]}
      focusable="false"
    >
      {name === "instagram" && (
        <>
          <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5" />
          <circle cx="12" cy="12" r="4" />
          {/* The one solid mark in the set, because the lens beside it is a
              circle too and an outlined dot reads as a second lens. */}
          <circle className="social-icon__dot" cx="16.7" cy="7.3" r="1.05" />
        </>
      )}

      {name === "facebook" && (
        <>
          <circle cx="12" cy="12" r="8.4" />
          {/* The f: a stem the height of the circle, the hook turning off the
              top of it, and the bar across. */}
          <path d="M14.8 7.9h-1.3a1.5 1.5 0 0 0-1.5 1.5v11" />
          <path d="M9.9 12.9h4.4" />
        </>
      )}

      {name === "linkedin" && (
        <>
          <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="3.6" />
          {/* in — the i's tittle is solid for the same reason the Instagram
              dot is: at this size an outlined one closes up anyway. */}
          <circle className="social-icon__dot" cx="8.2" cy="8" r="0.95" />
          <path d="M8.2 10.9v5.6" />
          <path d="M11.7 16.5v-5.6" />
          <path d="M11.7 13.3c0-1.35 1-2.4 2.25-2.4s2.05 1.05 2.05 2.4v3.2" />
        </>
      )}
    </svg>
  );
}
