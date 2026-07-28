import { CardBarsHover } from "../components/home/CardBarsHover";
import { DifferenceSection } from "../components/home/DifferenceSection";
import { Hero } from "../components/home/Hero";
import { IndustriesSection } from "../components/home/IndustriesSection";
import { ProductsSection } from "../components/home/ProductsSection";
import { WhyMardal } from "../components/home/WhyMardal";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function Home() {
  return (
    <>
      <CardBarsHover />

      <main id="main-content">
        <Hero />
        <WhyMardal />
        <IndustriesSection />
        <DifferenceSection />
        <ProductsSection />
      </main>

      <SiteFooter />
    </>
  );
}
