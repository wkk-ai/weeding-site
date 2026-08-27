import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/constants";
import { Check } from "lucide-react";

export default async function PlanosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("plan")
    .eq("user_id", user!.id)
    .single();

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl font-bold text-wine">Planos</h1>
      <p className="mt-1 text-wine/70">
        Pague uma vez. Taxa da lista menor que Casar.com (3,89%).
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Object.values(PLANS).map((plan) => {
          const isCurrent = tenant?.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                plan.id === "essential" ? "border-wine ring-2 ring-wine/20" : "border-wine/10"
              }`}
            >
              {isCurrent && (
                <span className="mb-2 inline-block rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold text-sage">
                  Plano atual
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold text-wine">{plan.name}</h3>
              <p className="mt-2 font-serif text-4xl font-bold text-wine-light">
                {plan.price === 0 ? "R$0" : `R$${plan.price}`}
              </p>
              <p className="text-sm text-wine/60">Taxa lista: {plan.giftFeePercent}%</p>
              <ul className="mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2 text-wine/80">
                  <Check className="h-4 w-4 text-sage" />
                  {plan.maxGuests} convidados RSVP
                </li>
                <li className="flex items-center gap-2 text-wine/80">
                  <Check className="h-4 w-4 text-sage" />
                  {plan.maxPhotos} fotos
                </li>
                <li className="flex items-center gap-2 text-wine/80">
                  <Check className="h-4 w-4 text-sage" />
                  {plan.hostingMonths} meses hospedagem
                </li>
                {!plan.branding && (
                  <li className="flex items-center gap-2 text-wine/80">
                    <Check className="h-4 w-4 text-sage" />
                    Sem marca da plataforma
                  </li>
                )}
              </ul>
              {!isCurrent && plan.price > 0 && (
                <Link
                  href={`/api/checkout?plan=${plan.id}`}
                  className="mt-6 block rounded-full bg-wine py-3 text-center text-sm font-semibold text-white hover:bg-wine-light"
                >
                  Assinar {plan.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl bg-cream-dark p-6 text-sm text-wine/80">
        <strong>Economia vs Casar.com:</strong> Em R$12.000 de presentes, taxa 2,49%
        economiza R$168 vs 3,89%. Plano Completo (1,99%) economiza R$228.
      </div>
    </div>
  );
}
