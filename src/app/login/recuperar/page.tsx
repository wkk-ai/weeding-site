"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/login`,
    });
    if (err) {
      setError("Não foi possível enviar. Confira o e-mail ou tente de novo.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-serif text-xl font-bold text-wine">
          <Heart className="h-5 w-5 fill-wine-light text-wine-light" />
          NossoCasamento
        </Link>
        <h1 className="text-center font-serif text-2xl font-bold text-wine">Esqueci a senha</h1>
        {sent ? (
          <p className="mt-6 text-center text-wine/70">
            Se o e-mail existir, você recebe um link para criar uma senha nova.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              type="email"
              required
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-wine/20 px-4 py-3"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded-full bg-wine py-3 font-semibold text-white">
              Enviar link
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-wine underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
