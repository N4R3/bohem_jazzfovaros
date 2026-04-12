import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  dateLine: string;
}

export default function HeroD3({ title, subtitle, ctaLabel, ctaUrl, dateLine }: HeroProps) {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[82vh] overflow-hidden"
    >
      {/* Subtle dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,42,37,0.28) 0%, rgba(10,42,37,0.08) 35%, rgba(10,42,37,0.60) 100%)",
        }}
      />

      {/* Duck — floating on the left, on the water surface */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          bottom: "28%",
          left: "6%",
          animation: "d3-duck-bob 3.4s ease-in-out infinite",
          zIndex: 6,
        }}
        aria-hidden="true"
      >
        <Image
          src="/images/bjf-duck.png"
          alt=""
          width={120}
          height={120}
          className="drop-shadow-xl"
          priority
        />
      </div>

      {/* Wave layers — bottom transition */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 5 }}
      >
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
          style={{ animation: "d3-wave-pulse 10s ease-in-out infinite" }}
        >
          <path
            d="M0 50 C180 20 360 80 540 50 C720 20 900 80 1080 50 C1260 20 1380 65 1440 50 L1440 100 L0 100 Z"
            fill="rgba(8,38,34,0.40)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
          style={{ animation: "d3-wave-pulse 7s ease-in-out infinite", animationDelay: "-3s" }}
        >
          <path
            d="M0 60 C240 30 480 85 720 55 C960 25 1200 75 1440 55 L1440 90 L0 90 Z"
            fill="rgba(8,38,34,0.55)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 55 C360 20 720 72 1080 45 C1260 32 1380 62 1440 50 L1440 80 L0 80 Z"
            fill="rgba(8,38,34,0.82)"
          />
        </svg>
      </div>

      {/* Text content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-44 pt-20 sm:px-8 sm:pt-28">
        <div
          className="mb-5 inline-block rounded-full border-2 px-5 py-1.5"
          style={{
            borderColor: "rgba(249,178,51,0.70)",
            background: "rgba(10,42,37,0.55)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#f9b233" }}>
            {dateLine}
          </p>
        </div>

        <h1
          className="font-display font-black leading-[0.92]"
          style={{
            fontSize: "clamp(2.8rem, 10vw, 8rem)",
            letterSpacing: "-0.02em",
            color: "#fdf6e3",
            textShadow: "0 3px 24px rgba(0,0,0,0.45)",
          }}
        >
          {title}
        </h1>

        <p
          className="mt-5 max-w-md text-base leading-relaxed sm:text-lg"
          style={{ color: "rgba(230,248,244,0.88)", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
        >
          {subtitle}
        </p>

        <div className="mt-9">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold shadow-2xl transition-all hover:scale-105 active:scale-100"
            style={{
              background: "linear-gradient(135deg, #f9b233 0%, #e8823a 100%)",
              color: "#1a2a28",
              boxShadow: "0 6px 28px rgba(232,130,58,0.45)",
            }}
          >
            🦆 {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
