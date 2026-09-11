'use client';

import { LeadEvents } from '../../../../../packages/shared-ui/public/components/analytics/LeadEvents';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { ConsentGate } from '../../../../../packages/shared-ui/public/components/analytics/ConsentGate';

const ScrollToTop = dynamic(
  () => import('@/components/layout/ScrollToTop').then((m) => m.ScrollToTop),
  { ssr: false },
);
const WebVitals = dynamic(
  () => import('@/components/analytics/WebVitals').then((m) => m.WebVitals),
  { ssr: false },
);
const GoogleAnalytics = dynamic(
  () =>
    import('@/components/analytics/GoogleAnalytics').then(
      (m) => m.GoogleAnalytics,
    ),
  { ssr: false },
);
const GoogleTagManager = dynamic(
  () =>
    import('@/components/analytics/GoogleAnalytics').then(
      (m) => m.GoogleTagManager,
    ),
  { ssr: false },
);
const WhatsAppButton = dynamic(
  () =>
    import('@/components/widgets/WhatsAppButton').then(
      (m) => m.WhatsAppButton,
    ),
  { ssr: false },
);

export function ClientShell({ whatsappPhone }: { whatsappPhone?: string }) {
  const locale = useLocale();
  return (
    <>
      <ScrollToTop />
      <WebVitals />
      <ConsentGate locale={locale}>
        <LeadEvents measurementId={process.env.NEXT_PUBLIC_GA_ID || ""} locale={locale} />
        {process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'gtm' || !process.env.NEXT_PUBLIC_GA_ID ? <GoogleTagManager /> : <GoogleAnalytics />}
      </ConsentGate>
      <WhatsAppButton phone={whatsappPhone} />
    </>
  );
}
