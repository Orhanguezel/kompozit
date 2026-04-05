export type HowToStepEntry = {
  name: string;
  text: string;
};

type LocaleMap = Record<string, HowToStepEntry[]>;

export const howToSteps: Record<string, LocaleMap> = {
  'solution-planters': {
    tr: [
      { name: 'Kullanim ortami analizi', text: 'Dis mekan kosullari, UV maruziyeti, nem dongusu ve hedef boyutlar proje basinda netlestirilir.' },
      { name: 'Laminat ve recine secimi', text: 'Yuzey beklentisi, kimyasal dayanim ve agirlik hedeflerine gore cam elyaf ve recine sistemi belirlenir.' },
      { name: 'Kalıp ve numune dogrulamasi', text: 'Renk, doku, kalinlik ve mekanik davranis numune uzerinde kontrol edilir.' },
      { name: 'Seri uretim planlama', text: 'Termin, paketleme ve sevkiyat modeli B2B tedarik akisina gore sabitlenir.' },
    ],
    en: [
      { name: 'Review the operating environment', text: 'Outdoor exposure, UV load, moisture cycles, and target dimensions are clarified at project kickoff.' },
      { name: 'Define laminate and resin system', text: 'Fiberglass architecture and resin chemistry are selected around finish, weight, and durability targets.' },
      { name: 'Validate tooling and sample output', text: 'Color, texture, thickness, and mechanical behavior are verified on sample parts before scale-up.' },
      { name: 'Lock serial production plan', text: 'Lead time, packaging, and shipment format are aligned with the B2B supply program.' },
    ],
  },
  'solution-coffins': {
    tr: [
      { name: 'Olcu ve tasima gereksinimini netlestirme', text: 'Standartlar, agirlik sinirlari ve seremoni beklentileri proje kapsaminda toplanir.' },
      { name: 'Yuzey ve malzeme dogrulama', text: 'Kaplama uyumu, rijitlik ve tasima ergonomisi icin uygun kompozit yapisi belirlenir.' },
      { name: 'Numune onayi', text: 'Musteri markasi, renk ve yuzey detaylari numune urun uzerinden son kez kontrol edilir.' },
      { name: 'Seri sevkiyat hazirligi', text: 'Paketleme ve dagitim modeli ic pazar veya ihracat senaryosuna gore planlanir.' },
    ],
    en: [
      { name: 'Clarify dimensions and handling needs', text: 'Standard sizes, weight limits, and ceremony requirements are defined at the start of the project.' },
      { name: 'Validate finish and composite structure', text: 'The right structure is selected for coating compatibility, rigidity, and handling ergonomics.' },
      { name: 'Approve the sample unit', text: 'Branding, color, and finish details are confirmed on a sample before the production release.' },
      { name: 'Prepare serial shipment flow', text: 'Packaging and distribution are organized around domestic or export delivery scenarios.' },
    ],
  },
  'solution-storage-tanks': {
    tr: [
      { name: 'Proses verilerini toplama', text: 'Hacim, kimyasal icerik, sicaklik ve basinclara dair calisma verileri teknik dosyada toplanir.' },
      { name: 'Laminat tasarimi', text: 'Recine tipi, kalinlik ve baglanti detaylari uygulamaya ozel olarak muhendislikle belirlenir.' },
      { name: 'Numune panel ve test', text: 'Gerekli oldugunda test paneli veya kritik detay prototipi ile dayanım senaryolari dogrulanir.' },
      { name: 'Uretim ve montaj koordinasyonu', text: 'Fabrika uretimi, yerinde montaj veya moduler sevkiyat akisi teslim planina baglanir.' },
    ],
    en: [
      { name: 'Collect process data', text: 'Volume, media, temperature, and pressure conditions are documented before engineering starts.' },
      { name: 'Design the laminate', text: 'Resin chemistry, thickness, and joining details are engineered specifically for the application.' },
      { name: 'Validate via sample panel or test piece', text: 'When needed, critical durability scenarios are checked through test laminates or prototype details.' },
      { name: 'Coordinate production and installation', text: 'Factory build, field assembly, or modular shipment is linked to the final delivery plan.' },
    ],
  },
  'solution-custom-b2b': {
    tr: [
      { name: 'Teknik cizim ve hedefleri toplama', text: 'Parca geometrisi, kullanim ortami, miktar ve teslim takvimi ayni proje dosyasinda birlestirilir.' },
      { name: 'Malzeme ve proses rotasi secimi', text: 'Karbon fiber, cam elyaf veya hibrit yapi ile en uygun uretim rotasi belirlenir.' },
      { name: 'Numune ve revizyon dongusu', text: 'Prototip uzerinden kritik toleranslar ve yuzey beklentileri dogrulanir.' },
      { name: 'Seri uretim ve ihracat hazirligi', text: 'Kalite kayitlari, paketleme ve dokumantasyon seri sevkiyata uygun sekilde tamamlanir.' },
    ],
    en: [
      { name: 'Gather drawings and project goals', text: 'Part geometry, operating conditions, volume, and timeline are consolidated into one technical brief.' },
      { name: 'Choose material and production route', text: 'Carbon fiber, fiberglass, or hybrid construction is matched to the right manufacturing path.' },
      { name: 'Run sample and revision cycle', text: 'Critical tolerances and finish expectations are validated on prototype output.' },
      { name: 'Prepare serial and export readiness', text: 'Quality records, packaging, and documentation are completed for repeatable shipment.' },
    ],
  },
};
