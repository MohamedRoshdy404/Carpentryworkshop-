import { MessageCircle } from "lucide-react";
import { openGeneralWhatsAppInquiry } from "../../utils/whatsapp";

export function FloatingWhatsApp() {
  return (
    <button
      type="button"
      onClick={() => openGeneralWhatsAppInquiry()}
      aria-label="استفسار واتساب"
      className="fixed bottom-24 left-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_32px_rgba(37,211,102,0.35)] transition hover:scale-105 md:bottom-5 md:h-16 md:w-16"
      title="استفسر عبر واتساب"
    >
      <MessageCircle className="h-8 w-8" />
    </button>
  );
}
