'use client';

import { useEffect } from 'react';
import { CONSENT_UPDATED } from '../../../../../packages/shared-ui/public/components/analytics/ConsentGate';
import { getMoeAdAttribution } from '@/lib/moe-ad-attribution';

export function MoeAdClickCapture() {
  useEffect(() => {
    const sync = () => { getMoeAdAttribution(); };
    sync();
    window.addEventListener(CONSENT_UPDATED, sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener(CONSENT_UPDATED, sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);
  return null;
}
