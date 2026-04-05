'use client';

import type { CSSProperties, ReactEventHandler } from 'react';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 1 1%22%3E%3Crect fill%3D%22%23222%22 width%3D%221%22 height%3D%221%22%2F%3E%3C%2Fsvg%3E';

type OptimizedImageProps = Omit<ImageProps, 'placeholder' | 'blurDataURL'> & {
  fallbackClassName?: string;
};

const BACKEND_PATH_RE = /^\/(media|uploads|storage)\//;

function isBackendPath(src: string | undefined): boolean {
  if (!src || typeof src !== 'string') return false;
  return BACKEND_PATH_RE.test(src);
}

const errorFallback = (className?: string, alt?: string) => (
  <div
    className={cn(
      'flex items-center justify-center bg-(--color-border) text-(--color-text-muted)',
      className,
    )}
    role="img"
    aria-label={alt}
  >
    <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
    </svg>
  </div>
);

export function OptimizedImage({
  className,
  fallbackClassName,
  alt,
  onLoad,
  fill,
  sizes,
  style,
  priority,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  const src = typeof props.src === 'string' ? props.src : undefined;
  const useNativeImg = isBackendPath(src) || props.unoptimized === true;

  if (error) {
    return errorFallback(fallbackClassName ?? className, alt);
  }

  // Backend paths: plain <img> — avoids Next.js optimizer 400 and placeholder issues
  if (useNativeImg && fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ''}
        className={cn(className)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: (style as CSSProperties | undefined)?.objectFit ?? 'cover',
          ...style,
        }}
        onLoad={onLoad as ReactEventHandler<HTMLImageElement>}
        onError={() => setError(true)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  // External/CDN paths: use Next.js Image with optimization
  return (
    <Image
      {...props}
      alt={alt ?? ''}
      fill={fill}
      sizes={sizes}
      style={style}
      priority={priority}
      className={cn('transition-opacity duration-300', className)}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onLoad={onLoad}
      onError={() => setError(true)}
    />
  );
}
