import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RolePage } from "../../../components/careers/RolePage";
import { careers } from "../../../content/careers";

type Params = { params: Promise<{ role: string }> };

/**
 * One role, at its own address.
 *
 * Three routes, prerendered, and anything else under /careers/ is a 404 rather
 * than an empty page — a role that is not open is a wrong address, not a role
 * with nothing in it. The same argument the sector routes are written on.
 *
 * The slug is the id the /careers list already anchors each row with, so a row
 * and its page cannot drift apart.
 */
export function generateStaticParams() {
  return careers.roles.map((role) => ({ role: role.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { role: slug } = await params;
  const role = careers.roles.find((entry) => entry.id === slug);
  if (!role) return {};

  /* The role leads the tab, because the tab is what a shared link shows and the
     role is why it was shared. */
  return {
    title: `${role.title} — ${careers.title}`,
    description: role.lede,
  };
}

export default async function CareersRolePage({ params }: Params) {
  const { role: slug } = await params;
  const role = careers.roles.find((entry) => entry.id === slug);
  if (!role) notFound();

  return <RolePage role={role} />;
}
