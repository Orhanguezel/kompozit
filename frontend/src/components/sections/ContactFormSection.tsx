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
      <div className="p-10 lg:p-14 border border-[var(--gold)]/15 bg-[var(--graphite)]">
        <ContactFormClient locale={locale} />
      </div>
    </Reveal>
  );
}
