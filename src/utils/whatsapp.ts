import { WHATSAPP_NUMBER } from "../config/siteConfig";
import type { Product } from "../types/product";
import { formatPrice } from "./price";
import { showToast } from "./toast";

export const createWhatsAppMessage = (
  product?: Partial<Product>,
  customMessage?: string,
): string => {
  if (!product) {
    return (
      customMessage ??
      "السلام عليكم، أرغب في الاستفسار عن منتجات الورشة."
    );
  }

  const productName = product.name ?? "منتج من الورشة";
  const productPrice =
    product.price !== undefined ? formatPrice(product.price) : "يُحدد عند الاستفسار";
  const productUrl = `${window.location.origin}${import.meta.env.BASE_URL}products/${product.slug ?? ""}`;
  const request =
    customMessage ?? "هل المنتج متاح؟ وأرغب في معرفة باقي التفاصيل.";

  return `السلام عليكم،\nأنا مهتم بالمنتج التالي:\n\nاسم المنتج: ${productName}\nالسعر: ${productPrice}\nرابط المنتج:\n${productUrl}\n\n${request}`;
};

export const openWhatsApp = (
  product?: Partial<Product>,
  customMessage?: string,
): void => {
  openWhatsAppMessage(createWhatsAppMessage(product, customMessage));
};

export const openGeneralWhatsAppInquiry = (
  customMessage = "السلام عليكم، أرغب في الاستفسار عن منتجات الورشة.",
): void => {
  openWhatsAppMessage(customMessage);
};

function openWhatsAppMessage(message: string): void {
  if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
    showToast("أضف رقم واتساب الورشة الدولي في src/config/siteConfig.ts");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const newWindow = window.open("about:blank", "_blank");

  if (!newWindow) {
    showToast("تعذر فتح واتساب. تحقق من إعدادات النوافذ المنبثقة.");
    return;
  }

  newWindow.opener = null;
  newWindow.location.href = url;
}
