# Admin Paneli: Özelleştirilmiş Çözüm Sayfaları Yönetimi

Bu doküman, Kompozit platformunda "Peyzaj Sektörü", "Defin Grubu" veya "Depo/Tank Çözümleri" gibi özelleştirilmiş B2B sayfalarının nasıl yönetileceğini açıklar.

## 1. Yeni Çözüm Sayfası Oluşturma

Sistemde bu sayfalar `custom_pages` tablosu/modülü üzerinden yönetilmektedir.

### Adımlar:
1.  **Admin Paneline Giriş Yapın:** Sol menüden "Statik Sayfalar" veya "Custom Pages" bölümüne gidin.
2.  **Yeni Ekle:** Sağ üstteki butona tıklayarak yeni sayfa formunu açın.
3.  **Temel Bilgiler:**
    *   **Başlık (Title):** Sayfanın ana başlığı (Örn: *Peyzaj ve Kent Ekipmanları Çözümleri*).
    *   **Slug:** URL adresi (Örn: `peyzaj-cozumleri`).
    *   **Module Key:** Bu alan kritik! Yeni bir çözüm sayfası için `kompozit_solutions` anahtarını veya sayfa spesifik bir anahtarı kullanın.
4.  **Premium İçerik Bölümleri:**
    *   **Giriş Metni (Intro):** Sayfanın en başında, eğik ve vurgulu görünen etkileyici özet metni.
    *   **Ana İçerik (Content):** HTML editörü ile görseller, tablolar ve teknik detaylar ekleyin.
5.  **Dil Seçimi:** Sayfayı hem `tr` hem de `en` dilleri için ayrı ayrı doldurun veya kopyalayın.

## 2. Sayfayı Menüye Ekleme

Oluşturduğunuz sayfanın URL'sini menüde göstermek için:

1.  **Menü Yönetimi:** Admin panelinde "Sistem Ayarları" > "Menü Yönetimi" bölümüne gidin.
2.  **Yeni Menü Elemanı:** "Ürünler" veya "Çözümler" altına yeni bir alt öğe ekleyin.
3.  **URL:** `/products?category=segment-slug` veya doğrudan `/solutions/slug` formatında linki tanımlayın.

## 3. Premium Tasarım Standartları (Antigravity)

Sayfa içeriğini hazırlarken şu kurallara dikkat edin:
*   **H1 Başlığı:** Sayfada yalnızca bir tane Bulunmalıdır (Otomatik eklenir).
*   **Görseller:** En az 1200px genişliğinde ve yüksek kaliteli (mümkünse 3D render veya profesyonel üretim çekimi) görseller kullanın.
*   **Teknik Listeler:** Özellikleri maddeler halinde yazın; sistem bunları otomatik olarak ikonlu listelere dönüştürecektir.

---
> [!TIP]
> Yeni bir çözüm sayfası (Örn: Tabut/Defin Grubu) için `module_key` olarak `kompozit_offer_group` kullanırsanız, bu sayfa otomatik olarak teklif alma odaklı bir layout ile açılabilir.
