/**
 * The Blog.
 *
 * The index is a table of arguments, not a feed. Under ten pieces a year is the
 * expected volume, and at that size a card grid cannot be justified: cards
 * exist to make many things scannable and there are not many things. Each piece
 * gets a full row and its own thesis sentence instead.
 *
 * There are no posts yet and none is invented here. `posts` is empty, the index
 * renders its empty state, and the post route generates nothing until a real
 * piece is written. A page with a gap beats a page with a plausible guess.
 */

/**
 * A piece of writing, as blocks rather than one string of markup.
 *
 * Blocks because the pieces are mixed lengths: a note is a handful of
 * paragraphs and an argument carries subheads and a pulled line. One shape that
 * survives both beats two templates that each half-fit.
 */
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Shown on the index under the title. The argument in one sentence, not a
   *  truncated opening: an excerpt makes the reader click to find out whether
   *  it was worth clicking. */
  thesis: string;
  /** ISO date. Shown, because hiding it to look busier is the kind of small
   *  lie this site does not tell. */
  date: string;
  body: BlogBlock[];
};

/** Reading words a minute. A middling figure for considered prose read on a
 *  screen; it decides a rounded minute count, nothing finer. */
const WORDS_A_MINUTE = 200;

/**
 * Derived, never written down by hand.
 *
 * A hand-set reading time is a fact that drifts the moment a paragraph is
 * edited, and this site does not ship facts it cannot keep true. Counting the
 * words cannot go stale.
 */
export function readingMinutes(post: BlogPost): number {
  const words = post.body
    .map((block) => block.text.trim().split(/\s+/).length)
    .reduce((total, count) => total + count, 0);

  return Math.max(1, Math.round(words / WORDS_A_MINUTE));
}

export const blog = {
  slug: "blog",
  title: "Blog",
  lede: "What we learn, written down.",
  /* Two lines, set here rather than in the page: where the line turns is a
     decision about the copy, not about the markup. The title's measure is
     13.5ch, which resolved to 439px when it was last read off the page, and
     both of these sit well inside it. */
  titleLines: ["What we learn,", "written down."],
  support: "Notes on software, applied AI, and the systems businesses run on.",
  heroCta: "Get in touch",

  /* Today's real state, and therefore a screen that had to be designed rather
     than left to render as nothing. It names what is coming in the words the
     positioning already uses, and promises no date, because no date is known. */
  empty: {
    title: "Nothing published yet.",
    copy: "The first pieces will be about what happens between systems: migration, ownership, permissions, and cutover.",
  },

  /* The same closing block every service page ends on, so a piece finishes
     where the rest of the site finishes. Line breaks are the copy's:
     .service-cta__title is white-space: pre-line for exactly this. */
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },

  posts: [] as BlogPost[],
} as const;
