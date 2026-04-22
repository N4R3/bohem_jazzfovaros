/**
 * Footer — jazzdesign1 sötét óceán gradient footer (1:1),
 * 4 oszlop: Márka+socials / Navigáció / Info / Kapcsolat.
 * Alul copyright + jogi szalag.
 *
 * A tartalom a `getContent()`-ből jön, hogy HU/EN továbbra is működjön.
 * A dizájn a `assets/logo19_hu.svg` logót használja.
 */

import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/locale";

export default async function Footer() {
  const c = await getContent();
  const isEn = c.otherLocale.label === "HU";
  const rootPrefix = isEn ? "/en" : "";

  /* A jazzdesign1 nav szekciója 5 rövid linket mutat: itt a site 5 fő
     oldalát vesszük a lokalizált nav-listából (az első 5-öt). */
  const footerNav = c.nav.slice(0, 5);

  /* Az Info oszlop statikusan a reference design szerint: GYIK / Házirend /
     Akadálymentesítés / Önkéntesnek / Sajtó. A meglévő aloldal-link
     `/info/` és `/contact/` URL-ekre mutat. */
  const infoLinks = [
    { label: isEn ? "FAQ" : "GYIK", href: `${rootPrefix}/info/` },
    { label: isEn ? "House Rules" : "Házirend", href: `${rootPrefix}/info/` },
    { label: isEn ? "Accessibility" : "Akadálymentesítés", href: `${rootPrefix}/info/` },
    { label: isEn ? "Volunteers" : "Önkéntesnek", href: c.contact?.volunteerUrl || `${rootPrefix}/contact/` },
    { label: isEn ? "Press" : "Sajtó", href: `${rootPrefix}/contact/` },
  ];

  const phone = c.contact?.phone   || "+36 76 000 000";
  const email = c.contact?.email   || "info@bohemjazzfovaros.hu";
  const city  = `${c.meta?.city || "Kecskemét"}, Domb Beach`;

  return (
    <footer
      className="relative z-[2] px-5 pb-6 pt-14 text-white sm:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(12, 60, 85, 0.85), rgba(8, 42, 60, 0.95))",
        marginTop: 40,
      }}
    >
      <div className="mx-auto grid max-w-[1160px] gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        {/* ===== Márka + cím + szocmédia ===== */}
        <div>
          <Image
            src="/images/design1/logo19_hu.svg"
            alt={c.meta.siteTitle}
            width={160}
            height={110}
            className="mb-3.5 h-[110px] w-auto"
          />
          <p className="text-[13px] leading-[1.6] opacity-[0.88]">
            {c.contact.organizer}
            <br />
            {c.contact.address}
            <br />
            <a
              href={`mailto:${email}`}
              className="transition-colors hover:text-sun-400"
            >
              {email}
            </a>
          </p>
          <div className="mt-3.5 flex gap-2.5">
            <SocialIcon
              href={c.contact?.socials?.facebook || "https://facebook.com"}
              label="Facebook"
            >
              <path d="M13 22v-8h3l1-4h-4V7.5c0-1.2.3-2 2-2h2V2h-3c-3 0-5 1.8-5 5v3H6v4h3v8h4z" />
            </SocialIcon>
            <SocialIcon
              href={c.contact?.socials?.instagram || "https://instagram.com"}
              label="Instagram"
            >
              <g fill="none" stroke="#fff" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
              </g>
            </SocialIcon>
            <SocialIcon
              href={c.contact?.socials?.youtube || "https://youtube.com"}
              label="YouTube"
            >
              <path d="M22 12s0-3.3-.4-4.9c-.2-.9-.9-1.6-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.3c-.9.2-1.6.9-1.8 1.8C2 8.7 2 12 2 12s0 3.3.4 4.9c.2.9.9 1.6 1.8 1.8 1.5.3 7.8.3 7.8.3s6.3 0 7.8-.3c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.9.4-4.9zM10 15V9l5 3-5 3z" />
            </SocialIcon>
            <SocialIcon href="#" label="Spotify">
              <g>
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M7 10c3-.8 7-.6 10 1"
                  stroke="#1A2733"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M7.5 13c2.5-.6 5.5-.4 8 1"
                  stroke="#1A2733"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M8 16c2-.4 4-.3 6 .7"
                  stroke="#1A2733"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </SocialIcon>
          </div>
        </div>

        {/* ===== Navigáció ===== */}
        <FooterCol title={isEn ? "Navigation" : "Navigáció"}>
          {footerNav.map((link) => (
            <FooterLink key={link.href} href={link.href} label={link.label} />
          ))}
        </FooterCol>

        {/* ===== Info ===== */}
        <FooterCol title="Info">
          {infoLinks.map((link) => (
            <FooterLink key={link.label} href={link.href} label={link.label} />
          ))}
        </FooterCol>

        {/* ===== Kapcsolat ===== */}
        <FooterCol title={isEn ? "Contact" : "Kapcsolat"}>
          <li>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="transition-colors hover:text-sun-400"
            >
              {phone}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${email}`}
              className="transition-colors hover:text-sun-400"
            >
              {email}
            </a>
          </li>
          <li>{city}</li>
        </FooterCol>
      </div>

      {/* ===== Alsó szalag: copyright + jogi linkek ===== */}
      <div className="mx-auto mt-10 flex max-w-[1160px] flex-wrap justify-between gap-2 border-t border-white/15 pt-5 text-[12px] opacity-70">
        <span>{c.footer.copyright}</span>
        <span>
          {c.footer.legalLinks.slice(0, 2).map((item, index) => (
            <span key={item.href + item.label}>
              {index > 0 ? " · " : ""}
              <Link href={item.href} className="hover:text-sun-400">
                {item.label}
              </Link>
            </span>
          ))}
          {" · "}
          <a href="#" className="hover:text-sun-400">
            {isEn ? "Cookie settings" : "Süti beállítások"}
          </a>
        </span>
      </div>
    </footer>
  );
}

/* ============================================================
   Footer oszlop (Bebas Neue narancs h4 + link lista)
   ============================================================ */
function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4
        className="m-0 mb-3.5 font-display font-normal uppercase text-orange-500"
        style={{ fontSize: 22, letterSpacing: "0.1em" }}
      >
        {title}
      </h4>
      <ul className="m-0 flex flex-col gap-1.5 p-0 text-[13px]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <li>
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-sun-400"
        >
          {label}
        </a>
      ) : (
        <Link href={href} className="transition-colors hover:text-sun-400">
          {label}
        </Link>
      )}
    </li>
  );
}

/* ============================================================
   Szocmédia gomb — halvány fehér kör, hover → narancs
   ============================================================ */
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
      className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white/10 transition-all duration-200 hover:-translate-y-[3px] hover:bg-orange-500"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
