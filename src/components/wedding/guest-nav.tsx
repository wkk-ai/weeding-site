"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { SiteContent } from "@/lib/types";
import type { ThemeSpec } from "@/lib/wedding-theme";

type GuestAction = "home" | "rsvp" | "gifts" | "story" | "day" | "photos" | "padrinhos";

export function GuestNav({
  content,
  over,
  theme,
  brand,
  rsvpHref,
  giftsHref,
  previewMode,
  onAction,
}: {
  content: SiteContent;
  over: boolean;
  theme: ThemeSpec;
  brand?: string;
  rsvpHref: string;
  giftsHref: string;
  previewMode?: boolean;
  onAction: (action: GuestAction) => void;
}) {
  const [open, setOpen] = useState(false);

  const items: { id: GuestAction; label: string; show: boolean; href?: string }[] = [
    { id: "home", label: "Início", show: true },
    { id: "day", label: "O casamento", show: true },
    { id: "photos", label: "Fotos", show: (content.gallery?.length ?? 0) > 0 },
    { id: "padrinhos", label: "Padrinhos", show: (content.padrinhos?.length ?? 0) > 0 },
    { id: "story", label: "Nossa história", show: Boolean(content.story) },
    { id: "gifts", label: "Presentes", show: true, href: giftsHref },
  ];

  const visible = items.filter((i) => i.show);

  function handle(item: (typeof items)[number]) {
    setOpen(false);
    if (item.href && !previewMode) return;
    onAction(item.id);
  }

  const linkClass =
    "whitespace-nowrap min-h-11 inline-flex items-center opacity-80 hover:opacity-100";

  const renderItem = (item: (typeof items)[number], className = linkClass) =>
    item.href ? (
      <Link
        key={item.id}
        href={item.href}
        className={className}
        onClick={(e) => {
          if (!previewMode) {
            setOpen(false);
            return;
          }
          e.preventDefault();
          handle(item);
        }}
      >
        {item.label}
      </Link>
    ) : (
      <button key={item.id} type="button" onClick={() => handle(item)} className={className}>
        {item.label}
      </button>
    );

  return (
    <nav
      className={`motion-nav-solid sticky top-0 z-40 border-b backdrop-blur-md ${theme.navBar}`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3">
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="guest-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto text-[11px] font-medium uppercase tracking-[0.16em] md:flex lg:gap-5">
          {visible.map((item) => renderItem(item))}
        </div>

        <p className="min-w-0 flex-1 truncate px-1 text-center font-serif text-sm italic md:hidden">
          {brand}
        </p>

        {!over ? (
          <Link
            href={rsvpHref}
            className={`shrink-0 ${theme.navConfirm}`}
            onClick={(e) => {
              if (!previewMode) return;
              e.preventDefault();
              setOpen(false);
              onAction("rsvp");
            }}
          >
            Confirmar presença
          </Link>
        ) : (
          <span className="min-w-11 shrink-0" />
        )}
      </div>

      {open && (
        <div
          id="guest-menu"
          className="flex flex-col gap-1 border-t px-4 py-3 text-[12px] font-medium uppercase tracking-[0.16em] md:hidden"
          style={{ borderColor: "var(--wed-frame)" }}
        >
          {visible.map((item) =>
            renderItem(item, "min-h-11 w-full text-left opacity-90 hover:opacity-100"),
          )}
        </div>
      )}
    </nav>
  );
}
