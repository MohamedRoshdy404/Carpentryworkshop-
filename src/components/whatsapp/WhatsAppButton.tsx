import { MessageCircle } from "lucide-react";
import type { Product } from "../../types/product";
import { openWhatsApp } from "../../utils/whatsapp";

type WhatsAppButtonProps = {
  product?: Product;
  label?: string;
  variant?: "primary" | "secondary";
  customMessage?: string;
};

export function WhatsAppButton({
  product,
  label = "اطلب المنتج عبر واتساب",
  variant = "primary",
  customMessage,
}: WhatsAppButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-[#25D366] text-white hover:bg-[#1ebc5b]"
      : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100";

  return (
    <button
      type="button"
      onClick={() => openWhatsApp(product, customMessage)}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition ${styles}`}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </button>
  );
}
