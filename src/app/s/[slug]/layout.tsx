export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { PasswordGate } from "@/components/wedding/password-gate";
import { loadPublishedSite } from "@/lib/load-site";

export default async function PublicSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadPublishedSite(slug);
  if (!data) notFound();

  const password = data.tenant.site_password;
  if (password) {
    return (
      <PasswordGate password={password} storageKey={`nc-site-unlock-${slug}`}>
        {children}
      </PasswordGate>
    );
  }
  return children;
}
