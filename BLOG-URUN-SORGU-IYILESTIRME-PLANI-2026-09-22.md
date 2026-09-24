# MOE Kompozit — Blog ve ürün içerik iyileştirme devir planı

Tarih: 22 Eylül 2026. Kullanıcı bu planın Kompozit köküne yazılmasını ve uygulamanın bu depodaki diğer oturumda yapılmasını istedi. Bu dosyayı yazan oturum içerik değişikliklerini uygulamadı.

## Kullanıcı kararı

Keşif sorgusu gerçek ürün/üretim alanımıza uyuyorsa mevcut içeriği veya ürünü geliştir. Karşılığı yoksa başlık ve özet taslağı oluştur. Alan dışı sorguyu atla. Aynı niyetteki eşanlamlı sorgular için ayrı yazılar oluşturma. Son kapsam başlık/özet taslağıdır; bu devir notu tek başına yeni içerikleri yayınlama veya reklam değiştirme talimatı değildir.

## Nerede kaldık?

- [x] Tamamlanmış keşfin 30 sorgusu mevcut içeriklerle eşleştirildi.
- [x] 20 sorgu mevcut blog, 2 sorgu mevcut ürün, 1 sorgu mevcut taslak, 7 sorgu atla olarak sınıflandı.
- [x] Önceki adımda 12 Türkçe başlık/özet taslağı MOE canlı blog yönetimine kaydedildi; yayınlanmadı.
- [x] Yönetim API'sinde 12 taslağın başlık/özeti doğrulandı; public listede 4 yayın kaldı, taslakların public detayları 404 döndü.
- [x] Tanitio SEO editoryal analizine karar özeti ve iyileştirme notları eklendi.
- [ ] Aşağıdaki iyileştirmeler diğer oturumda uygulanacak. Başlamadan canlı içeriği yeniden oku; paralel oturumda değiştirilmiş olabilir.

## Öncelikli uygulama listesi

### P1 — Karbon Fiber Panel Prototipi

- [ ] `/tr/products/karbon-fiber-panel-prototipi` mevcut kaydını kullan. Son incelemede açıklama tek cümleydi.
- [ ] Prototip kapsamı, gerekli çizim/ölçüler, bağlantılar, yüzey beklentisi ve numune kabulünü açıklayan metin hazırla.
- [ ] Mevcut karbon fiber rehberi ve teklif sayfasıyla iç bağlantı kur; İngilizce sürümün mevcut slug'ını API'den bul.
- [ ] Stok levha, doğrulanmamış kalınlık/dayanım, seri üretim veya sertifika vaadi ekleme.

### P1 — CTP Koruyucu Gövde Paneli ve CTP panel taslağı

- [ ] `/tr/products/ctp-koruyucu-govde-paneli` başlığındaki ve metnindeki Türkçe karakterleri düzelt.
- [ ] Meta açıklamasındaki “örnek kompozit ürün kaydı” ifadesini doğrulanmış ürün kapsamıyla değiştir.
- [ ] Makine muhafazası, kapak, kalıp–laminasyon–trim kapsamı ve teklif için gereken montaj/ortam bilgilerini açıkla.
- [ ] Mevcut `ctp-panel-levha-ozel-kompozit-govde-farki` taslağını geliştir; ikinci bir CTP panel yazısı oluşturma.
- [ ] Stok hijyenik/çatı paneli ile özel şekilli gövde ihtiyacını ayır. Taslak URL'si henüz public sayfa değildir; yayınlı içerikten 404 taslağa bağlantı verme.

### P1 — CTP Su Deposu

- [ ] `/tr/products/ctp-su-deposu` kaydını geliştir; ürün zaten var.
- [ ] Hacim, akışkan, sıcaklık, yerleşim, giriş/çıkış ve kaide için teklif kontrol listesi hazırla.
- [ ] Mevcut “içme suyu dışı” kapsamı koru. İçme suyu uygunluğu/sertifika iddiası ekleme.

### P2 — Mevcut TR/EN rehberleri

- [ ] Karbon fiber: lif ve bitmiş CFRP ayrımını koru; özelliklerin reçine/katman/geometriye bağlı olduğunu açıkla; prototip ürüne bağla.
- [ ] CTP/Fiberglass: malzeme isimlerini ürün ihtiyacıyla eşleştir; reçine satışı izlenimi oluşturma.
- [ ] Kalite kontrol: ölçü, yüzey, montaj ve revizyon kaydı için doldurulabilir kabul planı örneği hazırla. Mevcut içeriği kontrol ederek yalnız eksik kısmı ekle.
- [ ] NDT, ultrason, CT, akredite test veya ileri üretim yetenekleri doğrulanmadan hizmet gibi yazılmayacak.
- [ ] İngilizce sorguları mevcut İngilizce sayfalara yönlendir; Türkçe yazıya İngilizce anahtar kelime doldurma.

## Teknik uygulama ve doğrulama

- Canlı: `vps-Ensotek`, `/var/www/Ensotek/kompozit`. Site: https://www.karbonkompozit.com.tr.
- Yönetim: https://www.karbonkompozit.com.tr/admin/custompage.
- Blog veri modeli: `custom_pages.module_key='kompozit_blog'` + `custom_pages_i18n`. Bu sitede `blog_posts` tablosu kullanılmıyor.
- Taslak koşulu `is_published=0`. `content` DB'de `{ "html": "..." }` biçiminde olabilir; mevcut paketlemeyi koru. Slug ve locale benzersizliğini kontrol et.
- Blog public uç: `/api/custom-pages?module_key=kompozit_blog&locale=tr&limit=100`.
- Ürün public uç: `/api/products?item_type=kompozit&is_active=1&locale=tr&limit=100&sort=order_num&order=desc`. `item_type=kompozit` olmadan boş yanıt alınabilir.
- Mevcut örnek uygulama: `backend/scripts/refresh-blog-2026-09-22.mjs` ve `backend/scripts/blog-refresh-2026-09-22.json`. Bunları körlemesine tekrar çalıştırma; eski içerik kontrolü ve yedekleme desenini incele.
- [ ] Mevcut kayıtları yeniden oku, hedefli yedek al, yalnız eşleşen ID/locale satırlarında değişiklik hazırla; eski slug'ları koru.
- [ ] Başlık, özet, metin ve SEO alanlarının aynı kapsamı anlattığını kontrol et; ürün özellikleri/fiyat/termin uydurma.
- [ ] Yönetim API'sinde kayıtları geri oku. Taslaklar yayınlı listede ve sitemap'te görünmemeli.
- [ ] Yayınlı değişiklik uygulanırsa gerçek sayfa, canonical, hreflang, iç bağlantı ve önbellek kontrolü yap.
- [ ] Tanitio entegrasyonunda yayınlı blogların doğru başlık/özet/HTML ile geldiğini kontrol et. İçerik Gezgini yalnız yayınlı içerikleri okur; taslakları göstermek için public sözleşmeyi gevşetme.
- [ ] Bu checklist'i yalnız doğrulanan işler için işaretle; uygulama kanıtı ve eksikleri bu dosyaya ekle.

## Kanıt dosyaları

Aynı çalışma alanındaki Tanitio deposu: `/home/orhan/Documents/Projeler/ekosistem-sosyal-medya`.

- `reports/moe-query-actions-20260922/`: keşif, ürün/blog snapshot'ları, `query-actions.json`, panel editoryal kaydının önce/sonra yedekleri.
- `reports/moe-blog-drafts-20260922/`: 12 taslağın `drafts.json`, `before.json`, `after.json`, yönetim/public doğrulamaları ve kayıt scriptleri.
- Sunucu taslak kayıt yedeği: `/var/www/Ensotek/kompozit/backend/.local/blog-drafts-20260922/`.
- Bu kanıtlar 22 Eylül snapshot'larıdır. Güncel canlı verinin üzerine koşulsuz yazma.

## Sorgu bazında kararlar

30 sorgu, mevcut 4 yayınlanmış yazı (TR+EN), 12 ürün ve önceki 12 taslak karşılaştırıldı. GSC gösterimi arama hacmi değildir. Ek dosya alan adı listesi olduğundan kararlar keşfin asıl sorguları üzerinden verildi. Yayın değişikliği yapılmadı; aşağıdakiler geliştirme taslaklarıdır.

| Sorgu | Karar | Hedef |
|---|---|---|
| moe | Atla | — |
| ctp panel nedir | Mevcut taslağı geliştir | https://www.karbonkompozit.com.tr/tr/blog/ctp-panel-levha-ozel-kompozit-govde-farki · https://www.karbonkompozit.com.tr/tr/products/ctp-koruyucu-govde-paneli |
| carbon fiber | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| ctp malzeme | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/ctp-fiberglass-farklari · https://www.karbonkompozit.com.tr/tr/products/ctp-koruyucu-govde-paneli |
| karbon fiber nedir | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| karbon fiber | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| fiberglass reçine | Atla | — |
| ctpfiber | Atla | — |
| ctp fiber | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/ctp-fiberglass-farklari · https://www.karbonkompozit.com.tr/tr/products/ctp-koruyucu-govde-paneli |
| composite quality control | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/en/blog/composite-quality-control · https://www.karbonkompozit.com.tr/tr/blog/kompozit-kalite-kontrol |
| fiber kompozit | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/ctp-fiberglass-farklari · https://www.karbonkompozit.com.tr/tr/products/ctp-koruyucu-govde-paneli |
| fiberglass ne | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/ctp-fiberglass-farklari · https://www.karbonkompozit.com.tr/tr/products/ctp-koruyucu-govde-paneli |
| composite manufacturing quality control testing | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/en/blog/composite-quality-control · https://www.karbonkompozit.com.tr/tr/blog/kompozit-kalite-kontrol |
| carbon fiber compound | Atla | — |
| carbonfiber | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| composite quality inspection | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/en/blog/composite-quality-control · https://www.karbonkompozit.com.tr/tr/blog/kompozit-kalite-kontrol |
| carbon carbon fiber | Atla | — |
| carbon fiber fiber | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| carbon fiber nedir | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| carbon fiber properties | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| carbon panel | Mevcut ürünü iyileştir | https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| kompozit shop | Atla | — |
| carbon fiber material | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| carbon fiber material properties | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| carbon fibre | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| ctp frp laminasyon | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/ctp-fiberglass-farklari · https://www.karbonkompozit.com.tr/tr/products/ctp-koruyucu-govde-paneli |
| ctp su deposu | Mevcut ürünü iyileştir | https://www.karbonkompozit.com.tr/tr/products/ctp-su-deposu |
| fiber karbon | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| karbon fiber takviyeli polimer | Mevcut içeriği iyileştir | https://www.karbonkompozit.com.tr/tr/blog/karbon-fiber-nedir · https://www.karbonkompozit.com.tr/en/blog/what-is-carbon-fiber · https://www.karbonkompozit.com.tr/tr/products/karbon-fiber-panel-prototipi |
| kompozitshop | Atla | — |

## Karbon fiber rehberi ve prototip ürünü

Lif ile bitmiş CFRP parçayı ayıran kısa tanımı koru; özelliklerin katman/reçine/geometriye bağlı olduğunu açıkla. Prototip ürününe bağla; doğrulanmamış sayısal dayanım tablosu veya seri üretim vaadi ekleme.

Yalnız karbon fiber prototip niyetini hedefle. Prototip kapsamı, çizim/ölçü, bağlantı, numune doğrulama ve teklif için istenen bilgileri açıkla; stok levha ve doğrulanmış teknik değer vaadi verme.

## CTP rehberi ve gövde paneli

Önce bu taslağı tamamla; ürün kapsamını stok hijyenik panel/çatı levhası gibi göstermeden CTP gövde paneline bağla.

CTP/FRP/GRP tanımlarını, kullanım koşulu ve üretim talebini eşleştir. Laminasyon sorgusunu ürünün kalıp-laminasyon-trim kapsamına bağla; reçine perakendesi veya yöntem kapasitesi uydurma.

## Kalite kontrol rehberi

Ölçü kontrolü, yüzey kabulü ve revizyon kaydı için doldurulabilir örnek plan hazırla. NDT, ultrason, CT veya akredite test hizmeti varmış gibi yazma.

## CTP su deposu

Hacim, depolanan akışkan, sıcaklık, yerleşim ve bağlantı bilgileriyle teklif kontrol listesi ekle. İçme suyu uygunluğu iddiası ekleme; mevcut içme suyu dışı kapsamı koru.

## Atlanan sorgular

- **moe:** Sporcu, müzik grubu ve yer adlarıyla karışıyor; ürün niyeti yok.
- **fiberglass reçine:** Sonuçlar kg/litre ham reçine alışverişi; MOE kataloğunda hammadde satışı doğrulanmadı.
- **ctpfiber:** Bitişik ifade başka markaya yönelen arama. Ayrı yazılmış ctp fiber ile aynı değerlendirilmedi.
- **carbon fiber compound:** Granül/compound hammaddesi odağı; katalogda karşılığı yok.
- **carbon carbon fiber:** Karbon-karbon kompozit ve ileri malzeme niyeti karışık; katalogda üretimi doğrulanmadı.
- **kompozit shop:** Başka mağazaya yönelen marka sorgusu.
- **kompozitshop:** Başka mağazaya yönelen marka sorgusu.

## Rakipleri yorumlama

Wikipedia ve araştırma yayınları bilgi kaynaklarıdır; hammadde mağazaları her sorguda doğrudan ticari rakibimiz değildir. Sosyal ağın tamamı rakip firma sayılmaz. Karşılaştırma sonuç URL’si, sorgu niyeti ve gerçek ürün kapsamı üzerinden yapılmalı. Bu sınıflama Google Ads negatif kelime eklemesi değildir.


## Önceden kaydedilen 12 taslak — yeniden oluşturma

### 1. Kompozit Saksı Seçimi: Otel, AVM ve Peyzaj Projeleri İçin Rehber

Saksı seçiminde bitki ve kök hacmi, yerleşim ölçüsü, taşıma ihtiyacı ve iç/dış mekân koşullarını birlikte ele alan bir rehber. Projeye uygun model için hazırlanması gereken ölçü, adet ve kullanım bilgileri özetlenecek.

- Kayıt ID: `ac839341-97b1-531e-b0ff-34108d9d5157`
- Slug: `kompozit-saksi-secimi-otel-avm-peyzaj`
- Dil: `tr`; yayın durumu: `is_published=0`

### 2. Özel Ölçü Fiberglas Saksı Siparişi: Ölçü, Renk ve Yüzey Nasıl Belirlenir?

Mimari projelerde özel saksı talebinin nasıl hazırlanacağını anlatan kısa rehber. Dış ve iç ölçü ayrımı, RAL renk kodu, mat/parlak yüzey, numune onayı ve adet bilgisinin teklif sürecindeki rolü açıklanacak.

- Kayıt ID: `7d2b9a79-8f44-5a80-b69b-a24477b456ac`
- Slug: `ozel-olcu-fiberglas-saksi-siparis-rehberi`
- Dil: `tr`; yayın durumu: `is_published=0`

### 3. Dış Mekân Kompozit Saksılarda Drenaj ve Yerleşim Planlaması

Dış mekân saksılarında su tahliyesi, taban detayı ve yerleşim koşullarının sipariş öncesinde netleştirilmesi ele alınacak. Bitki ihtiyacı ve proje koşullarına göre sorulacak sorular verilecek; tek bir drenaj çözümü tüm projelere önerilmeyecek.

- Kayıt ID: `cb44249a-6a7e-5bc6-a8e4-341fe99b4df6`
- Slug: `dis-mekan-kompozit-saksi-drenaj-yerlesim`
- Dil: `tr`; yayın durumu: `is_published=0`

### 4. AVM ve Oteller İçin Fiberglas Noel Baba ve Yılbaşı Geyiği Seçimi

Yılbaşı dekorunda figür ölçüsü, sergileneceği alan, renk ve tema bütünlüğü ile depolama planı ele alınacak. Noel Baba ve geyik figürleri için teklif öncesinde paylaşılacak referanslar ve teslim tarihi beklentileri özetlenecek.

- Kayıt ID: `fa7731bb-2867-51ca-9279-3978892d5e54`
- Slug: `fiberglas-noel-baba-yilbasi-geyigi-secimi`
- Dil: `tr`; yayın durumu: `is_published=0`

### 5. Noel Kızağı ve Yılbaşı Arabası: Fotoğraf Alanı İçin Proje Briefi

Dekoratif kızak ve yılbaşı arabası projelerinde ölçü, yerleşim, giriş açıklıkları ve nakliye kısıtları anlatılacak. Yalnız sergileme ile ziyaretçilerin üzerine çıkacağı kullanım ayrılacak; ikinci durumda ayrıca mühendislik değerlendirmesi gerektiği belirtilecek.

- Kayıt ID: `7704dbc5-e4ee-5da5-ac81-056d2423372d`
- Slug: `noel-kizagi-yilbasi-arabasi-proje-briefi`
- Dil: `tr`; yayın durumu: `is_published=0`

### 6. Lunapark Kabin ve Gövde İmalatında Teklif İçin Hangi Bilgiler Gerekir?

Kompozit kabin veya dış gövde siparişinde teknik çizim, mevcut şasi ölçüleri, bağlantı noktaları, adet ve yüzey beklentisinin nasıl iletileceği özetlenecek. Parça imalatı ile komple makine tasarımı ve onay sorumluluğu birbirinden ayrılacak.

- Kayıt ID: `1110031c-9a76-54eb-a45e-5fb51a1d3fdb`
- Slug: `lunapark-kabin-govde-imalati-teklif-bilgileri`
- Dil: `tr`; yayın durumu: `is_published=0`

### 7. Roller Coaster Kovası, Gondol Koltuğu ve Balerin Oturağı Sipariş Rehberi

Sektörde kova, koltuk ve oturak olarak anılan parçalar için mevcut ekipman modeli, çizim ve bağlantı bilgilerinin önemi anlatılacak. Taşıyıcı yapı ve emniyet sistemi uyumluluğunun yetkili mühendislik ekibi tarafından doğrulanması gereken noktalar belirtilecek.

- Kayıt ID: `6a50c1cc-2efa-50cc-8a13-6d47a60f89c3`
- Slug: `roller-coaster-kovasi-gondol-koltugu-balerin-oturagi`
- Dil: `tr`; yayın durumu: `is_published=0`

### 8. Çarpışan Oto ve Elma Kurdu Gövdelerinde Özel Tasarım Süreci

Temalı dış gövde tasarımında referans görselden ölçülü taslağa, numuneden renk onayına uzanan süreç ele alınacak. Mevcut makineye uyum, montaj erişimi ve değiştirilecek parçanın kapsamı anlatılacak; başkasına ait karakter ve tasarımlar kopyalanmayacak.

- Kayıt ID: `9e2a1ec7-ccef-53ac-b217-739b9b8c5764`
- Slug: `carpisan-oto-elma-kurdu-kompozit-govde-tasarimi`
- Dil: `tr`; yayın durumu: `is_published=0`

### 9. Özel CTP Kalıp Maliyeti Neye Göre Değişir?

Kalıp maliyetini etkileyen geometri, boyut, yüzey beklentisi, parça ayrımı ve üretim adedi açıklanacak. Kalıp bedeli ile birim parça fiyatı ayrılacak; sabit fiyat veya doğrulanmamış teslim süresi vermeden karşılaştırılabilir teklif istemenin yolu anlatılacak.

- Kayıt ID: `5a77969b-bc3c-5bcf-a514-0b23f78da4c8`
- Slug: `ozel-ctp-kalip-maliyeti-etkileyen-faktorler`
- Dil: `tr`; yayın durumu: `is_published=0`

### 10. Numuneden Kompozit Parça Üretimi: Tersine Mühendislik İçin Hazırlık

Çizimi olmayan mevcut bir parçadan üretim talebinde numunenin durumu, kritik ölçüler, eşleşen parçalar ve kullanım koşulları ele alınacak. Numunenin aynısını üretmek ile tasarımı revize etmek arasındaki kapsam farkı açıklanacak.

- Kayıt ID: `b09b6571-b254-5e14-ac2b-9bd75c4377d1`
- Slug: `numuneden-kompozit-parca-uretimi-hazirlik`
- Dil: `tr`; yayın durumu: `is_published=0`

### 11. CTP Panel Nedir? Levha ile Özel Kompozit Gövde Arasındaki Fark

CTP panel arayanların düz levha, kaplama veya özel şekilli gövde ihtiyacını ayırt etmesine yardımcı olacak bir içerik. Ölçü, kullanım ortamı ve montaj beklentisinin teklif talebine nasıl yazılacağı anlatılacak; stok levha satışı varmış gibi bir vaat verilmeyecek.

- Kayıt ID: `42c9968c-f28e-53c6-b489-8d6fe140ac57`
- Slug: `ctp-panel-levha-ozel-kompozit-govde-farki`
- Dil: `tr`; yayın durumu: `is_published=0`

### 12. Büyük Kompozit Ürünlerde Paketleme, Nakliye ve Teslim Planı

Büyük saksı, dekoratif figür ve kabin siparişlerinde sevkiyat öncesi ölçü, erişim, boşaltma ve teslim kontrolü ele alınacak. Paketleme ve taşıma sorumluluklarının teklifte açık yazılması ve hasar kontrolünün kayıt altına alınması önerilecek.

- Kayıt ID: `4a2fe50b-7337-512e-95b6-d29683c40324`
- Slug: `buyuk-kompozit-urun-paketleme-nakliye-teslim`
- Dil: `tr`; yayın durumu: `is_published=0`

