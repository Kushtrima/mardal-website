import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientsStory } from "../../../components/case-studies/ClientsStory";
import { pilotStory } from "../../../content/case-studies";

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
 * Exactly one address is generated, and everything else is a 404. This is a
 * pilot: seven cards on the index go nowhere, and a route that answered for all
 * of them would be seven empty pages pretending to be written.
 */
export function generateStaticParams() {
  return [{ story: pilotStory.slug }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { story } = await params;
  if (story !== pilotStory.slug) return {};

  return {
    title: pilotStory.title,
    description: pilotStory.lede,
  };
}

export default async function ClientsStoryPage({ params }: Params) {
  const { story } = await params;
  if (story !== pilotStory.slug) notFound();

  return <ClientsStory />;
}
