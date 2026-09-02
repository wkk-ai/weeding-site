"use client";

import { WeddingSiteView } from "@/components/wedding/wedding-site";
import { PasswordGate } from "@/components/wedding/password-gate";
import { demoContent, demoTenant } from "@/lib/demo-data";

export default function DemoPrivatePage() {
  return (
    <PasswordGate
      password="convite"
      storageKey="nc-demo-privado"
      hint="Nesta demo a senha é convite"
    >
      <WeddingSiteView
        tenant={demoTenant}
        templateId="classic"
        themeColor="#8b5a6b"
        content={demoContent}
        showBranding={false}
        siteBase="/demo"
      />
    </PasswordGate>
  );
}
