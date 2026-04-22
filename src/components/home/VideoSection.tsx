/**
 * VideoSection — beágyazott YouTube lejátszó, a tábor oldal mintájára.
 */

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
  const embedUrl = toYoutubeEmbed(videoUrl);

  return (
    <section
      id="video"
      aria-label="Fesztivál videó"
      className="relative z-[2] px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-[1160px]">
        <div
          aria-label={title}
          className="group relative aspect-video overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
          style={{
            background:
              "linear-gradient(135deg, #8B2E2E, #C74A4A, #E07B4A)",
          }}
        >
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 left-6 font-display text-[24px] uppercase tracking-[0.05em] text-white sm:text-[32px]"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            {caption}
          </span>
        </div>
      </div>
    </section>
  );
}

function toYoutubeEmbed(url: string): string {
  if (url.includes("youtube.com/embed/")) return url;

  const short = url.match(/youtu\.be\/([^?&/]+)/);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

  const long = url.match(/[?&]v=([^?&/]+)/);
  if (long?.[1]) return `https://www.youtube.com/embed/${long[1]}`;

  return url;
}
