import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { PLANS } from "@/lib/constants";

const schema = z.object({
  slug: z.string(),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  rsvp_status: z.enum(["confirmed", "declined"]),
  meal_choice: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { slug, name, email, rsvp_status, meal_choice, notes } = parsed.data;

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, plan")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!tenant) {
    return NextResponse.json({ error: "Site não encontrado" }, { status: 404 });
  }

  const plan = PLANS[tenant.plan as keyof typeof PLANS];

  const { count } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenant.id);

  if ((count ?? 0) >= plan.maxGuests) {
    return NextResponse.json(
      { error: "Limite de convidados atingido para este plano" },
      { status: 403 },
    );
  }

  const { error } = await supabase.from("guests").insert({
    tenant_id: tenant.id,
    name,
    email: email || null,
    rsvp_status,
    meal_choice: meal_choice || null,
    notes: notes || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
