/** The deployment name is the final brand fallback; customer text comes from site_settings. */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME?.trim() || 'Composite Solutions';
export function resolveBrandName(...values: unknown[]): string {
  return values.find((value): value is string => typeof value === 'string' && value.trim().length > 0)?.trim() || APP_NAME;
}
