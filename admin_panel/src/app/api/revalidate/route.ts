import { type NextRequest, NextResponse } from "next/server";

const TARGETS_RAW = process.env.NEXT_PUBLIC_REVALIDATE_TARGETS || "http://localhost:3020";

function normalizeUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

const ALLOWED_TARGETS = new Set(
  TARGETS_RAW.split(",")
    .map((item) => normalizeUrl(item))
    .filter((item): item is string => Boolean(item))
);

function isAllowedDevelopmentTarget(target: string): boolean {
  if (process.env.NODE_ENV === "production") return false;

  try {
    const url = new URL(target);
    return ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const target = normalizeUrl(String(body?.target || ""));

    if (!target) return json({ ok: false, error: "invalid_target" }, 400);
    if (!ALLOWED_TARGETS.has(target) && !isAllowedDevelopmentTarget(target)) {
      return json({ ok: false, error: "target_not_allowed", target, allowed: [...ALLOWED_TARGETS] }, 403);
    }

    const res = await fetch(`${target}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: Boolean(body?.all), path: body?.path }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return json({ ok: false, error: data?.error || `HTTP ${res.status}` }, res.status);

    return json({ ok: true, target, ...data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "revalidate_proxy_failed";
    return json({ ok: false, error: message }, 502);
  }
}
