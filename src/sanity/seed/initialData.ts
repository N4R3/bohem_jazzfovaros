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

const performerDetailsByName: Record<
  string,
  { bioHu: string; websiteUrl?: string; youtubeUrl?: string }
> = {
  "Bérczesi Jazz Band": {
    bioHu:
      "Bérczesi Róbert (Hiperkarma) különleges vendégprojektje. Klasszikus jazzt és bohém lendületet ötvöző formáció.",
    websiteUrl: "https://jazzfovaros.hu/bg/performer-popup/190",
    youtubeUrl: "https://www.youtube.com/watch?v=zjxCe4WunMY",
  },
  "Bohém Ragtime Jazz Band": {
    bioHu:
      "Az eMeRTon-díjas kecskeméti csapat 1985-ben alakult, repertoárjuk a ragtime-tól a New Orleans-i jazzen és dixielanden át a swingig terjed.",
    websiteUrl: "http://www.bohemragtime.com",
    youtubeUrl: "https://youtu.be/WphNjExWanE?si=RFRy3lOJDkOrdc2q",
  },
  "Bolba Éva": {
    bioHu:
      "Nemzetközileg is aktív jazzénekes, Európa mellett az USA-ban és Ázsiában is fellépett. A JAZZterlánc megálmodója.",
    websiteUrl: "https://www.facebook.com/jazzterlanc/",
    youtubeUrl: "https://www.youtube.com/watch?v=-2mzm8Fiq4w",
  },
  "Cseh Balázs": {
    bioHu:
      "A régi stílusú jazzdobolás specialistája, tapasztalt stúdiózenész és több formáció tagja.",
    websiteUrl: "https://www.facebook.com/balazs.cseh.50",
    youtubeUrl: "https://www.youtube.com/watch?v=N4lvyrNWswY",
  },
  "Dániel Balázs": {
    bioHu:
      "Mr. Firehand, a boogie-woogie magyar nagykövete és az egyik legvirtuózabb hazai zongorista.",
    websiteUrl: "https://mrfirehand.com/",
    youtubeUrl: "https://www.youtube.com/watch?v=ZqMxZbwIjm0",
  },
  "Dennert Árpád": {
    bioHu:
      "Az Árpi Show, a Benkó Dixieland és számos más hazai jazz-zenekar meghatározó hangszerese.",
    websiteUrl: "https://www.facebook.com/dennertarpi",
    youtubeUrl: "https://www.youtube.com/watch?v=j_m-5v4lxrM",
  },
  'Emanuele Urso "King of Swing"': {
    bioHu: "Az olasz swingélet kiemelt alakja, a fesztivál nemzetközi vendégművésze.",
    websiteUrl: "https://emanueleurso.it",
    youtubeUrl: "https://www.youtube.com/watch?v=q1Gh8TQ9e3I",
  },
  "Festival All Stars": {
    bioHu:
      "Nemzetközi all-stars projekt magyar és külföldi vendégművészekkel, külön pénteki és szombati felállással.",
    websiteUrl: "https://jazzfovaros.hu/bg/performer-popup/84",
  },
  "Gyárfás István": {
    bioHu:
      "A mainstream jazz egyik legismertebb hazai gitárosa, több évtizedes pályafutással és nemzetközi együttműködésekkel.",
    websiteUrl: "https://www.facebook.com/istvan.gyarfas.1",
    youtubeUrl: "https://www.youtube.com/watch?v=yCY9M9atxRI",
  },
  "Hungarian Jazz Embassy": {
    bioHu: "Hazai jazz-elit formáció, kifejezetten a fesztiválra összeállított felállással.",
    websiteUrl: "https://www.facebook.com/szalokygroup/",
  },
  "Hunter Burgamy": {
    bioHu: "Amerikai gitáros/bendzsós és énekes, tradicionális jazz és swing vonalon.",
    websiteUrl: "https://www.hunterburgamy.com/",
  },
  "Jazz Camp All Stars": {
    bioHu:
      "A JAZZFŐVÁROS jazztábor tanárai és zenésztársaik spontán örömzenélésre összeálló nyitónapi csapata.",
    websiteUrl: "https://www.jazzfovaros.hu/jazztabor",
  },
  "Ken Aoki": {
    bioHu: "Világszínvonalú bendzsóművész, a fesztivál egyik közönségkedvenc nemzetközi fellépője.",
    websiteUrl: "https://www.facebook.com/vegavox",
    youtubeUrl: "https://www.youtube.com/watch?v=eXFc-JfW2r8",
  },
  "Korb Attila": {
    bioHu:
      "Sokoldalú hangszeres (harsona, trombita, szaxofon, zongora, ének), folyamatosan turnézó szabadúszó jazzmuzsikus.",
    websiteUrl: "https://www.facebook.com/attila.korb.7",
    youtubeUrl: "https://www.youtube.com/watch?v=QcoDBs6_SBM",
  },
  "Nagy Iván": {
    bioHu:
      "A stride-zongorázás elkötelezett képviselője, számos hazai swing- és jazzformáció közreműködője.",
    websiteUrl: "https://www.facebook.com/ivan.nagy.7161",
    youtubeUrl: "https://www.youtube.com/watch?v=7Sv_XN6bK3o",
  },
  "Nanna Carling": {
    bioHu:
      "Svédországi tradicionális jazz előadó, több hangszerrel és énekkel is rendszeresen szerepel nemzetközi fesztiválokon.",
    websiteUrl: "https://www.nannacarling.com",
    youtubeUrl: "https://www.youtube.com/@nannacarling",
  },
  "Sir Oliver Mally & Peter Schneider Duo": {
    bioHu: "Osztrák-német blues duó, akusztikus gitárra és énekre épülő műsorral.",
    websiteUrl: "https://sir-oliver.com",
    youtubeUrl: "https://www.youtube.com/watch?v=nP5MVYLVKEI",
  },
  "Swingtáncórák kezdőknek": {
    bioHu:
      "Kezdő swingtáncórák több időpontban a fesztivál alatt, magyar és nemzetközi közönségnek.",
    websiteUrl: "https://www.swinglight.hu",
    youtubeUrl: "https://www.youtube.com/watch?v=CZ0e0rtanGM",
  },
  "Szalóky Béla": {
    bioHu:
      "Multiinstrumentalista, a magyar oldtimer-jazz meghatározó alakja, rendszeres nemzetközi fesztiválvendég.",
    websiteUrl: "http://szaloky.com/",
    youtubeUrl: "https://www.youtube.com/watch?v=R91MRLsUi_s",
  },
  "Tom White & the Mad Circus": {
    bioHu: "A rockabilly magyar királyai, erős színpadi energiával és vintage hangzással.",
    websiteUrl: "http://www.tomwhite.hu/",
    youtubeUrl: "https://www.youtube.com/watch?v=jVIMTO5gd48",
  },
};

const performers: SeedDocument[] = BASE.artists.map((artist, index) => ({
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
  imagePath: artist.image || "", // TODO: Studio-ban image upload kell, majd ide image asset referencia.
  shortDescriptionHu: `${artist.genre} · ${artist.origin}`,
  shortDescriptionEn: `${artist.genre} · ${artist.origin}`,
  bioHu: performerDetailsByName[artist.name]?.bioHu || "",
  bioEn: "",
  websiteUrl: performerDetailsByName[artist.name]?.websiteUrl || "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: performerDetailsByName[artist.name]?.youtubeUrl || "",
  spotifyUrl: "",
  order: index + 1,
  isFeatured: index < 8,
  isActive: true,
  seo: {
    seoTitleHu: `${artist.name} | Bohém JAZZFŐVÁROS`,
    seoTitleEn: `${artist.name} | Bohém JAZZ CAPITAL`,
    seoDescriptionHu: "",
    seoDescriptionEn: "",
    canonicalOverrideHu: "",
    canonicalOverrideEn: "",
    noIndex: false,
  },
}));

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

const programItems: SeedDocument[] = hu.program.days.flatMap((day, dayIndex) =>
  day.slots.map((slot, slotIndex) => {
    const enDay = en.program.days[dayIndex];
    const enSlot = enDay?.slots?.[slotIndex];
    const idPart = sanitizeForId(`${day.date}-${slot.time}-${slot.artist}`);
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
      stage: slot.stage === "main" ? "Main Stage" : "Club Stage",
      category: "",
      order: dayIndex * 100 + slotIndex + 1,
      isActive: true,
    };
  }),
);

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
  performers,
  pages,
  programItems,
  accommodationItems,
  transportItems,
};

