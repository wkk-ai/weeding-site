import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planejar o casamento",
  description: "Hoje, convidados, dinheiro, mesas e a cadeira da assessora. No celular e na mesa.",
};

export default function PlanejarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
