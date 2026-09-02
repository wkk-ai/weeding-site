"use client";

import { useState } from "react";
import { ARCHIVE_PRICE, ARCHIVE_PRICE_CENTS } from "@/lib/constants";
import { PixQr } from "@/components/wedding/pix-qr";
import { DEMO_PIX_CODE } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";

export default function ArquivoPage() {
  const [showPix, setShowPix] = useState(false);
  const [done, setDone] = useState(false);

  async function download() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: tenant } = await supabase.from("tenants").select("*").eq("user_id", user.id).single();
    const { data: site } = await supabase.from("sites").select("*").eq("tenant_id", tenant?.id).single();
    const { data: guests } = await supabase.from("guests").select("*").eq("tenant_id", tenant?.id);
    const blob = new Blob(
      [JSON.stringify({ tenant, site, guests, exportedAt: new Date().toISOString() }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arquivo-casamento.json";
    a.click();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-wine">Arquivo permanente</h1>
      <p className="mt-2 text-wine/70">
        Baixe uma cópia de tudo (textos, lista, RSVPs). O arquivo eterno no ar custa R$
        {ARCHIVE_PRICE.toFixed(2).replace(".", ",")}.
      </p>
      <button
        onClick={download}
        className="mt-6 rounded-full border border-wine/20 px-5 py-2 font-semibold text-wine"
      >
        Baixar cópia agora (grátis)
      </button>
      {done ? (
        <p className="mt-8 text-sage">Arquivo vitalício marcado neste site-demo.</p>
      ) : showPix ? (
        <div className="mt-8">
          <p className="text-sm text-wine/70">PIX demo — R$ {(ARCHIVE_PRICE_CENTS / 100).toFixed(2)}</p>
          <PixQr code={DEMO_PIX_CODE} />
          <button
            className="mt-4 text-sm underline text-wine"
            onClick={() => setDone(true)}
          >
            Já paguei
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowPix(true)}
          className="mt-4 ml-3 rounded-full bg-wine px-5 py-2 font-semibold text-white"
        >
          Manter o site no ar para sempre
        </button>
      )}
    </div>
  );
}
