// =============================================================
// FILE: src/components/admin/site-settings/structured/ContactInfoStructuredForm.tsx
// =============================================================

"use client";

import type React from "react";

import { z } from "zod";

import { Alert, AlertDescription } from "@ensotek/shared-ui/admin/ui/alert";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { useAdminTranslations } from "@/i18n";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export const contactInfoSchema = z
  .object({
    phone: z.string().trim().optional(),
    email: z.string().trim().optional(),
    address: z.string().trim().optional(),
    whatsapp: z.string().trim().optional(),
  })
  .strict();

export type ContactInfoFormState = z.infer<typeof contactInfoSchema>;

export type ContactInfoStructuredFormProps = {
  value: any;
  onChange: (next: ContactInfoFormState) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  seed?: ContactInfoFormState;
};

const safeObj = (v: any) => (v && typeof v === "object" && !Array.isArray(v) ? v : null);

export function contactObjToForm(v: any, seed: ContactInfoFormState): ContactInfoFormState {
  const base = safeObj(v) || seed;
  const parsed = contactInfoSchema.safeParse(base);
  return parsed.success ? parsed.data : seed;
}

export function contactFormToObj(s: ContactInfoFormState) {
  return contactInfoSchema.parse({
    phone: s.phone?.trim() || "",
    email: s.email?.trim() || "",
    address: s.address?.trim() || "",
    whatsapp: s.whatsapp?.trim() || "",
  });
}

export const ContactInfoStructuredForm: React.FC<ContactInfoStructuredFormProps> = ({
  value,
  onChange,
  errors,
  disabled,
  seed,
}) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const s = (seed || { phone: "", email: "", address: "", whatsapp: "" }) as ContactInfoFormState;
  const form = contactObjToForm(value, s);

  return (
    <div className="space-y-4">
      <Alert variant="default" className="py-2">
        <AlertDescription className="text-sm">
          {t("admin.siteSettings.structured.contact.description")}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="text-sm">
            {t("admin.siteSettings.structured.contact.labels.phone")}
          </Label>
          <Input
            id="contact-phone"
            className="h-8"
            value={form.phone || ""}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
            disabled={disabled}
          />
          {errors?.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-sm">
            {t("admin.siteSettings.structured.contact.labels.email")}
          </Label>
          <Input
            id="contact-email"
            className="h-8"
            value={form.email || ""}
            onChange={(e) => onChange({ ...form, email: e.target.value })}
            disabled={disabled}
          />
          {errors?.email && <p className="text-destructive text-xs">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-whatsapp" className="text-sm">
            {t("admin.siteSettings.structured.contact.labels.whatsapp")}
          </Label>
          <Input
            id="contact-whatsapp"
            className="h-8"
            value={form.whatsapp || ""}
            onChange={(e) => onChange({ ...form, whatsapp: e.target.value })}
            disabled={disabled}
          />
          {errors?.whatsapp && <p className="text-destructive text-xs">{errors.whatsapp}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contact-address" className="text-sm">
            {t("admin.siteSettings.structured.contact.labels.address")}
          </Label>
          <Textarea
            id="contact-address"
            rows={3}
            value={form.address || ""}
            onChange={(e) => onChange({ ...form, address: e.target.value })}
            disabled={disabled}
            className="text-sm"
          />
          {errors?.address && <p className="text-destructive text-xs">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
};

ContactInfoStructuredForm.displayName = "ContactInfoStructuredForm";
