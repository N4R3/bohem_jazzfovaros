"use client";

interface Props {
  date: string;
  venue: string;
  city: string;
  ticketLabel: string;
  ticketUrl: string;
}

/**
 * Permanently fixed info bar at the bottom of the viewport.
 * Only rendered on the home page (page.tsx).
 */
export default function StickyInfoBanner({ date, venue, city, ticketLabel, ticketUrl }: Props) {
  return (
    <div
      aria-label="Festival info"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 29,
        background: "#b85020",
        boxShadow: "0 -3px 20px rgba(0,0,0,0.35)",
        borderTop: "2px solid rgba(249,178,51,0.45)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-[#fdf6e3]">
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {date}
          </span>
          <span className="hidden h-3 w-px bg-[#fdf6e3]/25 sm:block" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {venue}, {city}
          </span>
        </div>

        <a
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-full px-6 py-2 text-center text-xs font-bold tracking-wide sm:w-auto"
          style={{
            background: "linear-gradient(135deg, #f9b233 0%, #e8823a 100%)",
            color: "#1a2a28",
            boxShadow: "0 3px 12px rgba(232,130,58,0.40)",
          }}
        >
          🦆 {ticketLabel} →
        </a>
      </div>
    </div>
  );
}
