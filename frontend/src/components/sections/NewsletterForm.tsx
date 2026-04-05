'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations('home.newsletter');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/newsletter/subscribe', {
        email: fd.get('email'),
        source: 'kompozit',
        locale,
      });
      toast.success(t('success'));
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error(t('error'));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <label htmlFor="newsletter-email" className="sr-only">Newsletter Email</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder={t('placeholder')}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all"
          required
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="btn-primary shimmer-btn glow-hover rounded-xl px-8 py-3.5 text-sm font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
      >
        <span>{sending ? '...' : t('subscribe')}</span>
      </button>
    </form>
  );
}
