"use client";

import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { PLANS, CONTACT_WHATSAPP, INSTAGRAM_URL } from "@/lib/constants";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-wine/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-wine">
          <Heart className="h-5 w-5 fill-wine-light text-wine-light" />
          NossoCasamento
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-wine/80 md:flex">
          <Link href="#como-funciona" className="hover:text-wine">Como funciona</Link>
          <Link href="/demo" className="hover:text-wine">Ver um casamento</Link>
          <Link href="#precos" className="hover:text-wine">Preços</Link>
          <a href={INSTAGRAM_URL} className="hover:text-wine" target="_blank" rel="noreferrer">Instagram</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-wine/80 hover:text-wine sm:block">
            Entrar
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-wine px-5 py-2 text-sm font-semibold text-white hover:bg-wine-light"
          >
            Criar site grátis
          </Link>
          <button
            className="md:hidden text-wine"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="space-y-3 border-t border-wine/10 px-4 py-4 md:hidden">
          <Link href="#como-funciona" className="block text-wine" onClick={() => setOpen(false)}>Como funciona</Link>
          <Link href="/demo" className="block text-wine" onClick={() => setOpen(false)}>Ver um casamento</Link>
          <Link href="#precos" className="block text-wine" onClick={() => setOpen(false)}>Preços</Link>
          <Link href="/contato" className="block text-wine" onClick={() => setOpen(false)}>WhatsApp</Link>
          <Link href="/login" className="block text-wine" onClick={() => setOpen(false)}>Entrar</Link>
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}`}
            className="block font-semibold text-wine"
          >
            Falar com a gente
          </a>
        </nav>
      )}
    </header>
  );
}

export function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.values(PLANS).map((plan) => (
        <div
          key={plan.id}
          className={`rounded-2xl border bg-white p-6 shadow-sm ${
            plan.id === "essential" ? "border-wine ring-2 ring-wine/20" : "border-wine/10"
          }`}
        >
          {plan.id === "essential" && (
            <span className="mb-3 inline-block rounded-full bg-rose/30 px-3 py-1 text-xs font-semibold text-wine">
              Mais popular
            </span>
          )}
          <h3 className="font-serif text-2xl font-bold text-wine">{plan.name}</h3>
          <p className="mt-2 font-serif text-4xl font-bold text-wine-light">
            {plan.price === 0 ? "R$0" : `R$${plan.price}`}
            {plan.price > 0 && (
              <span className="text-base font-normal text-wine/60"> único</span>
            )}
          </p>
          <p className="mt-1 text-sm text-wine/60">Taxa lista: {plan.giftFeePercent}%</p>
          <ul className="mt-6 space-y-2 text-sm text-wine/80">
            <li>✓ Até {plan.maxGuests} convidados RSVP</li>
            <li>✓ Até {plan.maxPhotos} fotos</li>
            <li>✓ {plan.hostingMonths} meses de hospedagem</li>
            {plan.branding ? (
              <li>○ Com marca NossoCasamento</li>
            ) : (
              <li>✓ Sem marca da plataforma</li>
            )}
            {plan.passwordProtection && <li>✓ Site com senha</li>}
            {plan.customDomain && <li>✓ Domínio .com.br</li>}
          </ul>
          <Link
            href="/signup"
            className="mt-6 block rounded-full bg-wine py-3 text-center text-sm font-semibold text-white"
          >
            Começar
          </Link>
        </div>
      ))}
    </div>
  );
}
