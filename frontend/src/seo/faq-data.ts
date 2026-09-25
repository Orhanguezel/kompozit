export type FaqEntry = {
  question: string;
  answer: string;
};

type LocaleFaqMap = Record<string, FaqEntry[]>;

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
