import { CheckCircle2, Gem, Hammer, ShieldCheck } from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { HOME_IMAGE } from "../config/siteConfig";
import { SafeImage } from "../components/common/SafeImage";

const values = [
  {
    icon: Hammer,
    title: "حرفية متقنة",
    description:
      "نصنع كل قطعة بتفاصيل دقيقة واهتمام كبير لا يقتصر على الشكل فقط بل على المتانة والراحة.",
  },
  {
    icon: Gem,
    title: "خامات مختارة",
    description:
      "نختار الخامات المناسبة لكل قطعة، من الأخشاب والقشرة إلى مواد التشطيب.",
  },
  {
    icon: ShieldCheck,
    title: "جودة وثقة",
    description:
      "نحرص على أن تناسب كل قطعة منزلك وأن تدوم معك طويلًا.",
  },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <SectionTitle
        level={1}
        eyebrow="من نحن"
        title="نصنع الأثاث بعناية وحرفية"
        description="نؤمن بأن الأثاث لا يقتصر على الشكل فقط، بل هو جزء من الراحة والهوية في المنزل."
      />

      <div className="mt-10 grid gap-8 rounded-[32px] border border-stone-200 bg-white p-8 shadow-sm md:grid-cols-2">
        <div className="text-right">
          <h2 className="text-3xl font-bold text-stone-900">من نكون؟</h2>
          <p className="mt-4 text-base leading-8 text-stone-600">
            نحن ورشة متخصصة في صناعة الأثاث المنزلي والعملي والديكوري بجودة
            عالية. نصمم حلولًا تناسب المساحات المختلفة، مستفيدين من خبرتنا في
            أعمال النجارة والتشطيب.
          </p>
          <p className="mt-4 text-base leading-8 text-stone-600">
            نركز على تصميم أثاث عملي يناسب الحياة اليومية، مع مراعاة المقاسات
            والذوق واحتياجات المنزل أو المشروع.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px]">
          <SafeImage
            src={HOME_IMAGE}
            alt="ورشة أثاث"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <section className="mt-16">
        <SectionTitle eyebrow="قيمنا" title="ما الذي يجعلنا مختلفين؟" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[28px] border border-stone-200 bg-white p-6 text-right shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4d4a8] text-stone-900">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-stone-900">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[32px] border border-stone-200 bg-[#1c1917] p-8 text-white md:p-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.24em] text-stone-300 uppercase">
              التنفيذ حسب الطلب
            </p>
            <h2 className="mt-4 text-3xl font-bold">
              تخصيص الأثاث بناءً على رؤيتك
            </h2>
            <p className="mt-4 text-base leading-8 text-stone-300">
              إذا كانت لديك فكرة خاصة أو مساحة محددة أو مقاسات معينة، ندرس
              احتياجاتك ونقترح تصميمًا مناسبًا للاستخدام اليومي ومظهر المكان.
            </p>
          </div>
          <div className="space-y-4 text-right text-stone-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#f4d4a8]" />{" "}
              <span>دراسة المساحة باهتمام</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#f4d4a8]" />{" "}
              <span>اقتراح خامات وألوان قابلة للتنفيذ</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#f4d4a8]" />{" "}
              <span>متابعة التنفيذ حتى نهاية التشطيب</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
