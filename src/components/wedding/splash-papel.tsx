"use client";

import { useEffect, useState } from "react";

export function SplashPapel({
  names,
  dateLabel,
  onDone,
}: {
  names: string;
  dateLabel: string;
  onDone: () => void;
}) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduce(true);
      onDone();
      return;
    }
    const t = window.setTimeout(onDone, 2500);
    return () => window.clearTimeout(t);
  }, [onDone]);

  if (reduce) return null;

  return (
    <div className="motion-splash motion-splash-in fixed inset-0 z-[80] flex items-center justify-center bg-[#e8dcc8] px-6">
      <div className="motion-card-in relative max-w-md bg-[#fffdf8] px-10 py-14 text-center shadow-[0_30px_80px_rgba(80,50,30,.18)]">
        <span className="pointer-events-none absolute inset-[18px] border border-[#d7c4aa]" />
        <span className="pointer-events-none absolute inset-[22px] border border-[#d7c4aa]" />
        <p className="text-[10px] tracking-[0.6em] text-[#b08968] uppercase">O grande dia</p>
        <p className="font-script mt-4 text-5xl text-[#7a3e48]">{names}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.32em] text-[#8a6a55]">{dateLabel}</p>
        <button
          type="button"
          onClick={onDone}
          className="mt-10 text-[11px] uppercase tracking-[0.22em] text-[#8a6a55] underline"
        >
          Pular
        </button>
      </div>
    </div>
  );
}
