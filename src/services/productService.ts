import { products } from "../data/products";
import type { Product } from "../types/product";
import { supabase } from "./supabase";

export const getProducts = (): Product[] => [...products];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((product) => product.category === category);

export const searchProducts = (
  query: string,
  catalog: Product[] = products,
): Product[] => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [...catalog];
  }

  return catalog.filter((product) => {
    const haystack = [
      product.name,
      product.category,
      product.shortDescription,
      product.description,
      product.materials.join(" "),
      product.colors.join(" "),
      product.keywords?.join(" ") ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
};

type ProductRecord = {
  id: number;
  product: Omit<Product, "id">;
};

export async function fetchAdditionalProducts(): Promise<Product[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id, product")
    .eq("is_published", true)
    .order("id", { ascending: false });

  if (error) throw new Error(`تعذر تحميل المنتجات: ${error.message}`);
  return ((data ?? []) as ProductRecord[]).map(({ id, product }) => ({
    ...product,
    id,
  }));
}
