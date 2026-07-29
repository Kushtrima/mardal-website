/**
 * A mark for each way of reaching Mardal.
 *
 * These stand in for the words that named these rows. On a phone the words are
 * off — they were a column 90px wide that the address needed — and an envelope
 * says what EMAIL said in a fifth of the room. On the wide panel the words are
 * still there and these are not drawn at all.
 *
 * Line drawings at the weight of every other icon on the site, in currentColor,
 * so the row reads as one thing rather than as a picture next to some text.
 * Hidden from anything that is listening: the row still carries its label in
 * words for a screen reader, and an envelope announced beside it would only
 * say the same thing twice.
 */
type Name = "email" | "phone" | "address";

export function ContactIcon({ name }: { name: Name }) {
  return (
    <svg
      className="contact-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {name === "email" && (
        <>
          <rect x="2.8" y="5" width="18.4" height="14" rx="2.4" />
          {/* The flap, folding from the two top corners down to the middle. */}
          <path d="M3.4 6.6 12 12.7l8.6-6.1" />
        </>
      )}

      {name === "phone" && (
        <path
          d="M20.9 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1 4.1 2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L7 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"
        />
      )}

      {name === "address" && (
        <>
          {/* A pin, not a house: it is a street to find rather than a
              building to picture. */}
          <path d="M20 10.2c0 5.6-8 11.3-8 11.3s-8-5.7-8-11.3a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10.1" r="2.7" />
        </>
      )}
    </svg>
  );
}
