import type { ProductAvailability } from "../../types/product";

type FilterPanelProps = {
  categories: string[];
  selectedCategory: string;
  maxPrice: number;
  availability: ProductAvailability | "all";
  customizableOnly: boolean;
  featuredOnly: boolean;
  onCategoryChange: (category: string) => void;
  onMaxPriceChange: (value: number) => void;
  onAvailabilityChange: (value: ProductAvailability | "all") => void;
  onCustomizableChange: (value: boolean) => void;
  onFeaturedChange: (value: boolean) => void;
  onReset: () => void;
};

export function FilterPanel({
  categories,
  selectedCategory,
  maxPrice,
  availability,
  customizableOnly,
  featuredOnly,
  onCategoryChange,
  onMaxPriceChange,
  onAvailabilityChange,
  onCustomizableChange,
  onFeaturedChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="space-y-6 rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-stone-900">تصفية المنتجات</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-stone-600 hover:text-stone-900"
        >
          إعادة الضبط
        </button>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-stone-700">الفئة</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`rounded-full px-3 py-2 text-sm ${selectedCategory === "all" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700"}`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-3 py-2 text-sm ${selectedCategory === category ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700"}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="price-range"
          className="mb-3 flex items-center justify-between text-sm font-medium text-stone-700"
        >
          <span>الحد الأعلى للسعر</span>
          <span>{maxPrice} جنيه</span>
        </label>
        <input
          id="price-range"
          type="range"
          min={0}
          max={70000}
          step={500}
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          className="w-full accent-stone-900"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-stone-700">الحالة</p>
        <select
          value={availability}
          onChange={(event) =>
            onAvailabilityChange(
              event.target.value as ProductAvailability | "all",
            )
          }
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 outline-none"
        >
          <option value="all">الكل</option>
          <option value="available">متاح</option>
          <option value="custom">حسب الطلب</option>
          <option value="unavailable">غير متاح مؤقتًا</option>
        </select>
      </div>

      <div className="space-y-3 text-sm text-stone-700">
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-3 py-2">
          <span>تنفيذ حسب الطلب</span>
          <input
            type="checkbox"
            checked={customizableOnly}
            onChange={(event) => onCustomizableChange(event.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-3 py-2">
          <span>منتجات مميزة</span>
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(event) => onFeaturedChange(event.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}
