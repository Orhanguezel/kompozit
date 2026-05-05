'use client';

import { Reveal } from '@/components/motion/Reveal';
import { ContactFormClient } from '@/components/sections/ContactForm';

/** Tam iletişim formu: V2 shell + `ContactFormClient`. `/contact` sayfasında kullanılır; Seçenek A’da `HomeContact` içine de eklenebilir. */
export function ContactFormSection({
  locale,
  revealDelay = 100,
}: {
  locale: string;
  revealDelay?: number;
}) {
  return (
    <Reveal delay={revealDelay}>
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:p-14 dark:bg-[var(--color-surface-muted)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <ContactFormClient locale={locale} />
      </div>
    </Reveal>
  );
}
