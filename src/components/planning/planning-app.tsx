"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { asset, whatsappShareUrl } from "@/lib/assets";
import {
  COUPLE_SCREENS,
  RAIL_MORE,
  buffetOf,
  docsTaskTitle,
  emptyPlan,
  demoPlan,
  estimatePerHead,
  faceFile,
  guestsToCsv,
  heads,
  loadPlan,
  money,
  monthsUntil,
  nextAction,
  parseGuestCsv,
  savePlan,
  type Face,
  type PlanGuest,
  type PlanScreen,
  type PlanState,
  type Rite,
} from "@/lib/planning";

function fieldCls(bad: boolean, extra = "") {
  return `mt-1 w-full rounded-xl border px-4 py-3 ${bad ? "border-wine ring-2 ring-wine/30" : "border-wine/15"} ${extra}`;
}

const TABS: { id: PlanScreen; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "site", label: "Site" },
  { id: "gente", label: "Gente" },
  { id: "grana", label: "Grana" },
  { id: "mais", label: "Mais" },
];

const ASSESSOR_TABS: { id: PlanScreen; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "gente", label: "Gente" },
  { id: "tarefas", label: "Lista" },
  { id: "roteiro", label: "Dia D" },
  { id: "assessora", label: "Cadeira" },
];

const RAIL: { id: PlanScreen; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "site", label: "Site" },
  { id: "gente", label: "Gente" },
  { id: "grana", label: "Grana" },
  { id: "tarefas", label: "Tarefas" },
  { id: "mesas", label: "Mesas" },
  { id: "mais", label: "Equipe" },
];

const ASSESSOR_RAIL: { id: PlanScreen; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "gente", label: "Gente" },
  { id: "tarefas", label: "Tarefas" },
  { id: "mesas", label: "Mesas" },
  { id: "roteiro", label: "Dia D" },
];

const MAIS = new Set<PlanScreen>(["mais", "tarefas", "mesas", ...RAIL_MORE]);

function railOn(id: PlanScreen, screen: PlanScreen) {
  if (id === screen) return true;
  return id === "mais" && RAIL_MORE.includes(screen);
}

function namesOf(p: PlanState) {
  if (p.p1 && p.p2) return `${p.p1} & ${p.p2}`;
  return p.p1 || p.p2 || "Vocês";
}

function pill(g: PlanGuest) {
  if (g.status === "confirmed") return "sim" + (g.meal ? ` · ${g.meal}` : "");
  if (g.status === "declined") return "não";
  return "espera";
}

export function PlanningApp({
  start = "rua",
  variant = "playground",
}: {
  start?: PlanScreen;
  variant?: "playground" | "account";
}) {
  const [plan, setPlan] = useState<PlanState>(emptyPlan);
  const [screen, setScreen] = useState<PlanScreen>(variant === "account" ? "hoje" : start);
  const [door, setDoor] = useState<"guest" | "couple" | "assessor">(variant === "account" ? "couple" : "couple");
  const [toast, setToast] = useState("");

  const setRole = (next: "guest" | "couple" | "assessor") => {
    setDoor(next);
    if (typeof window !== "undefined") sessionStorage.setItem("nossocasamento.door", next);
  };

  useEffect(() => {
    setPlan(loadPlan());
    const savedDoor = sessionStorage.getItem("nossocasamento.door");
    if (savedDoor === "guest" || savedDoor === "couple" || savedDoor === "assessor") setDoor(savedDoor);
  }, []);

  const doorRef = useRef(door);
  doorRef.current = door;

  const persist = useCallback((next: PlanState) => {
    setPlan(next);
    if (doorRef.current !== "guest") savePlan(next);
  }, []);

  const go = (id: PlanScreen) => setScreen(id);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  const couple = door === "couple" && COUPLE_SCREENS.includes(screen);
  const assessor = door === "assessor" && COUPLE_SCREENS.includes(screen);
  const showChrome = couple || assessor;
  const confirmed = heads(plan.guests);
  const confirmedPeople = plan.guests.filter((g) => g.status === "confirmed").length;
  const waiting = plan.guests.filter((g) => g.status === "pending").length;
  const buffet = buffetOf(plan);
  const months = monthsUntil(plan.date);
  const action = nextAction(plan);
  const usedPct = plan.budget ? Math.min(100, Math.round((buffet / plan.budget) * 100)) : 0;

  const confirmGuest = (id: string, extra?: Partial<PlanGuest>) => {
    const next = {
      ...plan,
      guests: plan.guests.map((g) =>
        g.id === id
          ? {
              ...g,
              status: "confirmed" as const,
              meal: extra?.meal || g.meal || "carne",
              events: extra?.events?.length ? extra.events : g.events.length ? g.events : ["igreja", "festa"],
              partySize: extra?.partySize || g.partySize,
              plusOne: extra?.plusOne ?? g.plusOne,
            }
          : g,
      ),
    };
    persist(next);
    flash(`Confirmado. Buffet agora ${money(buffetOf(next))}.`);
  };

  const joao = plan.guests.find((g) => g.id === "joao");

  return (
    <div
      data-screen={screen}
      data-door={door}
      className={variant === "playground" && screen === "rua" ? "" : "min-h-screen bg-cream"}
    >
      {toast ? (
        <div className="nc-toast fixed left-1/2 top-4 z-50 max-w-md -translate-x-1/2 rounded-xl bg-wine px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div key={screen} className="nc-in">
      {screen === "rua" && (
        <Rua
          startCouple={() => {
            setRole("couple");
            persist({ ...(plan.p1 ? plan : emptyPlan()), step: 0 });
            go("criar");
          }}
          startGuest={() => {
            setRole("guest");
            setPlan(demoPlan());
            go("convidado");
          }}
        />
      )}

      {screen === "criar" && (
        <Criar plan={plan} persist={persist} go={go} />
      )}

      {screen !== "rua" && screen !== "criar" && (
        <div className="mx-auto flex min-h-screen max-w-6xl">
          {showChrome ? (
            <aside className="hidden w-52 shrink-0 border-r border-wine/10 bg-white md:block">
              <p className="border-b border-wine/10 p-5 font-serif text-lg text-wine">
                {namesOf(plan)}
                {assessor ? <span className="mt-1 block text-xs font-sans uppercase tracking-wide text-wine/50">Cadeira da assessora</span> : null}
              </p>
              <nav className="p-3">
                {(assessor ? ASSESSOR_RAIL : RAIL).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    className={`mb-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm ${
                      railOn(item.id, screen)
                        ? "bg-cream font-semibold text-wine"
                        : "text-wine/70 hover:bg-cream"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>
          ) : null}

          <div className="min-w-0 flex-1 pb-24 md:pb-8">
            {screen === "hoje" && (
              <Hoje plan={plan} persist={persist} go={go} months={months} confirmed={confirmed} buffet={buffet} action={action} />
            )}
            {screen === "site" && (
              <Site
                plan={plan}
                go={go}
                asGuest={() => {
                  setRole("guest");
                  go("convidado");
                }}
              />
            )}
            {screen === "gente" && (
              <Gente plan={plan} persist={persist} go={go} confirmGuest={confirmGuest} confirmed={confirmed} confirmedPeople={confirmedPeople} waiting={waiting} />
            )}
            {screen === "grana" && <Grana plan={plan} persist={persist} go={go} buffet={buffet} confirmed={confirmed} usedPct={usedPct} account={variant === "account"} />}
            {screen === "tarefas" && <Tarefas plan={plan} persist={persist} go={go} months={months} />}
            {screen === "mesas" && <Mesas plan={plan} persist={persist} flash={flash} />}
            {screen === "hotel" && (
              <Hotel
                plan={plan}
                go={go}
                door={door}
                previewGuest={() => {
                  setRole("guest");
                  go("convidado");
                }}
              />
            )}
            {screen === "papel" && <Papel plan={plan} persist={persist} />}
            {screen === "mais" && (
              <Mais
                plan={plan}
                go={go}
                account={variant === "account"}
                sitAssessor={() => {
                  persist({ ...plan, assessora: true });
                  setRole("assessor");
                  flash("Helena sentou. Sem Grana, sem PIX.");
                  go("assessora");
                }}
              />
            )}
            {screen === "assessora" && <Assessora plan={plan} go={go} confirmed={confirmed} />}
            {screen === "roteiro" && <Roteiro />}
            {screen === "caderno" && <Caderno plan={plan} persist={persist} />}
            {screen === "zap" && <Zap plan={plan} go={go} months={months} />}
            {screen === "convidado" && (
              <Convidado
                plan={plan}
                go={go}
                backToCouple={() => {
                  setRole("couple");
                  setPlan(loadPlan());
                  go("hoje");
                }}
              />
            )}
            {screen === "rsvp" && (
              <Rsvp plan={plan} go={go} confirmGuest={confirmGuest} joao={joao} flash={flash} />
            )}
            {screen === "endereco" && <Endereco plan={plan} persist={persist} flash={flash} go={go} />}
          </div>
        </div>
      )}
      </div>

      {showChrome ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-wine/10 bg-white md:hidden">
          {(assessor ? ASSESSOR_TABS : TABS).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              className={`flex-1 py-3 text-[11px] ${
                screen === t.id || (t.id === "mais" && MAIS.has(screen)) ? "font-semibold text-wine" : "text-wine/45"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

function Rua({
  startCouple,
  startGuest,
}: {
  startCouple: () => void;
  startGuest: () => void;
}) {
  return (
    <>
      <section className="relative min-h-[88svh] overflow-hidden text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/photos/ensaio.jpg")} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-3xl flex-col justify-end px-4 pb-16">
          <p className="text-xs uppercase tracking-[0.42em] text-[#c4a574]">O convite que o primo abre</p>
          <h1 className="mt-4 font-serif text-5xl italic leading-tight md:text-7xl">Vocês no centro da página.</h1>
          <p className="mt-5 max-w-xl text-lg font-light text-white/90">
            Site, RSVP e PIX. Depois o relógio. Depois a cadeira da assessora.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={startCouple} className="rounded-full bg-[#c4a574] px-8 py-4 font-semibold text-[#2a1c18]">
              Começar em 90 segundos
            </button>
            <button type="button" onClick={startGuest} className="rounded-full border border-white/70 px-8 py-4 font-semibold text-white">
              Abrir o site do convidado
            </button>
            <Link href="/" className="rounded-full border border-white/40 px-8 py-4 font-semibold text-white/80">
              Voltar
            </Link>
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-3">
        {[
          ["01 · o site", "O primo abre e já entende o dia."],
          ["02 · o relógio", "Toda semana, uma tarefa no WhatsApp."],
          ["03 · a cadeira", "A assessora senta no casamento."],
        ].map(([k, t]) => (
          <div key={k} className="border-t border-wine/10 bg-cream px-8 py-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c4a574]">{k}</p>
            <p className="mt-3 font-serif text-2xl italic text-wine">{t}</p>
          </div>
        ))}
      </section>
    </>
  );
}

function Criar({
  plan,
  persist,
  go,
}: {
  plan: PlanState;
  persist: (p: PlanState) => void;
  go: (s: PlanScreen) => void;
}) {
  const step = plan.step;
  const [err, setErr] = useState("");
  const [bad, setBad] = useState<string[]>([]);
  const [shake, setShake] = useState(0);
  const fail = (fields: string[], message: string) => {
    setBad(fields);
    setErr(message);
    setShake((n) => n + 1);
  };
  const next = () => {
    if (step === 0) {
      const miss = [!plan.p1.trim() && "p1", !plan.p2.trim() && "p2"].filter(Boolean) as string[];
      if (miss.length) {
        fail(miss, "Os dois nomes. Sem isso o convite não nasce.");
        return;
      }
    }
    if (step === 1) {
      const miss = [!plan.date && "date", !plan.city.trim() && "city"].filter(Boolean) as string[];
      if (miss.length) {
        fail(miss, "Data e cidade. Os dois.");
        return;
      }
    }
    if (step === 2) {
      const miss = [
        (!plan.guestsTarget || plan.guestsTarget < 1) && "guests",
        (!plan.budget || plan.budget < 1) && "budget",
      ].filter(Boolean) as string[];
      if (miss.length) {
        fail(miss, "Quantos e quanto. Os dois.");
        return;
      }
    }
    setBad([]);
    setErr("");
    if (step < 3) persist({ ...plan, step: step + 1 });
    else go("hoje");
  };
  const back = () => {
    setBad([]);
    setErr("");
    if (step > 0) persist({ ...plan, step: step - 1 });
    else go("rua");
  };
  const patch = (partial: Partial<PlanState>, field: string) => {
    setBad((prev) => prev.filter((x) => x !== field));
    if (err) setErr("");
    persist({ ...plan, ...partial });
  };
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Passo {step + 1} de 4</p>
      <div className="mt-3 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-wine" : "bg-wine/15"}`} />
        ))}
      </div>
      <div key={`${step}-${shake}`} className={err ? "nc-shake" : "nc-in"}>
      {step === 0 && (
        <>
          <h1 className="mt-8 font-serif text-4xl italic text-wine">Como vocês se chamam?</h1>
          <label className="mt-6 block text-xs uppercase tracking-wide text-wine/50">Noiva</label>
          <input
            className={fieldCls(bad.includes("p1"))}
            placeholder="Nome dela"
            value={plan.p1}
            aria-invalid={bad.includes("p1")}
            onChange={(e) => patch({ p1: e.target.value }, "p1")}
          />
          <label className="mt-4 block text-xs uppercase tracking-wide text-wine/50">Noivo</label>
          <input
            className={fieldCls(bad.includes("p2"))}
            placeholder="Nome dele"
            value={plan.p2}
            aria-invalid={bad.includes("p2")}
            onChange={(e) => patch({ p2: e.target.value }, "p2")}
          />
          <p className="mt-3 text-sm text-wine/50">O parceiro entra agora.</p>
        </>
      )}
      {step === 1 && (
        <>
          <h1 className="mt-8 font-serif text-4xl italic text-wine">Quando, onde, qual rito?</h1>
          <label className="mt-6 block text-xs uppercase tracking-wide text-wine/50">Data</label>
          <input
            type="date"
            className={fieldCls(bad.includes("date"))}
            value={plan.date}
            aria-invalid={bad.includes("date")}
            onChange={(e) => patch({ date: e.target.value }, "date")}
          />
          <label className="mt-4 block text-xs uppercase tracking-wide text-wine/50">Cidade</label>
          <input
            className={fieldCls(bad.includes("city"))}
            value={plan.city}
            aria-invalid={bad.includes("city")}
            onChange={(e) => patch({ city: e.target.value, perHead: estimatePerHead(e.target.value) }, "city")}
          />
          <label className="mt-4 block text-xs uppercase tracking-wide text-wine/50">Rito</label>
          <select
            className="mt-1 w-full rounded-xl border border-wine/15 px-4 py-3"
            value={plan.rite}
            onChange={(e) => {
              const rite = e.target.value as Rite;
              persist({
                ...plan,
                rite,
                tasks: plan.tasks.map((t) => (t.id === "docs" ? { ...t, title: docsTaskTitle(rite) } : t)),
              });
            }}
          >
            <option value="civil">civil</option>
            <option value="igreja">igreja</option>
            <option value="os dois">os dois</option>
          </select>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="mt-8 font-serif text-4xl italic text-wine">Quantos. Quanto.</h1>
          <label className="mt-6 block text-xs uppercase tracking-wide text-wine/50">Convidados</label>
          <input
            type="number"
            min={1}
            className={fieldCls(bad.includes("guests"))}
            value={plan.guestsTarget || ""}
            aria-invalid={bad.includes("guests")}
            onChange={(e) => patch({ guestsTarget: Number(e.target.value) }, "guests")}
          />
          <label className="mt-4 block text-xs uppercase tracking-wide text-wine/50">Teto</label>
          <input
            type="number"
            min={1}
            className={fieldCls(bad.includes("budget"))}
            value={plan.budget || ""}
            aria-invalid={bad.includes("budget")}
            onChange={(e) => patch({ budget: Number(e.target.value) }, "budget")}
          />
          <p className="mt-3 text-sm text-wine/50">
            Buffet estimado nesta terra: {plan.guestsTarget} × {money(plan.perHead)} = {money(plan.guestsTarget * plan.perHead)}.
          </p>
        </>
      )}
      {step === 3 && (
        <>
          <h1 className="mt-8 font-serif text-4xl italic text-wine">Que cara tem o dia?</h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {(["jardim", "noite", "papel", "costa"] as Face[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => persist({ ...plan, face: f })}
                className={`relative overflow-hidden rounded-xl ${plan.face === f ? "ring-2 ring-[#c4a574]" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(faceFile(f))} alt={f} className="h-24 w-full object-cover" />
                <span className="absolute bottom-2 left-2 text-sm text-white">{f}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {err ? (
        <p className="mt-4 text-sm font-semibold text-wine" role="alert" aria-live="polite">
          {err}
        </p>
      ) : null}
      </div>
      <button type="button" onClick={next} className="mt-8 w-full rounded-full bg-[#c4a574] py-4 font-semibold text-[#2a1c18]">
        {step === 3 ? "Abrir o Hoje" : "Continuar"}
      </button>
      <button type="button" onClick={back} className="mt-3 w-full py-2 text-sm font-semibold text-wine/60">
        Voltar
      </button>
    </div>
  );
}

function Hoje({
  plan,
  persist,
  go,
  months,
  confirmed,
  buffet,
  action,
}: {
  plan: PlanState;
  persist: (p: PlanState) => void;
  go: (s: PlanScreen) => void;
  months: number;
  confirmed: number;
  buffet: number;
  action: { id: string; title: string };
}) {
  return (
    <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_.9fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-wine/50">
          {namesOf(plan)}
        </p>
        <p className="mt-1 text-sm text-wine/60">
          faltam {months} meses · {plan.city} · {plan.rite}
        </p>
        <h1 className="mt-4 font-serif text-4xl italic text-wine">{action.title}.</h1>
        <p className="mt-3 max-w-md text-wine/70">Uma ação. O resto espera. Igreja e salão somem primeiro em {plan.city}.</p>
        <button
          type="button"
          onClick={() => {
            persist({ ...plan, tasks: plan.tasks.map((t) => (t.id === action.id ? { ...t, done: true } : t)) });
            go("tarefas");
          }}
          className="mt-6 rounded-full bg-[#c4a574] px-8 py-3 font-semibold text-[#2a1c18]"
        >
          Marcar como feito
        </button>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-wine/50">Lugares no buffet</p>
            <p className="font-serif text-3xl text-wine">{confirmed}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-wine/50">Teto</p>
            <p className="font-serif text-3xl text-wine">{money(plan.budget)}</p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-[#f8efe0] p-3 text-sm text-wine/80">
          Buffet estimado: {money(buffet)} · {confirmed} × {money(plan.perHead)}
        </p>
      </div>
      <div className="hidden md:block">
        <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Os próximos meses</p>
        {[
          ["Set", "Fechar espaço"],
          ["Out", "Três orçamentos"],
          ["Nov", "Link de endereço"],
          ["Dez", "Papel da mesma cara"],
        ].map(([m, t]) => (
          <div key={m} className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <strong className="text-wine">{m}</strong>
            <p className="text-sm text-wine/60">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Site({ plan, go, asGuest }: { plan: PlanState; go: (s: PlanScreen) => void; asGuest: () => void }) {
  return (
    <div>
      <div className="relative h-56 overflow-hidden text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(faceFile(plan.face))} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70" />
        <div className="relative px-6 pt-28">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c4a574]">Modelo {plan.face}</p>
          <h1 className="font-serif text-4xl italic">
            {namesOf(plan)}
          </h1>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <p className="text-wine/70">O editor continua. Não é mais a porta da frente.</p>
        <Link href="/criar" className="inline-block rounded-full bg-[#c4a574] px-5 py-2 text-sm font-semibold text-[#2a1c18]">
          Abrir o editor
        </Link>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={asGuest} className="rounded-full border border-wine/20 px-5 py-2 text-sm font-semibold text-wine">
            Ver como o primo vê
          </button>
          <button type="button" onClick={() => go("papel")} className="rounded-full border border-wine/20 px-5 py-2 text-sm font-semibold text-wine">
            Papel da mesma cara
          </button>
        </div>
      </div>
    </div>
  );
}

function Gente({
  plan,
  persist,
  go,
  confirmGuest,
  confirmed,
  confirmedPeople,
  waiting,
}: {
  plan: PlanState;
  persist: (p: PlanState) => void;
  go: (s: PlanScreen) => void;
  confirmGuest: (id: string) => void;
  confirmed: number;
  confirmedPeople: number;
  waiting: number;
}) {
  const exportCsv = () => {
    const blob = new Blob([guestsToCsv(plan.guests)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "convidados.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const pendingNames = plan.guests.filter((g) => g.status === "pending").map((g) => g.name.split(" ")[0]).join(", ");
  return (
    <div className="grid gap-8 p-6 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Gente</p>
        <h1 className="mt-2 font-serif text-4xl italic text-wine">
          {confirmedPeople} sim · {waiting} calados
        </h1>
        <p className="mt-2 text-wine/70">Quando o primo confirma, o buffet sobe. Agora {confirmed} lugares.</p>
        <ul className="mt-4">
          {plan.guests.map((g) => (
            <li key={g.id} className="flex items-center justify-between border-b border-wine/10 py-3">
              <span>{g.name}</span>
              {g.status === "pending" ? (
                <button type="button" onClick={() => confirmGuest(g.id)} className="rounded-full bg-[#c4a574] px-3 py-1 text-sm font-semibold text-[#2a1c18]">
                  Ele confirmou
                </button>
              ) : (
                <span className="rounded-full bg-sage/15 px-2 py-1 text-[11px] uppercase tracking-wide text-sage">{pill(g)}</span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => go("mesas")} className="rounded-full border border-wine/20 px-5 py-2 text-sm font-semibold text-wine">
            Sentar no salão
          </button>
          <a
            href={whatsappShareUrl(
              `Oi! Faltam 7 dias para confirmar no casamento de ${namesOf(plan)}. Ainda calados: ${pendingNames || "ninguém"}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-wine/20 px-5 py-2 text-sm font-semibold text-wine"
          >
            Prazo aos calados
          </a>
          <button type="button" onClick={exportCsv} className="rounded-full border border-wine/20 px-5 py-2 text-sm font-semibold text-wine">
            Baixar CSV
          </button>
          <label className="cursor-pointer rounded-full border border-wine/20 px-5 py-2 text-sm font-semibold text-wine">
            Trazer planilha
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                void file.text().then((text) => {
                  const extra = parseGuestCsv(text);
                  if (!extra.length) return;
                  persist({
                    ...plan,
                    guests: [
                      ...plan.guests,
                      ...extra.filter((g) => !plan.guests.some((x) => x.name.toLowerCase() === g.name.toLowerCase())),
                    ],
                  });
                });
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
      <div className="hidden rounded-2xl bg-white p-5 shadow-sm md:block">
        <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Ficha</p>
        {plan.guests[2] ? (
          <>
            <h2 className="mt-2 font-serif text-2xl italic text-wine">{plan.guests.find((g) => g.id === "joao")?.name}</h2>
            <p className="mt-3 text-sm text-wine/70">Eventos: {(plan.guests.find((g) => g.id === "joao")?.events.join(", ") || "ainda não")}</p>
            <p className="text-sm text-wine/70">Comida: {plan.guests.find((g) => g.id === "joao")?.meal || "—"}</p>
            <p className="text-sm text-wine/70">Mesa: {plan.guests.find((g) => g.id === "joao")?.table ?? "em pé"}</p>
            <p className="text-sm text-wine/70">Vem com: {plan.guests.find((g) => g.id === "joao")?.plusOne || "sozinho"}</p>
            <button type="button" onClick={() => go("mesas")} className="mt-4 rounded-full border border-wine/20 px-4 py-2 text-sm font-semibold text-wine">
              Sentar no salão
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Grana({
  plan,
  persist,
  go,
  buffet,
  confirmed,
  usedPct,
  account,
}: {
  plan: PlanState;
  persist: (p: PlanState) => void;
  go: (s: PlanScreen) => void;
  buffet: number;
  confirmed: number;
  usedPct: number;
  account?: boolean;
}) {
  return (
    <div className="grid gap-8 p-6 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Grana</p>
        <h1 className="mt-2 font-serif text-4xl italic text-wine">{money(plan.budget)}</h1>
        <p className="text-wine/70">{usedPct}% já no papel. Média {plan.city} 2026.</p>
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-wine/50">Buffet · {confirmed} lugares × {money(plan.perHead)}</p>
          <p className="font-serif text-3xl text-wine">{money(buffet)}</p>
        </div>
        <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-wine/50">Igreja + papel + foto</p>
          <p className="font-serif text-2xl text-wine">{money(42000)}</p>
        </div>
        <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-wine/50">PIX recebido</p>
          <p className="font-serif text-2xl text-wine">{money(plan.pixReceived)}</p>
          <p className="mt-1 text-xs text-wine/50">A assessora não vê esta linha.</p>
        </div>
        <button type="button" onClick={() => go("gente")} className="mt-5 rounded-full bg-[#c4a574] px-6 py-3 font-semibold text-[#2a1c18]">
          Ver quem falta
        </button>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Três orçamentos · buffet</p>
        <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
          {plan.quotes.map((q, i) => (
            <label key={i} className="flex items-center justify-between gap-3 border-b border-wine/10 py-3 last:border-0">
              <input
                className="w-1/2 bg-transparent"
                placeholder="Nome do buffet"
                value={q.name}
                onChange={(e) => {
                  const quotes = plan.quotes.map((x, j) => (j === i ? { ...x, name: e.target.value } : x));
                  persist({ ...plan, quotes });
                }}
              />
              <input
                type="number"
                className="w-24 bg-transparent text-right"
                placeholder="R$"
                value={q.perHead || ""}
                onChange={(e) => {
                  const quotes = plan.quotes.map((x, j) => (j === i ? { ...x, perHead: Number(e.target.value) } : x));
                  persist({ ...plan, quotes });
                }}
              />
            </label>
          ))}
          <p className="mt-3 text-xs text-wine/50">Cola o nome. Sem vitrine de 70 mil.</p>
        </div>
        <Link href={account ? "/app/presentes" : "/demo/presentes"} className="mt-4 inline-block text-sm font-semibold text-wine underline">
          Abrir o PIX da lista
        </Link>
      </div>
    </div>
  );
}

function Tarefas({
  plan,
  persist,
  go,
  months,
}: {
  plan: PlanState;
  persist: (p: PlanState) => void;
  go: (s: PlanScreen) => void;
  months: number;
}) {
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Faltam {months} meses</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">Esta semana</h1>
      <ul className="mt-6 max-w-xl">
        {plan.tasks.map((t) => (
          <li key={t.id} className="flex gap-3 border-b border-dashed border-wine/15 py-4">
            <button
              type="button"
              aria-label={t.done ? "Desmarcar" : "Marcar feito"}
              onClick={() => persist({ ...plan, tasks: plan.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) })}
              className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border border-wine ${t.done ? "bg-wine" : ""}`}
            />
            <div className={t.done ? "text-wine/40 line-through" : ""}>
              <p className="font-semibold text-wine">{t.title}</p>
              <p className="text-sm text-wine/60">{t.hint}</p>
            </div>
          </li>
        ))}
      </ul>
      <a
        href={whatsappShareUrl(`${namesOf(plan)}, faltam ${months} meses. Esta semana: ${plan.tasks.find((t) => !t.done)?.title ?? "respirar"}.`)}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block rounded-full bg-wine px-6 py-3 font-semibold text-white"
      >
        Mandar o zap da semana
      </a>
      <button type="button" onClick={() => go("zap")} className="ml-2 mt-6 rounded-full border border-wine/20 px-6 py-3 font-semibold text-wine">
        Ver o texto
      </button>
      <div className="mt-10 hidden grid-cols-4 gap-3 md:grid">
        {[
          ["Set", "Fechar espaço"],
          ["Out", "Três orçamentos"],
          ["Nov", "Link de endereço"],
          ["Dez", "Papel da mesma cara"],
        ].map(([m, t]) => (
          <div key={m} className="rounded-2xl bg-white p-4 shadow-sm">
            <strong className="text-wine">{m}</strong>
            <p className="text-sm text-wine/60">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Mesas({
  plan,
  persist,
  flash,
}: {
  plan: PlanState;
  persist: (p: PlanState) => void;
  flash: (m: string) => void;
}) {
  const standing = plan.guests.filter((g) => g.status === "confirmed" && g.table == null);
  const tables = [1, 2, 3, 4];
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Mesas</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">{standing.length ? "Quem ainda está em pé." : "O salão está sentado."}</h1>
      <p className="mt-2 text-sm text-wine/60 md:hidden">No celular: a fila. Arrastar o salão pede a tela grande.</p>
      <ul className="mt-4 max-w-xl">
        {plan.guests.map((g) => (
          <li key={g.id} className="flex items-center justify-between border-b border-wine/10 py-3">
            <span>{g.name}</span>
            {g.table ? (
              <span className="rounded-full bg-sage/15 px-2 py-1 text-[11px] uppercase text-sage">mesa {g.table}</span>
            ) : g.status === "confirmed" ? (
              <span className="flex gap-1">
                {tables.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      persist({ ...plan, guests: plan.guests.map((x) => (x.id === g.id ? { ...x, table: n } : x)) });
                      flash(`${g.name.split(" ")[0]} na mesa ${n}.`);
                    }}
                    className="rounded-full bg-[#c4a574] px-2 py-1 text-xs font-semibold text-[#2a1c18]"
                  >
                    {n}
                  </button>
                ))}
              </span>
            ) : (
              <span className="text-xs text-wine/40">espera</span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-8 hidden grid-cols-4 gap-4 md:grid">
        {tables.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              const first = standing[0];
              if (!first) {
                flash("Ninguém em pé. O salão já sentou.");
                return;
              }
              persist({ ...plan, guests: plan.guests.map((x) => (x.id === first.id ? { ...x, table: n } : x)) });
              flash(`${first.name.split(" ")[0]} na mesa ${n}.`);
            }}
            className={`grid aspect-square place-items-center rounded-full border-2 border-dashed border-[#c4a574] p-4 text-center text-sm ${plan.guests.some((g) => g.table === n) ? "bg-[#f4ece4]" : ""}`}
          >
            Mesa {n}
            <br />
            {plan.guests
              .filter((g) => g.table === n)
              .map((g) => g.name.split(" ")[0])
              .join(", ") || "clique, senta o próximo"}
          </button>
        ))}
      </div>
    </div>
  );
}

function Hotel({
  plan,
  go,
  door,
  previewGuest,
}: {
  plan: PlanState;
  go: (s: PlanScreen) => void;
  door: "guest" | "couple" | "assessor";
  previewGuest: () => void;
}) {
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Hotel</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">Bloco sem o cartão de vocês.</h1>
      <p className="mt-2 max-w-lg text-wine/70">O primo reserva. Vocês só indicam.</p>
      {plan.hotels.map((h) => (
        <div key={h.name} className="mt-4 max-w-lg rounded-2xl bg-white p-5 shadow-sm">
          <strong className="text-wine">{h.name}</strong>
          <p className="text-sm text-wine/60">
            {h.price ? `${money(h.price)} a diária · ` : ""}
            {h.rooms} quartos
          </p>
          <a
            href={`https://www.booking.com/searchresults.pt-br.html?ss=${encodeURIComponent(`${h.name} ${plan.city}`)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-wine underline"
          >
            Reservar neste nome
          </a>
        </div>
      ))}
      <button
        type="button"
        onClick={() => (door === "guest" ? go("convidado") : door === "couple" ? previewGuest() : go("mais"))}
        className="mt-6 rounded-full bg-[#c4a574] px-6 py-3 font-semibold text-[#2a1c18]"
      >
        {door === "guest" ? "Voltar ao convite" : "Ver no site dele"}
      </button>
    </div>
  );
}

function Papel({ plan, persist }: { plan: PlanState; persist: (p: PlanState) => void }) {
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Papel</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">O envelope parece o site.</h1>
      <p className="mt-2 text-wine/70">Modelo {plan.face}. Mesma cara.</p>
      <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
        {(["jardim", "noite", "papel", "costa"] as Face[]).map((f) => (
          <button key={f} type="button" onClick={() => persist({ ...plan, face: f })} className={`overflow-hidden rounded-xl ${plan.face === f ? "ring-2 ring-[#c4a574]" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(faceFile(f))} alt={f} className="h-28 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Mais({
  plan,
  go,
  account,
  sitAssessor,
}: {
  plan: PlanState;
  go: (s: PlanScreen) => void;
  account?: boolean;
  sitAssessor: () => void;
}) {
  return (
    <div className="space-y-4 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Mais</p>
      <h1 className="font-serif text-4xl italic text-wine">Equipe</h1>
      <div className="max-w-lg rounded-2xl bg-white p-5 shadow-sm">
        <strong className="text-wine">{plan.assessoraNome}, assessora</strong>
        <p className="mt-1 text-sm text-wine/60">
          {plan.assessora ? "Sentou. Vê tarefas e roteiro. Não vê PIX." : "Um link. Ela entra neste casamento, não numa vitrine."}
        </p>
        {plan.assessora ? (
          <button type="button" onClick={sitAssessor} className="mt-3 rounded-full bg-wine px-4 py-2 text-sm font-semibold text-white">
            Abrir a cadeira dela
          </button>
        ) : (
          <button type="button" onClick={sitAssessor} className="mt-3 rounded-full bg-[#c4a574] px-4 py-2 text-sm font-semibold text-[#2a1c18]">
            Mandar o convite
          </button>
        )}
      </div>
      {[
        ["tarefas", "Tarefas", "Esta semana. O zap abre com o texto."],
        ["mesas", "Mesas", "No celular: quem está em pé. Na mesa: o salão."],
        ["roteiro", "Dia D", "Roteiro por hora. Casal e ela no mesmo papel."],
        ["caderno", "Caderno dos dois", "Recado privado."],
        ["hotel", "Hotel", "Bloco sem o cartão de vocês."],
        ["papel", "Papel", "O envelope parece o site."],
        ["zap", "Zap da semana", "Abre o WhatsApp com o texto. Ainda não manda sozinho."],
      ].map(([id, t, d]) => (
        <button key={id} type="button" onClick={() => go(id as PlanScreen)} className="block w-full max-w-lg rounded-2xl bg-white p-5 text-left shadow-sm">
          <strong className="text-wine">{t}</strong>
          <p className="text-sm text-wine/60">{d}</p>
        </button>
      ))}
      <Link href="/criar" className="block max-w-lg text-sm font-semibold text-wine underline">
        Abrir o editor do site
      </Link>
      {account ? (
        <div className="flex max-w-lg flex-wrap gap-3 text-sm font-semibold text-wine">
          <Link href="/app/preview" className="underline">Prévia</Link>
          <Link href="/app/presentes" className="underline">PIX</Link>
          <Link href="/app/arquivo" className="underline">Arquivo</Link>
          <Link href="/app/planos" className="underline">Planos</Link>
          <Link href="/app/dominio" className="underline">Domínio</Link>
        </div>
      ) : (
        <Link href="/demo/presentes" className="block max-w-lg text-sm font-semibold text-wine underline">
          PIX da demo
        </Link>
      )}
    </div>
  );
}

function Assessora({ plan, go, confirmed }: { plan: PlanState; go: (s: PlanScreen) => void; confirmed: number }) {
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">{plan.assessoraNome} · assessoria</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">
        {namesOf(plan)}
      </h1>
      <p className="mt-2 text-wine/70">
        {plan.date} · {plan.city}. Convidada. Sem a chave.
      </p>
      <div className="mt-4 max-w-lg rounded-2xl bg-white p-5 shadow-sm">
        <strong>RSVP ao vivo</strong>
        <p className="text-sm text-wine/60">{confirmed} sim. Ela vê a lista. Não o PIX.</p>
      </div>
      <p className="mt-4 text-sm text-wine/50">Bloqueado: chave PIX, saque, teto em reais.</p>
      <button type="button" onClick={() => go("roteiro")} className="mt-6 rounded-full bg-[#c4a574] px-6 py-3 font-semibold text-[#2a1c18]">
        Abrir o Dia D
      </button>
    </div>
  );
}

function Roteiro() {
  const items = [
    ["15h", "Maquiagem · suíte"],
    ["17h", "Igreja · Nossa Senhora"],
    ["20h", "Festa · salão"],
  ];
  return (
    <div className="grid gap-8 p-6 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Dia D</p>
        <h1 className="mt-2 font-serif text-4xl italic text-wine">O mesmo papel.</h1>
        {items.map(([h, t]) => (
          <div key={h} className="mt-4 border-b border-wine/10 pb-3">
            <strong className="text-wine">{h}</strong>
            <p className="text-sm text-wine/60">{t}</p>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <strong>Casal</strong>
          <p className="text-sm text-wine/60">Vê o horário. Manda no zap da família.</p>
        </div>
        <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
          <strong>Helena</strong>
          <p className="text-sm text-wine/60">Vê o mesmo. Manda no zap da equipe.</p>
        </div>
      </div>
    </div>
  );
}

function Caderno({ plan, persist }: { plan: PlanState; persist: (p: PlanState) => void }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Caderno</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">Só vocês dois.</h1>
      {plan.notes.map((n, i) => (
        <div key={i} className="mt-4 max-w-lg rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-wine/50">{n.who}</p>
          <p className="mt-1 text-wine">{n.text}</p>
        </div>
      ))}
      <textarea
        className={`${fieldCls(Boolean(err), "max-w-lg p-3")} mt-4`}
        rows={3}
        value={text}
        aria-invalid={Boolean(err)}
        onChange={(e) => {
          setText(e.target.value);
          if (err) setErr("");
        }}
        placeholder="Um recado"
      />
      {err ? (
        <p className="mt-2 text-sm font-semibold text-wine" role="alert">
          {err}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          if (!text.trim()) {
            setErr("Escreve um recado.");
            return;
          }
          persist({ ...plan, notes: [...plan.notes, { who: plan.p1 || "Vocês", text: text.trim() }] });
          setText("");
          setErr("");
        }}
        className="mt-3 rounded-full bg-wine px-5 py-2 text-sm font-semibold text-white"
      >
        Guardar
      </button>
    </div>
  );
}

function Zap({ plan, go, months }: { plan: PlanState; go: (s: PlanScreen) => void; months: number }) {
  const task = plan.tasks.find((t) => !t.done)?.title ?? "respirar";
  const body = `${namesOf(plan)}, faltam ${months} meses. Esta semana: ${task}.`;
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Agora, no seu WhatsApp</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">O zap que vocês mandam.</h1>
      <p className="mt-2 max-w-md text-sm text-wine/60">Ainda não dispara sozinho amanhã. Abre o app com o texto pronto.</p>
      <p className="mt-6 max-w-md rounded-2xl rounded-br-sm bg-sage/15 p-4 text-wine">{body}</p>
      <a href={whatsappShareUrl(body)} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-wine px-6 py-3 font-semibold text-white">
        Abrir o WhatsApp
      </a>
      <button type="button" onClick={() => go("tarefas")} className="ml-2 rounded-full border border-wine/20 px-6 py-3 font-semibold text-wine">
        Voltar às tarefas
      </button>
    </div>
  );
}

function Convidado({
  plan,
  go,
  backToCouple,
}: {
  plan: PlanState;
  go: (s: PlanScreen) => void;
  backToCouple: () => void;
}) {
  return (
    <div>
      <div className="relative min-h-[50vh] overflow-hidden text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/photos/ensaio.jpg")} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80" />
        <div className="relative px-6 pb-8 pt-40">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c4a574]">{plan.date.split("-").reverse().join(" · ")}</p>
          <h1 className="mt-2 font-serif text-5xl italic">
            {namesOf(plan)}
          </h1>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <p className="text-wine/70">Você é o primo. Uma pergunta. Depois os eventos, a comida, o hotel.</p>
        <button type="button" onClick={() => go("rsvp")} className="w-full max-w-md rounded-full bg-wine py-4 font-semibold text-white">
          Confirmar presença
        </button>
        <Link href="/demo/presentes" className="block w-full max-w-md rounded-full bg-wine/10 py-4 text-center font-semibold text-wine">
          Presentear no PIX
        </Link>
        <button type="button" onClick={() => go("hotel")} className="w-full max-w-md rounded-full bg-wine/10 py-4 font-semibold text-wine">
          Onde dormir
        </button>
        <button type="button" onClick={backToCouple} className="w-full max-w-md text-sm font-semibold text-wine/60 underline">
          Sou o casal — voltar ao Hoje
        </button>
      </div>
    </div>
  );
}

function Rsvp({
  plan,
  go,
  confirmGuest,
  joao,
  flash,
}: {
  plan: PlanState;
  go: (s: PlanScreen) => void;
  confirmGuest: (id: string, extra?: Partial<PlanGuest>) => void;
  joao?: PlanGuest;
  flash: (m: string) => void;
}) {
  const [events, setEvents] = useState<string[]>(["igreja", "festa"]);
  const [meal, setMeal] = useState("carne");
  const [plusOne, setPlusOne] = useState("");
  const [err, setErr] = useState("");
  const toggle = (e: string) => {
    setErr("");
    setEvents((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  };
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">RSVP · {namesOf(plan)}</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">Em quais horas você está?</h1>
      {["igreja", "festa", "civil"].map((e) => (
        <label key={e} className="mt-3 flex items-center gap-3 border-b border-wine/10 py-3">
          <input type="checkbox" checked={events.includes(e)} onChange={() => toggle(e)} />
          {e === "igreja" ? "Igreja · 17h" : e === "festa" ? "Festa · 20h" : "Civil · sexta"}
        </label>
      ))}
      <label className="mt-4 block text-xs uppercase tracking-wide text-wine/50">Comida</label>
      <select className="mt-1 w-full max-w-md rounded-xl border border-wine/15 px-4 py-3" value={meal} onChange={(e) => setMeal(e.target.value)}>
        <option value="carne">carne</option>
        <option value="peixe">peixe</option>
        <option value="veg">veg</option>
      </select>
      <label className="mt-4 block text-xs uppercase tracking-wide text-wine/50">Vem com alguém?</label>
      <input
        className="mt-1 w-full max-w-md rounded-xl border border-wine/15 px-4 py-3"
        value={plusOne}
        onChange={(e) => setPlusOne(e.target.value)}
        placeholder="Nome do acompanhante, ou vazio"
      />
      {err ? (
        <p className="mt-4 text-sm font-semibold text-wine" role="alert">
          {err}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          if (!events.length) {
            setErr("Marca ao menos um momento.");
            return;
          }
          if (joao?.status === "confirmed") {
            flash("Já está na lista.");
            go("convidado");
            return;
          }
          confirmGuest("joao", {
            meal,
            events,
            plusOne,
            partySize: plusOne.trim() ? 2 : 1,
          });
          flash("Presença anotada. O casal vê o buffet subir.");
          go("convidado");
        }}
        className="mt-6 w-full max-w-md rounded-full bg-wine py-4 font-semibold text-white"
      >
        Sim, estarei lá
      </button>
    </div>
  );
}

function Endereco({
  plan,
  persist,
  flash,
  go,
}: {
  plan: PlanState;
  persist: (p: PlanState) => void;
  flash: (m: string) => void;
  go: (s: PlanScreen) => void;
}) {
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [err, setErr] = useState("");
  const [bad, setBad] = useState<string[]>([]);
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-wine/50">Link de endereço</p>
      <h1 className="mt-2 font-serif text-4xl italic text-wine">A família preenche. A lista cresce.</h1>
      <label className="mt-6 block text-xs uppercase tracking-wide text-wine/50">Nome</label>
      <input
        className={fieldCls(bad.includes("name"), "max-w-md")}
        value={name}
        aria-invalid={bad.includes("name")}
        onChange={(e) => {
          setName(e.target.value);
          setBad((prev) => prev.filter((x) => x !== "name"));
          if (err) setErr("");
        }}
        placeholder="Quem está escrevendo"
      />
      <label className="mt-4 block text-xs uppercase tracking-wide text-wine/50">Endereço</label>
      <input
        className={fieldCls(bad.includes("addr"), "max-w-md")}
        value={addr}
        aria-invalid={bad.includes("addr")}
        onChange={(e) => {
          setAddr(e.target.value);
          setBad((prev) => prev.filter((x) => x !== "addr"));
          if (err) setErr("");
        }}
        placeholder="Rua, número, bairro"
      />
      {err ? (
        <p className="mt-3 text-sm font-semibold text-wine" role="alert">
          {err}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          const who = name.trim();
          const miss = [!who && "name", !addr.trim() && "addr"].filter(Boolean) as string[];
          if (miss.length) {
            setBad(miss);
            setErr("Nome e rua. Os dois.");
            flash("Nome e rua. Os dois.");
            return;
          }
          const existing = plan.guests.find((g) => g.name.toLowerCase() === who.toLowerCase());
          persist({
            ...plan,
            guests: existing
              ? plan.guests.map((g) => (g.id === existing.id ? { ...g, address: addr.trim() } : g))
              : [
                  {
                    id: `addr-${Date.now()}`,
                    name: who,
                    status: "pending",
                    meal: "",
                    events: [],
                    plusOne: "",
                    partySize: 1,
                    table: null,
                    address: addr.trim(),
                  },
                  ...plan.guests,
                ],
          });
          flash(`${who.split(" ")[0]} entrou na lista.`);
          setName("");
          setAddr("");
          setErr("");
          setBad([]);
        }}
        className="mt-6 rounded-full bg-[#c4a574] px-6 py-3 font-semibold text-[#2a1c18]"
      >
        Enviar endereço
      </button>
      <p className="mt-6 text-sm text-wine/60">Manda esta tela no grupo da família. Cada um escreve o próprio nome.</p>
      <button type="button" onClick={() => go("gente")} className="mt-4 text-sm font-semibold text-wine underline">
        Voltar à gente
      </button>
    </div>
  );
}
