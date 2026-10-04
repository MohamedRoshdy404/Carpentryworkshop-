import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SITE_NAME } from "../../config/siteConfig";
import { openGeneralWhatsAppInquiry } from "../../utils/whatsapp";

const navItems = [
  { label: "الرئيسية", to: "/" },
  { label: "المنتجات", to: "/products" },
  { label: "من نحن", to: "/about" },
  { label: "تواصل معنا", to: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f7f1ea]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}brand-mark.svg`}
            alt=""
            className="h-12 w-12 shrink-0"
          />
          <div className="text-right">
            <p className="text-sm font-bold text-stone-900 sm:text-base">
              {SITE_NAME}
            </p>
            <p className="text-xs text-stone-500">
              أثاث خشبي حسب الطلب
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-stone-900" : "text-stone-600 hover:text-stone-900"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => openGeneralWhatsAppInquiry()}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-100"
          >
            <MessageCircle className="h-4 w-4 text-[#0f766e]" />
            واتساب
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-800 md:hidden"
          aria-label="فتح القائمة"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-stone-200 bg-[#f7f1ea] px-4 py-4 md:hidden">
          <nav id="mobile-navigation" className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-right text-sm font-medium ${isActive ? "bg-stone-900 text-white" : "text-stone-700"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
