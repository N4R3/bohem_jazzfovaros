"use client";

import { useInView } from "@/hooks/useInView";
import VideoLiteEmbed from "@/components/common/VideoLiteEmbed";

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
        <VideoLiteEmbed title={title} videoUrl={videoUrl} size="full" />
      </div>
    </section>
  );
}
