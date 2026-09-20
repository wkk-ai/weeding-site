import Link from "next/link";
import { asset } from "@/lib/assets";
import { THEMES, demoPath } from "@/lib/wedding-theme";

export default function DemoModelosPage() {
  return (
    <main className="min-h-dvh bg-cream px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-wine/50">Exemplos</p>
        <h1 className="mt-3 text-center font-serif text-4xl italic text-wine sm:text-5xl">
          Doze jeitos de sentir o dia
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-wine/70">
          Abra cada um no celular e no computador. RSVP e presentes são os mesmos.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {THEMES.map((t) => (
            <Link key={t.id} href={demoPath(t.id)} className="group overflow-hidden rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(t.preview)}
                alt={t.name}
                className="aspect-[4/5] w-full object-cover transition group-hover:scale-105"
              />
              <span className="block p-3">
                <span className="font-serif text-lg italic text-wine sm:text-xl">{t.name}</span>
                <span className="mt-1 block text-xs text-wine/60">{t.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
