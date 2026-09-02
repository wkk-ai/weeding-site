import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { PLANS } from "@/lib/constants";

const schema = z.object({
  slug: z.string(),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  rsvp_status: z.enum(["confirmed", "declined"]),
  meal_choice: z.string().optional(),
  notes: z.string().optional(),
  plus_one: z.boolean().optional(),
  plus_one_name: z.string().optional(),
  party_size: z.number().int().min(1).optional(),
  kids: z.number().int().min(0).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { slug, name, email, phone, rsvp_status, meal_choice, notes, plus_one, plus_one_name, party_size, kids } = parsed.data;

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
    phone: phone || null,
    rsvp_status,
    meal_choice: meal_choice || null,
    notes: notes || null,
    plus_one: plus_one ?? false,
    plus_one_name: plus_one_name || null,
    party_size: party_size ?? 1,
    kids: kids ?? 0,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
