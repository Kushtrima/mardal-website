/**
 * The journey's cards, built the same way on all five service pages.
 *
 * ── Why this is not five inline expressions any more ──
 * It was: the same flatMap pasted into each page as the pages were written one
 * after another. Three of the five later grew a branch that prepends the
 * chapter's own description to its first card, and two never got it. On CRM
 * Solutions that was harmless — no chapter there carries a description. On
 * AI & Automation it was not: chapters two and three both do, and neither string
 * reached a page. Two paragraphs of approved copy sat in a typed content module
 * being read by nothing, with no way for the next person editing that file to
 * tell.
 *
 * That is what a copy costs when it is a copy rather than a call. The branch now
 * exists once, so a page cannot be missing it.
 *
 * ── What the branch does ──
 * A chapter's description introduces the chapter, and the journey has nowhere to
 * put a chapter heading — the cards run one after another — so it is folded into
 * the first card of that chapter and every later card is left alone. Chapters
 * without a description are common and are not a gap: they simply start on their
 * first card's own words.
 */

/**
 * The two fields this builder reads. Everything else a card carries — its id,
 * title, example — is whatever the content module put there and is passed
 * through untouched, which is why the service type is inferred rather than
 * declared: naming the fields here would mean editing this file every time a
 * content module gained one.
 */
type Service = {
  copy: string;
  items: readonly string[];
};

type Chapter = {
  description?: string;
  services: readonly Service[];
};

/**
 * A card is its service, plus where it sits and the two strings built here.
 *
 * Written as an indexed access off the chapter rather than as a named type,
 * because the content modules are `as const` — every service has its own literal
 * type and the pages read `id`, `title` and `example` straight off the card. A
 * declared shape would flatten all of that to `Service` and the pages would stop
 * compiling. The cast in the body is the price of saying it this way; the
 * property names on both sides of it are checked by everything that reads a card.
 */
type Card<C extends Chapter> = C["services"][number] & {
  groupIndex: number;
  serviceIndex: number;
  copy: string;
  capabilities: string;
};

export function buildServiceCards<C extends Chapter>(
  chapters: readonly C[],
): Card<C>[] {
  return chapters.flatMap((chapter, groupIndex) =>
    chapter.services.map((service, serviceIndex) => ({
      ...service,
      groupIndex,
      serviceIndex,
      /* The chapter's own words, on the card that opens it. Guarded on the
         description existing rather than on the page having remembered to ask —
         which is the whole point of this living in one place. */
      copy:
        serviceIndex === 0 && chapter.description
          ? `${chapter.description} ${service.copy}`
          : service.copy,
      capabilities: `${service.items.join(". ")}.`,
    })),
  );
}
