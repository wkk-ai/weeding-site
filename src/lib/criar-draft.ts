import { asset } from "./assets";
import { defaultSiteContent, slugify } from "./utils";
import type { SiteContent, Tenant } from "./types";
import type { TemplateId } from "./constants";

export const CRIAR_KEY = "nossocasamento.criar.v1";

export interface CriarCouple {
  partner1: string;
  partner2: string;
  weddingDate: string;
  slug: string;
}

export interface CriarDraft {
  version: 1;
  couple: CriarCouple;
  site: {
    templateId: TemplateId;
    themeColor: string;
    paletteId: string;
  };
  content: SiteContent;
  splashSeen: boolean;
  updatedAt: string;
}

export function emptyDraft(): CriarDraft {
  return {
    version: 1,
    couple: {
      partner1: "",
      partner2: "",
      weddingDate: "",
      slug: "",
    },
    site: {
      templateId: "classic",
      themeColor: "#7a3e48",
      paletteId: "vinho",
    },
    content: {
      ...defaultSiteContent(),
      heroSubtitle: "",
      story: "",
      travel: "",
      dressCode: "",
      registryMessage: "",
      coverPhotoUrl: asset("/photos/ensaio.jpg"),
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
    },
    splashSeen: false,
    updatedAt: new Date().toISOString(),
  };
}

export function loadDraft(): CriarDraft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = localStorage.getItem(CRIAR_KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as CriarDraft;
    if (parsed.version !== 1) return emptyDraft();
    return {
      ...emptyDraft(),
      ...parsed,
      content: { ...emptyDraft().content, ...parsed.content },
      couple: { ...emptyDraft().couple, ...parsed.couple },
      site: { ...emptyDraft().site, ...parsed.site },
    };
  } catch {
    return emptyDraft();
  }
}

export function saveDraft(draft: CriarDraft) {
  if (typeof window === "undefined") return;
  const next = { ...draft, updatedAt: new Date().toISOString() };
  localStorage.setItem(CRIAR_KEY, JSON.stringify(next));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CRIAR_KEY);
}

export function tenantFromDraft(draft: CriarDraft): Tenant {
  const p1 = draft.couple.partner1 || "Maria";
  const p2 = draft.couple.partner2 || "João";
  const date = draft.couple.weddingDate || "2026-11-14";
  const slug = draft.couple.slug || slugify(`${p1}-${p2}`) || "maria-e-joao";
  return {
    id: "draft",
    user_id: "draft",
    slug,
    partner1_name: p1,
    partner2_name: p2,
    wedding_date: date,
    plan: "essential",
    plan_paid_at: null,
    published: false,
    password_hash: null,
    asaas_wallet_id: null,
    pix_key: null,
    site_password: null,
    created_at: draft.updatedAt,
    updated_at: draft.updatedAt,
  };
}

export async function fileToPreviewDataUrl(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("heavy");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("type");
  }

  const bitmap = await createImageBitmap(file);
  const max = 1400;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("type");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.72);
}
