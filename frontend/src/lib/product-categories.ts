export type ProductCategoryPreview = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
};

/** Join by stable ID: some category list responses contain the default locale's slug. */
export function resolvePopulatedProductCategories(
  categories: Record<string, unknown>[],
  previews: ProductCategoryPreview[],
) {
  const byId = new Map(previews.map((category) => [category.id, category]));
  return categories.flatMap((category) => {
    const preview = byId.get(String(category.id ?? ''));
    if (!preview) return [];
    return [{
      ...category,
      id: preview.id,
      name: preview.name,
      slug: preview.slug,
      description: category.slug === preview.slug ? category.description : '',
      image_url: category.image_url || preview.image_url,
    }];
  });
}
