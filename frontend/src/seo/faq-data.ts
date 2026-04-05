export type FaqEntry = {
  question: string;
  answer: string;
};

type LocaleFaqMap = Record<string, FaqEntry[]>;

export const solutionFaqData: Record<string, LocaleFaqMap> = {
  'solution-planters': {
    tr: [
      { question: 'Kompozit saksilar dis mekanda ne kadar dayaniklidir?', answer: 'Dogru recine ve jelcoat secimiyle UV, nem ve sicaklik dongulerine karsi uzun omurlu kullanim saglanabilir.' },
      { question: 'Ozel olcu ve renk secenekleri destekleniyor mu?', answer: 'Evet. Numune asamasinda olcu, renk, doku ve yuzey seviyesi birlikte dogrulanabilir.' },
      { question: 'Seri uretim icin minimum siparis miktari var mi?', answer: 'MOQ urun geometrisi, kalip yapisi ve hedef teslim planina gore belirlenir; proje bazli degerlendirilir.' },
      { question: 'Ihracat icin paketleme yapabiliyor musunuz?', answer: 'B2B sevkiyat planina gore koruyucu paketleme ve dokumantasyon akisi kurgulanabilir.' },
      { question: 'Mekanik dayanım nasil dogrulaniyor?', answer: 'Numune uretim uzerinden kalinlik, yuzey ve saha kullanimina uygun mekanik davranis kontrol edilir.' },
    ],
    en: [
      { question: 'How durable are the planters outdoors?', answer: 'With the right resin and gelcoat system, the parts can be engineered for long-term UV, moisture, and temperature exposure.' },
      { question: 'Can you support custom sizes and finishes?', answer: 'Yes. Dimensions, color, texture, and finish level can all be validated during sampling.' },
      { question: 'Is there a minimum order quantity for serial production?', answer: 'MOQ depends on geometry, tooling strategy, and target delivery cadence, so it is defined project by project.' },
      { question: 'Can packaging be prepared for export?', answer: 'Yes. Protective packaging and related documentation can be aligned with the B2B shipment plan.' },
      { question: 'How do you validate mechanical performance?', answer: 'Thickness, finish, and application-fit behavior are checked on sample output before serial release.' },
    ],
  },
  'solution-coffins': {
    tr: [
      { question: 'Kompozit tabutlarda agirlik avantaji saglanir mi?', answer: 'Evet. Malzeme yapisi, tasima ergonomisi ve gerekli rijitlik seviyesi hedeflenerek hafif cozumler gelistirilebilir.' },
      { question: 'Markaya ozel tasarim uygulanabilir mi?', answer: 'Kaplama, renk ve detay varyantlari musteri standardina gore numune ile dogrulanabilir.' },
      { question: 'Yuzey kalitesi nasil kontrol edilir?', answer: 'Numune ve ilk seri kontrollerinde boya uyumu, parlaklik ve genel finish kriterleri kontrol edilir.' },
      { question: 'Dagitim icin uygun paketleme sunuyor musunuz?', answer: 'Ic pazar ve ihracat senaryolarina uygun koruyucu paketleme kurgulanabilir.' },
      { question: 'Seri kapasite nasil planlaniyor?', answer: 'Kalıp disiplini ve teslim programina gore tekrarli tedarik akisi proje basinda sabitlenir.' },
    ],
    en: [
      { question: 'Do composite coffins offer a weight advantage?', answer: 'Yes. The structure can be engineered for handling ergonomics while preserving the required rigidity and finish quality.' },
      { question: 'Can the product be adapted to a customer brand?', answer: 'Brand-specific finish, color, and detail variants can be validated through the sample stage.' },
      { question: 'How is finish quality controlled?', answer: 'Paint compatibility, gloss, and overall finish criteria are checked on samples and early serial batches.' },
      { question: 'Do you support packaging for distribution?', answer: 'Protective packaging can be designed around domestic distribution or export handling needs.' },
      { question: 'How do you plan serial capacity?', answer: 'Tooling discipline and the target delivery cadence are fixed early to support repeatable supply.' },
    ],
  },
  'solution-storage-tanks': {
    tr: [
      { question: 'Hangi kimyasallar icin kompozit tank cozumleri uygundur?', answer: 'Uygunluk; kimyasal turu, konsantrasyon, sicaklik ve basincla birlikte recine secimi yapilarak belirlenir.' },
      { question: 'Yerinde montaj secenegi var mi?', answer: 'Proje buyuklugune gore fabrika uretimi, moduler sevkiyat veya yerinde montaj senaryolari degerlendirilebilir.' },
      { question: 'Sizdirmazlik nasil kontrol edilir?', answer: 'Baglanti detaylari, laminat yapisi ve kritik test ihtiyaclari teknik teklif fazinda belirlenir.' },
      { question: 'Numune panel calismasi yapiyor musunuz?', answer: 'Evet. Kritik uygulamalarda test paneli veya detay prototipi ile karar sureci desteklenebilir.' },
      { question: 'Bakim ve omur beklentisi nasil ele aliniyor?', answer: 'Kullanim kosullari ve servis senaryosu tasarim sirasinda tanimlanarak omur beklentisi buna gore ele alinir.' },
    ],
    en: [
      { question: 'Which chemicals are these tank solutions suitable for?', answer: 'Suitability is determined by matching resin chemistry to the specific media, concentration, temperature, and pressure conditions.' },
      { question: 'Can you support field installation?', answer: 'Depending on project scale, factory build, modular shipment, or field assembly scenarios can be evaluated.' },
      { question: 'How is leak integrity handled?', answer: 'Joint details, laminate architecture, and any critical testing steps are defined during the technical offer phase.' },
      { question: 'Do you prepare sample panels?', answer: 'Yes. For critical applications, test laminates or detail prototypes can support the decision process.' },
      { question: 'How do you address service life expectations?', answer: 'Operating conditions and maintenance scenarios are defined up front so the design reflects the intended service life.' },
    ],
  },
  'solution-custom-b2b': {
    tr: [
      { question: 'Sadece karbon fiber mi calisiyorsunuz?', answer: 'Hayir. Karbon fiber, cam elyaf ve hibrit kompozit yapilar uygulamaya gore birlikte degerlendirilir.' },
      { question: 'Cizim olmadan proje baslatilabilir mi?', answer: 'On bilgi ile on degerlendirme yapilabilir; net fiyat ve proses karari icin teknik veri gereklidir.' },
      { question: 'Numune sureci nasil ilerler?', answer: 'Kritik olcu, yuzey ve montaj beklentileri once numune uzerinden dogrulanir, sonra seri gecis plani olusturulur.' },
      { question: 'Ihracat programlarina uygun calisiyor musunuz?', answer: 'Evet. Paketleme ve dokumantasyon akisi hedef pazara gore planlanabilir.' },
      { question: 'Kalite kaydi talep edilebilir mi?', answer: 'Proje kapsaminda gerekli kalite kayitlari ve teslim belgeleri once teknik ticari gorusmede belirlenir.' },
    ],
    en: [
      { question: 'Do you only work with carbon fiber?', answer: 'No. Carbon fiber, fiberglass, and hybrid laminate options are reviewed based on the application.' },
      { question: 'Can a project start without detailed drawings?', answer: 'An initial review can start with basic inputs, but pricing and process selection require technical detail.' },
      { question: 'How does the sampling phase work?', answer: 'Critical dimensions, finish, and fit expectations are validated on sample parts before the serial transition plan is locked.' },
      { question: 'Can you support export programs?', answer: 'Yes. Packaging and documentation can be aligned with the target market and shipment model.' },
      { question: 'Can quality documentation be requested?', answer: 'Required records and delivery documents are defined in the project scope during the technical-commercial review.' },
    ],
  },
};

export const productFaqData: Record<string, LocaleFaqMap> = {
  'karbon-fiber-panel-prototipi': {
    tr: [
      { question: 'Bu panel prototipi hangi uygulamalar icin uygundur?', answer: 'Hafiflik ve rijitlik gerektiren endustriyel panel, kapak ve muhafaza uygulamalari icin referans urun niteligindedir.' },
      { question: 'Numune uzerinden revizyon yapilabilir mi?', answer: 'Evet. Kalinlik, yuzey ve baglanti detaylari numune fazinda netlestirilebilir.' },
      { question: 'Seri uretime gecis destekleniyor mu?', answer: 'Prototip dogrulamasi sonrasinda kalip, miktar ve termin planina gore seri uretim modeli olusturulur.' },
    ],
    en: [
      { question: 'Which applications fit this panel prototype?', answer: 'It is a reference product for industrial panels, covers, and enclosure parts that need low weight and rigidity.' },
      { question: 'Can revisions be made after the sample stage?', answer: 'Yes. Thickness, finish, and interface details can be refined during sampling.' },
      { question: 'Can this move into serial production?', answer: 'After prototype validation, the serial route is defined around tooling, volume, and lead time.' },
    ],
  },
  'carbon-fiber-panel-prototype': {
    tr: [
      { question: 'Bu panel prototipi hangi uygulamalar icin uygundur?', answer: 'Hafiflik ve rijitlik gerektiren endustriyel panel, kapak ve muhafaza uygulamalari icin referans urun niteligindedir.' },
      { question: 'Numune uzerinden revizyon yapilabilir mi?', answer: 'Evet. Kalinlik, yuzey ve baglanti detaylari numune fazinda netlestirilebilir.' },
      { question: 'Seri uretime gecis destekleniyor mu?', answer: 'Prototip dogrulamasi sonrasinda kalip, miktar ve termin planina gore seri uretim modeli olusturulur.' },
    ],
    en: [
      { question: 'Which applications fit this panel prototype?', answer: 'It is a reference product for industrial panels, covers, and enclosure parts that need low weight and rigidity.' },
      { question: 'Can revisions be made after the sample stage?', answer: 'Yes. Thickness, finish, and interface details can be refined during sampling.' },
      { question: 'Can this move into serial production?', answer: 'After prototype validation, the serial route is defined around tooling, volume, and lead time.' },
    ],
  },
  'ctp-koruyucu-govde-paneli': {
    tr: [
      { question: 'CTP panel hangi ortamlar icin uygundur?', answer: 'Kimyasal direnç, saha dayanimi ve koruyucu govde gerektiren endustriyel uygulamalar icin uygundur.' },
      { question: 'Yuzey kaplama secenekleri var mi?', answer: 'Proje ihtiyacina gore teknik mat veya farkli finish seviyeleri degerlendirilebilir.' },
      { question: 'Kapak veya muhafaza ailesi olarak gelistirilebilir mi?', answer: 'Evet. Cizim ve kullanim senaryosuna gore ayni urun ailesinde varyantlar olusturulabilir.' },
    ],
    en: [
      { question: 'Which environments suit this FRP panel?', answer: 'It fits industrial body and cover applications that need durability, chemical resistance, and repeatable production.' },
      { question: 'Are finish options available?', answer: 'Yes. Technical matte or other finish levels can be reviewed according to the project brief.' },
      { question: 'Can it be expanded into a wider enclosure family?', answer: 'Yes. Variants can be developed around the same product family when drawings and use conditions are shared.' },
    ],
  },
  'frp-protective-enclosure-panel': {
    tr: [
      { question: 'CTP panel hangi ortamlar icin uygundur?', answer: 'Kimyasal direnç, saha dayanimi ve koruyucu govde gerektiren endustriyel uygulamalar icin uygundur.' },
      { question: 'Yuzey kaplama secenekleri var mi?', answer: 'Proje ihtiyacina gore teknik mat veya farkli finish seviyeleri degerlendirilebilir.' },
      { question: 'Kapak veya muhafaza ailesi olarak gelistirilebilir mi?', answer: 'Evet. Cizim ve kullanim senaryosuna gore ayni urun ailesinde varyantlar olusturulabilir.' },
    ],
    en: [
      { question: 'Which environments suit this FRP panel?', answer: 'It fits industrial body and cover applications that need durability, chemical resistance, and repeatable production.' },
      { question: 'Are finish options available?', answer: 'Yes. Technical matte or other finish levels can be reviewed according to the project brief.' },
      { question: 'Can it be expanded into a wider enclosure family?', answer: 'Yes. Variants can be developed around the same product family when drawings and use conditions are shared.' },
    ],
  },
  'cam-elyaf-servis-kapagi': {
    tr: [
      { question: 'Bu servis kapagi dis ortam icin uygun mu?', answer: 'Evet. Korozif ortam ve saha kullanimina yonelik hafif, dayanikli kompozit referans kaydidir.' },
      { question: 'Montaj detaylari uyarlanabilir mi?', answer: 'Menteşe, baglanti ve kenar trim detaylari uygulamaya gore uyarlanabilir.' },
      { question: 'Teknik teklif icin hangi bilgi gerekir?', answer: 'Olcu, kullanim ortami, beklenen miktar ve teslim hedefi teklif surecini hizlandirir.' },
    ],
    en: [
      { question: 'Is this service cover suitable for outdoor use?', answer: 'Yes. It is a reference part for outdoor and corrosive environments that need a lightweight composite cover.' },
      { question: 'Can mounting details be adapted?', answer: 'Hinges, interfaces, and trim details can be adjusted to the application.' },
      { question: 'What information is needed for a quote?', answer: 'Dimensions, environment, target volume, and timing help shape the technical quotation quickly.' },
    ],
  },
  'fiberglass-service-cover': {
    tr: [
      { question: 'Bu servis kapagi dis ortam icin uygun mu?', answer: 'Evet. Korozif ortam ve saha kullanimina yonelik hafif, dayanikli kompozit referans kaydidir.' },
      { question: 'Montaj detaylari uyarlanabilir mi?', answer: 'Menteşe, baglanti ve kenar trim detaylari uygulamaya gore uyarlanabilir.' },
      { question: 'Teknik teklif icin hangi bilgi gerekir?', answer: 'Olcu, kullanim ortami, beklenen miktar ve teslim hedefi teklif surecini hizlandirir.' },
    ],
    en: [
      { question: 'Is this service cover suitable for outdoor use?', answer: 'Yes. It is a reference part for outdoor and corrosive environments that need a lightweight composite cover.' },
      { question: 'Can mounting details be adapted?', answer: 'Hinges, interfaces, and trim details can be adjusted to the application.' },
      { question: 'What information is needed for a quote?', answer: 'Dimensions, environment, target volume, and timing help shape the technical quotation quickly.' },
    ],
  },
};
