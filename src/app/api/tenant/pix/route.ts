import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const form = await request.formData();
  const pixKey = form.get("pix_key") as string;

  await supabase
    .from("tenants")
    .update({ pix_key: pixKey, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  return NextResponse.redirect(new URL("/app/financeiro", request.url));
}
