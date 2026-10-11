import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "../../../lib/page-metadata";
import { ServiceHubPage } from "../../../components/services/ServiceHubPage";
import { JsonLd } from "../../../components/seo/JsonLd";
import { breadcrumbs, graph, serviceHubServices } from "../../../lib/structured-data";
import { hubServices, serviceAnchor, serviceHubs } from "../../../content/service-pages";

type Params = { params: Promise<{ hub: string }> };

/**
 * **One page per kind of work** — SEO-PLAN.md, step 2.1: five addresses
 * under /services, every other one a 404. The words are in
 * content/service-pages.ts; the services' own, in content/services-index.ts.
 */
export function generateStaticParams() {
  return serviceHubs.map((hub) => ({ hub: hub.slug }));
}

function hubAt(slug: string) {
  return serviceHubs.find((hub) => hub.slug === slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const hub = hubAt((await params).hub);
  if (!hub) return {};
  return pageMetadata(hub.title, hub.description, `/services/${hub.slug}`);
}

export default async function ServiceHub({ params }: Params) {
  const hub = hubAt((await params).hub);
  if (!hub) notFound();

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbs([
            { name: "Services", path: "/services" },
            { name: hub.name, path: `/services/${hub.slug}` },
          ]),
          serviceHubServices(hub.slug, hubServices(hub), serviceAnchor),
        )}
      />
      <ServiceHubPage hub={hub} />
    </>
  );
}
