"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function RsvpPage() {
  const { slug } = useParams<{ slug: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"confirmed" | "declined">("confirmed");
  const [meal, setMeal] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name,
        email,
        rsvp_status: status,
        meal_choice: meal,
        notes,
      }),
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
          <p className="text-4xl">💌</p>
          <h1 className="mt-4 font-serif text-2xl font-bold text-wine">Obrigado!</h1>
          <p className="mt-2 text-wine/70">Sua resposta foi registrada com sucesso.</p>
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
        <h1 className="font-serif text-2xl font-bold text-wine">Confirmar presença</h1>
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
            <label className="text-sm font-medium text-wine/80">Você vai?</label>
            <div className="mt-2 flex gap-4">
              {(["confirmed", "declined"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={status === s}
                    onChange={() => setStatus(s)}
                  />
                  {s === "confirmed" ? "Sim, estarei lá!" : "Não poderei ir"}
                </label>
              ))}
            </div>
          </div>
          {status === "confirmed" && (
            <div>
              <label className="text-sm font-medium text-wine/80">Preferência de menu</label>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
              >
                <option value="">Selecione</option>
                <option value="carne">Carne</option>
                <option value="frango">Frango</option>
                <option value="peixe">Peixe</option>
                <option value="vegetariano">Vegetariano</option>
                <option value="vegano">Vegano</option>
              </select>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-wine/80">Mensagem (opcional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-wine py-3 font-semibold text-white hover:bg-wine-light disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar resposta"}
          </button>
        </div>
      </form>
    </div>
  );
}
