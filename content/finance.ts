/**
 * The Finance solutions page.
 *
 * The first of the industry pages, and the pilot the rest will be cut from.
 *
 * Nothing here is new positioning. The title specialises the solutions heading
 * the homepage already carries to one sector, and the support line is word for
 * word the descriptor the industries list already gives Finance. Sector pages
 * are where invented claims creep in easiest, so this one says only what the
 * site already says.
 */
export const finance = {
  slug: "finance",
  eyebrow: "Solutions by Industry",
  title: "Finance",
  lede: "Built for the way finance works.",
  /* Two lines, set here rather than in the page: where the line turns is a
     decision about the copy, not about the markup.
     Both are measured against the title's own 13.5ch measure, which came out at
     439px, and the longest of them is 395px. That margin is the point. The
     first draft read "Technology shaped around / the realities of finance."
     and both lines overran, so a two-line title set itself as four and broke
     mid-phrase. `ch` scales with the font size and so does the text, so a line
     that fits at one viewport fits at all of them. */
  titleLines: ["Built for the way", "finance works."],
  support:
    "Banks, insurance companies, fintech platforms and financial service providers.",
  heroCta: "Let’s build",
} as const;
