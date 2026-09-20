import { notFound } from "next/navigation";
import { DemoSite } from "@/components/wedding/demo-site";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/constants";
import { isTemplateId } from "@/lib/wedding-theme";

export function generateStaticParams() {
  return TEMPLATE_IDS.map((template) => ({ template }));
}

export default async function DemoTemplatePage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  if (!isTemplateId(template)) notFound();
  return <DemoSite templateId={template as TemplateId} />;
}
