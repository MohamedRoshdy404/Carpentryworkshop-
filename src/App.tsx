import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "./components/common/Toast";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { FloatingWhatsApp } from "./components/whatsapp/FloatingWhatsApp";
import { SITE_DESCRIPTION, SITE_NAME } from "./config/siteConfig";
import { getProductBySlug } from "./services/productService";
import { updateMetaTags } from "./utils/seo";

const HomePage = lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.HomePage })),
);
const ProductsPage = lazy(() =>
  import("./pages/Products").then((module) => ({ default: module.ProductsPage })),
);
const ProductDetailsPage = lazy(() =>
  import("./pages/ProductDetails").then((module) => ({
    default: module.ProductDetailsPage,
  })),
);
const AboutPage = lazy(() =>
  import("./pages/About").then((module) => ({ default: module.AboutPage })),
);
const ContactPage = lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.ContactPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFound").then((module) => ({
    default: module.NotFoundPage,
  })),
);

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const productSlug = pathname.match(/^\/products\/([^/]+)$/)?.[1];
    const product = productSlug ? getProductBySlug(productSlug) : undefined;
    const titles: Record<string, [string, string]> = {
      "/": [`الرئيسية | ${SITE_NAME}`, SITE_DESCRIPTION],
      "/products": [`المنتجات | ${SITE_NAME}`, "تصفّح منتجات الورشة وابحث حسب الفئة والسعر والخامات."],
      "/about": [`من نحن | ${SITE_NAME}`, "تعرف على أسلوب الورشة في تنفيذ الأثاث حسب الطلب."],
      "/contact": [`تواصل معنا | ${SITE_NAME}`, "تواصل مع الورشة للاستفسار عن المنتجات وتنفيذ الأثاث."],
    };
    const [title, description] = product
      ? [`${product.name} | ${SITE_NAME}`, product.shortDescription]
      : (titles[pathname] ?? [`الصفحة غير موجودة | ${SITE_NAME}`, SITE_DESCRIPTION]);
    const canonicalUrl = new URL(
      pathname.replace(/^\//, ""),
      `${window.location.origin}${import.meta.env.BASE_URL}`,
    ).toString();

    updateMetaTags(
      title,
      description,
      product?.images[0]?.src,
      canonicalUrl,
      product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images.map((image) => image.src),
            sku: product.slug,
            offers: {
              "@type": "Offer",
              priceCurrency: "EGP",
              price: product.price,
              availability:
                product.availability === "unavailable"
                  ? "https://schema.org/OutOfStock"
                  : product.availability === "custom"
                    ? "https://schema.org/PreOrder"
                    : "https://schema.org/InStock",
              url: canonicalUrl,
            },
          }
        : undefined,
    );
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f1ea] text-stone-800">
      <RouteMetadata />
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-24 text-center text-stone-600" role="status">
              جاري تحميل الصفحة...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ToastContainer />
    </div>
  );
}

export default App;
