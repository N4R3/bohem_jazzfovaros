"use client";

import { usePathname } from "next/navigation";

export default function AppShell({
  children,
  publicShell,
}: {
  children: React.ReactNode;
  publicShell: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    return (
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        {children}
      </div>
    );
  }

  return <>{publicShell}</>;
}
