import {
  Copy,
  HeartHandshake,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductGallery } from "../components/products/ProductGallery";
import { ProductPrice } from "../components/products/ProductPrice";
import { WhatsAppButton } from "../components/whatsapp/WhatsAppButton";
import { showToast } from "../utils/toast";
import { useProductCatalog } from "../contexts/useProductCatalog";

export function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { products, isLoading } = useProductCatalog();

  const product = useMemo(
    () => products.find((item) => item.slug === slug),
    [products, slug],
  );

  if (isLoading && !product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-32 text-center text-stone-600" role="status">
        جاري تحميل المنتج...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-32 text-center">
        <h1 className="text-4xl font-black text-stone-900">المنتج غير متاح</h1>
        <p className="mt-3 text-stone-600">
          لم نعثر على المنتج الذي تبحث عنه؛ ربما حُذف أو تغيّر رابطه.
        </p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white"
        >
          العودة للمنتجات
        </button>
      </div>
    );
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}products/${product.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("تم نسخ رابط المنتج");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast("تعذر نسخ الرابط");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}products/${product.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        showToast("تعذرت مشاركة الرابط");
      }
      return;
    }

    showToast("المشاركة غير متاحة في هذا المتصفح");
  };

  const statusLabel = {
    available: "متاح",
    custom: "حسب الطلب",
    unavailable: "غير متاح مؤقتًا",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-stone-500">
        <Link to="/" className="hover:text-stone-800">
          الرئيسية
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-stone-800">
          المنتجات
        </Link>
        <span>/</span>
        <span className="text-stone-800">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery key={product.slug} product={product} />

        <div className="text-right">
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase">
            {product.category}
          </p>
          <h1 className="text-3xl font-black text-stone-900 md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-8 text-stone-600">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {statusLabel[product.availability]}
            </span>
            {product.customizable ? (
              <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-medium text-[#166534]">
                تنفيذ حسب الطلب
              </span>
            ) : null}
          </div>

          <div className="mt-6">
            <ProductPrice price={product.price} oldPrice={product.oldPrice} />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              product={product}
              label={
                product.availability === "unavailable"
                  ? "استفسر عن التوفر عبر واتساب"
                  : "اطلب المنتج عبر واتساب"
              }
              variant="primary"
              customMessage={
                product.availability === "unavailable"
                  ? "أرغب في معرفة موعد توفر المنتج."
                  : undefined
              }
            />
            <WhatsAppButton
              product={product}
              label="استفسر عن المنتج"
              variant="secondary"
              customMessage="أرغب في معرفة التفاصيل والتوافر."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700"
            >
              <Copy className="h-4 w-4" />{" "}
              {copied ? "تم النسخ" : "نسخ رابط المنتج"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700"
            >
              <Share2 className="h-4 w-4" /> مشاركة
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-stone-900">تفاصيل المنتج</h2>
          <p className="mt-4 text-base leading-8 text-stone-600">
            {product.description}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">المواد</p>
              <ul className="mt-2 space-y-2 text-sm text-stone-700">
                {product.materials.map((material) => (
                  <li key={material}>• {material}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">الأبعاد</p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                {product.dimensions}
              </p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">الألوان المتاحة</p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                {product.colors.join(" • ")}
              </p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">التصنيع</p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                {product.estimatedTime ?? "يتم تحديده بعد الاستفسار"}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm text-right">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#0f766e]" />
              <h3 className="text-xl font-bold text-stone-900">
                معلومات التنفيذ
              </h3>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-600">
              <li>• التنفيذ حسب الطلب متاح في معظم المنتجات.</li>
              <li>• الأسعار والتفاصيل واضحة قبل بدء التنفيذ.</li>
              <li>• نتابع الطلب حتى التسليم.</li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-[#f4d4a8] p-6 text-right shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-stone-900" />
              <h3 className="text-xl font-bold text-stone-900">
                ملاحظات الورشة
              </h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              {product.notes ??
                "يتم تجهيز المنتج حسب الخامة المختارة ومقاسات العميل عند الحاجة."}
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6 text-right shadow-sm">
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-5 w-5 text-[#0f766e]" />
              <h3 className="text-xl font-bold text-stone-900">
                للاستفسار
              </h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              إذا كانت لديك تفاصيل خاصة أو مقاسات مخصصة، فتواصل معنا عبر واتساب
              لمعرفة السعر وموعد التنفيذ.
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 p-3 backdrop-blur-lg md:hidden">
        <div className="mx-auto flex max-w-md gap-3">
          <WhatsAppButton
            product={product}
            label={
              product.availability === "unavailable"
                ? "استفسر عن التوفر"
                : "اطلب عبر واتساب"
            }
            variant="primary"
            customMessage={
              product.availability === "unavailable"
                ? "أرغب في معرفة موعد توفر المنتج."
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
