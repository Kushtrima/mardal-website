import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientsPage } from "../../../components/case-studies/ClientsPage";
import { caseStudies } from "../../../content/case-studies";
import { industries } from "../../../content/home";

type Params = { params: Promise<{ sector: string }> };

/**
 * Seven routes, one page.
 *
 * `/case-studies/finance` is the Clients page with Finance already chosen, and
 * that is all it is — the hero, the drawing and the filter row are the same,
 * because a sector is a view of the work rather than a place of its own. Seven
 * separate pages was the other shape and it fails on the only test that
 * matters: there is not enough delivered writing to fill them, and a route
 * holding one entry reads emptier than a list holding everything.
 *
 * Prerendered, so the header's menu points at seven static URLs. Anything else
 * under /case-studies/ is a 404 rather than an empty filter, because a sector
 * that does not exist is a wrong address, not a sector with no work in it.
 */
export function generateStaticParams() {
  return industries.map((industry) => ({ sector: industry.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sector } = await params;
  const industry = industries.find((entry) => entry.id === sector);
  if (!industry) return {};

  /* The sector leads the tab, because the tab is what a shared link shows and
     the sector is why it was shared. The descriptor under it is the sector's
     own, already written for the homepage — nothing new is claimed here. */
  return {
    title: `${industry.title} — ${caseStudies.title}`,
    description: industry.descriptor,
  };
}

export default async function ClientsSectorPage({ params }: Params) {
  const { sector } = await params;
  if (!industries.some((industry) => industry.id === sector)) notFound();

  return <ClientsPage sector={sector} />;
}
