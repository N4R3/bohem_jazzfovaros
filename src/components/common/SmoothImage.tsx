"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = ImageProps & {
  wrapperClassName?: string;
};

/** Enyhe fade-in kép betöltéskor — placeholder háttér, nincs kényszerített késleltetés. */
export default function SmoothImage({ className, wrapperClassName, alt, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span
      className={cn(
        "relative inline-block bg-[#f5fbfd]",
        wrapperClassName,
      )}
    >
      <Image
        {...props}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          className,
          "transition-opacity duration-300 ease-out motion-reduce:transition-none motion-reduce:opacity-100",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </span>
  );
}
