import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "ابحث عن المنتج...",
}: SearchBarProps) {
  return (
    <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200">
      <Search className="h-4 w-4 text-stone-500" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="بحث المنتجات"
        className="w-full border-0 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
      />
    </label>
  );
}
