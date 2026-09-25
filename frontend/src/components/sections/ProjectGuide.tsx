import Link from 'next/link';
import { localizedPath } from '@/seo/helpers';

/** Project inputs, not measured material properties or certification claims. */
export function ProjectGuide({ locale }: { locale: string }) {
  const en = locale.startsWith('en');
  const rows = en ? [
    ['Dimensions and interfaces', 'mm', 'Drawing revision, wall thickness and mounting points'],
    ['Quantity and delivery', 'pieces / date', 'Prototype quantity, production batches and target delivery'],
    ['Service conditions', '°C / environment', 'Operating temperature, outdoor exposure and chemical contact'],
    ['Acceptance criteria', 'drawing / test method', 'Dimensional tolerances, surface requirements and requested inspection reports'],
  ] : [
    ['Ölçüler ve bağlantılar', 'mm', 'Çizim revizyonu, cidar kalınlığı ve montaj noktaları'],
    ['Adet ve teslimat', 'adet / tarih', 'Numune adedi, seri üretim partileri ve hedef teslim tarihi'],
    ['Çalışma koşulları', '°C / ortam', 'Çalışma sıcaklığı, dış ortam ve kimyasal temas bilgisi'],
    ['Kabul kriterleri', 'çizim / test yöntemi', 'Ölçü toleransları, yüzey beklentisi ve talep edilen kontrol raporları'],
  ];
  const links = en ? [
    ['/products', 'Explore the product catalogue', 'Review product groups and application areas before sending a request.'],
    ['/gallery', 'Explore the production gallery', 'View available product and process photographs.'],
    ['/references', 'References and cooperation', 'Review the published reference information.'],
    ['/blog', 'Read the technical guides', 'Explore material selection and composite production topics.'],
  ] : [
    ['/products', 'Ürün kataloğunu inceleyin', 'Talep göndermeden önce ürün gruplarını ve uygulama alanlarını görün.'],
    ['/gallery', 'Üretim galerisini inceleyin', 'Yayımlanan ürün ve süreç fotoğraflarına göz atın.'],
    ['/references', 'Referanslar ve iş birliği', 'Yayımlanmış referans bilgilerini değerlendirin.'],
    ['/blog', 'Teknik rehberleri okuyun', 'Malzeme seçimi ve kompozit üretimi hakkında bilgi edinin.'],
  ];
  return (
    <section className="section-py bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-[1300px] space-y-8 px-6 lg:px-12">
        <h2 className="section-title-cc">{en ? 'Prepare your composite project brief' : 'Kompozit projeniz için teknik hazırlık'}</h2>
        <p>{en ? 'For carbon fiber, FRP and fiberglass parts, share the following inputs with your quotation request. Final material properties and acceptance limits depend on the agreed design and testing.' : 'Karbon fiber, CTP ve cam elyaf parçalarda teklif talebinizle birlikte aşağıdaki bilgileri paylaşın. Nihai malzeme özellikleri ve kabul sınırları, mutabık kalınan tasarım ve testlere bağlıdır.'}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map(([label, unit, detail]) => <div key={label} className="border border-[var(--color-border)] p-5"><h3 className="font-semibold">{label} <span className="font-normal">({unit})</span></h3><p className="mt-2 text-[var(--color-text-secondary)]">{detail}</p></div>)}
        </div>
        <p>{en ? 'Any required certificate or test report should be confirmed for the specific product and scope before ordering.' : 'Gerekli sertifika veya test raporu, sipariş öncesinde ilgili ürün ve kapsam için doğrulanmalıdır.'} <Link className="underline" href={localizedPath(locale, '/offer')}>{en ? 'Send your project requirements' : 'Proje gereksinimlerinizi gönderin'}</Link>.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(([path, label, detail]) => <div key={path}><h3 className="font-semibold"><Link className="underline" href={localizedPath(locale, path!)}>{label}</Link></h3><p className="mt-2 text-[var(--color-text-secondary)]">{detail}</p></div>)}
        </div>
        <Link href={localizedPath(en ? 'tr' : 'en', '/')} hrefLang={en ? 'tr' : 'en'} className="inline-block underline">{en ? 'Türkçe ürün ve proje bilgileri' : 'Product and project information in English'}</Link>
      </div>
    </section>
  );
}
