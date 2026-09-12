"use client";

import { useEffect, useMemo, useState } from "react";
import { BuilderShell, type BuilderState } from "@/components/builder/builder-shell";
import {
  clearDraft,
  emptyDraft,
  fileToPreviewDataUrl,
  loadDraft,
  saveDraft,
} from "@/lib/criar-draft";
import { slugify } from "@/lib/utils";

function draftToState(): BuilderState {
  const d = loadDraft();
  return {
    partner1: d.couple.partner1,
    partner2: d.couple.partner2,
    weddingDate: d.couple.weddingDate,
    slug: d.couple.slug || slugify(`${d.couple.partner1}-${d.couple.partner2}`),
    templateId: d.site.templateId,
    themeColor: d.site.themeColor,
    paletteId: d.site.paletteId,
    content: d.content,
  };
}

export default function CriarPage() {
  const [state, setState] = useState<BuilderState | null>(null);
  const [status, setStatus] = useState("Salvo neste aparelho");

  useEffect(() => {
    setState(draftToState());
  }, []);

  const persist = useMemo(
    () => (next: BuilderState) => {
      setState(next);
      setStatus("Salvando…");
      saveDraft({
        version: 1,
        couple: {
          partner1: next.partner1,
          partner2: next.partner2,
          weddingDate: next.weddingDate,
          slug: next.slug,
        },
        site: {
          templateId: next.templateId,
          themeColor: next.themeColor,
          paletteId: next.paletteId,
        },
        content: next.content,
        splashSeen: true,
        updatedAt: new Date().toISOString(),
      });
      setStatus("Salvo neste aparelho");
    },
    [],
  );

  if (!state) {
    return <p className="p-8 text-[#8a746c]">Abrindo o montador…</p>;
  }

  return (
    <BuilderShell
      mode="playground"
      state={state}
      onChange={persist}
      status={status}
      onReset={() => {
        clearDraft();
        setState(draftToState());
      }}
      onUpload={fileToPreviewDataUrl}
    />
  );
}
