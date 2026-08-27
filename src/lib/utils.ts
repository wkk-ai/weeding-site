import type { TemplateId } from "./constants";
import type { SiteContent } from "./types";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  defaultColor: string;
  fontClass: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "classic",
    name: "Clássico",
    description: "Elegante e atemporal, perfeito para cerimônias tradicionais.",
    defaultColor: "#8b5a6b",
    fontClass: "font-serif",
  },
  {
    id: "garden",
    name: "Jardim",
    description: "Tons verdes e naturais para casamentos ao ar livre.",
    defaultColor: "#5c7a5c",
    fontClass: "font-serif",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Limpo e moderno, foco nas fotos e no essencial.",
    defaultColor: "#2d2a26",
    fontClass: "font-sans",
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
      venue: "Local da cerimônia",
      address: "Endereço completo",
    },
    reception: {
      title: "Recepção",
      date: "",
      time: "18:00",
      venue: "Local da festa",
      address: "Endereço completo",
    },
    travel: "Informações de hospedagem e como chegar.",
    dressCode: "Traje social",
    gallery: [],
    registryMessage:
      "Sua presença é o melhor presente! Se desejar nos presentear, confira nossa lista.",
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

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function coupleDisplayName(p1: string, p2: string): string {
  return `${p1} & ${p2}`;
}
