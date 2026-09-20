"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SiteContent, Tenant } from "@/lib/types";
import type { TemplateId } from "@/lib/constants";
import { coupleDisplayName, formatDate, formatCurrency } from "@/lib/utils";
import { isWeddingOver, siteBaseFor } from "@/lib/checklist";
import { siteUrl } from "@/lib/assets";
import {
  GIFT_INTRO,
  mapsLinks,
  themeFor,
  themeVars,
  type HeroLayout,
  type NameStyle,
  type ThemeSpec,
} from "@/lib/wedding-theme";
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

function nameClass(style: NameStyle) {
  if (style === "script") return "font-script leading-[0.95]";
  if (style === "cinzel") {
    return "font-cinzel uppercase tracking-[0.08em] sm:tracking-[0.16em] leading-[1.2]";
  }
  if (style === "outfit") return "font-outfit font-light tracking-tight leading-[1.1]";
  return "font-serif italic leading-[0.95]";
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
  const theme = themeFor(templateId);
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
    if (isPreview || !theme.splash) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(`nc-splash-${tenant.slug}`)) return;
    setSplash(true);
  }, [isPreview, theme.splash, tenant.slug]);

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

  const accent = themeColor || theme.defaultColor;
  const hero = {
    theme,
    names,
    date: tenant.wedding_date,
    dateLabel: formatDate(tenant.wedding_date),
    subtitle: content.heroSubtitle,
    cover,
    accent,
    over,
    example: exampleNames,
    confirmHref: `${base}/rsvp`,
    previewMode: isPreview,
    onConfirm: () => go("rsvp"),
  };

  return (
    <div
      className={`wedding-root min-h-dvh overflow-x-clip ${theme.fontClass}`}
      data-skin={theme.id}
      data-layout={theme.layout}
      style={themeVars(theme)}
    >
      {splash && (
        <SplashPapel names={names} dateLabel={formatDate(tenant.wedding_date)} onDone={dismissSplash} />
      )}
      <GuestNav
        content={content}
        over={over}
        theme={theme}
        brand={names}
        rsvpHref={`${base}/rsvp`}
        giftsHref={`${base}/presentes`}
        previewMode={isPreview}
        onAction={go}
      />

      <div id="inicio">
        <WeddingHero {...hero} />
      </div>

      {over && content.thankYouMessage && (
        <section
          className="motion-reveal px-4 py-16 text-center sm:py-20"
          style={{ background: "var(--wed-bg)", color: "var(--wed-ink)" }}
        >
          <h2 className="font-serif text-3xl italic sm:text-4xl">Obrigado</h2>
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
        <section
          id="historia"
          className="motion-reveal mx-auto max-w-2xl px-5 py-16 text-center sm:px-6 sm:py-24"
          style={{ color: "var(--wed-ink)" }}
        >
          <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--wed-meta)" }}>
            Nós
          </p>
          <h2 className="mt-3 font-serif text-3xl italic sm:text-4xl">Nossa história</h2>
          <p className="mt-6 whitespace-pre-line leading-relaxed opacity-80">{content.story}</p>
        </section>
      )}

      {gallery.length > 0 && <GalleryMosaic id="fotos" photos={gallery} layout={theme.layout} />}

      <section
        id="o-casamento"
        className="px-4 py-16 sm:py-24"
        style={{ background: "var(--wed-card)", color: "var(--wed-ink)" }}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl italic sm:text-4xl">O casamento</h2>

          {timeline.length > 0 && (
            <ol className="mx-auto mt-10 max-w-lg space-y-6 sm:mt-12">
              {timeline.map((item, i) => (
                <li key={item.id} className={`motion-reveal motion-delay-${Math.min(i + 1, 4)} flex gap-4 sm:gap-6`}>
                  <span className="w-14 shrink-0 text-sm tracking-widest sm:w-16" style={{ color: accent }}>
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
            <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-2 md:gap-10">
              {hasCeremony && (
                <EventBlock event={content.ceremony!} accent={accent} bordered={theme.layout !== "bleed"} />
              )}
              {hasReception && (
                <EventBlock event={content.reception!} accent={accent} bordered={theme.layout !== "bleed"} />
              )}
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
            <div className="mx-auto mt-10 max-w-xl p-5 sm:p-6" style={{ border: "1px solid var(--wed-frame)" }}>
              <h3 className="font-serif text-2xl italic">Como chegar e ficar</h3>
              <p className="mt-3 whitespace-pre-line text-sm opacity-75">{content.travel}</p>
            </div>
          )}
        </div>
      </section>

      {padrinhos.length > 0 && (
        <section
          id="padrinhos"
          className="px-4 py-16 sm:py-24"
          style={{ background: "var(--wed-bg)", color: "var(--wed-ink)" }}
        >
          <h2 className="text-center font-serif text-3xl italic sm:text-4xl">Padrinhos</h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:mt-12 sm:grid-cols-3">
            {padrinhos.map((p) => (
              <figure key={p.id} className="text-center">
                {p.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className={`mx-auto h-28 w-28 object-cover sm:h-32 sm:w-32 ${theme.roundPhotos ? "rounded-full" : ""}`}
                  />
                )}
                <figcaption className="mt-3 font-medium">{p.name}</figcaption>
                <p className="text-sm opacity-60">{p.role}</p>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section
        className="px-4 py-16 text-center sm:py-20"
        style={{ color: "var(--wed-ink)", background: "var(--wed-card)" }}
      >
        <p className="mx-auto max-w-xl text-sm leading-relaxed opacity-80">
          {content.registryMessage || GIFT_INTRO}
        </p>
        <ConfirmCta
          href={`${base}/presentes`}
          previewMode={isPreview}
          onPreview={() => go("gifts")}
          className="mt-6 inline-flex min-h-11 items-center text-[12px] uppercase tracking-[0.2em] underline"
          style={{ color: accent }}
        >
          Presentes
        </ConfirmCta>
      </section>

      <footer
        className="border-t px-4 py-10 text-center"
        style={{
          borderColor: "var(--wed-frame)",
          color: "var(--wed-mute)",
          paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
        }}
      >
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

type HeroProps = {
  theme: ThemeSpec;
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
};

function WeddingHero(props: HeroProps) {
  const { theme } = props;
  if (theme.layout === "card") return <CardHero {...props} />;
  if (theme.layout === "split") return <SplitHero {...props} />;
  if (theme.layout === "film") return <FilmHero {...props} />;
  if (theme.layout === "stack") return <StackHero {...props} />;
  if (theme.layout === "void") return <VoidHero {...props} />;
  return <BleedHero {...props} />;
}

function ConfirmButton({
  props,
  className,
  filled,
  ink,
}: {
  props: HeroProps;
  className: string;
  filled?: boolean;
  ink?: string;
}) {
  if (props.over) return null;
  return (
    <ConfirmCta
      href={props.confirmHref}
      previewMode={props.previewMode}
      onPreview={props.onConfirm}
      className={`mt-8 inline-flex min-h-11 items-center justify-center px-7 py-3 text-[11px] uppercase tracking-[0.2em] sm:mt-10 sm:px-8 ${className}`}
      style={
        filled
          ? { background: props.accent, color: ink ?? "#fffefb" }
          : { border: `1px solid ${props.accent}`, color: props.accent }
      }
    >
      Confirmar presença
    </ConfirmCta>
  );
}

function CardHero(props: HeroProps) {
  return (
    <header className="relative min-h-[100svh] overflow-x-clip px-3 py-10 sm:px-4 sm:py-16">
      {props.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className={`absolute inset-0 z-0 ${props.theme.overlay}`} />
      {props.theme.id === "classic" && <div className="absolute inset-0 z-0 bg-[rgba(243,232,214,0.42)]" />}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-6rem)] max-w-lg items-center">
        <div
          className="motion-card-in relative w-full px-5 py-12 text-center shadow-[0_40px_90px_rgba(40,20,10,.35)] sm:px-12 sm:py-16"
          style={{ background: "var(--wed-card)", color: "var(--wed-ink)" }}
        >
          <span
            className="pointer-events-none absolute inset-3 border sm:inset-[18px]"
            style={{ borderColor: "var(--wed-frame)" }}
          />
          <span
            className="pointer-events-none absolute inset-4 border sm:inset-[22px]"
            style={{ borderColor: "var(--wed-frame)" }}
          />
          <p className="text-[10px] tracking-[0.4em] uppercase sm:tracking-[0.6em]" style={{ color: "var(--wed-meta)" }}>
            O grande dia
          </p>
          <h1
            className={`${nameClass(props.theme.nameStyle)} mt-4 break-words text-[clamp(2.2rem,10vw,5.2rem)]`}
            style={{ color: props.accent }}
          >
            {props.names}
          </h1>
          {props.example && (
            <p className="mt-2 text-[10px] uppercase tracking-widest" style={{ color: "var(--wed-meta)" }}>
              Exemplo
            </p>
          )}
          <div className="motion-line mx-auto mt-6 h-px w-16" style={{ background: props.accent }} />
          <p className="mt-6 text-xs uppercase tracking-[0.24em] sm:tracking-[0.32em]" style={{ color: "var(--wed-meta)" }}>
            {props.dateLabel}
          </p>
          {props.subtitle && <p className="mt-6 italic opacity-80">{props.subtitle}</p>}
          <div className="mt-6">
            <Countdown date={props.date} variant="line" />
          </div>
          <ConfirmButton props={props} className="border" />
          <div
            className="mx-auto mt-8 grid h-14 w-14 place-items-center rounded-full font-script text-2xl"
            style={{
              background: "radial-gradient(circle at 30% 30%, #b85c5c, #7a2e34)",
              color: "#f6e6c8",
            }}
          >
            ✦
          </div>
        </div>
      </div>
    </header>
  );
}

function BleedHero(props: HeroProps) {
  return (
    <header className="relative flex min-h-[100svh] items-end justify-center overflow-hidden px-4 pb-[max(4rem,12vh)] pt-16 text-center text-white">
      {props.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.cover}
          alt=""
          className="motion-hero-drift absolute inset-[-4%] h-[108%] w-[108%] max-w-none object-cover"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: props.accent }} />
      )}
      <div className={`absolute inset-0 ${props.theme.overlay}`} />
      <div className="relative z-10 w-full max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.32em] sm:text-xs sm:tracking-[0.42em]" style={{ color: props.accent }}>
          O grande dia
        </p>
        <h1 className={`${nameClass(props.theme.nameStyle)} mt-4 break-words text-[clamp(2.2rem,9vw,5.4rem)]`}>
          {props.names}
        </h1>
        {props.example && <p className="mt-2 text-[10px] uppercase tracking-widest text-white/70">Exemplo</p>}
        <p className="mt-4 text-base font-light opacity-90 sm:mt-5 sm:text-lg">{props.dateLabel}</p>
        {props.subtitle && (
          <p className="mx-auto mt-4 max-w-md font-light opacity-85 sm:mt-5">{props.subtitle}</p>
        )}
        <div className="mt-6 sm:mt-8">
          <Countdown date={props.date} variant="units" />
        </div>
        <ConfirmButton props={props} className="rounded-full" filled ink="#2a1c18" />
      </div>
    </header>
  );
}

function VoidHero(props: HeroProps) {
  const dark = props.theme.bg.startsWith("#0");
  return (
    <header
      className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-24"
      style={{ color: "var(--wed-ink)" }}
    >
      {props.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.cover}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${dark ? "brightness-[0.55] saturate-[0.7]" : ""}`}
        />
      )}
      <div className={`absolute inset-0 ${props.theme.overlay}`} />
      {dark && (
        <div
          className="pointer-events-none absolute top-[18%] left-[8%] h-[min(420px,70vw)] w-[min(420px,70vw)] rounded-full"
          style={{ background: `radial-gradient(circle, ${props.accent}38, transparent 65%)` }}
        />
      )}
      <div className="relative z-10 w-full max-w-2xl">
        <p
          className="font-cinzel text-[10px] uppercase tracking-[0.4em] sm:text-[11px] sm:tracking-[0.55em]"
          style={{ color: props.accent }}
        >
          O grande dia
        </p>
        <div className="motion-line mx-auto mt-6 h-10 w-px sm:mt-8 sm:h-12" style={{ background: props.accent }} />
        <h1 className={`${nameClass(props.theme.nameStyle)} mt-6 break-words text-[clamp(1.8rem,8vw,4.8rem)] sm:mt-8`}>
          {props.names}
        </h1>
        {props.example && <p className="mt-2 text-[10px] uppercase tracking-widest opacity-60">Exemplo</p>}
        <p className="font-serif mt-3 text-xl italic sm:text-2xl" style={{ color: props.accent }}>
          {props.dateLabel}
        </p>
        {props.subtitle && (
          <p className="mx-auto mt-5 max-w-md font-light leading-relaxed opacity-80 sm:mt-6">{props.subtitle}</p>
        )}
        <div className="mt-6 sm:mt-8">
          <Countdown date={props.date} variant="line" />
        </div>
        <ConfirmButton props={props} className="border" />
      </div>
    </header>
  );
}

function SplitHero(props: HeroProps) {
  return (
    <header className="grid min-h-[100svh] md:grid-cols-2" style={{ background: "var(--wed-bg)", color: "var(--wed-ink)" }}>
      <div className="relative min-h-[42svh] md:min-h-full">
        {props.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: props.accent }} />
        )}
      </div>
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10 md:px-12 md:py-20">
        <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--wed-meta)" }}>
          O grande dia
        </p>
        <h1 className={`${nameClass(props.theme.nameStyle)} mt-4 break-words text-[clamp(2.2rem,7vw,4.6rem)]`}>
          {props.names}
        </h1>
        {props.example && (
          <p className="mt-2 text-[10px] uppercase tracking-widest" style={{ color: "var(--wed-meta)" }}>
            Exemplo
          </p>
        )}
        <p className="mt-4 text-lg opacity-90">{props.dateLabel}</p>
        {props.subtitle && <p className="mt-5 max-w-md opacity-80">{props.subtitle}</p>}
        <div className="mt-6">
          <Countdown date={props.date} variant="line" />
        </div>
        <div>
          <ConfirmButton
            props={props}
            className=""
            filled={props.theme.id === "editorial"}
            ink="#fffefb"
          />
        </div>
      </div>
    </header>
  );
}

function FilmHero(props: HeroProps) {
  return (
    <header className="relative flex min-h-[100svh] items-end justify-center overflow-hidden bg-black px-4 pb-[max(5rem,14vh)] pt-20 text-center text-white">
      {props.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className={`absolute inset-0 ${props.theme.overlay}`} />
      <div className="absolute inset-x-0 top-0 h-[7svh] bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-[7svh] bg-black" />
      <div className="relative z-10 w-full max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.42em]" style={{ color: props.accent }}>
          O grande dia
        </p>
        <h1 className={`${nameClass(props.theme.nameStyle)} mt-4 break-words text-[clamp(2.2rem,9vw,5rem)]`}>
          {props.names}
        </h1>
        {props.example && <p className="mt-2 text-[10px] uppercase tracking-widest text-white/70">Exemplo</p>}
        <p className="mt-4 text-lg font-light">{props.dateLabel}</p>
        {props.subtitle && <p className="mx-auto mt-4 max-w-md font-light opacity-85">{props.subtitle}</p>}
        <div className="mt-6">
          <Countdown date={props.date} variant="units" />
        </div>
        <ConfirmButton props={props} className="" />
      </div>
    </header>
  );
}

function StackHero(props: HeroProps) {
  return (
    <header style={{ background: "var(--wed-bg)", color: "var(--wed-ink)" }}>
      <div className="relative h-[min(58svh,520px)] min-h-[240px]">
        {props.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: props.accent }} />
        )}
        <div className={`absolute inset-0 ${props.theme.overlay}`} />
      </div>
      <div className="relative z-10 mx-auto -mt-16 max-w-lg px-4 pb-16 sm:-mt-20">
        <div
          className="motion-card-in px-5 py-10 text-center shadow-[0_24px_60px_rgba(20,16,12,.16)] sm:px-10 sm:py-12"
          style={{ background: "var(--wed-card)" }}
        >
          <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--wed-meta)" }}>
            O grande dia
          </p>
          <h1 className={`${nameClass(props.theme.nameStyle)} mt-4 break-words text-[clamp(2.1rem,8vw,4.2rem)]`}>
            {props.names}
          </h1>
          {props.example && (
            <p className="mt-2 text-[10px] uppercase tracking-widest" style={{ color: "var(--wed-meta)" }}>
              Exemplo
            </p>
          )}
          <p className="mt-4 opacity-90">{props.dateLabel}</p>
          {props.subtitle && <p className="mt-4 opacity-80">{props.subtitle}</p>}
          <div className="mt-5">
            <Countdown date={props.date} variant="line" />
          </div>
          <ConfirmButton
            props={props}
            className=""
            filled={props.theme.id === "moderno"}
            ink="#fffefb"
          />
        </div>
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
    <figure className="relative min-h-[42vh] overflow-hidden sm:min-h-[50vh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="h-full min-h-[42vh] w-full object-cover sm:min-h-[50vh]" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-5 text-white sm:p-6">
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
  layout,
}: {
  id: string;
  photos: { id: string; url: string; caption?: string }[];
  layout: HeroLayout;
}) {
  const tall = (layout === "bleed" || layout === "film") && photos.length >= 3;

  return (
    <section id={id} className={tall ? "" : "px-4 py-12 sm:py-16"} style={{ background: "var(--wed-bg)" }}>
      {!tall && (
        <h2 className="mb-8 text-center font-serif text-3xl italic sm:mb-10 sm:text-4xl" style={{ color: "var(--wed-ink)" }}>
          Fotos
        </h2>
      )}
      {tall ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3">
            {photos.slice(0, 3).map((photo) => (
              <figure key={photo.id} className="relative min-h-[42vh] overflow-hidden md:min-h-[64vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  className="motion-tile-zoom h-full min-h-[42vh] w-full object-cover md:min-h-[64vh]"
                />
                {photo.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-4 font-serif text-xl italic text-white sm:p-6 sm:text-2xl">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          {photos.length > 3 && (
            <div className="grid grid-cols-2 gap-1">
              {photos.slice(3).map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover"
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div
          className={`mx-auto grid max-w-5xl gap-3 sm:gap-4 ${
            photos.length === 1 ? "grid-cols-1" : photos.length === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"
          }`}
        >
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
      )}
    </section>
  );
}

function EventBlock({
  event,
  accent,
  bordered,
}: {
  event: NonNullable<SiteContent["ceremony"]>;
  accent: string;
  bordered: boolean;
}) {
  const { google, waze } = mapsLinks(event.address, event.mapsUrl);
  return (
    <div
      className="p-6 text-center sm:p-8"
      style={{ border: bordered ? "1px solid var(--wed-frame)" : "none" }}
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
        <p className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <span className="opacity-70">Como chegar</span>
          {google && (
            <a href={google} target="_blank" rel="noreferrer" className="min-h-11 inline-flex items-center underline" style={{ color: accent }}>
              Maps
            </a>
          )}
          {waze && (
            <a href={waze} target="_blank" rel="noreferrer" className="min-h-11 inline-flex items-center underline" style={{ color: accent }}>
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
            className="mt-4 block min-h-11 py-3 text-center text-sm font-semibold text-white"
            style={{ backgroundColor: themeColor }}
          >
            Presentear
          </Link>
        )}
      </div>
    </div>
  );
}
