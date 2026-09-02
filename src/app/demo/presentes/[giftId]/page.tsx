import { GiftCheckout } from "@/components/wedding/gift-checkout";
import { demoGifts } from "@/lib/demo-data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return demoGifts.map((g) => ({ giftId: g.id }));
}

export default async function DemoGiftPayPage({
  params,
}: {
  params: Promise<{ giftId: string }>;
}) {
  const { giftId } = await params;
  const gift = demoGifts.find((g) => g.id === giftId);
  if (!gift) notFound();

  return (
    <GiftCheckout
      mode="demo"
      title={gift.title}
      priceCents={gift.price_cents - gift.funded_cents}
      feePercent={2.49}
      photoUrl={gift.photo_url}
      backHref="/demo/presentes"
      thanksHref="/demo/obrigado"
      slug="maria-e-joao"
      giftId={gift.id}
    />
  );
}
