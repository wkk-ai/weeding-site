"use client";

import { useEffect, useState } from "react";
import { countdownLine } from "@/lib/wedding-theme";

export function Countdown({
  date,
  variant = "line",
}: {
  date: string;
  variant?: "line" | "units";
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!date || now === null) return null;

  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1, 16, 0, 0);
  const diff = target.getTime() - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (variant === "line") {
    return (
      <p className="motion-count text-sm tracking-[0.22em] uppercase opacity-90">
        {countdownLine(days)}
      </p>
    );
  }

  return (
    <div className="motion-count flex justify-center gap-8 text-center">
      {[
        [days, "dias"],
        [hours, "horas"],
        [minutes, "min"],
      ].map(([value, label]) => (
        <div key={String(label)}>
          <p className="font-serif text-3xl font-normal">{value}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">{label}</p>
        </div>
      ))}
    </div>
  );
}
