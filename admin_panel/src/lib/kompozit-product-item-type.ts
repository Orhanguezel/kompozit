import type { ProductItemType } from "@/integrations/shared/product_admin.types";

const VALID: readonly ProductItemType[] = ["product", "sparepart", "kompozit"] as const;

/** Kompozit admin paneli varsayılan ürün tipi (liste/detay URL'de `type` yoksa). */
export const KOMPOZIT_ADMIN_DEFAULT_PRODUCT_ITEM_TYPE: ProductItemType = "kompozit";

export function resolveKompozitAdminProductItemType(type: string | undefined): ProductItemType {
  if (type && (VALID as readonly string[]).includes(type)) return type as ProductItemType;
  return KOMPOZIT_ADMIN_DEFAULT_PRODUCT_ITEM_TYPE;
}
