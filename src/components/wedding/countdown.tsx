"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const id = setInterval(onStoreChange, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return Date.now();
}

function getServerSnapshot() {
  return 0;
}

export function Countdown({ date }: { date: string }) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!date || now === 0) return null;

  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1, 16, 0, 0);
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return (
      <p className="text-xs uppercase tracking-[0.2em] opacity-90">
        O dia chegou
      </p>
    );
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return (
    <div className="flex justify-center gap-6 text-center">
      {[
        [days, "dias"],
        [hours, "horas"],
        [minutes, "min"],
      ].map(([value, label]) => (
        <div key={String(label)}>
          <p className="font-serif text-3xl font-bold">{value}</p>
          <p className="text-xs uppercase tracking-widest opacity-80">{label}</p>
        </div>
      ))}
    </div>
  );
}
