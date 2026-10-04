import { createContext } from "react";
import type { Product } from "../types/product";

export type ProductCatalogValue = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const ProductCatalogContext = createContext<ProductCatalogValue | null>(null);
