'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { storageService } from '@/features/storage';

const productCategories = [
  'carbon_fiber',
  'frp_ctp',
  'fiberglass',
  'panel',
  'profile',
  'tank',
  'custom_part',
] as const;

export function OfferFormClient({
  locale,
  preselectedProduct,
}: {
  locale: string;
  preselectedProduct?: string;
}) {
  const t = useTranslations('offer.form');
  const tc = useTranslations('common');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const files = fd.getAll('attachments').filter((file): file is File => file instanceof File && file.size > 0);
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const uploaded = await storageService.upload(file, 'quote-requests');
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            url: uploaded?.url,
            path: uploaded?.path,
            id: uploaded?.id,
          };
        }),
      );
      const productInterest = String(fd.get('product_interest') ?? '').trim();
      const productCategory = String(fd.get('product_category') ?? '').trim();
      const sector = String(fd.get('sector') ?? '').trim();
      const quantity = String(fd.get('quantity') ?? '').trim();
      const deadline = String(fd.get('deadline') ?? '').trim();
      await api.post('/offers', {
        customer_name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone') || null,
        company_name: fd.get('company') || null,
        subject: productInterest || tc('offer'),
        message: fd.get('details') || null,
        source: 'kompozit',
        locale,
        form_data: {
          product_interest: productInterest || null,
          product_category: productCategory || null,
          sector: sector || null,
          quantity: quantity || null,
          deadline: deadline || null,
          attachments: uploadedFiles,
        },
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
    <form onSubmit={handleSubmit} className="surface-card space-y-4 rounded-xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder={tc('name')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder={tc('email')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="phone"
          placeholder={tc('phone')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="company"
          placeholder={tc('company')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
      </div>
      <input
        name="product_interest"
        defaultValue={preselectedProduct || ''}
        placeholder={t('productInterest')}
        className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <select
          name="product_category"
          defaultValue=""
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        >
          <option value="">{t('productCategory')}</option>
          {productCategories.map((category) => (
            <option key={category} value={category}>
              {t(`productCategories.${category}`)}
            </option>
          ))}
        </select>
        <input
          name="sector"
          placeholder={t('sector')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="quantity"
          placeholder={t('quantity')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="deadline"
          placeholder={t('deadline')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
      </div>
      <textarea
        name="details"
        rows={5}
        placeholder={t('detailsPlaceholder')}
        className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
      />
      <label className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        <span className="mb-2 block font-medium text-[var(--color-cream)]">{t('attachFile')}</span>
        <input
          name="attachments"
          type="file"
          multiple
          accept=".pdf,.step,.stp,.iges,.igs,.dxf,.dwg,.jpg,.jpeg,.png"
          className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-brand)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
        />
        <span className="mt-2 block text-xs">{t('attachHint')}</span>
      </label>
      <button
        type="submit"
        disabled={sending}
        className="btn-primary w-full rounded-lg px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {sending ? tc('loading') : t('submit')}
      </button>
    </form>
  );
}
