import type { SiteContent } from "./types";

export type { TemplateMeta } from "./wedding-theme";
export { TEMPLATES, getTemplate } from "./wedding-theme";

export function defaultSiteContent(): SiteContent {
  return {
    heroSubtitle: "Estamos muito felizes em compartilhar este momento com vocês",
    story:
      "Nossa história começou de um jeito especial e agora queremos celebrar com as pessoas que amamos.",
    ceremony: {
      title: "Cerimônia",
      date: "",
      time: "16:00",
      venue: "",
      address: "",
    },
    reception: {
      title: "Recepção",
      date: "",
      time: "18:00",
      venue: "",
      address: "",
    },
    travel: "",
    dressCode: "",
    gallery: [],
    registryMessage:
      "Sua presença é o melhor presente! Se desejar nos presentear, confira nossa lista.",
    coverPhotoUrl: "",
    bridePhotoUrl: "",
    groomPhotoUrl: "",
    padrinhos: [],
    timeline: [],
    thankYouMessage: "Obrigado por celebrar conosco.",
    musicNote: "",
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

const MONTHS_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const month = MONTHS_PT[Number(m) - 1];
  if (!month) return dateStr;
  return `${Number(d)} de ${month} de ${y}`;
}

export function coupleDisplayName(p1: string, p2: string): string {
  return `${p1} e ${p2}`;
}
