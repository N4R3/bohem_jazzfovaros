interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  center = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <div className={`mb-3 h-0.5 w-10 rounded-full bg-[var(--color-gold-500)] ${center ? "mx-auto" : ""}`} aria-hidden="true" />
      <h2
        className={`font-display text-3xl font-bold leading-tight hyphens-auto md:text-4xl ${
          light ? "text-[var(--color-cream-50)]" : "text-[var(--color-navy-900)]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 max-w-2xl text-base leading-relaxed ${
            light ? "text-[var(--color-cream-200)]/70" : "text-[var(--color-navy-700)]/75"
          } ${center ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
