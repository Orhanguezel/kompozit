import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SITE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL),
  description:
    'MOE Kompozit designs and manufactures composite tanks, pipes, profiles and custom FRP solutions for industrial projects.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
