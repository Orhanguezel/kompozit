'use client';

import { useEffect, useRef } from 'react';

type Props = {
  html: string;
  className?: string;
};

export function RichContentDisplay({ html, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const hasTwitter = html.includes('twitter-tweet') || html.includes('x.com/') || html.includes('twitter.com/');

  useEffect(() => {
    if (!hasTwitter) return;
    if (typeof window === 'undefined') return;

    const w = window as any;

    if (w.twttr?.widgets) {
      w.twttr.widgets.load(containerRef.current ?? undefined);
      return;
    }

    const existing = document.getElementById('twitter-widgets-js');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'twitter-widgets-js';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  }, [hasTwitter, html]);

  return (
    <div
      ref={containerRef}
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored rich content
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
