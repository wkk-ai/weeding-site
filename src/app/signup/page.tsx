"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import { slugify, defaultSiteContent, TEMPLATES } from "@/lib/utils";
import type { TemplateId } from "@/lib/constants";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Estamos muito felizes em compartilhar este momento com vocês",
  );

  function handleNamesChange(p1: string, p2: string) {
    setPartner1(p1);
    setPartner2(p2);
    if (!slug || slug === slugify(`${partner1}-${partner2}`)) {
      setSlug(slugify(`${p1}-${p2}`));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    const { error: tenantError } = await supabase.from("tenants").insert({
      user_id: authData.user.id,
      slug,
      partner1_name: partner1,
      partner2_name: partner2,
      wedding_date: weddingDate,
      plan: "free",
    });

    if (tenantError) {
      if (tenantError.code === "23505") {
        setError("Este endereço já está em uso. Escolha outro.");
      } else {
        setError("Erro ao criar site. Verifique se o banco está configurado.");
      }
      setLoading(false);
      return;
    }

    const { data: tenant } = await supabase
      .from("tenants")
      .select("id")
      .eq("user_id", authData.user.id)
      .single();

    if (tenant) {
      const content = defaultSiteContent();
      content.heroSubtitle = heroSubtitle;
      if (content.ceremony) content.ceremony.date = weddingDate;
      if (content.reception) content.reception.date = weddingDate;
      const tpl = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];

      if (coverFile) {
        const path = `${authData.user.id}/cover-${Date.now()}-${coverFile.name}`;
        const { error: upErr } = await supabase.storage
          .from("wedding-photos")
          .upload(path, coverFile);
        if (!upErr) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("wedding-photos").getPublicUrl(path);
          content.coverPhotoUrl = publicUrl;
        }
      }

      await supabase.from("sites").insert({
        tenant_id: tenant.id,
        template_id: templateId,
        theme_color: tpl.defaultColor,
        content,
      });
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-serif text-xl font-bold text-wine">
          <Heart className="h-5 w-5 fill-wine-light text-wine-light" />
          NossoCasamento
        </Link>
        <h1 className="text-center font-serif text-2xl font-bold text-wine">
          Criar seu site
        </h1>
        <p className="mt-2 text-center text-sm text-wine/70">
          Grátis para começar · Publique em minutos
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-wine/80">Seu nome</label>
                <input
                  required
                  value={partner1}
                  onChange={(e) => handleNamesChange(e.target.value, partner2)}
                  className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3 focus:border-wine focus:outline-none"
                  placeholder="Maria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80">Nome do(a) parceiro(a)</label>
                <input
                  required
                  value={partner2}
                  onChange={(e) => handleNamesChange(partner1, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3 focus:border-wine focus:outline-none"
                  placeholder="João"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80">Data do casamento</label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3 focus:border-wine focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80">Uma frase do convite</label>
                <input
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80">Foto de capa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  className="mt-1 w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80">Jeito do site</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {TEMPLATES.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`rounded-lg border p-2 text-xs ${
                        templateId === t.id ? "border-wine bg-rose/10" : "border-wine/10"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!partner1 || !partner2 || !weddingDate}
                className="w-full rounded-full bg-wine py-3 font-semibold text-white hover:bg-wine-light disabled:opacity-50"
              >
                Continuar
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-wine/80">Endereço do site</label>
                <div className="mt-1 flex items-center rounded-lg border border-wine/20">
                  <input
                    required
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    className="flex-1 px-4 py-3 focus:outline-none"
                    placeholder="maria-e-joao"
                  />
                  <span className="pr-4 text-sm text-wine/50">.nossocasamento.com.br</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3 focus:border-wine focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80">Senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3 focus:border-wine focus:outline-none"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-full border border-wine/20 py-3 font-semibold text-wine"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-wine py-3 font-semibold text-white hover:bg-wine-light disabled:opacity-50"
                >
                  {loading ? "Criando..." : "Criar site"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-wine/70">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-wine hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
