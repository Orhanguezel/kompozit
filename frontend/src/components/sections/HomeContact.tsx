'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

/** Mirrors `ParsedContactInfo` without importing `server-only` contact module into a client file. */
type HomeContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
};

type HomeContactProps = {
  labels: {
    label: string;
    title: string;
    description: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    response: string;
    infoLabels: {
      email: string;
      phone: string;
      address: string;
      hours: string;
    };
  };
  contactInfo?: HomeContactInfo;
};

const CONTACT_FALLBACK: Required<HomeContactInfo> = {
  email: '',
  phone: '',
  address: '',
  hours: '',
};

export function HomeContact({ labels, contactInfo }: HomeContactProps) {
  const [sending, setSending] = useState(false);

  const info = {
    email: contactInfo?.email?.trim() || CONTACT_FALLBACK.email,
    phone: contactInfo?.phone?.trim() || CONTACT_FALLBACK.phone,
    address: contactInfo?.address?.trim() || CONTACT_FALLBACK.address,
    workingHours: contactInfo?.hours?.trim() || CONTACT_FALLBACK.hours,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      customer_name: (formData.get('name') as string) || '',
      email: (formData.get('email') as string) || '',
      message: (formData.get('message') as string) || '',
      source: 'kompozit',
      locale: window.location.pathname.split('/')[1] || 'tr',
      consent_marketing: true,
      consent_terms: true,
    };

    setSending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to send');

      alert('Mesajınız başarıyla iletildi. Teşekkürler!');
      form.reset();
    } catch (err) {
      console.error('Contact error:', err);
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  if (!labels) return null;

  return (
    <section className="section-py relative overflow-hidden bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" id="contact">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />

      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Info */}
          <div className="space-y-12">
            <Reveal>
              <p className="section-label-cc">{labels.label}</p>
              <h2 className="font-[var(--font-display)] text-[clamp(3rem,8vw,5rem)] uppercase leading-none text-[var(--color-text-primary)]">
                {labels.title}
              </h2>
              <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-[var(--color-text-secondary)]">
                {labels.description}
              </p>
            </Reveal>

            <div className="grid gap-8 sm:grid-cols-2">
              <Reveal delay={100}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center border border-[color-mix(in_srgb,var(--color-gold)_24%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-gold)_7%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)]">
                    <Mail className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-text-primary)]">
                      {labels.infoLabels.email}
                    </p>
                    <a href={`mailto:${info.email}`} className="mt-1 block break-words text-sm font-light text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-gold)]">
                      {info.email}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center border border-[color-mix(in_srgb,var(--color-gold)_24%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-gold)_7%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)]">
                    <Phone className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-text-primary)]">
                      {labels.infoLabels.phone}
                    </p>
                    <a href={`tel:${info.phone}`} className="mt-1 block text-sm font-light text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-gold)]">
                      {info.phone}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center border border-[color-mix(in_srgb,var(--color-gold)_24%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-gold)_7%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)]">
                    <MapPin className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-text-primary)]">
                      {labels.infoLabels.address}
                    </p>
                    <p className="mt-1 text-sm font-light text-[var(--color-text-secondary)]">
                      {info.address}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center border border-[color-mix(in_srgb,var(--color-gold)_24%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-gold)_7%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)]">
                    <Clock className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-text-primary)]">
                      {labels.infoLabels.hours}
                    </p>
                    <p className="mt-1 text-sm font-light text-[var(--color-text-secondary)]">
                      {info.workingHours}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: Form */}
          <div className="relative">
            <Reveal delay={500}>
              <div className="relative border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:p-12 dark:bg-[var(--color-surface-muted)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" />

                <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]">
                        {labels.namePlaceholder}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full rounded-none border-0 border-b-2 border-[color-mix(in_srgb,var(--color-gold)_34%,var(--color-text-muted))] bg-transparent px-0 py-4 text-sm font-light text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-muted)] hover:border-[color-mix(in_srgb,var(--color-gold)_55%,var(--color-text-muted))] focus:border-[var(--color-gold)]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]">
                        {labels.emailPlaceholder}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full rounded-none border-0 border-b-2 border-[color-mix(in_srgb,var(--color-gold)_34%,var(--color-text-muted))] bg-transparent px-0 py-4 text-sm font-light text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-muted)] hover:border-[color-mix(in_srgb,var(--color-gold)_55%,var(--color-text-muted))] focus:border-[var(--color-gold)]"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]">
                      {labels.messagePlaceholder}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full resize-none rounded-none border-0 border-b-2 border-[color-mix(in_srgb,var(--color-gold)_34%,var(--color-text-muted))] bg-transparent px-0 py-4 text-sm font-light text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-muted)] hover:border-[color-mix(in_srgb,var(--color-gold)_55%,var(--color-text-muted))] focus:border-[var(--color-gold)]"
                      placeholder="..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="hero-btn-primary w-full justify-center py-5 font-bold disabled:opacity-50"
                  >
                    {sending ? '...' : labels.submit}
                    <Send className="size-4" />
                  </button>

                  <p className="text-center text-[10px] font-medium uppercase tracking-[1px] text-[var(--color-text-muted)]">
                    {labels.response}
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
