"use client";

import { useState } from "react";
import { siteUrl, whatsappShareUrl } from "@/lib/assets";

export function SharePanel({ slug, names, published }: { slug: string; names: string; published: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = siteUrl(`/s/${slug}`);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

  if (!published) {
    return (
      <p className="text-sm text-wine/60">
        Publique o site para gerar o link de WhatsApp e o QR do convite.
      </p>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-wine">Convide pelo WhatsApp</h2>
      <p className="mt-2 break-all font-mono text-sm text-wine/70">{url}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} alt="QR do site" className="mx-auto mt-4 h-40 w-40" />
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={whatsappShareUrl(`Você está convidado(a) para o casamento de ${names}. Confirme aqui: ${url}`)}
          className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
        >
          Enviar no WhatsApp
        </a>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-full border border-wine/20 px-4 py-2 text-sm"
        >
          {copied ? "Copiado" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
