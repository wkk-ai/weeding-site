export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { PLANS } from "@/lib/constants";
import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";

async function getPublishedSite(slug: string) {
  try {
    const supabase = createServiceClient();
    const { data: tenant } = await supabase
      .from("tenants")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (!tenant) return null;

    const { data: site } = await supabase
      .from("sites")
      .select("*")
      .eq("tenant_id", tenant.id)
      .single();

    return { tenant: tenant as Tenant, site };
  } catch {
    return null;
  }
}

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublishedSite(slug);
  if (!data) notFound();

  const { tenant, site } = data;
  const plan = PLANS[tenant.plan as keyof typeof PLANS];

  return (
    <WeddingSiteView
      tenant={tenant}
      templateId={(site?.template_id ?? "classic") as TemplateId}
      themeColor={site?.theme_color ?? "#8b5a6b"}
      content={(site?.content ?? {}) as SiteContent}
      showBranding={plan.branding}
    />
  );
}
