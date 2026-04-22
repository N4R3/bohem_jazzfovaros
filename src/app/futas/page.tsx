import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import BeachPageShell from "@/components/layout/BeachPageShell";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.running.title,
    description: c.running.subtitle,
    alternates: { canonical: canonicalUrl("/futas/") },
    openGraph: {
      title: `${c.running.title} · ${c.meta.siteTitle}`,
      description: c.running.subtitle,
      url: canonicalUrl("/futas/"),
    },
  };
}

export default async function RunningPage() {
  const c = await getContent();
  const { running } = c;

  return (
    <BeachPageShell
      eyebrow={`${running.date} · ${running.time}`}
      title={running.title}
      subtitle={running.subtitle}
    >
      <div className="mx-auto max-w-4xl">
        {/* Illusztrált futó hero */}
        <div
          className="mb-8 overflow-hidden rounded-3xl shadow-xl"
          style={{
            background:
              "linear-gradient(180deg, #5fb6e0 0%, #87c9e6 50%, #3e89a3 100%)",
            minHeight: 200,
          }}
        >
          <RunnerIllustration />
        </div>

        {/* INGYENES szalag */}
        {running.freeTicketNote && (
          <div
            className="mb-8 rounded-2xl px-6 py-5 text-center shadow-xl"
            style={{
              background: "var(--color-accent-500)",
              color: "#fdf6e3",
              boxShadow: "0 10px 26px rgba(212,98,26,0.4)",
            }}
          >
            <p className="text-sm font-black uppercase tracking-wider sm:text-base">
              {running.freeTicketNote}
            </p>
          </div>
        )}

        {/* Kulcs info kártyák */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Dátum", value: running.date },
            { label: "Időpont", value: running.time, big: true },
            { label: "Helyszín", value: running.location },
          ].map((card, i) => (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-2xl p-5 text-center shadow-lg"
              style={{
                background: "var(--color-cream-50)",
                animation: "card-fade-in 0.55s ease-out backwards",
                animationDelay: `${i * 70}ms`,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: "var(--color-accent-500)" }}
              />
              <p
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: "var(--color-accent-600)" }}
              >
                {card.label}
              </p>
              <p
                className={`mt-2 font-display font-black leading-tight ${card.big ? "text-3xl" : "text-base"}`}
                style={{ color: "var(--color-teal-900)" }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Leírás */}
        <div
          className="mb-8 rounded-2xl p-6 shadow-xl sm:p-7"
          style={{ background: "var(--color-cream-50)" }}
        >
          <p
            className="text-sm leading-relaxed sm:text-base"
            style={{ color: "rgba(10,58,54,0.78)" }}
          >
            {running.description}
          </p>
        </div>

        {/* Távok */}
        <div
          className="mb-8 overflow-hidden rounded-2xl shadow-xl"
          style={{ background: "var(--color-cream-50)" }}
        >
          <div
            className="px-5 py-3 text-center"
            style={{ background: "var(--color-accent-500)", color: "#fdf6e3" }}
          >
            <h3 className="font-display text-lg font-black uppercase tracking-wider">
              Távok & Díjak
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: "rgba(10,58,54,0.12)",
                  background: "rgba(239,122,31,0.08)",
                }}
              >
                <th
                  className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  Kategória
                </th>
                <th
                  className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  Táv
                </th>
                <th
                  className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-wider"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  Díj
                </th>
              </tr>
            </thead>
            <tbody>
              {running.distances.map((d, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0"
                  style={{ borderColor: "rgba(10,58,54,0.08)" }}
                >
                  <td
                    className="px-5 py-3 font-bold"
                    style={{ color: "var(--color-teal-900)" }}
                  >
                    {d.label}
                  </td>
                  <td
                    className="px-5 py-3"
                    style={{ color: "rgba(10,58,54,0.7)" }}
                  >
                    {d.distance}
                  </td>
                  <td
                    className="px-5 py-3 text-right font-mono font-black"
                    style={{ color: "var(--color-accent-600)" }}
                  >
                    {d.fee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nevezés info */}
        <div
          className="mb-8 rounded-2xl p-5 shadow-lg"
          style={{ background: "rgba(253,246,227,0.92)" }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-teal-900)" }}
          >
            <strong className="font-black uppercase tracking-wider">
              Nevezési határidő:
            </strong>{" "}
            {running.entryDeadline}
          </p>
        </div>

        <p
          className="mb-8 text-sm leading-relaxed"
          style={{ color: "rgba(253,246,227,0.88)" }}
        >
          {running.resultsNote}
        </p>

        <div className="mb-10 text-center">
          <a
            href={running.entryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-wider shadow-xl transition-transform hover:scale-[1.04]"
            style={{
              background: "var(--color-accent-500)",
              color: "#fdf6e3",
              boxShadow: "0 14px 32px rgba(212,98,26,0.45)",
            }}
          >
            {running.entryLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div
          className="rounded-2xl p-5 text-sm shadow-lg sm:p-6"
          style={{ background: "var(--color-cream-50)" }}
        >
          <p
            className="text-xs font-black uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent-600)" }}
          >
            Kapcsolat
          </p>
          <p className="mt-2" style={{ color: "var(--color-teal-900)" }}>
            <a
              href={`mailto:${running.contactEmail}`}
              className="font-bold hover:underline"
            >
              {running.contactEmail}
            </a>
            <span className="mx-2" style={{ color: "rgba(10,58,54,0.35)" }}>
              ·
            </span>
            <a
              href={`tel:${running.contactPhone}`}
              className="font-bold hover:underline"
            >
              {running.contactPhone}
            </a>
          </p>
        </div>
      </div>
    </BeachPageShell>
  );
}

function RunnerIllustration() {
  return (
    <svg
      viewBox="0 0 600 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* Nap */}
      <circle cx="510" cy="45" r="22" fill="#f2c94c" />
      <circle cx="510" cy="45" r="34" fill="#f2c94c" opacity="0.3" />

      {/* Felhők */}
      <g opacity="0.9">
        <ellipse cx="100" cy="35" rx="28" ry="12" fill="#ffffff" />
        <ellipse cx="128" cy="30" rx="24" ry="14" fill="#ffffff" />
      </g>
      <g opacity="0.85">
        <ellipse cx="320" cy="55" rx="26" ry="11" fill="#ffffff" />
        <ellipse cx="345" cy="48" rx="22" ry="13" fill="#ffffff" />
      </g>

      {/* Szárazföld / vonal */}
      <path d="M0 155 L600 155" stroke="#fdf6e3" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />

      {/* Futó alakja */}
      <g transform="translate(260 110)">
        {/* Fej */}
        <circle cx="0" cy="0" r="10" fill="#fdd9a8" />
        <path d="M-8 -5 Q0 -14 8 -5" fill="#4a3020" />
        {/* Test */}
        <path d="M0 10 L-4 30" stroke="#ef7a1f" strokeWidth="7" strokeLinecap="round" />
        {/* Karok */}
        <path d="M-4 18 L-18 8" stroke="#fdd9a8" strokeWidth="5" strokeLinecap="round" />
        <path d="M-4 18 L10 22" stroke="#fdd9a8" strokeWidth="5" strokeLinecap="round" />
        {/* Lábak (futó póz) */}
        <path d="M-4 30 L-12 48" stroke="#0e4844" strokeWidth="6" strokeLinecap="round" />
        <path d="M-4 30 L10 42 L14 50" stroke="#0e4844" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Sportcipő */}
        <ellipse cx="-12" cy="48" rx="7" ry="3" fill="#fdf6e3" />
        <ellipse cx="14" cy="50" rx="7" ry="3" fill="#fdf6e3" />
      </g>

      {/* Hangjegyek lebegve */}
      <g transform="translate(380 90)" opacity="0.85">
        <circle cx="0" cy="10" r="4" fill="#fdf6e3" />
        <line x1="4" y1="10" x2="4" y2="-4" stroke="#fdf6e3" strokeWidth="2" />
      </g>
      <g transform="translate(420 60)" opacity="0.8">
        <circle cx="0" cy="10" r="4" fill="#fdf6e3" />
        <line x1="4" y1="10" x2="4" y2="-6" stroke="#fdf6e3" strokeWidth="2" />
        <path d="M4 -6 Q10 -4 10 2" stroke="#fdf6e3" strokeWidth="2" fill="none" />
      </g>

      {/* Víz hullámok alul */}
      <path d="M0 175 Q50 170 100 175 T200 175 T300 175 T400 175 T500 175 T600 175 L600 200 L0 200 Z" fill="#3e89a3" />
      <path d="M0 185 Q50 181 100 185 T200 185 T300 185 T400 185 T500 185 T600 185 L600 200 L0 200 Z" fill="#1d5a74" />
    </svg>
  );
}
