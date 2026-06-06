/**
 * VideoSection — beágyazott YouTube lejátszó, a tábor oldal mintájára.
 */
import VideoLiteEmbed from "@/components/common/VideoLiteEmbed";

type VideoSectionProps = {
  videoUrl?: string;
  title?: string;
  caption?: string;
};

export default function VideoSection({
  videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  title    = "Bohém Jazzfőváros — Fesztivál videó",
  caption  = "AFTERMOVIE · BOHÉM 2025",
}: VideoSectionProps) {
  return (
    <section
      id="video"
      aria-label="Fesztivál videó"
      className="relative z-[2] px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-[1160px]">
        <VideoLiteEmbed title={title} videoUrl={videoUrl} size="full" />
        {caption && (
          <p
            className="mt-3 text-center font-display text-sm uppercase tracking-[0.06em] text-white/90 sm:text-base"
            aria-hidden="true"
          >
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}
