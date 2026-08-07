/**
 * The Blog page.
 *
 * Hero only for now, the way the Finance pilot began.
 *
 * There are no posts yet, so nothing here pretends there are: no counts, no
 * dates, no topics promised. The hero says what the blog is for and stops,
 * which is the honest thing for a page whose body has not been written.
 */
export const blog = {
  slug: "blog",
  eyebrow: "Inside Mardal",
  title: "Blog",
  lede: "What we learn, written down.",
  /* Two lines, set here rather than in the page: where the line turns is a
     decision about the copy, not about the markup. The title's measure is
     13.5ch, which resolved to 439px when it was last read off the page, and
     both of these sit well inside it. */
  titleLines: ["What we learn,", "written down."],
  support: "Notes on software, applied AI, and the systems businesses run on.",
  heroCta: "Get in touch",
} as const;
