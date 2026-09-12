"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { defaultSiteContent } from "@/lib/utils";
import { uploadWeddingPhoto } from "@/lib/upload";
import { BuilderShell, type BuilderState } from "@/components/builder/builder-shell";
import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { palettesFor } from "@/lib/wedding-theme";

export default function EditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteId, setSiteId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [published, setPublished] = useState(false);
  const [state, setState] = useState<BuilderState | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: t } = await supabase.from("tenants").select("*").eq("user_id", user.id).single();
      if (!t) return;
      const tenant = t as Tenant;
      setTenantId(tenant.id);
      setPublished(tenant.published);
      const { data: site } = await supabase.from("sites").select("*").eq("tenant_id", tenant.id).single();
      if (site) {
        setSiteId(site.id);
        const c = site.content as SiteContent;
        const templateId = site.template_id as TemplateId;
        const palettes = palettesFor(templateId);
        setState({
          partner1: tenant.partner1_name,
          partner2: tenant.partner2_name,
          weddingDate: tenant.wedding_date,
          slug: tenant.slug,
          templateId,
          themeColor: site.theme_color,
          paletteId: palettes.find((p) => p.color === site.theme_color)?.id ?? palettes[0].id,
          sitePassword: tenant.site_password ?? "",
          content: {
            ...defaultSiteContent(),
            ...c,
            gallery: c.gallery ?? [],
            padrinhos: c.padrinhos ?? [],
            timeline: c.timeline ?? [],
          },
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    if (!state || !siteId || !tenantId) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("sites")
      .update({
        template_id: state.templateId,
        theme_color: state.themeColor,
        content: state.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", siteId);
    await supabase
      .from("tenants")
      .update({
        partner1_name: state.partner1,
        partner2_name: state.partner2,
        wedding_date: state.weddingDate,
        site_password: state.sitePassword || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tenantId);
    setStatus("Salvo");
    setSaving(false);
    setTimeout(() => setStatus(""), 2000);
  }

  if (loading || !state) {
    return <p className="text-wine/60">Carregando editor...</p>;
  }

  return (
    <div className="-m-6">
      <BuilderShell
        mode="account"
        state={state}
        onChange={setState}
        onSave={save}
        saving={saving}
        status={status || (saving ? "Salvando…" : "Salvo")}
        published={published}
        onUpload={uploadWeddingPhoto}
      />
    </div>
  );
}
