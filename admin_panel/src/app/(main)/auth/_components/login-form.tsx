"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Checkbox } from "@ensotek/shared-ui/admin/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { useAdminTranslations } from "@/i18n";
import { useLocaleShort } from "@/i18n/useLocaleShort";
import { useAuthTokenMutation } from "@/integrations/hooks";

type FormValues = {
  email: string;
  password: string;
  remember?: boolean;
};

function safeNext(next: string | null | undefined, fallback: string): string {
  const v = String(next ?? "").trim();
  if (!v || !v.startsWith("/")) return fallback;
  if (v.startsWith("//")) return fallback;
  return v;
}

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;

  const m1 = anyErr?.data?.error?.message;
  if (typeof m1 === "string" && m1.trim()) return m1;

  const m1b = anyErr?.data?.error;
  if (typeof m1b === "string" && m1b.trim()) return m1b;

  const m2 = anyErr?.data?.message;
  if (typeof m2 === "string" && m2.trim()) return m2;

  const m3 = anyErr?.error;
  if (typeof m3 === "string" && m3.trim()) return m3;

  return fallback;
}

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const locale = useLocaleShort();
  const t = useAdminTranslations(locale);

  const [login, loginState] = useAuthTokenMutation();

  const FormSchema = z.object({
    email: z.string().email({ message: t("admin.auth.login.emailRequired") }),
    password: z.string().min(6, { message: t("admin.auth.login.passwordMinLength") }),
    remember: z.boolean().optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema as any) as any,
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login({
        grant_type: "password",
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();

      toast.success(t("admin.auth.login.loginSuccess"));

      const next = safeNext(sp?.get("next"), "/admin");
      router.replace(next);
      router.refresh();
    } catch (err) {
      toast.error(getErrMessage(err, t("admin.auth.login.loginFailed")));
    }
  };

  const isBusy = loginState.isLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("admin.auth.login.emailLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("admin.auth.login.emailPlaceholder")}
                    autoComplete="email"
                    disabled={isBusy}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 transition-all duration-200 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-900"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("admin.auth.login.passwordLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("admin.auth.login.passwordPlaceholder")}
                    autoComplete="current-password"
                    disabled={isBusy}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 transition-all duration-200 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-900"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="login-remember"
                    checked={!!field.value}
                    onCheckedChange={(v) => field.onChange(!!v)}
                    disabled={isBusy}
                    className="size-4 rounded border-slate-300 dark:border-slate-700"
                  />
                </FormControl>
                <FormLabel htmlFor="login-remember" className="cursor-pointer select-none text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t("admin.auth.login.rememberMe")}
                </FormLabel>
              </FormItem>
            )}
          />
          
          <button type="button" className="text-sm font-bold text-primary underline-offset-4 hover:underline">
             {t("admin.auth.login.forgotPassword") || "Şifremi Unuttum"}
          </button>
        </div>

        <Button 
          className="h-12 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]" 
          type="submit" 
          disabled={isBusy}
        >
          {isBusy ? (
            <div className="flex items-center space-x-2">
              <div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>{t("admin.auth.login.loggingIn")}</span>
            </div>
          ) : (
            t("admin.auth.login.loginButton")
          )}
        </Button>
      </form>
    </Form>
  );
}
