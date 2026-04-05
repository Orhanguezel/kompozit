import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { HomeTestimonialContent } from '@/features/site-settings/home';

export async function HomeTestimonial({
  locale,
  fromApi,
}: {
  locale: string;
  fromApi?: HomeTestimonialContent | null;
}) {
  const t = await getTranslations({ locale, namespace: 'home.testimonial' });
  const quote = fromApi?.quote ?? t('quote');
  const attribution = fromApi?.attribution ?? t('attribution');

  return (
    <section className="relative overflow-hidden bg-[var(--color-carbon)] px-6 py-40 text-center lg:px-12">
      <div
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none font-serif text-[15rem] leading-none text-[color-mix(in_srgb,var(--color-gold)_6%,transparent)]"
        aria-hidden
      >
        &ldquo;
      </div>
      <div className="relative z-[1] mx-auto max-w-4xl px-4 lg:px-8">
        <blockquote className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-normal italic leading-[1.6] text-[var(--color-cream)]">
          {quote}
        </blockquote>
        <p className="mt-10 text-[0.75rem] font-semibold uppercase tracking-[4px] text-[var(--color-gold)]">
          {attribution}
        </p>
      </div>
    </section>
  );
}
