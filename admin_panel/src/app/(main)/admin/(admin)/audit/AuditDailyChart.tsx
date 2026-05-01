// =============================================================
// FILE: src/components/admin/audit/AuditDailyChart.tsx
// FIX:
//  - date can be "YYYY-MM-DD" OR ISO datetime -> normalize to "YYYY-MM-DD"
//  - tolerate alternate keys: day, dt, ts, created_at
// =============================================================

"use client";

import type React from "react";
import { useMemo, useState } from "react";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import type { AuditMetricsDailyRowDto } from "@/integrations/shared";

type Props = {
  rows: AuditMetricsDailyRowDto[];
  loading?: boolean;
  height?: number; // default 220
};

function n(v: unknown, fallback = 0) {
  const x = typeof v === "number" ? v : Number(v);
  return Number.isFinite(x) ? x : fallback;
}

function toYmd(input: unknown): string {
  const s = String(input ?? "").trim();
  if (!s) return "";
  // already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // ISO datetime -> take first 10 chars
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 10);
  // fallback: try Date parse
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return s; // last resort (won't crash)
}

function fmtDayLabel(isoOrDate: string) {
  const ymd = toYmd(isoOrDate);
  const m = String(ymd).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(isoOrDate || "");
  return `${m[3]}.${m[2]}`;
}

function fmtIsoNice(isoOrDate: string) {
  const ymd = toYmd(isoOrDate);
  const m = String(ymd).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(isoOrDate || "");
  return `${m[3]}.${m[2]}.${m[1]}`;
}

type AuditDailyChartLooseRow = Partial<AuditMetricsDailyRowDto> & {
  day?: unknown;
  dt?: unknown;
  ts?: unknown;
  created_at?: unknown;
  count?: unknown;
  total_requests?: unknown;
  unique?: unknown;
  uniq_ips?: unknown;
  error_count?: unknown;
  fails?: unknown;
};

function normalizeAuditRow(row: AuditDailyChartLooseRow) {
  const rawDate = row.date ?? row.day ?? row.dt ?? row.ts ?? row.created_at ?? "";
  const date = toYmd(rawDate);

  return {
    date,
    label: fmtDayLabel(date),
    requests: n(row.requests ?? row.count ?? row.total_requests),
    unique_ips: n(row.unique_ips ?? row.unique ?? row.uniq_ips),
    errors: n(row.errors ?? row.error_count ?? row.fails),
  };
}

export const AuditDailyChart: React.FC<Props> = ({ rows, loading, height = 220 }) => {
  const t = useAdminT("admin.audit");
  const [showUnique, setShowUnique] = useState(true);
  const [showErrors, setShowErrors] = useState(true);

  const data = useMemo(() => {
    const a = Array.isArray(rows) ? rows : [];
    return [...a]
      .map((r) => normalizeAuditRow(r as AuditDailyChartLooseRow))
      .filter((x) => !!x.date && /^\d{4}-\d{2}-\d{2}/.test(x.date))
      .sort((x, y) => String(x.date).localeCompare(String(y.date)));
  }, [rows]);

  const hasAny = data.length > 0;

  // ---- SVG layout ----
  const W = 980;
  const H = Math.max(140, Math.min(360, height));
  const padL = 42;
  const padR = 14;
  const padT = 12;
  const padB = 30;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxRequests = useMemo(() => {
    const m = data.reduce((acc, r) => Math.max(acc, r.requests), 0);
    return Math.max(1, m);
  }, [data]);

  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }).map((_, i) => Math.round((maxRequests * (yTicks - i)) / yTicks));

  const barGap = 6;
  const barCount = Math.max(1, data.length);
  const barW = Math.max(8, Math.floor((chartW - barGap * (barCount - 1)) / barCount));

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <div className="text-muted-foreground text-sm">
          {t("chart.lastDaysSummary", { count: String(data.length || 0) })}: <strong>{t("chart.requests")}</strong>{" "}
          {t("chart.bar")}
          {showUnique ? `, ${t("chart.unique")}` : ""} {showErrors ? `, ${t("chart.errors")}` : ""}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <label className="mb-0 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showUnique} onChange={(e) => setShowUnique(e.target.checked)} />
            {t("chart.uniqueIp")}
          </label>

          <label className="mb-0 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showErrors} onChange={(e) => setShowErrors(e.target.checked)} />
            {t("chart.errors")}
          </label>

          {loading && <span className="text-muted-foreground text-sm">{t("chart.loading")}</span>}
        </div>
      </div>

      {!hasAny && !loading && (
        <div className="rounded-md border border-muted bg-muted/40 px-3 py-2 text-sm">
          {t("chart.empty")}
        </div>
      )}

      <div className="overflow-hidden rounded border bg-card">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={t("chart.ariaLabel")}>
          <rect x="0" y="0" width={W} height={H} fill="white" />

          {tickVals.map((tv, i) => {
            const y = padT + (chartH * i) / yTicks;
            return (
              <g key={`t-${tv}`}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e9ecef" strokeWidth="1" />
                <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#6c757d">
                  {tv}
                </text>
              </g>
            );
          })}

          {data.map((r, idx) => {
            const x = padL + idx * (barW + barGap);
            const h = Math.round((r.requests / maxRequests) * chartH);
            const y = padT + (chartH - h);

            return (
              <g key={`${r.date}-${idx}`}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx="3"
                  fill="#0d6efd"
                  opacity={r.requests === 0 ? 0.25 : 0.9}
                />
                {(data.length <= 14 || idx % 2 === 0) && (
                  <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#6c757d">
                    {r.label}
                  </text>
                )}
              </g>
            );
          })}

          <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#dee2e6" strokeWidth="1" />
        </svg>

        {hasAny && (
          <div className="flex items-center justify-between border-t px-3 py-2 text-muted-foreground text-sm">
            <div>{data[data.length - 1]?.date ? fmtIsoNice(data[data.length - 1].date) : "-"}</div>
            <div className="flex gap-3">
              <span>
                {t("chart.requests")}: <strong className="text-foreground">{data[data.length - 1]?.requests ?? 0}</strong>
              </span>
              {showUnique && (
                <span>
                  {t("chart.unique")}: <strong className="text-foreground">{data[data.length - 1]?.unique_ips ?? 0}</strong>
                </span>
              )}
              {showErrors && (
                <span>
                  {t("chart.errors")}: <strong className="text-foreground">{data[data.length - 1]?.errors ?? 0}</strong>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
