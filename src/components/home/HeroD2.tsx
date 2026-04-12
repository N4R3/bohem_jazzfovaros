interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  dateLine: string;
}

export default function HeroD2({ title, subtitle, ctaLabel, ctaUrl, dateLine }: HeroProps) {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[80vh] overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #0d6e7a 0%, #0a5060 40%, #083a48 100%)" }}
    >
      {/* Water wave layers */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 md:h-64"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #0a4858 60%, #083040 100%)",
        }}
        aria-hidden="true"
      />
      {/* Animated wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
          <path
            d="M0 60 C360 100 720 20 1080 60 C1260 80 1350 40 1440 60 L1440 120 L0 120 Z"
            fill="rgba(10,64,80,0.6)"
          />
          <path
            d="M0 80 C240 50 480 110 720 80 C960 50 1200 110 1440 80 L1440 120 L0 120 Z"
            fill="rgba(8,48,64,0.8)"
          />
        </svg>
      </div>

      {/* Sky glow */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(180,220,100,0.08) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* City skyline illustration placeholder */}
      <div className="absolute bottom-16 right-0 w-full max-w-2xl md:right-8" aria-hidden="true">
        <div
          className="h-40 w-full md:h-52"
          style={{
            background: "url('/images/city-skyline.png') bottom center / contain no-repeat",
            opacity: 0.7,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-32 pt-20 sm:px-8 sm:pt-28">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#b8d4a0]">
          {dateLine}
        </p>
        <h1
          className="font-display font-bold leading-[1.0] text-white"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 7rem)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[#a8d0d8] sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-[#0a3040] shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #f0cc6a 0%, #e8b84a 100%)" }}
          >
            <span>🦆</span>
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
