export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { GiftCard } from "@/components/wedding/wedding-site";
import { coupleDisplayName } from "@/lib/utils";
import { loadPublishedSite } from "@/lib/load-site";
import Link from "next/link";

export default async function GiftsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadPublishedSite(slug);
  if (!data) notFound();

  const supabase = createServiceClient();
  const { data: gifts } = await supabase
    .from("gifts")
    .select("*")
    .eq("tenant_id", data.tenant.id)
    .neq("status", "hidden")
    .order("sort_order");

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href={`/s/${slug}`} className="text-sm text-wine/60 hover:text-wine">
          ← Voltar ao site
        </Link>
        <h1 className="mt-4 font-serif text-4xl font-bold text-wine">Lista de presentes</h1>
        <p className="mt-2 text-wine/70">
          {data.content.registryMessage ??
            `Presenteie ${coupleDisplayName(data.tenant.partner1_name, data.tenant.partner2_name)}`}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gifts?.map((gift) => (
            <GiftCard
              key={gift.id}
              title={gift.title}
              description={gift.description}
              priceCents={gift.price_cents}
              fundedCents={gift.funded_cents}
              themeColor={data.themeColor}
              href={`/s/${slug}/presentes/${gift.id}`}
              photoUrl={gift.photo_url}
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
