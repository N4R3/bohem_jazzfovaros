"use client";

import { usePathname } from "next/navigation";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/" || pathname === "/hu" || pathname === "/en";

  return (
    <div className={isHome ? "below-fold-bg" : "below-fold-bg subpage-bg"}>
      {children}
    </div>
  );
}
