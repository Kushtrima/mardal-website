import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientsStory } from "../../../../components/case-studies/ClientsStory";
import { pilotStory } from "../../../../content/case-studies";

type Params = { params: Promise<{ sector: string; story: string }> };

/**
 * One story, under the sector it belongs to.
 *
 * `/case-studies/healthcare/healthcare-office-website` — the sector stays in the
 * path because it is where the reader came from and where leaving should put
 * them back. A story is not a thing on its own; it is one of the ones in that
 * view of the index.
 *
 * Exactly one address is generated, and every other combination is a 404. This
 * is a pilot: seven cards on the index go nowhere, and a route that answered
 * for all of them would be seven empty pages pretending to be written.
 */
export function generateStaticParams() {
  return [{ sector: pilotStory.sector, story: pilotStory.slug }];
}

function isPilot(sector: string, story: string) {
  return sector === pilotStory.sector && story === pilotStory.slug;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sector, story } = await params;
  if (!isPilot(sector, story)) return {};

  return {
    title: pilotStory.title,
    description: pilotStory.lede,
  };
}

export default async function ClientsStoryPage({ params }: Params) {
  const { sector, story } = await params;
  if (!isPilot(sector, story)) notFound();

  return <ClientsStory />;
}
