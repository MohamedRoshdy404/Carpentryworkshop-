import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  normalizeProductCategory,
  products as localProducts,
} from "../data/products";
import { fetchAdditionalProducts } from "../services/productService";
import type { Product } from "../types/product";
import { ProductCatalogContext } from "./ProductCatalogContext";

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRemoteProducts(await fetchAdditionalProducts());
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تحميل المنتجات المضافة من قاعدة البيانات.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const loadedProducts = await fetchAdditionalProducts();
        if (active) {
          setRemoteProducts(loadedProducts);
          setError(null);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "تعذر تحميل المنتجات المضافة من قاعدة البيانات.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => {
    const bySlug = new Map(localProducts.map((product) => [product.slug, product]));
    for (const product of remoteProducts) {
      bySlug.set(product.slug, {
        ...product,
        category: normalizeProductCategory(product.category),
      });
    }
    return [...bySlug.values()];
  }, [remoteProducts]);

  return (
    <ProductCatalogContext.Provider value={{ products, isLoading, error, refresh }}>
      {children}
    </ProductCatalogContext.Provider>
  );
}
