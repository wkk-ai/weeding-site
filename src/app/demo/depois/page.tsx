import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { demoContent, demoTenant } from "@/lib/demo-data";

export default function DemoAfterPage() {
  return (
    <WeddingSiteView
      tenant={{ ...demoTenant, wedding_date: "2024-11-14" }}
      templateId="classic"
      themeColor="#8b5a6b"
      content={demoContent}
      showBranding={false}
      siteBase="/demo"
    />
  );
}
