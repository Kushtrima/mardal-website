import type { Metadata } from "next";
import { PlaceholderPage } from "../../components/placeholder/PlaceholderPage";
import { placeholders } from "../../content/placeholders";
import { menu } from "../../content/home";

export const metadata: Metadata = {
  title: placeholders["services"].title,
  description: placeholders["services"].description,
};

/** An address the menu points at: its opening, still unwritten, and under it
 *  an index of every service (owner, 2026-10-05: "when click inside to have all
 *  services and other"). The page is PlaceholderPage; its words are in
 *  content/placeholders.ts, and the list is the menu's own. */
export default function ServicesPage() {
  const entry = menu.find((item) => item.key === "services");
  return <PlaceholderPage page="services" links={entry?.items ?? []} />;
}
