'use client';

import dynamic from 'next/dynamic';

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
  return (
    <>
      <ScrollToTop />
      <WebVitals />
      <GoogleAnalytics />
      <GoogleTagManager />
      <WhatsAppButton phone={whatsappPhone} />
    </>
  );
}
