import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ giftId: string }> },
) {
  const { giftId } = await params;
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, plan")
    .eq("slug", slug)
    .single();

  const { data: gift } = await supabase
    .from("gifts")
    .select("title, price_cents, funded_cents, status, photo_url")
    .eq("id", giftId)
    .eq("tenant_id", tenant?.id ?? "")
    .single();

  if (!gift || !tenant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const plan = PLANS[tenant.plan as keyof typeof PLANS];

  return NextResponse.json({
    title: gift.title,
    price_cents: gift.price_cents - gift.funded_cents,
    fee_percent: plan.giftFeePercent,
    photo_url: gift.photo_url ?? null,
  });
}
