'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import api from '@/lib/axios';

export function ContactFormClient({ locale }: { locale: string }) {
  const t = useTranslations('contact.form');
  const tc = useTranslations('common');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/contacts', {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        company: fd.get('company'),
        subject: fd.get('subject'),
        message: fd.get('message'),
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

  const InputLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
      {children}
    </label>
  );

  const inputClasses = "w-full rounded-none border-0 border-b-2 border-[color-mix(in_srgb,var(--color-gold)_34%,var(--color-text-muted))] bg-transparent px-0 py-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-all hover:border-[color-mix(in_srgb,var(--color-gold)_55%,var(--color-text-muted))] focus:border-[var(--color-gold)] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-[var(--font-display)] text-3xl font-normal uppercase tracking-wide text-[var(--color-text-primary)]">
          {t('title')}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] opacity-80">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <InputLabel htmlFor="name">{t('namePlaceholder')}</InputLabel>
          <input
            id="name"
            name="name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <InputLabel htmlFor="email">{t('emailPlaceholder')}</InputLabel>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <InputLabel htmlFor="phone">{t('phonePlaceholder')}</InputLabel>
          <input
            id="phone"
            name="phone"
            className={inputClasses}
          />
        </div>
        <div>
          <InputLabel htmlFor="company">{t('companyPlaceholder')}</InputLabel>
          <input
            id="company"
            name="company"
            className={inputClasses}
          />
        </div>
      </div>
      <div>
        <InputLabel htmlFor="subject">{t('subjectPlaceholder')}</InputLabel>
        <input
          id="subject"
          name="subject"
          className={inputClasses}
        />
      </div>
      <div>
        <InputLabel htmlFor="message">{t('messagePlaceholder')}</InputLabel>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClasses}
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex w-full items-center justify-center gap-3 rounded-none bg-[var(--color-gold)] px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#14110d] transition-all hover:bg-[var(--color-gold-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50"
        >
          <span>{sending ? tc('loading') : t('submit')}</span>
          {!sending && <Send className="size-4 opacity-80 transition-transform group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  );
}
