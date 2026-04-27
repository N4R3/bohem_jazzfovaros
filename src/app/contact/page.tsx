import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import BeachPageShell from "@/components/layout/BeachPageShell";
import { getContactContent } from "@/sanity/lib/content";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "contact",
    path: "/contact/",
    locale,
    fallbackTitle: c.contact.title,
    fallbackDescription: c.contact.subtitle,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function ContactPage() {
  const c = await getContent();
  const locale = await getLocale();
  const contact = await getContactContent(locale);
  const isEn = c.otherLocale.label === "HU";

  return (
    <BeachPageShell
      eyebrow="JAZZFŐVÁROS KFT."
      title={contact.title}
      subtitle={contact.subtitle}
      canonicalPath="/contact/"
      locale={isEn ? "en" : "hu"}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Bal: Szervező + kapcsolat */}
        <section
          className="relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-xl sm:p-8"
          style={{ background: "var(--color-cream-50)" }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ background: "var(--color-accent-500)" }}
          />

          {/* 1. Fejléc - szervező neve */}
          <h2
            className="mb-5 font-display text-2xl font-black uppercase leading-tight sm:text-3xl"
            style={{ color: "var(--color-teal-900)" }}
          >
            {contact.organizer}
          </h2>

          {/* 2. Kapcsolati adatok */}
          <div className="flex flex-col gap-4">
            <Row
              icon={
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              }
              label="Cím"
            >
              {contact.address}
            </Row>
            <Row
              icon={
                <>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </>
              }
              label="E-mail"
            >
              <a
                href={`mailto:${contact.email}`}
                className="font-bold transition-colors hover:text-[var(--color-accent-600)]"
                style={{ color: "var(--color-accent-600)" }}
              >
                {contact.email}
              </a>
            </Row>
            <Row
              icon={
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.08 1.22 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              }
              label="Telefon"
            >
              <span className="flex flex-col gap-0.5">
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="font-bold transition-colors"
                  style={{ color: "var(--color-teal-900)" }}
                >
                  {contact.phone}
                </a>
                {contact.phone2 && (
                  <a
                    href={`tel:${contact.phone2.replace(/[^+\d]/g, "")}`}
                    className="font-bold transition-colors"
                    style={{ color: "var(--color-teal-900)" }}
                  >
                    {contact.phone2}
                    {contact.phone2Name ? ` · ${contact.phone2Name}` : ""}
                  </a>
                )}
              </span>
            </Row>
          </div>

          {/* 3. Önkéntes CTA - középső rész */}
          {contact.volunteerText && contact.volunteerUrl && (
            <a
              href={contact.volunteerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold transition-all hover:translate-y-[-2px]"
              style={{
                background: "var(--color-accent-500)",
                color: "#fdf6e3",
                boxShadow: "0 8px 20px rgba(212,98,26,0.35)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a5 5 0 100 10 5 5 0 000-10zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              <span>{contact.volunteerText}</span>
              <span className="ml-auto">→</span>
            </a>
          )}

          {/* 4. Social gombok - legalul */}
          <div className="mt-auto pt-6 flex gap-3">
            <SocialIcon href={contact.socials.facebook} label="Facebook">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H8.078V12h2.36V9.797c0-2.33 1.387-3.616 3.51-3.616 1.017 0 2.08.182 2.08.182v2.286h-1.172c-1.155 0-1.515.717-1.515 1.452V12h2.578l-.412 2.891h-2.166v6.987C18.343 21.128 22 16.991 22 12z" />
            </SocialIcon>
            <SocialIcon href={contact.socials.instagram} label="Instagram">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </SocialIcon>
          </div>
        </section>

        {/* Jobb: Sajtó + támogatók */}
        <section className="flex flex-col gap-6">
          <div
            className="relative overflow-hidden rounded-2xl p-6 shadow-xl sm:p-8"
            style={{
              background: "var(--color-accent-500)",
              color: "#fdf6e3",
            }}
          >
            <h3 className="font-display text-xl font-black uppercase sm:text-2xl">
              {contact.pressTitle}
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "rgba(253,246,227,0.92)" }}
            >
              {contact.pressText}
            </p>
            <a
              href={`mailto:${contact.pressEmail}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-transform hover:scale-[1.04]"
              style={{
                background: "var(--color-accent-700)",
                color: "#fdf6e3",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              {contact.pressEmail}
            </a>
          </div>

          {[
            { tier: c.sponsors.main, label: "Főtámogatók" },
            { tier: c.sponsors.sponsors, label: "Szponzorok" },
            { tier: c.sponsors.partners, label: "Partnerek" },
          ]
            .filter(({ tier }) => tier.length > 0)
            .map(({ tier, label }) => (
              <div
                key={label}
                className="rounded-2xl p-6 shadow-lg"
                style={{ background: "var(--color-cream-50)" }}
              >
                <h3
                  className="mb-3 font-display text-sm font-black uppercase tracking-[0.22em]"
                  style={{ color: "var(--color-accent-600)" }}
                >
                  {label}
                </h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {tier.map((sponsor) => (
                    <li key={sponsor.name}>
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-75"
                        style={{ color: "var(--color-teal-800)" }}
                      >
                        {sponsor.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </section>
      </div>
    </BeachPageShell>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: "rgba(239,122,31,0.14)",
          color: "var(--color-accent-600)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {icon}
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ color: "rgba(10,58,54,0.5)" }}
        >
          {label}
        </p>
        <div className="mt-0.5 text-sm" style={{ color: "var(--color-teal-900)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-[1.1]"
      style={{
        background: "var(--color-accent-500)",
        color: "#fdf6e3",
        boxShadow: "0 4px 12px rgba(212,98,26,0.35)",
      }}
    >
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        {children}
      </svg>
    </a>
  );
}
