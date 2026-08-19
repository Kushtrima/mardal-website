import type { Metadata } from "next";
import { PlaceholderPage } from "../../components/placeholder/PlaceholderPage";
import { placeholders } from "../../content/placeholders";

export const metadata: Metadata = {
  title: placeholders["services"].title,
  description: placeholders["services"].description,
};

/** An address the menu points at, and no writing behind it yet. The page is
 *  PlaceholderPage; the words are in content/placeholders.ts. */
export default function ServicesPage() {
  return <PlaceholderPage page="services" />;
}
