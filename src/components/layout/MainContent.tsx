import type { ReactNode } from "react";

export default function MainContent({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="relative">
      {children}
    </main>
  );
}
