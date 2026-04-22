/**
 * Sponsors — Támogatók / Szponzorok / Partnerek szekció.
 *
 * A jazzdesign1 dizájnja: Bebas Neue fehér cím narancs vízszintes
 * aláhúzással, alatta fehér/áttetsző logo-chip-ek sora (a md méret
 * nagyobb, az xs kisebb).
 */

type SponsorLevel = {
  title: string;
  entries: string[];
  /** Vizuális súly — md (nagy chip), xs (kisebb chip) */
  size?: "md" | "xs";
};

/** Alapértelmezett listák a jazzdesign1 szerint. */
const DEFAULT_LEVELS: SponsorLevel[] = [
  {
    title: "Támogatóink",
    entries: [
      "Kecskemét MJV Önk.",
      "NKA",
      "Magyar Művészeti Akadémia",
      "Nemzeti Kulturális Alap",
      "EMMI",
      "Libri",
      "BFT",
      "MOL Nyrt.",
    ],
    size: "md",
  },
  {
    title: "Szponzorok",
    entries: ["Yonex", "Dreher", "Borsodi", "Pepsi", "OTP Bank", "Vodafone"],
    size: "md",
  },
  {
    title: "Partnerek",
    entries: [
      "Bartók Rádió",
      "MTVA",
      "Jazz.hu",
      "Fidelio",
      "Stúdió Dépesz",
      "Tuguri Prod.",
      "Zafiros",
      "LS Agency",
      "Bachapics",
      "Hungaroton",
      "MAP",
      "BMC",
      "Zöldebb Színek",
      "Múzeum",
      "Kecskeméti Lovarda",
      "Palotás",
    ],
    size: "xs",
  },
];

type SponsorsProps = {
  levels?: SponsorLevel[];
};

export default function Sponsors({ levels = DEFAULT_LEVELS }: SponsorsProps) {
  return (
    <section
      aria-label="Támogatók, szponzorok, partnerek"
      id="supporters"
      className="relative z-[2] px-5 pb-10 pt-14 text-center sm:px-8"
    >
      <div className="mx-auto max-w-[1160px]">
        {levels.map((level, idx) => (
          <div key={level.title} className={idx > 0 ? "mt-10" : ""}>
            <h3
              className="m-0 mb-2 font-display font-normal uppercase text-white"
              style={{ fontSize: 48, letterSpacing: "0.08em" }}
            >
              {level.title.toUpperCase()}
              <span
                aria-hidden="true"
                className="mx-auto mt-2 mb-5 block h-1 w-[50px] rounded-full bg-orange-500"
              />
            </h3>

            <div className="mx-auto flex max-w-[900px] flex-wrap justify-center gap-x-7 gap-y-3.5">
              {level.entries.map((e) => (
                <LogoChip key={e} label={e} size={level.size || "md"} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Egy logó-chip — Bebas Neue, fehér háttér, finom árnyék
   ============================================================ */
function LogoChip({
  label,
  size,
}: {
  label: string;
  size: "md" | "xs";
}) {
  const isSmall = size === "xs";
  return (
    <span
      className={
        isSmall
          ? "inline-block rounded-[10px] bg-white/92 px-3.5 py-2 font-display text-[14px] uppercase tracking-[0.06em] text-ink-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
          : "inline-block rounded-[10px] bg-white/92 px-5 py-2.5 font-display text-[20px] uppercase tracking-[0.06em] text-ink-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-[3px] hover:scale-[1.03]"
      }
      style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
    >
      {label.toUpperCase()}
    </span>
  );
}
