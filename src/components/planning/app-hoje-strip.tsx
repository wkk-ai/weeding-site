"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadPlan, money, monthsUntil, nextAction } from "@/lib/planning";

export function AppHojeStrip({
  names,
  confirmed,
  guests,
  funded,
}: {
  names: string;
  city: string;
  confirmed: number;
  guests: number;
  funded: number;
}) {
  const [title, setTitle] = useState("Fechem o espaço");
  const [months, setMonths] = useState(11);
  const [teto, setTeto] = useState("");

  useEffect(() => {
    const p = loadPlan();
    setTitle(nextAction(p).title);
    setMonths(monthsUntil(p.date));
    setTeto(money(p.budget));
  }, []);

  return (
    <section className="rounded-3xl bg-wine px-6 py-8 text-white">
      <p className="text-xs uppercase tracking-[0.28em] text-[#c4a574]">Hoje · {names}</p>
      <h2 className="mt-3 font-serif text-4xl italic">{title}.</h2>
      <p className="mt-2 text-white/75">
        Faltam {months} meses. {confirmed} disseram sim de {guests}. PIX {money(funded / 100)}. Teto {teto}.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/planejar?porta=hoje" className="rounded-full bg-[#c4a574] px-6 py-3 font-semibold text-[#2a1c18]">
          Abrir o planejamento
        </Link>
        <Link href="/app/convidados" className="rounded-full border border-white/40 px-6 py-3 font-semibold">
          Ver a gente
        </Link>
      </div>
    </section>
  );
}
