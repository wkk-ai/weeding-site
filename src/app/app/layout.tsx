import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SignOutButton } from "@/components/app/sign-out-button";
import { MobileNav, fullNav } from "@/components/app/mobile-nav";
import { createClient } from "@/lib/supabase/server";
import { coupleDisplayName, formatDate } from "@/lib/utils";
import { PLANS } from "@/lib/constants";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!tenant) redirect("/signup");

  const plan = PLANS[tenant.plan as keyof typeof PLANS];

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 shrink-0 border-r border-wine/10 bg-white md:block">
        <div className="border-b border-wine/10 p-6">
          <p className="font-serif text-lg font-bold text-wine">
            {coupleDisplayName(tenant.partner1_name, tenant.partner2_name)}
          </p>
          <p className="mt-1 text-sm text-wine/60">{formatDate(tenant.wedding_date)}</p>
          <span className="mt-2 inline-block rounded-full bg-rose/30 px-2 py-0.5 text-xs font-semibold text-wine">
            Plano {plan.name}
          </span>
        </div>
        <nav className="p-4">
          {fullNav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-wine/80 hover:bg-cream hover:text-wine"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-wine/10 p-4">
          <Link href="/app/preview" className="mb-2 block text-sm font-medium text-wine hover:underline">
            Ver prévia
          </Link>
          {tenant.published ? (
            <Link
              href={`/s/${tenant.slug}`}
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium text-sage hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Ver site publicado
            </Link>
          ) : (
            <p className="text-xs text-wine/50">Site ainda não publicado</p>
          )}
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="border-b border-wine/10 bg-white px-6 py-4 md:hidden">
          <p className="font-serif font-bold text-wine">
            {coupleDisplayName(tenant.partner1_name, tenant.partner2_name)}
          </p>
        </div>
        <div className="p-6">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
