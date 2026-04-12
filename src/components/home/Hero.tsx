import Button from "@/components/ui/Button";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  dateLine: string;
}

export default function Hero({ title, subtitle, ctaLabel, ctaUrl, dateLine }: HeroProps) {
  return (
    <section aria-label="Hero" className="relative flex min-h-[94vh] items-center justify-center overflow-hidden bg-[var(--color-navy-950)]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 25%, rgba(212,168,67,0.22) 0%, transparent 55%), linear-gradient(180deg, rgba(15,27,45,0.95) 0%, rgba(15,27,45,0.5) 45%, rgba(15,27,45,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--theme-hero-dark, rgba(8,15,26,0.3)) 0%, rgba(8,15,26,0.05) 40%, var(--theme-hero-dark, rgba(8,15,26,0.7)) 100%), radial-gradient(ellipse at 65% 35%, var(--theme-hero-glow, rgba(184,146,46,0.18)) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-gold-500)]/40 bg-[var(--color-gold-500)]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-400)]" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-300)]">
            {dateLine}
          </p>
        </div>
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white hyphens-auto sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--color-cream-200)]/70 sm:text-lg md:text-xl">
          {subtitle}
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <Button
            href={ctaUrl}
            variant="primary"
            external
            className="w-full justify-center px-8 py-3.5 text-sm font-bold shadow-lg shadow-[var(--color-gold-500)]/20 sm:w-auto sm:px-9 sm:py-4 sm:text-base"
          >
            {ctaLabel}
          </Button>
          <Button
            href="/program/"
            variant="outline"
            className="w-full justify-center border-white/25 px-8 py-3.5 text-sm text-white hover:bg-white/10 hover:border-white/40 hover:text-white sm:w-auto sm:px-9 sm:py-4 sm:text-base"
          >
            Program ↓
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/20">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
