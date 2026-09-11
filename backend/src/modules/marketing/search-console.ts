import { GoogleAuth, OAuth2Client } from "google-auth-library";
import type { RowDataPacket } from "mysql2";

import { pool } from "@/db/client";

type SettingRow = RowDataPacket & { value: string };

async function siteUrl() {
  const [rows] = await pool.query<SettingRow[]>(
    "SELECT `value` FROM site_settings WHERE `key`='gsc_site_url' AND locale='*' LIMIT 1",
  );
  if (!rows[0]?.value) throw new Error("gsc_site_url_missing");
  try {
    return String(JSON.parse(rows[0].value));
  } catch {
    return rows[0].value;
  }
}

function credentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) throw new Error("google_service_account_missing");
  try {
    return JSON.parse(raw) as { client_email: string; private_key: string };
  } catch {
    throw new Error("google_service_account_invalid");
  }
}

async function inspectionAccessToken() {
  const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (serviceAccount) {
    const auth = new GoogleAuth({
      credentials: credentials(),
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    if (token.token) return token.token;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_MARKETING_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) throw new Error("google_inspection_credentials_missing");
  const client = new OAuth2Client(clientId, clientSecret);
  client.setCredentials({ refresh_token: refreshToken });
  const token = await client.getAccessToken();
  if (!token.token) throw new Error("google_access_token_missing");
  return token.token;
}

export async function inspectGoogleUrl(url: string) {
  const inspectedUrl = new URL(url);
  if (!["http:", "https:"].includes(inspectedUrl.protocol)) throw new Error("invalid_url");
  const token = await inspectionAccessToken();
  const response = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: inspectedUrl.toString(), siteUrl: await siteUrl() }),
  });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(`gsc_inspection_failed:${response.status}`);
  await pool.execute(
    `INSERT INTO google_url_inspections (url,result_json,inspected_at)
     VALUES (?,?,NOW(3))
     ON DUPLICATE KEY UPDATE result_json=VALUES(result_json),inspected_at=NOW(3)`,
    [inspectedUrl.toString(), JSON.stringify(payload)],
  );
  return { url: inspectedUrl.toString(), result: payload, inspected_at: new Date().toISOString() };
}

export async function cachedGoogleUrl(url: string) {
  const [rows] = await pool.query<Array<RowDataPacket & { result_json: string; inspected_at: string }>>(
    "SELECT result_json,inspected_at FROM google_url_inspections WHERE url=? LIMIT 1",
    [url],
  );
  if (!rows[0]) return null;
  return {
    url,
    result: typeof rows[0].result_json === "string" ? JSON.parse(rows[0].result_json) : rows[0].result_json,
    inspected_at: rows[0].inspected_at,
  };
}
