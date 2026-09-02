import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { demoContent, demoTenant } from "@/lib/demo-data";

export default function DemoMinimalPage() {
  return (
    <WeddingSiteView
      tenant={demoTenant}
      templateId="minimal"
      themeColor="#2d2a26"
      content={{ ...demoContent, coverPhotoUrl: demoContent.gallery[5]?.url ?? demoContent.coverPhotoUrl }}
      showBranding={false}
      siteBase="/demo"
    />
  );
}
