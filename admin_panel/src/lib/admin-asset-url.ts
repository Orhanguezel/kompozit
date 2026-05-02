const ABSOLUTE_URL_RE = /^(?:https?:)?\/\//i;

export function normalizeAdminAssetUrl(raw: unknown): string {
  const url = String(raw ?? "").trim();
  if (!url) return "";
  if (ABSOLUTE_URL_RE.test(url) || url.startsWith("data:") || url.startsWith("blob:")) return url;

  const withoutDot = url.replace(/^\.\//, "");
  if (withoutDot.startsWith("/")) return withoutDot;

  return `/${withoutDot.replace(/^\/+/, "")}`;
}

export function normalizeAdminStoredAssetPath(raw: unknown): string {
  return normalizeAdminAssetUrl(raw);
}
