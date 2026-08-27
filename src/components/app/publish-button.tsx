"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PublishButton({
  tenantId,
  published,
}: {
  tenantId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch("/api/tenant/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, published: !published }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
        published
          ? "border border-wine/20 text-wine hover:bg-white"
          : "bg-wine text-white hover:bg-wine-light"
      } disabled:opacity-50`}
    >
      {loading ? "..." : published ? "Despublicar" : "Publicar site"}
    </button>
  );
}
