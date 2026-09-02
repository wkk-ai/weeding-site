import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, INSTAGRAM_URL } from "@/lib/constants";

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Link href="/" className="text-sm text-wine/60">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-bold text-wine">Fale com a gente</h1>
      <p className="mt-3 text-wine/70">
        Dúvida de PIX, do site, de um convite que não abre. Respondemos em horário comercial.
      </p>
      <div className="mt-8 space-y-3">
        <a
          href={`https://wa.me/${CONTACT_WHATSAPP}`}
          className="block rounded-full bg-[#25D366] py-3 font-semibold text-white"
        >
          WhatsApp
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="block rounded-full border border-wine/20 py-3 font-semibold text-wine"
        >
          {CONTACT_EMAIL}
        </a>
        <a href={INSTAGRAM_URL} className="block text-sm text-wine/70 underline">
          Instagram
        </a>
      </div>
    </div>
  );
}
