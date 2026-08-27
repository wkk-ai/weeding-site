import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, Rocket } from "lucide-react";
import { PublishButton } from "@/components/app/publish-button";

export default async function AppDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { count: guestCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenant!.id);

  const { count: confirmedCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenant!.id)
    .eq("rsvp_status", "confirmed");

  const { data: gifts } = await supabase
    .from("gifts")
    .select("funded_cents, price_cents")
    .eq("tenant_id", tenant!.id);

  const totalFunded = gifts?.reduce((s, g) => s + g.funded_cents, 0) ?? 0;
  const plan = PLANS[tenant!.plan as keyof typeof PLANS];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-wine">Visão geral</h1>
          <p className="mt-1 text-wine/70">Gerencie seu site de casamento</p>
        </div>
        <div className="flex gap-3">
          <PublishButton tenantId={tenant!.id} published={tenant!.published} />
          {tenant!.published && (
            <Link
              href={`/s/${tenant!.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-wine/20 px-5 py-2.5 text-sm font-semibold text-wine hover:bg-white"
            >
              <ExternalLink className="h-4 w-4" />
              Ver site
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">RSVPs confirmados</p>
          <p className="mt-2 font-serif text-3xl font-bold text-wine">
            {confirmedCount ?? 0}
            <span className="text-lg font-normal text-wine/50"> / {guestCount ?? 0}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">Presentes recebidos</p>
          <p className="mt-2 font-serif text-3xl font-bold text-wine">
            {formatCurrency(totalFunded)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">Taxa da lista</p>
          <p className="mt-2 font-serif text-3xl font-bold text-sage">
            {plan.giftFeePercent}%
          </p>
        </div>
      </div>

      {!tenant!.published && (
        <div className="mt-8 rounded-2xl border border-rose/40 bg-rose/10 p-6">
          <div className="flex items-start gap-4">
            <Rocket className="h-8 w-8 shrink-0 text-wine" />
            <div>
              <h2 className="font-semibold text-wine">Próximos passos</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-wine/80">
                <li>
                  <Link href="/app/editor" className="font-medium text-wine hover:underline">
                    Personalize seu site
                  </Link>{" "}
                  — escolha template e adicione fotos
                </li>
                <li>
                  <Link href="/app/presentes" className="font-medium text-wine hover:underline">
                    Crie sua lista de presentes
                  </Link>
                </li>
                <li>Clique em &quot;Publicar site&quot; quando estiver pronto</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {tenant!.plan === "free" && (
        <div className="mt-8 rounded-2xl bg-wine p-6 text-white">
          <h2 className="font-serif text-xl font-bold">Upgrade para taxa menor</h2>
          <p className="mt-2 text-white/80">
            Plano Essencial (R$49): taxa de 2,49%. Completo (R$99): taxa de 1,99%.
          </p>
          <Link
            href="/app/planos"
            className="mt-4 inline-block rounded-full bg-white px-6 py-2 text-sm font-semibold text-wine"
          >
            Ver planos
          </Link>
        </div>
      )}
    </div>
  );
}
