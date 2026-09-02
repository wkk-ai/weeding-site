import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { coupleDisplayName, formatDate, formatCurrency } from "@/lib/utils";
import { getTemplate } from "@/lib/utils";
import { isWeddingOver, siteBaseFor } from "@/lib/checklist";
import { siteUrl } from "@/lib/assets";
import Link from "next/link";
import { Countdown } from "./countdown";
import { ShareBar } from "./share-bar";

interface WeddingSiteProps {
  tenant: Tenant;
  templateId: TemplateId;
  themeColor: string;
  content: SiteContent;
  showBranding?: boolean;
  siteBase?: string;
}

export function WeddingSiteView({
  tenant,
  templateId,
  themeColor,
  content,
  showBranding = true,
  siteBase,
}: WeddingSiteProps) {
  const template = getTemplate(templateId);
  const names = coupleDisplayName(tenant.partner1_name, tenant.partner2_name);
  const base = siteBaseFor(tenant.slug, siteBase);
  const cover = content.coverPhotoUrl;
  const over = isWeddingOver(tenant.wedding_date);
  const padrinhos = content.padrinhos ?? [];
  const timeline = content.timeline ?? [];
  const gallery = content.gallery ?? [];
  const publicLink = siteUrl(base);

  const isGarden = templateId === "garden";
  const isMinimal = templateId === "minimal";

  return (
    <div className={`min-h-screen bg-white ${template.fontClass}`}>
      <header
        className={`relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden px-4 pb-16 text-center text-white ${
          isMinimal ? "justify-center pb-0" : ""
        }`}
      >
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={names}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: themeColor }} />
        )}
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.42em] opacity-90">
            {over ? "Obrigado" : "Save the Date"}
          </p>
          <h1
            className={`mt-4 font-serif font-bold leading-tight ${
              isMinimal ? "text-6xl md:text-8xl" : "text-5xl md:text-7xl italic"
            }`}
          >
            {names}
          </h1>
          <p className="mt-4 text-xl opacity-90">{formatDate(tenant.wedding_date)}</p>
          {content.heroSubtitle && (
            <p className="mx-auto mt-6 max-w-lg text-lg font-light opacity-90">
              {content.heroSubtitle}
            </p>
          )}
          <div className="mt-8">
            <Countdown date={tenant.wedding_date} />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={`${base}/rsvp`}
              className="rounded-full bg-white px-8 py-3 font-semibold shadow-lg"
              style={{ color: themeColor }}
            >
              Confirmar presença
            </Link>
            <Link
              href={`${base}/presentes`}
              className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10"
            >
              Lista de presentes
            </Link>
          </div>
          <div className="mt-8">
            <ShareBar
              names={names}
              date={tenant.wedding_date}
              url={publicLink}
              location={content.ceremony?.venue}
            />
          </div>
        </div>
      </header>

      {over && content.thankYouMessage && (
        <section className="bg-cream px-4 py-16 text-center">
          <h2 className="font-serif text-3xl font-bold" style={{ color: themeColor }}>
            Obrigado
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-wine/80 whitespace-pre-line">
            {content.thankYouMessage}
          </p>
          <Link href={`${base}/obrigado`} className="mt-6 inline-block font-semibold underline" style={{ color: themeColor }}>
            Recado aos convidados
          </Link>
        </section>
      )}

      {(content.bridePhotoUrl || content.groomPhotoUrl) && (
        <section className={`px-4 py-16 ${isGarden ? "bg-cream" : "bg-white"}`}>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {content.bridePhotoUrl && (
              <figure className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.bridePhotoUrl}
                  alt={tenant.partner1_name}
                  className={`mx-auto h-80 w-full object-cover shadow-lg ${
                    isGarden ? "rounded-full max-w-sm h-80" : "rounded-3xl"
                  }`}
                />
                <figcaption className="mt-4 font-serif text-2xl" style={{ color: themeColor }}>
                  {tenant.partner1_name}
                </figcaption>
                <p className="text-sm text-wine/60">Noiva</p>
              </figure>
            )}
            {content.groomPhotoUrl && (
              <figure className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.groomPhotoUrl}
                  alt={tenant.partner2_name}
                  className={`mx-auto h-80 w-full object-cover shadow-lg ${
                    isGarden ? "rounded-full max-w-sm h-80" : "rounded-3xl"
                  }`}
                />
                <figcaption className="mt-4 font-serif text-2xl" style={{ color: themeColor }}>
                  {tenant.partner2_name}
                </figcaption>
                <p className="text-sm text-wine/60">Noivo</p>
              </figure>
            )}
          </div>
        </section>
      )}

      {content.story && (
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h2 className="font-serif text-3xl font-bold" style={{ color: themeColor }}>
            Nossa história
          </h2>
          <p className="mt-6 leading-relaxed text-wine/80 whitespace-pre-line">{content.story}</p>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="bg-cream px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif text-3xl font-bold" style={{ color: themeColor }}>
              Galeria
            </h2>
            <div className={`mt-8 grid gap-4 ${isMinimal ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {gallery.map((photo) => (
                <figure key={photo.id} className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption ?? "Foto do casal"}
                    className="aspect-square w-full object-cover"
                  />
                  {photo.caption && (
                    <figcaption className="bg-white px-3 py-2 text-sm text-wine/70">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="mx-auto max-w-2xl px-4 py-16">
          <h2 className="text-center font-serif text-3xl font-bold" style={{ color: themeColor }}>
            O dia
          </h2>
          <ol className="mt-10 space-y-6">
            {timeline.map((item) => (
              <li key={item.id} className="flex gap-4">
                <span className="w-16 shrink-0 font-semibold" style={{ color: themeColor }}>
                  {item.time}
                </span>
                <div>
                  <p className="font-semibold text-wine">{item.title}</p>
                  <p className="text-sm text-wine/70">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
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
              <p className="mt-2 text-wine/80">
                {event!.time}
                {event!.date ? ` · ${formatDate(event!.date)}` : ""}
              </p>
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
        {content.musicNote && (
          <p className="mt-4 text-center text-sm italic text-wine/60">{content.musicNote}</p>
        )}
        {content.travel && (
          <div className="mt-8 rounded-2xl bg-cream p-6">
            <h3 className="font-semibold text-wine">Hospedagem e viagem</h3>
            <p className="mt-2 text-sm text-wine/70 whitespace-pre-line">{content.travel}</p>
          </div>
        )}
      </section>

      {padrinhos.length > 0 && (
        <section className="bg-cream px-4 py-16">
          <h2 className="text-center font-serif text-3xl font-bold" style={{ color: themeColor }}>
            Padrinhos
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
            {padrinhos.map((p) => (
              <figure key={p.id} className="text-center">
                {p.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="mx-auto h-32 w-32 rounded-full object-cover"
                  />
                )}
                <figcaption className="mt-3 font-semibold text-wine">{p.name}</figcaption>
                <p className="text-sm text-wine/60">{p.role}</p>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 py-12 text-center">
        <p className="text-wine/70">{content.registryMessage}</p>
        <Link
          href={`${base}/presentes`}
          className="mt-4 inline-block rounded-full px-8 py-3 font-semibold text-white"
          style={{ backgroundColor: themeColor }}
        >
          Ver lista de presentes
        </Link>
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
  href,
  photoUrl,
}: {
  title: string;
  description: string | null;
  priceCents: number;
  fundedCents: number;
  themeColor: string;
  href: string;
  photoUrl?: string | null;
}) {
  const progress = priceCents > 0 ? Math.min(100, (fundedCents / priceCents) * 100) : 0;
  const funded = fundedCents >= priceCents;

  return (
    <div className="overflow-hidden rounded-2xl border border-wine/10 bg-white shadow-sm">
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={title} className="h-40 w-full object-cover" />
      )}
      <div className="p-6">
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
          <p className="mt-3 text-sm font-semibold text-sage">Presente completo!</p>
        ) : (
          <Link
            href={href}
            className="mt-4 block rounded-full py-3 text-center text-sm font-semibold text-white"
            style={{ backgroundColor: themeColor }}
          >
            Presentear
          </Link>
        )}
      </div>
    </div>
  );
}
