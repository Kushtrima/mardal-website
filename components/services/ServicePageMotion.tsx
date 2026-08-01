import { ServiceOfferingsScroll } from "./ServiceOfferingsScroll";
import { ServicePageEntry } from "./ServicePageEntry";

/**
 * Global motion system for editorial service pages.
 *
 * Pages using the shared `service-*` classes and `data-service-*` hooks inherit
 * the approved hero transition, desktop journey, and pinned mobile stack.
 */
export function ServicePageMotion() {
  return (
    <>
      <ServicePageEntry />
      <ServiceOfferingsScroll />
    </>
  );
}
