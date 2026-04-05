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
      websiteUrl: '/tr/solutions',
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
      websiteUrl: '/en/solutions',
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

const fallbackSolutions: Record<LocaleKey, (FallbackGalleryItem & { specs: string[]; category: string })[]> = {
  tr: [
    {
       title: 'Peyzaj ve Kent Ekipmanlari (Saksı)',
       description: 'Dis ortam kosullarina dayanikli, hafif ve yuksek yuzey kalitesine sahip buyuk olcekli kompozit saksi ve oturma gruplari.',
       imageSrc: S.planter,
       specs: ['Hafif Yapı', 'Korozyon Direnci', 'Özel Renk Seçeneği'],
       category: 'Peyzaj',
       content: '<h2>Peyzajda Kompozit Yaklasimi</h2><p>Kent mobilyalari ve buyuk olcekli saksilarda agirlik, korozyon ve yuzey deformasyonu en buyuk maliyet kalemleridir. MOE Kompozit olarak; UV dayanimi yuksek, CTP tabanli ve moduler uretime uygun peyzaj bilesenleri gelistiriyoruz.</p><h3>Muhendislik Avantajlari</h3><ul><li>Beton saksilara gore %80 daha hafif</li><li>Kimyasal gubrelere ve dis ortam nemine tam direnc</li><li>İstenilen RAL kodunda, puruzsuz yuzey bitis</li></ul>',
    },
    {
       title: 'Moduler Depo ve Tank Cozumleri',
       description: 'Kimyasal depolama, su yalitimi ve endustriyel hatlar icin CTP tabanli yuksek mukavemetli depo ve muhafaza urunleri.',
       imageSrc: S.tank,
       specs: ['CTP / FRP', 'Kimyasal Dayanım', 'Sızdırmazlık Garantisi'],
       category: 'Depolama',
       content: '<h2>Endustriyel Depolama ve Sizdirmazlik</h2><p>Asidik ortamlar ve kimyasal stoklama ihtiyaclarinda geleneksel metal tanklar korozyon nedeniyle hizli deforme olur. CTP (Cam Elyaf Takviyeli Plastik) tanklarimiz, kimyasal direnci ve yuksek mukavemetiyle uzun omurlu kullanim sunar.</p><h3>Uygulama Alanlari</h3><ul><li>Sarf malzemesi ve kimyasal depolama</li><li>Aritma tesisleri ve asit tanklari</li><li>Ozel olculu yangin ve kullanim suyu depolari</li></ul>',
    },
    {
       title: 'Defin Grubu Urunleri (Tabut)',
       description: 'Belediyeler ve kamu kurumlari icin seri uretilen, dayanikli ve hijyenik kompozit defin ve nakil ekipmanlari.',
       imageSrc: S.softFloral,
       specs: ['Üst Düzey Hijyen', 'Seri Üretim', 'Lojistik Uyumluluk'],
       category: 'Kamu',
       content: '<h2>Kamu ve Belediye Cozumleri</h2><p>Defin ve nakil sureclerinde hijyen, hafiflik ve kolay dezenfekte edilebilirlik onceliktir. Kompozit tabut ve kabinler; gozeneksiz yapilari sayesinde mikrobiyolojik birikimi onler ve uzun yillar servis verir.</p><h3>Teknik Kapsam</h3><ul><li>Yuksek tasima kapasitesi ve hafif yapi</li><li>Kolay temizlenebilir Jel-Kot yuzey</li><li>Ust uste istiflenebilir ergonomik tasarim</li></ul>',
    },
    {
       title: 'Ozel B2B Kompozit Imalat',
       description: 'Savunma, enerji ve makina sektorleri icin teknik sartnameye gore ozel olarak tasarlanan ve uretilen alt bilesenler.',
       imageSrc: S.carbon,
       specs: ['Mühendislik Desteği', 'Karbon / Cam Elyaf', 'AS9100 Standartı'],
       category: 'Endüstriyel',
       content: '<h2>Savunma ve Enerji icin Hassas Imalat</h2><p>Ozel makine parcalari, muhafazalar ve tasiyici bilesenlerde karbon fiber ve hibrit yapilar, agirlik-mukavemet dengesini saglamanin tek yoludur. Projenize ozel kalip tasarimi ve seri uretim hatti kurguluyoruz.</p><h3>B2B Is Akisimiz</h3><ul><li>Teknik cizim ve tolerans analizi</li><li>Prototip uretimi ve numune dogrulama</li><li>Donemsel/Tekrarlı seri uretim hatti</li></ul>',
    }
  ],
  en: [
    {
       title: 'Landscaping and Urban Equipment (Planters)',
       description: 'Large-scale composite planters and seating groups with high surface quality, lightweight design and outdoor durability.',
       imageSrc: S.planter,
       specs: ['Lightweight', 'Corrosion Resistance', 'Custom Colors'],
       category: 'Landscaping',
       content: '<h2>Composite Approach in Landscaping</h2><p>In urban furniture and large-scale planters, weight, corrosion, and surface deformation are the biggest cost items. At MOE Composite, we develop GRP-based landscaping components suitable for UV resistance and modular production.</p><h3>Engineering Advantages</h3><ul><li>80% lighter than concrete planters</li><li>Full resistance to chemical fertilizers and outdoor humidity</li><li>Smooth surface finish in any requested RAL code</li></ul>',
    },
    {
       title: 'Modular Tank and Storage Solutions',
       description: 'High-strength FRP-based storage and enclosure products for chemical storage, waterproofing and industrial lines.',
       imageSrc: S.tank,
       specs: ['FRP / GRP', 'Chemical Resistance', 'Leak-proof Guarantee'],
       category: 'Storage',
       content: '<h2>Industrial Storage and Sealing</h2><p>In acidic environments and chemical storage needs, traditional metal tanks deform quickly due to corrosion. Our GRP (Glass Reinforced Plastic) tanks offer long-lasting use with their chemical resistance and high strength.</p><h3>Application Areas</h3><ul><li>Consumables and chemical storage</li><li>Treatment plants and acid tanks</li><li>Custom-sized fire and utility water tanks</li></ul>',
    },
    {
       title: 'Burial and Transport Equipment (Coffins)',
       description: 'Durable, hygienic composite burial and transport equipment mass-produced for municipalities and institutions.',
       imageSrc: S.softFloral,
       specs: ['High Hygiene', 'Mass Production', 'Logistics Friendly'],
       category: 'Institutional',
       content: '<h2>Public and Municipal Solutions</h2><p>Hygiene, lightweight design, and ease of disinfection are priorities in burial and transport processes. Composite coffins and cabins prevent microbiological buildup thanks to their non-porous structure and provide service for many years.</p><h3>Technical Scope</h3><ul><li>High load capacity and lightweight structure</li><li>Easy-to-clean Gel-Coat surface</li><li>Stackable ergonomic design</li></ul>',
    },
    {
       title: 'Custom B2B Composite Manufacturing',
       description: 'Sub-components specifically designed and manufactured according to technical specifications for defense, energy and machinery sectors.',
       imageSrc: S.carbon,
       specs: ['Engineering Support', 'Carbon / Fiberglass', 'High Precision'],
       category: 'Industrial',
       content: '<h2>Precision Manufacturing for Defense and Energy</h2><p>In custom machine parts, enclosures, and structural components, carbon fiber and hybrid structures are the only way to achieve the weight-strength balance. We set up custom mold design and series production lines for your project.</p><h3>Our B2B Workflow</h3><ul><li>Technical drawing and tolerance analysis</li><li>Prototype production and sample validation</li><li>Periodic/Recurring series production line</li></ul>',
    }
  ]
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

export function getFallbackSolutions(locale: string) {
  const normalized = normalizeLocale(locale);
  return (fallbackSolutions as any)[normalized] || [];
}

export function getFallbackSolutionBySlug(slug: string, locale: string) {
  if (!slug) return null;
  const normalized = normalizeLocale(locale);
  const data = (fallbackSolutions as any)[normalized];
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  
  const firstToken = slug.replace(/-/g, ' ').split(' ')[0] ?? '';
  const search = firstToken.toLowerCase();
  
  const match = data.find((item: any) => 
    item?.title?.toLowerCase()?.includes(search)
  );
  return match || data[0];
}
