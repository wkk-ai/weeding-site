"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TEMPLATES } from "@/lib/utils";
import type { SiteContent } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { Save } from "lucide-react";

export default function EditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteId, setSiteId] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [themeColor, setThemeColor] = useState("#8b5a6b");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!tenant) return;

      const { data: site } = await supabase
        .from("sites")
        .select("*")
        .eq("tenant_id", tenant.id)
        .single();

      if (site) {
        setSiteId(site.id);
        setTemplateId(site.template_id as TemplateId);
        setThemeColor(site.theme_color);
        setContent(site.content as SiteContent);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    if (!content || !siteId) return;
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
    setMessage("Salvo!");
    setSaving(false);
    setTimeout(() => setMessage(""), 2000);
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !content) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("wedding-photos").upload(path, file);
    if (error) {
      setMessage("Erro ao enviar foto");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("wedding-photos").getPublicUrl(path);

    setContent({
      ...content,
      gallery: [
        ...content.gallery,
        { id: crypto.randomUUID(), url: publicUrl },
      ],
    });
  }

  if (loading || !content) {
    return <p className="text-wine/60">Carregando editor...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-wine">Editor do site</h1>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-white hover:bg-wine-light disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-sage">{message}</p>}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Template</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTemplateId(t.id);
                setThemeColor(t.defaultColor);
              }}
              className={`rounded-xl border-2 p-4 text-left transition ${
                templateId === t.id
                  ? "border-wine bg-rose/10"
                  : "border-wine/10 hover:border-wine/30"
              }`}
            >
              <p className="font-semibold text-wine">{t.name}</p>
              <p className="mt-1 text-xs text-wine/60">{t.description}</p>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-wine/80">Cor do tema</label>
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="mt-1 h-10 w-20 cursor-pointer rounded border border-wine/20"
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Textos</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-wine/80">Subtítulo</label>
            <input
              value={content.heroSubtitle ?? ""}
              onChange={(e) =>
                setContent({ ...content, heroSubtitle: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wine/80">Nossa história</label>
            <textarea
              rows={4}
              value={content.story ?? ""}
              onChange={(e) => setContent({ ...content, story: e.target.value })}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wine/80">Traje</label>
            <input
              value={content.dressCode ?? ""}
              onChange={(e) =>
                setContent({ ...content, dressCode: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wine/80">Hospedagem / viagem</label>
            <textarea
              rows={3}
              value={content.travel ?? ""}
              onChange={(e) => setContent({ ...content, travel: e.target.value })}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-2"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Cerimônia</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(["venue", "address", "time"] as const).map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-wine/80 capitalize">
                {field === "venue" ? "Local" : field === "address" ? "Endereço" : "Horário"}
              </label>
              <input
                value={content.ceremony?.[field] ?? ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ceremony: { ...content.ceremony!, [field]: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-2"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Fotos ({content.gallery.length})</h2>
        <input
          type="file"
          accept="image/*"
          onChange={uploadPhoto}
          className="mt-4 text-sm"
        />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {content.gallery.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() =>
                  setContent({
                    ...content,
                    gallery: content.gallery.filter((p) => p.id !== photo.id),
                  })
                }
                className="absolute right-1 top-1 rounded bg-red-500 px-2 py-0.5 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
