import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-700">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold text-stone-900">{title}</h3>
      <p className="mt-3 max-w-md text-stone-600">{message}</p>
      {actionHref && actionLabel ? (
        <Link
          to={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
