export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { WeddingSiteView } from "@/components/wedding/wedding-site";
import type { SiteContent, Tenant } from "@/lib/types";
import { defaultSiteContent } from "@/lib/utils";
import { isTemplateId } from "@/lib/wedding-theme";
import { redirect } from "next/navigation";

export default async function PreviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tenant } = await supabase.from("tenants").select("*").eq("user_id", user.id).single();
  if (!tenant) redirect("/signup");
  const { data: site } = await supabase.from("sites").select("*").eq("tenant_id", tenant.id).single();
  const rawId = site?.template_id;
  const content = {
    ...defaultSiteContent(),
    ...((site?.content ?? {}) as SiteContent),
  };

  return (
    <div className="-m-6">
      <p className="bg-wine px-4 py-2 text-center text-xs text-white">
        Prévia — ainda não é o link dos convidados
      </p>
      <WeddingSiteView
        tenant={tenant as Tenant}
        templateId={isTemplateId(rawId) ? rawId : "classic"}
        themeColor={site?.theme_color ?? "#8b5a6b"}
        content={content}
        showBranding={false}
        siteBase="/app/preview"
      />
    </div>
  );
}
