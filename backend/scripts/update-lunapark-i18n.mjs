import "dotenv/config";
import mysql from "mysql2/promise";

const productId = "a3885fb1-f1fe-4297-aac8-2eab77e0f4f3";

const trDescription = `
<h2>Kompozit Polyester Lunapark Ekipmanları ve Tema Parkı Ürünleri</h2>
<p>MOE Kompozit, cam elyaf takviyeli kompozit polyester (CTP/FRP) malzemeden <strong>lunapark ekipmanları, tema parkı ürünleri, eğlence parkı kabinleri, oyun makinesi gövdeleri, dekoratif figürler ve özel tasarım kompozit parçalar</strong> üreten uzman bir üreticidir.</p>
<p>Modern üretim teknolojileri, deneyimli teknik ekibi ve yüksek kalite standartlarıyla Türkiye ve uluslararası pazarlardaki lunapark üreticileri, tema parkları, eğlence merkezleri, belediyeler, AVM'ler ve oyun ekipmanı üreticileri için projeye özel çözümler sunar.</p>
<hr>
<h2>Kompozit Polyester (CTP/FRP) Nedir?</h2>
<p>CTP/FRP, cam elyafı ile güçlendirilmiş polyester reçineden oluşan yüksek dayanımlı bir mühendislik malzemesidir. Hafif yapısı, yüksek mukavemeti ve dış ortam koşullarına karşı direnci sayesinde lunapark ve tema parkı sektöründe yaygın olarak tercih edilir.</p>
<ul>
  <li>Paslanmaz ve çürümez.</li>
  <li>Darbelere karşı dayanıklıdır.</li>
  <li>UV ve dış ortam koşullarına uygun üretilebilir.</li>
  <li>Uzun süre düşük bakım ihtiyacı sunar.</li>
  <li>Karmaşık ve estetik formlara imkân verir.</li>
  <li>Renk ve yüzey seçenekleri projeye göre uyarlanabilir.</li>
</ul>
<h2>Ürettiğimiz Lunapark Kabinleri ve Gövdeleri</h2>
<p>MOE Kompozit, dekoratif figürlerin yanı sıra lunapark ve tema parklarında kullanılan eğlence ekipmanlarının kompozit kabin, oturak ve dış gövdelerini de üretir.</p>
<ul>
  <li>Çarpışan oto kabinleri</li>
  <li>Roller coaster ve hız treni vagon gövdeleri</li>
  <li>Dönme dolap kabinleri</li>
  <li>Balerin ünitesi oturakları</li>
  <li>Discovery ve gondol kabinleri</li>
  <li>Salıncak ve uçan sandalye koltukları</li>
  <li>Atlı karınca parçaları</li>
  <li>Çocuk ve mini tren lokomotifleri ile vagonları</li>
  <li>Simülatör ve VR oyun kabinleri</li>
  <li>Jetonlu ve elektrikli oyun makinesi gövdeleri</li>
  <li>Su parkı oyun elemanları</li>
  <li>Tematik oyun ve eğlence parkı araç gövdeleri</li>
</ul>
<h2>Dekoratif ve Tematik Kompozit Ürünler</h2>
<p>İstenilen ölçü, renk ve konsepte uygun özel dekor ve figür üretimi yapılabilir.</p>
<ul>
  <li>Lunapark, maskot ve çizgi karakter figürleri</li>
  <li>Dev heykeller ve hayvan figürleri</li>
  <li>Dinozor ve masal kahramanı maketleri</li>
  <li>Korsan, orman, safari ve su parkı dekorları</li>
  <li>Fotoğraf çekim alanları ve tematik giriş takları</li>
  <li>Reklam, AVM organizasyonu ve festival dekorları</li>
</ul>
<h2>Projeye Özel Kompozit Üretim Süreci</h2>
<p>Standart ürünlerin yanında teknik resim, 3D model veya numune üzerinden tamamen projeye özel tasarımlar geliştiriyoruz.</p>
<ol>
  <li>3D tasarım ve teknik modelleme</li>
  <li>CNC kalıp ve master model hazırlığı</li>
  <li>Cam elyaf takviyeli polyester üretimi</li>
  <li>Jelcoat, boya ve yüzey işlemleri</li>
  <li>Kalite kontrol, montaj ve sevkiyat</li>
</ol>
<h2>Neden Kompozit Polyester?</h2>
<h3>Hafif ve dayanıklı yapı</h3>
<p>Metale göre daha hafif olan kompozit gövdeler taşıma ve montaj kolaylığı sağlarken yoğun kullanıma uygun mekanik dayanım sunar.</p>
<h3>UV ve korozyon direnci</h3>
<p>Doğru reçine, jelcoat ve boya sistemiyle üretilen parçalar güneş, yağmur ve neme karşı uzun ömürlü yüzey performansı sağlar; paslanma ve çürüme yapmaz.</p>
<h3>Düşük bakım maliyeti</h3>
<p>Kolay temizlenebilir yüzeyler, uygun kullanım ve periyodik kontrollerle uzun süre estetik görünümünü korur.</p>
<h3>Tasarım özgürlüğü</h3>
<p>Karmaşık geometriler, özgün karakterler, farklı renkler ve projeye özel yüzey detayları kompozit üretim teknolojisiyle uygulanabilir.</p>
<h2>MOE Kompozit Üretim Kalitesi</h2>
<p>Üretimin her aşamasında kaliteli polyester reçineler, yüksek mukavemetli cam elyafı ve dış ortama uygun jelcoat sistemleri kullanıyoruz. Kalıp tasarımından son yüzey kontrolüne kadar izlenen üretim süreciyle estetik, dayanıklı ve uzun ömürlü ürünler hedefliyoruz.</p>
<ul>
  <li>Projeye özel tasarım ve mühendislik desteği</li>
  <li>Kalıp tasarımı ve imalatı</li>
  <li>Büyük ölçekli parça üretim kapasitesi</li>
  <li>UV dayanımlı yüzey seçenekleri</li>
  <li>Türkiye ve yurt dışı projelerine sevkiyat</li>
</ul>
<h2>Sık Sorulan Sorular</h2>
<h3>Kompozit polyester ürünler dış mekânda kullanılabilir mi?</h3>
<p>Evet. Projeye uygun reçine, UV dayanımlı jelcoat ve boya sistemi seçildiğinde güneş, yağmur, nem ve sıcaklık değişimlerine uygun ürünler üretilebilir.</p>
<h3>Sadece dekoratif figür mü üretiyorsunuz?</h3>
<p>Hayır. Figürlerin yanı sıra çarpışan oto kabinleri, roller coaster vagonları, dönme dolap kabinleri, oturaklar, oyun makinesi gövdeleri ve özel tasarım kompozit parçalar üretiyoruz.</p>
<h3>Özel tasarım üretim yapıyor musunuz?</h3>
<p>Evet. Teknik resim, 3D model veya numune üzerinden ölçü, bağlantı detayı, adet, renk ve yüzey beklentilerine göre proje bazlı üretim gerçekleştiriyoruz.</p>
<h2>Projeniz İçin Kompozit Çözüm</h2>
<p>Lunapark ve tema parkı projelerinizde kabinden dekoratif figüre, dış gövdeden özel tasarım parçaya kadar ihtiyaç duyduğunuz kompozit ürünler için bizimle iletişime geçebilirsiniz.</p>
`.trim();

const enDescription = `
<h2>Composite Amusement Ride Equipment and Theme Park Products</h2>
<p>MOE Composite specializes in manufacturing <strong>amusement ride equipment, theme park products, ride cabins, game-machine bodies, decorative figures and custom composite parts</strong> from glass-fiber reinforced polyester (GRP/FRP).</p>
<p>With modern production methods, an experienced technical team and consistent quality standards, we provide project-specific solutions for amusement ride manufacturers, theme parks, entertainment centers, municipalities, shopping malls and game-equipment producers in Türkiye and international markets.</p>
<hr>
<h2>What Is Glass-Fiber Reinforced Polyester?</h2>
<p>GRP/FRP is a high-strength engineering material made from polyester resin reinforced with glass fiber. Its low weight, mechanical strength and resistance to outdoor conditions make it a widely used material for amusement and theme park applications.</p>
<ul>
  <li>It does not rust or rot.</li>
  <li>It offers good impact resistance.</li>
  <li>It can be engineered for UV and outdoor exposure.</li>
  <li>It provides long service life with low maintenance needs.</li>
  <li>It enables complex and visually distinctive forms.</li>
  <li>Colors and surface finishes can be adapted to the project.</li>
</ul>
<h2>Amusement Ride Cabins and Bodies We Manufacture</h2>
<p>In addition to decorative figures, MOE Composite manufactures composite cabins, seats and exterior bodies for a broad range of amusement and theme park equipment.</p>
<ul>
  <li>Bumper car bodies</li>
  <li>Roller coaster car bodies</li>
  <li>Ferris wheel cabins</li>
  <li>Dance ride and ballerina ride seats</li>
  <li>Discovery and gondola cabins</li>
  <li>Swing ride and flying chair seats</li>
  <li>Carousel components</li>
  <li>Children's train and mini-train locomotives and cars</li>
  <li>Simulator and virtual-reality cabins</li>
  <li>Coin-operated and electric game-machine bodies</li>
  <li>Water park play components</li>
  <li>Themed play cabins and amusement vehicle bodies</li>
</ul>
<h2>Decorative and Themed Composite Products</h2>
<p>We manufacture custom decorative pieces and figures in the dimensions, colors and visual concepts required by each project.</p>
<ul>
  <li>Amusement park, mascot and cartoon-style figures</li>
  <li>Large sculptures and animal figures</li>
  <li>Dinosaur models and fairy-tale characters</li>
  <li>Pirate, jungle, safari and water park scenery</li>
  <li>Photo areas and themed entrance arches</li>
  <li>Advertising, shopping mall, event and festival decorations</li>
</ul>
<h2>Project-Specific Composite Production</h2>
<p>Alongside standard products, we develop fully custom designs from technical drawings, 3D models or physical samples.</p>
<ol>
  <li>3D design and technical modeling</li>
  <li>CNC tooling and master model preparation</li>
  <li>Glass-fiber reinforced polyester production</li>
  <li>Gelcoat, paint and surface finishing</li>
  <li>Quality control, assembly and shipment</li>
</ol>
<h2>Why Choose GRP/FRP?</h2>
<h3>Lightweight and durable construction</h3>
<p>Composite bodies are lighter than comparable metal structures, simplifying handling and installation while providing mechanical performance suited to intensive use.</p>
<h3>UV and corrosion resistance</h3>
<p>Parts manufactured with the right resin, gelcoat and paint system provide durable surface performance against sunlight, rain and humidity without rusting or rotting.</p>
<h3>Low maintenance requirements</h3>
<p>Easy-to-clean surfaces retain their appearance over a long service period when used correctly and inspected periodically.</p>
<h3>Design freedom</h3>
<p>Composite production supports complex geometries, original characters, custom colors and project-specific surface details.</p>
<h2>MOE Composite Production Quality</h2>
<p>We use quality polyester resins, high-strength glass fiber and outdoor-grade gelcoat systems throughout production. From tooling design to final surface inspection, our controlled workflow targets attractive, durable and long-lasting products.</p>
<ul>
  <li>Project-specific design and engineering support</li>
  <li>Tooling design and manufacturing</li>
  <li>Capacity for large composite parts</li>
  <li>UV-resistant surface options</li>
  <li>Shipment support for domestic and international projects</li>
</ul>
<h2>Frequently Asked Questions</h2>
<h3>Can composite polyester products be used outdoors?</h3>
<p>Yes. With a project-appropriate resin, UV-resistant gelcoat and paint system, products can be manufactured for exposure to sunlight, rain, humidity and temperature changes.</p>
<h3>Do you manufacture only decorative figures?</h3>
<p>No. We also manufacture bumper car bodies, roller coaster cars, Ferris wheel cabins, ride seats, game-machine bodies and fully custom composite components.</p>
<h3>Do you provide custom manufacturing?</h3>
<p>Yes. We manufacture from technical drawings, 3D models or samples according to the required dimensions, connection details, quantity, color and surface finish.</p>
<h2>A Composite Solution for Your Project</h2>
<p>Contact us for composite amusement and theme park products ranging from cabins and decorative figures to exterior bodies and fully custom components.</p>
`.trim();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

await connection.beginTransaction();
try {
  const now = new Date();
  await connection.execute(
    `UPDATE product_i18n
     SET title = ?, slug = ?, description = ?, alt = ?, tags = ?, meta_title = ?, meta_description = ?, updated_at = ?
     WHERE product_id = ? AND locale = 'tr'`,
    [
      "Lunapark Oyuncakları",
      "lunapark-oyuncaklari-kabini",
      trDescription,
      "Renkli ve ham kompozit lunapark kabinleri, gövdeleri ve tema parkı ürünleri",
      JSON.stringify(["lunapark", "tema park", "kompozit kabin", "CTP", "FRP", "oyuncak gövdesi"]),
      "Kompozit Lunapark Oyuncakları ve Kabinleri | MOE Kompozit",
      "Lunapark ve tema parkları için kompozit kabin, gövde, oturak, dekoratif figür ve özel tasarım CTP/FRP ürünleri.",
      now,
      productId,
    ],
  );

  await connection.execute(
    `INSERT INTO product_i18n
      (product_id, locale, title, slug, description, alt, tags, meta_title, meta_description, created_at, updated_at)
     VALUES (?, 'en', ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      title = VALUES(title), slug = VALUES(slug), description = VALUES(description),
      alt = VALUES(alt), tags = VALUES(tags), meta_title = VALUES(meta_title),
      meta_description = VALUES(meta_description), updated_at = VALUES(updated_at)`,
    [
      productId,
      "Amusement Ride Cabins and Theme Park Products",
      "lunapark-oyuncaklari-kabini",
      enDescription,
      "Color-finished and raw composite amusement ride cabins, bodies and theme park products",
      JSON.stringify(["amusement rides", "theme park", "composite cabin", "GRP", "FRP", "ride body"]),
      "Composite Amusement Ride Cabins and Bodies | MOE Composite",
      "Custom GRP/FRP cabins, bodies, seats, decorative figures and themed composite products for amusement and theme park projects.",
      now,
      now,
    ],
  );

  await connection.execute("UPDATE products SET updated_at = ? WHERE id = ?", [now, productId]);
  await connection.commit();
  console.log(JSON.stringify({ productId, trLength: trDescription.length, enLength: enDescription.length }));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
