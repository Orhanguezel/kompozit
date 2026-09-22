import dimensions from './media-dimensions.json';

/** Only measured, same-site assets are eligible; unknown URLs keep their original layout. */
export function measuredMedia(src: unknown): { width: number; height: number } | undefined {
  if (typeof src !== 'string') return;
  let path = src;
  if (/^https?:\/\//.test(src)) {
    const url = new URL(src);
    if (!['karbonkompozit.com.tr', 'www.karbonkompozit.com.tr'].includes(url.hostname)) return;
    path = url.pathname;
  }
  return (dimensions as Record<string, { width: number; height: number }>)[path.split('?')[0] || ''];
}
