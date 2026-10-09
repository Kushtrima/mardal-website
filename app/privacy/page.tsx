import type { Metadata } from "next";
import { pageMetadata } from "../../lib/page-metadata";
import { LegalPage } from "../../components/legal/LegalPage";
import { privacyPage } from "../../content/legal";

export const metadata: Metadata = pageMetadata(privacyPage.title, privacyPage.description);

/** Written 2026-10-08 (it was an unwritten page): see content/legal.ts. */
export default function PrivacyPage() {
  return <LegalPage page="privacy" />;
}
