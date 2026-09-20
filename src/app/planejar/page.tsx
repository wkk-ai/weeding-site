"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlanningApp } from "@/components/planning/planning-app";
import type { PlanScreen } from "@/lib/planning";

function PlanejarInner() {
  const sp = useSearchParams();
  const start: PlanScreen = sp.get("porta") === "hoje" ? "hoje" : "rua";
  return <PlanningApp start={start} />;
}

export default function PlanejarPage() {
  return (
    <Suspense>
      <PlanejarInner />
    </Suspense>
  );
}
