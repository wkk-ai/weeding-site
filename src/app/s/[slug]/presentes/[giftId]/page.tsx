"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GiftCheckout } from "@/components/wedding/gift-checkout";

export default function GiftCheckoutPage() {
  const { slug, giftId } = useParams<{ slug: string; giftId: string }>();
  const [gift, setGift] = useState<{
    title: string;
    price_cents: number;
    fee_percent: number;
    photo_url?: string | null;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/gifts/${giftId}?slug=${slug}`)
      .then((r) => r.json())
      .then(setGift);
  }, [giftId, slug]);

  if (!gift?.title) return <p className="p-8 text-center">Carregando...</p>;

  return (
    <GiftCheckout
      title={gift.title}
      priceCents={gift.price_cents}
      feePercent={gift.fee_percent}
      photoUrl={gift.photo_url}
      backHref={`/s/${slug}/presentes`}
      thanksHref={`/s/${slug}/obrigado`}
      slug={slug}
      giftId={giftId}
    />
  );
}
