import type { Metadata } from "next";
import { LegalPage } from "../../components/legal/LegalPage";
import { cookiesPage } from "../../content/legal";

export const metadata: Metadata = {
  title: cookiesPage.title,
  description: cookiesPage.description,
};

/** Written 2026-10-08 (it was an unwritten page): see content/legal.ts. */
export default function CookiesPage() {
  return <LegalPage page="cookies" />;
}
