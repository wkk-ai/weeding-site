import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { coupleDisplayName, formatDate, formatCurrency } from "@/lib/utils";
import { getTemplate } from "@/lib/utils";
import Link from "next/link";

interface WeddingSiteProps {
  tenant: Tenant;
  templateId: TemplateId;
  themeColor: string;
  content: SiteContent;
  showBranding?: boolean;
}

export function WeddingSiteView({
  tenant,
  templateId,
  themeColor,
  content,
  showBranding = true,
}: WeddingSiteProps) {
  const template = getTemplate(templateId);
  const names = coupleDisplayName(tenant.partner1_name, tenant.partner2_name);

  return (
    <div className={`min-h-screen bg-white ${template.fontClass}`}>
      <header
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center text-white"
        style={{ backgroundColor: themeColor }}
      >
        <p className="text-sm uppercase tracking-[0.3em] opacity-80">Save the Date</p>
        <h1 className="mt-4 font-serif text-5xl font-bold md:text-7xl">{names}</h1>
        <p className="mt-4 text-xl opacity-90">{formatDate(tenant.wedding_date)}</p>
        {content.heroSubtitle && (
          <p className="mt-6 max-w-lg text-lg opacity-80">{content.heroSubtitle}</p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={`/s/${tenant.slug}/rsvp`}
            className="rounded-full bg-white px-8 py-3 font-semibold shadow-lg"
            style={{ color: themeColor }}
          >
            Confirmar presença
          </Link>
          <Link
            href={`/s/${tenant.slug}/presentes`}
            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10"
          >
            Lista de presentes
          </Link>
        </div>
      </header>

      {content.story && (
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h2 className="font-serif text-3xl font-bold" style={{ color: themeColor }}>
            Nossa história
          </h2>
          <p className="mt-6 leading-relaxed text-wine/80 whitespace-pre-line">{content.story}</p>
        </section>
      )}

      {content.gallery.length > 0 && (
        <section className="bg-cream px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif text-3xl font-bold" style={{ color: themeColor }}>
              Galeria
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.gallery.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption ?? "Foto do casal"}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl font-bold" style={{ color: themeColor }}>
          Detalhes do evento
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[content.ceremony, content.reception].filter(Boolean).map((event) => (
            <div
              key={event!.title}
              className="rounded-2xl border border-wine/10 p-6 text-center"
            >
              <h3 className="font-serif text-xl font-bold" style={{ color: themeColor }}>
                {event!.title}
              </h3>
              <p className="mt-2 text-wine/80">{event!.time}</p>
              <p className="mt-1 font-semibold text-wine">{event!.venue}</p>
              <p className="mt-1 text-sm text-wine/60">{event!.address}</p>
              {event!.mapsUrl && (
                <a
                  href={event!.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium underline"
                  style={{ color: themeColor }}
                >
                  Ver no mapa
                </a>
              )}
            </div>
          ))}
        </div>
        {content.dressCode && (
          <p className="mt-8 text-center text-wine/70">
            <strong>Traje:</strong> {content.dressCode}
          </p>
        )}
        {content.travel && (
          <div className="mt-8 rounded-2xl bg-cream p-6">
            <h3 className="font-semibold text-wine">Hospedagem e viagem</h3>
            <p className="mt-2 text-sm text-wine/70 whitespace-pre-line">{content.travel}</p>
          </div>
        )}
      </section>

      <footer className="border-t border-wine/10 bg-cream px-4 py-8 text-center">
        {showBranding && (
          <p className="text-sm text-wine/50">
            Site criado com{" "}
            <Link href="/" className="font-semibold text-wine hover:underline">
              NossoCasamento
            </Link>
          </p>
        )}
      </footer>
    </div>
  );
}

export function GiftCard({
  title,
  description,
  priceCents,
  fundedCents,
  themeColor,
  slug,
  giftId,
}: {
  title: string;
  description: string | null;
  priceCents: number;
  fundedCents: number;
  themeColor: string;
  slug: string;
  giftId: string;
}) {
  const progress = Math.min(100, (fundedCents / priceCents) * 100);
  const funded = fundedCents >= priceCents;

  return (
    <div className="rounded-2xl border border-wine/10 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-xl font-bold text-wine">{title}</h3>
      {description && <p className="mt-2 text-sm text-wine/70">{description}</p>}
      <p className="mt-4 font-serif text-2xl font-bold" style={{ color: themeColor }}>
        {formatCurrency(priceCents)}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, backgroundColor: themeColor }}
        />
      </div>
      {funded ? (
        <p className="mt-3 text-sm font-semibold text-sage">Presente completo! 🎉</p>
      ) : (
        <Link
          href={`/s/${slug}/presentes/${giftId}`}
          className="mt-4 block rounded-full py-3 text-center text-sm font-semibold text-white"
          style={{ backgroundColor: themeColor }}
        >
          Presentear
        </Link>
      )}
    </div>
  );
}
