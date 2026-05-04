import { resolveKompozitAdminProductItemType } from "@/lib/kompozit-product-item-type";

import ProductDetailClient from "../_components/product-detail-client";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { type } = await searchParams;
  const itemType = resolveKompozitAdminProductItemType(type);
  return <ProductDetailClient id={id} itemType={itemType} />;
}
