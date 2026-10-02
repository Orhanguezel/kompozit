'use client';

import { leadFetch } from '../../../../../packages/shared-ui/public/lib/lead-tracking';

import { useState } from 'react';
import { Send } from 'lucide-react';

/**
 * Ürün sayfasında kısa teklif formu (2026-10-02).
 *
 * Reklamdan gelen ziyaretçi (çoğu telefondan) ayrı /offer sayfasına gitmeden, ürünü seçili
 * olarak teklif isteyebilsin diye. Ölçüm ortak leadFetch'ten gelir: yalnız API 201 + kayıt
 * kimliği dönerse generate_lead / Ads dönüşümü gönderilir; form içeriği ölçüme gitmez.
 * Ürün kimliği UUID biçiminde olmadığı için product_id değil subject + form_data taşınır.
 */
export type QuickQuoteLabels = {
  title: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  messagePlaceholder: string;
  consent: string;
  privacy: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  response: string;
};

export function QuickQuoteForm({
  locale,
  productTitle,
  productSlug,
  labels,
}: {
  locale: string;
  productTitle: string;
  productSlug: string;
  labels: QuickQuoteLabels;
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      source: 'kompozit',
      locale,
      customer_name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim() || null,
      email: String(data.get('email') || '').trim(),
      subject: productTitle,
      message: String(data.get('message') || '').trim() || null,
      form_data: { form: 'quick_quote', product: productTitle, product_slug: productSlug, page: window.location.pathname },
      consent_terms: data.get('consent_terms') === 'on',
      website: String(data.get('website') || ''),
    };
    setStatus('sending');
    try {
      const res = await leadFetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('offer_failed');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const field =
    'w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)]';
  const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]';

  return (
    <section
      id="hizli-teklif"
      aria-labelledby="hizli-teklif-baslik"
      className="scroll-mt-28 rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_25%,transparent)] bg-[var(--color-surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:p-10"
    >
      <h2 id="hizli-teklif-baslik" className="font-[var(--font-display)] text-2xl tracking-tight text-[var(--color-text-primary)] lg:text-3xl">
        {labels.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{labels.description}</p>
      <p className="mt-3 inline-block rounded-sm bg-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
        {productTitle}
      </p>

      {status === 'sent' ? (
        <p role="status" className="mt-6 rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-[var(--color-text-primary)]">
          {labels.success}
        </p>
      ) : (
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="qq-name" className={label}>{labels.name}</label>
            <input id="qq-name" name="name" required maxLength={255} autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor="qq-phone" className={label}>{labels.phone}</label>
            <input id="qq-phone" name="phone" type="tel" required maxLength={50} autoComplete="tel" inputMode="tel" className={field} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="qq-email" className={label}>{labels.email}</label>
            <input id="qq-email" name="email" type="email" required maxLength={255} autoComplete="email" className={field} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="qq-message" className={label}>{labels.message}</label>
            <textarea id="qq-message" name="message" rows={3} maxLength={4000} placeholder={labels.messagePlaceholder} className={`${field} resize-none`} />
          </div>
          {/* Antispam: gerçek kullanıcı görmez. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <label className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)] sm:col-span-2">
            <input type="checkbox" name="consent_terms" required className="mt-1" />
            <span>
              {labels.consent}{' '}
              <a href={`/${locale}/legal/privacy`} className="underline">{labels.privacy}</a>
            </span>
          </label>
          {status === 'error' ? (
            <p role="alert" className="text-sm font-semibold text-red-500 sm:col-span-2">{labels.error}</p>
          ) : null}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary inline-flex items-center justify-center gap-3 rounded-sm px-8 py-4 text-sm font-bold disabled:opacity-50 sm:col-span-2"
          >
            {status === 'sending' ? labels.sending : labels.submit}
            <Send className="size-4" />
          </button>
          <p className="text-center text-xs text-[var(--color-text-muted)] sm:col-span-2">{labels.response}</p>
        </form>
      )}
    </section>
  );
}
