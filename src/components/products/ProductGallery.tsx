import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "../../types/product";
import { getOptimizedImageUrl } from "../../utils/image";
import { SafeImage } from "../common/SafeImage";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageButtonRef = useRef<HTMLButtonElement>(null);
  const activeProductImage = product.images[activeImageIndex] ?? product.images[0];

  const showPreviousImage = useCallback(() => {
    setActiveImageIndex((index) =>
      index === 0 ? product.images.length - 1 : index - 1,
    );
  }, [product.images.length]);

  const showNextImage = useCallback(() => {
    setActiveImageIndex((index) =>
      index === product.images.length - 1 ? 0 : index + 1,
    );
  }, [product.images.length]);

  useEffect(() => {
    if (!isFullscreenOpen) return;

    const previousOverflow = document.body.style.overflow;
    const imageButton = imageButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreenOpen(false);
      } else if (event.key === "ArrowLeft" && product.images.length > 1) {
        event.preventDefault();
        showPreviousImage();
      } else if (event.key === "ArrowRight" && product.images.length > 1) {
        event.preventDefault();
        showNextImage();
      } else if (event.key === "Tab") {
        const buttons = document.querySelectorAll<HTMLButtonElement>(
          "[data-product-lightbox] button:not(:disabled)",
        );
        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];

        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton?.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      imageButton?.focus();
    };
  }, [isFullscreenOpen, product.images.length, showNextImage, showPreviousImage]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-2 shadow-sm">
        <button
          ref={imageButtonRef}
          type="button"
          onClick={() => setIsFullscreenOpen(true)}
          className="group relative block w-full overflow-hidden rounded-[20px] bg-stone-100 text-right focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-stone-900"
          aria-label={`تكبير صورة ${activeProductImage?.alt ?? product.name}`}
        >
          <SafeImage
            src={
              activeProductImage
                ? getOptimizedImageUrl(activeProductImage.src, 1200, 75)
                : undefined
            }
            alt={activeProductImage?.alt ?? product.name}
            className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            fetchPriority="high"
            decoding="async"
          />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-stone-950/75 px-4 py-2.5 text-sm font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-4 w-4" />
            عرض بحجم الشاشة
          </span>
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-stone-950/65 p-3 text-white shadow-lg backdrop-blur-md transition duration-300 group-hover:scale-90 group-hover:opacity-0">
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">عرض بحجم الشاشة</span>
          </span>
        </button>
      </div>
      {product.images.length > 1 ? (
        <div
          className={`grid gap-3 ${product.images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {product.images.map((image, index) => (
            <button
              key={`${image.src}-${image.alt}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`overflow-hidden rounded-2xl border p-1 transition ${activeImageIndex === index ? "border-stone-900 shadow-sm" : "border-stone-200"}`}
              aria-label={image.alt}
              aria-pressed={activeImageIndex === index}
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
      {isFullscreenOpen && activeProductImage
        ? createPortal(
            <div
              data-product-lightbox
              className="product-lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95 p-3 text-white backdrop-blur-md sm:p-6"
              onClick={() => setIsFullscreenOpen(false)}
              role="presentation"
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-label={`معرض صور ${product.name}`}
                dir="rtl"
                className="product-lightbox-panel relative flex h-full max-h-[1000px] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-stone-950/70 shadow-2xl sm:rounded-[28px]"
                onClick={(event) => event.stopPropagation()}
              >
                <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
                  <div className="min-w-0 text-right">
                    <p className="truncate text-sm font-semibold text-white sm:text-base">
                      {product.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-stone-400">
                      {activeProductImage.alt}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-stone-200 tabular-nums">
                      {activeImageIndex + 1} / {product.images.length}
                    </span>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setIsFullscreenOpen(false)}
                      className="rounded-full border border-white/15 bg-white/10 p-2.5 text-white transition hover:rotate-90 hover:bg-white/20 focus-visible:outline-white"
                      aria-label="إغلاق عرض الصور"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </header>

                <div className="relative flex min-h-0 flex-1 items-center justify-center p-2 sm:p-6">
                  <SafeImage
                    key={activeProductImage.src}
                    src={getOptimizedImageUrl(activeProductImage.src, 2000, 85)}
                    alt={activeProductImage.alt}
                    className="product-lightbox-image max-h-full max-w-full select-none object-contain"
                    decoding="async"
                    draggable={false}
                  />
                  {product.images.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={showPreviousImage}
                        className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-stone-950/60 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 focus-visible:outline-white sm:right-6 sm:h-14 sm:w-14"
                        aria-label="الصورة السابقة"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        onClick={showNextImage}
                        className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-stone-950/60 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 focus-visible:outline-white sm:left-6 sm:h-14 sm:w-14"
                        aria-label="الصورة التالية"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                    </>
                  ) : null}
                </div>

                {product.images.length > 1 ? (
                  <div className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/10 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
                    {product.images.map((image, index) => (
                      <button
                        key={`${image.src}-${image.alt}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`h-14 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition duration-200 sm:h-16 sm:w-20 ${activeImageIndex === index ? "scale-105 border-white opacity-100" : "border-transparent opacity-55 hover:opacity-90"}`}
                        aria-label={`عرض الصورة ${index + 1}: ${image.alt}`}
                        aria-pressed={activeImageIndex === index}
                      >
                        <SafeImage
                          src={getOptimizedImageUrl(image.src, 180, 55)}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
