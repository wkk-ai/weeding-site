import { NextResponse } from "next/server";
import { PLANS } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get("plan") ?? "essential";
  const dest =
    planId in PLANS && planId !== "free"
      ? `/app/checkout?plan=${planId}`
      : "/app/planos";
  return NextResponse.redirect(new URL(dest, request.url));
}
