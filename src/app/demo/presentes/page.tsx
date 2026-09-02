import { GiftCard } from "@/components/wedding/wedding-site";
import { demoContent, demoGifts, demoTenant } from "@/lib/demo-data";
import { coupleDisplayName } from "@/lib/utils";
import Link from "next/link";

export default function DemoGiftsPage() {
  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/demo" className="text-sm text-wine/60 hover:text-wine">
          ← Voltar ao site
        </Link>
        <h1 className="mt-4 font-serif text-4xl font-bold text-wine">Lista de presentes</h1>
        <p className="mt-2 text-wine/70">
          {demoContent.registryMessage ??
            `Presenteie ${coupleDisplayName(demoTenant.partner1_name, demoTenant.partner2_name)}`}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {demoGifts.map((gift) => (
            <GiftCard
              key={gift.id}
              title={gift.title}
              description={gift.description}
              priceCents={gift.price_cents}
              fundedCents={gift.funded_cents}
              themeColor="#8b5a6b"
              href={`/demo/presentes/${gift.id}`}
              photoUrl={gift.photo_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
