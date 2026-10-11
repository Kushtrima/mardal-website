import type { Metadata } from "next";
import { pageMetadata } from "../../lib/page-metadata";
import { NearshoringPage } from "../../components/nearshoring/NearshoringPage";
import { JsonLd } from "../../components/seo/JsonLd";
import { breadcrumbs, graph } from "../../lib/structured-data";
import { nearshoringPage } from "../../content/nearshoring";

export const metadata: Metadata = pageMetadata(
  nearshoringPage.title,
  nearshoringPage.description,
  nearshoringPage.path,
);

/** Nearshoring from Kosovo, for companies in Switzerland and Germany
 *  (content/nearshoring.ts). */
export default function Nearshoring() {
  return (
    <>
      <JsonLd
        data={graph(breadcrumbs([{ name: "Nearshoring from Kosovo", path: nearshoringPage.path }]))}
      />
      <NearshoringPage />
    </>
  );
}
