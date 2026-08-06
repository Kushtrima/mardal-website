import { CardBarsHover } from "../components/home/CardBarsHover";
import { DifferenceSection } from "../components/home/DifferenceSection";
import { FusionSection } from "../components/home/FusionSection";
import { Hero } from "../components/home/Hero";
import { IndustriesSection } from "../components/home/IndustriesSection";
import { ProductsSection } from "../components/home/ProductsSection";
import { WhyMardal } from "../components/home/WhyMardal";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SectionEnter } from "../components/motion/SectionEnter";

export default function Home() {
  return (
    <>
      <CardBarsHover />
      <SectionEnter />

      <main id="main-content">
        <Hero />
        <FusionSection />
        <WhyMardal />
        <IndustriesSection />
        <DifferenceSection />
        <ProductsSection />
      </main>

      <SiteFooter />
    </>
  );
}
