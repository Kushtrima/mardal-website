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

  /**
   * Array order is display order, and it is editorial rather than
   * chronological: the first piece is the argument the other two rest on, not
   * the one written most recently. All three carry the same date because all
   * three were published on the same day, which is what happened.
   *
   * Every claim in here is one the site already stands behind. The four
   * mechanisms and the four delivery commitments are the adopted position, and
   * these pieces are where that position is argued rather than asserted. No
   * client is named, no number is quoted, no vendor is mentioned, and no
   * engagement is described. Nothing needed inventing, because the argument was
   * already there and had nowhere to live.
   */
  posts: [
    {
      slug: "between-systems",
      title: "Most failures happen between systems",
      thesis:
        "The software that fails is rarely the software that was written. It fails where two systems meet, and that is the part nobody was asked to test.",
      date: "2026-08-07",
      body: [
        {
          type: "p",
          text: "A company buying software usually buys a thing: a system that does a job. The job gets described, the thing gets built, the thing gets checked against the description. By that measure most projects succeed. The system does what it was asked to do.",
        },
        {
          type: "p",
          text: "Then it is put next to the systems the company already runs, and the trouble starts.",
        },
        { type: "h", text: "The seam is the part nobody tested" },
        {
          type: "p",
          text: "Every system in a business is tested on its own terms. The accounting software is correct about accounting. The store is correct about orders. The customer record is correct about customers. Each was checked by the people who built it, against the job it was built for, and each one passes.",
        },
        {
          type: "p",
          text: "The place where two of them meet was built by neither. It is a field mapped to another field, an export that runs at night, a rule about which side wins when both have changed since yesterday. It has no owner, no test, and usually no document.",
        },
        {
          type: "quote",
          text: "The seam is the least examined part of the system and the part most likely to be wrong.",
        },
        { type: "h", text: "What it looks like when it fails" },
        {
          type: "p",
          text: "It rarely fails loudly. A record exists in two places and the two disagree. A field means one thing on one side and something slightly different on the other, and nobody notices until a report is wrong. A step assumes a person will carry the information across, and it works until that person is away.",
        },
        {
          type: "p",
          text: "The company does not experience any of this as a software failure. It experiences it as a period during which nobody is certain which number is right.",
        },
        { type: "h", text: "What follows from taking it seriously" },
        {
          type: "p",
          text: "Four things, and each is a decision made before code is written rather than a correction made after.",
        },
        {
          type: "p",
          text: "Scope is bounded by writing down what phase one does not include, before phase one starts. A list of what is being built is not a boundary.",
        },
        {
          type: "p",
          text: "Migration is treated as the engagement rather than as its last week. The state before the move is kept, and stays restorable.",
        },
        {
          type: "p",
          text: "The client owns the source, the schema and the deployment pipeline from the first commit, not at handover.",
        },
        {
          type: "p",
          text: "Permissions are decided while the system is being designed. Who may see what is a structural question, and answering it after launch means changing the shape of the thing.",
        },
        {
          type: "p",
          text: "None of these make the seam simple. They make it something with an owner, a written state, and a way back.",
        },
      ],
    },
    {
      slug: "what-phase-one-does-not-include",
      title: "What phase one does not include",
      thesis:
        "Scope only holds when the exclusions are written down first, and agreed by the same people who will later want them included.",
      date: "2026-08-07",
      body: [
        {
          type: "p",
          text: "Scope creep is usually described as a discipline problem. More often it is a documentation problem. Most project documents describe what will be built and say nothing about what will not be, which means every request that arrives later is arguably inside the agreement. Nobody ever agreed it was outside.",
        },
        { type: "h", text: "Write the exclusions first" },
        {
          type: "p",
          text: "Before phase one begins we write two lists. The first is what phase one delivers. The second is what phase one does not deliver, and it is usually the longer of the two.",
        },
        {
          type: "p",
          text: "The second list is not a refusal. It is a schedule. The items on it are real, they are wanted, and they are not now. Writing them down does two things: it stops them arriving as surprises, and it lets the price of phase one hold, because that price was quoted against a boundary rather than against a hope.",
        },
        { type: "h", text: "What tends to go on it" },
        {
          type: "p",
          text: "The reports nobody has specified yet. The second language. Connections to systems that are themselves being replaced this year. The permissions model for a team that does not exist yet. The mobile version. The parts of the old system still in daily use that nobody can currently explain.",
        },
        {
          type: "p",
          text: "Every one of those is legitimate work. Every one of them also ends projects when it arrives unannounced in week six.",
        },
        { type: "h", text: "Why the timing is the whole point" },
        {
          type: "quote",
          text: "An exclusion written after the work starts is a negotiation. Written before it starts, it is a decision.",
        },
        {
          type: "p",
          text: "The same sentence does different work depending on when it was written, and only one of those two moments is calm. Afterwards there is a budget under pressure, a date already promised to someone, and two parties who each believe they remember the conversation correctly.",
        },
        {
          type: "p",
          text: "This is also why phase one carries a fixed price. A fixed price is only honest when both sides know precisely what sits outside it.",
        },
      ],
    },
    {
      slug: "migration-is-the-project",
      title: "Migration is the project",
      thesis:
        "Moving the data is not the last step of replacing a system. It is the work itself, and scheduling it at the end is how projects arrive late and then go back.",
      date: "2026-08-07",
      body: [
        {
          type: "p",
          text: "Plans for replacing a system usually put migration near the end. Build the new thing, check it, then move the data across. It reads sensibly and it is the wrong order.",
        },
        { type: "h", text: "The data is the specification" },
        {
          type: "p",
          text: "The system being replaced has been running for years. Almost everything true about how the business actually works is in its data, including the parts nobody would think to describe in a meeting: the field used for something other than its name, the records that break the rule everyone stated confidently, the conventions that grew because the software would not do what somebody needed that week.",
        },
        {
          type: "p",
          text: "A new system designed from a description of the business will not survive contact with that. A new system designed against the data will, because the data is the description, written by the business over several years without anyone intending it as one.",
        },
        { type: "h", text: "So it moves early, and keeps moving" },
        {
          type: "p",
          text: "We move data early and repeatedly, into a live environment the client can open for themselves. Every two weeks there is something running with real records in it rather than a demonstration with invented ones. Problems in the data surface in week two instead of week twenty.",
        },
        { type: "h", text: "And the way back stays open" },
        {
          type: "p",
          text: "The state before the move is kept and stays restorable. Cutover is rehearsed against a copy of production data before it is done for real, and the rehearsal is timed.",
        },
        {
          type: "quote",
          text: "How long you will be down should be a measurement, not an estimate.",
        },
        {
          type: "p",
          text: "None of this makes migration easy. It makes it the thing being worked on rather than the thing being postponed.",
        },
      ],
    },
  ] as BlogPost[],
} as const;
