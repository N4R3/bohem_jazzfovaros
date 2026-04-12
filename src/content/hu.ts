import type { SiteContent } from "@/lib/types";
import { BASE } from "./base";
import { ALT_URL } from "@/lib/seo";

export const hu: SiteContent = {
  meta: {
    siteTitle: "Bohém Jazzfőváros",
    siteDescription:
      "Európa legjobb szabadtéri klasszikus jazz fesztiválja. 4 nap, több színpad, 10 ország zenészei, Kecskemét, Domb Beach.",
    festivalDates: BASE.festivalDates.hu,
    festivalYear: BASE.festivalYear,
    venue: BASE.venue.hu,
    city: BASE.city.hu,
  },

  nav: [
    { label: "Főoldal", href: "/" },
    { label: "Fellépők", href: "/lineup/" },
    { label: "Programok", href: "/program/" },
    { label: "Jegyek & Infó", href: "/info/" },
    { label: "Szállás", href: "/szallas/" },
    { label: "Térkép", href: "/terkep/" },
    { label: "Galéria", href: "/gallery/" },
    { label: "Jazztábor", href: "/tabor/" },
    { label: "Futás", href: "/futas/" },
    { label: "Kapcsolat", href: "/contact/" },
  ],

  otherLocale: {
    label: "EN",
    domain: ALT_URL,
  },

  home: {
    heroTitle: "Bohém Jazzfőváros",
    heroSubtitle: "Kecskemét, Domb Beach · 2026. augusztus 6–9.",
    heroCta: "Jegyvásárlás",
    heroDateLine: "2026. augusztus 6–9. · Domb Beach, Kecskemét",
    videoUrl: BASE.videoUrl,
    videoTitle: "Bohém Jazzfőváros — Fesztivál videó",

    quickLinks: [
      {
        label: "Jegyvásárlás",
        description: "Bérletek és napijegyek online",
        href: "/info/",
        icon: "ticket",
      },
      {
        label: "Térkép & Közlekedés",
        description: "Helyszín, parkolás, megközelítés",
        href: "/terkep/",
        icon: "map",
      },
      {
        label: "Szállás",
        description: "Szállodák és kemping a helyszín közelében",
        href: "/szallas/",
        icon: "hotel",
      },
    ],

    highlights: [
      { value: "4", label: "Nap", icon: "calendar" },
      { value: "10+", label: "Ország", icon: "globe" },
      { value: "120+", label: "Zenész", icon: "mic" },
      { value: "40+", label: "Óra zene", icon: "music" },
    ],

    lineupTeaserTitle: "Idei fellépők",
    lineupTeaserCta: "Összes fellépő",

    ctaBannerTitle: "Vedd meg a jegyed most!",
    ctaBannerSubtitle: "2026. augusztus 6–9. · Domb Beach, Kecskemét",
    ctaBannerButton: "Jegyvásárlás →",

    accompanyingProgrammesTitle: "Kísérőprogramok",
    accompanyingProgrammes: [
      { label: "Jazz Tábor (aug. 5–10.)", url: "https://pepitasummerswing.hu" },
      { label: "Jazzfőváros Futás (szombat 16:00)", url: "/futas/" },
      { label: "Strand (9:00–20:00, fesztiválkarszalaggal ingyenes)" },
      { label: "Veteránautó-show (péntek–szombat–vasárnap)" },
      { label: "Labirintus futás (péntek–szombat–vasárnap)" },
      { label: "Sárkányhajó (szombat)" },
      { label: "Társasjátékok (szombat)" },
    ],
  },

  lineup: {
    title: "Fellépők",
    subtitle: "Hazai és nemzetközi előadók egy helyen",
    filterAll: "Mindenki",
    filterThursday: "Csütörtök",
    filterFriday: "Péntek",
    filterSaturday: "Szombat",
    filterSunday: "Vasárnap",
    stageMain: "Főszínpad",
    stageClub: "Klub Színpad",

    artists: [
      {
        name: "Dresch Mihály Quartet",
        genre: "Magyar Jazz",
        bio: "Dresch Mihály szaxofonos a magyar jazz egyik legnagyobb alakja. Zenéjében a bartóki örökség és a free jazz szabadsága találkozik.",
        image: "/images/artists/dresch.jpg",
        day: "friday",
        stage: "main",
        time: "21:00",
        origin: "Budapest, Magyarország",
      },
      {
        name: "Tigran Hamasyan",
        genre: "Contemporary Jazz",
        bio: "Az örmény zongorista páratlanul összeköti a kortárs jazzet a kaukázusi népzenével. Lenyűgöző technikai tudás és mélységes érzelmek.",
        image: "/images/artists/tigran.jpg",
        day: "saturday",
        stage: "main",
        time: "22:00",
        origin: "Jerevány, Örményország",
      },
      {
        name: "Borbély Mihály",
        genre: "World Jazz",
        bio: "Borbély Mihály fúvós hangszerein a világ zenéinek sokszínűsége szólal meg: népi dallamok, jazz és keleti hatások egyedülálló elegyben.",
        image: "/images/artists/borbely.jpg",
        day: "friday",
        stage: "club",
        time: "19:30",
        origin: "Magyarország",
      },
      {
        name: "GoGo Penguin",
        genre: "Jazz / Electronic",
        bio: "A manchesteri trió a jazz hagyományát az elektronikus zene energiájával ötvözi. Pörgős, városias hangzás, amit egyszer sem lehet elfelejteni.",
        image: "/images/artists/gogopenguin.jpg",
        day: "saturday",
        stage: "main",
        time: "20:00",
        origin: "Manchester, Egyesült Királyság",
      },
      {
        name: "Roby Lakatos & Ensemble",
        genre: "Gypsy Jazz / Classical",
        bio: "A legendás hegedűvirtuóz lenyűgöző technikával és végtelen szenvedéllyel szólaltatja meg a cigányzenét és a klasszikus repertoárt.",
        image: "/images/artists/roby.jpg",
        day: "sunday",
        stage: "main",
        time: "20:30",
        origin: "Budapest, Magyarország",
      },
      {
        name: "Nils Petter Molvær",
        genre: "Nordic Jazz / Fusion",
        bio: "A norvég trombitás hangzásvilága hidak közt lebeg: jazz, elektronika és ambient zenei elemek egyedülálló koktélja.",
        image: "/images/artists/molvaer.jpg",
        day: "sunday",
        stage: "main",
        time: "22:00",
        origin: "Oslo, Norvégia",
      },
      {
        name: "Grencsó Kollektíva",
        genre: "Free Jazz / Avantgárd",
        bio: "Grencsó István szaxofonos kollektívája a szabad improvizáció bajnokaként él a köztudatban — vakmerő, kísérletező, egyedülálló.",
        image: "/images/artists/grenco.jpg",
        day: "saturday",
        stage: "club",
        time: "21:30",
        origin: "Budapest, Magyarország",
      },
      {
        name: "Cory Henry & The Funk Apostles",
        genre: "Soul Jazz / Funk",
        bio: "Az orgonista-énekes Cory Henry olyan intenzitással és spiritualitással tölt meg egy termet, mint a legjobb gospel-prédikátorok.",
        image: "/images/artists/cory.jpg",
        day: "friday",
        stage: "main",
        time: "22:30",
        origin: "New York, USA",
      },
    ],
  },

  program: {
    title: "Programok",
    subtitle: "4 nap, több színpad — tervezzük együtt a fesztivált",
    stageMain: "Főszínpad",
    stageClub: "Klub Színpad",
    days: [
      {
        label: "Csütörtök",
        date: "2026-08-06",
        slots: [
          { time: "18:00", artist: "Kapunyitó", stage: "main", duration: 60 },
          { time: "20:00", artist: "Fellépő (hamarosan)", stage: "main", duration: 90 },
        ],
      },
      {
        label: "Péntek",
        date: "2026-08-07",
        slots: [
          { time: "17:00", artist: "Borbély Mihály", stage: "club", duration: 75 },
          { time: "19:30", artist: "Dresch Mihály Quartet", stage: "main", duration: 90 },
          { time: "21:00", artist: "Cory Henry & The Funk Apostles", stage: "main", duration: 90 },
          { time: "21:00", artist: "Esti napijegy érvényes", stage: "club", duration: 0, note: "21:00-tól esti napijeggyel is beléphetők" },
        ],
      },
      {
        label: "Szombat",
        date: "2026-08-08",
        slots: [
          { time: "10:00", artist: "Jazzfőváros Futás", stage: "club", duration: 60 },
          { time: "18:00", artist: "GoGo Penguin", stage: "main", duration: 90 },
          { time: "20:00", artist: "Grencsó Kollektíva", stage: "club", duration: 75 },
          { time: "21:00", artist: "Tigran Hamasyan", stage: "main", duration: 90 },
          { time: "21:00", artist: "Esti napijegy érvényes", stage: "club", duration: 0, note: "21:00-tól esti napijeggyel is beléphetők" },
        ],
      },
      {
        label: "Vasárnap",
        date: "2026-08-09",
        slots: [
          { time: "16:00", artist: "Jam Session", stage: "club", duration: 120 },
          { time: "19:30", artist: "Roby Lakatos & Ensemble", stage: "main", duration: 90 },
          { time: "21:00", artist: "Nils Petter Molvær", stage: "main", duration: 90 },
        ],
      },
    ],
  },

  info: {
    title: "Jegyek & Infó",
    subtitle: "Minden tudnivaló a fesztiválról",
    ticketCta: "Jegyvásárlás bankkártyával",
    ticketUrl: BASE.ticketUrl,

    ticketTiers: [
      { label: "Super Early Bird bérlet (első 200 vásárlónak ajándék fesztiválszékkel)", price: "19 900 Ft", highlight: true },
      { label: "Early Bird bérlet", price: "19 900 Ft" },
      { label: "Lazy Bird bérlet", price: "24 900 Ft" },
      { label: "4 napos bérlet (márc. 31-ig Early Bird, jún. 30-ig Lazy Bird)", price: "29 900 Ft" },
      { label: "4 napos VIP-bérlet (étel-ital fogyasztással a VIP-sátorban)", price: "59 900 Ft" },
      { label: "Bérlet kecskemétieknek (6000–6050 irányítószám)", price: "16 900 Ft" },
      { label: "Diákbérlet (7–18 éves kor)", price: "7 900 Ft" },
      { label: "Napijegy – csütörtök", price: "5 900 Ft" },
      { label: "Napijegy – péntek", price: "9 900 Ft" },
      { label: "Napijegy – szombat", price: "11 900 Ft" },
      { label: "Napijegy – vasárnap", price: "3 900 Ft" },
      { label: "Esti napijegy (péntek–szombat, 21:00 után)", price: "4 900 Ft" },
    ],

    ticketNote:
      "A belépő minden esetben egy karszalag, amit a helyszínen kapsz meg az elővásárláskor kapott számlád ellenében. A belépés 6 éves korig felnőtt kíséretével ingyenes — gyerekeknek ne vegyél belépőt! (6 évesnek az számít, aki 2020. augusztus 9. után született.) OTP SZÉP-kártyával a fesztivál alatt a II. kapunál a fesztiválirodában tudsz fizetni. A helyszínen is tudsz jegyet venni (I. és II. kapu, valamint fesztiváliroda). Figyelem: ételt és italt behozni tilos!",

    sections: [
      {
        title: "Helyszín",
        body: "Domb Beach (Benkó Zoltán Szabadidőközpont), Kecskemét, Csabay Géza körút — a kórház és a Kecskeméti Fürdő között. A fesztiválterületre két kapun lehet belépni: az I. kapu CSAK 9:00–20:00 között van nyitva; a II. kapu folyamatosan nyitva tart. GPS: 46.903819, 19.666032",
      },
      {
        title: "Belépés és biztonság",
        body: "Érvényes jegy vagy bérlet szükséges a belépéshez. A belépő egy karszalag, amit a helyszínen kapsz meg. Ételt és italt behozni tilos — a bejáratnál a biztonsági személyzet ellenőrizheti a táskádat. SZÉP-kártyás fizetés a fesztivál alatt a II. kapunál lehetséges.",
      },
    ],

    faq: [
      {
        question: "6 éves korig ingyenes a belépés?",
        answer: "Igen, a belépés 6 éves korig felnőtt kíséretével ingyenes. 6 évesnek az számít, aki a fesztivál idején még nem töltötte be a 7. évét (vagyis 2020. aug. 9. után született). Gyerekeknek tehát ne vegyél belépőt!",
      },
      {
        question: "Van ételkínálat a helyszínen?",
        answer: "Igen, a fesztivál területén street food standok és italbárok várják a látogatókat. Ételt és italt behozni tilos.",
      },
      {
        question: "Hogyan juthatok el Kecskemétre?",
        answer: "Autóval az M5-ös autópályán, vonattal Budapest-Keleti állomásról, busszal Stadion autóbusz-állomásról. A helyszín a vasút- és buszállomástól a 21-es vagy 22-es helyi busszal közelíthető meg.",
      },
      {
        question: "Mikor van nyitva az I. kapu?",
        answer: "Az I. kapu (strandbejárat felőli) CSAK 9:00–20:00 között van nyitva. A II. kapu folyamatosan nyitva tart.",
      },
      {
        question: "SZÉP-kártyával lehet fizetni?",
        answer: "Igen, OTP SZÉP-kártyával a fesztivál alatt a II. kapunál, a fesztiválirodában lehet jegyet vásárolni.",
      },
      {
        question: "Mi az a karszalag-belépő?",
        answer: "A vásárolt jegy egy karszalagra vált, amit a helyszíni fesztiválirodánál kapsz meg az elővételben kapott bizonylatod ellenében. Ez a karszalag érvényes belépőként a fesztivál teljes időtartama alatt.",
      },
    ],
  },

  gallery: {
    title: "Galéria",
    subtitle: "Képek a korábbi évekből",
    images: [
      { src: "/images/gallery/01.jpg", alt: "Főszínpad estei fény" },
      { src: "/images/gallery/02.jpg", alt: "Közönség a Domb Beach-en" },
      { src: "/images/gallery/03.jpg", alt: "Trombitás szóló" },
      { src: "/images/gallery/04.jpg", alt: "Klub Színpad hangulat" },
      { src: "/images/gallery/05.jpg", alt: "Naplemente és zene" },
      { src: "/images/gallery/06.jpg", alt: "Dobos a reflektorfényben" },
      { src: "/images/gallery/07.jpg", alt: "Zongora közelkép" },
      { src: "/images/gallery/08.jpg", alt: "Közönség tapsol" },
      { src: "/images/gallery/09.jpg", alt: "Kecskeméti skyline" },
      { src: "/images/gallery/10.jpg", alt: "Bőgős a színpadon" },
      { src: "/images/gallery/11.jpg", alt: "Szaxofon szóló" },
      { src: "/images/gallery/12.jpg", alt: "Fesztivál hangulat" },
    ],
  },

  contact: {
    title: "Kapcsolat",
    subtitle: "Írjon nekünk",
    organizer: BASE.contact.organizer.hu,
    address: BASE.contact.address.hu,
    email: BASE.contact.email,
    phone: BASE.contact.phone,
    phone2: BASE.contact.phone2,
    phone2Name: BASE.contact.phone2NameHu,
    volunteerText: "Önkéntes szeretnél lenni a fesztiválon? Töltsd ki a kérdőívet!",
    volunteerUrl: BASE.contact.volunteerUrl,
    pressEmail: BASE.contact.pressEmail,
    pressTitle: "Sajtó & Akkreditáció",
    pressText:
      "Sajtóbelépő igényedet név, média, email és mobilszám megadásával a sajt@bohemragtime.com email-címen jelezd 2026. július 31-ig. A fellépőkkel készített interjúk iránti igényeket is lehetőleg ugyaneddig kérjük jelezni, hogy időben egyeztethessük.",
    socials: BASE.socials,
  },

  accommodation: {
    title: "Szállás",
    subtitle: "Szállodák és kemping a fesztivál közelében",
    note: "Fesztiválszálloda: az árak reggelivel értendők, az idegenforgalmi adó nem tartalmazzák (400 Ft/fő/éj, 18 éves kortól). Foglalj minél hamarabb — a fesztivál idején korlátozott a szabad szobák száma.",
    hotels: [
      {
        name: "Four Points by Sheraton Kecskemét",
        description: "A JAZZFŐVÁROS fesztiváljának hivatalos szállodája. Az Aqua Sportcentrum és a Sheraton Opera szomszédságában, a fesztivál helyszínétől 15 perc sétára. Közvetlen foglalásnál kedvezményes fesztiválár: 19 950 Ft/fő/éjtől. A szobák foglalhatók a szálloda weboldalán a JAZZFŐVÁROS kódszóval.",
        price: BASE.accommodation.hotels[0].price.hu,
        distance: BASE.accommodation.hotels[0].distance.hu,
        bookingUrl: BASE.accommodation.hotels[0].bookingUrl,
        bookingLabel: "Foglalás →",
        images: BASE.accommodation.hotels[0].images,
        stars: 4,
      },
      {
        name: "Hotel Aqua",
        description: "A fesztiválhoz legközelebb lévő szálloda — mindössze 5 perc sétára a Domb Beach-től. Ingyenes parkolás, reggeli, klíma. Szobafoglalás a JAZZFŐVÁROS weboldalán keresztül is lehetséges kedvezményes áron.",
        price: BASE.accommodation.hotels[1].price.hu,
        distance: BASE.accommodation.hotels[1].distance.hu,
        bookingUrl: BASE.accommodation.hotels[1].bookingUrl,
        bookingLabel: "Foglalás →",
        images: BASE.accommodation.hotels[1].images,
        stars: 3,
      },
      {
        name: "Tó Kemping",
        description: "Kemping közvetlenül a fesztivál helyszíne mellett — sátorozásra és lakóautóra egyaránt. Recepció: 9:00–13:00, de sátor bármikor felverhet. Idegenforgalmi adó: 400 Ft/fő/éj.",
        price: "Kemping árak regisztráció alapján",
        distance: BASE.accommodation.hotels[2].distance.hu,
        bookingUrl: BASE.accommodation.hotels[2].bookingUrl,
        bookingLabel: "tokemping.hu →",
        images: BASE.accommodation.hotels[2].images,
        stars: undefined,
      },
    ],
  },

  map: {
    title: "Térkép & Közlekedés",
    subtitle: "Hogyan jutsz el a Domb Beach-re?",
    mapImage: BASE.mapImage,
    mapNote: "Fesztiváltérkép — figyeld a kapunyitási időket! Az I. kapu (strandbejárat felőli) CSAK 9:00–20:00 között van nyitva, a II. kapu folyamatosan nyitva tart.",
    gps: BASE.gps,
    directions: [
      {
        mode: "Autóval",
        icon: "car",
        text: "M5-ös autópályáról Kecskemét-Centrum/Lajosmizse vagy Kecskemét-Nyugat kijáratnál. Parkolás a hátsó kapunál, a fesztiválterületen belül. GPS: 46.903819, 19.666032",
      },
      {
        mode: "Vonattal",
        icon: "train",
        text: "Budapest-Keleti pályaudvarról vonattal Kecskemét állomásra, majd az állomás mellett lévő buszállomásról a 21-es (egész óránként) vagy 22-es (félóránként) busszal az SZTK megállóig — onnan 5 perc séta. Menetrend: menetrend.kecskemet.hu",
      },
      {
        mode: "Busszal",
        icon: "bus",
        text: "Budapest Stadion autóbusz-állomásról távolsági busszal Kecskemét állomásra, majd helyi busszal (21-es vagy 22-es). A vonat- és buszállomás egymás mellett van. Távolsági menetrend: menetrendek.hu",
      },
      {
        mode: "Autóbusszal (helyi)",
        icon: "bus",
        text: "A kecskeméti vasútállomásról a 21-es helyi busz egész óránként, a 22-es félóránként indul. Le kell szállni az SZTK megállónál, onnan 5 perc a fesztiválra.",
      },
    ],
  },

  running: {
    title: "Jazzfőváros Futás",
    subtitle: "Fuss velünk a fesztiválon!",
    date: BASE.running.date.hu,
    time: BASE.running.time,
    location: BASE.running.location.hu,
    description: "A Jazzfőváros Futás hagyományosan a fesztivál szombati napján kerül megrendezésre. Részvétel online előregisztrációval, vagy a fesztiválirodában (JAZZFŐVÁROS – futás jelzéssel) lehetséges. Nevezési díj: 2 500 Ft, vagy 2 500 Ft értékű egészségügyi szolgáltatáshoz szükséges pontjegy. Gyerekek ingyenesen vehetnek részt. Öltöző és zuhanyozó lehetőség rendelkezésre áll.",
    distances: BASE.running.distances,
    entryUrl: BASE.running.entryUrl,
    entryLabel: "Online nevezés →",
    entryDeadline: BASE.running.entryDeadline.hu,
    resultsNote: "Az eredményhirdetés várható ideje: 2025. aug. 9., szombat 11:25, a Nagyvárosligetnél. A Jazzfőváros Futás résztvevői INGYENES BELÉPŐT kapnak a szombati programra!",
    image: BASE.running.image,
    contactEmail: BASE.running.contactEmail,
    contactPhone: BASE.running.contactPhone,
    contactUrl: BASE.running.contactUrl,
    freeTicketNote: "A futás résztvevői INGYENES BELÉPŐT kapnak a szombati fesztiválprogramra!",
  },

  camp: {
    title: "Jazztábor",
    subtitle: "Bohém Jazz Tábor · 2026. augusztus 5–10.",
    description: "A Jazztábor a Jazzfőváros fesztiválhoz kapcsolódó, egész napos zenei és táncos eseménysorozat. Jazz, swing és lindy hop workshop-ok, fellépések és közös programok jellemzik. A tábor a fesztiválhelyszínen és annak közelében kerül megrendezésre.",
    videoUrl: BASE.camp.videoUrl,
    scheduleTitle: "Tábor program (tájékoztató jellegű)",
    schedule: [
      {
        day: "Augusztus 5. (szerda) – Augusztus 6. (csütörtök)",
        items: [
          "Workshop-ok érkezési nap (swing, lindy hop, jazz improvizáció)",
          "Közös vacsora és esti jam session",
        ],
      },
      {
        day: "Augusztus 7. (péntek) – Augusztus 8. (szombat)",
        items: [
          "Nappali workshop-ok a helyszínen",
          "Fesztiválfellépések megtekintése",
          "Éjszakai táncprogramok",
        ],
      },
      {
        day: "Augusztus 9. (vasárnap) – Augusztus 10. (hétfő)",
        items: [
          "Záró workshop-ok",
          "Közös búcsúfellépés",
          "Indulási nap",
        ],
      },
    ],
    entryUrl: BASE.camp.entryUrl,
    entryLabel: "Regisztráció a Jazztáborra →",
    supporters: BASE.camp.supporters,
  },

  terms: {
    title: "Általános Szerződési Feltételek",
    body: `A JAZZFŐVÁROS Kft. (továbbiakban: szervező) az általa szervezett rendezvényekre minden egyes személy belépésére, a fesztiválra bevitt személyes tárgyakra, a fesztivál területén tartózkodásra vonatkozó általános feltételeket az alábbiak szerint határozza meg.

A www.jazzfovaros.hu oldalon belépőjegyet vásárolni kizárólag a felhasználási feltételek elfogadása esetén lehetséges. A www.bartix.hu honlapba integrált szolgáltatás miatt a Cookie-kt nem lehet elutasítani.

A belépőjegy megvásárlásával és/vagy a fesztiválterületre való belépéssel a látogató elfogadja az alábbi feltételeket:

1. A belépő személyre szóló és át nem ruházható.
2. A belépő érvényességének ellenőrzése a belépéskor megtörténik.
3. Elvesztett, ellopott vagy megrongálódott belépőért a szervező nem vállal felelősséget.
4. A fesztiválterületre étel és ital behozatala tilos.
5. A szervező fenntartja a jogot arra, hogy a rendezvény rendjét veszélyeztető személyeket a területről eltávolítsa.
6. A fesztiválon készített felvételek (fotó, videó) nyilvános közzétételéhez a szervező engedélye szükséges.
7. A szervező vis major esetén (természeti katasztrófa, hatósági intézkedés stb.) nem felelős az elmaradt rendezvény miatti károkért.

A JAZZFŐVÁROS fesztiválon részt vevő személyek beleegyeznek abba, hogy a rendezvényen róluk készült fotó- és videófelvételeket a szervező felhasználhatja marketing célokra.`,
  },

  sponsors: BASE.sponsors,

  footer: {
    copyright: "© 2026 JAZZFŐVÁROS Kft. Minden jog fenntartva.",
    tagline: "Csatlakozzon hozzánk közösségi oldalainkon!",
    navLabel: "Navigáció",
    legalLinks: [
      { label: "Adatvédelem", href: "/adatvedelem/" },
      { label: "Jogi nyilatkozat", href: "/jogi-nyilatkozat/" },
      { label: "Impresszum", href: "/impresszum/" },
      { label: "ÁSZF", href: "/aszf/" },
    ],
    paymentNote: "Fizetési lehetőségek",
    builtBy: BASE.builtBy,
    builtByUrl: BASE.builtByUrl,
  },
};
