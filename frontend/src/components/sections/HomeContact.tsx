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
  email: 'info@karbonkompozit.com.tr',
  phone: '+90 216 123 45 67',
  address: 'Dilovası İMES OSB, Kocaeli',
  hours: 'Pzt - Cum: 08:00 - 18:00',
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
    setSending(true);
    // Simulation
    setTimeout(() => {
      setSending(false);
      alert('Thank you! Your message has been received.');
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  if (!labels) return null;

  return (
    <section className="section-py relative overflow-hidden bg-[var(--color-graphite)]" id="contact">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />

      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Info */}
          <div className="space-y-12">
            <Reveal>
              <p className="section-label-cc">{labels.label}</p>
              <h2 className="section-title-cc uppercase">{labels.title}</h2>
              <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-[var(--color-silver)]">
                {labels.description}
              </p>
            </Reveal>

            <div className="grid gap-8 sm:grid-cols-2">
              <Reveal delay={100}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 transition-colors group-hover:bg-[var(--color-gold)]/10">
                    <Mail className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-off-white)]">
                      {labels.infoLabels.email}
                    </p>
                    <a href={`mailto:${info.email}`} className="mt-1 block text-sm font-light text-[var(--color-silver)] hover:text-[var(--color-gold)] transition-colors">
                      {info.email}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 transition-colors group-hover:bg-[var(--color-gold)]/10">
                    <Phone className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-off-white)]">
                      {labels.infoLabels.phone}
                    </p>
                    <a href={`tel:${info.phone}`} className="mt-1 block text-sm font-light text-[var(--color-silver)] hover:text-[var(--color-gold)] transition-colors">
                      {info.phone}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 transition-colors group-hover:bg-[var(--color-gold)]/10">
                    <MapPin className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-off-white)]">
                      {labels.infoLabels.address}
                    </p>
                    <p className="mt-1 text-sm font-light text-[var(--color-silver)]">
                      {info.address}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="group space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 transition-colors group-hover:bg-[var(--color-gold)]/10">
                    <Clock className="size-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-xs uppercase tracking-[3px] text-[var(--color-off-white)]">
                      {labels.infoLabels.hours}
                    </p>
                    <p className="mt-1 text-sm font-light text-[var(--color-silver)]">
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
              <div className="relative rounded-[2.5rem] border border-white/5 bg-[var(--color-carbon)] p-8 lg:p-12">
                <div className="absolute inset-0 gold-grid-bg opacity-[0.05] pointer-events-none" />

                <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-silver)] opacity-60">
                        {labels.namePlaceholder}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm font-light text-[var(--color-off-white)] outline-none transition-all focus:border-[var(--color-gold)]/30 focus:bg-white/[0.04]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-silver)] opacity-60">
                        {labels.emailPlaceholder}
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm font-light text-[var(--color-off-white)] outline-none transition-all focus:border-[var(--color-gold)]/30 focus:bg-white/[0.04]"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-silver)] opacity-60">
                      {labels.messagePlaceholder}
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm font-light text-[var(--color-off-white)] outline-none transition-all focus:border-[var(--color-gold)]/30 focus:bg-white/[0.04]"
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

                  <p className="text-center text-[10px] font-medium text-[var(--color-silver)] opacity-40 uppercase tracking-[1px]">
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
