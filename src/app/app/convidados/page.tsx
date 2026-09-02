"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Download, UserPlus } from "lucide-react";
import { siteUrl, whatsappShareUrl } from "@/lib/assets";
import { coupleDisplayName } from "@/lib/utils";
import type { Guest } from "@/lib/types";

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [slug, setSlug] = useState("");
  const [names, setNames] = useState("");
  const [loading, setLoading] = useState(true);
  const [importText, setImportText] = useState("");

  async function load() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, slug, partner1_name, partner2_name")
      .eq("user_id", user.id)
      .single();
    if (!tenant) return;
    setTenantId(tenant.id);
    setSlug(tenant.slug);
    setNames(coupleDisplayName(tenant.partner1_name, tenant.partner2_name));
    const { data } = await supabase
      .from("guests")
      .select("*")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false });
    setGuests((data as Guest[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function importNames() {
    const names = importText
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (!names.length || !tenantId) return;
    const supabase = createClient();
    await supabase.from("guests").insert(
      names.map((name) => ({
        tenant_id: tenantId,
        name,
        rsvp_status: "pending",
        plus_one: false,
      })),
    );
    setImportText("");
    load();
  }

  async function mark(id: string, rsvp_status: Guest["rsvp_status"]) {
    const supabase = createClient();
    await supabase.from("guests").update({ rsvp_status }).eq("id", id);
    load();
  }

  function exportCsv() {
    const header = "Nome,E-mail,Status,Acompanhante,Adultos,Crianças,Menu,Observações\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.email ?? ""}","${g.rsvp_status}","${g.plus_one_name ?? ""}","${g.party_size ?? 1}","${g.kids ?? 0}","${g.meal_choice ?? ""}","${g.notes ?? ""}"`,
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
          className="flex items-center gap-2 rounded-full border border-wine/20 px-4 py-2 text-sm font-semibold text-wine disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Colar nomes (WhatsApp / Excel)</h2>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Um nome por linha"
          className="mt-3 w-full rounded-lg border border-wine/20 p-3 text-sm"
          rows={3}
        />
        <button
          type="button"
          onClick={importNames}
          className="mt-3 rounded-full bg-wine px-4 py-2 text-sm font-semibold text-white"
        >
          Importar
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-wine/60">Carregando...</p>
      ) : guests.length === 0 ? (
        <div className="mt-12 rounded-2xl bg-white p-12 text-center shadow-sm">
          <UserPlus className="mx-auto h-12 w-12 text-wine/30" />
          <p className="mt-4 text-wine/70">
            Ainda ninguém. Importe a lista ou compartilhe o link do site.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-wine text-white">
              <tr>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Pessoas</th>
                <th className="p-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine/10">
              {guests.map((g) => (
                <tr key={g.id}>
                  <td className="p-4 font-medium text-wine">
                    {g.name}
                    {g.plus_one_name && (
                      <span className="block text-xs text-wine/50">+ {g.plus_one_name}</span>
                    )}
                  </td>
                  <td className="p-4">{statusLabel[g.rsvp_status]}</td>
                  <td className="p-4 text-wine/70">
                    {g.party_size ?? 1} ad. · {g.kids ?? 0} cr.
                  </td>
                  <td className="p-4 text-right space-x-3">
                    {g.rsvp_status === "pending" && (
                      <a
                        href={
                          g.phone
                            ? `https://wa.me/${g.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Oi ${g.name}! Você está convidado(a) para o casamento de ${names}. Confirme aqui: ${siteUrl(`/s/${slug}`)}`,
                              )}`
                            : whatsappShareUrl(
                                `Oi ${g.name}! Você está convidado(a) para o casamento de ${names}. Confirme aqui: ${siteUrl(`/s/${slug}`)}`,
                              )
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-wine"
                      >
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => mark(g.id, "confirmed")}
                      className="text-xs font-semibold text-sage"
                    >
                      Confirmar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
