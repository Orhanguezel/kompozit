const GA4_PROPERTY_ID = "547431151";
const GSC_SITE_URL = "https://karbonkompozit.com.tr/";
const GTM_ACCOUNT_ID = "6330619450";
const GTM_CONTAINER_ID = "259635545";

type GoogleError = { error?: { message?: string } | string; error_description?: string };
type GaRow = { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> };
type GscRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };

async function accessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_MARKETING_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) throw new Error("google_marketing_oauth_missing");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });
  const payload = await response.json() as { access_token?: string } & GoogleError;
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || String(payload.error || "google_token_failed"));
  }
  return payload.access_token;
}

async function googleFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({})) as T & GoogleError;
  if (!response.ok) {
    const error = payload.error;
    throw new Error(typeof error === "object" ? error?.message || "google_api_failed" : error || "google_api_failed");
  }
  return payload;
}

function dates(days: number) {
  const end = new Date(Date.now() - 2 * 86_400_000);
  const start = new Date(end.getTime() - days * 86_400_000);
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
}

function number(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getGa4Report(days = 28) {
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];
  const run = (body: Record<string, unknown>) =>
    googleFetch<{ rows?: GaRow[] }>(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      { method: "POST", body: JSON.stringify(body) },
    );
  const [totals, datesReport, channels, pages, devices] = await Promise.all([
    run({ dateRanges, metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "conversions" }] }),
    run({ dateRanges, dimensions: [{ name: "date" }], metrics: [{ name: "sessions" }, { name: "activeUsers" }], orderBys: [{ dimension: { dimensionName: "date" } }] }),
    run({ dateRanges, dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: [{ name: "sessions" }], limit: 10 }),
    run({ dateRanges, dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }], limit: 15 }),
    run({ dateRanges, dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "sessions" }] }),
  ]);
  const total = totals.rows?.[0]?.metricValues || [];
  const oneDimension = (row: GaRow) => ({
    label: row.dimensionValues?.[0]?.value || "",
    value: number(row.metricValues?.[0]?.value),
  });
  return {
    property: `properties/${GA4_PROPERTY_ID}`,
    days,
    totals: {
      users: number(total[0]?.value),
      sessions: number(total[1]?.value),
      views: number(total[2]?.value),
      conversions: number(total[3]?.value),
    },
    daily: (datesReport.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value || "",
      sessions: number(row.metricValues?.[0]?.value),
      users: number(row.metricValues?.[1]?.value),
    })),
    channels: (channels.rows || []).map(oneDimension),
    pages: (pages.rows || []).map(oneDimension),
    devices: (devices.rows || []).map(oneDimension),
  };
}

export async function getGscReport(days = 28) {
  const period = dates(days);
  const query = (dimensions?: string[]) =>
    googleFetch<{ rows?: GscRow[] }>(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`,
      { method: "POST", body: JSON.stringify({ ...period, ...(dimensions ? { dimensions } : {}), rowLimit: 25 }) },
    );
  const [totalReport, queriesReport, pagesReport, datesReport] = await Promise.all([
    query(),
    query(["query"]),
    query(["page"]),
    query(["date"]),
  ]);
  const row = (item: GscRow) => ({
    key: item.keys?.[0] || "",
    clicks: number(item.clicks),
    impressions: number(item.impressions),
    ctr: number(item.ctr),
    position: number(item.position),
  });
  return {
    site: GSC_SITE_URL,
    days,
    totals: row(totalReport.rows?.[0] || {}),
    queries: (queriesReport.rows || []).map(row),
    pages: (pagesReport.rows || []).map(row),
    daily: (datesReport.rows || []).map(row),
  };
}

export async function getGtmSummary() {
  const base = `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${GTM_ACCOUNT_ID}/containers/${GTM_CONTAINER_ID}`;
  const [container, workspaces] = await Promise.all([
    googleFetch<{ name?: string; publicId?: string; domainName?: string[] }>(base),
    googleFetch<{ workspace?: Array<{ path?: string; name?: string; workspaceId?: string }> }>(`${base}/workspaces`),
  ]);
  const workspace = workspaces.workspace?.find((item) => item.name === "Default Workspace") || workspaces.workspace?.[0];
  const workspacePath = workspace?.path;
  const [tags, triggers, variables] = workspacePath
    ? await Promise.all([
        googleFetch<{ tag?: unknown[] }>(`https://tagmanager.googleapis.com/tagmanager/v2/${workspacePath}/tags`),
        googleFetch<{ trigger?: unknown[] }>(`https://tagmanager.googleapis.com/tagmanager/v2/${workspacePath}/triggers`),
        googleFetch<{ variable?: unknown[] }>(`https://tagmanager.googleapis.com/tagmanager/v2/${workspacePath}/variables`),
      ])
    : [{ tag: [] }, { trigger: [] }, { variable: [] }];
  return {
    account_id: GTM_ACCOUNT_ID,
    container_id: GTM_CONTAINER_ID,
    public_id: container.publicId || "GTM-NCVJZX6H",
    name: container.name || "karbonkompozit.com.tr",
    domains: container.domainName || [],
    workspace: workspace?.name || null,
    tags: tags.tag?.length || 0,
    triggers: triggers.trigger?.length || 0,
    variables: variables.variable?.length || 0,
  };
}

export async function getGoogleConnectionStatus() {
  const token = await accessToken();
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`);
  const payload = await response.json() as { scope?: string };
  const scopes = String(payload.scope || "").split(/\s+/).filter(Boolean);
  return {
    connected: response.ok,
    ga4: scopes.some((scope) => scope.includes("analytics")),
    gsc: scopes.some((scope) => scope.includes("webmasters")),
    gtm: scopes.some((scope) => scope.includes("tagmanager")),
    ads: scopes.some((scope) => scope.includes("adwords")),
  };
}
