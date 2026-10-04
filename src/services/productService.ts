import { products } from "../data/products";
import type { Product } from "../types/product";

export const getProducts = (): Product[] => [...products];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((product) => product.category === category);

export const searchProducts = (query: string): Product[] => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return getProducts();
  }

  return products.filter((product) => {
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
