import { createServiceClient } from "@/lib/supabase/admin";
import type { SiteContent, Tenant } from "@/lib/types";
import { isTemplateId } from "@/lib/wedding-theme";

export async function loadPublishedSite(slug: string) {
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
    const rawId = site?.template_id;
    return {
      tenant: tenant as Tenant,
      content: (site?.content ?? { gallery: [], padrinhos: [], timeline: [] }) as SiteContent,
      templateId: isTemplateId(rawId) ? rawId : "classic",
      themeColor: site?.theme_color ?? "#8b5a6b",
    };
  } catch {
    return null;
  }
}
