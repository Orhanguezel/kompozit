import { APP_NAME } from '@/lib/brand-name';
import { ImageResponse } from 'next/og';
import { fetchSetting } from '@/i18n/server';
import { asObj, siteUrlBase } from '@/seo/helpers';
import { resolveBrandLogo } from '@/lib/brand-assets';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters with fallbacks
    const title = searchParams.get('title') || APP_NAME;
    const subtitle = searchParams.get('subtitle') || 'Endüstriyel Kompozit Çözümleri';
    const domain = searchParams.get('domain') || new URL(siteUrlBase()).hostname;

    const setting = await fetchSetting('site_logo', 'tr');
    const logo = asObj(setting?.value);
    const selected = String(logo.url || logo.logo_url || logo.logo_light_url || '');
    const logoPath = resolveBrandLogo(selected, 'tr', 'light');
    const logoSrc = logoPath ? new URL(logoPath, siteUrlBase()).href : '';

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
            {logoSrc ? (
              <img src={logoSrc} alt={APP_NAME} width="250" style={{ objectFit: 'contain' }} />
            ) : (
              <div style={{ fontSize: 40, fontWeight: 'bold', color: '#ea580c' }}>{APP_NAME}</div>
            )}
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
                fontSize: 84,
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
              Composite Manufacturing
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
