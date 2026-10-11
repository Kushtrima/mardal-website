import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/page-metadata";
import { notFound } from "next/navigation";
import { ClientsStory } from "../../../components/case-studies/ClientsStory";
import { stories } from "../../../content/case-studies";

type Params = { params: Promise<{ story: string }> };

/**
 * One story, directly under Clients.
 *
 * It was `/case-studies/[sector]/[story]` — the sector in the path because it
 * was where the reader came from and where leaving should put them back. The
 * owner replaced the industry taxonomy on 2026-08-25; there is no sector view
 * to return to any more, so the segment came out and the story sits one level
 * under the index it belongs to. `next.config.ts` redirects the old address.
 *
 * One address per story written out (`stories` — En-Nur and the pilot since
 * 2026-10-11), and everything else is a 404: the cards with no story behind
 * them go nowhere, and a route that answered for all of them would be empty
 * pages pretending to be written.
 */
export function generateStaticParams() {
  return stories.map((story) => ({ story: story.slug }));
}

function storyAt(slug: string) {
  return stories.find((story) => story.slug === slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const story = storyAt((await params).story);
  if (!story) return {};

  return pageMetadata(
    story.title,
    story.lede,
    `/case-studies/${story.slug}`,
    "article",
    story.ogImage
      ? { url: story.ogImage, width: 1200, height: 630, alt: story.title }
      : undefined,
  );
}

export default async function ClientsStoryPage({ params }: Params) {
  const story = storyAt((await params).story);
  if (!story) notFound();

  return <ClientsStory story={story} />;
}
