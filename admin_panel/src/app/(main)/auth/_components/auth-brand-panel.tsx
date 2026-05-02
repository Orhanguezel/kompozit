"use client";

import Image from "next/image";

import { useGetSiteSettingByKeyQuery } from "@/integrations/hooks";

const LOGO_FALLBACK = "/uploads/kompozit/brand/logo-light.png";

type Props = {
  heading: string;
  subtext: string;
};

export function AuthBrandPanel({ heading, subtext }: Props) {
  const { data: logoSetting } = useGetSiteSettingByKeyQuery("kompozit__site_logo");
  const { data: configSetting } = useGetSiteSettingByKeyQuery("kompozit__ui_admin_config");

  const logoVal = logoSetting?.value as any;
  const configVal = configSetting?.value as any;

  const logoUrl: string = logoVal?.url || logoVal?.logo_url || logoVal?.logo_light_url || LOGO_FALLBACK;
  const logoAlt: string = logoVal?.alt || logoVal?.logo_alt || "Logo";
  const appName: string = configVal?.branding?.app_name || "MOE Kompozit";

  return (
    <div className="hidden flex-col items-center justify-center bg-primary p-12 text-center lg:flex lg:w-1/3">
      <div className="space-y-6">
        <div className="relative mx-auto size-24">
          <Image src={logoUrl} alt={logoAlt} fill unoptimized className="object-contain" />
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-primary-foreground/60 text-xs uppercase tracking-widest">{appName}</p>
          <h1 className="font-light text-5xl text-primary-foreground">{heading}</h1>
          <p className="text-primary-foreground/80 text-xl">{subtext}</p>
        </div>
      </div>
    </div>
  );
}
