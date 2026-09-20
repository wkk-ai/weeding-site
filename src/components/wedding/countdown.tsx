"use client";

import { useEffect, useState } from "react";
import { countdownLine } from "@/lib/wedding-theme";

function parts(date: string, now: number) {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1, 16, 0, 0);
  const diff = target.getTime() - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
  };
}

export function Countdown({
  date,
  variant = "line",
}: {
  date: string;
  variant?: "line" | "units";
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!date) return null;
  const p = parts(date, now);
  if (!p) return null;

  if (variant === "line") {
    return (
      <p className="motion-count text-sm tracking-[0.22em] uppercase opacity-90" suppressHydrationWarning>
        {countdownLine(p.days)}
      </p>
    );
  }

  return (
    <div className="motion-count flex justify-center gap-4 text-center sm:gap-8" suppressHydrationWarning>
      {(
        [
          [p.days, "dias"],
          [p.hours, "horas"],
          [p.minutes, "min"],
        ] as const
      ).map(([value, label]) => (
        <div key={label}>
          <p className="font-serif text-2xl font-normal sm:text-3xl">{value}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">{label}</p>
        </div>
      ))}
    </div>
  );
}
