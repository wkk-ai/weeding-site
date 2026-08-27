export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { GiftCard } from "@/components/wedding/wedding-site";
import { coupleDisplayName } from "@/lib/utils";
import Link from "next/link";

export default async function GiftsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!tenant) notFound();

  const { data: site } = await supabase
    .from("sites")
    .select("theme_color, content")
    .eq("tenant_id", tenant.id)
    .single();

  const { data: gifts } = await supabase
    .from("gifts")
    .select("*")
    .eq("tenant_id", tenant.id)
    .neq("status", "hidden")
    .order("sort_order");

  const themeColor = site?.theme_color ?? "#8b5a6b";
  const content = site?.content as { registryMessage?: string } | null;

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href={`/s/${slug}`} className="text-sm text-wine/60 hover:text-wine">
          ← Voltar ao site
        </Link>
        <h1 className="mt-4 font-serif text-4xl font-bold text-wine">
          Lista de presentes
        </h1>
        <p className="mt-2 text-wine/70">
          {content?.registryMessage ??
            `Presenteie ${coupleDisplayName(tenant.partner1_name, tenant.partner2_name)}`}
        </p>
        <p className="mt-2 text-sm text-wine/50">
          Pagamento via PIX (recomendado) ou cartão
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gifts?.map((gift) => (
            <GiftCard
              key={gift.id}
              title={gift.title}
              description={gift.description}
              priceCents={gift.price_cents}
              fundedCents={gift.funded_cents}
              themeColor={themeColor}
              slug={slug}
              giftId={gift.id}
            />
          ))}
          {(!gifts || gifts.length === 0) && (
            <p className="col-span-full text-center text-wine/60">
              Lista de presentes em breve.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
