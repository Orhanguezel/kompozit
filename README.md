# Karbonkompozit

Karbon kompozit malzeme çözümleri için **kurumsal web platformu** — ürün kataloğu, içerik yönetimi ve çok dilli site.

🌐 Canlı: <https://karbonkompozit.com.tr>

## Yapı

| Klasör | Açıklama | Stack | Port |
|--------|----------|-------|------|
| `frontend/` | Genel kullanıcı sitesi | Next.js 16, React 19, next-intl, React Query, Tailwind v4 | 3020 |
| `backend/` | REST API | Fastify 5, Drizzle ORM, MySQL, Zod | — |
| `admin_panel/` | Yönetim paneli | Next.js 16, Redux Toolkit, Tailwind v4 | — |

Bu projenin **kendi veritabanı** vardır (`kompozit`).

## Kurulum & Çalıştırma

```bash
# frontend
cd frontend && bun install && bun run dev

# backend
cd backend && bun install && bun run dev
cd backend && bun run db:seed:kompozit:fresh   # DB'yi sıfırdan kur

# admin_panel
cd admin_panel && bun install && bun run dev
```

## Test & Denetim

`frontend/` altında smoke testleri ve denetim scriptleri vardır:

```bash
bun run test:smoke:home-content
bun run test:seo
bun run audit:lighthouse
```

## Ortam Değişkenleri

`.env` dosyaları repoya **dahil değildir** (`.gitignore`).

## Deploy

- **VPS:** `ssh vps-Ensotek` (Hostinger, Ubuntu)
- **PM2:** `karbonkompozit` (port 3020)
- **Domain:** karbonkompozit.com.tr — nginx reverse proxy

> Şema değişikliği: `ALTER TABLE` kullanılmaz. İlgili `src/db/seed/sql/0XX_*_schema.sql` güncellenir, `db:seed:kompozit:fresh` ile DB sıfırdan kurulur.

## Ortak Paketler

`backend/`, `Ensotek/packages/shared-backend` altındaki ortak modülleri root `bun` workspace üzerinden kullanır.
