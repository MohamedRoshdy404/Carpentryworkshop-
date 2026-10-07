import { describe, expect, it } from "vitest";
import { getOptimizedImageUrl } from "./image";

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
});
