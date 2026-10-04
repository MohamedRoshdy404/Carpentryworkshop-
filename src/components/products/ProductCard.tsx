import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { getOptimizedImageUrl } from "../../utils/image";
import { openWhatsApp } from "../../utils/whatsapp";
import { SafeImage } from "../common/SafeImage";
import { ProductPrice } from "./ProductPrice";

type ProductCardProps = {
  product: Product;
};

const availabilityLabel: Record<Product["availability"], string> = {
  available: "متاح للتنفيذ",
  custom: "حسب الطلب",
  unavailable: "غير متاح مؤقتًا",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_12px_30px_-18px_rgba(28,25,23,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-20px_rgba(28,25,23,0.28)]">
      <div className="relative overflow-hidden">
        <SafeImage
          src={
            product.images[0]?.src
              ? getOptimizedImageUrl(product.images[0].src, 640, 60)
              : undefined
          }
          alt={product.images[0]?.alt ?? product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          fetchPriority="low"
          decoding="async"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 backdrop-blur-sm">
          {product.category}
        </div>
        {product.availability === "available" ? (
          <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-semibold text-[#166534]">
            <CheckCircle2 className="h-3 w-3" />{" "}
            {availabilityLabel[product.availability]}
          </div>
        ) : (
          <div className="absolute right-4 top-4 rounded-full bg-stone-200 px-2.5 py-1 text-[10px] font-semibold text-stone-700">
            {availabilityLabel[product.availability]}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-stone-900">{product.name}</h3>
          {product.discount ? (
            <span className="rounded-full bg-[#f4d4a8] px-2 py-1 text-[10px] font-bold text-stone-900">
              خصم {product.discount}%
            </span>
          ) : null}
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-6 text-stone-600">
          {product.shortDescription}
        </p>

        <ProductPrice price={product.price} oldPrice={product.oldPrice} />

        <div className="mt-5 flex gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            عرض التفاصيل
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                product,
                product.availability === "unavailable"
                  ? "أرغب في معرفة موعد توفر المنتج."
                  : undefined,
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400 hover:bg-stone-100"
            aria-label={
              product.availability === "unavailable"
                ? `استفسر عن توفر ${product.name} عبر واتساب`
                : `اطلب ${product.name} عبر واتساب`
            }
          >
            <MessageCircle className="h-4 w-4 text-[#0f766e]" />
            {product.availability === "unavailable" ? "اسأل عن التوفر" : "واتساب"}
          </button>
        </div>
      </div>
    </article>
  );
}
