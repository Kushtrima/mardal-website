import type { Metadata } from "next";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { ServicesHero } from "../../components/services/ServicesHero";
import { ServicesWheel } from "../../components/services/ServicesWheel";
import {
  servicesIndex,
  servicesIndexActions,
  servicesPage,
} from "../../content/services-index";

export const metadata: Metadata = {
  title: servicesPage.title,
  description: servicesPage.description,
};

/**
 * The services: the owner's opening (ServicesHero — his comp of 2026-10-06,
 * "this is what we need") and under it every service on a wheel, each one's
 * content beside it as the page is scrolled (ServicesWheel). No longer an
 * unwritten page: its opening is written, so it stopped calling
 * PlaceholderPage, as Careers and the others did.
 */
export default function ServicesPage() {
  return (
    <>
      <main
        className="service-page service-page--services"
        id="main-content"
        data-service-page
      >
        <HeaderSpace />
        <ServicesHero />
        <ServicesWheel entries={servicesIndex} actions={servicesIndexActions} />
      </main>

      <SiteFooter />
    </>
  );
}
