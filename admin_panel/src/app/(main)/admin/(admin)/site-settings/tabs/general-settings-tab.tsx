"use client";

import * as React from "react";

import { Building2, Clock3, Globe2, Languages, RefreshCcw, Save, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import { useAdminTranslations } from "@/i18n";
import { useListSiteSettingsAdminQuery, useUpdateSiteSettingAdminMutation } from "@/integrations/hooks";
import type { SettingValue, SiteSetting } from "@/integrations/shared";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import {
  BusinessHoursStructuredForm,
  businessHoursFormToObj,
  businessHoursObjToForm,
  type BusinessHoursFormState,
} from "./structured/business-hours-structured-form";
import {
  CompanyProfileStructuredForm,
  companyFormToObj,
  companyObjToForm,
  type CompanyProfileFormState,
} from "./structured/company-profile-structured-form";
import {
  ContactInfoStructuredForm,
  contactFormToObj,
  contactObjToForm,
  type ContactInfoFormState,
} from "./structured/contact-info-structured-form";
import {
  SocialsStructuredForm,
  socialsFormToObj,
  socialsObjToForm,
  type SocialsFormState,
} from "./structured/socials-structured-form";
import { UiHeaderStructuredForm, uiHeaderFormToObj, uiHeaderObjToForm } from "./structured/ui-header-structured-form";

const GLOBAL_KEYS = ["contact_info", "socials", "businessHours"] as const;
const LOCAL_KEYS = ["company_profile", "ui_header"] as const;

const DEFAULT_CONTACT: ContactInfoFormState = { phone: "", email: "", address: "", whatsapp: "" };
const DEFAULT_SOCIALS: SocialsFormState = { instagram: "", facebook: "", linkedin: "", youtube: "", x: "" };
const DEFAULT_HOURS: BusinessHoursFormState = [
  { day: "mon", open: "09:00", close: "18:00", closed: false },
  { day: "tue", open: "09:00", close: "18:00", closed: false },
  { day: "wed", open: "09:00", close: "18:00", closed: false },
  { day: "thu", open: "09:00", close: "18:00", closed: false },
  { day: "fri", open: "09:00", close: "18:00", closed: false },
  { day: "sat", open: "10:00", close: "14:00", closed: false },
  { day: "sun", open: "00:00", close: "00:00", closed: true },
];
const DEFAULT_COMPANY: CompanyProfileFormState = { company_name: "MOE Kompozit", slogan: "", about: "" };
const DEFAULT_HEADER = {
  nav_home: "Ana Sayfa",
  nav_products: "Ürünler",
  nav_services: "Hizmetler",
  nav_contact: "İletişim",
  cta_label: "Teklif Al",
};

function errMsg(err: unknown, fallback: string): string {
  const anyErr = err as any;
  return anyErr?.data?.error?.message || anyErr?.data?.message || anyErr?.message || fallback;
}

function rowValue(rows: SiteSetting[] | undefined, key: string): SettingValue | undefined {
  return rows?.find((row) => row.key === key)?.value as SettingValue | undefined;
}

export type GeneralSettingsTabProps = {
  locale: string;
  settingPrefix?: string;
};

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({ locale, settingPrefix }) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const [tab, setTab] = React.useState("global");
  const [updateSetting, updateState] = useUpdateSiteSettingAdminMutation();

  const withPrefix = React.useCallback((key: string) => `${settingPrefix || ""}${key}`, [settingPrefix]);
  const stripPrefix = React.useCallback(
    (key: string) => (settingPrefix && key.startsWith(settingPrefix) ? key.slice(settingPrefix.length) : key),
    [settingPrefix],
  );

  const globalKeys = React.useMemo(() => GLOBAL_KEYS.map((key) => withPrefix(key)), [withPrefix]);
  const localKeys = React.useMemo(() => LOCAL_KEYS.map((key) => withPrefix(key)), [withPrefix]);

  const globalQ = useListSiteSettingsAdminQuery(
    { locale: "*", keys: globalKeys as string[], sort: "key", order: "asc", limit: 20 },
    { skip: !locale },
  );
  const localQ = useListSiteSettingsAdminQuery(
    { locale, keys: localKeys as string[], sort: "key", order: "asc", limit: 20 },
    { skip: !locale },
  );

  const globalRows = React.useMemo(
    () => (globalQ.data ?? []).map((row) => ({ ...row, key: stripPrefix(String(row.key || "")) })) as SiteSetting[],
    [globalQ.data, stripPrefix],
  );
  const localRows = React.useMemo(
    () => (localQ.data ?? []).map((row) => ({ ...row, key: stripPrefix(String(row.key || "")) })) as SiteSetting[],
    [localQ.data, stripPrefix],
  );

  const [contact, setContact] = React.useState<ContactInfoFormState>(DEFAULT_CONTACT);
  const [socials, setSocials] = React.useState<SocialsFormState>(DEFAULT_SOCIALS);
  const [hours, setHours] = React.useState<BusinessHoursFormState>(DEFAULT_HOURS);
  const [company, setCompany] = React.useState<CompanyProfileFormState>(DEFAULT_COMPANY);
  const [header, setHeader] = React.useState<any>(DEFAULT_HEADER);

  React.useEffect(() => {
    if (globalQ.isFetching) return;
    setContact(contactObjToForm(rowValue(globalRows, "contact_info"), DEFAULT_CONTACT));
    setSocials(socialsObjToForm(rowValue(globalRows, "socials"), DEFAULT_SOCIALS));
    setHours(businessHoursObjToForm(rowValue(globalRows, "businessHours"), DEFAULT_HOURS));
  }, [globalRows, globalQ.isFetching]);

  React.useEffect(() => {
    if (localQ.isFetching) return;
    setCompany(companyObjToForm(rowValue(localRows, "company_profile"), DEFAULT_COMPANY));
    setHeader(uiHeaderObjToForm(rowValue(localRows, "ui_header"), DEFAULT_HEADER as any));
  }, [localRows, localQ.isFetching]);

  const busy = globalQ.isLoading || globalQ.isFetching || localQ.isLoading || localQ.isFetching || updateState.isLoading;

  async function refreshAll() {
    await Promise.all([globalQ.refetch(), localQ.refetch()]);
  }

  async function saveGlobal(key: (typeof GLOBAL_KEYS)[number], value: SettingValue) {
    try {
      await updateSetting({ key: withPrefix(key), locale: "*", value }).unwrap();
      toast.success("Kaydedildi");
      await globalQ.refetch();
    } catch (err) {
      toast.error(errMsg(err, t("admin.siteSettings.messages.error")));
    }
  }

  async function saveLocal(key: (typeof LOCAL_KEYS)[number], value: SettingValue) {
    try {
      await updateSetting({ key: withPrefix(key), locale, value }).unwrap();
      toast.success("Kaydedildi");
      await localQ.refetch();
    } catch (err) {
      toast.error(errMsg(err, t("admin.siteSettings.messages.error")));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold text-base">Genel Ayarlar</h2>
          <p className="text-muted-foreground text-sm">
            Firma, iletişim, sosyal medya ve dil bazlı başlık metinlerini form olarak yönetin.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={refreshAll} disabled={busy}>
          <RefreshCcw className="mr-2 size-4" />
          Yenile
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex w-full justify-start">
          <TabsTrigger value="global" className="gap-2">
            <Globe2 className="size-4" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="localized" className="gap-2">
            <Languages className="size-4" />
            Dile Bağlı Genel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4" />
                İletişim Bilgileri
              </CardTitle>
              <CardDescription>Telefon, e-posta, WhatsApp ve adres bilgileri.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactInfoStructuredForm value={contact} onChange={setContact} disabled={busy} seed={DEFAULT_CONTACT} />
              <div className="flex justify-end">
                <Button onClick={() => saveGlobal("contact_info", contactFormToObj(contact) as SettingValue)} disabled={busy}>
                  <Save className="mr-2 size-4" />
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Share2 className="size-4" />
                Sosyal Medya
              </CardTitle>
              <CardDescription>Instagram, Facebook, LinkedIn, YouTube ve X bağlantıları.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SocialsStructuredForm value={socials} onChange={setSocials} disabled={busy} seed={DEFAULT_SOCIALS} />
              <div className="flex justify-end">
                <Button onClick={() => saveGlobal("socials", socialsFormToObj(socials) as SettingValue)} disabled={busy}>
                  <Save className="mr-2 size-4" />
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock3 className="size-4" />
                Çalışma Saatleri
              </CardTitle>
              <CardDescription>Ziyaretçilere gösterilecek çalışma günleri ve saatleri.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <BusinessHoursStructuredForm value={hours} onChange={setHours} disabled={busy} seed={DEFAULT_HOURS} />
              <div className="flex justify-end">
                <Button onClick={() => saveGlobal("businessHours", businessHoursFormToObj(hours) as SettingValue)} disabled={busy}>
                  <Save className="mr-2 size-4" />
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localized" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Firma Profili ({locale})</CardTitle>
              <CardDescription>Firma adı, slogan ve hakkımızda metni seçili dile göre kaydedilir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CompanyProfileStructuredForm value={company} onChange={setCompany} disabled={busy} seed={DEFAULT_COMPANY} />
              <div className="flex justify-end">
                <Button onClick={() => saveLocal("company_profile", companyFormToObj(company) as SettingValue)} disabled={busy}>
                  <Save className="mr-2 size-4" />
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Üst Menü Metinleri ({locale})</CardTitle>
              <CardDescription>Menü başlıkları ve çağrı butonu metni seçili dile göre kaydedilir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UiHeaderStructuredForm value={header} onChange={setHeader} disabled={busy} seed={DEFAULT_HEADER as any} />
              <div className="flex justify-end">
                <Button onClick={() => saveLocal("ui_header", uiHeaderFormToObj(header) as SettingValue)} disabled={busy}>
                  <Save className="mr-2 size-4" />
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

GeneralSettingsTab.displayName = "GeneralSettingsTab";
