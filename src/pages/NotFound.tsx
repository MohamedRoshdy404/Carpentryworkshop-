import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 text-center">
      <p className="text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase">
        404
      </p>
      <h1 className="mt-4 text-5xl font-black text-stone-900">
        الصفحة غير موجودة
      </h1>
      <p className="mt-4 text-base text-stone-600">
        الصفحة التي تبحث عنها غير متاحة أو تم نقلها.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
