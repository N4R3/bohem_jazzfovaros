"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

type Bubble = {
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const PAGE_BUBBLE_CONFIGS: Bubble[][] = [
  [
    { left: "8%", size: 12, duration: 22, delay: 0, opacity: 0.32 },
    { left: "18%", size: 24, duration: 28, delay: 3, opacity: 0.28 },
    { left: "62%", size: 16, duration: 24, delay: 6, opacity: 0.38 },
    { left: "82%", size: 28, duration: 31, delay: 8, opacity: 0.24 },
  ],
  [
    { left: "14%", size: 18, duration: 26, delay: 1, opacity: 0.31 },
    { left: "30%", size: 11, duration: 20, delay: 4, opacity: 0.4 },
    { left: "72%", size: 26, duration: 30, delay: 2, opacity: 0.25 },
    { left: "90%", size: 15, duration: 23, delay: 7, opacity: 0.36 },
  ],
  [
    { left: "10%", size: 20, duration: 29, delay: 0, opacity: 0.28 },
    { left: "24%", size: 14, duration: 22, delay: 5, opacity: 0.37 },
    { left: "58%", size: 10, duration: 18, delay: 2, opacity: 0.42 },
    { left: "76%", size: 22, duration: 27, delay: 6, opacity: 0.3 },
  ],
  [
    { left: "6%", size: 14, duration: 21, delay: 2, opacity: 0.36 },
    { left: "34%", size: 26, duration: 32, delay: 0, opacity: 0.24 },
    { left: "68%", size: 18, duration: 25, delay: 4, opacity: 0.33 },
    { left: "88%", size: 12, duration: 19, delay: 7, opacity: 0.4 },
  ],
];

function hashPath(pathname: string): number {
  let hash = 0;
  for (let i = 0; i < pathname.length; i += 1) {
    hash = (hash << 5) - hash + pathname.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function SubpageBubbles() {
  const pathname = usePathname() || "/";
  const bubbles = useMemo(() => {
    const idx = hashPath(pathname) % PAGE_BUBBLE_CONFIGS.length;
    return PAGE_BUBBLE_CONFIGS[idx];
  }, [pathname]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bubbles.map((bubble, index) => (
        <span
          key={`${pathname}-${index}`}
          className="subpage-bubble absolute rounded-full border border-white/45 bg-white/20 shadow-[0_0_14px_rgba(255,255,255,0.2)]"
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            ["--bubble-opacity" as string]: bubble.opacity,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
