import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { demoContent, demoTenant } from "@/lib/demo-data";

export default function DemoGardenPage() {
  return (
    <WeddingSiteView
      tenant={demoTenant}
      templateId="garden"
      themeColor="#5c7a5c"
      content={{ ...demoContent, coverPhotoUrl: demoContent.gallery[2]?.url }}
      showBranding={false}
      siteBase="/demo"
    />
  );
}
