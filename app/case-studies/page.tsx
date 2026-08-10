import type { Metadata } from "next";
import { ClientsPage } from "../../components/case-studies/ClientsPage";
import { ALL_SECTORS, caseStudies } from "../../content/case-studies";

export const metadata: Metadata = {
  title: caseStudies.title,
  description: caseStudies.lede,
};

/**
 * Clients, unfiltered — every sector at once, which is what the word in the bar
 * goes to. The page itself lives in ClientsPage, because the sector routes
 * beside this one render exactly the same thing with one word different.
 */
export default function CaseStudiesPage() {
  return <ClientsPage sector={ALL_SECTORS} />;
}
