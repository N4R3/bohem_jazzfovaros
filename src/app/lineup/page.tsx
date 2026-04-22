import type { Metadata } from "next";
import { getContent } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";
import { BASE } from "@/content/base";
import BeachPageShell from "@/components/layout/BeachPageShell";
import LineupGrid, { type LineupArtist } from "@/components/lineup/LineupGrid";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.lineup.title,
    description: c.lineup.subtitle,
    alternates: { canonical: canonicalUrl("/lineup/") },
    openGraph: {
      title: `${c.lineup.title} · ${c.meta.siteTitle}`,
      description: c.lineup.subtitle,
      url: canonicalUrl("/lineup/"),
    },
  };
}

export default async function LineupPage() {
  const c = await getContent();
  const { lineup } = c;

  const dayLabels: Record<string, string> = {
    thursday: lineup.filterThursday,
    friday: lineup.filterFriday,
    saturday: lineup.filterSaturday,
    sunday: lineup.filterSunday,
  };

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
      lineup: ["Bolba Éva (voc)"],
    },
    "Clotile Yana": {
      details: "Amerikai jazzénekesnő, a fesztivál nemzetközi vendégelőadója.",
      lineup: ["Clotile Yana (voc)"],
    },
    "Cseh Balázs": {
      details:
        "A régi stílusú jazzdobolás specialistája, tapasztalt stúdiózenész és több formáció tagja. Fellépett több európai fesztiválon, Kenyában és Indiában is.",
      lineup: ["Cseh Balázs (dr)"],
    },
    "Dániel Balázs": {
      details:
        "Mr. Firehand, a boogie-woogie magyar nagykövete és az egyik legvirtuózabb hazai zongorista. Európa-szerte koncertezik, az USA-ban is turnézott.",
      lineup: ["Dániel Balázs (p)"],
    },
    "Dennert Árpád": {
      details:
        "Az Árpi Show, a Benkó Dixieland és számos más hazai jazz-zenekar meghatározó hangszerese.",
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
    "Festival All Stars": {
      details:
        "Nemzetközi all-stars projekt magyar és külföldi vendégművészekkel, külön pénteki és szombati felállással.",
    },
    "Gyárfás István": {
      details:
        "A mainstream jazz egyik legismertebb hazai gitárosa, több évtizedes pályafutással és nemzetközi együttműködésekkel.",
      lineup: ["Gyárfás István (g)"],
    },
    "Hungarian Jazz Embassy": {
      details: "Hazai jazz-elit formáció, kifejezetten a fesztiválra összeállított felállással.",
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
      lineup: ["Korb Attila (tb, tp, bass-sax, p, voc)"],
    },
    "Nagy Iván": {
      details:
        "A stride-zongorázás elkötelezett képviselője, számos hazai swing- és jazzformáció közreműködője.",
      lineup: ["Nagy Iván (p)"],
    },
    "Sir Oliver Mally & Peter Schneider Duo": {
      details: "Osztrák-német blues duó, akusztikus gitárra és énekre épülő műsorral.",
      lineup: ["Sir Oliver Mally (g, voc)", "Peter Schneider (g)"],
    },
    "Swingtáncórák kezdőknek": {
      details:
        "Kezdő swingtáncórák több időpontban a fesztivál alatt, magyar és nemzetközi közönségnek.",
    },
    "Szalóky Béla": {
      details:
        "Multiinstrumentalista, a magyar oldtimer-jazz meghatározó alakja, rendszeres nemzetközi fesztiválvendég.",
      lineup: ["Szalóky Béla (tp, tb)"],
    },
    "Tom White & the Mad Circus": {
      details: "A rockabilly magyar királyai, erős színpadi energiával és vintage hangzással.",
      lineup: [
        "Tom White (voc, harp)",
        "Schiffler Patrik (Ricky) (voc, g)",
        "Buzsik Tamás (dr)",
        "Kéri Kolos (sb)",
      ],
    },
  };

  const artists: LineupArtist[] = lineup.artists.map((artist) => {
    const baseArtist = baseArtistByName.get(artist.name);
    const details = performerDetailsHu[artist.name];
    return {
      ...artist,
      image: baseArtist?.image ?? artist.image,
      details: details?.details || artist.bio,
      lineup: details?.lineup,
      website: details?.website,
      youtube: details?.youtube,
    };
  });

  return (
    <BeachPageShell
      eyebrow={`${c.meta.festivalDates} · ${c.meta.city}`}
      title={lineup.title}
      subtitle={lineup.subtitle}
    >
      <LineupGrid
        artists={artists}
        stageLabels={{ main: lineup.stageMain, club: lineup.stageClub }}
        ticketUrl={BASE.ticketUrl}
        ticketLabel="Jegyvásárlás"
      />
    </BeachPageShell>
  );
}
