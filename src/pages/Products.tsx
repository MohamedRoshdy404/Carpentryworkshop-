import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterPanel } from "../components/products/FilterPanel";
import { ProductGrid } from "../components/products/ProductGrid";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { SearchBar } from "../components/common/SearchBar";
import { SectionTitle } from "../components/common/SectionTitle";
import { SortDropdown } from "../components/common/SortDropdown";
import { categories } from "../data/products";
import type { ProductAvailability } from "../types/product";
import { searchProducts } from "../services/productService";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const categoryFromUrl = searchParams.get("category");
  const selectedCategory =
    categoryFromUrl &&
    categories.some((category) => category.name === categoryFromUrl)
      ? categoryFromUrl
      : "all";
  const [sortBy, setSortBy] = useState("newest");
  const [priceLimit, setPriceLimit] = useState(70000);
  const [availability, setAvailability] = useState<ProductAvailability | "all">(
    "all",
  );
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileFiltersOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const categoryNames = categories.map((category) => category.name);

  const filteredProducts = useMemo(() => {
    let list = searchProducts(query);

    if (selectedCategory !== "all") {
      list = list.filter((product) => product.category === selectedCategory);
    }

    list = list.filter((product) => product.price <= priceLimit);

    if (availability !== "all") {
      list = list.filter((product) => product.availability === availability);
    }

    if (customizableOnly) {
      list = list.filter((product) => product.customizable);
    }

    if (featuredOnly) {
      list = list.filter((product) => product.featured);
    }

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = [...list].sort(
          (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
        );
        break;
      default:
        list = [...list].sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
        );
        break;
    }

    return list;
  }, [
    availability,
    customizableOnly,
    featuredOnly,
    priceLimit,
    query,
    selectedCategory,
    sortBy,
  ]);

  const resetFilters = () => {
    setQuery("");
    setSortBy("newest");
    setPriceLimit(70000);
    setAvailability("all");
    setCustomizableOnly(false);
    setFeaturedOnly(false);
    setSearchParams({});
  };

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSearchParams({});
      return;
    }
    setSearchParams({ category });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <SectionTitle
        level={1}
        eyebrow="الكتالوج"
        title="منتجاتنا"
        description="تصفّح التصنيفات، وابحث عن القطعة المناسبة، وقارن الأسعار والخصومات بوضوح."
      />

      <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full xl:max-w-xl">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SortDropdown value={sortBy} onChange={setSortBy} />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 xl:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            تصفية
          </button>
        </div>
      </div>

      <div className="mt-8 hidden xl:block">
        <FilterPanel
          categories={categoryNames}
          selectedCategory={selectedCategory}
          maxPrice={priceLimit}
          availability={availability}
          customizableOnly={customizableOnly}
          featuredOnly={featuredOnly}
          onCategoryChange={handleCategoryChange}
          onMaxPriceChange={setPriceLimit}
          onAvailabilityChange={setAvailability}
          onCustomizableChange={setCustomizableOnly}
          onFeaturedChange={setFeaturedOnly}
          onReset={resetFilters}
        />
      </div>

      {mobileFiltersOpen ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 p-4 xl:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setMobileFiltersOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filters-title"
            className="mx-auto mt-10 max-w-md rounded-[30px] bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 id="mobile-filters-title" className="text-lg font-bold text-stone-900">الفلاتر</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-stone-600"
              >
                إغلاق
              </button>
            </div>
            <FilterPanel
              categories={categoryNames}
              selectedCategory={selectedCategory}
              maxPrice={priceLimit}
              availability={availability}
              customizableOnly={customizableOnly}
              featuredOnly={featuredOnly}
              onCategoryChange={(category) => {
                handleCategoryChange(category);
                setMobileFiltersOpen(false);
              }}
              onMaxPriceChange={setPriceLimit}
              onAvailabilityChange={setAvailability}
              onCustomizableChange={setCustomizableOnly}
              onFeaturedChange={setFeaturedOnly}
              onReset={() => {
                resetFilters();
                setMobileFiltersOpen(false);
              }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        {isLoading ? (
          <LoadingSkeleton count={4} />
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState
            title="لم نجد منتجات مطابقة لبحثك"
            message="حاول تغيير كلمة البحث أو إزالة بعض الفلاتر للعثور على القطعة المناسبة."
            actionLabel="العودة للمنتجات"
            actionHref="/products"
          />
        )}
      </div>
    </div>
  );
}
