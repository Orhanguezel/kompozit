// =============================================================
// AI Content Assist — Next.js API Route (Backend Proxy)
// =============================================================

import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.PANEL_API_URL || "http://127.0.0.1:8186";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cookieHeader = request.headers.get("cookie") || "";

    const res = await fetch(`${BACKEND_URL}/api/admin/ai/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI proxy error";
    return NextResponse.json({ ok: false, error: { message } }, { status: 500 });
  }
}
