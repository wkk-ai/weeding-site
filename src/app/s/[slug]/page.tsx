export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { PLANS } from "@/lib/constants";
import { loadPublishedSite } from "@/lib/load-site";

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadPublishedSite(slug);
  if (!data) notFound();

  const plan = PLANS[data.tenant.plan];

  return (
    <WeddingSiteView
      tenant={data.tenant}
      templateId={data.templateId}
      themeColor={data.themeColor}
      content={data.content}
      showBranding={plan.branding}
    />
  );
}
