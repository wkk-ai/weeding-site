"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLANS } from "@/lib/constants";
import type { PlanId } from "@/lib/constants";
import type { Tenant } from "@/lib/types";

export default function DominioPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [custom, setCustom] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "nossocasamento.com.br";

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("tenants").select("*").eq("user_id", user.id).single();
      if (data) {
        setTenant(data as Tenant);
        setCustom(data.custom_domain ?? "");
        setPassword(data.site_password ?? "");
      }
    })();
  }, []);

  async function save() {
    if (!tenant) return;
    const supabase = createClient();
    await supabase
      .from("tenants")
      .update({
        site_password: password || null,
        custom_domain: custom || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tenant.id);
    setMsg("Salvo. No DNS, aponte o CNAME para cname.vercel-dns.com");
  }

  if (!tenant) return <p>Carregando...</p>;
  const plan = PLANS[tenant.plan as PlanId];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-wine">Domínio e senha</h1>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Endereço atual</h2>
        <p className="mt-3 rounded-lg bg-cream px-4 py-3 font-mono text-wine">
          https://{tenant.slug}.{appDomain}
        </p>
      </div>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Senha para convidados</h2>
        <p className="mt-1 text-sm text-wine/70">Deixe vazio para o site ficar aberto.</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-3 w-full rounded-lg border border-wine/20 px-4 py-2"
        />
      </div>
      {plan.customDomain ? (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-wine">Domínio próprio</h2>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="mariaejoao.com.br"
            className="mt-3 w-full rounded-lg border border-wine/20 px-4 py-2"
          />
          <p className="mt-2 text-xs text-wine/60">
            Compre no Registro.br ou Hostinger. CNAME para cname.vercel-dns.com.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-wine/70">
          Domínio .com.br entra no plano Completo.
        </p>
      )}
      <button onClick={save} className="mt-6 rounded-full bg-wine px-6 py-2 font-semibold text-white">
        Salvar
      </button>
      {msg && <p className="mt-3 text-sm text-sage">{msg}</p>}
    </div>
  );
}
