"use client";

import { useEffect, useState } from "react";

export function PasswordGate({
  password,
  children,
  storageKey = "nc-site-unlock",
  hint,
}: {
  password: string;
  children: React.ReactNode;
  storageKey?: string;
  hint?: string;
}) {
  const key = storageKey;
  const [ok, setOk] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(key) === "1") setOk(true);
  }, [key]);

  if (ok) return children;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) {
            setError("Escreve a senha.");
            return;
          }
          if (value.trim() === password) {
            sessionStorage.setItem(key, "1");
            setOk(true);
          } else {
            setError("Senha incorreta");
          }
        }}
      >
        <h1 className="font-serif text-2xl font-bold text-wine">Site protegido</h1>
        <p className="mt-2 text-sm text-wine/70">
          Este casamento é só para convidados. Digite a senha do convite.
        </p>
        {hint && <p className="mt-2 text-xs text-wine/50">{hint}</p>}
        <input
          type="password"
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          className={`mt-6 w-full rounded-lg border px-4 py-3 ${
            error ? "border-wine ring-2 ring-wine/30" : "border-wine/20"
          }`}
          placeholder="Senha"
        />
        {error ? (
          <p className="mt-2 text-sm font-semibold text-wine" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-wine py-3 font-semibold text-white"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
