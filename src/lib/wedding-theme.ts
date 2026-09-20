import type { CSSProperties } from "react";
import { TEMPLATE_IDS, type TemplateId } from "./constants";

export type HeroLayout = "card" | "bleed" | "void" | "split" | "film" | "stack";
export type NameStyle = "script" | "serif" | "cinzel" | "outfit";
export type WeddingSkin = TemplateId;

export interface Palette {
  id: string;
  name: string;
  color: string;
}

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  defaultColor: string;
  fontClass: string;
  preview: string;
}

export interface ThemeSpec extends TemplateMeta {
  layout: HeroLayout;
  nameStyle: NameStyle;
  navBar: string;
  navConfirm: string;
  splash: boolean;
  roundPhotos: boolean;
  bg: string;
  card: string;
  ink: string;
  mute: string;
  meta: string;
  frame: string;
  gold: string;
  overlay: string;
  palettes: Palette[];
}

const P = {
  vinho: (extra: Palette[] = []): Palette[] => [
    { id: "vinho", name: "Vinho", color: "#7a3e48" },
    { id: "ouro", name: "Ouro", color: "#c4a574" },
    { id: "tinta", name: "Tinta", color: "#3b2f28" },
    { id: "areia", name: "Areia", color: "#b08968" },
    ...extra,
  ],
};

export const THEMES: ThemeSpec[] = [
  {
    id: "classic",
    name: "Papel",
    description: "Convite em papel, cerimônia clássica.",
    defaultColor: "#7a3e48",
    fontClass: "font-papel",
    preview: "/photos/altar.jpg",
    layout: "card",
    nameStyle: "script",
    splash: true,
    roundPhotos: false,
    navBar: "bg-[#fffdf8]/95 text-[#3b2f28] border-[#d7c4aa]",
    navConfirm: "border border-[#7a3e48] px-3 py-2 text-[11px] tracking-[0.18em] uppercase",
    bg: "#e8dcc8",
    card: "#fffefb",
    ink: "#3b2f28",
    mute: "#5c4a40",
    meta: "#8a6a55",
    frame: "#d7c4aa",
    gold: "#c4a574",
    overlay: "bg-[rgba(40,24,18,0.18)]",
    palettes: P.vinho(),
  },
  {
    id: "garden",
    name: "Costa",
    description: "Praia, sal, luz de fim de tarde.",
    defaultColor: "#c4a574",
    fontClass: "font-costa",
    preview: "/photos/jardim.jpg",
    layout: "bleed",
    nameStyle: "serif",
    splash: false,
    roundPhotos: true,
    navBar: "bg-[#2a1c18]/95 text-white border-white/10",
    navConfirm:
      "rounded-full bg-[#c4a574] px-3 py-2 text-[11px] tracking-[0.16em] uppercase text-[#2a1c18]",
    bg: "#f6efe6",
    card: "#f6efe6",
    ink: "#3a2a24",
    mute: "#8a746c",
    meta: "#c4a574",
    frame: "#e6d9cc",
    gold: "#c4a574",
    overlay: "bg-gradient-to-t from-[rgba(20,12,10,0.82)] via-[rgba(20,12,10,0.2)] to-[rgba(20,12,10,0.28)]",
    palettes: [
      { id: "ouro", name: "Ouro", color: "#c4a574" },
      { id: "folha", name: "Folha", color: "#5c7a5c" },
      { id: "dusk", name: "Dusk", color: "#2a1c18" },
      { id: "areia", name: "Areia", color: "#c49a8a" },
    ],
  },
  {
    id: "minimal",
    name: "Noite",
    description: "Preto, ouro, festa à noite.",
    defaultColor: "#c9a962",
    fontClass: "font-noite",
    preview: "/photos/beijo.jpg",
    layout: "void",
    nameStyle: "cinzel",
    splash: false,
    roundPhotos: false,
    navBar: "bg-[#0c0a09]/95 text-[#eadcc6] border-[#c9a962]/20",
    navConfirm:
      "border border-[#c9a962] px-3 py-2 text-[11px] tracking-[0.18em] uppercase text-[#c9a962]",
    bg: "#0c0a09",
    card: "#12100e",
    ink: "#eadcc6",
    mute: "rgba(234, 220, 198, 0.78)",
    meta: "#c9a962",
    frame: "rgba(201, 169, 98, 0.2)",
    gold: "#c9a962",
    overlay:
      "bg-[radial-gradient(ellipse_at_center,rgba(12,10,9,0.15),rgba(12,10,9,0.88)_70%,#0c0a09)]",
    palettes: [
      { id: "ouro", name: "Ouro", color: "#c9a962" },
      { id: "creme", name: "Creme", color: "#eadcc6" },
      { id: "bronze", name: "Bronze", color: "#b08968" },
      { id: "noite", name: "Noite", color: "#c9a962" },
    ],
  },
  {
    id: "editorial",
    name: "Revista",
    description: "Capa de revista. Tipo enorme. Vocês no centro.",
    defaultColor: "#1c1917",
    fontClass: "font-serif",
    preview: "/photos/ensaio.jpg",
    layout: "split",
    nameStyle: "serif",
    splash: false,
    roundPhotos: false,
    navBar: "bg-white/95 text-[#1c1917] border-black/10",
    navConfirm: "bg-[#1c1917] px-3 py-2 text-[11px] tracking-[0.18em] uppercase text-white",
    bg: "#f4f1ec",
    card: "#ffffff",
    ink: "#1c1917",
    mute: "#5c574f",
    meta: "#8a847a",
    frame: "#e4dfd6",
    gold: "#1c1917",
    overlay: "bg-black/10",
    palettes: [
      { id: "tinta", name: "Tinta", color: "#1c1917" },
      { id: "vinho", name: "Vinho", color: "#7a3e48" },
      { id: "grafite", name: "Grafite", color: "#44403c" },
      { id: "ouro", name: "Ouro", color: "#b08968" },
    ],
  },
  {
    id: "filme",
    name: "Filme",
    description: "Cinema de verão. Faixa preta, beijo na tela.",
    defaultColor: "#d4a574",
    fontClass: "font-outfit",
    preview: "/photos/risos.jpg",
    layout: "film",
    nameStyle: "serif",
    splash: false,
    roundPhotos: false,
    navBar: "bg-black/90 text-white border-white/10",
    navConfirm: "border border-white px-3 py-2 text-[11px] tracking-[0.18em] uppercase",
    bg: "#0a0a0a",
    card: "#111111",
    ink: "#f4ece6",
    mute: "rgba(244,236,230,0.75)",
    meta: "#d4a574",
    frame: "#222",
    gold: "#d4a574",
    overlay: "bg-gradient-to-t from-black via-black/20 to-black/40",
    palettes: [
      { id: "ouro", name: "Ouro", color: "#d4a574" },
      { id: "creme", name: "Creme", color: "#f4ece6" },
      { id: "vinho", name: "Vinho", color: "#9a4a4a" },
      { id: "noite", name: "Noite", color: "#c9a962" },
    ],
  },
  {
    id: "bosque",
    name: "Bosque",
    description: "Verde, folha, casamento no campo.",
    defaultColor: "#4a6b4a",
    fontClass: "font-serif",
    preview: "/photos/flores.jpg",
    layout: "stack",
    nameStyle: "serif",
    splash: false,
    roundPhotos: true,
    navBar: "bg-[#f3f0e8]/95 text-[#2c3a2c] border-[#c9d2c4]",
    navConfirm: "rounded-full bg-[#4a6b4a] px-3 py-2 text-[11px] tracking-[0.16em] uppercase text-white",
    bg: "#f3f0e8",
    card: "#fffcf6",
    ink: "#2c3a2c",
    mute: "#5c6b5c",
    meta: "#4a6b4a",
    frame: "#c9d2c4",
    gold: "#4a6b4a",
    overlay: "bg-[rgba(20,40,20,0.12)]",
    palettes: [
      { id: "folha", name: "Folha", color: "#4a6b4a" },
      { id: "musgo", name: "Musgo", color: "#3d5240" },
      { id: "ouro", name: "Ouro", color: "#c4a574" },
      { id: "terra", name: "Terra", color: "#6b4a3a" },
    ],
  },
  {
    id: "praia",
    name: "Areia",
    description: "Areia clara, vento, pés na água.",
    defaultColor: "#c4a07a",
    fontClass: "font-costa",
    preview: "/photos/festa.jpg",
    layout: "bleed",
    nameStyle: "serif",
    splash: false,
    roundPhotos: true,
    navBar: "bg-[#f7f1e8]/95 text-[#5c4638] border-[#e6d9cc]",
    navConfirm: "rounded-full bg-[#5c4638] px-3 py-2 text-[11px] tracking-[0.16em] uppercase text-[#f7f1e8]",
    bg: "#f7f1e8",
    card: "#fffaf3",
    ink: "#5c4638",
    mute: "#8a746c",
    meta: "#c4a07a",
    frame: "#e6d9cc",
    gold: "#c4a07a",
    overlay: "bg-gradient-to-t from-[rgba(60,40,28,0.72)] via-[rgba(60,40,28,0.12)] to-[rgba(255,250,240,0.2)]",
    palettes: [
      { id: "areia", name: "Areia", color: "#c4a07a" },
      { id: "mar", name: "Mar", color: "#5a7a8a" },
      { id: "concha", name: "Concha", color: "#d4b8a0" },
      { id: "tinta", name: "Tinta", color: "#5c4638" },
    ],
  },
  {
    id: "serra",
    name: "Serra",
    description: "Madeira, montanha, lareira acesa.",
    defaultColor: "#6b4a3a",
    fontClass: "font-baskerville",
    preview: "/photos/mesa.jpg",
    layout: "split",
    nameStyle: "serif",
    splash: false,
    roundPhotos: false,
    navBar: "bg-[#2a1c14]/95 text-[#f0e4d4] border-[#6b4a3a]/40",
    navConfirm: "bg-[#c4a574] px-3 py-2 text-[11px] tracking-[0.16em] uppercase text-[#2a1c14]",
    bg: "#f0e4d4",
    card: "#faf3ea",
    ink: "#2a1c14",
    mute: "#6b5344",
    meta: "#6b4a3a",
    frame: "#d4c0a8",
    gold: "#6b4a3a",
    overlay: "bg-[rgba(42,28,20,0.15)]",
    palettes: [
      { id: "terra", name: "Terra", color: "#6b4a3a" },
      { id: "pinho", name: "Pinho", color: "#3d4a38" },
      { id: "ouro", name: "Ouro", color: "#c4a574" },
      { id: "vinho", name: "Vinho", color: "#7a3e48" },
    ],
  },
  {
    id: "vintage",
    name: "Retrato",
    description: "Sépia, álbum da vovó, carta antiga.",
    defaultColor: "#8b5a3c",
    fontClass: "font-papel",
    preview: "/photos/casal.jpg",
    layout: "card",
    nameStyle: "script",
    splash: true,
    roundPhotos: false,
    navBar: "bg-[#f3e6d0]/95 text-[#4a3224] border-[#d2b48c]",
    navConfirm: "border border-[#8b5a3c] px-3 py-2 text-[11px] tracking-[0.18em] uppercase",
    bg: "#e8d5b5",
    card: "#faf1e1",
    ink: "#4a3224",
    mute: "#6b4e3a",
    meta: "#8b5a3c",
    frame: "#d2b48c",
    gold: "#8b5a3c",
    overlay: "bg-[rgba(80,50,20,0.28)]",
    palettes: [
      { id: "sepia", name: "Sépia", color: "#8b5a3c" },
      { id: "vinho", name: "Vinho", color: "#7a3e48" },
      { id: "tinta", name: "Tinta", color: "#3b2f28" },
      { id: "ouro", name: "Ouro", color: "#c4a574" },
    ],
  },
  {
    id: "moderno",
    name: "Linha",
    description: "Branco, ar, letra limpa.",
    defaultColor: "#292524",
    fontClass: "font-outfit",
    preview: "/photos/noiva.jpg",
    layout: "stack",
    nameStyle: "outfit",
    splash: false,
    roundPhotos: false,
    navBar: "bg-white/95 text-[#292524] border-black/10",
    navConfirm: "bg-[#292524] px-3 py-2 text-[11px] tracking-[0.14em] uppercase text-white",
    bg: "#ffffff",
    card: "#fafafa",
    ink: "#292524",
    mute: "#78716c",
    meta: "#a8a29e",
    frame: "#e7e5e4",
    gold: "#292524",
    overlay: "bg-white/10",
    palettes: [
      { id: "preto", name: "Preto", color: "#292524" },
      { id: "vinho", name: "Vinho", color: "#7a3e48" },
      { id: "sage", name: "Sage", color: "#5c7a5c" },
      { id: "ouro", name: "Ouro", color: "#c4a574" },
    ],
  },
  {
    id: "tropical",
    name: "Tropicália",
    description: "Coral, palmeira, festa quente.",
    defaultColor: "#c45c4a",
    fontClass: "font-costa",
    preview: "/photos/buque.jpg",
    layout: "bleed",
    nameStyle: "serif",
    splash: false,
    roundPhotos: true,
    navBar: "bg-[#2a1210]/95 text-[#fde8dc] border-[#c45c4a]/30",
    navConfirm: "rounded-full bg-[#c45c4a] px-3 py-2 text-[11px] tracking-[0.16em] uppercase text-white",
    bg: "#fff5f0",
    card: "#fff8f4",
    ink: "#3a1c18",
    mute: "#8a5c54",
    meta: "#c45c4a",
    frame: "#f0d4cc",
    gold: "#c45c4a",
    overlay: "bg-gradient-to-t from-[rgba(50,16,12,0.78)] via-[rgba(50,16,12,0.18)] to-[rgba(50,16,12,0.22)]",
    palettes: [
      { id: "coral", name: "Coral", color: "#c45c4a" },
      { id: "folha", name: "Folha", color: "#2f6b4f" },
      { id: "sol", name: "Sol", color: "#e0a050" },
      { id: "vinho", name: "Vinho", color: "#7a3e48" },
    ],
  },
  {
    id: "capela",
    name: "Capela",
    description: "Altar, cinzel, silêncio sagrado.",
    defaultColor: "#9a7b4f",
    fontClass: "font-cinzel",
    preview: "/photos/altar.jpg",
    layout: "void",
    nameStyle: "cinzel",
    splash: false,
    roundPhotos: false,
    navBar: "bg-[#f7f1e6]/95 text-[#3b2f24] border-[#d7c4aa]",
    navConfirm: "border border-[#9a7b4f] px-3 py-2 text-[11px] tracking-[0.2em] uppercase",
    bg: "#f7f1e6",
    card: "#fffdf8",
    ink: "#3b2f24",
    mute: "#6b5a48",
    meta: "#9a7b4f",
    frame: "#d7c4aa",
    gold: "#9a7b4f",
    overlay: "bg-[rgba(247,241,230,0.58)]",
    palettes: [
      { id: "ouro", name: "Ouro", color: "#9a7b4f" },
      { id: "vinho", name: "Vinho", color: "#7a3e48" },
      { id: "tinta", name: "Tinta", color: "#3b2f24" },
      { id: "marfim", name: "Marfim", color: "#c4b496" },
    ],
  },
];

const THEME_BY_ID = Object.fromEntries(THEMES.map((t) => [t.id, t])) as Record<
  TemplateId,
  ThemeSpec
>;

export const TEMPLATES: TemplateMeta[] = THEMES.map(
  ({ id, name, description, defaultColor, fontClass, preview }) => ({
    id,
    name,
    description,
    defaultColor,
    fontClass,
    preview,
  }),
);

export function isTemplateId(value: string | null | undefined): value is TemplateId {
  return Boolean(value) && (TEMPLATE_IDS as readonly string[]).includes(value as string);
}

export function themeFor(id: TemplateId | string): ThemeSpec {
  if (isTemplateId(id)) return THEME_BY_ID[id];
  return THEME_BY_ID.classic;
}

export function skinFor(id: TemplateId): WeddingSkin {
  return themeFor(id).id;
}

export function palettesFor(id: TemplateId): Palette[] {
  return themeFor(id).palettes;
}

export function getTemplate(id: TemplateId | string): TemplateMeta {
  return themeFor(id);
}

export function demoPath(id: TemplateId): string {
  if (id === "classic") return "/demo";
  if (id === "garden") return "/demo/jardim";
  if (id === "minimal") return "/demo/minimal";
  return `/demo/t/${id}`;
}

export function themeVars(theme: ThemeSpec): CSSProperties {
  return {
    "--wed-bg": theme.bg,
    "--wed-card": theme.card,
    "--wed-ink": theme.ink,
    "--wed-mute": theme.mute,
    "--wed-meta": theme.meta,
    "--wed-frame": theme.frame,
    "--wed-gold": theme.gold,
  } as CSSProperties;
}

export function mapsLinks(address?: string, mapsUrl?: string) {
  const q = encodeURIComponent(address ?? "");
  const google =
    mapsUrl || (address ? `https://maps.google.com/?q=${q}` : undefined);
  const waze = address ? `https://waze.com/ul?q=${q}` : undefined;
  return { google, waze };
}

export function countdownLine(days: number) {
  if (days <= 0) return "É hoje";
  if (days === 1) return "Falta 1 dia";
  return `Faltam ${days} dias`;
}

export const GIFT_INTRO =
  "A presença de vocês já é o presente. Se quiserem nos presentear, escolham uma cota — lua de mel, casa ou um jantar nosso. O valor chega via PIX, com carinho e sem constrangimento.";
