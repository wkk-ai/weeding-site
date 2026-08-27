"use client";

import { LogOut } from "lucide-react";

export function SignOutButton() {
  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button
      onClick={signOut}
      className="flex items-center gap-2 text-sm text-wine/60 hover:text-wine"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
