import type { PlanId, TemplateId } from "./constants";

export type RsvpStatus = "pending" | "confirmed" | "declined";

export type GiftStatus = "active" | "funded" | "hidden";

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "failed"
  | "refunded";

export type PaymentMethod = "pix" | "card";

export interface Tenant {
  id: string;
  user_id: string;
  slug: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string;
  plan: PlanId;
  plan_paid_at: string | null;
  published: boolean;
  password_hash: string | null;
  asaas_wallet_id: string | null;
  pix_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  tenant_id: string;
  template_id: TemplateId;
  theme_color: string;
  content: SiteContent;
  published_at: string | null;
}

export interface SiteContent {
  heroSubtitle?: string;
  story?: string;
  ceremony?: EventBlock;
  reception?: EventBlock;
  travel?: string;
  dressCode?: string;
  gallery: GalleryPhoto[];
  registryMessage?: string;
}

export interface EventBlock {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface Guest {
  id: string;
  tenant_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvp_status: RsvpStatus;
  meal_choice: string | null;
  plus_one: boolean;
  notes: string | null;
  created_at: string;
}

export interface Gift {
  id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  price_cents: number;
  funded_cents: number;
  status: GiftStatus;
  sort_order: number;
}

export interface Transaction {
  id: string;
  tenant_id: string;
  gift_id: string | null;
  guest_name: string;
  guest_email: string | null;
  amount_cents: number;
  platform_fee_cents: number;
  processing_fee_cents: number;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  asaas_payment_id: string | null;
  created_at: string;
}
