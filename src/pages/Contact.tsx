import { Camera, Clock3, Globe, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import {
  GOOGLE_MAPS_URL,
  PHONE_NUMBER,
  ADDRESS,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  WORKING_HOURS,
  BUSINESS_DETAILS_PLACEHOLDER,
} from "../config/siteConfig";
import { openGeneralWhatsAppInquiry } from "../utils/whatsapp";

export function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-10 text-right">
        <p className="text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase">
          تواصل معنا
        </p>
        <h1 className="mt-4 text-4xl font-black text-stone-900">
          اتصل بنا أو راسلنا مباشرة
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5 text-right">
          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-bold text-stone-900">اتصل بنا</h2>
            </div>
            <p className="mt-4 text-base text-stone-600">
              {PHONE_NUMBER || "رقم الهاتف غير مُضاف بعد."}
            </p>
            {PHONE_NUMBER ? (
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" />
                اتصل الآن
              </a>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-[#0f766e]" />
              <h2 className="text-xl font-bold text-stone-900">واتساب</h2>
            </div>
            <p className="mt-4 text-base text-stone-600">
              للاستفسار عن المنتجات والتصميمات الخاصّة
            </p>
            <button
              type="button"
              onClick={() => openGeneralWhatsAppInquiry()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Send className="h-4 w-4" />
              ابدأ محادثة واتساب
            </button>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-bold text-stone-900">العنوان</h2>
            </div>
            <p className="mt-4 text-base text-stone-600">
              {ADDRESS || "عنوان الورشة يُضاف بعد تزويدنا بالموقع الصحيح."}
            </p>
            {GOOGLE_MAPS_URL ? (
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800"
              >
                <MapPin className="h-4 w-4" />
                خريطة Google
              </a>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-bold text-stone-900">أوقات العمل</h2>
            </div>
            <p className="mt-4 text-base text-stone-600">
              {WORKING_HOURS || "مواعيد العمل تُضاف بعد تأكيدها من إدارة الورشة."}
            </p>
          </div>
        </div>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-stone-200 bg-white p-8 text-center shadow-sm lg:min-h-[600px]">
          <MapPin className="h-12 w-12 text-stone-400" />
          <h2 className="mt-5 text-2xl font-bold text-stone-900">موقع الورشة</h2>
          <p className="mt-3 max-w-md leading-7 text-stone-600">
            {ADDRESS || BUSINESS_DETAILS_PLACEHOLDER}
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-[32px] border border-stone-200 bg-[#f7f1ea] p-8 text-right">
        <h2 className="text-2xl font-bold text-stone-900">
          وسائل التواصل الاجتماعي
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {FACEBOOK_URL ? (
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700"
            >
              <Globe className="h-4 w-4" />
              فيسبوك
            </a>
          ) : null}
          {INSTAGRAM_URL ? (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700"
            >
              <Camera className="h-4 w-4" />
              انستغرام
            </a>
          ) : null}
        </div>
        {!FACEBOOK_URL && !INSTAGRAM_URL ? (
          <p className="mt-4 text-sm text-stone-600">
            أضف روابط حسابات الورشة في إعدادات الموقع لعرضها هنا.
          </p>
        ) : null}
      </div>
    </div>
  );
}
