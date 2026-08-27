import Link from "next/link";
import { SiteHeader, PricingCards } from "@/components/marketing/site-header";
import { Heart, Camera, Gift, Users, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-wine via-wine-light to-rose px-4 py-20 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/80">
              Site de casamento em 5 minutos
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Bonito, simples e com a menor taxa do mercado
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Escolha um template, envie suas fotos e publique. RSVP e lista de presentes
              com taxa a partir de <strong>1,99%</strong> — menor que Casar.com e Lejour.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-4 font-semibold text-wine shadow-lg hover:bg-cream"
              >
                Criar site grátis
              </Link>
              <Link
                href="/demo"
                className="rounded-full border border-white/60 px-8 py-4 font-semibold text-white hover:bg-white/10"
              >
                Ver demo
              </Link>
              <Link
                href="#precos"
                className="rounded-full border border-white/40 px-8 py-4 font-semibold text-white hover:bg-white/10"
              >
                Ver preços
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Sem cartão de crédito · Publique em minutos · PIX nos presentes
            </p>
          </div>
        </section>

        <section id="como-funciona" className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-serif text-3xl font-bold text-wine md:text-4xl">
              Como funciona
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-4">
              {[
                { icon: Heart, title: "Cadastre-se", desc: "Nome do casal e data do casamento" },
                { icon: Camera, title: "Escolha template", desc: "3 designs lindos, suas fotos" },
                { icon: Users, title: "Convide", desc: "RSVP online para seus convidados" },
                { icon: Gift, title: "Presentes", desc: "Lista com PIX e taxa baixa" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose/30">
                    <Icon className="h-6 w-6 text-wine" />
                  </div>
                  <h3 className="mt-4 font-semibold text-wine">{title}</h3>
                  <p className="mt-2 text-sm text-wine/70">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="comparativo" className="bg-white px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-serif text-3xl font-bold text-wine">
              Por que somos diferentes
            </h2>
            <div className="mt-10 overflow-hidden rounded-2xl border border-wine/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wine text-white">
                    <th className="p-4 text-left">Recurso</th>
                    <th className="p-4 text-center">NossoCasamento</th>
                    <th className="p-4 text-center">Casar.com</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wine/10">
                  {[
                    ["Site grátis", "✓", "✓"],
                    ["Taxa lista (pago)", "1,99%", "3,89%"],
                    ["Tempo para publicar", "5 min", "30+ min"],
                    ["Site expira após casamento", "Não*", "Sim (30 dias)"],
                    ["Preço fixo opcional", "R$49–99", "Não"],
                  ].map(([feature, us, them]) => (
                    <tr key={feature as string} className="bg-cream/50">
                      <td className="p-4 font-medium text-wine">{feature}</td>
                      <td className="p-4 text-center font-semibold text-sage">{us}</td>
                      <td className="p-4 text-center text-wine/60">{them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-xs text-wine/50">
              * Plano grátis: 6 meses. Planos pagos: 12 meses. Arquivo permanente R$39,90.
            </p>
          </div>
        </section>

        <section id="precos" className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-serif text-3xl font-bold text-wine">
              Preços transparentes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-wine/70">
              Pague uma vez pelo site ou use grátis. Taxa da lista menor que a concorrência.
            </p>
            <div className="mt-12">
              <PricingCards />
            </div>
          </div>
        </section>

        <section className="bg-wine px-4 py-16 text-white">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <Zap className="h-12 w-12 shrink-0 text-rose" />
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Economize até R$168 na lista de presentes
              </h2>
              <p className="mt-2 text-white/80">
                Em R$12.000 arrecadados, nossa taxa de 2,49% economiza R$168 vs Casar.com (3,89%).
              </p>
            </div>
            <Link
              href="/signup"
              className="shrink-0 rounded-full bg-white px-8 py-3 font-semibold text-wine"
            >
              Começar agora
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-wine/10 bg-cream-dark px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-wine">
            <Shield className="h-5 w-5" />
            NossoCasamento
          </div>
          <nav className="flex gap-6 text-sm text-wine/70">
            <Link href="/privacidade">Privacidade (LGPD)</Link>
            <Link href="/termos">Termos de uso</Link>
            <Link href="/login">Entrar</Link>
          </nav>
          <p className="text-xs text-wine/50">© {new Date().getFullYear()} NossoCasamento</p>
        </div>
      </footer>
    </>
  );
}
