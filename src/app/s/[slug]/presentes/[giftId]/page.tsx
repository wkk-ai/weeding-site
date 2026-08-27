"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { CARD_SURCHARGE_PERCENT } from "@/lib/constants";

export default function GiftCheckoutPage() {
  const { slug, giftId } = useParams<{ slug: string; giftId: string }>();
  const [gift, setGift] = useState<{
    title: string;
    price_cents: number;
    fee_percent: number;
  } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/gifts/${giftId}?slug=${slug}`)
      .then((r) => r.json())
      .then(setGift);
  }, [giftId, slug]);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, giftId, name, email, method }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erro ao processar pagamento");
      setLoading(false);
      return;
    }

    if (data.pixCopiaECola) {
      setPixCode(data.pixCopiaECola);
    } else if (data.invoiceUrl) {
      window.location.href = data.invoiceUrl;
    }
    setLoading(false);
  }

  if (!gift) return <p className="p-8 text-center">Carregando...</p>;

  const surcharge =
    method === "card" ? Math.round(gift.price_cents * (CARD_SURCHARGE_PERCENT / 100)) : 0;
  const total = gift.price_cents + surcharge;
  const fee = Math.round(gift.price_cents * (gift.fee_percent / 100));

  if (pixCode) {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="font-serif text-2xl font-bold text-wine">Pague com PIX</h1>
        <p className="mt-2 text-sm text-wine/70">Copie o código abaixo no app do seu banco:</p>
        <textarea
          readOnly
          value={pixCode}
          className="mt-4 w-full rounded-lg border border-wine/20 p-4 text-xs"
          rows={4}
        />
        <button
          onClick={() => navigator.clipboard.writeText(pixCode)}
          className="mt-4 w-full rounded-full bg-wine py-3 font-semibold text-white"
        >
          Copiar código PIX
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="font-serif text-2xl font-bold text-wine">{gift.title}</h1>
      <p className="mt-2 text-3xl font-bold text-wine-light">{formatCurrency(total)}</p>
      <p className="mt-1 text-xs text-wine/50">
        Taxa de serviço {gift.fee_percent}% ({formatCurrency(fee)})
        {surcharge > 0 && ` + taxa cartão ${formatCurrency(surcharge)}`}
      </p>

      <form onSubmit={pay} className="mt-8 space-y-4">
        <input
          required
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-wine/20 px-4 py-3"
        />
        <input
          type="email"
          placeholder="E-mail (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-wine/20 px-4 py-3"
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={method === "pix"}
              onChange={() => setMethod("pix")}
            />
            PIX (recomendado)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={method === "card"}
              onChange={() => setMethod("card")}
            />
            Cartão (+{CARD_SURCHARGE_PERCENT}%)
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-wine py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Processando..." : "Pagar presente"}
        </button>
      </form>
    </div>
  );
}
