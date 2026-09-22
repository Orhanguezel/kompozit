'use client';

import { useEffect, useRef, useState } from 'react';
import Image from '@/components/ui/MeasuredImage';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronDown, Clock3, Mail, MapPin, Package, Phone } from 'lucide-react';
import { localizedPath } from '@/seo/helpers';
import styles from './desktop-mega-menu.module.css';

export type HeaderMenuItem = {
  title: string;
  url: string;
  image?: string;
  description?: string;
  children: HeaderMenuItem[];
};

export type HeaderContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
};

export function DesktopMegaMenu({ items, locale, contact }: {
  items: HeaderMenuItem[];
  locale: string;
  contact?: HeaderContactInfo;
}) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = `desktop-menu-${locale}`;
  const products = items.find((item) => /\/products(?:\?|$)/.test(item.url));
  const productCategories = products?.children.filter((item) => item.url.includes('category=')) ?? [];

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const show = (index: number) => { cancelClose(); setOpen(index); };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 180);
  };

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(null);
    };
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('pointerdown', outside);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <nav ref={navRef} className={styles.nav} aria-label={t('home') + ' / ' + t('products')}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open !== null) {
          event.preventDefault();
          navRef.current?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${open}"]`)?.focus();
          cancelClose();
          setOpen(null);
        }
      }}>
      <ul className={styles.menu}>
        {items.map((item, index) => {
          const children = item.children;
          const hasChildren = children.length > 0;
          const isOpen = open === index;
          const isCollection = item === products && productCategories.length > 0;
          const isGroup = item.url === '#';
          const panelId = `${id}-panel-${index}`;
          const triggerId = `${id}-trigger-${index}`;
          return (
            <li key={`${item.url}-${index}`}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') { cancelClose(); setOpen(hasChildren ? index : null); }
              }}
              onPointerLeave={(event) => { if (event.pointerType === 'mouse') scheduleClose(); }}>
              <div className={styles.triggerRow}>
                {isGroup && hasChildren ? (
                  <button type="button" id={triggerId} data-menu-trigger={index}
                    className={styles.menuLink} aria-expanded={isOpen} aria-controls={panelId}
                    onClick={() => { cancelClose(); setOpen(isOpen ? null : index); }}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown') { event.preventDefault(); show(index); requestAnimationFrame(() => document.getElementById(panelId)?.querySelector<HTMLAnchorElement>('a')?.focus()); }
                    }}>
                    {item.title}<ChevronDown className={isOpen ? styles.rotated : ''} size={12} />
                  </button>
                ) : (
                  <>
                    <Link href={item.url} title={item.title} className={styles.menuLink}
                      onFocus={() => { cancelClose(); setOpen(hasChildren ? index : null); }}
                      onClick={() => setOpen(null)}>{item.title}</Link>
                    {hasChildren && (
                      <button type="button" id={triggerId} data-menu-trigger={index} className={styles.chevron}
                        aria-label={item.title} aria-expanded={isOpen} aria-controls={panelId}
                        onClick={() => { cancelClose(); setOpen(isOpen ? null : index); }}
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowDown') { event.preventDefault(); show(index); requestAnimationFrame(() => document.getElementById(panelId)?.querySelector<HTMLAnchorElement>('a')?.focus()); }
                        }}><ChevronDown className={isOpen ? styles.rotated : ''} size={12} /></button>
                    )}
                  </>
                )}
              </div>
              {hasChildren && (
                <section id={panelId} aria-labelledby={triggerId} className={styles.panel} hidden={!isOpen}
                  onPointerEnter={cancelClose} onClick={(event) => {
                    if (event.target instanceof Element && event.target.closest('a')) { cancelClose(); setOpen(null); }
                  }}>
                  <div className={styles.panelBody}>
                  <div className={styles.panelHeading}>
                    <p className={styles.title}>{item.title}</p>
                    {!isGroup && <Link href={item.url}>{children.find((child) => child.url === item.url)?.title || item.title}<ArrowRight size={16} /></Link>}
                  </div>
                  {isCollection ? (
                    <div className={styles.collection}>
                      {productCategories.map((child) => (
                        <Link href={child.url} key={child.url} title={child.title} className={styles.card}>
                          <span className={styles.image}>
                            {/* Kartin erisilebilir adi zaten baslik metninden geliyor; gorsel dekoratif. */}
                            {child.image ? <Image src={child.image} alt="" aria-hidden="true" fill sizes="(min-width:1280px) 230px, 180px" /> : <Package aria-hidden="true" size={36} />}
                          </span>
                          <span className={styles.cardTitle}>{child.title}<ArrowRight aria-hidden="true" size={16} /></span>
                          {child.description && <span className={styles.description}>{child.description}</span>}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.corporate}>
                      <div className={styles.links}>
                        {children.map((child) => <Link href={child.url} key={child.url} title={child.title}>{child.title}<ArrowRight aria-hidden="true" size={16} /></Link>)}
                      </div>
                      {products && productCategories.length > 0 && <div className={styles.related}>
                        <p className={styles.title}><Link href={products.url}>{products.title}</Link></p>
                        {productCategories.map((child) => <Link href={child.url} key={child.url}>{child.title}</Link>)}
                      </div>}
                      <aside className={styles.contact}>
                        <p className={styles.title}>{t('contact')}</p>
                        {contact?.address && <p><MapPin size={16} /><span>{contact.address}</span></p>}
                        {contact?.hours && <p><Clock3 size={16} /><span>{contact.hours}</span></p>}
                        {contact?.phone && <a href={`tel:${contact.phone.replace(/\s/g, '')}`}><Phone size={16} /><span>{contact.phone}</span></a>}
                        {contact?.email && <a href={`mailto:${contact.email}`}><Mail size={16} /><span>{contact.email}</span></a>}
                        <Link className={styles.offer} href={localizedPath(locale, '/offer')}>{t('offer')}<ArrowRight size={16} /></Link>
                      </aside>
                    </div>
                  )}
                  </div>
                </section>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
