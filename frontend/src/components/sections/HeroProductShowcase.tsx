import Link from 'next/link';
import Image from '@/components/ui/MeasuredImage';
import { ArrowRight } from 'lucide-react';
import { localizedPath } from '@/seo/helpers';
import { resolvePublicAssetUrl, stripHtmlToText } from '@/lib/utils';
import styles from './home-hero.module.css';

/**
 * Hero'nun sag tarafinda gercek urunlerden olusan mozaik.
 * Sunucu bileseni: JS tasimaz, ilk gorsel LCP adayi olarak oncelikli yuklenir.
 * Marka/urun adi koddan gelmez; API (veya locale fallback) verisi basilir.
 */

type CategoryLike = { name?: string | null; slug?: string | null } | string | null | undefined;

export type ShowcaseProduct = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  image_url?: string | null;
  alt?: string | null;
  is_featured?: number | boolean | null;
  category?: CategoryLike;
};

export type ShowcaseCategory = { name: string; slug: string | null };

const PLACEHOLDER_SRC = '/media/product-placeholder.svg';

function categoryName(c: CategoryLike): string {
  if (!c) return '';
  if (typeof c === 'string') return c.trim();
  return String(c.name ?? '').trim();
}

function categorySlug(c: CategoryLike): string | null {
  if (!c || typeof c === 'string') return null;
  const s = String(c.slug ?? '').trim();
  return s || null;
}

function hasProductPhoto(p: ShowcaseProduct): boolean {
  return !String(p.image_url ?? '').trim().startsWith('/media/');
}

/** Farkli kategorilerden, one cikanlar once, en fazla `max` urun secer.
 *  Onem sirasi API'nin `order_num desc` sirasidir; ilk urun buyuk kartta gosterilir. */
export function pickShowcaseProducts(products: ShowcaseProduct[], max = 3): ShowcaseProduct[] {
  const usable = products.filter((p) => p && p.title && p.slug && p.image_url);
  const ordered = [
    ...usable.filter((p) => Number(p.is_featured ?? 0) === 1),
    ...usable.filter((p) => Number(p.is_featured ?? 0) !== 1),
  ];
  // Hero'da urunun kendisi gorunmeli: yuklenmis urun fotografi olanlar, genel doku/stok
  // gorseli (/media/...) kullananlardan once secilir. Siralama icinde onem korunur.
  const photos = ordered.filter(hasProductPhoto);
  const pool = [...photos, ...ordered.filter((p) => !hasProductPhoto(p))];
  const picked: ShowcaseProduct[] = [];
  const seen = new Set<string>();
  for (const p of photos.length > 0 ? photos : pool) {
    const key = categoryName(p.category).toLowerCase() || `__${p.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(p);
    if (picked.length >= max) break;
  }
  for (const p of pool) {
    if (picked.length >= max) break;
    if (!picked.includes(p)) picked.push(p);
  }
  // Secim kategori cesitliligiyle yapilir, gosterim sirasi yine onem sirasidir.
  return picked.sort((a, b) => ordered.indexOf(a) - ordered.indexOf(b));
}

/** Urun listesinden benzersiz kategori cipleri (gorunum sirasi korunur). */
export function collectShowcaseCategories(products: ShowcaseProduct[], max = 6): ShowcaseCategory[] {
  const out: ShowcaseCategory[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    const name = categoryName(p.category);
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name, slug: categorySlug(p.category) });
    if (out.length >= max) break;
  }
  return out;
}

export function HeroProductShowcase({
  locale,
  products,
  categories,
  labels,
}: {
  locale: string;
  products: ShowcaseProduct[];
  categories: ShowcaseCategory[];
  labels: { heading: string; viewAll: string; categories: string };
}) {
  const productsPath = localizedPath(locale, '/products');

  return (
    <aside className={styles.showcase} aria-labelledby="hero-showcase-heading">
      <div className={styles.showcaseHead}>
        <p id="hero-showcase-heading" className={styles.showcaseLabel}>
          {labels.heading}
        </p>
        <Link href={productsPath} className={styles.showcaseAll}>
          {labels.viewAll}
          <ArrowRight className={styles.showcaseAllIcon} aria-hidden="true" />
        </Link>
      </div>

      <div className={styles.mosaic}>
        {products.map((p, index) => {
          const src = resolvePublicAssetUrl(p.image_url) ?? PLACEHOLDER_SRC;
          const title = stripHtmlToText(p.title) || '';
          const cat = categoryName(p.category);
          const large = index === 0;
          return (
            <Link
              key={p.id ?? p.slug ?? index}
              href={localizedPath(locale, `/products/${p.slug}`)}
              className={large ? styles.tileLarge : styles.tile}
              title={title}
            >
              {/* Gorsel tamamen acik kalir; ad ve kategori altta ayri seritte (2026-09-25 geri bildirimi). */}
              <span className={styles.tileMedia}>
                <Image
                  src={src}
                  alt={stripHtmlToText(p.alt) || title}
                  fill
                  priority={large}
                  fetchPriority={large ? 'high' : 'auto'}
                  sizes={
                    large
                      ? '(max-width: 1023px) calc(100vw - 48px), 34vw'
                      : '(max-width: 1023px) calc(50vw - 30px), 17vw'
                  }
                  className={styles.tileImage}
                />
                <span className={styles.tileIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
              <span className={styles.tileBody}>
                {cat ? <span className={styles.tileCategory}>{cat}</span> : null}
                <span className={styles.tileTitle}>{title}</span>
                <ArrowRight className={styles.tileArrow} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>

      {categories.length > 0 ? (
        <ul className={styles.chips} aria-label={labels.categories}>
          {categories.map((c) => (
            <li key={c.slug ?? c.name}>
              <Link href={c.slug ? `${productsPath}?category=${encodeURIComponent(c.slug)}` : productsPath}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
