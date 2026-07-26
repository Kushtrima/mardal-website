import { ContactSection } from "../components/home/ContactSection";
import { Hero } from "../components/home/Hero";
import { IndustriesSection } from "../components/home/IndustriesSection";
import { ProductsSection } from "../components/home/ProductsSection";
import { WhyMardal } from "../components/home/WhyMardal";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function Home() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <WhyMardal />
        <IndustriesSection />
        <ProductsSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </>
  );
}
