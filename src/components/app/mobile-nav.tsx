"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Edit3,
  Users,
  Gift,
  Wallet,
  Globe,
  CreditCard,
  Archive,
} from "lucide-react";

const nav = [
  { href: "/app", icon: LayoutDashboard, label: "Início" },
  { href: "/app/editor", icon: Edit3, label: "Editor" },
  { href: "/app/convidados", icon: Users, label: "Lista" },
  { href: "/app/presentes", icon: Gift, label: "PIX" },
  { href: "/app/financeiro", icon: Wallet, label: "Conta" },
];

export const fullNav = [
  ...nav,
  { href: "/app/dominio", icon: Globe, label: "Domínio" },
  { href: "/app/planos", icon: CreditCard, label: "Planos" },
  { href: "/app/arquivo", icon: Archive, label: "Arquivo" },
];

export function MobileNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-wine/10 bg-white md:hidden">
      {nav.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-1 flex-col items-center py-2 text-[10px] ${
            path === href ? "text-wine" : "text-wine/50"
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
