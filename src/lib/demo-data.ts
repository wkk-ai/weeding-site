import { asset } from "./assets";
import type { DemoGift, SiteContent, Tenant } from "./types";

export const demoTenant: Tenant = {
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
  pix_key: "maria.joao@nossocasamento.com.br",
  site_password: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoContent: SiteContent = {
  heroSubtitle: "O dia mais esperado da nossa história.",
  story:
    "Nos conhecemos em 2019, numa festa de amigos em São Paulo. Desde então foram viagens, café da manhã preguiçoso e a certeza de que queríamos celebrar com quem a gente ama. Este site é o nosso convite — e um pedaço da nossa casa, aberto para vocês.",
  ceremony: {
    title: "Cerimônia",
    date: "2026-11-14",
    time: "16:00",
    venue: "Igreja Nossa Senhora da Paz",
    address: "Rua das Flores, 120 — São Paulo, SP",
    mapsUrl: "https://maps.google.com/?q=Igreja+Nossa+Senhora+da+Paz+Sao+Paulo",
  },
  reception: {
    title: "Recepção",
    date: "2026-11-14",
    time: "18:30",
    venue: "Espaço Jardim Encantado",
    address: "Av. Paulista, 1000 — São Paulo, SP",
    mapsUrl: "https://maps.google.com/?q=Av+Paulista+1000+Sao+Paulo",
  },
  travel:
    "Hotéis próximos com desconto:\n• Hotel Aurora — código CASALMARIAJOAO\n• Pousada do Centro — 10 min do local",
  dressCode: "Traje social — evite branco",
  coverPhotoUrl: asset("/photos/ensaio.jpg"),
  bridePhotoUrl: asset("/photos/noiva.jpg"),
  groomPhotoUrl: asset("/photos/casal.jpg"),
  gallery: [
    { id: "1", url: asset("/photos/altar.jpg"), caption: "O altar" },
    { id: "2", url: asset("/photos/buque.jpg"), caption: "O buquê" },
    { id: "3", url: asset("/photos/jardim.jpg"), caption: "O jardim" },
    { id: "4", url: asset("/photos/festa.jpg"), caption: "A festa" },
    { id: "5", url: asset("/photos/mesa.jpg"), caption: "A mesa" },
    { id: "6", url: asset("/photos/risos.jpg"), caption: "Os risos" },
  ],
  padrinhos: [
    { id: "p1", name: "Ana e Pedro", role: "Padrinhos", photoUrl: asset("/photos/flores.jpg") },
    { id: "p2", name: "Luísa e Rafael", role: "Padrinhos", photoUrl: asset("/photos/beijo.jpg") },
    { id: "p3", name: "Clara", role: "Madrinha", photoUrl: asset("/photos/noiva.jpg") },
  ],
  timeline: [
    { id: "t1", time: "15:30", title: "Chegada", description: "Música baixa, abraços e um brinde." },
    { id: "t2", time: "16:00", title: "Cerimônia", description: "Na Igreja Nossa Senhora da Paz." },
    { id: "t3", time: "18:30", title: "Recepção", description: "Jantar, pista e o bolo." },
    { id: "t4", time: "22:00", title: "Festa", description: "Até o último forró." },
  ],
  registryMessage: "Sua presença é o melhor presente. Se quiser nos ajudar a começar, a lista está aqui — PIX na hora.",
  thankYouMessage:
    "Obrigado por estar com a gente. Guardamos cada abraço, cada PIX e cada “sim” como parte do dia.",
  musicNote: "Pedido especial: “Onde anda você” no primeiro baile.",
};

export const demoGifts: DemoGift[] = [
  {
    id: "lua-de-mel",
    title: "Lua de mel",
    description: "Uma noite em Fernando de Noronha",
    price_cents: 120000,
    funded_cents: 40000,
    photo_url: asset("/photos/ensaio.jpg"),
  },
  {
    id: "jantar",
    title: "Jantar para dois",
    description: "O restaurante em que nos pedimos em casamento",
    price_cents: 45000,
    funded_cents: 0,
    photo_url: asset("/photos/mesa.jpg"),
  },
  {
    id: "foto",
    title: "Ensaio do casal",
    description: "As fotos que vão para a parede da sala",
    price_cents: 28000,
    funded_cents: 28000,
    photo_url: asset("/photos/beijo.jpg"),
  },
  {
    id: "festa",
    title: "A festa",
    description: "Open bar da pista",
    price_cents: 80000,
    funded_cents: 15000,
    photo_url: asset("/photos/festa.jpg"),
  },
];

export const DEMO_PIX_CODE =
  "00020126580014BR.GOV.BCB.PIX0136maria.joao@nossocasamento.com.br5204000053039865802BR5925MARIA E JOAO CASAMENTO6009SAO PAULO";
