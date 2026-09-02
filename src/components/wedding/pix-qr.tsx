"use client";

import { useState } from "react";

export function PixQr({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(code)}`;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qr}
        alt="QR Code PIX"
        className="mx-auto h-56 w-56 rounded-2xl bg-white p-3 shadow"
      />
      <p className="mt-4 text-sm text-wine/70">
        Abra o app do banco e aponte a câmera, ou copie o código.
      </p>
      <textarea
        readOnly
        value={code}
        className="mt-4 w-full rounded-lg border border-wine/20 p-3 text-xs"
        rows={3}
      />
      <button
        type="button"
        onClick={copy}
        className="mt-3 w-full rounded-full bg-wine py-3 font-semibold text-white"
      >
        {copied ? "Copiado" : "Copiar código PIX"}
      </button>
    </div>
  );
}
