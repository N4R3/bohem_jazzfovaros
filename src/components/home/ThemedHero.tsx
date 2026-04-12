"use client";

import { useTheme } from "@/components/theme/ThemeContext";
import Hero from "@/components/home/Hero";
import HeroD2 from "@/components/home/HeroD2";
import HeroD3 from "@/components/home/HeroD3";

interface Props {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  dateLine: string;
}

export default function ThemedHero(props: Props) {
  const { theme } = useTheme();
  if (theme === "2") return <HeroD2 {...props} />;
  if (theme === "3") return <HeroD3 {...props} />;
  return <Hero {...props} />;
}
