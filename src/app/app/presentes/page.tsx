"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { uploadWeddingPhoto } from "@/lib/upload";
import type { Gift } from "@/lib/types";

export default function GiftsManagePage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGifts();
  }, []);

  async function loadGifts() {
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
    setTenantId(tenant.id);

    const { data } = await supabase
      .from("gifts")
      .select("*")
      .eq("tenant_id", tenant.id)
      .order("sort_order");

    setGifts((data as Gift[]) ?? []);
    setLoading(false);
  }

  async function addGift(e: React.FormEvent) {
    e.preventDefault();
    const priceCents = Math.round(parseFloat(price.replace(",", ".")) * 100);
    if (!priceCents || priceCents <= 0) return;

    let photo_url: string | null = null;
    if (photoFile) {
      try {
        photo_url = await uploadWeddingPhoto(photoFile);
      } catch {
        /* keep going without photo */
      }
    }

    const supabase = createClient();
    await supabase.from("gifts").insert({
      tenant_id: tenantId,
      title,
      description: description || null,
      price_cents: priceCents,
      sort_order: gifts.length,
      photo_url,
    });

    setTitle("");
    setPrice("");
    setDescription("");
    setPhotoFile(null);
    loadGifts();
  }

  async function removeGift(id: string) {
    const supabase = createClient();
    await supabase.from("gifts").delete().eq("id", id);
    loadGifts();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-wine">Lista de presentes</h1>
      <p className="mt-1 text-wine/70">Adicione presentes em dinheiro para seus convidados</p>

      <form onSubmit={addGift} className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-wine">Novo presente</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Nome do presente"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-wine/20 px-4 py-3"
          />
          <input
            required
            placeholder="Valor (R$)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg border border-wine/20 px-4 py-3"
          />
          <input
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-wine/20 px-4 py-3 sm:col-span-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="sm:col-span-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-wine/60">Carregando...</p>
        ) : gifts.length === 0 ? (
          <p className="text-wine/60">Nenhum presente cadastrado.</p>
        ) : (
          gifts.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {g.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.photo_url} alt="" className="h-12 w-12 rounded object-cover" />
                )}
                <div>
                  <p className="font-semibold text-wine">{g.title}</p>
                  <p className="text-sm text-wine/60">
                    {formatCurrency(g.price_cents)} ·{" "}
                    {formatCurrency(g.funded_cents)} recebido
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeGift(g.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
