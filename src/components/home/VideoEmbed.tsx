"use client";

import { useInView } from "@/hooks/useInView";

interface Props {
  videoUrl: string;
  title: string;
}

export default function VideoEmbed({ videoUrl, title }: Props) {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="bg-[var(--color-navy-950)] py-14 md:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-4xl px-4 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
          <div className="relative aspect-video">
            <iframe
              src={videoUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
