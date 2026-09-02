"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-serif text-xl font-bold text-wine">
          <Heart className="h-5 w-5 fill-wine-light text-wine-light" />
          NossoCasamento
        </Link>
        <h1 className="text-center font-serif text-2xl font-bold text-wine">Entrar</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3 focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wine/20 px-4 py-3 focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-right text-sm">
            <Link href="/login/recuperar" className="text-wine/70 underline">
              Esqueci a senha
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-wine py-3 font-semibold text-white hover:bg-wine-light disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-wine/70">
          Não tem conta?{" "}
          <Link href="/signup" className="font-semibold text-wine hover:underline">
            Criar site grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
