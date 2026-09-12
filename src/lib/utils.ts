import type { TemplateId } from "./constants";
import type { SiteContent } from "./types";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  defaultColor: string;
  fontClass: string;
  preview: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "classic",
    name: "Papel",
    description: "Convite em papel, cerimônia clássica.",
    defaultColor: "#7a3e48",
    fontClass: "font-papel",
    preview: "/photos/altar.jpg",
  },
  {
    id: "garden",
    name: "Costa",
    description: "Praia, sal, luz de fim de tarde.",
    defaultColor: "#c4a574",
    fontClass: "font-costa",
    preview: "/photos/jardim.jpg",
  },
  {
    id: "minimal",
    name: "Noite",
    description: "Preto, ouro, festa à noite.",
    defaultColor: "#c9a962",
    fontClass: "font-noite",
    preview: "/photos/beijo.jpg",
  },
];

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

export function getTemplate(id: TemplateId) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
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
