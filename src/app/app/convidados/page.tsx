"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Download, UserPlus } from "lucide-react";
import type { Guest } from "@/lib/types";

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!tenant) return;

      const { data } = await supabase
        .from("guests")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });

      setGuests((data as Guest[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  function exportCsv() {
    const header = "Nome,E-mail,Status,Menu,Observações\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.email ?? ""}","${g.rsvp_status}","${g.meal_choice ?? ""}","${g.notes ?? ""}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "convidados.csv";
    a.click();
  }

  const statusLabel = {
    pending: "Pendente",
    confirmed: "Confirmado",
    declined: "Não vai",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-wine">Convidados</h1>
        <button
          onClick={exportCsv}
          disabled={guests.length === 0}
          className="flex items-center gap-2 rounded-full border border-wine/20 px-4 py-2 text-sm font-semibold text-wine hover:bg-white disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-wine/60">Carregando...</p>
      ) : guests.length === 0 ? (
        <div className="mt-12 rounded-2xl bg-white p-12 text-center shadow-sm">
          <UserPlus className="mx-auto h-12 w-12 text-wine/30" />
          <p className="mt-4 text-wine/70">
            Nenhum RSVP ainda. Compartilhe o link do seu site com os convidados.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-wine text-white">
              <tr>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">E-mail</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine/10">
              {guests.map((g) => (
                <tr key={g.id}>
                  <td className="p-4 font-medium text-wine">{g.name}</td>
                  <td className="p-4 text-wine/70">{g.email ?? "—"}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        g.rsvp_status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : g.rsvp_status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabel[g.rsvp_status]}
                    </span>
                  </td>
                  <td className="p-4 text-wine/70">{g.meal_choice ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
