"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { recordRsvp } from "@/lib/planning";

export function RsvpForm({
  slug,
  names,
  date,
  photo,
  backHref,
  mode = "live",
}: {
  slug: string;
  names: string;
  date: string;
  photo?: string;
  backHref: string;
  mode?: "live" | "demo";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"confirmed" | "declined">("confirmed");
  const [meal, setMeal] = useState("");
  const [notes, setNotes] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [kids, setKids] = useState(0);
  const [events, setEvents] = useState<string[]>(["igreja", "festa"]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const eventNote = events.length ? `eventos:${events.join(",")}` : "";
    const payload = {
      slug,
      name,
      email,
      phone,
      rsvp_status: status,
      meal_choice: meal,
      notes: [eventNote, notes].filter(Boolean).join("\n"),
      plus_one: plusOne,
      plus_one_name: plusOneName,
      party_size: partySize,
      kids,
    };

    recordRsvp({
      name,
      meal,
      events,
      plusOne: plusOneName,
      partySize,
      declined: status === "declined",
    });

    if (mode === "demo") {
      const prev = JSON.parse(localStorage.getItem("nc-demo-rsvp") ?? "[]");
      prev.unshift({ ...payload, created_at: new Date().toISOString() });
      localStorage.setItem("nc-demo-rsvp", JSON.stringify(prev));
      setDone(true);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao enviar RSVP");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="mx-auto h-24 w-24 rounded-full object-cover" />
          )}
          <h1 className="mt-4 font-serif text-2xl italic text-wine">Obrigado</h1>
          <p className="mt-2 text-wine/70">
            {status === "confirmed"
              ? `${names} mal podem esperar vocês no dia ${formatDate(date)}.`
              : "Sentiremos sua falta — obrigado por avisar."}
          </p>
          {status === "confirmed" && (
            <div className="mt-6 flex flex-col gap-2">
              <Link href={backHref} className="font-semibold text-wine underline">
                Ver o caminho
              </Link>
              <Link href={backHref.replace(/\/rsvp\/?$/, "/presentes")} className="text-sm text-wine/70 underline">
                Presentear
              </Link>
            </div>
          )}
          {status === "declined" && (
            <Link href={backHref} className="mt-6 inline-block font-semibold text-wine underline">
              Voltar ao site
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="-mx-8 -mt-8 mb-6 h-40 w-[calc(100%+4rem)] object-cover" />
        )}
        <h1 className="font-serif text-3xl italic text-wine">Vocês vêm?</h1>
        <p className="mt-1 text-sm text-wine/70">
          {names} · {formatDate(date)}
        </p>
        <p className="mt-2 text-xs text-wine/50">Leva 20 segundos</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-wine/80">Seu nome *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wine/80">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wine/80">WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="11 99999-0000"
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wine/80">Vocês vêm?</label>
            <div className="mt-2 flex gap-4">
              {(["confirmed", "declined"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={status === s}
                    onChange={() => setStatus(s)}
                  />
                  {s === "confirmed" ? "Sim, vamos" : "Não poderemos ir"}
                </label>
              ))}
            </div>
          </div>
          {status === "confirmed" && (
            <>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={plusOne}
                  onChange={(e) => setPlusOne(e.target.checked)}
                />
                Levo acompanhante
              </label>
              {plusOne && (
                <input
                  placeholder="Nome do acompanhante"
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                  className="w-full rounded-lg border border-wine/20 px-4 py-3"
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Adultos</label>
                  <input
                    type="number"
                    min={1}
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
                  />
                </div>
                <div>
                  <label className="text-sm">Crianças</label>
                  <input
                    type="number"
                    min={0}
                    value={kids}
                    onChange={(e) => setKids(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-wine/80">Quais momentos</label>
                <div className="mt-2 space-y-2 text-sm">
                  {[
                    ["igreja", "Igreja"],
                    ["festa", "Festa"],
                    ["civil", "Civil"],
                  ].map(([id, label]) => (
                    <label key={id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={events.includes(id)}
                        onChange={() =>
                          setEvents((prev) =>
                            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                          )
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-wine/80">Alguma restrição alimentar?</label>
                <input
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
                  placeholder="Opcional"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-medium text-wine/80">Recado para o casal</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
            />
          </div>
            {error && <p className="text-sm text-red-600">Não deu certo. Tente de novo.</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-wine py-3 font-semibold text-white hover:bg-wine-light disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar resposta"}
          </button>
          <Link href={backHref} className="block text-center text-sm text-wine/60">
            Voltar ao site
          </Link>
        </div>
      </form>
    </div>
  );
}
