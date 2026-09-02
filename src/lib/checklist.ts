import type { SiteContent, Tenant } from "./types";

export function siteBaseFor(slug: string, override?: string) {
  return override ?? `/s/${slug}`;
}

export function isWeddingOver(date: string) {
  if (!date) return false;
  const [y, m, d] = date.split("-").map(Number);
  const end = new Date(y, (m || 1) - 1, d || 1, 23, 59, 59);
  return Date.now() > end.getTime();
}

export function checklistItems(opts: {
  content: SiteContent | null;
  giftCount: number;
  pixKey: string | null;
  partner1: string;
  partner2: string;
}) {
  const c = opts.content;
  const venueOk =
    Boolean(c?.ceremony?.venue) &&
    c?.ceremony?.venue !== "Local da cerimônia";
  const photoOk = Boolean(c?.coverPhotoUrl || c?.bridePhotoUrl || (c?.gallery?.length ?? 0) > 0);
  return [
    { id: "photo", label: "Foto do casal na capa", done: photoOk },
    { id: "place", label: "Local da cerimônia", done: venueOk },
    { id: "gifts", label: "Pelo menos um presente", done: opts.giftCount > 0 },
    { id: "pix", label: "Chave PIX para receber", done: Boolean(opts.pixKey) },
    { id: "names", label: "Nomes do casal", done: Boolean(opts.partner1 && opts.partner2) },
  ];
}

export function emptyTenantFallback(): Pick<Tenant, "partner1_name" | "partner2_name" | "wedding_date" | "slug"> {
  return {
    partner1_name: "",
    partner2_name: "",
    wedding_date: "",
    slug: "",
  };
}
