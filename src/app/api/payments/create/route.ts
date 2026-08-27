import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/constants";
import {
  createPixPayment,
  createCardPayment,
  createCustomer,
  calculatePlatformFeeCents,
  estimateProcessingFeeCents,
} from "@/lib/asaas";
import { z } from "zod";
import { CARD_SURCHARGE_PERCENT } from "@/lib/constants";

const schema = z.object({
  slug: z.string(),
  giftId: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  method: z.enum(["pix", "card"]),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { slug, giftId, name, email, method } = parsed.data;

  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return NextResponse.json(
      { error: "Serviço de pagamento não configurado" },
      { status: 503 },
    );
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!tenant) {
    return NextResponse.json({ error: "Site não encontrado" }, { status: 404 });
  }

  const { data: gift } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", giftId)
    .eq("tenant_id", tenant.id)
    .single();

  if (!gift || gift.status === "funded") {
    return NextResponse.json({ error: "Presente indisponível" }, { status: 400 });
  }

  const plan = PLANS[tenant.plan as keyof typeof PLANS];
  const amountCents =
    gift.price_cents -
    gift.funded_cents +
    (method === "card"
      ? Math.round(gift.price_cents * (CARD_SURCHARGE_PERCENT / 100))
      : 0);

  const platformFee = calculatePlatformFeeCents(amountCents, plan.giftFeePercent);
  const processingFee = estimateProcessingFeeCents(amountCents, method);
  const amountReais = amountCents / 100;

  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .insert({
      tenant_id: tenant.id,
      gift_id: giftId,
      guest_name: name,
      guest_email: email || null,
      amount_cents: amountCents,
      platform_fee_cents: platformFee,
      processing_fee_cents: processingFee,
      payment_method: method,
      status: "pending",
    })
    .select()
    .single();

  if (txError || !transaction) {
    return NextResponse.json({ error: "Erro ao criar transação" }, { status: 500 });
  }

  if (!process.env.ASAAS_API_KEY) {
    return NextResponse.json({
      demo: true,
      message: "Modo demo — configure ASAAS_API_KEY para pagamentos reais",
      transactionId: transaction.id,
      pixCopiaECola: "00020126580014BR.GOV.BCB.PIX0136demo@nossocasamento.com.br",
    });
  }

  try {
    const customer = await createCustomer({
      name,
      email: email || undefined,
    });

    const description = `Presente: ${gift.title}`;
    const externalReference = transaction.id;

    const payment =
      method === "pix"
        ? await createPixPayment({
            customer: customer.id,
            value: amountReais,
            description,
            externalReference,
          })
        : await createCardPayment({
            customer: customer.id,
            value: amountReais,
            description,
            externalReference,
          });

    await supabase
      .from("transactions")
      .update({ asaas_payment_id: payment.id })
      .eq("id", transaction.id);

    return NextResponse.json({
      pixCopiaECola: payment.pixCopiaECola,
      invoiceUrl: payment.invoiceUrl,
      paymentId: payment.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
