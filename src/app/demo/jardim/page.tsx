import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { demoContent, demoTenant } from "@/lib/demo-data";

export default function DemoGardenPage() {
  return (
    <WeddingSiteView
      tenant={demoTenant}
      templateId="garden"
      themeColor="#c4a574"
      content={{ ...demoContent, coverPhotoUrl: demoContent.gallery[2]?.url }}
      showBranding={false}
      siteBase="/demo"
      previewMode={false}
    />
  );
}
