import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "./components/common/Toast";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { FloatingWhatsApp } from "./components/whatsapp/FloatingWhatsApp";
import { SITE_DESCRIPTION, SITE_NAME } from "./config/siteConfig";
import { HomePage } from "./pages/Home";
import { updateMetaTags } from "./utils/seo";
import { ProductCatalogProvider } from "./contexts/ProductCatalogProvider";
import { useProductCatalog } from "./contexts/useProductCatalog";

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
const AdminPage = lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminPage })),
);

function RouteMetadata() {
  const { pathname } = useLocation();
  const { products } = useProductCatalog();

  useEffect(() => {
    const productSlug = pathname.match(/^\/products\/([^/]+)$/)?.[1];
    const product = productSlug
      ? products.find((item) => item.slug === productSlug)
      : undefined;
    const titles: Record<string, [string, string]> = {
      "/": [`الرئيسية | ${SITE_NAME}`, SITE_DESCRIPTION],
      "/products": [`المنتجات | ${SITE_NAME}`, "تصفّح منتجات الورشة وابحث حسب الفئة والسعر والخامات."],
      "/about": [`من نحن | ${SITE_NAME}`, "تعرف على أسلوب الورشة في تنفيذ الأثاث حسب الطلب."],
      "/contact": [`تواصل معنا | ${SITE_NAME}`, "تواصل مع الورشة للاستفسار عن المنتجات وتنفيذ الأثاث."],
      "/admin": [`إدارة المنتجات | ${SITE_NAME}`, "لوحة إدارة كتالوج منتجات الورشة."],
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
  }, [pathname, products]);

  return null;
}

function CatalogConnectionNotice() {
  const { error } = useProductCatalog();
  if (!error) return null;
  return (
    <p role="alert" className="mx-auto mt-4 max-w-7xl px-4 text-right text-sm text-amber-800">
      تعذر تحميل بعض المنتجات المحفوظة. المنتجات الأساسية ما زالت معروضة. {error}
    </p>
  );
}

function App() {
  return (
    <ProductCatalogProvider>
      <div dir="rtl" className="min-h-screen bg-[#f7f1ea] text-stone-800">
        <RouteMetadata />
        <Navbar />
        <main>
          <CatalogConnectionNotice />
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
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <FloatingWhatsApp />
        <ToastContainer />
      </div>
    </ProductCatalogProvider>
  );
}

export default App;
