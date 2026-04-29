import type { Metadata } from "next";
import { getContent, getLocale } from "@/lib/locale";
import { BASE } from "@/content/base";
import BeachPageShell from "@/components/layout/BeachPageShell";
import LineupGrid, { type LineupArtist } from "@/components/lineup/LineupGrid";
import { getPerformersWithFallback } from "@/sanity/lib/content";
import { buildPageMetadataWithSanity } from "@/sanity/lib/seoContent";

/** CMS tartalom ISR: ~30 mp-en belül frissül (content.ts SANITY_FETCH_NEXT). */
export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContent();
  return buildPageMetadataWithSanity({
    slug: "lineup",
    path: "/lineup/",
    locale,
    fallbackTitle: c.lineup.title,
    fallbackDescription: c.lineup.subtitle,
    fallbackOgImage: "/images/og-image.jpg",
    siteTitle: c.meta.siteTitle,
  });
}

export default async function LineupPage() {
  const c = await getContent();
  const { lineup } = c;
  const isEn = c.otherLocale.label === "HU";
  const lineupArtists = await getPerformersWithFallback();

  const baseArtistByName = new Map(BASE.artists.map((artist) => [artist.name, artist]));

  const performerDetailsHu: Record<
    string,
    {
      details: string;
      lineup?: string[];
      website?: string;
      youtube?: string;
    }
  > = {
    "Bérczesi Jazz Band":
      {
        details:
          "Bérczesi Róbert (Hiperkarma) különleges vendégprojektje. Klasszikus jazzt és bohém lendületet ötvöző formáció.",
        website: "https://jazzfovaros.hu/bg/performer-popup/190",
        youtube: "https://www.youtube.com/watch?v=zjxCe4WunMY",
        lineup: [
          "Bérczesi Róbert (Hiperkarma) (voc, g)",
          "Szalóky Béla (tp)",
          "Papp Mátyás (tb)",
          "Berkó Domonkos (cl, sax)",
          "Juhász Attila (p)",
          "Csikós Miklós (sb)",
          "Kovacsevics Gábor (dr, wb)",
        ],
      },
    "Bohém Ragtime Jazz Band": {
      details:
        "Az eMeRTon-díjas kecskeméti csapat 1985-ben alakult, repertoárjuk a ragtime-tól a New Orleans-i jazzen és dixielanden át a swingig terjed. A Nemzetközi Bohém Ragtime & Jazz Fesztivál és a JAZZFŐVÁROS házigazdái.",
      website: "http://www.bohemragtime.com",
      youtube: "https://youtu.be/WphNjExWanE?si=RFRy3lOJDkOrdc2q",
      lineup: [
        "Bolba Éva (voc)",
        "Lebanov József (tp)",
        "Bera Zsolt (tb)",
        "Berkó Domonkos (cl, sax)",
        "Ittzés Tamás (p, vl, voc, ld)",
        "Hegedüs Csaba (g, bj)",
        "Korb Attila (bs)",
        "Gulyás-Szabó Krisztián (dr)",
      ],
    },
    "Bolba Éva": {
      details:
        "Nemzetközileg is aktív jazzénekes, Európa mellett az USA-ban és Ázsiában is fellépett. A JAZZterlánc megálmodója, a JAZZFŐVÁROS jazztáborának tanára.",
      website: "https://www.facebook.com/jazzterlanc/",
      youtube: "https://www.youtube.com/watch?v=-2mzm8Fiq4w",
      lineup: ["Bolba Éva (voc)"],
    },
    "Clotile Yana": {
      details: "Amerikai jazzénekesnő, a fesztivál nemzetközi vendégelőadója.",
      lineup: ["Clotile Yana (voc)"],
    },
    "Cseh Balázs": {
      details:
        "A régi stílusú jazzdobolás specialistája, tapasztalt stúdiózenész és több formáció tagja. Fellépett több európai fesztiválon, Kenyában és Indiában is.",
      website: "https://www.facebook.com/balazs.cseh.50",
      youtube: "https://www.youtube.com/watch?v=N4lvyrNWswY",
      lineup: ["Cseh Balázs (dr)"],
    },
    "Dániel Balázs": {
      details:
        "Mr. Firehand, a boogie-woogie magyar nagykövete és az egyik legvirtuózabb hazai zongorista. Európa-szerte koncertezik, az USA-ban is turnézott.",
      website: "https://mrfirehand.com/",
      youtube: "https://www.youtube.com/watch?v=ZqMxZbwIjm0",
      lineup: ["Dániel Balázs (p)"],
    },
    "Dennert Árpád": {
      details:
        "Az Árpi Show, a Benkó Dixieland és számos más hazai jazz-zenekar meghatározó hangszerese.",
      website: "https://www.facebook.com/dennertarpi",
      youtube: "https://www.youtube.com/watch?v=j_m-5v4lxrM",
      lineup: ["Dennert Árpád (cl, sax)"],
    },
    'Emanuele Urso "King of Swing"': {
      details: "Az olasz swingélet kiemelt alakja, a fesztivál nemzetközi vendégművésze.",
      lineup: ["Emanuele Urso (dr, cl)"],
      website: "https://emanueleurso.it",
      youtube: "https://www.youtube.com/watch?v=q1Gh8TQ9e3I",
    },
    "Farkas Norbert": {
      details: "Hazai nagybőgős előadó, klasszikus jazz formációk visszatérő közreműködője.",
      lineup: ["Farkas Norbert (sb)"],
    },
    "Farkas Péter \"Bubu\"": {
      details:
        "Tradicionális jazz és swing produkciók keresett nagybőgőse, rendszeres közreműködő hazai fesztiválokon.",
      lineup: ["Farkas Péter \"Bubu\" (sb)"],
    },
    "Festival All Stars": {
      details:
        "Nemzetközi all-stars projekt magyar és külföldi vendégművészekkel, külön pénteki és szombati felállással.",
      website: "https://jazzfovaros.hu/bg/performer-popup/84",
    },
    "Gyárfás István": {
      details:
        "A mainstream jazz egyik legismertebb hazai gitárosa, több évtizedes pályafutással és nemzetközi együttműködésekkel.",
      website: "https://www.facebook.com/istvan.gyarfas.1",
      youtube: "https://www.youtube.com/watch?v=yCY9M9atxRI",
      lineup: ["Gyárfás István (g)"],
    },
    "Hungarian Jazz Embassy": {
      details: "Hazai jazz-elit formáció, kifejezetten a fesztiválra összeállított felállással.",
      website: "https://www.facebook.com/szalokygroup/",
      lineup: [
        "Szalóky Balázs (tp)",
        "Zana Zoltán (ts)",
        "Szalóky Béla (tb)",
        "Tálas Áron (p)",
        "Lutz János (sb)",
        "Richter Ambrus (dr)",
      ],
    },
    "Hunter Burgamy": {
      details: "Amerikai gitáros/bendzsós és énekes, tradicionális jazz és swing vonalon.",
      lineup: ["Hunter Burgamy (g, bj, voc)"],
      website: "https://www.hunterburgamy.com/",
    },
    "Jazz Camp All Stars": {
      details:
        "A JAZZFŐVÁROS jazztábor tanárai és zenésztársaik spontán örömzenélésre összeálló nyitónapi csapata.",
      website: "https://www.jazzfovaros.hu/jazztabor",
      lineup: [
        "Bolba Éva (voc)",
        "Lukács Eszter (voc)",
        "Szalóky Béla (tp, tb)",
        "Korb Attila (tp, tb, p)",
        "Nagy Iván (p)",
        "Gyárfás István (g)",
        "Rieger Attila (g)",
        "Farkas Péter (sb)",
        "Cseh Balázs (dr)",
      ],
    },
    "Ken Aoki": {
      details: "Világszínvonalú bendzsóművész, a fesztivál egyik közönségkedvenc nemzetközi fellépője.",
      lineup: ["Ken Aoki (bj)"],
      website: "https://www.facebook.com/vegavox",
      youtube: "https://www.youtube.com/watch?v=eXFc-JfW2r8",
    },
    "Korb Attila": {
      details:
        "Sokoldalú hangszeres (harsona, trombita, szaxofon, zongora, ének), korábban a Bohém Ragtime Jazz Band tagja, folyamatosan turnézó szabadúszó jazzmuzsikus.",
      website: "https://www.facebook.com/attila.korb.7",
      youtube: "https://www.youtube.com/watch?v=QcoDBs6_SBM",
      lineup: ["Korb Attila (tb, tp, bass-sax, p, voc)"],
    },
    "Lukács Eszter": {
      details:
        "A fesztivál visszatérő jazzénekes fellépője, a klasszikus és mainstream jazz vokális világának képviselője.",
      lineup: ["Lukács Eszter (voc)"],
    },
    "Nagy Iván": {
      details:
        "A stride-zongorázás elkötelezett képviselője, számos hazai swing- és jazzformáció közreműködője.",
      website: "https://www.facebook.com/ivan.nagy.7161",
      youtube: "https://www.youtube.com/watch?v=7Sv_XN6bK3o",
      lineup: ["Nagy Iván (p)"],
    },
    "Nanna Carling": {
      details:
        "Svédországi tradicionális jazz előadó, több hangszerrel és énekkel is rendszeresen szerepel nemzetközi fesztiválokon.",
      lineup: ["Nanna Carling"],
      website: "https://www.nannacarling.com",
      youtube: "https://www.youtube.com/@nannacarling",
    },
    "Pribojszki Mátyás": {
      details:
        "Díjazott blues-harmonika előadó és zenekarvezető, a hazai blues és jazz szcéna meghatározó alakja.",
      lineup: ["Pribojszki Mátyás (harmonika, voc)"],
    },
    "Sir Oliver Mally & Peter Schneider Duo": {
      details: "Osztrák-német blues duó, akusztikus gitárra és énekre épülő műsorral.",
      website: "https://sir-oliver.com",
      youtube: "https://www.youtube.com/watch?v=nP5MVYLVKEI",
      lineup: ["Sir Oliver Mally (g, voc)", "Peter Schneider (g)"],
    },
    "Swingtáncórák kezdőknek": {
      details:
        "Kezdő swingtáncórák több időpontban a fesztivál alatt, magyar és nemzetközi közönségnek.",
      website: "https://www.swinglight.hu",
      youtube: "https://www.youtube.com/watch?v=CZ0e0rtanGM",
    },
    "Szalóky Béla": {
      details:
        "Multiinstrumentalista, a magyar oldtimer-jazz meghatározó alakja, rendszeres nemzetközi fesztiválvendég.",
      website: "http://szaloky.com/",
      youtube: "https://www.youtube.com/watch?v=R91MRLsUi_s",
      lineup: ["Szalóky Béla (tp, tb)"],
    },
    "Tom White & the Mad Circus": {
      details: "A rockabilly magyar királyai, erős színpadi energiával és vintage hangzással.",
      website: "http://www.tomwhite.hu/",
      youtube: "https://www.youtube.com/watch?v=jVIMTO5gd48",
      lineup: [
        "Tom White (voc, harp)",
        "Schiffler Patrik (Ricky) (voc, g)",
        "Buzsik Tamás (dr)",
        "Kéri Kolos (sb)",
      ],
    },
  };

  const artists: LineupArtist[] = lineupArtists.map((artist) => {
    const baseArtist = baseArtistByName.get(artist.name);
    const details = performerDetailsHu[artist.name];
    return {
      ...artist,
      image: baseArtist?.image ?? artist.image,
      details:
        artist.bio ||
        details?.details ||
        `${artist.name} a JAZZFŐVÁROS 2026 fellépői között szerepel (${artist.origin}).`,
      lineup: details?.lineup,
      website: artist.websiteUrl || details?.website,
      youtube: artist.youtubeUrl || details?.youtube,
    };
  });

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates} · ${c.meta.city}`}
      title={lineup.title}
      subtitle={lineup.subtitle}
      compact
      canonicalPath="/lineup/"
      locale={isEn ? "en" : "hu"}
    >
      <LineupGrid
        artists={artists}
        ticketUrl={BASE.ticketUrl}
        ticketLabel="Jegyvásárlás"
      />
    </BeachPageShell>
  );
}
