export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { loadPublishedSite } from "@/lib/load-site";
import { coupleDisplayName } from "@/lib/utils";

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadPublishedSite(slug);
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-cream px-4 py-16 text-center">
      {data.content.coverPhotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.content.coverPhotoUrl}
          alt=""
          className="mx-auto h-40 w-40 rounded-full object-cover"
        />
      )}
      <h1 className="mt-8 font-serif text-4xl font-bold text-wine">
        Obrigado, de {coupleDisplayName(data.tenant.partner1_name, data.tenant.partner2_name)}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-wine/80">
        {data.content.thankYouMessage ?? "Obrigado por celebrar conosco."}
      </p>
      <Link href={`/s/${slug}`} className="mt-8 inline-block font-semibold text-wine underline">
        Voltar ao site
      </Link>
    </div>
  );
}
