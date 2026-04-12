import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: c.contact.title,
    description: c.contact.subtitle,
    alternates: { canonical: canonicalUrl("/contact/") },
    openGraph: {
      title: `${c.contact.title} · ${c.meta.siteTitle}`,
      description: c.contact.subtitle,
      url: canonicalUrl("/contact/"),
    },
  };
}

export default function ContactPage() {
  const c = getContent();
  const { contact } = c;

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] py-20">
      <Container>
        <SectionHeading title={contact.title} subtitle={contact.subtitle} />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-[var(--color-cream-200)] bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-display text-lg font-bold text-[var(--color-navy-900)]">
                {contact.organizer}
              </h3>
              <div className="flex flex-col gap-3 text-sm text-[var(--color-navy-900)]/70">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 shrink-0 text-[var(--color-gold-500)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>{contact.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="shrink-0 text-[var(--color-gold-500)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                  <a href={`mailto:${contact.email}`} className="hover:text-[var(--color-gold-600)] transition-colors">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="shrink-0 text-[var(--color-gold-500)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.08 1.22 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <div className="flex flex-col gap-0.5">
                    <a href={`tel:${contact.phone}`} className="hover:text-[var(--color-gold-600)] transition-colors">
                      {contact.phone}
                    </a>
                    {contact.phone2 && (
                      <a href={`tel:${contact.phone2}`} className="hover:text-[var(--color-gold-600)] transition-colors">
                        {contact.phone2}{contact.phone2Name ? ` (${contact.phone2Name})` : ""}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {contact.volunteerText && contact.volunteerUrl && (
                <div className="mt-4 rounded-lg bg-[var(--color-gold-50)] border border-[var(--color-gold-200)] p-4">
                  <a
                    href={contact.volunteerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[var(--color-gold-700)] hover:text-[var(--color-gold-800)] transition-colors"
                  >
                    {contact.volunteerText} →
                  </a>
                </div>
              )}

              <div className="mt-5 flex gap-4">
                <a
                  href={contact.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="rounded-lg border border-[var(--color-cream-200)] p-2.5 text-[var(--color-navy-900)]/50 hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-500)] transition-colors"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H8.078V12h2.36V9.797c0-2.33 1.387-3.616 3.51-3.616 1.017 0 2.08.182 2.08.182v2.286h-1.172c-1.155 0-1.515.717-1.515 1.452V12h2.578l-.412 2.891h-2.166v6.987C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href={contact.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-lg border border-[var(--color-cream-200)] p-2.5 text-[var(--color-navy-900)]/50 hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-500)] transition-colors"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-gold-200)] bg-[var(--color-gold-50)] p-6">
              <h3 className="mb-2 font-display text-lg font-bold text-[var(--color-navy-900)]">
                {contact.pressTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-navy-900)]/65">
                {contact.pressText}
              </p>
              <a
                href={`mailto:${contact.pressEmail}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-gold-700)] hover:text-[var(--color-gold-800)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
                {contact.pressEmail}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {[
              { tier: c.sponsors.main, label: "Főtámogatók" },
              { tier: c.sponsors.sponsors, label: "Szponzorok" },
              { tier: c.sponsors.partners, label: "Partnerek" },
            ].filter(({ tier }) => tier.length > 0).map(({ tier, label }) => (
              <div key={label} className="rounded-xl border border-[var(--color-cream-200)] bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-[var(--color-gold-600)]">
                  {label}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {tier.map((sponsor) => (
                    <a
                      key={sponsor.name}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 rounded-lg border border-[var(--color-cream-200)] p-4 text-center transition-colors hover:border-[var(--color-gold-300)] hover:bg-[var(--color-gold-50)]"
                    >
                      <div className="flex h-10 w-full items-center justify-center rounded bg-[var(--color-cream-100)] transition-colors group-hover:bg-[var(--color-gold-100)]">
                        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-navy-900)]/30">logo</span>
                      </div>
                      <span className="text-xs font-semibold leading-tight text-[var(--color-navy-900)]/70">
                        {sponsor.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
