import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/constants";

export default async function DominioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "nossocasamento.com.br";
  const plan = PLANS[tenant!.plan as keyof typeof PLANS];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-wine">Domínio</h1>
      <p className="mt-1 text-wine/70">Endereço do seu site de casamento</p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Endereço atual</h2>
        <p className="mt-3 rounded-lg bg-cream px-4 py-3 font-mono text-wine">
          https://{tenant!.slug}.{appDomain}
        </p>
        <p className="mt-2 text-sm text-wine/60">
          Em produção, configure wildcard DNS: *.{appDomain} → Vercel
        </p>
      </div>

      {plan.customDomain ? (
        <div className="mt-6 rounded-2xl border border-sage/30 bg-green-50 p-6">
          <h2 className="font-semibold text-wine">Domínio personalizado</h2>
          <p className="mt-2 text-sm text-wine/70">
            Plano Completo inclui domínio próprio (ex: mariaejoao.com.br).
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-wine/80">
            <li>Compre o domínio no Hostinger ou Registro.br</li>
            <li>Aponte CNAME para cname.vercel-dns.com</li>
            <li>Adicione o domínio no painel Vercel do projeto</li>
          </ol>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-rose/20 p-6">
          <p className="text-sm text-wine">
            Upgrade para <strong>Essencial</strong> (subdomínio premium) ou{" "}
            <strong>Completo</strong> (domínio .com.br) em{" "}
            <a href="/app/planos" className="font-semibold underline">
              Planos
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
