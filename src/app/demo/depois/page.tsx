import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { demoContent, demoTenant } from "@/lib/demo-data";

const past = "2024-11-14";

export default function DemoAfterPage() {
  return (
    <WeddingSiteView
      tenant={{ ...demoTenant, wedding_date: past }}
      templateId="classic"
      themeColor="#8b5a6b"
      content={{
        ...demoContent,
        ceremony: { ...demoContent.ceremony!, date: past },
        reception: { ...demoContent.reception!, date: past },
      }}
      showBranding={false}
      siteBase="/demo"
    />
  );
}
