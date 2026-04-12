interface CtaBannerProps {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonUrl: string;
}

export default function CtaBanner({ title, subtitle, buttonLabel, buttonUrl }: CtaBannerProps) {
  return (
    <section aria-label="Ticket call to action" className="relative overflow-hidden bg-[var(--color-navy-950)] py-24">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(212,168,67,0.12) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--color-gold-500), transparent)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-cream-200)]/55 sm:text-base md:text-lg">
          {subtitle}
        </p>
        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--color-gold-500)] px-8 py-4 text-sm font-bold text-[var(--color-navy-950)] shadow-xl shadow-[var(--color-gold-500)]/20 hover:bg-[var(--color-gold-400)] transition-colors sm:w-auto sm:px-10 sm:text-base"
        >
          {buttonLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
