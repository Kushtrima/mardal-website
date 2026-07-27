import { DifferenceSection } from "../components/home/DifferenceSection";
import { Hero } from "../components/home/Hero";
import { IndustriesSection } from "../components/home/IndustriesSection";
import { WhyMardal } from "../components/home/WhyMardal";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function Home() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <WhyMardal />
        <DifferenceSection />
        <IndustriesSection />
      </main>

      <SiteFooter />
    </>
  );
}
