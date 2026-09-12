"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { coupleDisplayName, formatDate, formatCurrency, getTemplate } from "@/lib/utils";
import { isWeddingOver, siteBaseFor } from "@/lib/checklist";
import { siteUrl } from "@/lib/assets";
import { GIFT_INTRO, mapsLinks, skinFor, type WeddingSkin } from "@/lib/wedding-theme";
import { Countdown } from "./countdown";
import { GuestNav } from "./guest-nav";
import { SplashPapel } from "./splash-papel";
import { ShareBar } from "./share-bar";

export type GuestAction = "home" | "rsvp" | "gifts" | "story" | "day" | "photos" | "padrinhos";

interface WeddingSiteProps {
  tenant: Tenant;
  templateId: TemplateId;
  themeColor: string;
  content: SiteContent;
  showBranding?: boolean;
  siteBase?: string;
  previewMode?: boolean;
  exampleNames?: boolean;
  onGuestAction?: (action: "rsvp" | "gifts") => void;
}

const SECTION: Record<Exclude<GuestAction, "rsvp" | "gifts">, string> = {
  home: "inicio",
  story: "historia",
  day: "o-casamento",
  photos: "fotos",
  padrinhos: "padrinhos",
};

function ConfirmCta({
  href,
  previewMode,
  onPreview,
  className,
  style,
  children,
}: {
  href: string;
  previewMode?: boolean;
  onPreview: () => void;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        if (!previewMode) return;
        e.preventDefault();
        onPreview();
      }}
    >
      {children}
    </Link>
  );
}

export function WeddingSiteView({
  tenant,
  templateId,
  themeColor,
  content,
  showBranding = true,
  siteBase,
  previewMode = false,
  exampleNames = false,
  onGuestAction,
}: WeddingSiteProps) {
  const router = useRouter();
  const isPreview = previewMode === true;
  const template = getTemplate(templateId);
  const skin = skinFor(templateId);
  const names = coupleDisplayName(tenant.partner1_name, tenant.partner2_name);
  const base = siteBaseFor(tenant.slug, siteBase);
  const over = isWeddingOver(tenant.wedding_date);
  const cover = content.coverPhotoUrl;
  const gallery = content.gallery ?? [];
  const padrinhos = content.padrinhos ?? [];
  const timeline = content.timeline ?? [];
  const hasCeremony = Boolean(content.ceremony?.venue);
  const hasReception = Boolean(content.reception?.venue);
  const [splash, setSplash] = useState(false);

  const dismissSplash = useCallback(() => {
    setSplash(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`nc-splash-${tenant.slug}`, "1");
    }
  }, [tenant.slug]);

  useEffect(() => {
    if (isPreview || skin !== "papel") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(`nc-splash-${tenant.slug}`)) return;
    setSplash(true);
  }, [isPreview, skin, tenant.slug]);

  function go(action: GuestAction) {
    if ((action === "rsvp" || action === "gifts") && isPreview) {
      onGuestAction?.(action);
      return;
    }
    if (action === "rsvp") {
      router.push(`${base}/rsvp`);
      return;
    }
    if (action === "gifts") {
      router.push(`${base}/presentes`);
      return;
    }
    const id = SECTION[action];
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const accent = themeColor;

  return (
    <div className={`wedding-root min-h-screen ${template.fontClass}`} data-skin={skin}>
      {splash && (
        <SplashPapel names={names} dateLabel={formatDate(tenant.wedding_date)} onDone={dismissSplash} />
      )}
      <GuestNav
        content={content}
        over={over}
        skin={skin}
        rsvpHref={`${base}/rsvp`}
        giftsHref={`${base}/presentes`}
        previewMode={isPreview}
        onAction={go}
      />

      <div id="inicio">
        {skin === "papel" && (
          <PapelHero
            names={names}
            date={tenant.wedding_date}
            dateLabel={formatDate(tenant.wedding_date)}
            subtitle={content.heroSubtitle}
            cover={cover}
            accent={accent}
            over={over}
            example={exampleNames}
            confirmHref={`${base}/rsvp`}
            previewMode={isPreview}
            onConfirm={() => go("rsvp")}
          />
        )}
        {skin === "costa" && (
          <CostaHero
            names={names}
            date={tenant.wedding_date}
            dateLabel={formatDate(tenant.wedding_date)}
            subtitle={content.heroSubtitle}
            cover={cover}
            accent={accent}
            over={over}
            example={exampleNames}
            confirmHref={`${base}/rsvp`}
            previewMode={isPreview}
            onConfirm={() => go("rsvp")}
          />
        )}
        {skin === "noite" && (
          <NoiteHero
            names={names}
            date={tenant.wedding_date}
            dateLabel={formatDate(tenant.wedding_date)}
            subtitle={content.heroSubtitle}
            cover={cover}
            accent={accent}
            over={over}
            example={exampleNames}
            confirmHref={`${base}/rsvp`}
            previewMode={isPreview}
            onConfirm={() => go("rsvp")}
          />
        )}
      </div>

      {over && content.thankYouMessage && (
        <section className="motion-reveal px-4 py-20 text-center" style={{ background: "var(--wed-bg)", color: "var(--wed-ink)" }}>
          <h2 className="font-serif text-4xl italic">Obrigado</h2>
          <p className="mx-auto mt-4 max-w-xl whitespace-pre-line opacity-80">{content.thankYouMessage}</p>
        </section>
      )}

      {(content.bridePhotoUrl || content.groomPhotoUrl) && (
        <CoupleRow
          p1={tenant.partner1_name}
          p2={tenant.partner2_name}
          bride={content.bridePhotoUrl}
          groom={content.groomPhotoUrl}
        />
      )}

      {content.story && (
        <section id="historia" className="motion-reveal mx-auto max-w-2xl px-6 py-24 text-center" style={{ color: "var(--wed-ink)" }}>
          <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--wed-meta)" }}>
            Nós
          </p>
          <h2 className="mt-3 font-serif text-4xl italic">Nossa história</h2>
          <p className="mt-6 whitespace-pre-line leading-relaxed opacity-80">{content.story}</p>
        </section>
      )}

      {gallery.length > 0 && (
        <GalleryMosaic id="fotos" photos={gallery} skin={skin} />
      )}

      <section
        id="o-casamento"
        className="px-4 py-24"
        style={{ background: skin === "noite" ? "#0c0a09" : "var(--wed-card)", color: "var(--wed-ink)" }}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-4xl italic">O casamento</h2>

          {timeline.length > 0 && (
            <ol className="mx-auto mt-12 max-w-lg space-y-6">
              {timeline.map((item, i) => (
                <li key={item.id} className={`motion-reveal motion-delay-${Math.min(i + 1, 4)} flex gap-6`}>
                  <span className="w-16 shrink-0 text-sm tracking-widest" style={{ color: accent }}>
                    {item.time}
                  </span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.description && <p className="mt-1 text-sm opacity-70">{item.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {(hasCeremony || hasReception) && (
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              {hasCeremony && <EventBlock event={content.ceremony!} accent={accent} skin={skin} />}
              {hasReception && <EventBlock event={content.reception!} accent={accent} skin={skin} />}
            </div>
          )}

          {content.dressCode && (
            <p className="mt-10 text-center opacity-80">
              <strong>Traje:</strong> {content.dressCode}
            </p>
          )}
          {content.musicNote && (
            <p className="mt-3 text-center text-sm italic opacity-70">{content.musicNote}</p>
          )}
          {content.travel && (
            <div className="mx-auto mt-10 max-w-xl p-6" style={{ border: "1px solid var(--wed-frame)" }}>
              <h3 className="font-serif text-2xl italic">Como chegar e ficar</h3>
              <p className="mt-3 whitespace-pre-line text-sm opacity-75">{content.travel}</p>
            </div>
          )}
        </div>
      </section>

      {padrinhos.length > 0 && (
        <section id="padrinhos" className="px-4 py-24" style={{ background: "var(--wed-bg)", color: "var(--wed-ink)" }}>
          <h2 className="text-center font-serif text-4xl italic">Padrinhos</h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
            {padrinhos.map((p) => (
              <figure key={p.id} className="text-center">
                {p.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className={`mx-auto h-32 w-32 object-cover ${skin === "costa" ? "rounded-full" : ""}`}
                  />
                )}
                <figcaption className="mt-3 font-medium">{p.name}</figcaption>
                <p className="text-sm opacity-60">{p.role}</p>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 py-20 text-center" style={{ color: "var(--wed-ink)", background: "var(--wed-card)" }}>
        <p className="mx-auto max-w-xl text-sm leading-relaxed opacity-80">
          {content.registryMessage || GIFT_INTRO}
        </p>
        <ConfirmCta
          href={`${base}/presentes`}
          previewMode={isPreview}
          onPreview={() => go("gifts")}
          className="mt-6 inline-block text-[12px] uppercase tracking-[0.2em] underline"
          style={{ color: accent }}
        >
          Presentes
        </ConfirmCta>
      </section>

      <footer className="border-t px-4 py-10 text-center" style={{ borderColor: "var(--wed-frame)", color: "var(--wed-mute)" }}>
        {!isPreview && (
          <ShareBar
            names={names}
            date={tenant.wedding_date}
            url={siteUrl(base)}
            location={content.ceremony?.venue}
          />
        )}
        {showBranding && (
          <p className="mt-6 text-sm">
            Site criado com{" "}
            <Link href="/" className="underline">
              NossoCasamento
            </Link>
          </p>
        )}
      </footer>
    </div>
  );
}

function PapelHero({
  names,
  date,
  dateLabel,
  subtitle,
  cover,
  accent,
  over,
  example,
  confirmHref,
  previewMode,
  onConfirm,
}: {
  names: string;
  date: string;
  dateLabel: string;
  subtitle?: string;
  cover?: string;
  accent: string;
  over: boolean;
  example: boolean;
  confirmHref: string;
  previewMode?: boolean;
  onConfirm: () => void;
}) {
  return (
    <header className="relative min-h-[100svh] px-4 py-16">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 z-0 bg-[rgba(40,24,18,0.18)]" />
      <div className="absolute inset-0 z-0 bg-[rgba(243,232,214,0.42)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] max-w-lg items-center">
        <div className="motion-card-in relative w-full bg-[#fffefb] px-8 py-16 text-center shadow-[0_40px_90px_rgba(40,20,10,.35)] sm:px-12">
          <span className="pointer-events-none absolute inset-[18px] border border-[#d7c4aa]" />
          <span className="pointer-events-none absolute inset-[22px] border border-[#d7c4aa]" />
          <p className="text-[10px] tracking-[0.6em] text-[#b08968] uppercase">O grande dia</p>
          <h1 className="font-script mt-4 text-[clamp(2.8rem,8vw,5.2rem)] leading-none text-[#7a3e48]">
            {names}
          </h1>
          {example && <p className="mt-2 text-[10px] uppercase tracking-widest text-[#8a6a55]">Exemplo</p>}
          <div className="motion-line mx-auto mt-6 h-px w-16" style={{ background: accent }} />
          <p className="mt-6 text-xs uppercase tracking-[0.32em] text-[#8a6a55]">{dateLabel}</p>
          {subtitle && <p className="mt-6 font-baskerville italic text-[#5c4a40]">{subtitle}</p>}
          <div className="mt-6">
            <Countdown date={date} variant="line" />
          </div>
          {!over && (
            <ConfirmCta
              href={confirmHref}
              previewMode={previewMode}
              onPreview={onConfirm}
              className="mt-10 inline-block border px-10 py-3 text-[11px] uppercase tracking-[0.22em]"
              style={{ borderColor: accent, color: accent }}
            >
              Confirmar presença
            </ConfirmCta>
          )}
          <div
            className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-full font-script text-2xl text-[#f6e6c8]"
            style={{
              background: "radial-gradient(circle at 30% 30%, #b85c5c, #7a2e34)",
            }}
          >
            ✦
          </div>
        </div>
      </div>
    </header>
  );
}

function CostaHero({
  names,
  date,
  dateLabel,
  subtitle,
  cover,
  accent,
  over,
  example,
  confirmHref,
  previewMode,
  onConfirm,
}: {
  names: string;
  date: string;
  dateLabel: string;
  subtitle?: string;
  cover?: string;
  accent: string;
  over: boolean;
  example: boolean;
  confirmHref: string;
  previewMode?: boolean;
  onConfirm: () => void;
}) {
  return (
    <header className="relative flex min-h-[100svh] items-end justify-center overflow-hidden px-4 pb-[12vh] text-center text-white">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="motion-hero-drift absolute inset-[-4%] h-[108%] w-[108%] object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: accent }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,12,10,0.78)] via-[rgba(20,12,10,0.15)] to-[rgba(20,12,10,0.25)]" />
      <div className="relative z-10 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.42em]" style={{ color: accent }}>
          O grande dia
        </p>
        <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,5.4rem)] font-normal italic leading-[0.95]">
          {names}
        </h1>
        {example && <p className="mt-2 text-[10px] uppercase tracking-widest text-white/70">Exemplo</p>}
        <p className="mt-5 text-lg font-light opacity-90">{dateLabel}</p>
        {subtitle && <p className="mx-auto mt-5 max-w-md font-light opacity-85">{subtitle}</p>}
        <div className="mt-8">
          <Countdown date={date} variant="units" />
        </div>
        {!over && (
          <ConfirmCta
            href={confirmHref}
            previewMode={previewMode}
            onPreview={onConfirm}
            className="mt-10 rounded-full px-8 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-[#2a1c18]"
            style={{ background: accent }}
          >
            Confirmar presença
          </ConfirmCta>
        )}
      </div>
    </header>
  );
}

function NoiteHero({
  names,
  date,
  dateLabel,
  subtitle,
  cover,
  accent,
  over,
  example,
  confirmHref,
  previewMode,
  onConfirm,
}: {
  names: string;
  date: string;
  dateLabel: string;
  subtitle?: string;
  cover?: string;
  accent: string;
  over: boolean;
  example: boolean;
  confirmHref: string;
  previewMode?: boolean;
  onConfirm: () => void;
}) {
  return (
    <header className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 py-24 text-center text-[#eadcc6]">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-[0.55] saturate-[0.7]"
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,10,9,0.15),rgba(12,10,9,0.88)_70%,#0c0a09)]" />
      <div
        className="pointer-events-none absolute top-[18%] left-[12%] h-[420px] w-[420px] rounded-full"
        style={{ background: `radial-gradient(circle, ${accent}38, transparent 65%)` }}
      />
      <div className="relative z-10 max-w-2xl">
        <p className="font-cinzel text-[11px] uppercase tracking-[0.55em]" style={{ color: accent }}>
          O grande dia
        </p>
        <div className="motion-line mx-auto mt-8 h-12 w-px" style={{ background: accent }} />
        <h1 className="font-cinzel mt-8 text-[clamp(2.2rem,7vw,4.8rem)] font-normal uppercase tracking-[0.18em] leading-[1.15]">
          {names}
        </h1>
        {example && <p className="mt-2 text-[10px] uppercase tracking-widest opacity-60">Exemplo</p>}
        <p className="font-serif mt-3 text-2xl italic" style={{ color: accent }}>
          {dateLabel}
        </p>
        {subtitle && <p className="mx-auto mt-6 max-w-md font-light leading-relaxed opacity-80">{subtitle}</p>}
        <div className="mt-8">
          <Countdown date={date} variant="line" />
        </div>
        {!over && (
          <ConfirmCta
            href={confirmHref}
            previewMode={previewMode}
            onPreview={onConfirm}
            className="mt-10 border px-8 py-4 text-[11px] uppercase tracking-[0.24em]"
            style={{ borderColor: accent, color: accent }}
          >
            Confirmar presença
          </ConfirmCta>
        )}
      </div>
    </header>
  );
}

function CoupleRow({
  p1,
  p2,
  bride,
  groom,
}: {
  p1: string;
  p2: string;
  bride?: string;
  groom?: string;
}) {
  const cell = (src: string, name: string) => (
    <figure className="relative min-h-[50vh] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="h-full min-h-[50vh] w-full object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-6 text-white">
        <p className="font-serif text-2xl italic">{name}</p>
      </figcaption>
    </figure>
  );

  return (
    <section className={`grid ${bride && groom ? "md:grid-cols-2" : ""}`}>
      {bride && cell(bride, p1)}
      {groom && cell(groom, p2)}
    </section>
  );
}

function GalleryMosaic({
  id,
  photos,
  skin,
}: {
  id: string;
  photos: { id: string; url: string; caption?: string }[];
  skin: WeddingSkin;
}) {
  if (photos.length === 1) {
    return (
      <section id={id}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0].url} alt={photos[0].caption ?? ""} className="max-h-[85vh] w-full object-cover" />
      </section>
    );
  }

  if (skin === "costa" && photos.length >= 3) {
    const lead = photos.slice(0, 3);
    const rest = photos.slice(3);
    return (
      <section id={id}>
        <div className="grid md:grid-cols-3">
          {lead.map((photo) => (
            <figure key={photo.id} className="relative min-h-[72vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption ?? ""} className="motion-tile-zoom h-full min-h-[72vh] w-full object-cover" />
              {photo.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-6 font-serif text-2xl italic text-white">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
        {rest.length > 0 && (
          <div className="grid gap-1 sm:grid-cols-2">
            {rest.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={photo.id} src={photo.url} alt={photo.caption ?? ""} className="aspect-[4/5] w-full object-cover" />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section id={id} className="px-4 py-16" style={{ background: "var(--wed-bg)" }}>
      <h2 className="mb-10 text-center font-serif text-4xl italic" style={{ color: "var(--wed-ink)" }}>
        Fotos
      </h2>
      <div className={`mx-auto grid max-w-5xl gap-4 ${photos.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {photos.map((photo) => (
          <figure key={photo.id} className="overflow-hidden" style={{ background: "var(--wed-card)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.caption ?? ""} className="aspect-[4/5] w-full object-cover" />
            {photo.caption && (
              <figcaption className="px-3 py-2 text-sm" style={{ color: "var(--wed-mute)" }}>
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

function EventBlock({
  event,
  accent,
  skin,
}: {
  event: NonNullable<SiteContent["ceremony"]>;
  accent: string;
  skin: WeddingSkin;
}) {
  const { google, waze } = mapsLinks(event.address, event.mapsUrl);
  return (
    <div
      className="p-8 text-center"
      style={{
        border: skin === "costa" ? "none" : "1px solid var(--wed-frame)",
        background: skin === "costa" ? "transparent" : "transparent",
      }}
    >
      <h3 className="font-serif text-2xl italic" style={{ color: accent }}>
        {event.title}
      </h3>
      <p className="mt-2 opacity-80">
        {event.time}
        {event.date ? ` · ${formatDate(event.date)}` : ""}
      </p>
      <p className="mt-2 font-medium">{event.venue}</p>
      {event.address && <p className="mt-1 text-sm opacity-60">{event.address}</p>}
      {(google || waze) && (
        <p className="mt-4 flex justify-center gap-4 text-sm">
          <span className="opacity-70">Como chegar</span>
          {google && (
            <a href={google} target="_blank" rel="noreferrer" className="underline" style={{ color: accent }}>
              Maps
            </a>
          )}
          {waze && (
            <a href={waze} target="_blank" rel="noreferrer" className="underline" style={{ color: accent }}>
              Waze
            </a>
          )}
        </p>
      )}
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
    <div className="overflow-hidden border border-wine/10 bg-white">
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={title} className="h-40 w-full object-cover" />
      )}
      <div className="p-6">
        <h3 className="font-serif text-xl italic text-wine">{title}</h3>
        {description && <p className="mt-2 text-sm text-wine/70">{description}</p>}
        <p className="mt-4 font-serif text-2xl" style={{ color: themeColor }}>
          {formatCurrency(priceCents)}
        </p>
        <div className="mt-3 h-2 overflow-hidden bg-cream-dark">
          <div className="h-full transition-all" style={{ width: `${progress}%`, backgroundColor: themeColor }} />
        </div>
        {funded ? (
          <p className="mt-3 text-sm font-semibold text-sage">Presente completo!</p>
        ) : (
          <Link
            href={href}
            className="mt-4 block py-3 text-center text-sm font-semibold text-white"
            style={{ backgroundColor: themeColor }}
          >
            Presentear
          </Link>
        )}
      </div>
    </div>
  );
}
