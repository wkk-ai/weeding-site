import { WeddingSiteView } from "@/components/wedding/wedding-site";
import type { SiteContent, Tenant } from "@/lib/types";

const demoTenant: Tenant = {
  id: "demo",
  user_id: "demo",
  slug: "maria-e-joao",
  partner1_name: "Maria",
  partner2_name: "João",
  wedding_date: "2026-11-14",
  plan: "essential",
  plan_paid_at: null,
  published: true,
  password_hash: null,
  asaas_wallet_id: null,
  pix_key: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const demoContent: SiteContent = {
  heroSubtitle: "Estamos muito felizes em compartilhar este momento com vocês",
  story:
    "Nos conhecemos em 2019 e, desde então, construímos uma história cheia de risadas, viagens e sonhos. Agora queremos celebrar esse novo capítulo com quem faz parte da nossa vida.",
  ceremony: {
    title: "Cerimônia",
    date: "2026-11-14",
    time: "16:00",
    venue: "Igreja Nossa Senhora da Paz",
    address: "Rua das Flores, 120 — São Paulo, SP",
  },
  reception: {
    title: "Recepção",
    date: "2026-11-14",
    time: "18:30",
    venue: "Espaço Jardim Encantado",
    address: "Av. Paulista, 1000 — São Paulo, SP",
  },
  travel:
    "Hotéis próximos com desconto:\n• Hotel Aurora — código CASALMARIAJOAO\n• Pousada do Centro — 10 min do local",
  dressCode: "Traje social — evite branco",
  gallery: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    },
  ],
  registryMessage: "Sua presença é o melhor presente! Se quiser nos presentear, veja a lista.",
};

export default function DemoPage() {
  return (
    <WeddingSiteView
      tenant={demoTenant}
      templateId="classic"
      themeColor="#8b5a6b"
      content={demoContent}
      showBranding={false}
    />
  );
}
