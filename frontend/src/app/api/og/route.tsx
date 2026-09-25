import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { APP_NAME } from '@/lib/brand-name';
import { ImageResponse } from 'next/og';
import { siteUrlBase } from '@/seo/helpers';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const cardLocale = searchParams.get('locale') === 'en' ? 'en' : 'tr';
    const page = searchParams.get('page') || '';
    const cards: Record<string, string> = {
      '/': 'home', '/about': 'about', '/blog': 'blog', '/contact': 'contact',
      '/gallery': 'gallery', '/offer': 'offer', '/products': 'products',
      '/references': 'references',
    };
    const legacyHome = /^product-collage-v[1-6]$/.test(searchParams.get('design') || '');
    const card = legacyHome ? 'home' : cards[page];
    if (card) {
      const photo = await readFile(join(process.cwd(), `public/og/og-${card}${cardLocale === 'en' ? '-en' : ''}.png`));
      return new Response(new Uint8Array(photo), {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
      });
    }
    const logo = await readFile(join(process.cwd(), `public/brand/moe-2026-09-09/og-horizontal-${cardLocale}.png`));

    // Get parameters with fallbacks
    const title = (searchParams.get('title') || APP_NAME).slice(0, 140);
    const english = searchParams.get('locale') === 'en';
    const subtitle = (searchParams.get('subtitle') || (english ? 'Industrial Composite Solutions' : 'Endüstriyel Kompozit Çözümleri')).slice(0, 120);
    const domain = searchParams.get('domain') || new URL(siteUrlBase()).hostname;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #000000 100%)',
            color: '#ffffff',
            padding: '80px',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
          }}
        >
          {/* Subtle grid pattern overlay for industrial tech feel */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Top Section - Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              zIndex: 10,
            }}
          >
            <img src={`data:image/png;base64,${logo.toString('base64')}`} width={490} height={64} alt={english ? 'MOE Composite' : 'MOE Kompozit'} />
          </div>

          {/* Middle Section - Text Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              zIndex: 10,
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: title.length > 55 ? 54 : 64,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                textTransform: 'uppercase',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              {title}
            </div>
            
            {/* Theme color accent line */}
            <div
              style={{
                width: '120px',
                height: '8px',
                backgroundColor: '#ea580c',
                borderRadius: '4px',
              }}
            />
            
            {subtitle && (
              <div
                style={{
                  display: 'flex',
                  fontSize: 36,
                  color: '#a3a3a3',
                  fontWeight: 500,
                  marginTop: '10px',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Bottom Section - Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                color: '#737373',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {domain}
            </div>
            
            <div
              style={{
                display: 'flex',
                padding: '12px 24px',
                backgroundColor: 'rgba(234, 88, 12, 0.15)',
                border: '2px solid rgba(234, 88, 12, 0.3)',
                borderRadius: '12px',
                color: '#ea580c',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {english ? 'Composite Manufacturing' : 'Kompozit Üretimi'}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
