"use client";

import { usePathname } from "next/navigation";

/** Oldalváltáskor enyhe belépő animáció — a template újrarenderel, a footer is frissül. */
export default function PageEnter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
