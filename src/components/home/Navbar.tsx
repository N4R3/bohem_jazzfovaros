"use client";

/**
 * Navbar — jazzdesign1 fehér sticky sáv, 1:1 design clone.
 *
 *  - Fehér háttér, vékony óceán-kék alsó bordűr; scroll közben
 *    lágy árnyékot kap (`scrolled` state).
 *  - Bal: logó, középen kis uppercase `ink` linkek
 *    narancs hover-aláhúzással, jobbra kis `EN` pill + mobilon burger.
 *  - A navigációs tartalom a `getContent()`-ből jön, hogy megmaradjon
 *    a meglévő HU/EN működés — csak a dizájn frissült.
 */

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { NavItem, SiteContent } from "@/lib/types";

type Props = {
  content: SiteContent;
  /** Sanity-ből jövő navigáció (header). Ha üres / nincs, a c.nav-ot használjuk. */
  navOverride?: NavItem[];
};

function getSwitchHref(pathname: string, otherLocaleLabel: string): string {
  if (otherLocaleLabel === "EN") {
    return pathname === "/" ? "/en/" : `/en${pathname}`;
  }
  return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}

export default function Navbar({ content: c, navOverride }: Props) {
  const pathname = usePathname() || "/";
  const NAV_ITEMS: NavItem[] = navOverride && navOverride.length > 0 ? navOverride : c.nav;
  const OTHER = c.otherLocale;
  const switchHref = getSwitchHref(pathname, OTHER.label);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isEnglishPage = pathname.startsWith("/en");

  /* Scroll-alapú árnyék a jazzdesign1 .navbar.scrolled osztályához */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* A megnyitott mobil menü mögötti body scrollozás tiltása */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] border-b-2 border-orange-500 bg-[#083a44] transition-shadow",
        scrolled ? "shadow-[0_4px_24px_rgba(24,103,138,0.15)]" : "shadow-none",
      )}
    >
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center gap-6 px-5 sm:px-8">
        {/* Logó bal oldalt */}
        <Link href="/" aria-label="Főoldal" className="flex shrink-0 items-center">
          <Image
            src="/images/branding/logo_simple.png"
            alt="Bohém Jazzfőváros Kecskemét"
            width={150}
            height={76}
            priority
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        {/* Desktop menü — középen */}
        <nav
          aria-label="Főnavigáció"
          className="hidden flex-1 items-center gap-x-5 gap-y-1 text-[13px] font-bold uppercase tracking-[0.04em] text-[#f8f3e4] xl:flex"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isNavActive(pathname, item.href)}
              external={item.external || /^https?:\/\//i.test(item.href)}
              openInNewTab={item.openInNewTab}
            />
          ))}
        </nav>

        {/* Desktop EN/HU kapcsoló pill */}
        <a
          href={switchHref}
          className={cn(
            "ml-auto hidden items-center rounded-full border-2 px-3.5 py-1.5 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] transition-colors xl:inline-flex",
            isEnglishPage
              ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600"
              : "border-black bg-black text-white hover:bg-neutral-900",
          )}
          aria-label={OTHER.label === "EN" ? "Switch to English" : "Váltás magyarra"}
        >
          {OTHER.label}
        </a>

        {/* Mobil hamburger */}
        <button
          type="button"
          aria-label="Menü"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "ml-auto flex h-10 w-10 items-center justify-center rounded-md text-[#f8f3e4] transition-colors hover:bg-white/10 xl:hidden",
            open && "bg-white/10",
          )}
        >
          <svg
            viewBox="0 0 26 18"
            width="26"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            {open ? (
              <>
                <rect x="0" y="7" width="26" height="3" rx="1.5" transform="rotate(45 13 9)" />
                <rect x="0" y="7" width="26" height="3" rx="1.5" transform="rotate(-45 13 9)" />
              </>
            ) : (
              <>
                <rect x="0" y="0"  width="26" height="3" rx="1.5" />
                <rect x="0" y="7"  width="26" height="3" rx="1.5" />
                <rect x="0" y="14" width="26" height="3" rx="1.5" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobil menü panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/15 bg-[#083a44] xl:hidden"
            aria-label="Mobil navigáció"
          >
            <ul className="divide-y divide-white/10">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.025, duration: 0.28 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.04em] transition-colors hover:bg-orange-500/5 hover:text-orange-500",
                      isNavActive(pathname, item.href) ? "bg-orange-500/10 text-orange-300" : "text-[#f8f3e4]",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + NAV_ITEMS.length * 0.025, duration: 0.28 }}
              >
                <a
                  href={switchHref}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-6 py-3.5 text-center text-[13px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors",
                    isEnglishPage ? "bg-orange-500 hover:bg-orange-600" : "bg-ink-800 hover:bg-ink-900",
                  )}
                >
                  {OTHER.label}
                </a>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ============================================================
   Egy nav-link a jazzdesign1 ::after animált aláhúzásával
   ============================================================ */
function NavLink({
  href,
  label,
  isActive,
  external,
  openInNewTab,
}: {
  href: string;
  label: string;
  isActive: boolean;
  external?: boolean;
  openInNewTab?: boolean;
}) {
  const className = cn(
    "group relative py-1.5 transition-colors hover:text-orange-300",
    isActive && "text-orange-300",
  );
  const underline = (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-sm bg-orange-500 transition-transform duration-[250ms]",
        isActive ? "scale-x-100 opacity-100" : "origin-left scale-x-0 opacity-85 group-hover:scale-x-100",
      )}
    />
  );
  if (external) {
    return (
      <a
        href={href}
        className={className}
        target={openInNewTab !== false ? "_blank" : undefined}
        rel={openInNewTab !== false ? "noopener noreferrer" : undefined}
      >
        <span>{label}</span>
        {underline}
      </a>
    );
  }
  return (
    <Link href={href} className={className} target={openInNewTab ? "_blank" : undefined}>
      <span>{label}</span>
      {underline}
    </Link>
  );
}

function normalizePath(path: string): string {
  const cleaned = path.replace(/^\/en(?=\/|$)/, "") || "/";
  if (cleaned.length > 1 && cleaned.endsWith("/")) return cleaned.slice(0, -1);
  return cleaned;
}

function isNavActive(currentPath: string, href: string): boolean {
  if (href.startsWith("http")) return false;
  return normalizePath(currentPath) === normalizePath(href);
}
