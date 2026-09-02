export const PLANS = {
  free: {
    id: "free" as const,
    name: "Grátis",
    price: 0,
    giftFeePercent: 3.29,
    maxGuests: 80,
    maxPhotos: 20,
    branding: true,
    customSubdomain: false,
    customDomain: false,
    passwordProtection: false,
    hostingMonths: 6,
  },
  essential: {
    id: "essential" as const,
    name: "Essencial",
    price: 49,
    giftFeePercent: 2.49,
    maxGuests: 150,
    maxPhotos: 100,
    branding: false,
    customSubdomain: true,
    customDomain: false,
    passwordProtection: false,
    hostingMonths: 12,
  },
  complete: {
    id: "complete" as const,
    name: "Completo",
    price: 99,
    giftFeePercent: 1.99,
    maxGuests: 500,
    maxPhotos: 999,
    branding: false,
    customSubdomain: true,
    customDomain: true,
    passwordProtection: true,
    hostingMonths: 12,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const ARCHIVE_PRICE_CENTS = 3990;

export const ARCHIVE_PRICE = 39.9;

export const TEMPLATE_IDS = ["classic", "garden", "minimal"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const CARD_SURCHARGE_PERCENT = 2.0;

export const CONTACT_WHATSAPP = "5511912345678";
export const CONTACT_EMAIL = "ola@nossocasamento.com.br";
export const CONTACT_PRIVACY = "privacidade@nossocasamento.com.br";
export const INSTAGRAM_URL = "https://instagram.com/nossocasamento";
