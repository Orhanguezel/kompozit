import { APP_NAME } from '@/lib/brand-name';
import Image from 'next/image';

export type BrandLogoConfig = { default: string; dark: string; light: string; alt?: string };

function LogoImage({ src, alt, className, priority }: {
  src: string; alt: string; className: string; priority: boolean;
}) {
  // Keep the original artwork. Only adjust the Turkish wordmark's layout.
  // The stepped boundary preserves the İ dot separately from the metallic O.
  const adjustWordmark = /\/moe-2026-09-09\/logo-1-tr-(light|dark)-600\.webp$/.test(src);
  const image = { src, fill: true as const, sizes: '160px', priority, className: `object-contain ${className}` };
  if (!adjustWordmark) return <Image {...image} alt={alt} />;

  return <>
    <Image {...image} alt={alt} style={{ clipPath: 'polygon(0 0,100% 0,100% 70%,66.6667% 70%,66.6667% 74.5455%,0 74.5455%)' }} />
    <Image {...image} alt="" aria-hidden="true" style={{
      clipPath: 'polygon(0 74.5455%,66.6667% 74.5455%,66.6667% 70%,100% 70%,100% 100%,0 100%)',
      transform: `translate(${src.includes('-dark-') ? '0.3333%' : '0.1667%'},2.2727%)`,
    }} />
  </>;
}

export function BrandLogo({ logo, priority = false }: { logo: BrandLogoConfig; priority?: boolean }) {
  const dark = logo.dark || logo.default || logo.light;
  const light = logo.light || logo.default || logo.dark;
  const hasBoth = Boolean(dark && light && dark !== light);

  return (
    <span className="relative block h-full aspect-[30/11] shrink-0">
      <LogoImage src={dark} alt={logo.alt || APP_NAME} className={hasBoth ? 'logo-dark-mode' : ''} priority={priority} />
      {hasBoth && <LogoImage src={light} alt={logo.alt || APP_NAME} className="logo-light-mode" priority={priority} />}
    </span>
  );
}
