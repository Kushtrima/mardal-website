import type { Metadata } from "next";
import { PlaceholderPage } from "../../../components/placeholder/PlaceholderPage";
import { placeholders } from "../../../content/placeholders";

export const metadata: Metadata = {
  title: placeholders["services/ux-ui-design"].title,
  description: placeholders["services/ux-ui-design"].description,
};

/** An address the menu points at, and no writing behind it yet. The page is
 *  PlaceholderPage; the words are in content/placeholders.ts. */
export default function UxUiDesignPage() {
  return <PlaceholderPage page="services/ux-ui-design" />;
}
