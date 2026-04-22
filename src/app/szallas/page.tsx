import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import BeachPageShell from "@/components/layout/BeachPageShell";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.accommodation.title,
    description: c.accommodation.subtitle,
    alternates: { canonical: canonicalUrl("/szallas/") },
    openGraph: {
      title: `${c.accommodation.title} · ${c.meta.siteTitle}`,
      description: c.accommodation.subtitle,
      url: canonicalUrl("/szallas/"),
    },
  };
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: "var(--color-accent-500)" }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default async function AccommodationPage() {
  const c = await getContent();
  const { accommodation } = c;

  return (
    <BeachPageShell
      eyebrow="Domb Beach · Kecskemét"
      title={accommodation.title}
      subtitle={accommodation.subtitle}
    >
      {accommodation.note && (
        <p
          className="mx-auto mb-10 max-w-3xl rounded-2xl px-6 py-4 text-center text-sm leading-relaxed shadow-lg"
          style={{
            background: "rgba(253,246,227,0.92)",
            color: "var(--color-teal-900)",
            borderLeft: "4px solid var(--color-accent-500)",
          }}
        >
          {accommodation.note}
        </p>
      )}

      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {accommodation.hotels.map((hotel, i) => (
          <article
            key={hotel.name}
            className="group relative flex flex-col overflow-hidden rounded-2xl shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: "var(--color-cream-50)",
              animation: "card-fade-in 0.6s ease-out backwards",
              animationDelay: `${i * 80}ms`,
            }}
          >
            {/* Szálloda kép */}
            <div className="relative aspect-[16/9] overflow-hidden">
              {hotel.images && hotel.images.length > 0 ? (
                <Image
                  src={hotel.images[0]}
                  alt={hotel.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #5fb6e0 0%, #87c9e6 55%, #3e89a3 100%)",
                  }}
                >
                  <HotelIllustration stars={hotel.stars ?? 0} />
                </div>
              )}
              {hotel.stars && (
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 shadow-lg">
                  <Stars count={hotel.stars} />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3
                className="font-display text-xl font-black uppercase leading-tight"
                style={{ color: "var(--color-teal-900)" }}
              >
                {hotel.name}
              </h3>
              <p
                className="mt-1 text-xs font-extrabold uppercase tracking-wider"
                style={{ color: "var(--color-accent-600)" }}
              >
                {hotel.distance}
              </p>

              <p
                className="mt-3 flex-1 text-sm leading-relaxed"
                style={{ color: "rgba(10,58,54,0.75)" }}
              >
                {hotel.description}
              </p>

              <div
                className="mt-5 flex items-center justify-between gap-3 border-t pt-4"
                style={{ borderColor: "rgba(10,58,54,0.12)" }}
              >
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "rgba(10,58,54,0.45)" }}
                  >
                    ártól
                  </p>
                  <p
                    className="font-display text-base font-black leading-tight"
                    style={{ color: "var(--color-teal-900)" }}
                  >
                    {hotel.price}
                  </p>
                </div>
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-transform hover:scale-[1.05]"
                  style={{
                    background: "var(--color-accent-500)",
                    color: "#fdf6e3",
                    boxShadow: "0 6px 16px rgba(212,98,26,0.4)",
                  }}
                >
                  {hotel.bookingLabel}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </BeachPageShell>
  );
}

function HotelIllustration({ stars }: { stars: number }) {
  // Egyszerű SVG illusztráció: nap + épület + víz hullámok
  return (
    <svg viewBox="0 0 300 160" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Nap */}
      <circle cx="230" cy="40" r="18" fill="#f2c94c" opacity="0.9" />
      <circle cx="230" cy="40" r="26" fill="#f2c94c" opacity="0.35" />

      {/* Felhő */}
      <g opacity="0.85">
        <ellipse cx="60" cy="35" rx="22" ry="10" fill="#ffffff" />
        <ellipse cx="80" cy="30" rx="20" ry="12" fill="#ffffff" />
        <ellipse cx="100" cy="36" rx="18" ry="9" fill="#ffffff" />
      </g>

      {/* Épület */}
      <g>
        <rect x="115" y="55" width="80" height="65" fill="#fdf6e3" stroke="#0a3a36" strokeWidth="1.2" />
        {/* Tető */}
        <polygon points="112,55 155,40 198,55" fill="#e8425a" stroke="#0a3a36" strokeWidth="1.2" />
        {/* Ablakok */}
        {[0, 1].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={125 + col * 22}
              y={65 + row * 22}
              width="14"
              height="16"
              fill="#5fb6e0"
              stroke="#0a3a36"
              strokeWidth="0.8"
            />
          ))
        )}
        {/* Ajtó */}
        <rect x="147" y="98" width="16" height="22" fill="#ef7a1f" stroke="#0a3a36" strokeWidth="1" />
      </g>

      {/* Pálmafa */}
      {stars >= 3 && (
        <g transform="translate(35 95)">
          <path d="M5 40 Q3 20 8 0" stroke="#8b5a2b" strokeWidth="3" fill="none" />
          <path d="M8 0 Q0 5 -8 12" stroke="#1f7e73" strokeWidth="2.5" fill="none" />
          <path d="M8 0 Q18 3 26 8" stroke="#1f7e73" strokeWidth="2.5" fill="none" />
          <path d="M8 0 Q4 -8 -4 -10" stroke="#1f7e73" strokeWidth="2.5" fill="none" />
          <path d="M8 0 Q14 -8 24 -6" stroke="#1f7e73" strokeWidth="2.5" fill="none" />
        </g>
      )}

      {/* Víz hullámok alul */}
      <path d="M0 140 Q25 135 50 140 T100 140 T150 140 T200 140 T250 140 T300 140 L300 160 L0 160 Z" fill="#3e89a3" />
      <path d="M0 148 Q25 144 50 148 T100 148 T150 148 T200 148 T250 148 T300 148 L300 160 L0 160 Z" fill="#1d5a74" />
    </svg>
  );
}
