import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/constants";
import { coupleDisplayName, formatCurrency } from "@/lib/utils";
import { checklistItems } from "@/lib/checklist";
import { PublishButton } from "@/components/app/publish-button";
import { SharePanel } from "@/components/app/share-panel";
import { ExternalLink } from "lucide-react";
import type { SiteContent } from "@/lib/types";

export default async function AppDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: site } = await supabase
    .from("sites")
    .select("content")
    .eq("tenant_id", tenant!.id)
    .single();

  const { count: guestCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenant!.id);

  const { count: confirmedCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenant!.id)
    .eq("rsvp_status", "confirmed");

  const { data: gifts } = await supabase
    .from("gifts")
    .select("funded_cents, price_cents")
    .eq("tenant_id", tenant!.id);

  const totalFunded = gifts?.reduce((s, g) => s + g.funded_cents, 0) ?? 0;
  const plan = PLANS[tenant!.plan as keyof typeof PLANS];
  const content = (site?.content ?? null) as SiteContent | null;
  const checks = checklistItems({
    content,
    giftCount: gifts?.length ?? 0,
    pixKey: tenant!.pix_key,
    partner1: tenant!.partner1_name,
    partner2: tenant!.partner2_name,
  });
  const ready = checks.every((c) => c.done);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-wine">
            {coupleDisplayName(tenant!.partner1_name, tenant!.partner2_name)}
          </h1>
          <p className="mt-1 text-wine/70">O site de vocês, num só lugar</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/preview"
            className="rounded-full border border-wine/20 px-5 py-2.5 text-sm font-semibold text-wine"
          >
            Prévia
          </Link>
          <PublishButton tenantId={tenant!.id} published={tenant!.published} />
          {tenant!.published && (
            <Link
              href={`/s/${tenant!.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-wine/20 px-5 py-2.5 text-sm font-semibold text-wine"
            >
              <ExternalLink className="h-4 w-4" />
              Ver site
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">RSVPs confirmados</p>
          <p className="mt-2 font-serif text-3xl font-bold text-wine">
            {confirmedCount ?? 0}
            <span className="text-lg font-normal text-wine/50"> / {guestCount ?? 0}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">Presentes recebidos</p>
          <p className="mt-2 font-serif text-3xl font-bold text-wine">
            {formatCurrency(totalFunded)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-wine/60">Taxa da lista</p>
          <p className="mt-2 font-serif text-3xl font-bold text-sage">{plan.giftFeePercent}%</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Antes de publicar</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {checks.map((c) => (
            <li key={c.id} className={c.done ? "text-sage" : "text-wine/70"}>
              {c.done ? "✓" : "○"} {c.label}
            </li>
          ))}
        </ul>
        {!ready && (
          <p className="mt-3 text-xs text-wine/50">
            Você ainda pode publicar, mas o site fica mais bonito com foto, local e PIX.
          </p>
        )}
      </div>

      <div className="mt-8">
        <SharePanel
          slug={tenant!.slug}
          names={coupleDisplayName(tenant!.partner1_name, tenant.partner2_name)}
          published={tenant!.published}
        />
      </div>
    </div>
  );
}
