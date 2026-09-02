import Link from "next/link";
import { SiteHeader, PricingCards } from "@/components/marketing/site-header";
import { asset } from "@/lib/assets";
import { CONTACT_WHATSAPP, CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/constants";

const moments = [
  { src: "/photos/altar.jpg", title: "O altar", text: "A luz da tarde, o sim." },
  { src: "/photos/noiva.jpg", title: "A noiva", text: "O retrato que abre o convite." },
  { src: "/photos/casal.jpg", title: "O casal", text: "Vocês, no centro da página." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative min-h-[92svh] overflow-hidden text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/photos/ensaio.jpg")}
            alt="Casal no ensaio"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-4xl flex-col items-center justify-end px-4 pb-20 text-center">
            <p className="text-xs uppercase tracking-[0.42em] text-[#c4a574]">
              O site do casamento, em 5 minutos
            </p>
            <h1 className="mt-4 font-serif text-5xl italic leading-tight md:text-7xl">
              Vocês no centro da página.
            </h1>
            <p className="mt-6 max-w-xl text-lg font-light text-white/90">
              Foto da noiva, foto do noivo, RSVP e PIX. Seus convidados abrem o link e já entendem o dia.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/demo"
                className="rounded-full bg-[#c4a574] px-8 py-4 font-semibold text-[#2a1c18]"
              >
                Abrir um casamento de verdade
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/70 px-8 py-4 font-semibold text-white"
              >
                Criar o nosso
              </Link>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3">
          {moments.map((m) => (
            <figure key={m.title} className="relative min-h-[50vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(m.src)} alt={m.title} className="h-full w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-8 text-white">
                <h2 className="font-serif text-3xl italic">{m.title}</h2>
                <p className="mt-1 text-sm text-white/80">{m.text}</p>
              </figcaption>
            </figure>
          ))}
        </section>

        <section id="como-funciona" className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif text-4xl italic text-wine">
              Três passos. O site já parece de vocês.
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { n: "01", t: "Foto e nomes", d: "A capa, a noiva, o noivo. O convite já respira." },
                { n: "02", t: "O dia", d: "Igreja, festa, padrinhos, o que vestir, o mapa." },
                { n: "03", t: "O link", d: "WhatsApp, RSVP e PIX. Seus convidados fazem o resto." },
              ].map((s) => (
                <div key={s.n} className="rounded-2xl bg-white p-8 shadow-sm">
                  <p className="text-xs tracking-[0.3em] text-wine/50">{s.n}</p>
                  <h3 className="mt-3 font-serif text-2xl text-wine">{s.t}</h3>
                  <p className="mt-2 text-wine/70">{s.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/demo/rsvp" className="font-semibold text-wine underline">
                Experimente confirmar presença na demo
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif text-4xl italic text-wine">Três jeitos de sentir</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { href: "/demo", name: "Clássico", img: "/photos/altar.jpg" },
                { href: "/demo/jardim", name: "Jardim", img: "/photos/jardim.jpg" },
                { href: "/demo/minimal", name: "Editorial", img: "/photos/beijo.jpg" },
              ].map((t) => (
                <Link key={t.name} href={t.href} className="group overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(t.img)} alt={t.name} className="h-64 w-full object-cover transition group-hover:scale-105" />
                  <p className="bg-cream p-4 font-serif text-xl text-wine">{t.name}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-semibold text-wine">
              <Link href="/demo/rsvp" className="underline">
                Confirmar presença
              </Link>
              <Link href="/demo/presentes" className="underline">
                PIX da lista
              </Link>
              <Link href="/demo/privado" className="underline">
                Site com senha
              </Link>
              <Link href="/demo/depois" className="underline">
                Depois da festa
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                q: "Abri o link e chorei. Era a gente, não um formulário.",
                who: "Ana e Bruno · São Paulo",
              },
              {
                q: "Os padrinhos confirmaram no celular na hora. Ninguém ligou perguntando o endereço.",
                who: "Luísa e Rafael · Curitiba",
              },
              {
                q: "O PIX abriu em QR. Minha tia pagou a lua de mel no almoço.",
                who: "Clara e Diego · Belo Horizonte",
              },
            ].map((t) => (
              <div key={t.who} className="rounded-3xl bg-wine px-8 py-10 text-white">
                <p className="font-serif text-xl italic">“{t.q}”</p>
                <p className="mt-4 text-sm text-white/70">{t.who}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="precos" className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-serif text-3xl font-bold text-wine">
              Preço limpo. Taxa menor que a concorrência.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-wine/70">
              Pague uma vez pelo site — ou comece grátis. A lista de presentes via PIX.
            </p>
            <div className="mt-12">
              <PricingCards />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-wine/10 bg-cream-dark px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <p className="font-serif text-lg font-bold text-wine">NossoCasamento</p>
          <nav className="flex flex-wrap justify-center gap-5 text-sm text-wine/70">
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos</Link>
            <Link href="/contato">Fale conosco</Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
            <a href={`https://wa.me/${CONTACT_WHATSAPP}`}>WhatsApp</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>E-mail</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
