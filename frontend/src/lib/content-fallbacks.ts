type FallbackItem = {
  title: string;
  description: string;
  content?: string;
};

type FallbackGalleryItem = FallbackItem & {
  imageSrc: string;
};

type FallbackReferenceItem = FallbackItem & {
  imageSrc?: string;
  websiteUrl?: string;
};

type LocaleKey = 'tr' | 'en';

/** Repo: backend/uploads/kompozit/*.jpg — API `/uploads/...` ile servis; `resolvePublicAssetUrl` ile tam URL */
const S = {
  carbon: '/uploads/kompozit/karbon-fiber-panel-01.jpg',
  carbonDetail: '/uploads/kompozit/karbon-fiber-detay-01.jpg',
  tank: '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg',
  lamination: '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
  planter: '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  industrial: '/uploads/kompozit/kompozit-uretim-proses-01.jpg',
  softFloral: '/uploads/kompozit/karbon-fiber-doku-01.jpg',
} as const;

const fallbackProducts: Record<LocaleKey, (FallbackItem & { specs: string[]; category: string; image_url: string; slug: string })[]> = {
  tr: [
    {
      title: 'Kompozit Panel ve Muhafaza Cozumleri',
      description: 'Kabin, kapak ve muhafaza uygulamalarinda hafiflik, yuzey kalitesi ve dayanim beklentisini birlikte karsilayan panel tabanli cozumler.',
      specs: ['CTP / FRP', 'Hafif Yapı', 'B2B Seri Üretim'],
      category: 'Paneller',
      image_url: S.carbon,
      slug: 'kompozit-panel-muhafaza',
    },
    {
      title: 'Ozel Kalip, Numune ve Prototip Parcalar',
      description: 'Numune dogrulama, revizyon ve seri uretim oncesi proses testleri icin karbon fiber ve cam elyaf takviyeli prototip parcalar.',
      specs: ['Karbon Fiber', 'Özel Kalıp', 'Hızlı Prototip'],
      category: 'Prototip',
      image_url: S.carbonDetail,
      slug: 'ozel-kalip-prototip',
    },
    {
      title: 'Endustriyel Tasiyici ve Koruyucu Bilesenler',
      description: 'Makine, enerji ve altyapi ekipmanlarinda kullanilmak uzere ozel olculu kompozit tasiyici, koruyucu ve servis kolayligi sunan bilesenler.',
      specs: ['Yüksek Dayanım', 'Özel Ölçü', 'Kimyasal Direnç'],
      category: 'Endüstriyel',
      image_url: S.tank,
      slug: 'endustriyel-tasiyici-bilesenler',
    },
    {
      title: 'CTP Profil ve Hat Bilesenleri',
      description: 'Kimyasal dayanim, elektriksel yalitim ve dis ortam performansi gerektiren endustriyel hatlar icin CTP profil ve yardimci bilesen cozumleri.',
      specs: ['Elektresel Yalıtım', 'FRP Profil', 'Korozyon Direnci'],
      category: 'Profil',
      image_url: S.lamination,
      slug: 'ctp-profil-hat-bilesenler',
    },
  ],
  en: [
    {
      title: 'Composite Panel and Enclosure Solutions',
      description: 'Panel-based solutions for cabins, covers and housings where lightweighting, surface quality and durability must work together.',
      specs: ['GRP / FRP', 'Lightweight', 'B2B Series'],
      category: 'Panels',
      image_url: S.carbon,
      slug: 'composite-panel-enclosures',
    },
    {
      title: 'Custom Tooling, Sample and Prototype Parts',
      description: 'Carbon fiber and fiberglass reinforced prototype parts for sample validation, revisions and pre-production process checks.',
      specs: ['Carbon Fiber', 'Custom Mold', 'Rapid Proto'],
      category: 'Prototyping',
      image_url: S.carbonDetail,
      slug: 'custom-tooling-prototypes',
    },
    {
      title: 'Industrial Structural and Protective Parts',
      description: 'Custom-sized composite structural, protective and service-friendly parts for machinery, energy and infrastructure equipment.',
      specs: ['High Strength', 'Custom Sizing', 'Chemical Resistance'],
      category: 'Industrial',
      image_url: S.tank,
      slug: 'industrial-protective-parts',
    },
    {
      title: 'FRP Profiles and Line Components',
      description: 'FRP profile and auxiliary component solutions for industrial lines that require chemical resistance, electrical insulation and outdoor durability.',
      specs: ['Electrical Insulation', 'FRP Profiles', 'Corrosion Resistance'],
      category: 'Profiles',
      image_url: S.lamination,
      slug: 'frp-profiles-components',
    },
  ],
};

const fallbackBlogPosts: Record<LocaleKey, FallbackItem[]> = {
  tr: [
    {
      title: 'Karbon Fiber ve Cam Elyaf Arasinda Malzeme Secimi',
      description: 'Maliyet, mukavemet, agirlik ve yuzey gereksinimine gore hangi kompozit yapinin daha uygun olduguna dair karar destekleyici karsilastirma.',
    },
    {
      title: 'Prototipten Seri Uretime Geciste Kritik Kontrol Noktalari',
      description: 'Kalip, numune dogrulama, tolerans ve proses tekrar edilebilirligi acisindan B2B projelerde dikkat edilmesi gereken temel kontrol basliklari.',
    },
    {
      title: 'Kompozit Parcalarda Yuzey Kalitesi ve Termin Dengesi',
      description: 'Yuzey beklentisi arttikca proses, maliyet ve termin planlamasinin nasil degistigine dair uygulama odakli notlar.',
    },
    {
      title: 'CTP ve Hibrit Yapilarda Uretim Rotasi Nasil Secilir?',
      description: 'Parca geometrisi, adet, servis ortami ve kalite beklentisine gore uygun uretim rotasini belirlerken degerlendirilmesi gereken noktalar.',
    },
  ],
  en: [
    {
      title: 'Choosing Between Carbon Fiber and Fiberglass',
      description: 'A decision-oriented comparison of cost, strength, weight and finish expectations when selecting the right composite structure.',
    },
    {
      title: 'Critical Checks from Prototype to Series Production',
      description: 'Key B2B checkpoints around tooling, sample validation, tolerances and repeatable production planning.',
    },
    {
      title: 'Balancing Surface Quality and Lead Time in Composite Parts',
      description: 'Application-focused notes on how finish requirements influence process design, cost and delivery planning.',
    },
    {
      title: 'How to Choose the Right FRP or Hybrid Production Route',
      description: 'What to evaluate across part geometry, quantity, service environment and quality targets when choosing the right production route.',
    },
  ],
};

const fallbackGalleries: Record<LocaleKey, FallbackGalleryItem[]> = {
  tr: [
    {
      title: 'Panel ve Muhafaza Uygulamalari',
      description: 'Yuzey kalitesi, hafiflik ve servis kolayligi gerektiren panel ve muhafaza cozumlerinden secilen uygulama ornekleri.',
      imageSrc: S.carbon,
    },
    {
      title: 'Prototip ve Numune Dogrulama',
      description: 'Numune revizyonu, kalip kontrolu ve seri uretim oncesi dogrulama asamalarini yansitan proje goruntuleri.',
      imageSrc: S.carbonDetail,
    },
    {
      title: 'Hat ve Saha Bilesenleri',
      description: 'Enerji, altyapi ve makina uygulamalarinda kullanilan kompozit tasiyici ve koruyucu bilesenlerden secilen kareler.',
      imageSrc: S.tank,
    },
  ],
  en: [
    {
      title: 'Panel and Enclosure Applications',
      description: 'Selected application visuals from panel and enclosure solutions that require finish quality, lightweighting and service access.',
      imageSrc: S.carbon,
    },
    {
      title: 'Prototype and Sample Validation',
      description: 'Project visuals reflecting sample revisions, tooling checks and pre-production validation stages.',
      imageSrc: S.carbonDetail,
    },
    {
      title: 'Line and Field Components',
      description: 'Selected images from composite structural and protective components used in energy, infrastructure and machinery applications.',
      imageSrc: S.tank,
    },
  ],
};

const fallbackReferences: Record<LocaleKey, FallbackReferenceItem[]> = {
  tr: [
    {
      title: 'Endustriyel Cozum Ortagi 01',
      description: 'Kompozit muhafaza, panel ve saha bilesenlerinde tekrarli tedarik ve kalite akisi yonetilen kurumsal proje tipi.',
      websiteUrl: '/tr/contact',
    },
    {
      title: 'Savunma Sanayii Tedarikcisi',
      description: 'Hassas tolerans ve gizlilik standartlariyla yurutulen ozel malzeme projeleri.',
      websiteUrl: '/tr/offer',
    },
    {
      title: 'Otomotiv Prototip Hattı',
      description: 'Hizli prototipleme ve seri uretim oncesi dogrulama surecleri.',
      websiteUrl: '/tr/products',
    },
    {
      title: 'Enerji Altyapi Grubu',
      description: 'Dis ortam dayanimi yuksek kabin ve tasiyici sistem bilesenleri.',
      websiteUrl: '/tr/products',
    },
    {
      title: 'Raylı Sistemler Bilesenleri',
      description: 'Yangin dayanimi ve hafiflik kriterlerine uygun ic mekan parcalari.',
      websiteUrl: '/tr/contact',
    },
    {
      title: 'Denizcilik ve Yat Ekipmanlari',
      description: 'Korozyon direnci ve estetik yuzey beklentili ozel tasarimlar.',
      websiteUrl: '/tr/gallery',
    }
  ],
  en: [
    {
      title: 'Industrial Solution Partner 01',
      description: 'A representative enterprise project where recurring supply and quality flow are managed.',
      websiteUrl: '/en/contact',
    },
    {
      title: 'Defense Industry Supplier',
      description: 'Special material projects conducted with precision tolerances and confidentiality standards.',
      websiteUrl: '/en/offer',
    },
    {
      title: 'Automotive Prototype Line',
      description: 'Rapid prototyping and pre-production validation processes.',
      websiteUrl: '/en/products',
    },
    {
      title: 'Energy Infrastructure Group',
      description: 'Enclosures and structural components with high outdoor durability.',
      websiteUrl: '/en/products',
    },
    {
      title: 'Rail Systems Components',
      description: 'Interior parts meeting fire resistance and lightweighting criteria.',
      websiteUrl: '/en/contact',
    },
    {
      title: 'Marine and Yacht Equipment',
      description: 'Custom designs with corrosion resistance and aesthetic finish expectations.',
      websiteUrl: '/en/gallery',
    }
  ],
};

function normalizeLocale(locale: string): LocaleKey {
  return locale.startsWith('en') ? 'en' : 'tr';
}

export function getFallbackProducts(locale: string) {
  return fallbackProducts[normalizeLocale(locale)];
}

export function getFallbackBlogPosts(locale: string) {
  return fallbackBlogPosts[normalizeLocale(locale)];
}

export function getFallbackGalleries(locale: string) {
  return fallbackGalleries[normalizeLocale(locale)];
}

export function getFallbackReferences(locale: string) {
  return fallbackReferences[normalizeLocale(locale)];
}
