import 'server-only';

import { RichContentDisplay } from '@/components/ui/RichContentDisplay';
import styles from './product-description.module.css';

/** Preserve admin-authored HTML, grouping its existing headings for readability. */
export function ProductDescription({ html }: { html: string }) {
  const sections = html.split(/(?=<h2(?:\s|>))/i).filter((section) => section.trim());

  return (
    <div className={styles.layout}>
      {sections.map((section, index) => {
        const heading = section.match(/^<h2\b[^>]*>[\s\S]*?<\/h2>/i)?.[0];
        const headingText = heading?.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ') ?? '';
        const isFaq = /frequently\s+asked|sık(?:ça)?\s+sorulan|\bfaq\b|\bsss\b/i.test(headingText);
        const body = heading ? section.slice(heading.length) : section;
        const questions = isFaq ? body.split(/(?=<h3(?:\s|>))/i).filter((part) => part.trim()) : [];

        return (
          <section key={index} className={`${styles.section} ${index === 0 || index === sections.length - 1 || isFaq || !heading ? styles.wide : ''}`}>
            {isFaq && questions.some((part) => /^<h3\b/i.test(part)) ? (
              <>
                <RichContentDisplay html={heading!} className={`product-rich-content ${styles.content}`} />
                <div className={styles.faq}>
                  {questions.map((question, questionIndex) => {
                    const title = question.match(/^<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
                    if (!title) return <RichContentDisplay key={questionIndex} html={question} className={`product-rich-content ${styles.content}`} />;
                    return (
                      <details key={questionIndex} className={styles.question}>
                        <summary>
                          <span dangerouslySetInnerHTML={{ __html: title[1]! }} />
                          <span className={styles.indicator} aria-hidden="true" />
                        </summary>
                        <RichContentDisplay html={question.slice(title[0].length)} className={`product-rich-content ${styles.answer}`} />
                      </details>
                    );
                  })}
                </div>
              </>
            ) : (
              <RichContentDisplay html={section} className={`product-rich-content ${styles.content}`} />
            )}
          </section>
        );
      })}
    </div>
  );
}
