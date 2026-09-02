"use client";

import { useState } from "react";
import { googleCalendarUrl, whatsappShareUrl } from "@/lib/assets";

export function ShareBar({
  names,
  date,
  url,
  location,
}: {
  names: string;
  date: string;
  url: string;
  location?: string;
}) {
  const [copied, setCopied] = useState(false);
  const text = `${names} — ${date}. Confirme presença: ${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 text-sm">
      <a
        href={whatsappShareUrl(text)}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-[#25D366] px-4 py-2 font-semibold text-white"
      >
        WhatsApp
      </a>
      <a
        href={googleCalendarUrl({
          title: `Casamento ${names}`,
          date,
          location,
          details: url,
        })}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-white/50 px-4 py-2 font-semibold"
      >
        Agenda
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-white/50 px-4 py-2 font-semibold"
      >
        {copied ? "Link copiado" : "Copiar link"}
      </button>
    </div>
  );
}
