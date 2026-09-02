export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { RsvpForm } from "@/components/wedding/rsvp-form";
import { loadPublishedSite } from "@/lib/load-site";
import { coupleDisplayName } from "@/lib/utils";

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadPublishedSite(slug);
  if (!data) notFound();

  return (
    <RsvpForm
      slug={slug}
      names={coupleDisplayName(data.tenant.partner1_name, data.tenant.partner2_name)}
      date={data.tenant.wedding_date}
      photo={data.content.coverPhotoUrl}
      backHref={`/s/${slug}`}
    />
  );
}
