import Link from "next/link";
import { demoContent, demoTenant } from "@/lib/demo-data";
import { coupleDisplayName } from "@/lib/utils";

export default function DemoThanksPage() {
  return (
    <div className="min-h-screen bg-cream px-4 py-16 text-center">
      {demoContent.coverPhotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={demoContent.coverPhotoUrl}
          alt=""
          className="mx-auto h-40 w-40 rounded-full object-cover"
        />
      )}
      <h1 className="mt-8 font-serif text-4xl font-bold text-wine">
        Obrigado, de {coupleDisplayName(demoTenant.partner1_name, demoTenant.partner2_name)}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-wine/80">{demoContent.thankYouMessage}</p>
      <Link href="/demo" className="mt-8 inline-block font-semibold text-wine underline">
        Voltar ao site
      </Link>
    </div>
  );
}
