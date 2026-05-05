import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { Reveal } from '@/components/motion/Reveal';
import type { ParsedContactInfo } from '@/lib/contact-info';

type ContactPageLabels = {
  label: string;
  title: string;
  description: string;
  infoTitle: string;
  addressLabel: string;
  phoneLabel: string;
  emailLabel: string;
  hoursLabel: string;
  responseTitle: string;
  responseItems: string[];
  faqTitle: string;
  faqIntro: string;
  faqItems: Array<{ question: string; answer: string }>;
};

type ContactPageProps = {
  locale: string;
  info: ParsedContactInfo;
  labels: ContactPageLabels;
};

export function ContactPage({ locale, info, labels }: ContactPageProps) {
  return (
    <main className="relative bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="gold-grid-bg absolute inset-0 z-0 opacity-10 dark:opacity-20" />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <Reveal>
            <div className="mb-20">
              <span className="section-label-cc">{labels.label}</span>
              <h1 className="section-title-cc">{labels.title}</h1>
              <p className="section-subtitle-cc">{labels.description}</p>
            </div>
          </Reveal>

          <div className="grid gap-16 lg:grid-cols-[450px_1fr] lg:items-start">
            <div className="space-y-12">
              <Reveal delay={200}>
                <section className="border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-10 backdrop-blur-sm">
                  <h2 className="mb-10 font-display text-[0.7rem] uppercase tracking-[4px] text-[var(--gold)]">
                    {labels.infoTitle}
                  </h2>

                  <div className="space-y-9">
                    {(info.companyName || info.address) && (
                      <div>
                        <p className="mb-4 text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]">
                          {labels.addressLabel}
                        </p>
                        <p className="font-display text-lg uppercase leading-relaxed tracking-[1.5px] text-[var(--color-text-primary)]">
                          {info.companyName && (
                            <>
                              {info.companyName}
                              <br />
                            </>
                          )}
                          {info.address}
                        </p>
                      </div>
                    )}

                    <div className="grid gap-7">
                      {info.phone && (
                        <div>
                          <p className="mb-4 text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]">
                            {labels.phoneLabel}
                          </p>
                          <a
                            href={`tel:${info.phone.replace(/\s/g, '')}`}
                            className="font-display text-xl tracking-[1.5px] text-[var(--gold)] transition-colors hover:text-[var(--color-text-primary)]"
                          >
                            {info.phone}
                          </a>
                        </div>
                      )}

                      {info.email && (
                        <div>
                          <p className="mb-4 text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]">
                            {labels.emailLabel}
                          </p>
                          <a
                            href={`mailto:${info.email}`}
                            className="block max-w-full break-words font-display text-base tracking-[0.6px] text-[var(--color-text-primary)] transition-colors hover:text-[var(--gold)]"
                          >
                            {info.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {info.hours && (
                      <div>
                        <p className="mb-4 text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]">
                          {labels.hoursLabel}
                        </p>
                        <p className="text-sm font-light leading-relaxed text-[var(--color-text-secondary)]">{info.hours}</p>
                      </div>
                    )}
                  </div>
                </section>
              </Reveal>

              {labels.responseItems.length > 0 && (
                <Reveal delay={300}>
                  <section className="border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-10 backdrop-blur-sm">
                    <h3 className="mb-8 border-b border-[var(--color-border)] pb-4 font-display text-[1rem] uppercase tracking-[3px] text-[var(--color-text-primary)]">
                      {labels.responseTitle}
                    </h3>
                    <ul className="space-y-6">
                      {labels.responseItems.map((item) => (
                        <li key={item} className="flex gap-4 text-sm font-light leading-relaxed text-[var(--color-text-secondary)]">
                          <span className="font-bold text-[var(--gold)]">◇</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}
            </div>

            <Reveal delay={250}>
              <ContactFormSection locale={locale} />
            </Reveal>
          </div>

          {labels.faqItems.length > 0 && (
            <section className="mt-32 max-w-4xl" aria-labelledby="contact-faq-heading">
              <Reveal>
                <div className="mb-16">
                  <span className="section-label-cc">Inquiry</span>
                  <h2 id="contact-faq-heading" className="section-title-cc text-[3.5rem]">
                    {labels.faqTitle}
                  </h2>
                  <p className="section-subtitle-cc">{labels.faqIntro}</p>
                </div>
              </Reveal>

              <div className="space-y-2">
                {labels.faqItems.map((item, index) => (
                  <Reveal key={item.question} delay={(index + 1) * 50}>
                    <dl className="border-b border-[var(--color-border)] px-8 py-10 transition-all hover:bg-[color-mix(in_srgb,var(--color-gold)_4%,transparent)]">
                      <dt className="font-display text-[1.4rem] uppercase tracking-[3px] text-[var(--color-text-primary)] transition-colors">
                        {item.question}
                      </dt>
                      <dd className="mt-6 text-base font-light leading-relaxed text-[var(--color-text-secondary)] transition-colors">
                        {item.answer}
                      </dd>
                    </dl>
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
