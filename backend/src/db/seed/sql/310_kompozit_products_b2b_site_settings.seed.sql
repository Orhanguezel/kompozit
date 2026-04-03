INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
  (
    UUID(),
    'kompozit__products.b2b',
    'tr',
    JSON_OBJECT(
      'catalogEyebrow', 'B2B katalog',
      'catalogTitle', 'Seri uretim, ozel olcu ve teknik sartnameye gore parca ihtiyaciniz mi var?',
      'catalogBody', 'Katalogdaki her urun hatti; malzeme, proses, miktar ve termin icin proje bazli degerlendirilir. Teklif ve muhendislik gorusu icin dogrudan iletisime gecebilirsiniz.',
      'requestQuote', 'Teklif talep et',
      'talkToEngineering', 'Muhendislik ile gorus',
      'detailEyebrow', 'Teknik netlestirme',
      'detailTitle', 'Tolerans, yuzey veya uygulama ortami hakkinda sorunuz mu var?',
      'detailBody', 'Bu urun sayfasini referans gostererek iletisim formundan yazin; teknik ekibimiz uygunluk ve alternatif proses secenekleriyle donus yapar.',
      'reliability', JSON_OBJECT(
        'title', 'Uretim disiplini',
        'desc', 'Tekrarlanabilir B2B teslim beklentileriyle hizali uretim ve kalite kontrol.'
      ),
      'engineering', JSON_OBJECT(
        'title', 'Muhendislik destegi',
        'desc', 'Cizim, kalip stratejisi ve malzeme secimi icin uygulama odakli rehberlik.'
      ),
      'speed', JSON_OBJECT(
        'title', 'Termin odagi',
        'desc', 'Numune, revizyon ve seri uretime gecis icin net kilometre taslari.'
      ),
      'logistics', JSON_OBJECT(
        'title', 'Ihracata uygun sevkiyat',
        'desc', 'Sinir otesi B2B gonderimlere uygun paketleme ve dokumantasyon.'
      )
    ),
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    'kompozit__products.b2b',
    'en',
    JSON_OBJECT(
      'catalogEyebrow', 'B2B catalogue',
      'catalogTitle', 'Need composite parts for series production, custom dimensions, or technical specifications?',
      'catalogBody', 'Each product line in the catalogue is reviewed against material, process, volume, and lead-time requirements. Contact us directly for quotation and engineering input.',
      'requestQuote', 'Request a quote',
      'talkToEngineering', 'Talk to engineering',
      'detailEyebrow', 'Technical alignment',
      'detailTitle', 'Do you have questions about tolerance, finish, or operating conditions?',
      'detailBody', 'Reference this product page in the contact form and our technical team will respond with suitability feedback and alternative process options.',
      'reliability', JSON_OBJECT(
        'title', 'Production discipline',
        'desc', 'Manufacturing and quality control aligned with repeatable B2B delivery expectations.'
      ),
      'engineering', JSON_OBJECT(
        'title', 'Engineering support',
        'desc', 'Application-focused guidance for drawings, tooling strategy, and material selection.'
      ),
      'speed', JSON_OBJECT(
        'title', 'Lead-time focus',
        'desc', 'Clear milestones for samples, revisions, and ramp-up into serial production.'
      ),
      'logistics', JSON_OBJECT(
        'title', 'Export-ready shipping',
        'desc', 'Packaging and documentation fit for cross-border B2B deliveries.'
      )
    ),
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  updated_at = NOW(3);
