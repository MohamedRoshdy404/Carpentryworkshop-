import {
  ArrowLeft,
  CheckCircle2,
  Hammer,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryCard } from "../components/categories/CategoryCard";
import { SectionTitle } from "../components/common/SectionTitle";
import { ProductCard } from "../components/products/ProductCard";
import { categories, products } from "../data/products";
import { HOME_IMAGE } from "../config/siteConfig";
import { openGeneralWhatsAppInquiry } from "../utils/whatsapp";
import { SafeImage } from "../components/common/SafeImage";
import { getOptimizedImageUrl } from "../utils/image";

const features = [
  {
    icon: Hammer,
    title: "نجارة متقنة",
    description: "تصميم وتنفيذ بعناية، مع تفاصيل دقيقة وجودة مستدامة.",
  },
  {
    icon: Palette,
    title: "ألوان وتفاصيل حسب الطلب",
    description: "نقدم تشكيلة متكاملة من الألوان والخامات واللمسات المخصصة.",
  },
  {
    icon: ShieldCheck,
    title: "جودة مضمونة",
    description: "نراجع كل قطعة قبل التسليم للتأكد من جودة التصنيع وثباتها.",
  },
];

export function HomePage() {
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

  return (
    <div className="pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-stone-200 bg-[#f1e7d8] shadow-[0_30px_60px_-30px_rgba(41,37,36,0.35)]">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10 lg:p-12">
            <div className="flex flex-col justify-center text-right">
              <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-stone-600">
                ورشة نجارة متخصصة
              </p>
              <h1 className="text-4xl font-black leading-tight text-stone-900 md:text-5xl lg:text-6xl">
                أثاث بيتك... على ذوقك
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-stone-700">
                نصنع الأثاث بعناية، بجودة تليق ببيتك وتصميم يناسب ذوقك.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  تصفّح المنتجات
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => openGeneralWhatsAppInquiry()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
                >
                  تواصل معنا على واتساب
                </button>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-[28px]">
              <SafeImage
                src={getOptimizedImageUrl(HOME_IMAGE, 900, 65)}
                alt="أثاث منزلي فخم"
                className="h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
              <div className="absolute bottom-5 right-5 rounded-[20px] bg-white/90 px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-[10px] tracking-[0.22em] text-stone-500 uppercase">
                  خدماتنا
                </p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  تنفيذ حسب الطلب
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionTitle
          eyebrow="منتجاتنا"
          title="أبرز المنتجات"
          description="مجموعة مختارة بعناية لتناسب أسلوبك وتتكامل مع منزلك وبيئة عملك."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionTitle
          eyebrow="التصنيفات"
          title="اكتشف فئات أثاثنا"
          description="من غرف النوم إلى الدواليب، كل مجموعة مصممة لتجمع بين الوظيفة والفخامة."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionTitle
          eyebrow="لماذا نحن"
          title="اختيارك الآمن للديكور والراحة"
          description="نوازن بين ذوقك الشخصي وجودة التنفيذ والأسعار المناسبة."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[28px] border border-stone-200 bg-white p-6 text-right shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4d4a8] text-stone-900">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-stone-900">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="rounded-[32px] border border-stone-200 bg-[#1c1917] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="text-right">
              <p className="text-xs font-semibold tracking-[0.28em] text-stone-300 uppercase">
                تصميم خاص
              </p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                عندك تصميم خاص؟
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-stone-300">
                أرسل إلينا تصميمك أو المقاسات المطلوبة، وسنعمل على تنفيذها حسب طلبك.
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <button
                type="button"
                onClick={() =>
                  openGeneralWhatsAppInquiry(
                    "السلام عليكم، أرغب في تنفيذ قطعة أثاث بتصميم ومقاسات خاصة وأريد الاستفسار عن إمكانية التنفيذ.",
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4d4a8] px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-[#edc27b]"
              >
                اطلب تنفيذ تصميم خاص
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[32px] border border-stone-200 bg-white p-8 shadow-sm md:grid-cols-2">
          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase">
              حرفية الورشة
            </p>
            <h2 className="mt-4 text-3xl font-bold text-stone-900">
              تصنيع يدوي بمواصفات دقيقة
            </h2>
            <p className="mt-4 text-base leading-8 text-stone-600">
              نبدأ من فكرتك ونحوّلها إلى تصميم عملي، ثم ننفّذها بأيدٍ خبيرة
              وخامات مناسبة للاستخدام المنزلي والعملي.
            </p>
            <div className="mt-6 flex items-center gap-3 text-stone-700">
              <CheckCircle2 className="h-5 w-5 text-[#0f766e]" />
              <span>تنفيذ حسب المقاسات واحتياج العميل</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-stone-700">
              <CheckCircle2 className="h-5 w-5 text-[#0f766e]" />
              <span>خامات مناسبة للوظيفة اليومية</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-stone-700">
              <CheckCircle2 className="h-5 w-5 text-[#0f766e]" />
              <span>إشراف ومتابعة طوال فترة التنفيذ</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px]">
            <SafeImage
              src={getOptimizedImageUrl(HOME_IMAGE, 800, 60)}
              alt="خزانة وتصنيع أثاث يدوي"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="rounded-[32px] bg-[#f4d4a8] p-8 text-center text-stone-900 md:p-12">
          <Sparkles className="mx-auto h-10 w-10" />
          <h2 className="mt-4 text-3xl font-bold">
            هل أنت مستعد لبدء مشروعك مع أثاث مميز؟
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-stone-700">
            تواصل معنا الآن لنتناقش في الفكرة والمقاسات والتصميم المناسب لبيتك أو
            مشروعك.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              تصفّح منتجاتنا
            </Link>
            <button
              type="button"
              onClick={() => openGeneralWhatsAppInquiry()}
              className="inline-flex items-center justify-center rounded-full border border-stone-700 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
            >
              استفسر عبر واتساب
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
