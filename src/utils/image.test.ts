import { describe, expect, it } from "vitest";
import { categories, products } from "../data/products";
import { getLocalStockImageUrl, getOptimizedImageUrl } from "./image";

describe("getLocalStockImageUrl", () => {
  it("uses the app base path for locally hosted images", () => {
    expect(getLocalStockImageUrl("7614412")).toBe(
      `${import.meta.env.BASE_URL}images/stock/7614412.jpg`,
    );
  });
});

describe("getOptimizedImageUrl", () => {
  it("sets the requested crop, width, quality, and format for Unsplash images", () => {
    const result = new URL(
      getOptimizedImageUrl(
        "https://images.unsplash.com/photo-123?auto=format&fit=contain&w=400&q=80",
        800,
        50,
      ),
    );

    expect(result.searchParams.get("auto")).toBe("format");
    expect(result.searchParams.get("fit")).toBe("crop");
    expect(result.searchParams.get("w")).toBe("800");
    expect(result.searchParams.get("q")).toBe("50");
  });

  it("leaves images from other hosts unchanged", () => {
    const source = "https://images.pexels.com/photo.jpg";
    expect(getOptimizedImageUrl(source, 800)).toBe(source);
  });

  it("leaves relative local image paths unchanged", () => {
    const source = "/images/stock/7614412.jpg";
    expect(getOptimizedImageUrl(source, 800)).toBe(source);
  });

  it("does not request static catalog images from Pexels", () => {
    const imageUrls = [
      ...categories.map((category) => category.image),
      ...products.flatMap((product) => product.images.map((image) => image.src)),
    ];

    expect(imageUrls.some((url) => url.includes("images.pexels.com"))).toBe(
      false,
    );
  });
});
