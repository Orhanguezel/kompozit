# OG marka düzeltmesi — 2026-09-22

- 13 kart × Türkçe/İngilizce = 26 ana görsel; 1200×630 PNG.
- Kaynak marka: `frontend/public/brand/moe-2026-09-09/logo-1-{tr,en}-dark-600.webp`.
- MOE ve marka yazısı resmi dosyadan alınır. Marka yazısı sağa taşınır; logo yeniden çizilmez.
- Raster arka planlar imagegen ile temizlendi. Kesin logo ve metinler `frontend/scripts/render-og-brand-cards.mjs` tarafından yerleştirilir.
- Türkçe ana sayfa: çöp konteyneri. İngilizce ana sayfa: tabut. Lunapark kabinleri ile Noel Baba/geyik ayrı panellerdedir.
- İletişim kartındaki örnek iletişim bilgileri kaldırıldı.
- Mevcut dosya yolları korunur; eski kolaj yolları düzeltilmiş ana sayfa kartına eşlenir. Orijinaller `originals/` altında saklanır.
- `og-*.png` Türkçe; `og-*-en.png` İngilizce. `catalog.json` dosya eşlemesini içerir.
- Önizleme: `index.html`. Teslim paketi: `moe-og-tr-en.zip`.
- Ana sayfa ve ana bölüm paylaşım uçları dile göre yeni PNG'yi sunar. Dinamik detay kartlarında da resmi logo kullanılır; özel ürün fotoğrafları korunur.

## Doğrulama

- Production build başarılı.
- 32 PNG (26 ana kart ve uyumluluk kopyaları) açıldı, 1200×630 ölçüsü doğrulandı.
- 18 dil/bölüm paylaşım yanıtı kaynak PNG ile birebir eşleşti; iki dinamik kart da doğru ölçüde üretildi.
- Yerel sitemap denetimi: 72 sayfa, 51 görsel, sıfır hata (`local-og-audit.json`).
- Yayın paketi SHA-256: `cebee00a1b6693aa771aa81c796d1060ec9b029c0d5de6dd185fd4977bcdb207`.
- Canlı yayın tamamlandı. Geri dönüş kopyası: `/var/www/Ensotek/kompozit/frontend/.next/standalone.before-checklist-20260922T124057Z`.
- Canlı sitemap denetimi: 72 sayfa, 51 görsel, sıfır hata (`live-og-audit.json`).
- Canlı `/og/` altındaki 26 kartın tamamı yerel dosyalarla birebir eşleşti; ayrıca 6 TR/EN paylaşım yanıtı karşılaştırıldı.
