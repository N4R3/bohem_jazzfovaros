interface InfoStripProps {
  date: string;
  venue: string;
  city: string;
  ticketLabel: string;
  ticketUrl: string;
}

export default function InfoStrip({ date, venue, city, ticketLabel, ticketUrl }: InfoStripProps) {
  return (
    <div className="bg-[var(--color-gold-600)]">
      <div className="mx-auto flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[var(--color-navy-950)]">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {date}
          </span>
          <span className="hidden h-3.5 w-px bg-[var(--color-navy-950)]/30 sm:block" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
          className="w-full rounded-full bg-[var(--color-navy-950)] px-5 py-2 text-xs font-bold tracking-wide text-[var(--color-gold-400)] text-center hover:bg-[var(--color-navy-800)] transition-colors sm:w-auto sm:py-1.5"
        >
          {ticketLabel} →
        </a>
      </div>
    </div>
  );
}
