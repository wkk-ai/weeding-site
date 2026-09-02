import { RsvpForm } from "@/components/wedding/rsvp-form";
import { demoContent, demoTenant } from "@/lib/demo-data";
import { coupleDisplayName } from "@/lib/utils";

export default function DemoRsvpPage() {
  return (
    <RsvpForm
      mode="demo"
      slug={demoTenant.slug}
      names={coupleDisplayName(demoTenant.partner1_name, demoTenant.partner2_name)}
      date={demoTenant.wedding_date}
      photo={demoContent.coverPhotoUrl}
      backHref="/demo"
    />
  );
}
