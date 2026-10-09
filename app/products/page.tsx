import type { Metadata } from "next";
import { pageMetadata } from "../../lib/page-metadata";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { ProductsSection } from "../../components/home/ProductsSection";
import { ServicesFooterRules } from "../../components/services/ServicesFooterRules";
import { ServicesHero } from "../../components/services/ServicesHero";
import { ServicesRules } from "../../components/services/ServicesRules";
import { productsHero, productsPage } from "../../content/products-index";

export const metadata: Metadata = pageMetadata(productsPage.title, productsPage.description);

/**
 * The products: the services page's opening, in the products' own words
 * (owner, 2026-10-07: "Recreate Product page, make same hero banner but with
 * different text … then we will contiinue to work on body of this page"), on
 * the same hairlines. No longer an unwritten page, so it stopped calling
 * PlaceholderPage. Under it the homepage's products section in this page's
 * words (ProductsSection `page`); each product went to a page of its own
 * until those were deleted, 2026-10-08.
 */
export default function ProductsPage() {
  return (
    <>
      <main
        className="service-page service-page--products"
        id="main-content"
        data-service-page
      >
        {/* The page's five hairlines, from its top to its foot in one piece
            (ServicesRules). */}
        <ServicesRules />
        <HeaderSpace />
        <ServicesHero hero={productsHero} name="products" />
        {/* What they are, then the two, each to its own page — owner,
            2026-10-07. */}
        <ProductsSection page />
      </main>

      {/* The grey hairlines on to the foot of the page, as the services'. */}
      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}
