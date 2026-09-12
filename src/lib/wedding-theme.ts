import type { TemplateId } from "./constants";

export type WeddingSkin = "papel" | "costa" | "noite";

export const TEMPLATE_SKIN: Record<TemplateId, WeddingSkin> = {
  classic: "papel",
  garden: "costa",
  minimal: "noite",
};

export interface Palette {
  id: string;
  name: string;
  color: string;
}

export const PALETTES: Record<TemplateId, Palette[]> = {
  classic: [
    { id: "vinho", name: "Vinho", color: "#7a3e48" },
    { id: "ouro", name: "Ouro", color: "#c4a574" },
    { id: "tinta", name: "Tinta", color: "#3b2f28" },
    { id: "areia", name: "Areia", color: "#b08968" },
  ],
  garden: [
    { id: "ouro", name: "Ouro", color: "#c4a574" },
    { id: "folha", name: "Folha", color: "#5c7a5c" },
    { id: "dusk", name: "Dusk", color: "#2a1c18" },
    { id: "areia", name: "Areia", color: "#c49a8a" },
  ],
  minimal: [
    { id: "ouro", name: "Ouro", color: "#c9a962" },
    { id: "creme", name: "Creme", color: "#eadcc6" },
    { id: "bronze", name: "Bronze", color: "#b08968" },
    { id: "noite", name: "Noite", color: "#c9a962" },
  ],
};

export function skinFor(id: TemplateId): WeddingSkin {
  return TEMPLATE_SKIN[id];
}

export function palettesFor(id: TemplateId): Palette[] {
  return PALETTES[id];
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
