import { describe, expect, it } from "vitest";
import type { Product } from "../types/product";
import { searchProducts } from "./productService";

const catalog: Product[] = [
  {
    id: 1,
    name: "غرفة نوم عصرية",
    slug: "modern-bedroom",
    category: "غرف نوم",
    shortDescription: "تصميم عملي",
    description: "غرفة مصنوعة من خشب الزان",
    price: 25000,
    images: [],
    materials: ["خشب زان"],
    dimensions: "حسب الطلب",
    colors: ["بني"],
    availability: "available",
    customizable: true,
    featured: true,
    createdAt: "2026-01-01",
    keywords: ["مودرن"],
  },
];

describe("searchProducts", () => {
  it("returns the full catalog for an empty or whitespace-only query", () => {
    expect(searchProducts("", catalog)).toEqual(catalog);
    expect(searchProducts("   ", catalog)).toEqual(catalog);
  });

  it("matches normalized text across product details", () => {
    expect(searchProducts("  زان ", catalog)).toEqual(catalog);
    expect(searchProducts("مودرن", catalog)).toEqual(catalog);
    expect(searchProducts("بني", catalog)).toEqual(catalog);
  });

  it("returns no products when nothing matches", () => {
    expect(searchProducts("مكتب", catalog)).toEqual([]);
  });
});
