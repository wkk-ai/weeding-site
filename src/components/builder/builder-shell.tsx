"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { TEMPLATES, slugify } from "@/lib/utils";
import { palettesFor } from "@/lib/wedding-theme";
import { asset } from "@/lib/assets";
import { WeddingSiteView } from "@/components/wedding/wedding-site";

export interface BuilderState {
  partner1: string;
  partner2: string;
  weddingDate: string;
  slug: string;
  templateId: TemplateId;
  themeColor: string;
  paletteId: string;
  content: SiteContent;
  sitePassword?: string;
}

const STEPS = [
  { n: 1, title: "Vocês" },
  { n: 2, title: "A cara" },
  { n: 3, title: "O dia" },
  { n: 4, title: "Mais" },
  { n: 5, title: "Olho do convidado" },
] as const;

export function BuilderShell({
  mode,
  state,
  onChange,
  onSave,
  saving,
  status,
  onReset,
  onUpload,
  published,
}: {
  mode: "playground" | "account";
  state: BuilderState;
  onChange: (next: BuilderState) => void;
  onSave?: () => void;
  saving?: boolean;
  status?: string;
  onReset?: () => void;
  onUpload: (file: File) => Promise<string>;
  published?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [overlay, setOverlay] = useState<"rsvp" | "gifts" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [nameErr, setNameErr] = useState("");

  function needNames() {
    if (!state.partner1.trim() || !state.partner2.trim()) {
      setNameErr("Os dois nomes. Sem isso o convite não nasce.");
      setStep(1);
      return false;
    }
    if (!state.weddingDate) {
      setNameErr("Falta a data.");
      setStep(1);
      return false;
    }
    setNameErr("");
    return true;
  }

  const example = !state.partner1 || !state.partner2;
  const tenant: Tenant = {
    id: "builder",
    user_id: "builder",
    slug: state.slug || "maria-e-joao",
    partner1_name: state.partner1 || "Maria",
    partner2_name: state.partner2 || "João",
    wedding_date: state.weddingDate || "2026-11-14",
    plan: "essential",
    plan_paid_at: null,
    published: Boolean(published),
    password_hash: null,
    asaas_wallet_id: null,
    pix_key: null,
    site_password: state.sitePassword ?? null,
    created_at: "",
    updated_at: "",
  };

  function patch(partial: Partial<BuilderState>) {
    onChange({ ...state, ...partial });
  }

  function patchContent(partial: Partial<SiteContent>) {
    onChange({ ...state, content: { ...state.content, ...partial } });
  }

  async function photo(
    key: "coverPhotoUrl" | "bridePhotoUrl" | "groomPhotoUrl",
    file: File | undefined,
  ) {
    if (!file) return;
    setPhotoError("");
    try {
      const url = await onUpload(file);
      patchContent({ [key]: url });
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "heavy") setPhotoError("Foto pesada demais. Escolha outra até 5 MB.");
      else if (code === "type") setPhotoError("Use JPG ou PNG.");
      else setPhotoError("Não deu pra enviar esta foto. Tente de novo.");
    }
  }

  async function galleryAdd(file: File | undefined) {
    if (!file) return;
    if (mode === "playground" && state.content.gallery.length >= 6) {
      setPhotoError("Limite desta prova: 6 fotos. Plano grátis: 20.");
      return;
    }
    setPhotoError("");
    try {
      const url = await onUpload(file);
      patchContent({
        gallery: [...state.content.gallery, { id: crypto.randomUUID(), url }],
      });
    } catch {
      setPhotoError("Não deu pra enviar esta foto. Tente de novo.");
    }
  }

  const phone = (
    <div className="phone-frame">
      <div className="h-full overflow-y-auto">
        <WeddingSiteView
          tenant={tenant}
          templateId={state.templateId}
          themeColor={state.themeColor}
          content={state.content}
          showBranding={false}
          siteBase="/criar"
          previewMode={true}
          exampleNames={example}
          onGuestAction={setOverlay}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6efe6] text-[#3a2a24]">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#e6d9cc] bg-[#f6efe6]/95 px-4 py-3 backdrop-blur">
        <div>
          <p className="font-serif text-lg italic">Montar o site</p>
          <p className="text-xs text-[#8a746c]">
            {status || (mode === "playground" ? "Salvo neste aparelho" : "Salvo")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-[#3a2a24]/20 px-3 py-1.5 text-sm lg:hidden"
            onClick={() => setPreviewOpen(true)}
          >
            Ver site
          </button>
          {mode === "playground" && onReset && (
            <button type="button" className="text-sm underline" onClick={onReset}>
              Limpar prova
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="rounded-full bg-[#2a1c18] px-4 py-2 text-sm text-[#f6efe6] disabled:opacity-50"
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
          )}
        </div>
      </header>

      {mode === "account" && !published && (
        <p className="bg-[#c4a574]/20 px-4 py-2 text-center text-sm">
          Convidados ainda não veem isto.
        </p>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <ol className="mb-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em]">
            {STEPS.map((s) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.n > 1 && !needNames()) return;
                    setStep(s.n);
                  }}
                  className={`rounded-full px-3 py-1 ${
                    step === s.n ? "bg-[#2a1c18] text-[#f6efe6]" : "bg-white text-[#8a746c]"
                  }`}
                >
                  {s.n} · {s.title}
                </button>
              </li>
            ))}
          </ol>

          <div key={step} className="nc-in">
          {step === 1 && (
            <section className="space-y-4 rounded-2xl bg-white p-6">
              <h2 className="font-serif text-2xl italic">Vocês</h2>
              <label className="block text-sm">
                Seu nome
                <input
                  value={state.partner1}
                  aria-invalid={!state.partner1.trim() && Boolean(nameErr)}
                  onChange={(e) => {
                    const partner1 = e.target.value;
                    const slug = slugify(`${partner1}-${state.partner2}`);
                    patch({ partner1, slug });
                    if (nameErr) setNameErr("");
                  }}
                  className={`mt-1 w-full border px-3 py-2 ${
                    !state.partner1.trim() && nameErr ? "border-wine ring-2 ring-wine/30" : "border-[#e6d9cc]"
                  }`}
                />
              </label>
              <label className="block text-sm">
                Nome do(a) parceiro(a)
                <input
                  value={state.partner2}
                  aria-invalid={!state.partner2.trim() && Boolean(nameErr)}
                  onChange={(e) => {
                    const partner2 = e.target.value;
                    const slug = slugify(`${state.partner1}-${partner2}`);
                    patch({ partner2, slug });
                    if (nameErr) setNameErr("");
                  }}
                  className={`mt-1 w-full border px-3 py-2 ${
                    !state.partner2.trim() && nameErr ? "border-wine ring-2 ring-wine/30" : "border-[#e6d9cc]"
                  }`}
                />
              </label>
              <label className="block text-sm">
                Data do casamento
                <input
                  type="date"
                  value={state.weddingDate}
                  aria-invalid={!state.weddingDate && Boolean(nameErr)}
                  onChange={(e) => {
                    patch({ weddingDate: e.target.value });
                    if (nameErr) setNameErr("");
                  }}
                  className={`mt-1 w-full border px-3 py-2 ${
                    !state.weddingDate && nameErr ? "border-wine ring-2 ring-wine/30" : "border-[#e6d9cc]"
                  }`}
                />
              </label>
              {nameErr ? (
                <p className="text-sm font-semibold text-wine" role="alert">
                  {nameErr}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (!needNames()) return;
                  setStep(2);
                }}
                className="rounded-full bg-[#2a1c18] px-5 py-2 text-sm text-white"
              >
                Continuar
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-5 rounded-2xl bg-white p-6">
              <h2 className="font-serif text-2xl italic">A cara</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      patch({
                        templateId: t.id,
                        themeColor: t.defaultColor,
                        paletteId: palettesFor(t.id)[0].id,
                      })
                    }
                    className={`overflow-hidden text-left ${
                      state.templateId === t.id ? "ring-2 ring-[#2a1c18]" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(t.preview)} alt={t.name} className="h-28 w-full object-cover" />
                    <span className="block p-2">
                      <span className="font-serif text-lg italic">{t.name}</span>
                      <span className="mt-1 block text-xs text-[#8a746c]">{t.description}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {palettesFor(state.templateId).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    title={p.name}
                    onClick={() => patch({ paletteId: p.id, themeColor: p.color })}
                    className={`h-8 w-8 rounded-full border ${
                      state.themeColor === p.color ? "ring-2 ring-offset-2 ring-[#2a1c18]" : ""
                    }`}
                    style={{ background: p.color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="text-sm underline">
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full bg-[#2a1c18] px-5 py-2 text-sm text-white"
                >
                  Continuar
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4 rounded-2xl bg-white p-6">
              <h2 className="font-serif text-2xl italic">O dia</h2>
              <label className="block text-sm">
                Foto de capa
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block text-sm"
                  onChange={(e) => photo("coverPhotoUrl", e.target.files?.[0])}
                />
                <span className="mt-1 block text-xs text-[#8a746c]">Toque para foto de capa</span>
              </label>
              <label className="block text-sm">
                Local da cerimônia
                <input
                  value={state.content.ceremony?.venue ?? ""}
                  onChange={(e) =>
                    patchContent({
                      ceremony: { ...state.content.ceremony!, venue: e.target.value },
                    })
                  }
                  className="mt-1 w-full border border-[#e6d9cc] px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                Horário
                <input
                  value={state.content.ceremony?.time ?? ""}
                  onChange={(e) =>
                    patchContent({
                      ceremony: { ...state.content.ceremony!, time: e.target.value },
                    })
                  }
                  className="mt-1 w-full border border-[#e6d9cc] px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                Cidade
                <input
                  value={state.content.ceremony?.address ?? ""}
                  onChange={(e) =>
                    patchContent({
                      ceremony: { ...state.content.ceremony!, address: e.target.value },
                    })
                  }
                  className="mt-1 w-full border border-[#e6d9cc] px-3 py-2"
                />
              </label>
              {photoError && <p className="text-sm text-red-700">{photoError}</p>}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setStep(2)} className="text-sm underline">
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="rounded-full bg-[#2a1c18] px-5 py-2 text-sm text-white"
                >
                  Já dá pra mostrar
                </button>
                <button type="button" onClick={() => setStep(4)} className="text-sm underline">
                  Continuar
                </button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-4 rounded-2xl bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl italic">Mais</h2>
                <button type="button" onClick={() => setStep(5)} className="text-sm underline">
                  Pular
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Nossa história"
                value={state.content.story ?? ""}
                onChange={(e) => patchContent({ story: e.target.value })}
                className="w-full border border-[#e6d9cc] px-3 py-2"
              />
              <input
                placeholder="Traje"
                value={state.content.dressCode ?? ""}
                onChange={(e) => patchContent({ dressCode: e.target.value })}
                className="w-full border border-[#e6d9cc] px-3 py-2"
              />
              <input
                placeholder="Local da festa"
                value={state.content.reception?.venue ?? ""}
                onChange={(e) =>
                  patchContent({
                    reception: { ...state.content.reception!, venue: e.target.value },
                  })
                }
                className="w-full border border-[#e6d9cc] px-3 py-2"
              />
              <textarea
                rows={2}
                placeholder="Hospedagem e viagem"
                value={state.content.travel ?? ""}
                onChange={(e) => patchContent({ travel: e.target.value })}
                className="w-full border border-[#e6d9cc] px-3 py-2"
              />
              <label className="block text-sm">
                Mais fotos
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block text-sm"
                  onChange={(e) => galleryAdd(e.target.files?.[0])}
                />
              </label>
              {photoError && <p className="text-sm text-red-700">{photoError}</p>}
              {mode === "account" && (
                <input
                  placeholder="Senha do site (opcional)"
                  value={state.sitePassword ?? ""}
                  onChange={(e) => patch({ sitePassword: e.target.value })}
                  className="w-full border border-[#e6d9cc] px-3 py-2"
                />
              )}
              <button
                type="button"
                onClick={() => setStep(5)}
                className="rounded-full bg-[#2a1c18] px-5 py-2 text-sm text-white"
              >
                Olho do convidado
              </button>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-4 rounded-2xl bg-white p-6">
              <h2 className="font-serif text-2xl italic">Olho do convidado</h2>
              <p className="text-sm text-[#8a746c]">
                Role o telefone ao lado. Confirmar presença e presentes abrem uma prova.
              </p>
              {mode === "playground" ? (
                <Link
                  href="/signup"
                  className="inline-block rounded-full bg-[#2a1c18] px-5 py-3 text-sm text-white"
                >
                  Criar conta pra publicar
                </Link>
              ) : (
                <p className="text-sm">Quando estiver pronto, publique no painel.</p>
              )}
              <button type="button" onClick={() => setStep(4)} className="block text-sm underline">
                Voltar
              </button>
            </section>
          )}
          </div>
        </div>

        <aside className="hidden justify-center lg:flex">{phone}</aside>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 lg:hidden">
          <div className="relative">
            <button
              type="button"
              className="absolute -top-10 right-0 text-white"
              onClick={() => setPreviewOpen(false)}
            >
              Fechar
            </button>
            {phone}
          </div>
        </div>
      )}

      {overlay && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">
          <div className="max-w-sm bg-[#fffdf8] p-8 text-center">
            <h3 className="font-serif text-2xl italic">
              {overlay === "rsvp" ? "Confirmar presença" : "Lista de presentes"}
            </h3>
            <p className="mt-3 text-sm text-[#5c4a40]">
              {overlay === "rsvp"
                ? "Isto é uma prova. Depois da conta, os convidados confirmam de verdade."
                : "Isto é uma prova. PIX entra depois da conta."}
            </p>
            <button
              type="button"
              className="mt-6 text-sm uppercase tracking-[0.2em] underline"
              onClick={() => setOverlay(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
