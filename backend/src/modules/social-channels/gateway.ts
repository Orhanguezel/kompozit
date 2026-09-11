import type { RowDataPacket } from "mysql2";
import { pool } from "@/db/client";

export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "x";
const PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "linkedin", "x"];
type Profile = { id: string; name?: string; status?: string; platform?: string; expires_at?: string | null };
type ProxyPost = {
  id: string;
  body?: string;
  status?: string;
  source?: string;
  scheduled_at?: string | null;
  created_at?: string | null;
  media?: Array<string | { url?: string; source_url?: string; thumbnail_url?: string }>;
  platforms?: Array<{ platform?: string; status?: string; permalink?: string | null; error?: string | null }>;
};
type SettingRow = RowDataPacket & { setting_value: string };

const proxyName = (platform: SocialPlatform) => (platform === "x" ? "twitter" : platform);
const baseUrl = () => (process.env.POSTPROXY_BASE_URL?.trim() || "https://api.postproxy.dev").replace(/\/+$/, "");
const required = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`social_postproxy_env_missing:${name}`);
  return value;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${required("POSTPROXY_API_KEY")}`,
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
    },
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string; message?: string };
  if (!response.ok) throw new Error(`postproxy_api_failed:${data.error ?? data.message ?? response.status}`);
  return data;
}

async function getSetting(key: string) {
  const [rows] = await pool.execute<SettingRow[]>(
    "SELECT setting_value FROM social_integration_settings WHERE setting_key=? LIMIT 1",
    [key],
  );
  return rows[0]?.setting_value?.trim() || null;
}

async function setSetting(key: string, value: string) {
  await pool.execute(
    "INSERT INTO social_integration_settings (setting_key,setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)",
    [key, value],
  );
}

async function groupId() {
  const existing = await getSetting("postproxy_profile_group_id");
  if (existing) return existing;
  const data = await request<{ id?: string; profile_group?: { id?: string } }>("/api/profile_groups", {
    method: "POST",
    body: JSON.stringify({ profile_group: { name: process.env.SOCIAL_POSTPROXY_TENANT_NAME || "MOE Kompozit" } }),
  });
  const id = data.profile_group?.id ?? data.id;
  if (!id) throw new Error("postproxy_profile_group_id_missing");
  await setSetting("postproxy_profile_group_id", id);
  return id;
}

async function profiles(id: string) {
  const query = new URLSearchParams({ profile_group_id: id });
  const data = await request<Profile[] | { data?: Profile[]; profiles?: Profile[]; items?: Profile[] }>(`/api/profiles?${query}`);
  return Array.isArray(data) ? data : data.data ?? data.profiles ?? data.items ?? [];
}

export async function statuses() {
  const configured = Boolean(process.env.POSTPROXY_API_KEY?.trim());
  if (!configured) return PLATFORMS.map((platform) => ({ platform, configured, missing: ["POSTPROXY_API_KEY"], connection: null }));
  const id = await getSetting("postproxy_profile_group_id");
  const current = id ? await profiles(id) : [];
  return PLATFORMS.map((platform) => {
    const profile = current.find((item) => item.platform === proxyName(platform));
    return {
      platform,
      configured,
      missing: [],
      connection: profile ? {
        platform,
        status: profile.status === "active" ? "connected" : profile.status === "expired" ? "expired" : "error",
        external_account_id: profile.id,
        external_account_name: profile.name ?? null,
        expires_at: profile.expires_at ?? null,
      } : null,
    };
  });
}

export async function authorizationUrl(platform: SocialPlatform) {
  const id = await groupId();
  const returnBase = required("SOCIAL_POSTPROXY_ADMIN_RETURN_URL").replace(/\/+$/, "");
  const data = await request<{ url?: string; authorization_url?: string; connection_url?: string }>(
    `/api/profile_groups/${encodeURIComponent(id)}/initialize_connection`,
    {
      method: "POST",
      body: JSON.stringify({
        platform: proxyName(platform),
        redirect_url: `${returnBase}/admin/social/${platform}?oauth=connected`,
      }),
    },
  );
  const url = data.url ?? data.authorization_url ?? data.connection_url;
  if (!url) throw new Error("postproxy_authorization_url_missing");
  return { authorization_url: url };
}

export async function disconnect(platform: SocialPlatform) {
  const id = await getSetting("postproxy_profile_group_id");
  if (!id) return { ok: true };
  const current = await profiles(id);
  await Promise.all(current.filter((item) => item.platform === proxyName(platform)).map((item) =>
    request(`/api/profiles/${encodeURIComponent(item.id)}`, { method: "DELETE" }),
  ));
  return { ok: true };
}

export async function livePosts(platform: SocialPlatform) {
  const id = await getSetting("postproxy_profile_group_id");
  if (!id) return { items: [], total: 0 };
  const query = new URLSearchParams({ profile_group_id: id, page: "0", per_page: "100" });
  query.append("platforms[]", proxyName(platform));
  const data = await request<{ data?: ProxyPost[]; items?: ProxyPost[]; total?: number }>(`/api/posts?${query}`);
  const items = data.data ?? data.items ?? [];
  return {
    total: data.total ?? items.length,
    items: items.map((post) => {
      const target = post.platforms?.find((item) => item.platform === proxyName(platform));
      const media = post.media?.[0];
      return {
        id: post.id,
        platform,
        caption: post.body ?? "",
        status: target?.status ?? post.status ?? "published",
        source: post.source ?? "postproxy",
        scheduled_at: post.scheduled_at ?? null,
        created_at: post.created_at ?? null,
        media_url: typeof media === "string" ? media : media?.url ?? media?.source_url ?? media?.thumbnail_url ?? null,
        permalink: target?.permalink ?? null,
        error_message: target?.error ?? null,
      };
    }),
  };
}
