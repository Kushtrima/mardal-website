import { AboutIntroSection } from "../components/home/AboutIntroSection";
import { ExpertiseSection } from "../components/home/ExpertiseSection";
import { FusionSection } from "../components/home/FusionSection";
import { HouseHero } from "../components/home/HouseHero";
import { ProductsSection } from "../components/home/ProductsSection";
import { SelectedWorkSection } from "../components/home/SelectedWorkSection";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SectionEnter } from "../components/motion/SectionEnter";

export default function Home() {
  return (
    <>
      <SectionEnter />

      <main id="main-content">
        {/* The owner's concept of 2026-10-03; the opening before it,
            "Innovation lives here.", was deleted the same day. */}
        <HouseHero />
        <FusionSection />
        {/* The owner's comp of 2026-10-05: Selected Work, under Fusion. */}
        <SelectedWorkSection />
        {/* The owner's comp of 2026-10-05: "about", under Selected Work. */}
        <AboutIntroSection />
        {/* The owner's comp of 2026-10-05: "Our expertise", under "about". */}
        <ExpertiseSection />
        <ProductsSection />
      </main>

      {/* The hairlines run on through the footer to the foot of the page, on
          this page only (owner, 2026-10-06: "i want to leav till the end of
          the page"). */}
      <SiteFooter ruled />
    </>
  );
}
