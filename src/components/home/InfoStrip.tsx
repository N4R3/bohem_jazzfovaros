interface InfoStripProps {
  date: string;
  venue: string;
  city: string;
  ticketLabel: string;
  ticketUrl: string;
}

/**
 * Narancs információs szalag a hero alatt — dátum + helyszín + jegyvásárlás gomb.
 */
export default function InfoStrip({ date, venue, city, ticketLabel, ticketUrl }: InfoStripProps) {
  return (
    <div style={{ background: "var(--color-accent-500)" }}>
      <div className="mx-auto flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 lg:px-8 max-w-[1400px]">
        <div
          className="flex flex-wrap items-center gap-3 text-[13px] font-semibold sm:gap-4"
          style={{ color: "#fdf6e3" }}
        >
          <span className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {date}
          </span>
          <span
            className="hidden h-4 w-px sm:block"
            style={{ background: "rgba(253,246,227,0.4)" }}
            aria-hidden="true"
          />
          <span className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>
              {venue}
              {city ? `, ${city}` : ""}
            </span>
          </span>
        </div>

        <a
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors sm:w-auto"
          style={{
            background: "var(--color-accent-700)",
            color: "#fdf6e3",
          }}
        >
          {ticketLabel}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
