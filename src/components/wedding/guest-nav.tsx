"use client";

import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import type { WeddingSkin } from "@/lib/wedding-theme";

type GuestAction = "home" | "rsvp" | "gifts" | "story" | "day" | "photos" | "padrinhos";

export function GuestNav({
  content,
  over,
  skin,
  rsvpHref,
  giftsHref,
  previewMode,
  onAction,
}: {
  content: SiteContent;
  over: boolean;
  skin: WeddingSkin;
  rsvpHref: string;
  giftsHref: string;
  previewMode?: boolean;
  onAction: (action: GuestAction) => void;
}) {
  const items: { id: GuestAction; label: string; show: boolean; href?: string }[] = [
    { id: "home", label: "Início", show: true },
    { id: "day", label: "O casamento", show: true },
    { id: "photos", label: "Fotos", show: (content.gallery?.length ?? 0) > 0 },
    { id: "padrinhos", label: "Padrinhos", show: (content.padrinhos?.length ?? 0) > 0 },
    { id: "story", label: "Nossa história", show: Boolean(content.story) },
    { id: "gifts", label: "Presentes", show: true, href: giftsHref },
  ];

  const bar =
    skin === "noite"
      ? "bg-[#0c0a09]/95 text-[#eadcc6] border-[#c9a962]/20"
      : skin === "costa"
        ? "bg-[#2a1c18]/95 text-white border-white/10"
        : "bg-[#fffdf8]/95 text-[#3b2f28] border-[#d7c4aa]";

  const confirm =
    skin === "papel"
      ? "border border-[#7a3e48] px-3 py-1 text-[11px] tracking-[0.18em] uppercase"
      : skin === "noite"
        ? "border border-[#c9a962] px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-[#c9a962]"
        : "rounded-full bg-[#c4a574] px-3 py-1 text-[11px] tracking-[0.16em] uppercase text-[#2a1c18]";

  return (
    <nav className={`motion-nav-solid sticky top-0 z-40 border-b backdrop-blur-md ${bar}`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 overflow-x-auto px-4 py-3">
        <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.16em]">
          {items
            .filter((i) => i.show)
            .map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className="whitespace-nowrap opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    if (!previewMode) return;
                    e.preventDefault();
                    onAction(item.id);
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAction(item.id)}
                  className="whitespace-nowrap opacity-80 hover:opacity-100"
                >
                  {item.label}
                </button>
              ),
            )}
        </div>
        {!over && (
          <Link
            href={rsvpHref}
            className={`shrink-0 ${confirm}`}
            onClick={(e) => {
              if (!previewMode) return;
              e.preventDefault();
              onAction("rsvp");
            }}
          >
            Confirmar presença
          </Link>
        )}
      </div>
    </nav>
  );
}
