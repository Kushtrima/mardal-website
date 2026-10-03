import { CardBarsHover } from "../components/home/CardBarsHover";
import { DifferenceSection } from "../components/home/DifferenceSection";
import { FusionSection } from "../components/home/FusionSection";
import { HouseHero } from "../components/home/HouseHero";
import { IndustriesSection } from "../components/home/IndustriesSection";
import { ProductsSection } from "../components/home/ProductsSection";
import { WhyMardal } from "../components/home/WhyMardal";
import { WorkSection } from "../components/home/WorkSection";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SectionEnter } from "../components/motion/SectionEnter";

export default function Home() {
  return (
    <>
      <CardBarsHover />
      <SectionEnter />

      <main id="main-content">
        {/* The owner's concept of 2026-10-03; the opening before it,
            "Innovation lives here.", was deleted the same day. */}
        <HouseHero />
        <FusionSection />
        <WhyMardal />
        <IndustriesSection />
        <WorkSection />
        <DifferenceSection />
        <ProductsSection />
      </main>

      <SiteFooter />
    </>
  );
}
