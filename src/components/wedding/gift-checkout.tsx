"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { CARD_SURCHARGE_PERCENT } from "@/lib/constants";
import { PixQr } from "./pix-qr";
import { DEMO_PIX_CODE } from "@/lib/demo-data";

export function GiftCheckout({
  title,
  priceCents,
  feePercent,
  photoUrl,
  backHref,
  thanksHref,
  slug,
  giftId,
  mode = "live",
}: {
  title: string;
  priceCents: number;
  feePercent: number;
  photoUrl?: string | null;
  backHref: string;
  thanksHref: string;
  slug: string;
  giftId: string;
  mode?: "live" | "demo";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  const surcharge =
    method === "card" ? Math.round(priceCents * (CARD_SURCHARGE_PERCENT / 100)) : 0;
  const total = priceCents + surcharge;
  const fee = Math.round(priceCents * (feePercent / 100));

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "demo") {
      const gifts = JSON.parse(localStorage.getItem("nc-demo-gifts") ?? "{}");
      gifts[giftId] = { name, message, amount: total, at: new Date().toISOString() };
      localStorage.setItem("nc-demo-gifts", JSON.stringify(gifts));
      if (method === "pix") {
        setPixCode(DEMO_PIX_CODE);
      } else {
        setPaid(true);
      }
      setLoading(false);
      return;
    }

    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, giftId, name, email, method, message }),
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
    } else {
      setPaid(true);
    }
    setLoading(false);
  }

  if (paid) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-serif text-2xl font-bold text-wine">Presente enviado</h1>
        <p className="mt-3 text-wine/70">O casal vai receber um recado com o seu nome.</p>
        <Link href={thanksHref} className="mt-6 inline-block font-semibold text-wine underline">
          Ver recado de obrigado
        </Link>
      </div>
    );
  }

  if (pixCode) {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="font-serif text-2xl font-bold text-wine">Pague com PIX</h1>
        <p className="mt-1 text-sm text-wine/70">{title} · {formatCurrency(total)}</p>
        <div className="mt-6">
          <PixQr code={pixCode} />
        </div>
        {mode === "demo" && (
          <Link
            href={thanksHref}
            className="mt-6 block text-center text-sm font-semibold text-wine underline"
          >
            Já paguei — ver obrigado
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-8">
      <Link href={backHref} className="text-sm text-wine/60">
        ← Voltar à lista
      </Link>
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" className="mt-4 h-40 w-full rounded-2xl object-cover" />
      )}
      <h1 className="mt-4 font-serif text-2xl font-bold text-wine">{title}</h1>
      <p className="mt-2 text-3xl font-bold text-wine-light">{formatCurrency(total)}</p>
      <p className="mt-1 text-xs text-wine/50">
        Taxa de serviço {feePercent}% ({formatCurrency(fee)})
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
        <textarea
          placeholder="Mensagem para o casal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-wine/20 px-4 py-3"
          rows={3}
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
