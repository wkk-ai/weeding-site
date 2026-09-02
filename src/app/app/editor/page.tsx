"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TEMPLATES, defaultSiteContent } from "@/lib/utils";
import { uploadWeddingPhoto } from "@/lib/upload";
import { WeddingSiteView } from "@/components/wedding/wedding-site";
import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { Save } from "lucide-react";

export default function EditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteId, setSiteId] = useState("");
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [themeColor, setThemeColor] = useState("#8b5a6b");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: t } = await supabase.from("tenants").select("*").eq("user_id", user.id).single();
      if (!t) return;
      setTenant(t as Tenant);
      const { data: site } = await supabase.from("sites").select("*").eq("tenant_id", t.id).single();
      if (site) {
        setSiteId(site.id);
        setTemplateId(site.template_id as TemplateId);
        setThemeColor(site.theme_color);
        const c = site.content as SiteContent;
        setContent({
          ...defaultSiteContent(),
          ...c,
          gallery: c.gallery ?? [],
          padrinhos: c.padrinhos ?? [],
          timeline: c.timeline ?? [],
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    if (!content || !siteId || !tenant) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("sites")
      .update({
        template_id: templateId,
        theme_color: themeColor,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", siteId);
    await supabase
      .from("tenants")
      .update({
        partner1_name: tenant.partner1_name,
        partner2_name: tenant.partner2_name,
        wedding_date: tenant.wedding_date,
        site_password: tenant.site_password || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tenant.id);
    setMessage("Salvo!");
    setSaving(false);
    setTimeout(() => setMessage(""), 2000);
  }

  async function setPhoto(key: "coverPhotoUrl" | "bridePhotoUrl" | "groomPhotoUrl", file: File) {
    if (!content) return;
    try {
      const url = await uploadWeddingPhoto(file);
      setContent({ ...content, [key]: url });
    } catch {
      setMessage("Erro ao enviar foto");
    }
  }

  async function addGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !content) return;
    try {
      const url = await uploadWeddingPhoto(file);
      setContent({
        ...content,
        gallery: [...content.gallery, { id: crypto.randomUUID(), url }],
      });
    } catch {
      setMessage("Erro ao enviar foto");
    }
  }

  if (loading || !content || !tenant) {
    return <p className="text-wine/60">Carregando editor...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold text-wine">Editor do site</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="rounded-full border border-wine/20 px-4 py-2 text-sm"
          >
            {showPreview ? "Ocultar prévia" : "Ver prévia"}
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
      {message && <p className="mt-2 text-sm text-sage">{message}</p>}

      <div className={`mt-6 grid gap-6 ${showPreview ? "lg:grid-cols-2" : ""}`}>
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-wine">Casal</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={tenant.partner1_name}
                onChange={(e) => setTenant({ ...tenant, partner1_name: e.target.value })}
                className="rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Noiva"
              />
              <input
                value={tenant.partner2_name}
                onChange={(e) => setTenant({ ...tenant, partner2_name: e.target.value })}
                className="rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Noivo"
              />
              <input
                type="date"
                value={tenant.wedding_date}
                onChange={(e) => setTenant({ ...tenant, wedding_date: e.target.value })}
                className="rounded-lg border border-wine/20 px-4 py-2"
              />
              <input
                placeholder="Senha do site (opcional)"
                value={tenant.site_password ?? ""}
                onChange={(e) => setTenant({ ...tenant, site_password: e.target.value })}
                className="rounded-lg border border-wine/20 px-4 py-2"
              />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-wine">Template</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTemplateId(t.id);
                    setThemeColor(t.defaultColor);
                  }}
                  className={`rounded-xl border-2 p-4 text-left ${
                    templateId === t.id ? "border-wine bg-rose/10" : "border-wine/10"
                  }`}
                >
                  <p className="font-semibold text-wine">{t.name}</p>
                  <p className="mt-1 text-xs text-wine/60">{t.description}</p>
                </button>
              ))}
            </div>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="mt-4 h-10 w-20"
            />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-wine">Fotos do casal</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
              <label>
                Capa
                <input type="file" accept="image/*" className="mt-1 block" onChange={(e) => e.target.files?.[0] && setPhoto("coverPhotoUrl", e.target.files[0])} />
              </label>
              <label>
                Noiva
                <input type="file" accept="image/*" className="mt-1 block" onChange={(e) => e.target.files?.[0] && setPhoto("bridePhotoUrl", e.target.files[0])} />
              </label>
              <label>
                Noivo
                <input type="file" accept="image/*" className="mt-1 block" onChange={(e) => e.target.files?.[0] && setPhoto("groomPhotoUrl", e.target.files[0])} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-wine">Textos</h2>
            <div className="mt-4 space-y-3">
              <input
                value={content.heroSubtitle ?? ""}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                className="w-full rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Frase da capa"
              />
              <textarea
                rows={4}
                value={content.story ?? ""}
                onChange={(e) => setContent({ ...content, story: e.target.value })}
                className="w-full rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Nossa história"
              />
              <input
                value={content.dressCode ?? ""}
                onChange={(e) => setContent({ ...content, dressCode: e.target.value })}
                className="w-full rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Traje"
              />
              <textarea
                rows={2}
                value={content.travel ?? ""}
                onChange={(e) => setContent({ ...content, travel: e.target.value })}
                className="w-full rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Hospedagem"
              />
              <input
                value={content.thankYouMessage ?? ""}
                onChange={(e) => setContent({ ...content, thankYouMessage: e.target.value })}
                className="w-full rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Recado de obrigado"
              />
              <input
                value={content.musicNote ?? ""}
                onChange={(e) => setContent({ ...content, musicNote: e.target.value })}
                className="w-full rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Música do primeiro baile"
              />
              <textarea
                rows={2}
                value={content.registryMessage ?? ""}
                onChange={(e) => setContent({ ...content, registryMessage: e.target.value })}
                className="w-full rounded-lg border border-wine/20 px-4 py-2"
                placeholder="Recado da lista de presentes"
              />
            </div>
          </section>

          {(["ceremony", "reception"] as const).map((key) => (
            <section key={key} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-wine">{key === "ceremony" ? "Cerimônia" : "Recepção"}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(["venue", "address", "date", "time", "mapsUrl"] as const).map((field) => (
                  <input
                    key={field}
                    placeholder={
                      field === "venue"
                        ? "Local"
                        : field === "address"
                          ? "Endereço"
                          : field === "date"
                            ? "Data"
                            : field === "time"
                              ? "Horário"
                              : "Link do mapa"
                    }
                    type={field === "date" ? "date" : "text"}
                    value={content[key]?.[field] ?? ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        [key]: { ...content[key]!, [field]: e.target.value },
                      })
                    }
                    className="rounded-lg border border-wine/20 px-4 py-2"
                  />
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-wine">O dia (horários)</h2>
            <button
              type="button"
              className="mt-3 text-sm text-wine underline"
              onClick={() =>
                setContent({
                  ...content,
                  timeline: [
                    ...content.timeline,
                    { id: crypto.randomUUID(), time: "16:00", title: "", description: "" },
                  ],
                })
              }
            >
              + Horário
            </button>
            <div className="mt-3 space-y-2">
              {content.timeline.map((item) => (
                <div key={item.id} className="grid grid-cols-3 gap-2">
                  <input
                    value={item.time}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        timeline: content.timeline.map((t) =>
                          t.id === item.id ? { ...t, time: e.target.value } : t,
                        ),
                      })
                    }
                    className="rounded-lg border border-wine/20 px-2 py-2 text-sm"
                  />
                  <input
                    value={item.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        timeline: content.timeline.map((t) =>
                          t.id === item.id ? { ...t, title: e.target.value } : t,
                        ),
                      })
                    }
                    className="rounded-lg border border-wine/20 px-2 py-2 text-sm"
                    placeholder="Título"
                  />
                  <input
                    value={item.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        timeline: content.timeline.map((t) =>
                          t.id === item.id ? { ...t, description: e.target.value } : t,
                        ),
                      })
                    }
                    className="rounded-lg border border-wine/20 px-2 py-2 text-sm"
                    placeholder="Detalhe"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-wine">Padrinhos</h2>
            <button
              type="button"
              className="mt-3 text-sm text-wine underline"
              onClick={() =>
                setContent({
                  ...content,
                  padrinhos: [
                    ...content.padrinhos,
                    { id: crypto.randomUUID(), name: "", role: "Padrinho" },
                  ],
                })
              }
            >
              + Pessoa
            </button>
            <div className="mt-3 space-y-2">
              {content.padrinhos.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-2">
                  <input
                    value={p.name}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        padrinhos: content.padrinhos.map((x) =>
                          x.id === p.id ? { ...x, name: e.target.value } : x,
                        ),
                      })
                    }
                    className="flex-1 rounded-lg border border-wine/20 px-2 py-2 text-sm"
                    placeholder="Nome"
                  />
                  <input
                    value={p.role}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        padrinhos: content.padrinhos.map((t) =>
                          t.id === p.id ? { ...t, role: e.target.value } : t,
                        ),
                      })
                    }
                    className="w-28 rounded-lg border border-wine/20 px-2 py-2 text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="text-xs"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadWeddingPhoto(file);
                        setContent({
                          ...content,
                          padrinhos: content.padrinhos.map((x) =>
                            x.id === p.id ? { ...x, photoUrl: url } : x,
                          ),
                        });
                      } catch {
                        setMessage("Erro ao enviar foto");
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-wine">Galeria ({content.gallery.length})</h2>
            <input type="file" accept="image/*" onChange={addGallery} className="mt-4 text-sm" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {content.gallery.map((photo, i) => (
                <div key={photo.id} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                  <input
                    placeholder="Legenda"
                    value={photo.caption ?? ""}
                    onChange={(e) => {
                      const gallery = [...content.gallery];
                      gallery[i] = { ...photo, caption: e.target.value };
                      setContent({ ...content, gallery });
                    }}
                    className="mt-1 w-full rounded border px-1 text-xs"
                  />
                  <button
                    onClick={() =>
                      setContent({
                        ...content,
                        gallery: content.gallery.filter((p) => p.id !== photo.id),
                      })
                    }
                    className="absolute right-1 top-1 rounded bg-red-500 px-2 text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {showPreview && (
          <div className="overflow-hidden rounded-2xl border border-wine/10 bg-white">
            <p className="border-b px-4 py-2 text-xs uppercase tracking-widest text-wine/50">
              Prévia ao vivo
            </p>
            <div className="origin-top scale-[0.55] h-[1400px] w-[180%]">
              <WeddingSiteView
                tenant={tenant}
                templateId={templateId}
                themeColor={themeColor}
                content={content}
                showBranding={false}
                siteBase="/app/preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
