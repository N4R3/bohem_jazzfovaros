import type { SiteContent } from "@/lib/types";
import { BASE } from "./base";
import { getLanguageSwitchUrl } from "@/lib/seo";

export const hu: SiteContent = {
  meta: {
    siteTitle: "Bohém JAZZFŐVÁROS",
    siteDescription:
      "Európa legjobb szabadtéri klasszikus jazz fesztiválja — X. Bohém JAZZFŐVÁROS, 2026. augusztus 6–9., Kecskemét, Domb Beach. 4 nap, 4 színpad, 10 ország, 120 zenész, 40 óra zene.",
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
    domain: getLanguageSwitchUrl(),
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

    /* A főoldali narancs stat-sáv szövege:
       "4 nap, 10+ ország, 120+ zenész, 40+ óra zene" */
    highlights: [
      { value: "4", label: "Nap", icon: "calendar" },
      { value: "10+", label: "Ország", icon: "globe" },
      { value: "120+", label: "Zenész", icon: "music" },
      { value: "40+", label: "Óra zene", icon: "mic" },
    ],

    lineupTeaserTitle: "Idei fellépők",
    lineupTeaserCta: "Összes fellépő",

    ctaBannerTitle: "Vedd meg a jegyed most!",
    ctaBannerSubtitle: "2026. augusztus 6–9. · Domb Beach, Kecskemét",
    ctaBannerButton: "Jegyvásárlás →",

    accompanyingProgrammesTitle: "Kísérőprogramok",
    /* A jazzfovaros.hu/programok oldal „KÍSÉRŐPROGRAMOK" szekciója alapján. */
    accompanyingProgrammes: [
      { label: "VI. JAZZFŐVÁROS jazztábor (aug. 4–9.)", url: "/tabor/" },
      { label: "Bohém JAZZFŐVÁROS Futás (szombat 10:00)", url: "/futas/" },
      { label: "Strand (a fesztiválkarszalaggal végig)" },
      { label: "Swingtánc taster órák kezdőknek (csütörtök–vasárnap)" },
      { label: "Veteránjármű-bemutató (péntek–szombat–vasárnap)" },
      { label: "Labirintus pálya (péntek–szombat–vasárnap)" },
      { label: "Társasjáték sátor (szombat)" },
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

    /* A jazzfovaros.hu/fellepok 2026-os fellépő listája (25 név).
       A részletes bio-kat a későbbi szerkesztésnél pótoljuk — most
       a név / hangszer / származás a fő adat. A struktúra azonos a
       BASE.artists-szel, csak a `genre` mezők kaphatnak HU fordítást. */
    artists: [
      { name: "Bérczesi Jazz Band", genre: "Klasszikus Jazz", bio: "", day: "friday", stage: "main", time: "18:00", origin: "Magyarország" },
      { name: "Bohém Ragtime Jazz Band", genre: "Ragtime / Klasszikus Jazz", bio: "", day: "saturday", stage: "main", time: "22:00", origin: "Kecskemét, Magyarország" },
      { name: "Bolba Éva", genre: "Jazz ének", bio: "", day: "friday", stage: "club", time: "19:00", origin: "Magyarország" },
      { name: "Clotile Yana", genre: "Jazz ének", bio: "", day: "saturday", stage: "main", time: "20:00", origin: "USA" },
      { name: "Cseh Balázs", genre: "Jazz dob", bio: "", day: "saturday", stage: "club", time: "21:00", origin: "Magyarország" },
      { name: "Dániel Balázs", genre: "Jazz zongora", bio: "", day: "sunday", stage: "main", time: "13:00", origin: "Magyarország" },
      { name: "Dennert Árpád", genre: "Klarinét / tenorszaxofon", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Magyarország" },
      { name: "Emanuele Urso \"King of Swing\"", genre: "Swing / Klasszikus Jazz", bio: "", day: "saturday", stage: "main", time: "19:00", origin: "Olaszország" },
      { name: "Farkas Norbert", genre: "Nagybőgő", bio: "", day: "friday", stage: "club", time: "17:00", origin: "Magyarország" },
      { name: "Farkas Péter \"Bubu\"", genre: "Nagybőgő", bio: "", day: "saturday", stage: "club", time: "20:00", origin: "Magyarország" },
      { name: "Festival All Stars", genre: "Nemzetközi All-Stars", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Nemzetközi" },
      { name: "Gyárfás István", genre: "Jazz gitár", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Magyarország" },
      { name: "Hungarian Jazz Embassy", genre: "Klasszikus Jazz", bio: "", day: "sunday", stage: "main", time: "14:30", origin: "Magyarország" },
      { name: "Hunter Burgamy", genre: "Banjo / Gitár", bio: "", day: "saturday", stage: "club", time: "16:30", origin: "USA" },
      { name: "Jazz Camp All Stars", genre: "Klasszikus Jazz", bio: "", day: "thursday", stage: "main", time: "19:30", origin: "Magyarország" },
      { name: "Ken Aoki", genre: "Banjo", bio: "", day: "friday", stage: "club", time: "18:00", origin: "Japán" },
      { name: "Korb Attila", genre: "Harsona / Trombita / Zongora / Ének", bio: "", day: "saturday", stage: "main", time: "23:30", origin: "Magyarország" },
      { name: "Lukács Eszter", genre: "Jazz ének", bio: "", day: "saturday", stage: "club", time: "16:00", origin: "Magyarország" },
      { name: "Nagy Iván", genre: "Jazz zongora", bio: "", day: "saturday", stage: "main", time: "23:30", origin: "Magyarország" },
      { name: "Nanna Carling", genre: "Klasszikus Jazz / Swing", bio: "", day: "sunday", stage: "main", time: "15:30", origin: "Svédország" },
      { name: "Pribojszki Mátyás", genre: "Blues / Jazz szájharmónika", bio: "", day: "friday", stage: "main", time: "21:00", origin: "Magyarország" },
      { name: "Sir Oliver Mally & Peter Schneider Duo", genre: "Blues", bio: "", day: "friday", stage: "club", time: "19:00", origin: "Ausztria / Németország" },
      { name: "Szalóky Béla", genre: "Trombita / Harsona", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Magyarország" },
      { name: "Tom White & the Mad Circus", genre: "Vintage Jazz", bio: "", day: "saturday", stage: "main", time: "18:00", origin: "Magyarország" },
      { name: "Swingtáncórák kezdőknek", genre: "Swingtánc tanóra", bio: "", day: "friday", stage: "club", time: "16:30", origin: "Nemzetközi" },
    ],
  },

  /* X. Bohém JAZZFŐVÁROS 2026 program — a 2026-os fellépő lista
     (jazzfovaros.hu/fellepok) alapján, a 2025-ös programstruktúrára
     illesztve. A pontos időrend a fesztivál közeledtével finalizálódik. */
  program: {
    title: "Programok",
    subtitle: "4 nap, 4 színpad — a részletes műsor a fesztivál közeledtével bővül",
    stageMain: "Nagysátor",
    stageClub: "Klub Színpad / Cargoport",
    days: [
      {
        label: "Csütörtök (nulladik nap)",
        date: "2026-08-06",
        slots: [
          { time: "16:30", artist: "Kapunyitás", stage: "main", duration: 30 },
          { time: "17:00", artist: "Swingtánc taster óra kezdőknek", stage: "club", duration: 60 },
          { time: "18:00", artist: "Tom White & the Mad Circus", stage: "main", duration: 60 },
          { time: "19:30", artist: "Jazz Camp All Stars", stage: "main", duration: 60 },
          { time: "20:30", artist: "Bohém Ragtime Jazz Band", stage: "main", duration: 60 },
          { time: "22:00", artist: "Esti jam session", stage: "main", duration: 60, note: "Nyitott jam session, vendégfellépőkkel" },
        ],
      },
      {
        label: "Péntek (első nap)",
        date: "2026-08-07",
        slots: [
          { time: "16:30", artist: "Ken Aoki", stage: "club", duration: 60 },
          { time: "17:00", artist: "Farkas Norbert Trio", stage: "club", duration: 60 },
          { time: "18:00", artist: "Bérczesi Jazz Band", stage: "main", duration: 60 },
          { time: "19:00", artist: "Bolba Éva", stage: "club", duration: 60 },
          { time: "19:00", artist: "Sir Oliver Mally & Peter Schneider Duo", stage: "club", duration: 60 },
          { time: "21:00", artist: "Pribojszki Mátyás", stage: "main", duration: 60 },
          { time: "21:00", artist: "Esti napijegy érvényes", stage: "club", duration: 0, note: "21:00-tól esti napijeggyel is belépsz" },
          { time: "22:00", artist: "Festival All Stars (Szalóky, Dennert, Gyárfás, …)", stage: "main", duration: 60 },
          { time: "23:30", artist: "Korb Attila & vendégei", stage: "main", duration: 60 },
        ],
      },
      {
        label: "Szombat (második nap)",
        date: "2026-08-08",
        slots: [
          { time: "10:00", artist: "Bohém JAZZFŐVÁROS Futás", stage: "club", duration: 90, note: "Start a célkapunál, 2 300 / 11 500 m / 5 × 2 300 m váltó" },
          { time: "12:00", artist: "Szólózongora (Nagy Iván)", stage: "main", duration: 60 },
          { time: "16:00", artist: "Lukács Eszter & Gyárfás István Duo", stage: "club", duration: 45 },
          { time: "16:30", artist: "Hunter Burgamy", stage: "club", duration: 60 },
          { time: "18:00", artist: "Tom White & the Mad Circus", stage: "main", duration: 60 },
          { time: "19:00", artist: "Emanuele Urso \"King of Swing\"", stage: "main", duration: 60 },
          { time: "20:00", artist: "Clotile Yana", stage: "main", duration: 60 },
          { time: "21:00", artist: "Cseh Balázs Trio", stage: "club", duration: 60 },
          { time: "21:00", artist: "Esti napijegy érvényes", stage: "club", duration: 0, note: "21:00-tól esti napijeggyel is belépsz" },
          { time: "22:00", artist: "Bohém Ragtime Jazz Band", stage: "main", duration: 60 },
          { time: "23:30", artist: "Festival All Stars (Korb, Nagy, …)", stage: "main", duration: 60 },
        ],
      },
      {
        label: "Vasárnap (harmadik nap)",
        date: "2026-08-09",
        slots: [
          { time: "10:30", artist: "Blues Duo (Sir Oliver Mally & Peter Schneider)", stage: "club", duration: 60 },
          { time: "12:30", artist: "Swingtánc taster óra — Lindy Hop", stage: "club", duration: 60 },
          { time: "13:00", artist: "Dániel Balázs Trio", stage: "main", duration: 60 },
          { time: "14:30", artist: "Hungarian Jazz Embassy", stage: "main", duration: 90 },
          { time: "15:30", artist: "Nanna Carling", stage: "main", duration: 30 },
          { time: "14:30", artist: "Best of Jazz Camp / jazztábori produkciók", stage: "main", duration: 90, note: "A VI. JAZZFŐVÁROS jazztábor résztvevői zárják a fesztivált" },
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

  /* Bohém JAZZFŐVÁROS Futás — 2026. aug. 8. szombat 10:00.
     Lebonyolító: Iustitia Egyesület. Forrás: jazzfovaros.hu/futas */
  running: {
    title: "Bohém JAZZFŐVÁROS Futás",
    subtitle: "Fuss velünk a X. fesztiválon!",
    date: BASE.running.date.hu,
    time: BASE.running.time,
    location: BASE.running.location.hu,
    description:
      "A Bohém JAZZFŐVÁROS Futás hagyományosan a fesztivál szombati napján kerül megrendezésre, 10:00 órai rajtidővel. A rajt és a cél is a fesztiválterület célkapujánál. Három táv közül választhatsz: 2 300 m, 11 500 m, vagy 5 × 2 300 m váltófutás. Nevezési díj 2 500 Ft előreutalással (aug. 7. éjfélig a Kecskeméti Jazz Alapítvány számlájára: 11732002-20302115), vagy 3 000 Ft a helyszínen készpénzben, illetve bankkártyával. Öltöző és ruhamegőrzés biztosított. Minden nevező a verseny logójával ellátott pólót kap, a célban harapnivaló és ásványvíz vár.",
    distances: BASE.running.distances,
    entryUrl: BASE.running.entryUrl,
    entryLabel: "Online nevezés →",
    entryDeadline: BASE.running.entryDeadline.hu,
    resultsNote:
      "Eredményhirdetés várható időpontja: 2026. aug. 8., szombat 11:55, a Nagysátornál. Abszolút kategóriában távonként és nemenként (váltóban a vegyescsapatok miatt egységesen) az 1–3. helyezettek érmet kapnak. Külön elismerésre kerül a legfiatalabb és legidősebb induló is!",
    image: BASE.running.image,
    contactEmail: BASE.running.contactEmail,
    contactPhone: BASE.running.contactPhone,
    contactUrl: BASE.running.contactUrl,
    freeTicketNote:
      "A Bohém JAZZFŐVÁROS Futás minden résztvevője INGYENES BELÉPŐT kap a szombati fesztiválprogramra!",
  },

  /* VI. JAZZFŐVÁROS jazztábor — 2026. aug. 4-9.
     Helyszín: Neumann János Egyetem (légkondicionált termek).
     Énekes és hangszeres kurzusok + swingtánc kurzusok párhuzamosan.
     Forrás: jazzfovaros.hu/jazztabor */
  camp: {
    title: "VI. JAZZFŐVÁROS jazztábor",
    subtitle: "2026. augusztus 4–9. · Neumann János Egyetem, Kecskemét",
    description:
      "A klasszikus (régi, táncolható) jazz iránt érdeklődőket várjuk teljesen kezdőktől a haladókig, korhatár nélkül. Hangszeres vagy énekesi előképzettség (pl. zeneiskola) szükséges, de várunk érdeklődő passzív résztvevőket is! A tábor résztvevői 5 × 40 perc egyéni órát kapnak, délutánonként közös zenekari gyakorlattal. A fesztivál utolsó napján a jazztábor legjobb produkciói zárják a JAZZFŐVÁROS műsorát a Nagysátorban. A tábort a Pepita Egyesület és a Neumann János Egyetem szervezi, a swingtánckurzusokat aug. 6-8. között a Pepita Egyesület koordinálja.",
    videoUrl: BASE.camp.videoUrl,
    scheduleTitle: "Tanárok és program (2026)",
    schedule: [
      {
        day: "Énekes és hangszeres kurzusok (aug. 4–9.)",
        items: [
          "ÉNEK: Bolba Éva, Lukács Eszter",
          "GITÁR: Gyárfás István, Rieger Attila",
          "DOB: Cseh Balázs, Gulyás-Szabó Krisztián",
          "ZONGORA: Nagy Iván, Korb Attila",
          "NAGYBŐGŐ: Farkas Péter „Bubu\"",
          "KLARINÉT / SZAXOFON: Dennert Árpád, Korb Attila",
          "TROMBITA / HARSONA / TUBA: Korb Attila",
          "HEGEDŰ, TÁBORVEZETŐ: Ittzés Tamás",
        ],
      },
      {
        day: "Kurzusdíjak és fesztiválbelépők",
        items: [
          "Énekes / hangszeres kurzus (kurzusonként): 50 000 Ft",
          "Swingtánc kurzusok: jelentkezés és ár május közepétől",
          "Kedvezményes jazztáboros fesztiválbelépő (kuponkóddal): 19 900 Ft",
          "Kecskeméti lakosoknak (6000–6050 irsz.): 16 900 Ft",
          "Általános iskolásoknak: 7 900 Ft",
          "Kecskeméti általános iskolásoknak (kóddal): ingyenes",
        ],
      },
      {
        day: "Napi menetrend (jellemző kurzusnap)",
        items: [
          "9:30–12:50 — egyéni órák (hangszer / ének)",
          "12:00–14:00 — ebéd (egyetemi büfé)",
          "14:30–18:00 — közös zenekari gyakorlat",
          "18:00–20:00 — vacsora (egyetem vagy fesztiválhelyszín)",
          "19:30–23:00 — esti közös jam session, filmvetítés",
        ],
      },
      {
        day: "Záró nap — aug. 9. (vasárnap)",
        items: [
          "9:30–11:00 — zenekari gyakorlat",
          "9:30–16:00 — a fesztivál vasárnapi programja",
          "14:30–16:00 — jazztábori produkciók bemutatkozása a Nagysátorban (a JAZZFŐVÁROS zárófellépése)",
        ],
      },
    ],
    entryUrl: BASE.camp.entryUrl,
    entryLabel: "Jelentkezés a jazztáborra →",
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
