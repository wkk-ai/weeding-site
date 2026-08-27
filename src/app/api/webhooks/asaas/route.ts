import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
export async function POST(request: Request) {
  const token = request.headers.get("asaas-access-token");
  if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const event = body.event as string;
  const payment = body.payment;

  if (event !== "PAYMENT_RECEIVED" && event !== "PAYMENT_CONFIRMED") {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceClient();
  const externalRef = payment?.externalReference;

  if (!externalRef) {
    return NextResponse.json({ ok: true });
  }

  const { data: transaction } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", externalRef)
    .single();

  if (!transaction || transaction.status === "confirmed") {
    return NextResponse.json({ ok: true });
  }

  await supabase
    .from("transactions")
    .update({ status: "confirmed" })
    .eq("id", transaction.id);

  if (transaction.gift_id) {
    const { data: gift } = await supabase
      .from("gifts")
      .select("funded_cents, price_cents")
      .eq("id", transaction.gift_id)
      .single();

    if (gift) {
      const newFunded = gift.funded_cents + transaction.amount_cents;
      await supabase
        .from("gifts")
        .update({
          funded_cents: newFunded,
          status: newFunded >= gift.price_cents ? "funded" : "active",
        })
        .eq("id", transaction.gift_id);
    }
  }

  return NextResponse.json({ ok: true });
}
