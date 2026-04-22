interface CtaBannerProps {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonUrl: string;
}

/**
 * "Vedd meg a jegyed most!" — teljes szélességű narancs szalag
 * nagy fehér címmel, alcímmel és sötét-narancs pill gombbal.
 */
export default function CtaBanner({ title, subtitle, buttonLabel, buttonUrl }: CtaBannerProps) {
  return (
    <section
      aria-label="Ticket call to action"
      className="relative py-14 md:py-16"
      style={{ background: "var(--color-accent-500)" }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 text-center sm:px-6 lg:px-10">
        <h2
          className="font-display font-black uppercase leading-tight"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            color: "#fdf6e3",
            letterSpacing: "0.02em",
            textShadow: "0 2px 10px rgba(0,0,0,0.25)",
          }}
        >
          {title}
        </h2>

        <p
          className="mx-auto mt-3 max-w-xl text-sm font-semibold uppercase tracking-wider sm:text-base"
          style={{ color: "rgba(253,246,227,0.92)" }}
        >
          {subtitle}
        </p>

        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-extrabold uppercase tracking-wider transition-transform hover:scale-[1.03]"
          style={{
            background: "var(--color-accent-700)",
            color: "#fdf6e3",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          }}
        >
          {buttonLabel.replace(/\s*→\s*$/, "")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
