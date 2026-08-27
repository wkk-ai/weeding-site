import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  tenantId: z.string().uuid(),
  published: z.boolean(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { tenantId, published } = parsed.data;

  const { error } = await supabase
    .from("tenants")
    .update({
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenantId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (published) {
    await supabase
      .from("sites")
      .update({ published_at: new Date().toISOString() })
      .eq("tenant_id", tenantId);
  }

  return NextResponse.json({ ok: true });
}
