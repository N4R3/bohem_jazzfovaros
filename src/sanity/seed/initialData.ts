import { BASE } from "@/content/base";
import { hu } from "@/content/hu";
import { en } from "@/content/en";

export type SeedDocument = Record<string, unknown> & {
  _id: string;
  _type: string;
};

function sanitizeForId(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const sponsorCategoryIds = {
  main: "sponsorCategory-main",
  sponsors: "sponsorCategory-sponsors",
  partners: "sponsorCategory-partners",
} as const;

const sponsorCategories: SeedDocument[] = [
  {
    _id: sponsorCategoryIds.main,
    _type: "sponsorCategory",
    titleHu: "Főtámogatók",
    titleEn: "Main Supporters",
    order: 1,
  },
  {
    _id: sponsorCategoryIds.sponsors,
    _type: "sponsorCategory",
    titleHu: "Szponzorok",
    titleEn: "Sponsors",
    order: 2,
  },
  {
    _id: sponsorCategoryIds.partners,
    _type: "sponsorCategory",
    titleHu: "Partnerek",
    titleEn: "Partners",
    order: 3,
  },
];

const sponsors: SeedDocument[] = [
  ...BASE.sponsors.main.map((sponsor, index) => ({
    _id: `sponsor-main-${index + 1}`,
    _type: "sponsor",
    name: sponsor.name,
    url: sponsor.url,
    logoPath: sponsor.logo, // TODO: Studio-ban image upload kell, majd ide image asset referencia.
    category: { _type: "reference", _ref: sponsorCategoryIds.main },
    order: index + 1,
    isActive: true,
  })),
  ...BASE.sponsors.sponsors.map((sponsor, index) => ({
    _id: `sponsor-sponsors-${index + 1}`,
    _type: "sponsor",
    name: sponsor.name,
    url: sponsor.url,
    logoPath: sponsor.logo, // TODO: Studio-ban image upload kell, majd ide image asset referencia.
    category: { _type: "reference", _ref: sponsorCategoryIds.sponsors },
    order: index + 1,
    isActive: true,
  })),
  ...BASE.sponsors.partners.map((sponsor, index) => ({
    _id: `sponsor-partners-${index + 1}`,
    _type: "sponsor",
    name: sponsor.name,
    url: sponsor.url,
    logoPath: sponsor.logo, // TODO: Studio-ban image upload kell, majd ide image asset referencia.
    category: { _type: "reference", _ref: sponsorCategoryIds.partners },
    order: index + 1,
    isActive: true,
  })),
];

const huTickets = hu.info.ticketTiers || [];
const enTickets = en.info.ticketTiers || [];

const tickets: SeedDocument[] = [
  ...huTickets.map((ticket, index) => {
    const enTicket = enTickets[index];
    return {
      _id: `ticket-${index + 1}`,
      _type: "ticket",
      nameHu: ticket.label,
      nameEn: enTicket?.label || "",
      descriptionHu: "",
      descriptionEn: "",
      price: ticket.price,
      currency: "HUF",
      ticketUrlHu: BASE.ticketUrl,
      ticketUrlEn: BASE.ticketUrlEn,
      badgeHu: "",
      badgeEn: "",
      isAvailable: true,
      isHidden: false,
      order: index + 1,
    };
  }),
  {
    _id: "ticket-hot-super-early-bird",
    _type: "ticket",
    nameHu: "HOT Super Early Bird bérlet",
    nameEn: "HOT Super Early Bird pass",
    descriptionHu: "Pótlandó ár és részletek, ha újra aktiválják.",
    descriptionEn: "Add exact price/details only if reactivated.",
    price: "",
    currency: "HUF",
    ticketUrlHu: BASE.ticketUrl,
    ticketUrlEn: BASE.ticketUrlEn,
    badgeHu: "HOT",
    badgeEn: "HOT",
    isAvailable: false,
    isHidden: true,
    order: 997,
  },
  {
    _id: "ticket-early-bird",
    _type: "ticket",
    nameHu: "Early Bird bérlet",
    nameEn: "Early Bird pass",
    descriptionHu: "Pótlandó ár és részletek, ha újra aktiválják.",
    descriptionEn: "Add exact price/details only if reactivated.",
    price: "",
    currency: "HUF",
    ticketUrlHu: BASE.ticketUrl,
    ticketUrlEn: BASE.ticketUrlEn,
    badgeHu: "",
    badgeEn: "",
    isAvailable: false,
    isHidden: true,
    order: 998,
  },
];

/* ============================================================
   PerformerTag seed — alap műfajok és kategóriák.
   A Studio-ban az ügyfél tetszőlegesen bővítheti a listát.
   ============================================================ */
const performerTagSeedItems: Array<{ id: string; titleHu: string; titleEn: string; order: number }> = [
  { id: "tag-jazz", titleHu: "Jazz", titleEn: "Jazz", order: 1 },
  { id: "tag-swing", titleHu: "Swing", titleEn: "Swing", order: 2 },
  { id: "tag-blues", titleHu: "Blues", titleEn: "Blues", order: 3 },
  { id: "tag-ragtime", titleHu: "Ragtime", titleEn: "Ragtime", order: 4 },
  { id: "tag-dixieland", titleHu: "Dixieland", titleEn: "Dixieland", order: 5 },
  { id: "tag-boogie", titleHu: "Boogie-woogie", titleEn: "Boogie-woogie", order: 6 },
  { id: "tag-vocal", titleHu: "Énekes jazz", titleEn: "Vocal jazz", order: 7 },
  { id: "tag-piano", titleHu: "Zongora", titleEn: "Piano", order: 8 },
  { id: "tag-guitar", titleHu: "Gitár", titleEn: "Guitar", order: 9 },
  { id: "tag-banjo", titleHu: "Bendzsó", titleEn: "Banjo", order: 10 },
  { id: "tag-brass", titleHu: "Fúvós", titleEn: "Brass", order: 11 },
  { id: "tag-bass", titleHu: "Bőgő", titleEn: "Double bass", order: 12 },
  { id: "tag-drums", titleHu: "Dob", titleEn: "Drums", order: 13 },
  { id: "tag-dance", titleHu: "Tánc", titleEn: "Dance", order: 14 },
  { id: "tag-international", titleHu: "Nemzetközi vendég", titleEn: "International guest", order: 15 },
  { id: "tag-hungarian", titleHu: "Magyar fellépő", titleEn: "Hungarian performer", order: 16 },
];

const performerTags: SeedDocument[] = performerTagSeedItems.map((tag) => ({
  _id: tag.id,
  _type: "performerTag",
  titleHu: tag.titleHu,
  titleEn: tag.titleEn,
  slug: { _type: "slug", current: tag.id.replace(/^tag-/, "") },
  order: tag.order,
  isActive: true,
}));

/* Tag-hozzárendelések fellépőnként (max 3 / fellépő).
   Ha egy név itt nincs, csak az automatikus „magyar / nemzetközi" tag kerül rá
   (származás alapján), plusz egy általános „Jazz". */
const performerTagsByName: Record<string, string[]> = {
  "Bérczesi Jazz Band": ["tag-jazz", "tag-vocal"],
  "Bohém Ragtime Jazz Band": ["tag-ragtime", "tag-dixieland", "tag-jazz"],
  "Bolba Éva": ["tag-vocal", "tag-jazz"],
  "Clotile Yana": ["tag-vocal", "tag-jazz"],
  "Cseh Balázs": ["tag-drums", "tag-jazz"],
  "Dániel Balázs": ["tag-boogie", "tag-piano", "tag-blues"],
  "Dennert Árpád": ["tag-brass", "tag-dixieland", "tag-jazz"],
  'Emanuele Urso "King of Swing"': ["tag-swing", "tag-jazz"],
  "Farkas Norbert": ["tag-bass", "tag-jazz"],
  'Farkas Péter "Bubu"': ["tag-bass", "tag-jazz"],
  "Festival All Stars": ["tag-jazz", "tag-swing"],
  "Gyárfás István": ["tag-guitar", "tag-jazz"],
  "Hungarian Jazz Embassy": ["tag-jazz", "tag-swing"],
  "Hunter Burgamy": ["tag-banjo", "tag-guitar", "tag-jazz"],
  "Jazz Camp All Stars": ["tag-jazz"],
  "Ken Aoki": ["tag-banjo", "tag-jazz"],
  "Korb Attila": ["tag-brass", "tag-jazz", "tag-vocal"],
  "Lukács Eszter": ["tag-vocal", "tag-jazz"],
  "Nagy Iván": ["tag-piano", "tag-jazz"],
  "Nanna Carling": ["tag-swing", "tag-jazz"],
  "Pribojszki Mátyás": ["tag-blues", "tag-jazz"],
  "Sir Oliver Mally & Peter Schneider Duo": ["tag-blues", "tag-guitar"],
  "Szalóky Béla": ["tag-brass", "tag-jazz"],
  "Tom White & the Mad Circus": ["tag-swing", "tag-jazz"],
  "Swingtáncórák kezdőknek": ["tag-dance", "tag-swing"],
};

/* Hungarian / International tag ráerősítése a származás alapján. */
const HUNGARIAN_ORIGINS = new Set(["Magyarország"]);
function tagsFromOrigin(origin: string): string[] {
  if (HUNGARIAN_ORIGINS.has(origin)) return ["tag-hungarian"];
  if (origin && origin !== "Magyarország") return ["tag-international"];
  return [];
}

/* Egy fellépő végleges címkelistája (max 4): kézi + származási tag, dedup-pal. */
function resolvePerformerTagIds(name: string, origin: string): string[] {
  const manual = performerTagsByName[name] || [];
  const origin_ = tagsFromOrigin(origin);
  const merged: string[] = [];
  for (const t of [...manual, ...origin_]) {
    if (!merged.includes(t)) merged.push(t);
  }
  return merged.slice(0, 4);
}

/* Egyszerű genre → angol fordítás a shortDescription-höz. */
const genreEnByHu: Record<string, string> = {
  "Classic Jazz": "Classic jazz",
  "Ragtime / Classic Jazz": "Ragtime / classic jazz",
  "Jazz Vocal": "Jazz vocals",
  "Jazz Drums": "Jazz drums",
  "Jazz Piano": "Jazz piano",
  "Clarinet / Tenor Sax": "Clarinet / tenor sax",
  "Swing / Classic Jazz": "Swing / classic jazz",
  "Double Bass": "Double bass",
  "International All-Stars": "International all-stars",
  "Jazz Guitar": "Jazz guitar",
  "Banjo / Guitar": "Banjo / guitar",
  Banjo: "Banjo",
  "Trombone / Trumpet / Piano / Vocal": "Trombone / trumpet / piano / vocals",
  "Classic Jazz / Swing": "Classic jazz / swing",
  "Blues / Jazz Harmonica": "Blues / jazz harmonica",
  Blues: "Blues",
  "Trumpet / Trombone": "Trumpet / trombone",
  "Vintage Jazz": "Vintage jazz",
  "Swing Dance Lesson": "Swing dance lesson",
};

/* Eredet → angol fordítás. */
const originEnByHu: Record<string, string> = {
  Magyarország: "Hungary",
  USA: "USA",
  Olaszország: "Italy",
  Japán: "Japan",
  Svédország: "Sweden",
  Nemzetközi: "International",
  "Ausztria / Németország": "Austria / Germany",
};

function shortDescriptionEnFrom(genreHu: string, originHu: string): string {
  const g = genreEnByHu[genreHu] || genreHu;
  const o = originEnByHu[originHu] || originHu;
  return o ? `${g} · ${o}` : g;
}

const performerDetailsByName: Record<
  string,
  { bioHu: string; bioEn?: string; websiteUrl?: string; youtubeUrl?: string }
> = {
  "Bérczesi Jazz Band": {
    bioHu:
      "Bérczesi Róbert (Hiperkarma) különleges vendégprojektje. Klasszikus jazzt és bohém lendületet ötvöző formáció.",
    bioEn:
      "A special guest project led by Róbert Bérczesi (Hiperkarma), blending classic jazz with bohemian energy.",
    websiteUrl: "https://jazzfovaros.hu/bg/performer-popup/190",
    youtubeUrl: "https://www.youtube.com/watch?v=zjxCe4WunMY",
  },
  "Bohém Ragtime Jazz Band": {
    bioHu:
      "Az eMeRTon-díjas kecskeméti csapat 1985-ben alakult, repertoárjuk a ragtime-tól a New Orleans-i jazzen és dixielanden át a swingig terjed.",
    bioEn:
      "Founded in Kecskemét in 1985, this eMeRTon-awarded ensemble plays a wide range from ragtime through New Orleans jazz and dixieland to swing.",
    websiteUrl: "http://www.bohemragtime.com",
    youtubeUrl: "https://youtu.be/WphNjExWanE?si=RFRy3lOJDkOrdc2q",
  },
  "Bolba Éva": {
    bioHu:
      "Nemzetközileg is aktív jazzénekes, Európa mellett az USA-ban és Ázsiában is fellépett. A JAZZterlánc megálmodója.",
    bioEn:
      "Internationally active jazz singer who has performed across Europe, the United States and Asia. Founder of the JAZZterlánc series.",
    websiteUrl: "https://www.facebook.com/jazzterlanc/",
    youtubeUrl: "https://www.youtube.com/watch?v=-2mzm8Fiq4w",
  },
  "Cseh Balázs": {
    bioHu:
      "A régi stílusú jazzdobolás specialistája, tapasztalt stúdiózenész és több formáció tagja.",
    bioEn:
      "A specialist of vintage jazz drumming, experienced studio musician and member of several Hungarian jazz formations.",
    websiteUrl: "https://www.facebook.com/balazs.cseh.50",
    youtubeUrl: "https://www.youtube.com/watch?v=N4lvyrNWswY",
  },
  "Dániel Balázs": {
    bioHu:
      "Mr. Firehand, a boogie-woogie magyar nagykövete és az egyik legvirtuózabb hazai zongorista.",
    bioEn:
      "Known as Mr. Firehand, Hungary's leading boogie-woogie ambassador and one of the most virtuoso pianists on the local scene.",
    websiteUrl: "https://mrfirehand.com/",
    youtubeUrl: "https://www.youtube.com/watch?v=ZqMxZbwIjm0",
  },
  "Dennert Árpád": {
    bioHu:
      "Az Árpi Show, a Benkó Dixieland és számos más hazai jazz-zenekar meghatározó hangszerese.",
    bioEn:
      "A defining clarinet and tenor sax player of Árpi Show, the Benkó Dixieland Band and many other Hungarian jazz ensembles.",
    websiteUrl: "https://www.facebook.com/dennertarpi",
    youtubeUrl: "https://www.youtube.com/watch?v=j_m-5v4lxrM",
  },
  'Emanuele Urso "King of Swing"': {
    bioHu: "Az olasz swingélet kiemelt alakja, a fesztivál nemzetközi vendégművésze.",
    bioEn:
      "A leading figure of the Italian swing scene and an international guest of the festival.",
    websiteUrl: "https://emanueleurso.it",
    youtubeUrl: "https://www.youtube.com/watch?v=q1Gh8TQ9e3I",
  },
  "Festival All Stars": {
    bioHu:
      "Nemzetközi all-stars projekt magyar és külföldi vendégművészekkel, külön pénteki és szombati felállással.",
    bioEn:
      "An international all-stars project featuring Hungarian and foreign guest artists, with separate Friday and Saturday line-ups.",
    websiteUrl: "https://jazzfovaros.hu/bg/performer-popup/84",
  },
  "Gyárfás István": {
    bioHu:
      "A mainstream jazz egyik legismertebb hazai gitárosa, több évtizedes pályafutással és nemzetközi együttműködésekkel.",
    bioEn:
      "One of the best-known Hungarian mainstream jazz guitarists, with decades of experience and international collaborations.",
    websiteUrl: "https://www.facebook.com/istvan.gyarfas.1",
    youtubeUrl: "https://www.youtube.com/watch?v=yCY9M9atxRI",
  },
  "Hungarian Jazz Embassy": {
    bioHu: "Hazai jazz-elit formáció, kifejezetten a fesztiválra összeállított felállással.",
    bioEn:
      "A top-tier Hungarian jazz formation assembled specifically for the Bohém Jazz Capital festival.",
    websiteUrl: "https://www.facebook.com/szalokygroup/",
  },
  "Hunter Burgamy": {
    bioHu: "Amerikai gitáros/bendzsós és énekes, tradicionális jazz és swing vonalon.",
    bioEn:
      "American guitarist, banjo player and vocalist working in traditional jazz and swing.",
    websiteUrl: "https://www.hunterburgamy.com/",
  },
  "Jazz Camp All Stars": {
    bioHu:
      "A JAZZFŐVÁROS jazztábor tanárai és zenésztársaik spontán örömzenélésre összeálló nyitónapi csapata.",
    bioEn:
      "A spontaneous opening-night session by the teachers and musician friends of the Bohém Jazz Capital camp.",
    websiteUrl: "https://www.jazzfovaros.hu/jazztabor",
  },
  "Ken Aoki": {
    bioHu: "Világszínvonalú bendzsóművész, a fesztivál egyik közönségkedvenc nemzetközi fellépője.",
    bioEn:
      "A world-class banjo player from Japan and one of the festival's much-loved international returning guests.",
    websiteUrl: "https://www.facebook.com/vegavox",
    youtubeUrl: "https://www.youtube.com/watch?v=eXFc-JfW2r8",
  },
  "Korb Attila": {
    bioHu:
      "Sokoldalú hangszeres (harsona, trombita, szaxofon, zongora, ének), folyamatosan turnézó szabadúszó jazzmuzsikus.",
    bioEn:
      "A versatile multi-instrumentalist (trombone, trumpet, sax, piano and vocals) and a constantly touring freelance jazz musician.",
    websiteUrl: "https://www.facebook.com/attila.korb.7",
    youtubeUrl: "https://www.youtube.com/watch?v=QcoDBs6_SBM",
  },
  "Nagy Iván": {
    bioHu:
      "A stride-zongorázás elkötelezett képviselője, számos hazai swing- és jazzformáció közreműködője.",
    bioEn:
      "A dedicated representative of stride piano playing, contributor to many Hungarian swing and jazz formations.",
    websiteUrl: "https://www.facebook.com/ivan.nagy.7161",
    youtubeUrl: "https://www.youtube.com/watch?v=7Sv_XN6bK3o",
  },
  "Nanna Carling": {
    bioHu:
      "Svédországi tradicionális jazz előadó, több hangszerrel és énekkel is rendszeresen szerepel nemzetközi fesztiválokon.",
    bioEn:
      "A Swedish traditional jazz performer who regularly appears at international festivals on multiple instruments and as a vocalist.",
    websiteUrl: "https://www.nannacarling.com",
    youtubeUrl: "https://www.youtube.com/@nannacarling",
  },
  "Sir Oliver Mally & Peter Schneider Duo": {
    bioHu: "Osztrák-német blues duó, akusztikus gitárra és énekre épülő műsorral.",
    bioEn:
      "Austrian-German blues duo built around acoustic guitar and vocals.",
    websiteUrl: "https://sir-oliver.com",
    youtubeUrl: "https://www.youtube.com/watch?v=nP5MVYLVKEI",
  },
  "Swingtáncórák kezdőknek": {
    bioHu:
      "Kezdő swingtáncórák több időpontban a fesztivál alatt, magyar és nemzetközi közönségnek.",
    bioEn:
      "Beginner-friendly swing dance lessons running at multiple times during the festival, open to local and international guests.",
    websiteUrl: "https://www.swinglight.hu",
    youtubeUrl: "https://www.youtube.com/watch?v=CZ0e0rtanGM",
  },
  "Szalóky Béla": {
    bioHu:
      "Multiinstrumentalista, a magyar oldtimer-jazz meghatározó alakja, rendszeres nemzetközi fesztiválvendég.",
    bioEn:
      "Multi-instrumentalist and one of the defining figures of Hungarian oldtimer jazz, a regular guest at international festivals.",
    websiteUrl: "http://szaloky.com/",
    youtubeUrl: "https://www.youtube.com/watch?v=R91MRLsUi_s",
  },
  "Tom White & the Mad Circus": {
    bioHu: "A rockabilly magyar királyai, erős színpadi energiával és vintage hangzással.",
    bioEn:
      "The kings of Hungarian rockabilly, with high-energy stage shows and a strong vintage sound.",
    websiteUrl: "http://www.tomwhite.hu/",
    youtubeUrl: "https://www.youtube.com/watch?v=jVIMTO5gd48",
  },
};

/* Név → performer dokumentum-id (programItem performers ref-ekhez). */
const performerIdByName: Record<string, string> = {};
BASE.artists.forEach((artist, index) => {
  performerIdByName[artist.name] = `performer-${index + 1}`;
});

const performers: SeedDocument[] = BASE.artists.map((artist, index) => {
  const details = performerDetailsByName[artist.name];
  const tagIds = resolvePerformerTagIds(artist.name, artist.origin);
  return {
    _id: `performer-${index + 1}`,
    _type: "performer",
    name: artist.name,
    slug: {
      _type: "slug",
      current: artist.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    },
    imagePath: artist.image || "", // legacy fallback; Studio-ban a `image` mezőbe érdemes feltölteni
    shortDescriptionHu: `${artist.genre} · ${artist.origin}`,
    shortDescriptionEn: shortDescriptionEnFrom(artist.genre, artist.origin),
    bioHu: details?.bioHu || "",
    bioEn: details?.bioEn || "",
    websiteUrl: details?.websiteUrl || "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: details?.youtubeUrl || "",
    spotifyUrl: "",
    tags: tagIds.map((tid, i) => ({
      _key: `tag-ref-${index}-${i}`,
      _type: "reference",
      _ref: tid,
    })),
    order: index + 1,
    isFeatured: index < 8,
    isActive: true,
    seo: {
      seoTitleHu: `${artist.name} | Bohém JAZZFŐVÁROS`,
      seoTitleEn: `${artist.name} | Bohém JAZZ CAPITAL`,
      seoDescriptionHu: details?.bioHu || "",
      seoDescriptionEn: details?.bioEn || "",
      canonicalOverrideHu: "",
      canonicalOverrideEn: "",
      noIndex: false,
    },
  };
});

/* Sorrend: hu.map.directions — 1) autó, 2) vonat, 3) busz távolsági, 4) helyi busz */
const transportItemIcons: Array<"car" | "train" | "bus"> = ["car", "train", "bus", "bus"];

const transportItems: SeedDocument[] = hu.map.directions.map((direction, index) => {
  const enDirection = en.map.directions[index];
  return {
    _id: `transport-${index + 1}`,
    _type: "transportItem",
    titleHu: direction.mode,
    titleEn: enDirection?.mode || direction.mode,
    descriptionHu: direction.text,
    descriptionEn: enDirection?.text || direction.text,
    icon: transportItemIcons[index] ?? "bus",
    url: "",
    order: index + 1,
    isActive: true,
  };
});

/* ============================================================
   Page body szövegek — alapértelmezett, ügyfél által szerkeszthető
   tartalom a fix oldalakra. Csak HU/EN szabad szöveg, soremelésekkel.
   ============================================================ */
const pageBodyContent: Record<string, { hu: string; en: string }> = {
  home: {
    hu: "",
    en: "",
  },
  info: {
    hu: "",
    en: "",
  },
  lineup: {
    hu: "",
    en: "",
  },
  program: {
    hu: "",
    en: "",
  },
  contact: {
    hu: `${hu.contact.organizer}

E-mail: ${BASE.contact.email}
Telefon: ${BASE.contact.phone}

Cím: ${BASE.contact.address.hu}

Önkéntes munkára jelentkezni a fenti e-mailen, vagy a kapcsolódó űrlapon keresztül lehet.`,
    en: `${en.contact.organizer}

Email: ${BASE.contact.email}
Phone: ${BASE.contact.phone}

Address: ${BASE.contact.address.en}

To volunteer, write to the email above or use the linked form.`,
  },
  szallas: {
    hu: hu.accommodation.note || "",
    en: en.accommodation.note || "",
  },
  terkep: {
    hu: `Helyszín: ${BASE.venue.hu}
Cím: ${BASE.contact.address.hu}

A részletes megközelítési útmutatókat (autó, vonat, busz) az alábbi kártyákon találod.`,
    en: `Venue: ${BASE.venue.en}
Address: ${BASE.contact.address.en}

Detailed directions (car, train, bus) are listed below.`,
  },
  futas: {
    hu: `Bohém JAZZFŐVÁROS Futás — ${BASE.running.date.hu}, ${BASE.running.time}.
Helyszín: ${BASE.running.location.hu}.

Nevezés: ${BASE.running.entryUrl}
Nevezési határidő: ${BASE.running.entryDeadline.hu}.

Lebonyolító: Iustitia Egyesület. Kapcsolat: ${BASE.running.contactEmail}, ${BASE.running.contactPhone}.`,
    en: `Bohém JAZZ CAPITAL Run — ${BASE.running.date.en}, ${BASE.running.time}.
Location: ${BASE.running.location.en}.

Registration: ${BASE.running.entryUrl}
Deadline: ${BASE.running.entryDeadline.en}.

Organised by the Iustitia Association. Contact: ${BASE.running.contactEmail}, ${BASE.running.contactPhone}.`,
  },
  tabor: {
    hu: hu.camp.description,
    en: en.camp.description,
  },
  aszf: {
    hu: hu.terms.body,
    en: en.terms.body,
  },
};

const pages: SeedDocument[] = [
  {
    _id: "page-home",
    _type: "page",
    slug: { _type: "slug", current: "home" },
    titleHu: hu.meta.siteTitle,
    titleEn: en.meta.siteTitle,
    heroTitleHu: hu.home.heroTitle,
    heroTitleEn: en.home.heroTitle,
    heroDescriptionHu: hu.meta.siteDescription,
    heroDescriptionEn: en.meta.siteDescription,
    seo: {
      seoTitleHu: "Bohém Jazzfőváros Kecskemét 2026",
      seoTitleEn: "Bohém Jazz Capital Kecskemét 2026",
      seoDescriptionHu:
        "Bohém Jazzfőváros Kecskeméten, a Domb Beach helyszínen 2026. augusztus 6–9. között. Jazzprogramok, fellépők, jegyek és fesztiválinformációk.",
      seoDescriptionEn:
        "Bohém Jazz Capital in Kecskemét, Hungary, at Domb Beach from 6–9 August 2026. Jazz concerts, performers, tickets and festival information.",
      noIndex: false,
    },
    order: 1,
    isActive: true,
  },
  {
    _id: "page-info",
    _type: "page",
    slug: { _type: "slug", current: "info" },
    titleHu: hu.info.title,
    titleEn: en.info.title,
    heroTitleHu: hu.info.title,
    heroTitleEn: en.info.title,
    heroDescriptionHu: hu.info.subtitle,
    heroDescriptionEn: en.info.subtitle,
    seo: {
      seoTitleHu: "Jegyek és információk | Bohém Jazzfőváros 2026",
      seoTitleEn: "Tickets and Info | Bohém Jazz Capital 2026",
      seoDescriptionHu:
        "Jegyárak, gyakori kérdések és fontos fesztiválinformációk a Bohém Jazzfőváros 2026 eseményhez.",
      seoDescriptionEn:
        "Ticket details, FAQ and key festival information for Bohém Jazz Capital 2026.",
      noIndex: false,
    },
    order: 2,
    isActive: true,
  },
  {
    _id: "page-lineup",
    _type: "page",
    slug: { _type: "slug", current: "lineup" },
    titleHu: hu.lineup.title,
    titleEn: en.lineup.title,
    heroTitleHu: hu.lineup.title,
    heroTitleEn: en.lineup.title,
    heroDescriptionHu: hu.lineup.subtitle,
    heroDescriptionEn: en.lineup.subtitle,
    seo: {
      seoTitleHu: "Fellépők | Bohém Jazzfőváros 2026",
      seoTitleEn: "Lineup | Bohém Jazz Capital 2026",
      seoDescriptionHu:
        "A Bohém Jazzfőváros 2026 fellépőinek listája: nemzetközi és hazai jazzelőadók Kecskeméten.",
      seoDescriptionEn:
        "Explore the Bohém Jazz Capital 2026 lineup featuring international and Hungarian jazz performers.",
      noIndex: false,
    },
    order: 3,
    isActive: true,
  },
  {
    _id: "page-program",
    _type: "page",
    slug: { _type: "slug", current: "program" },
    titleHu: hu.program.title,
    titleEn: en.program.title,
    heroTitleHu: hu.program.title,
    heroTitleEn: en.program.title,
    heroDescriptionHu: hu.program.subtitle,
    heroDescriptionEn: en.program.subtitle,
    seo: {
      seoTitleHu: "Program | Bohém Jazzfőváros 2026",
      seoTitleEn: "Program | Bohém Jazz Capital 2026",
      seoDescriptionHu:
        "Napi bontású fesztiválprogram a Bohém Jazzfőváros 2026 eseményhez: koncertek, időpontok és színpadok.",
      seoDescriptionEn:
        "Daily schedule for Bohém Jazz Capital 2026: concerts, start times and stages.",
      noIndex: false,
    },
    programDisplayMode: "structured",
    order: 4,
    isActive: true,
  },
  {
    _id: "page-contact",
    _type: "page",
    slug: { _type: "slug", current: "contact" },
    titleHu: hu.contact.title,
    titleEn: en.contact.title,
    heroTitleHu: hu.contact.title,
    heroTitleEn: en.contact.title,
    heroDescriptionHu: hu.contact.subtitle,
    heroDescriptionEn: en.contact.subtitle,
    seo: {
      seoTitleHu: "Kapcsolat | Bohém Jazzfőváros",
      seoTitleEn: "Contact | Bohém Jazz Capital",
      seoDescriptionHu:
        "Kapcsolati adatok és szervezői információk a Bohém Jazzfőváros fesztiválhoz.",
      seoDescriptionEn:
        "Contact details and organizer information for Bohém Jazz Capital festival.",
      noIndex: false,
    },
    order: 5,
    isActive: true,
  },
  {
    _id: "page-szallas",
    _type: "page",
    slug: { _type: "slug", current: "szallas" },
    titleHu: hu.accommodation.title,
    titleEn: en.accommodation.title,
    heroTitleHu: hu.accommodation.title,
    heroTitleEn: en.accommodation.title,
    heroDescriptionHu: hu.accommodation.subtitle,
    heroDescriptionEn: en.accommodation.subtitle,
    seo: {
      seoTitleHu: "Szállás | Bohém Jazzfőváros 2026",
      seoTitleEn: "Accommodation | Bohém Jazz Capital 2026",
      seoDescriptionHu:
        "Szálláslehetőségek a Bohém Jazzfőváros 2026 idejére Kecskeméten, a fesztiválhelyszín közelében.",
      seoDescriptionEn:
        "Accommodation options in Kecskemét for Bohém Jazz Capital 2026 near the festival venue.",
      noIndex: false,
    },
    order: 6,
    isActive: true,
  },
  {
    _id: "page-terkep",
    _type: "page",
    slug: { _type: "slug", current: "terkep" },
    titleHu: hu.map.title,
    titleEn: en.map.title,
    heroTitleHu: hu.map.title,
    heroTitleEn: en.map.title,
    heroDescriptionHu: hu.map.subtitle,
    heroDescriptionEn: en.map.subtitle,
    seo: {
      seoTitleHu: "Térkép és helyszín | Bohém Jazzfőváros",
      seoTitleEn: "Map and Venue | Bohém Jazz Capital",
      seoDescriptionHu:
        "Helyszín, térkép és megközelítési információk a Bohém Jazzfőváros fesztiválhoz.",
      seoDescriptionEn:
        "Venue, map and directions for the Bohém Jazz Capital festival.",
      noIndex: false,
    },
    order: 7,
    isActive: true,
  },
  {
    _id: "page-futas",
    _type: "page",
    slug: { _type: "slug", current: "futas" },
    titleHu: hu.running.title,
    titleEn: en.running.title,
    heroTitleHu: hu.running.title,
    heroTitleEn: en.running.title,
    heroDescriptionHu: hu.running.subtitle,
    heroDescriptionEn: en.running.subtitle,
    seo: {
      seoTitleHu: "Jazzfőváros Futás | Bohém Jazzfőváros 2026",
      seoTitleEn: "Jazz Capital Run | Bohém Jazz Capital 2026",
      seoDescriptionHu:
        "Jazzfőváros Futás programinformációk: időpont, nevezés és tudnivalók a Bohém Jazzfőváros 2026 eseményen.",
      seoDescriptionEn:
        "Jazz Capital Run details: date, registration and key info during Bohém Jazz Capital 2026.",
      noIndex: false,
    },
    order: 8,
    isActive: true,
  },
  {
    _id: "page-tabor",
    _type: "page",
    slug: { _type: "slug", current: "tabor" },
    titleHu: hu.camp.title,
    titleEn: en.camp.title,
    heroTitleHu: hu.camp.title,
    heroTitleEn: en.camp.title,
    heroDescriptionHu: hu.camp.subtitle,
    heroDescriptionEn: en.camp.subtitle,
    seo: {
      seoTitleHu: "Jazztábor | Bohém Jazzfőváros",
      seoTitleEn: "Jazz Camp | Bohém Jazz Capital",
      seoDescriptionHu:
        "Jazztábor információk a Bohém Jazzfőváros programjához: leírás, időpontok és jelentkezés.",
      seoDescriptionEn:
        "Jazz camp information within Bohém Jazz Capital: overview, schedule and registration.",
      noIndex: false,
    },
    order: 9,
    isActive: true,
  },
  {
    _id: "page-aszf",
    _type: "page",
    slug: { _type: "slug", current: "aszf" },
    titleHu: hu.terms.title,
    titleEn: en.terms.title,
    heroTitleHu: hu.terms.title,
    heroTitleEn: en.terms.title,
    heroDescriptionHu: hu.meta.siteDescription,
    heroDescriptionEn: en.meta.siteDescription,
    seo: {
      seoTitleHu: "ÁSZF | Bohém Jazzfőváros",
      seoTitleEn: "Terms | Bohém Jazz Capital",
      seoDescriptionHu:
        "Általános szerződési feltételek és jogi információk a Bohém Jazzfőváros oldalán.",
      seoDescriptionEn:
        "Terms and legal information on the Bohém Jazz Capital website.",
      noIndex: false,
    },
    order: 10,
    isActive: true,
  },
];

/* pageBody mezők injektálása slug alapján. */
for (const page of pages) {
  const slugObj = (page as Record<string, unknown>).slug as
    | { current?: string }
    | undefined;
  const slug = slugObj?.current ?? "";
  const body = pageBodyContent[slug];
  if (body) {
    page.pageBodyHu = body.hu;
    page.pageBodyEn = body.en;
  }
}

/* Stage seed — két alap színpad. Ha új helyszín kell, az ügyfél a Studio-ban veszi fel. */
const stageIds = {
  main: "stage-main",
  club: "stage-club",
} as const;

const stages: SeedDocument[] = [
  {
    _id: stageIds.main,
    _type: "stage",
    nameHu: "Main Stage",
    nameEn: "Main Stage",
    slug: { _type: "slug", current: "main-stage" },
    order: 1,
    isActive: true,
  },
  {
    _id: stageIds.club,
    _type: "stage",
    nameHu: "Club Stage",
    nameEn: "Club Stage",
    slug: { _type: "slug", current: "club-stage" },
    order: 2,
    isActive: true,
  },
];

const programItems: SeedDocument[] = hu.program.days.flatMap((day, dayIndex) =>
  day.slots.map((slot, slotIndex) => {
    const enDay = en.program.days[dayIndex];
    const enSlot = enDay?.slots?.[slotIndex];
    const idPart = sanitizeForId(`${day.date}-${slot.time}-${slot.artist}`);
    const isMain = slot.stage === "main";
    /* Performer ref: csak ha a slot.artist név pontosan szerepel a BASE.artists listában. */
    const performerId = performerIdByName[slot.artist];
    const performersRefs = performerId
      ? [
          {
            _key: `perf-ref-${dayIndex}-${slotIndex}`,
            _type: "reference",
            _ref: performerId,
          },
        ]
      : [];
    return {
      _id: `program-${idPart || `${dayIndex + 1}-${slotIndex + 1}`}`,
      _type: "programItem",
      titleHu: slot.artist,
      titleEn: enSlot?.artist || slot.artist,
      descriptionHu: slot.note || "",
      descriptionEn: enSlot?.note || "",
      date: day.date,
      startTime: slot.time || "",
      endTime: "",
      stage: isMain ? "Main Stage" : "Club Stage",
      stageRef: { _type: "reference", _ref: isMain ? stageIds.main : stageIds.club },
      performers: performersRefs,
      category: "",
      order: dayIndex * 100 + slotIndex + 1,
      isActive: true,
    };
  }),
);

/* Navigation seed — a jelenlegi NAV_ITEMS hu.ts alapján; mindegyik header-en, az első 5 + Kapcsolat
   a footer-ben is. Az ügyfél innen tudja átrendezni / elrejteni / új linket felvenni. */
const navItemsSeed: Array<{
  id: string;
  labelHu: string;
  labelEn: string;
  pageId?: string;
  href?: string;
  order: number;
  inFooter: boolean;
}> = [
  { id: "home", labelHu: "Főoldal", labelEn: "Home", pageId: "page-home", order: 1, inFooter: true },
  { id: "lineup", labelHu: "Fellépők", labelEn: "Performers", pageId: "page-lineup", order: 2, inFooter: true },
  { id: "program", labelHu: "Programok", labelEn: "Program", pageId: "page-program", order: 3, inFooter: true },
  { id: "info", labelHu: "Jegyek & Infó", labelEn: "Tickets & Info", pageId: "page-info", order: 4, inFooter: true },
  { id: "szallas", labelHu: "Szállás", labelEn: "Accommodation", pageId: "page-szallas", order: 5, inFooter: true },
  { id: "terkep", labelHu: "Térkép", labelEn: "Map", pageId: "page-terkep", order: 6, inFooter: false },
  { id: "tabor", labelHu: "Jazztábor", labelEn: "Jazz Camp", pageId: "page-tabor", order: 7, inFooter: false },
  { id: "futas", labelHu: "Futás", labelEn: "Run", pageId: "page-futas", order: 8, inFooter: false },
  { id: "contact", labelHu: "Kapcsolat", labelEn: "Contact", pageId: "page-contact", order: 9, inFooter: true },
];

const navigationItems: SeedDocument[] = navItemsSeed.map((nav) => ({
  _id: `nav-${nav.id}`,
  _type: "navigationItem",
  labelHu: nav.labelHu,
  labelEn: nav.labelEn,
  page: nav.pageId ? { _type: "reference", _ref: nav.pageId } : undefined,
  href: nav.href || "",
  externalUrl: "",
  openInNewTab: false,
  order: nav.order,
  isActive: true,
  showInHeader: true,
  showInFooter: nav.inFooter,
}));

const accommodationItems: SeedDocument[] = hu.accommodation.hotels.map((hotel, index) => {
  const enHotel = en.accommodation.hotels[index];
  return {
    _id: `accommodation-${index + 1}`,
    _type: "accommodation",
    name: hotel.name,
    descriptionHu: hotel.description,
    descriptionEn: enHotel?.description || hotel.description,
    imagePath: hotel.images?.[0] || "",
    websiteUrl: "",
    bookingUrl: hotel.bookingUrl,
    distanceHu: hotel.distance,
    distanceEn: enHotel?.distance || hotel.distance,
    order: index + 1,
    isActive: true,
  };
});

export const initialData = {
  siteSettings: {
    _id: "siteSettings",
    _type: "siteSettings",
    titleHu: hu.meta.siteTitle,
    titleEn: en.meta.siteTitle,
    descriptionHu: hu.meta.siteDescription,
    descriptionEn: en.meta.siteDescription,
    festivalStartDate: "2026-08-06",
    festivalEndDate: "2026-08-09",
    venueNameHu: BASE.venue.hu,
    venueNameEn: BASE.venue.en,
    ticketUrlHu: BASE.ticketUrl,
    ticketUrlEn: BASE.ticketUrlEn,
    facebookUrl: BASE.socials.facebook,
    instagramUrl: BASE.socials.instagram,
    youtubeUrl: BASE.socials.youtube,
    contactEmail: BASE.contact.email,
    contactPhone: BASE.contact.phone,
    volunteerTitleHu: "Önkéntes szeretnék lenni",
    volunteerTitleEn: "I would like to volunteer",
    volunteerDescriptionHu: hu.contact.volunteerText || "",
    volunteerDescriptionEn: en.contact.volunteerText || "",
    volunteerButtonLabelHu: hu.contact.volunteerText || "Önkéntes szeretnék lenni",
    volunteerButtonLabelEn: en.contact.volunteerText || "I would like to volunteer",
    volunteerUrl: BASE.contact.volunteerUrl,
    houseRulesPdf: hu.houseRulesPdf,
    organizationName: BASE.contact.organizer.hu,
    organizationUrl: "https://jazzfovaros.hu", // TODO: ha ettől eltérő hivatalos szervezeti URL van, cserélni kell.
    seo: {
      seoTitleHu: hu.meta.siteTitle,
      seoTitleEn: en.meta.siteTitle,
      seoDescriptionHu: hu.meta.siteDescription,
      seoDescriptionEn: en.meta.siteDescription,
      canonicalOverrideHu: "https://jazzfovaros.hu",
      canonicalOverrideEn: "https://jazzcapital.hu",
      noIndex: false,
    },
  } as SeedDocument,
  popupSettings: {
    _id: "popupSettings",
    _type: "popupSettings",
    isEnabled: true,
    imagePath: "/images/43e3a57583f727d87fb1271bb22963ef.jpg", // TODO: Studio image upload kell.
    altHu: "Széchenyi Terv támogatási információ",
    altEn: "Széchenyi Plan funding information",
    sessionStorageKey: "szechenyiPopupShown",
    showOnlyOnHomepage: true,
  } as SeedDocument,
  venue: {
    _id: "venue",
    _type: "venue",
    nameHu: BASE.venue.hu,
    nameEn: BASE.venue.en,
    addressHu: BASE.contact.address.hu,
    addressEn: BASE.contact.address.en,
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.5!2d19.666032!3d46.903819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDU0JzEzLjgiTiAxOcKwMzknNTcuNyJF!5e0!3m2!1shu!2shu!4v1700000000000!5m2!1shu!2shu",
    googleMapsUrl: `https://www.google.com/maps?q=${BASE.gps}`,
    latitude: 46.903819,
    longitude: 19.666032,
    descriptionHu: hu.map.subtitle,
    descriptionEn: en.map.subtitle,
  } as SeedDocument,
  sponsorCategories,
  sponsors,
  tickets,
  performerTags,
  performers,
  pages,
  stages,
  programItems,
  navigationItems,
  accommodationItems,
  transportItems,
};

