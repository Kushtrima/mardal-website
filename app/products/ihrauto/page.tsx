import type { Metadata } from "next";
import { PlaceholderPage } from "../../../components/placeholder/PlaceholderPage";
import { placeholders } from "../../../content/placeholders";

export const metadata: Metadata = {
  title: placeholders["products/ihrauto"].title,
  description: placeholders["products/ihrauto"].description,
};

/** An address the menu points at, and no writing behind it yet. The page is
 *  PlaceholderPage; the words are in content/placeholders.ts. */
export default function IhrautoPage() {
  return <PlaceholderPage page="products/ihrauto" />;
}
