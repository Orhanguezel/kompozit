// src/app/(main)/auth/register/page.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useAdminTranslations } from "@/i18n";
import { useLocaleShort } from "@/i18n/useLocaleShort";

import { AuthBrandPanel } from "../_components/auth-brand-panel";
import { RegisterForm } from "../_components/register-form";

function RegisterFormFallback() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-muted/50" />
    </div>
  );
}

export default function Register() {
  const locale = useLocaleShort();
  const t = useAdminTranslations(locale);

  return (
    <div className="flex min-h-dvh bg-white dark:bg-slate-950">
      <AuthBrandPanel
        heading={t("admin.auth.register.createAccount")}
        subtext={t("admin.auth.register.continueRegister")}
      />

      {/* Sağ (form) */}
      <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2">
        {/* Subtle Background Pattern for Mobile */}
        <div className="absolute inset-0 opacity-[0.03] lg:hidden" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {t("admin.auth.register.title")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg font-medium text-slate-500 dark:text-slate-400"
            >
              {t("admin.auth.register.description")}
            </motion.p>
          </div>

          <div className="space-y-8">
            <Suspense fallback={<RegisterFormFallback />}>
              <RegisterForm />
            </Suspense>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="border-t border-slate-100 pt-8 dark:border-slate-800"
            >
              <p className="text-center text-sm font-medium text-slate-500">
                {t("admin.auth.register.alreadyHaveAccount")}{" "}
                <Link 
                  prefetch={false} 
                  href="/auth/login" 
                  className="font-bold text-primary underline-offset-4 decoration-2 hover:underline"
                >
                  {t("admin.auth.register.loginLink")}
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="absolute right-0 top-0 p-12">
          <div className="flex space-x-3">
             <div className="size-2 rounded-full bg-slate-200 dark:bg-slate-800" />
             <div className="size-2 rounded-full bg-slate-200 dark:bg-slate-800" />
             <div className="size-2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
