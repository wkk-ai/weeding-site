export const PLAN_KEY = "nossocasamento.planejar.v2";

export type Rite = "civil" | "igreja" | "os dois";
export type PlanScreen =
  | "rua"
  | "criar"
  | "convidado"
  | "rsvp"
  | "endereco"
  | "hoje"
  | "site"
  | "gente"
  | "grana"
  | "tarefas"
  | "mesas"
  | "hotel"
  | "papel"
  | "mais"
  | "assessora"
  | "roteiro"
  | "caderno"
  | "zap";

export type Face = "jardim" | "noite" | "papel" | "costa";

export interface PlanGuest {
  id: string;
  name: string;
  status: "pending" | "confirmed" | "declined";
  meal: string;
  events: string[];
  plusOne: string;
  partySize: number;
  table: number | null;
  address: string;
}

export interface PlanTask {
  id: string;
  title: string;
  hint: string;
  done: boolean;
}

export interface PlanQuote {
  name: string;
  perHead: number;
}

export interface PlanNote {
  who: string;
  text: string;
}

export interface PlanState {
  version: 1;
  p1: string;
  p2: string;
  date: string;
  city: string;
  rite: Rite;
  guestsTarget: number;
  budget: number;
  perHead: number;
  pixReceived: number;
  face: Face;
  assessora: boolean;
  assessoraNome: string;
  step: number;
  guests: PlanGuest[];
  tasks: PlanTask[];
  quotes: PlanQuote[];
  notes: PlanNote[];
  hotels: { name: string; price: number; rooms: number }[];
  updatedAt: string;
}

export const COUPLE_SCREENS: PlanScreen[] = [
  "hoje",
  "site",
  "gente",
  "grana",
  "tarefas",
  "mesas",
  "hotel",
  "papel",
  "mais",
  "assessora",
  "roteiro",
  "caderno",
  "zap",
];

export const RAIL_MORE: PlanScreen[] = ["hotel", "papel", "roteiro", "caderno", "zap", "assessora"];

export function money(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function monthsUntil(date: string) {
  if (!date) return 11;
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1);
  const now = new Date();
  return Math.max(
    0,
    (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()),
  );
}

export function heads(guests: PlanGuest[]) {
  return guests
    .filter((g) => g.status === "confirmed")
    .reduce((s, g) => s + Math.max(1, g.partySize), 0);
}

export function buffetOf(s: PlanState) {
  return heads(s.guests) * s.perHead;
}

export function emptyPlan(): PlanState {
  return {
    version: 1,
    p1: "",
    p2: "",
    date: "2027-08-14",
    city: "São Paulo",
    rite: "os dois",
    guestsTarget: 120,
    budget: 180000,
    perHead: 280,
    pixReceived: 0,
    face: "jardim",
    assessora: false,
    assessoraNome: "Helena",
    step: 0,
    guests: [],
    tasks: [
      { id: "venue", title: "Fechar o espaço", hint: "WhatsApp agora, não depois.", done: false },
      { id: "quotes", title: "Pedir três orçamentos de buffet", hint: "Cola o nome. Sem vitrine.", done: false },
      { id: "docs", title: "Documentos do rito", hint: "Muda se for civil, igreja ou os dois.", done: false },
      { id: "site", title: "Escolher a cara do site", hint: "Quatro fotos. Uma cara.", done: false },
    ],
    quotes: [
      { name: "", perHead: 0 },
      { name: "", perHead: 0 },
      { name: "", perHead: 0 },
    ],
    notes: [],
    hotels: [
      { name: "Hotel no centro", price: 0, rooms: 10 },
      { name: "Hotel perto da igreja", price: 0, rooms: 8 },
    ],
    updatedAt: "2026-09-20T00:00:00.000Z",
  };
}

export function demoPlan(): PlanState {
  const base = emptyPlan();
  return {
    ...base,
    p1: "Marina",
    p2: "Thiago",
    pixReceived: 3480,
    face: "jardim",
    tasks: base.tasks.map((t) => (t.id === "site" ? { ...t, done: true, hint: "Já feito neste aparelho." } : t)),
    quotes: [
      { name: "Casa Vila", perHead: 268 },
      { name: "Jardim Europa", perHead: 310 },
      { name: "Salão da tia", perHead: 190 },
    ],
    notes: [
      { who: "Thiago", text: "A música do pai entra depois da assinatura." },
      { who: "Marina", text: "Não esquece o buquê da vovó na primeira fila." },
    ],
    hotels: [
      { name: "Hotel Fasano, Jardins", price: 890, rooms: 12 },
      { name: "Ibis Budget Paulista", price: 280, rooms: 20 },
    ],
    guests: [
      {
        id: "helena",
        name: "Helena Costa",
        status: "confirmed",
        meal: "carne",
        events: ["igreja", "festa"],
        plusOne: "",
        partySize: 1,
        table: 1,
        address: "Rua Harmonia, 100",
      },
      {
        id: "rafael",
        name: "Rafael Lima",
        status: "pending",
        meal: "",
        events: [],
        plusOne: "",
        partySize: 1,
        table: null,
        address: "",
      },
      {
        id: "joao",
        name: "Primo João",
        status: "pending",
        meal: "",
        events: [],
        plusOne: "",
        partySize: 1,
        table: null,
        address: "",
      },
      {
        id: "lucia",
        name: "Tia Lúcia",
        status: "confirmed",
        meal: "peixe",
        events: ["festa"],
        plusOne: "Carlos e Ana",
        partySize: 3,
        table: 1,
        address: "",
      },
    ],
  };
}

export function estimatePerHead(city: string) {
  const c = city.toLowerCase();
  if (c.includes("são paulo") || c.includes("sao paulo")) return 280;
  if (c.includes("rio")) return 260;
  if (c.includes("belo horizonte")) return 230;
  return 220;
}

export function guestsToCsv(guests: PlanGuest[]) {
  const header = "Nome,Status,Comida,Eventos,Mesa,Endereço,Acompanhante,Tamanho";
  const rows = guests.map((g) =>
    [g.name, g.status, g.meal, g.events.join(" "), g.table ?? "", g.address, g.plusOne, g.partySize]
      .map((v) => `"${String(v).replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header, ...rows].join("\n");
}

export function parseGuestCsv(text: string): PlanGuest[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const start = lines[0].toLowerCase().includes("nome") ? 1 : 0;
  const out: PlanGuest[] = [];
  for (let i = start; i < lines.length; i++) {
    const cols = lines[i].match(/("([^"]|"")*"|[^,]+)/g)?.map((c) => c.replace(/^"|"$/g, "").replaceAll('""', '"').trim()) ?? [];
    if (!cols[0]) continue;
    const status = cols[1] === "confirmed" || cols[1] === "declined" ? cols[1] : "pending";
    out.push({
      id: `csv-${i}-${cols[0].toLowerCase().replace(/\s+/g, "-")}`,
      name: cols[0],
      status,
      meal: cols[2] || "",
      events: cols[3] ? cols[3].split(/\s+/).filter(Boolean) : [],
      table: cols[4] ? Number(cols[4]) || null : null,
      address: cols[5] || "",
      plusOne: cols[6] || "",
      partySize: Number(cols[7]) || 1,
    });
  }
  return out;
}

export function loadPlan(): PlanState {
  if (typeof window === "undefined") return emptyPlan();
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (!raw) return emptyPlan();
    const parsed = JSON.parse(raw) as PlanState;
    if (parsed.version !== 1) return emptyPlan();
    return { ...emptyPlan(), ...parsed, guests: parsed.guests?.length ? parsed.guests : emptyPlan().guests };
  } catch {
    return emptyPlan();
  }
}

export function savePlan(state: PlanState) {
  if (typeof window === "undefined") return;
  const next = { ...state, updatedAt: new Date().toISOString() };
  localStorage.setItem(PLAN_KEY, JSON.stringify(next));
}

export function recordRsvp(input: {
  name: string;
  meal?: string;
  events?: string[];
  plusOne?: string;
  partySize?: number;
  declined?: boolean;
}) {
  const plan = loadPlan();
  const existing = plan.guests.find(
    (g) => g.name.toLowerCase() === input.name.trim().toLowerCase(),
  );
  if (existing) {
    existing.status = input.declined ? "declined" : "confirmed";
    existing.meal = input.meal || existing.meal;
    existing.events = input.events?.length ? input.events : existing.events;
    existing.plusOne = input.plusOne || existing.plusOne;
    existing.partySize = input.partySize || existing.partySize;
  } else {
    plan.guests.unshift({
      id: `g-${Date.now()}`,
      name: input.name.trim(),
      status: input.declined ? "declined" : "confirmed",
      meal: input.meal || "",
      events: input.events ?? [],
      plusOne: input.plusOne || "",
      partySize: input.partySize || 1,
      table: null,
      address: "",
    });
  }
  savePlan(plan);
  return plan;
}

export function docsTaskTitle(rite: Rite) {
  if (rite === "civil") return "Documentos do cartório";
  if (rite === "igreja") return "Documentos da igreja";
  return "Documentos do civil e da igreja";
}

export function nextAction(plan: PlanState): PlanTask {
  return plan.tasks.find((t) => !t.done) ?? plan.tasks[plan.tasks.length - 1];
}

export function faceFile(face: Face) {
  if (face === "noite") return "/photos/altar.jpg";
  if (face === "papel") return "/photos/flores.jpg";
  if (face === "costa") return "/photos/beijo.jpg";
  return "/photos/jardim.jpg";
}
