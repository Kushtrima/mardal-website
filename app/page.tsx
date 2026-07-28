import { CardBarsHover } from "../components/home/CardBarsHover";
import { DifferenceSection } from "../components/home/DifferenceSection";
import { Hero } from "../components/home/Hero";
import { IndustriesSection } from "../components/home/IndustriesSection";
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
        <WhyMardal />
        <IndustriesSection />
        <DifferenceSection />
      </main>

      <SiteFooter />
    </>
  );
}
