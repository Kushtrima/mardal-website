import type { Metadata } from "next";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { HeaderSpace } from "../../components/layout/HeaderSpace";
import { ServicesFooterRules } from "../../components/services/ServicesFooterRules";
import { ServicesHero } from "../../components/services/ServicesHero";
import { ServicesRules } from "../../components/services/ServicesRules";
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
        {/* The page's five hairlines, from its top to the wheel's foot, in
            one piece (ServicesRules). */}
        <ServicesRules />
        <HeaderSpace />
        <ServicesHero />
        <ServicesWheel entries={servicesIndex} actions={servicesIndexActions} />
      </main>

      {/* The grey hairlines run on to the foot of the page (owner,
          2026-10-06: "the grey vertical lines need to go to the end also in
          footer"), drawn as the page's are so the two meet unseen. */}
      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}
