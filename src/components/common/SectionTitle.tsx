type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "right" | "left";
  level?: 1 | 2;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "right",
  level = 2,
}: SectionTitleProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div
      className={align === "left" ? "text-right md:text-left" : "text-right"}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-bold text-stone-900 md:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-3 max-w-2xl text-base text-stone-600">{description}</p>
      ) : null}
    </div>
  );
}
