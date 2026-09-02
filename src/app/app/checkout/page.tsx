"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PLANS, type PlanId } from "@/lib/constants";
import { PixQr } from "@/components/wedding/pix-qr";
import { DEMO_PIX_CODE } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const planId = (params.get("plan") ?? "essential") as PlanId;
  const plan = PLANS[planId] ?? PLANS.essential;
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (plan.price === 0) router.replace("/app/planos");
  }, [plan.price, router]);

  async function confirmDemo() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("tenants")
        .update({
          plan: plan.id,
          plan_paid_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }
    setPaid(true);
    setTimeout(() => router.push("/app/planos"), 1200);
  }

  if (plan.price === 0) {
    return <p className="text-wine/60">Plano grátis — sem pagamento.</p>;
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-serif text-3xl font-bold text-wine">Pagar plano {plan.name}</h1>
      <p className="mt-2 text-wine/70">
        R${plan.price} uma vez. Sem Asaas configurado, este PIX é de demonstração — o plano só
        muda depois que você confirma abaixo.
      </p>
      {paid ? (
        <p className="mt-6 text-sage">Plano atualizado.</p>
      ) : (
        <div className="mt-6">
          <PixQr code={DEMO_PIX_CODE} />
          <button
            onClick={confirmDemo}
            className="mt-4 w-full rounded-full border border-wine/20 py-3 text-sm font-semibold text-wine"
          >
            Confirmar pagamento demo
          </button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
