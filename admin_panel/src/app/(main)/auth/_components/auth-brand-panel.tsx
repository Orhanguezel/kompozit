"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useGetSiteSettingAdminByKeyQuery } from "@/integrations/hooks";

const LOGO_FALLBACK = "/uploads/kompozit/brand/logo-light.png";

type Props = {
  heading: string;
  subtext: string;
};

export function AuthBrandPanel({ heading, subtext }: Props) {
  const { data: logoSetting } = useGetSiteSettingAdminByKeyQuery("kompozit__site_logo");
  const { data: configSetting } = useGetSiteSettingAdminByKeyQuery("kompozit__ui_admin_config");

  const logoVal = logoSetting?.value as any;
  const configVal = configSetting?.value as any;

  const logoUrl: string = logoVal?.url || logoVal?.logo_url || logoVal?.logo_light_url || LOGO_FALLBACK;
  const logoAlt: string = logoVal?.alt || logoVal?.logo_alt || "Logo";
  const appName: string = configVal?.branding?.app_name || "MOE Kompozit";

  return (
    <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-slate-950 p-12 text-center lg:flex lg:w-1/2">
      {/* Premium Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/uploads/kompozit/brand/kompozit_login_bg.png"
          alt="Industrial Background" 
          fill 
          className="object-cover opacity-20 mix-blend-luminosity" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-primary/20" />
      </div>

      {/* Mesh Gradient Overlays */}
      <div className="absolute inset-0 z-1">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] animate-pulse rounded-full bg-primary/20 blur-[120px]" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-[10%] top-[20%] h-[50%] w-[50%] animate-pulse rounded-full bg-blue-600/10 blur-[100px]" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[10%] left-[20%] h-[40%] w-[60%] animate-pulse rounded-full bg-indigo-500/15 blur-[140px]" style={{ animationDuration: '10s' }} />
        
        {/* Technical Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 space-y-12"
      >
        {/* Floating Glass Logo Container */}
        <div className="relative mx-auto flex size-48 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl shadow-black/50">
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 1, 0, -1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative size-full"
          >
            <Image 
              src={logoUrl} 
              alt={logoAlt} 
              fill 
              unoptimized 
              className="object-contain filter drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" 
            />
          </motion.div>
          
          {/* Decorative Rings */}
          <div className="absolute -inset-4 animate-[spin_20s_linear_infinite] rounded-[3rem] border border-white/5 opacity-50" />
          <div className="absolute -inset-8 animate-[spin_30s_linear_infinite_reverse] rounded-[3.5rem] border border-white/5 opacity-30" />
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center space-x-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md"
          >
            <div className="size-2 animate-pulse rounded-full bg-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">{appName}</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-6xl font-extrabold tracking-tighter text-transparent leading-[1.1]"
            >
              {heading}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mx-auto max-w-md text-xl font-medium leading-relaxed text-white/40"
            >
              {subtext}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Industrial Footer Info */}
      <div className="absolute bottom-12 left-0 w-full px-12">
        <div className="flex items-center justify-between border-t border-white/5 pt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
          <div className="flex items-center space-x-4">
            <span>Precision Engineering</span>
            <span className="size-1 rounded-full bg-white/10" />
            <span>Industrial Design</span>
          </div>
          <span>System v2.2.0</span>
        </div>
      </div>
    </div>
  );
}
