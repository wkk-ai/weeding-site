import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { demoContent, demoTenant } from "@/lib/demo-data";

export default function DemoPage() {
  return (
    <WeddingSiteView
      tenant={demoTenant}
      templateId="classic"
      themeColor="#8b5a6b"
      content={demoContent}
      showBranding={false}
      siteBase="/demo"
    />
  );
}
