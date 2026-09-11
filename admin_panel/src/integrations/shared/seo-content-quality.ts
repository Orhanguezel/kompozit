export type SeoQualityInput = {
  title?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
  focusKeyword?: string;
};

export type SeoQualityResult = {
  score: number;
  wordCount: number;
  checks: Array<{ label: string; passed: boolean; points: number; hint: string }>;
};

const plainText = (html: string) =>
  html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function scoreSeoContent(input: SeoQualityInput): SeoQualityResult {
  const content = input.content || "";
  const text = plainText(content);
  const words = text.split(/\s+/).filter(Boolean);
  const keyword = (input.focusKeyword || input.title || "").trim().toLocaleLowerCase("tr");
  const searchable = `${input.title || ""} ${text}`.toLocaleLowerCase("tr");
  const occurrences = keyword ? searchable.split(keyword).length - 1 : 0;
  const density = words.length ? occurrences / words.length : 0;
  const checks = [
    { label: "Başlık ve içerik dolu", passed: Boolean(input.title?.trim() && words.length), points: 15, hint: "Başlık ve açıklama ekleyin." },
    { label: "En az 250 kelime", passed: words.length >= 250, points: 15, hint: `Şu anda ${words.length} kelime; ürünü daha ayrıntılı anlatın.` },
    { label: "Odak kelime içerikte", passed: occurrences > 0, points: 15, hint: "Ürün adını metinde doğal biçimde kullanın." },
    { label: "Doğal anahtar kelime yoğunluğu", passed: density >= 0.004 && density <= 0.02, points: 10, hint: "Odak kelime yoğunluğunu %0,4–2 aralığında tutun." },
    { label: "Ara başlık yapısı", passed: (content.match(/<h2\b/gi) || []).length >= 2, points: 10, hint: "En az iki H2 ara başlık ekleyin." },
    { label: "İç bağlantı", passed: /<a\s/i.test(content), points: 10, hint: "İlgili kategori veya çözüm sayfasına bağlantı ekleyin." },
    { label: "Ürün görseli", passed: Boolean(input.imageUrl?.trim()), points: 10, hint: "Açıklayıcı bir ürün görseli ekleyin." },
    { label: "Meta başlık", passed: (input.metaTitle?.trim().length || 0) >= 35 && (input.metaTitle?.trim().length || 0) <= 65, points: 7, hint: "Meta başlığı 35–65 karakter yapın." },
    { label: "Meta açıklama", passed: (input.metaDescription?.trim().length || 0) >= 120 && (input.metaDescription?.trim().length || 0) <= 170, points: 8, hint: "Meta açıklamayı 120–170 karakter yapın." },
  ];
  return { score: checks.reduce((sum, check) => sum + (check.passed ? check.points : 0), 0), wordCount: words.length, checks };
}
