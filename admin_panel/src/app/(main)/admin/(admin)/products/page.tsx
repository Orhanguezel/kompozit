import { resolveKompozitAdminProductItemType } from "@/lib/kompozit-product-item-type";

import ProductsListPanel from "./_components/products-list-panel";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { type } = await searchParams;
  const itemType = resolveKompozitAdminProductItemType(type);
  return <ProductsListPanel itemType={itemType} />;
}
