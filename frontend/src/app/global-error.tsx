'use client';

// Root-level error boundary — catches errors thrown in [locale]/layout.tsx
// (which [locale]/error.tsx cannot catch, per Next.js App Router rules).
// next-intl is NOT available here; use hard-coded fallback strings.
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#0a0a0a',
          color: '#e5e5e5',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#c9a96e',
              marginBottom: '1rem',
            }}
          >
            MOE Kompozit
          </p>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            Beklenmedik bir hata oluştu
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#a3a3a3', marginBottom: '2rem' }}>
            An unexpected error occurred. Please try again.
          </p>
          {error.digest ? (
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: '#525252',
                marginBottom: '1.5rem',
              }}
            >
              ID: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: '#c9a96e',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: '0.75rem',
            }}
          >
            Tekrar Dene / Retry
          </button>
          <a
            href="/"
            style={{
              display: 'inline-block',
              border: '1px solid #404040',
              color: '#e5e5e5',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Ana Sayfa / Home
          </a>
        </div>
      </body>
    </html>
  );
}
