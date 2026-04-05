/**
 * Admin: ana sayfa vitrin site_settings (DB key: kompozit__home.*) için JSON doğrulama.
 * Public API: GET /site_settings/home.hero?prefix=kompozit__ — sözleşme docs/SITE_SETTINGS_KEYS_CONTRACT.md
 */

export const KOMPOZIT_HOME_PAGE_SETTINGS_PREFIX = "kompozit__home.";

export function isKompozitHomeSettingKey(key: string): boolean {
  return typeof key === "string" && key.startsWith(KOMPOZIT_HOME_PAGE_SETTINGS_PREFIX);
}

export type KompozitHomeJsonParseResult =
  | { status: "empty" }
  | { status: "invalid"; message: string }
  | { status: "valid"; value: Record<string, unknown> };

export function parseKompozitHomeSettingRawText(rawText: string): KompozitHomeJsonParseResult {
  const trimmed = (rawText ?? "").trim();
  if (!trimmed) return { status: "empty" };

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { status: "invalid", message: "root_must_be_object" };
    }
    return { status: "valid", value: parsed as Record<string, unknown> };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "parse_error";
    return { status: "invalid", message: msg };
  }
}
