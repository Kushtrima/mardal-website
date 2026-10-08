import { SiteFooter } from "../layout/SiteFooter";
import { HeaderSpace } from "../layout/HeaderSpace";
import { ClientsIndex } from "./ClientsIndex";
import { SectionEnter } from "../motion/SectionEnter";
import { ServicesFooterRules } from "../services/ServicesFooterRules";
import { ServicesHero } from "../services/ServicesHero";
import { ServicesRules } from "../services/ServicesRules";
import { clientsHero } from "../../content/case-studies";

/**
 * The Clients page: the opening, and the delivered work under it.
 *
 * One route renders it. Two did — `/case-studies` and `/case-studies/[sector]`,
 * differing by which sector arrived already chosen — until the owner replaced
 * the industry taxonomy on 2026-08-25. The seven sector routes went with it,
 * and this stopped taking a prop.
 *
 * **It opens as the services and the products do** — owner, 2026-10-08:
 * "change the hero of Client to be same design as in product and service that
 * style of course add a appropriate text". ServicesHero in the clients' words,
 * on the same five hairlines from the page's top through to its foot. The
 * body under it is next ("after you finish i will tell you what to do with the
 * rest of the body of that page").
 */
export function ClientsPage() {
  return (
    <>
      <SectionEnter />

      {/* `--clients` is the section, `--case-studies` is this page in it. The
          first is what the stylesheet's phone heading rule is written against,
          so a new page under /case-studies inherits it by carrying the class
          rather than by having a rule added for it. */}
      <main
        className="service-page service-page--clients service-page--case-studies"
        id="main-content"
        data-service-page
      >
        {/* The page's five hairlines, from its top to its foot in one piece
            (ServicesRules). */}
        <ServicesRules />
        <HeaderSpace />
        <ServicesHero hero={clientsHero} name="clients" />

        {/* Every entry, once, with a rail down the left saying what kind of
            work this site holds. It was a filter over seven sectors; see the
            component for what replaced it and why nothing in the rail is
            pressable. */}
        <ClientsIndex />
      </main>

      {/* The grey hairlines on to the foot of the page, as the services'. */}
      <SiteFooter rules={<ServicesFooterRules />} />
    </>
  );
}
