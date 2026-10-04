import { Camera, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ADDRESS,
  BUSINESS_DETAILS_PLACEHOLDER,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_NUMBER,
  SITE_NAME,
} from "../../config/siteConfig";

const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-[#f6f0ea]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}brand-mark.svg`}
              alt=""
              className="h-11 w-11 shrink-0"
            />
            <div className="text-right">
              <p className="text-lg font-bold text-stone-900">{SITE_NAME}</p>
              <p className="text-xs text-stone-500">
                أثاث خشبي حسب الطلب
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            نصنع أثاثًا أنيقًا وعمليًا يناسب أسلوب حياتك، مع تنفيذ حسب الطلب
            واهتمام بالتفاصيل.
          </p>
        </div>

        <div className="text-right">
          <h3 className="text-lg font-bold text-stone-900">روابط سريعة</h3>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            <li>
              <Link to="/">الرئيسية</Link>
            </li>
            <li>
              <Link to="/products">منتجاتنا</Link>
            </li>
            <li>
              <Link to="/about">من نحن</Link>
            </li>
            <li>
              <Link to="/contact">تواصل معنا</Link>
            </li>
          </ul>
        </div>

        <div className="text-right">
          <h3 className="text-lg font-bold text-stone-900">تواصل معنا</h3>
          <ul className="mt-4 space-y-4 text-sm text-stone-600">
            <li className="flex items-center justify-end gap-2">
              <MapPin className="h-4 w-4" /> {ADDRESS || "العنوان غير متاح"}
            </li>
            <li className="flex items-center justify-end gap-2">
              <Phone className="h-4 w-4" /> {PHONE_NUMBER || "رقم الهاتف يُضاف لاحقًا"}
            </li>
            <li className="flex items-center justify-end gap-2">
              <MessageCircle className="h-4 w-4" /> واتساب
            </li>
          </ul>
          <div className="mt-5 flex justify-end gap-3">
            {FACEBOOK_URL ? (
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="فيسبوك"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700"
              >
                f
              </a>
            ) : null}
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="انستغرام"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700"
              >
                <Camera className="h-4 w-4" />
              </a>
            ) : null}
          </div>
          {!FACEBOOK_URL && !INSTAGRAM_URL ? (
            <p className="mt-4 text-xs text-stone-500">{BUSINESS_DETAILS_PLACEHOLDER}</p>
          ) : null}
        </div>
      </div>
      <div className="border-t border-stone-200 px-4 py-4 text-center text-sm text-stone-500 md:px-6 lg:px-8">
        © {COPYRIGHT_YEAR} {SITE_NAME}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
