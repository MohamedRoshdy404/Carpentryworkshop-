type SortDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
      <span className="font-medium">ترتيب:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="ترتيب المنتجات"
        className="bg-transparent text-right outline-none"
      >
        <option value="newest">الأحدث</option>
        <option value="price-asc">السعر من الأقل للأعلى</option>
        <option value="price-desc">السعر من الأعلى للأقل</option>
        <option value="popular">الأكثر طلبًا</option>
      </select>
    </label>
  );
}
