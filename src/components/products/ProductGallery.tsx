import { useState } from "react";
import type { Product } from "../../types/product";
import { SafeImage } from "../common/SafeImage";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]?.src ?? "");

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-2 shadow-sm">
        <SafeImage
          src={activeImage}
          alt={product.name}
          className="h-[420px] w-full rounded-[20px] object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
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
              src={image.src}
              alt={image.alt}
              className="h-24 w-full rounded-xl object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
