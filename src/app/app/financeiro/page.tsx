import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { PLANS } from "@/lib/constants";

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("tenant_id", tenant!.id)
    .eq("status", "confirmed")
    .order("created_at", { ascending: false });

  const totalReceived =
    transactions?.reduce((s, t) => s + t.amount_cents - t.platform_fee_cents, 0) ?? 0;
  const totalFees =
    transactions?.reduce((s, t) => s + t.platform_fee_cents, 0) ?? 0;

  const plan = PLANS[tenant!.plan as keyof typeof PLANS];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-wine">Financeiro</h1>
      <p className="mt-1 text-wine/70">Acompanhe presentes recebidos e taxas</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">Total recebido (líquido)</p>
          <p className="mt-2 font-serif text-3xl font-bold text-sage">
            {formatCurrency(totalReceived)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">Taxas da plataforma</p>
          <p className="mt-2 font-serif text-3xl font-bold text-wine">
            {formatCurrency(totalFees)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">Sua taxa atual</p>
          <p className="mt-2 font-serif text-3xl font-bold text-wine-light">
            {plan.giftFeePercent}%
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Chave PIX para saque</h2>
        <p className="mt-2 text-sm text-wine/70">
          {tenant!.pix_key
            ? `PIX cadastrado: ${tenant!.pix_key}`
            : "Cadastre sua chave PIX para receber os presentes."}
        </p>
        <form action="/api/tenant/pix" method="post" className="mt-4 flex gap-3">
          <input
            name="pix_key"
            placeholder="Sua chave PIX (e-mail, CPF ou telefone)"
            defaultValue={tenant!.pix_key ?? ""}
            className="flex-1 rounded-lg border border-wine/20 px-4 py-2"
          />
          <button
            type="submit"
            className="rounded-full bg-wine px-5 py-2 text-sm font-semibold text-white"
          >
            Salvar
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-wine">Transações confirmadas</h2>
        {(!transactions || transactions.length === 0) && (
          <p className="mt-4 text-wine/60">Nenhuma transação ainda.</p>
        )}
        <div className="mt-4 space-y-2">
          {transactions?.map((t) => (
            <div
              key={t.id}
              className="flex justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-wine">{t.guest_name}</p>
                <p className="text-xs text-wine/50">
                  {new Date(t.created_at).toLocaleDateString("pt-BR")} ·{" "}
                  {t.payment_method.toUpperCase()}
                </p>
              </div>
              <p className="font-semibold text-sage">
                +{formatCurrency(t.amount_cents - t.platform_fee_cents)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
