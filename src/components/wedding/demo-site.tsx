import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { demoContent, demoTenant } from "@/lib/demo-data";
import { asset } from "@/lib/assets";
import type { TemplateId } from "@/lib/constants";
import { themeFor } from "@/lib/wedding-theme";

export function DemoSite({ templateId }: { templateId: TemplateId }) {
  const theme = themeFor(templateId);
  return (
    <WeddingSiteView
      tenant={demoTenant}
      templateId={templateId}
      themeColor={theme.defaultColor}
      content={{ ...demoContent, coverPhotoUrl: asset(theme.preview) }}
      showBranding={false}
      siteBase="/demo"
      previewMode={false}
    />
  );
}
