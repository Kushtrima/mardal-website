import type { Metadata } from "next";
import { pageMetadata } from "../../lib/page-metadata";
import { ClientsPage } from "../../components/case-studies/ClientsPage";
import { caseStudies } from "../../content/case-studies";

export const metadata: Metadata = pageMetadata(caseStudies.title, caseStudies.lede);

/**
 * Clients — every entry, once.
 *
 * The only route to this page now. There were eight: this one and seven
 * `/case-studies/[sector]` siblings rendering the same page with one sector
 * already chosen, which is what the header's Clients panel pointed at. The
 * owner replaced the industry taxonomy on 2026-08-25 and the seven went with
 * it; `next.config.ts` redirects them here rather than 404ing anything that was
 * already linked.
 */
export default function CaseStudiesPage() {
  return <ClientsPage />;
}
