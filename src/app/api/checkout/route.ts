import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get("plan");

  if (!planId || !(planId in PLANS) || planId === "free") {
    return NextResponse.redirect(new URL("/app/planos", request.url));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Production: redirect to Asaas/Stripe Checkout with plan.price
  await supabase
    .from("tenants")
    .update({
      plan: planId,
      plan_paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  return NextResponse.redirect(new URL("/app/planos", request.url));
}
