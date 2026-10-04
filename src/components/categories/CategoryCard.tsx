import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Category } from "../../types/product";
import { SafeImage } from "../common/SafeImage";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative">
        <SafeImage
          src={category.image}
          alt={category.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-right text-white">
          <h3 className="text-2xl font-bold">{category.name}</h3>
          <p className="mt-1 text-sm text-stone-200">{category.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4 text-sm font-medium text-stone-700">
        <span>استكشف الآن</span>
        <ArrowLeft className="h-4 w-4" />
      </div>
    </Link>
  );
}
