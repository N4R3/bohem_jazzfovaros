import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/locale";
import { BASE } from "@/content/base";

export default async function Footer() {
  const c = await getContent();

  return (
    <footer
      className="relative"
      style={{
        background: "var(--color-teal-950)",
        color: "rgba(253,246,227,0.9)",
        borderTop: "2px solid rgba(249,160,63,0.28)",
      }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-[auto_1fr_1fr_1fr] md:gap-8">
          {/* 1. Logó pajzs */}
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/images/bjf-logo.png"
              alt="Bohém Jazzfőváros"
              width={90}
              height={140}
              className="h-28 w-auto"
            />
            <p
              className="max-w-[18ch] text-xs font-semibold uppercase leading-snug tracking-wider"
              style={{ color: "#f6d98b" }}
            >
              {c.meta.festivalDates}
              <br />
              {c.meta.city}
            </p>
          </div>

          {/* 2. KAPCSOLAT — szervező + cím */}
          <div>
            <h4
              className="mb-3 text-xs font-black uppercase tracking-[0.22em]"
              style={{ color: "var(--color-accent-500)" }}
            >
              Kapcsolat
            </h4>
            <address className="not-italic text-xs font-medium leading-relaxed" style={{ color: "rgba(253,246,227,0.85)" }}>
              {BASE.contact.organizer.hu}
              <br />
              {BASE.contact.address.hu}
            </address>
          </div>

          {/* 3. LINKEK */}
          <div>
            <h4
              className="mb-3 text-xs font-black uppercase tracking-[0.22em]"
              style={{ color: "var(--color-accent-500)" }}
            >
              Linkek
            </h4>
            <nav className="flex flex-col gap-1.5">
              {c.nav.map((item) =>
                item.href.startsWith("http") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold uppercase tracking-wider transition-colors"
                    style={{ color: "#f6d98b" }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs font-semibold uppercase tracking-wider transition-colors"
                    style={{ color: "#f6d98b" }}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* 4. KONTAKT — telefon + email */}
          <div>
            <h4
              className="mb-3 text-xs font-black uppercase tracking-[0.22em]"
              style={{ color: "var(--color-accent-500)" }}
            >
              Kontakt
            </h4>
            <ul className="flex flex-col gap-1.5 text-xs font-semibold">
              <li>
                <a
                  href={`tel:${BASE.contact.phone.replace(/[^+\d]/g, "")}`}
                  className="transition-colors"
                  style={{ color: "rgba(253,246,227,0.85)" }}
                >
                  {BASE.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BASE.contact.phone2.replace(/[^+\d]/g, "")}`}
                  className="transition-colors"
                  style={{ color: "rgba(253,246,227,0.85)" }}
                >
                  {BASE.contact.phone2} · {BASE.contact.phone2NameHu}
                </a>
              </li>
              <li className="mt-2">
                <a
                  href={`mailto:${BASE.contact.email}`}
                  className="transition-colors"
                  style={{ color: "#f6d98b" }}
                >
                  {BASE.contact.email}
                </a>
              </li>
            </ul>

            {/* Social ikonok */}
            <div className="mt-5 flex gap-2">
              <SocialIcon href={BASE.socials.facebook} label="Facebook">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H8.078V12h2.36V9.797c0-2.33 1.387-3.616 3.51-3.616 1.017 0 2.08.182 2.08.182v2.286h-1.172c-1.155 0-1.515.717-1.515 1.452V12h2.578l-.412 2.891h-2.166v6.987C18.343 21.128 22 16.991 22 12z" />
              </SocialIcon>
              <SocialIcon href={BASE.socials.instagram} label="Instagram">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </SocialIcon>
              <SocialIcon href={BASE.socials.youtube} label="YouTube">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Alsó vékony sáv: copyright + jogi linkek */}
        <div
          className="mt-10 flex flex-col gap-3 border-t pt-4 text-center text-[10px] font-medium uppercase tracking-wider sm:flex-row sm:items-center sm:justify-between sm:text-left"
          style={{
            borderColor: "rgba(249,160,63,0.22)",
            color: "rgba(253,246,227,0.55)",
          }}
        >
          <span>{c.footer.copyright}</span>
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:justify-end">
            {c.footer.legalLinks.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && <span style={{ color: "rgba(253,246,227,0.25)" }}>·</span>}
                {link.href.startsWith("http") ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                    style={{ color: "rgba(253,246,227,0.55)" }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{ color: "rgba(253,246,227,0.55)" }}
                  >
                    {link.label}
                  </Link>
                )}
              </Fragment>
            ))}
            {c.footer.builtBy && (
              <Fragment key="builtby">
                <span style={{ color: "rgba(253,246,227,0.25)" }}>·</span>
                <a
                  href={c.footer.builtByUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: "rgba(253,246,227,0.40)" }}
                >
                  {c.footer.builtBy}
                </a>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </footer>
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
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:brightness-125"
      style={{
        background: "rgba(249,160,63,0.18)",
        color: "#f6d98b",
      }}
    >
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        {children}
      </svg>
    </a>
  );
}
