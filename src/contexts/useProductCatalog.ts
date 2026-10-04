import { useContext } from "react";
import { ProductCatalogContext } from "./ProductCatalogContext";

export function useProductCatalog() {
  const value = useContext(ProductCatalogContext);
  if (!value) {
    throw new Error("useProductCatalog must be used inside ProductCatalogProvider");
  }
  return value;
}
