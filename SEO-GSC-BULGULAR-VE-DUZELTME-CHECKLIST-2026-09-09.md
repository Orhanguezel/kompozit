# MOE Kompozit — SEO/GSC bulguları ve düzeltme checklist’i

**Tarih:** 9 Eylül 2026. **Durum:** Canlı bulgular doğrulandı; düzeltmeler henüz uygulanmadı.
**Bu dosya, kompozit web düzeltmelerinin takip belgesidir.** İş ilerledikçe durum ve kanıtlar burada güncellenecek.

**9 Eylül ek denetimi:** [Kapsamlı site denetimi](DENETIM-RAPORU-2026-09-09.md) tamamlandı: 16 doğrulanmış sorun grubu; 72 URL taraması, sitemap alternatifleri, mobil/masaüstü tarayıcı ve Lighthouse kanıtları eklendi. Yeni ölçümde sitemap 60 URL; sekiz makale hâlâ dışarıda. Bu ek denetim kod düzeltmesi veya deploy içermez; aşağıdaki eski ölçümler kendi zamanlarına aittir.

- Web: https://www.karbonkompozit.com.tr/tr
- GSC mülkü: `https://www.karbonkompozit.com.tr/` (URL-prefix; doğru host/protokol eşleşmesi)
- Tanitio tenant: `moe-kompozit-4de92704`; ikinci tenant açılmayacak.
- Web kaynak kodu: bu deponun `frontend/` ve `backend/` dizinleri.
- Canlı host: `vps-Ensotek`. Bu belgeyi yazma talebi deploy/restart veya GSC yazma yetkisi değildir.

## 1. Öncelik: makaleler sitemap’ten düşüyor

**Kanıtlanan kök neden:** `frontend/src/app/sitemap.ts` içindeki `withDefaultParams` / `fetchItems`, makale sorgusuna `limit=500` ekliyor. API maksimum 250 kabul ediyor. HTTP hatası `[]` olarak yutulduğu için sitemap makalesiz üretiliyor.

Hata veren gerçek istek:

```text
https://www.karbonkompozit.com.tr/api/custom-pages?module_key=kompozit_blog&locale=tr&is_active=1&limit=500
HTTP 400 — validation_error; limit maximum=250
```

Aynı sorgu `limit=200` ile HTTP 200 döndürüyor. Canlı `/tr/blog` dört yazı listeliyor; `/sitemap.xml` 62 URL içeriyor, blog liste sayfaları var ama makale detayları yok.

### Yapılacaklar ve kabul

- [ ] Makale API’sinin güncel filtre ve sayfalama sözleşmesini doğrula; limit uyumsuzluğunu düzelt.
- [ ] Sayı sınırını aşan içeriklerde eksik URL bırakmayacak sayfalama uygula.
- [ ] Çekim hatasının sessizce boş içerik diye değerlendirilmesini önle; hata görünür olsun.
- [ ] Yalnız yayımlanmış içerikleri dahil et; `is_active` ile `is_published` ayrımını doğrula.
- [ ] TR/EN yayımlanmış makale URL kümesini sitemap URL kümesiyle karşılaştır; eksik, yinelenen veya taslak URL kalmasın.
- [ ] Ürün, galeri, çözüm ve yasal sayfa sitemap kapsamının bozulmadığını doğrula.
- [ ] Makale URL’leri HTTP 200; beklenen canonical ve dil alternatifleri doğru.
- [ ] Gerçek API hata yanıtı ve yayımlanmış/taslak ayrımı için hedefli regresyon kontrolü yap.

Kanıt: [routes.json](docs/seo/2026-09-09-gsc/routes.json), [public-audit.json](docs/seo/2026-09-09-gsc/public-audit.json).

## 2. Öncelik: Google farklı canonical seçiyor

Salt okunur Google URL Inspection API sonucu:

| İncelenen yol | Sonuç | Google canonical yolu | Site canonical yolu | Son Google taraması |
|---|---|---|---|---|
| `/tr/blog/ctp-fiberglass-farklari` | NEUTRAL — farklı canonical seçilmiş kopya | `/blog/ctp-fiberglass-farklari` | `/tr/blog/ctp-fiberglass-farklari` | 8 Eylül 2026 |
| `/tr/blog/karbon-fiber-nedir` | NEUTRAL — farklı canonical seçilmiş kopya | `/blog/karbon-fiber-nedir` | `/tr/blog/karbon-fiber-nedir` | 4 Ağustos 2026 |
| `/en/blog/karbon-fiber-nedir` | PASS — dizinde | `/en/blog/karbon-fiber-nedir` | Aynı | 9 Eylül 2026 |

Üçünde robots/indexing izinli, sayfa fetch başarılı. Karbon fiber Türkçe URL’sinin Google taraması eskidir; bugünkü HTTP durumu ile aynı şey değildir. Google’ın seçiminin yalnız sitemap hatasından kaynaklandığı kanıtlanmadı.

HTTP kontrolünde eski CTP yazısı güncel `/tr/blog/...` adresine ulaşıyor ve hedef self canonical. Bu kontrol ara yanıtların 301/308 olduğunu kanıtlamaz; yönlendirme zinciri ayrıca ölçülmeli.

Ek örnek: `/products/defense-industry-composite-parts` isteği `/tr/products/defense-industry-composite-parts` üzerinde HTTP 200 ve self canonical dönüyor. Sitemap’teki Türkçe ürün yolu `/tr/products/savunma-sanayi-kompozit-parcalari`. İçerik eşdeğerliği ve hangi adresin tek hedef olacağı doğrulanmalı.

### Yapılacaklar ve kabul

- [ ] Eski `/blog`, `/products` yollarını güncel `/tr` ve `/en` karşılıklarına eşleyen URL envanteri çıkar.
- [ ] www/non-www, eski/yeni slug ve dil yollarının HTTP zincirini ölç.
- [ ] Eşdeğer eski sayfaları doğru dilde tek nihai adrese kalıcı yönlendir; tüm eski adresleri ana sayfaya göndermeme.
- [ ] Canonical, iç link, sitemap ve karşılıklı hreflang aynı URL kararını kullansın.
- [ ] `/en/blog/karbon-fiber-nedir` içeriğinin dilini ve diğer İngilizce slug’larla eşdeğerliğini kontrol et. Türkçe slug tek başına hata değildir; indeksli URL’yi gereksiz değiştirme.
- [ ] Yönlendirme döngüsü, soft-404, yanlış dil ve çift içerik oluşmadığını gerçek URL örnekleriyle doğrula.
- [ ] Düzeltme canlıya çıktıktan sonra aynı üç URL ve diğer dil alternatiflerinde URL Inspection tekrarla.
- [ ] Google’ın canonical seçimi değişene kadar teknik kabul ile Google yeniden işleme sonucunu ayrı kaydet.

Kanıt: [gsc-url-inspection.json](docs/seo/2026-09-09-gsc/gsc-url-inspection.json).

## 3. Canlı GSC başlangıcı

Tanitio ekranının `/marketing/gsc/analytics` endpointinde kullandığı `fetchGscAnalytics`, canlı sunucuda MOE için `range=28`, `type=web` ile çalıştırıldı. `status=ok`, `errors={}`; bağlantı ve mülk eşleşmesi doğru. Tarayıcı oturumu giriş ekranına yönlendiğinden oturum içi görsel kabul yapılmadı.

| Metrik | 13 Temmuz–9 Ağustos | 10 Ağustos–6 Eylül |
|---|---:|---:|
| Tıklama | 8 | 24 |
| Gösterim | 538 | 1.268 |
| CTR | %1,49 | %1,89 |
| Ortalama konum | 9,33 | 9,82 |

Tıklama +%200, gösterim yaklaşık +%136; hacim küçük. Konum yaklaşık 0,50 kötüleşmiş; sorgu karması değişebilir. Bu sonuç bugünkü çalışmanın etkisi değildir. Veri penceresi üç gün gecikmeli, son gün 6 Eylül.

- Türkiye: 22 tıklama / 1.066 gösterim. Masaüstü 13, mobil 11 tıklama.
- 49 sorgu satırı toplam 3 tıklama / 395 gösterim içeriyor. Anonim sorgular nedeniyle bu toplam, mülkün 24/1.268 toplamına eşit değildir. Genel KPI’lar boyutsuz sorgudan alınmalı; mevcut ekran bunu yapıyor.
- Eski CTP/fiberglass yazısı: 344 gösterim / 5 tıklama. Eski karbon fiber yazısı: 288 / 1.
- `ctp panel nedir`: 61 gösterim / 1 tıklama / konum 10,15. `karbon fiber nedir`: 28 / 0 / 11,5.

Kanıt: [gsc-overview-live.json](docs/seo/2026-09-09-gsc/gsc-overview-live.json).

## 4. İçerik çalışması — teknik düzeltmeden sonra

- [ ] Mevcut CTP/fiberglass yazısını satın alma soruları, gerçek üretim bilgisi ve ilgili ürün/teklif bağlantılarıyla güncelle.
- [ ] Mevcut karbon fiber yazısını iyileştir; aynı niyet için ikinci benzer yazı açma.
- [ ] Lunapark kabini siparişinde teknik brief rehberi hazırla; mevcut ürüne bağla.
- [ ] Projeye özel fiberglass saksı ölçü/teklif rehberi hazırla; mevcut ürün ve çözüm sayfasına bağla.
- [ ] Deneyim/proje sayıları ve AS9100/ISO 9001 kapsamını belgeyle doğrula; doğrulanmamış iddiayı içerikte tekrar etme.
- [ ] Gerçek başarılı teklif kaydı için `generate_lead`; telefon/WhatsApp tıklaması ayrı mikro dönüşüm. Başarısız/tekrar form sayılmasın.

## 5. Tanitio tarafında kalanlar

Bu maddelerin uygulama yeri `ekosistem-sosyal-medya` deposudur; kompozit web koduna taşınmamalı.

- [ ] MOE’nin boş `gsc_url_index` önbelleğini mevcut denetim akışıyla doldur. Boş liste Google’da indeks yok anlamına gelmez; bu turdaki doğrudan Inspection sonuçları DB’ye yazılmadı.
- [ ] Marka varyantları ve belirsiz `moe` sorgusunun sınıflandırmasını değerlendir. Şu anda 117 gösterimli `moe` markasız sayılıyor; tamamını gerçek marka talebi kabul etmek de doğru değil.
- [ ] Fırsat kuyruğundaki düşük örneklemli, `reliable=false` CTR tahminlerini kesin kazanç diye sunmama.

Sosyal rakip seti Tanitio’da hazır: 5 web + 3 Instagram, strateji revision 3, 8 araştırma raporu. Instagram performansı henüz ölçülmedi. Sosyal yayın ve Meta bağlantısı ayrı işlerdir.

## 6. Uygulama sırası ve kapanış kaydı

1. Güncel çalışma ağacını ve aynı dosyalardaki eşzamanlı değişiklikleri kontrol et.
2. Sitemap kök nedenini düzelt ve hedefli kontrolü tamamla.
3. Eski/yeni URL ve dil eşlemelerini düzelt; typecheck/build ve gerçek URL kontrollerini tamamla.
4. Açık deploy talimatı geldiğinde canlıya al; ilgili sitemap/URL kontrollerini canlıda tekrarla.
5. Gerekiyorsa mevcut onaylı GSC akışıyla sitemap gönderimini yap; salt sitemap göndermeyi indeksleme garantisi sayma.
6. Inspection yeniden değerlendirmesi ve sonraki 28 günlük sonuçları bu dosyaya ekle.

| İş | Durum | Commit / yerel kontrol | Canlı kabul / tarih |
|---|---|---|---|
| Sitemap makale limit düzeltmesi | Açık | — | — |
| Canonical / eski URL / dil tutarlılığı | Açık | — | — |
| İki mevcut makalenin iyileştirilmesi | Açık | — | — |
| Teklif ölçümü | Açık | — | — |
| Google canonical yeniden kontrolü | Bekliyor | Teknik düzeltme sonrası | — |

**Belge aktarımı:** Bulgular 9 Eylül Tanitio araştırmasından taşındı; bu aktarım sırasında yeni canlı denetim, kod düzeltmesi, GSC yazma veya deploy yapılmadı. Kanıt JSON’larında OAuth anahtarı/parola bulunmaz.
