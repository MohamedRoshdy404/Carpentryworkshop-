import { useState } from "react";
import type { Product } from "../../types/product";
import { getOptimizedImageUrl } from "../../utils/image";
import { SafeImage } from "../common/SafeImage";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]?.src ?? "");
  const activeProductImage = product.images.find(
    (image) => image.src === activeImage,
  ) ?? product.images[0];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-2 shadow-sm">
        <SafeImage
          src={
            activeProductImage
              ? getOptimizedImageUrl(activeProductImage.src, 960, 65)
              : undefined
          }
          alt={activeProductImage?.alt ?? product.name}
          className="h-[420px] w-full rounded-[20px] object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {product.images.length > 1 ? (
        <div
          className={`grid gap-3 ${product.images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {product.images.map((image) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveImage(image.src)}
              className={`overflow-hidden rounded-2xl border p-1 transition ${activeImage === image.src ? "border-stone-900 shadow-sm" : "border-stone-200"}`}
              aria-label={image.alt}
              aria-pressed={activeImage === image.src}
            >
              <SafeImage
                src={getOptimizedImageUrl(image.src, 320, 55)}
                alt={image.alt}
                className="h-24 w-full rounded-xl object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
