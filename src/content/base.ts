import type {
  GalleryImage,
  RunningDistance,
  Sponsor,
  SponsorSection,
} from "@/lib/types";

export const BASE = {
  festivalDates: {
    hu: "2026. augusztus 6–9.",
    en: "Aug 6–9, 2026",
  },
  festivalYear: "2026",
  venue: {
    hu: "Domb Beach (Benkó Zoltán Szabadidőközpont)",
    en: "Domb Beach (Benkó Zoltán Recreation Centre)",
  },
  city: {
    hu: "Kecskemét",
    en: "Kecskemét, Hungary",
  },
  gps: "46.903819, 19.666032",
  mapImage: "/images/gallery/article-upload/7/901a43ed59ac4878d276b1b8a5b20640.jpg",

  ticketUrl: "https://jazzfovaros.jegy.hu",
  ticketUrlEn: "https://jazzfovaros.jegy.hu",

  socials: {
    facebook: "https://www.facebook.com/jazzfovaros",
    instagram: "https://www.instagram.com/jazzfovaros",
    youtube: "https://www.youtube.com/@jazzfovaros",
  },

  videoUrl: "https://youtu.be/4gGiiNwHe6E?si=oWmWHfA1osnkVOn9",

  contact: {
    organizer: {
      hu: "JAZZFŐVÁROS Zenei Előadóművészeti és Rendezvényszervező Kft.",
      en: "JAZZ CAPITAL Ltd (JAZZFŐVÁROS Kft.)",
    },
    address: {
      hu: "6000 Kecskemét, Csabagyöngye u. 71.",
      en: "H-6000 Kecskemét, Csabagyöngye u. 71., Hungary",
    },
    email: "jazzfovaros@gmail.com",
    phone: "+36-20-960-7169",
    phone2: "+36-20-336-4620",
    phone2NameHu: "Adrienn",
    phone2En: "+36-20-369-2111",
    phone2NameEn: "Mariann",
    pressEmail: "sajt@bohemragtime.com",
    volunteerUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScN6dywhAxewWQfWvLtzphyTZ0NP75pFnmbO3nIbAfumbi6ZQ/viewform",
  },

  builtBy: "Mayoka",
  builtByUrl: "http://mayoka.hu",

  /* 2026-os fellépő lista a jazzfovaros.hu/fellepok oldalról.
     Klasszikus / bohém / swing jazz fókusz. Hangszer-rövidítések:
     voc=vokál, dr=dob, p=zongora, cl=klarinét, ts=tenorszaxofon,
     sb=nagybőgő, g=gitár, bj=bendzsó, tp=trombita, tb=harsona,
     bs=barion sax. Ország: H=Magyarország, USA, I=Olaszország,
     J=Japán, S=Svédország, A=Ausztria, D=Németország, NL=Hollandia,
     B=Belgium, INT=nemzetközi all-stars. */
  artists: [
    { name: "Bérczesi Jazz Band", genre: "Classic Jazz", bio: "", day: "friday", stage: "main", time: "18:00", origin: "Magyarország", image: "/images/gallery/bands/7087.jpg" },
    { name: "Bohém Ragtime Jazz Band", genre: "Ragtime / Classic Jazz", bio: "", day: "saturday", stage: "main", time: "22:00", origin: "Magyarország", image: "/images/gallery/bands/1500.jpg" },
    { name: "Bolba Éva", genre: "Jazz Vocal", bio: "", day: "friday", stage: "club", time: "19:00", origin: "Magyarország", image: "/images/gallery/bands/4202.jpg" },
    { name: "Clotile Yana", genre: "Jazz Vocal", bio: "", day: "saturday", stage: "main", time: "20:00", origin: "USA", image: "/images/gallery/bands/9530.jpg" },
    { name: "Cseh Balázs", genre: "Jazz Drums", bio: "", day: "saturday", stage: "club", time: "21:00", origin: "Magyarország", image: "/images/gallery/bands/9793.jpg" },
    { name: "Dániel Balázs", genre: "Jazz Piano", bio: "", day: "sunday", stage: "main", time: "13:00", origin: "Magyarország", image: "/images/gallery/bands/5344.jpg" },
    { name: "Dennert Árpád", genre: "Clarinet / Tenor Sax", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Magyarország", image: "/images/gallery/bands/6119.jpg" },
    { name: "Emanuele Urso \"King of Swing\"", genre: "Swing / Classic Jazz", bio: "", day: "saturday", stage: "main", time: "19:00", origin: "Olaszország", image: "/images/gallery/bands/3514.jpg" },
    { name: "Farkas Norbert", genre: "Double Bass", bio: "", day: "friday", stage: "club", time: "17:00", origin: "Magyarország", image: "/images/gallery/bands/2959.jpg" },
    { name: "Farkas Péter \"Bubu\"", genre: "Double Bass", bio: "", day: "saturday", stage: "club", time: "20:00", origin: "Magyarország", image: "/images/gallery/bands/7811.jpg" },
    { name: "Festival All Stars", genre: "International All-Stars", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Nemzetközi", image: "/images/gallery/bands/8532.jpg" },
    { name: "Gyárfás István", genre: "Jazz Guitar", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Magyarország", image: "/images/gallery/bands/9936.jpg" },
    { name: "Hungarian Jazz Embassy", genre: "Classic Jazz", bio: "", day: "sunday", stage: "main", time: "14:30", origin: "Magyarország", image: "/images/gallery/bands/1568.jpg" },
    { name: "Hunter Burgamy", genre: "Banjo / Guitar", bio: "", day: "saturday", stage: "club", time: "16:30", origin: "USA", image: "/images/gallery/bands/5961.jpg" },
    { name: "Jazz Camp All Stars", genre: "Classic Jazz", bio: "", day: "thursday", stage: "main", time: "19:30", origin: "Magyarország", image: "/images/gallery/bands/8080.jpg" },
    { name: "Ken Aoki", genre: "Banjo", bio: "", day: "friday", stage: "club", time: "18:00", origin: "Japán", image: "/images/gallery/bands/7074.jpg" },
    { name: "Korb Attila", genre: "Trombone / Trumpet / Piano / Vocal", bio: "", day: "saturday", stage: "main", time: "23:30", origin: "Magyarország", image: "/images/gallery/bands/4007.jpg" },
    { name: "Lukács Eszter", genre: "Jazz Vocal", bio: "", day: "saturday", stage: "club", time: "16:00", origin: "Magyarország", image: "/images/gallery/bands/6878.jpg" },
    { name: "Nagy Iván", genre: "Jazz Piano", bio: "", day: "saturday", stage: "main", time: "23:30", origin: "Magyarország", image: "/images/gallery/bands/5231.jpg" },
    { name: "Nanna Carling", genre: "Classic Jazz / Swing", bio: "", day: "sunday", stage: "main", time: "15:30", origin: "Svédország", image: "/images/gallery/bands/3845.jpg" },
    { name: "Pribojszki Mátyás", genre: "Blues / Jazz Harmonica", bio: "", day: "friday", stage: "main", time: "21:00", origin: "Magyarország", image: "/images/gallery/bands/8519.jpg" },
    { name: "Sir Oliver Mally & Peter Schneider Duo", genre: "Blues", bio: "", day: "friday", stage: "club", time: "19:00", origin: "Ausztria / Németország", image: "/images/gallery/bands/5444.jpg" },
    { name: "Szalóky Béla", genre: "Trumpet / Trombone", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Magyarország", image: "/images/gallery/bands/1789.jpg" },
    { name: "Tom White & the Mad Circus", genre: "Vintage Jazz", bio: "", day: "saturday", stage: "main", time: "18:00", origin: "Magyarország", image: "/images/gallery/bands/4208.jpg" },
    { name: "Swingtáncórák kezdőknek", genre: "Swing Dance Lesson", bio: "", day: "friday", stage: "club", time: "16:30", origin: "Nemzetközi", image: "/images/gallery/bands/6362.jpg" },
  ],

  galleryImages: [
    { src: "/images/gallery/menu/1296-2624.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1300-9865.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1302-6642.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1311-5581.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1315-7264.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1333-6769.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1335-9925.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1339-3453.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1353-3892.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1359-1595.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1360-5339.png", alt: "JAZZFŐVÁROS galéria" },
    { src: "/images/gallery/menu/1364-4060.png", alt: "JAZZFŐVÁROS galéria" },
  ] as GalleryImage[],

  accommodation: {
    hotels: [
      {
        name: "Four Points by Sheraton Kecskemét",
        description: "",
        price: { hu: "19 950 Ft/fő/éjtől", en: "from HUF 19,950 / person / night" },
        distance: { hu: "15 perc sétára a fesztiváltól", en: "15 min walk from the festival" },
        bookingUrl: "https://www.fourpointskecskemet.hu",
        images: ["/images/gallery/article-upload/7/5a36f63f2a4884d5bbce6487650c12a8.jpg", "/images/gallery/article-upload/7/90bccfe85ae92aca5ea7043c74403f22.jpg"],
        stars: 4,
      },
      {
        name: "Hotel Aqua",
        description: "",
        price: { hu: "20 500 Ft/fő/éjtől", en: "from HUF 20,500 / person / night" },
        distance: { hu: "5 perc sétára a fesztiváltól", en: "5 min walk from the festival" },
        bookingUrl: "https://aquahotelkecskemet.hu/?gad_source=1&gad_campaignid=22312818610&gbraid=0AAAAA9Z_U-GvZPT5abqbVU-QVQ8ETxIjk&gclid=CjwKCAjwhqfPBhBWEiwAZo196uTZ16udQMZQ-a49HBy9Zsn_5OEmxtUkyKY3KPmzKuhRuATnR-nm-hoChI8QAvD_BwE",
        images: ["/images/gallery/article-upload/7/ef0b833861a7c84f579a3504360c5154.jpg", "/images/gallery/article-upload/7/3ef93e48c76988c0f19eccc9ad715b1d.jpg"],
        stars: 3,
      },
      {
        name: "Tó Kemping",
        description: "",
        price: { hu: "Kemping árak regisztráció alapján", en: "Camping rates on registration" },
        distance: { hu: "Közvetlenül a helyszín mellett", en: "Directly next to the venue" },
        bookingUrl: "https://tokemping.hu",
        images: ["/images/accommodation/to_kemping.jpg"],
        stars: undefined,
      },
    ],
  },

  /* BOHÉM JAZZFŐVÁROS futás — 2026. aug. 8. szombat 10:00 a Domb Beach
     fesztiválhelyszín célkapujánál. A jazzfovaros.hu/futas oldal adatai
     alapján (shift: 2025.08.09 → 2026.08.08, ugyanazon a szombaton).
     Lebonyolító: Iustitia Egyesület. */
  running: {
    date: { hu: "2026. augusztus 8., szombat", en: "Saturday, 8 August 2026" },
    time: "10:00",
    location: {
      hu: "Domb Beach, Kecskemét (JAZZFŐVÁROS célkapu)",
      en: "Domb Beach, Kecskemét (JAZZ CAPITAL finish gate)",
    },
    entryUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSdw6ZG2oNiRjrV9NF_GsINQ_c5BKoUaLcGGVrrvQQ0SRWvHHQ/viewform",
    entryDeadline: {
      hu: "Előreutalás aug. 7. éjfélig, helyszíni nevezés verseny napján 8:30–9:45",
      en: "Bank transfer until midnight Aug 7, on-site registration on race day 8:30–9:45",
    },
    image: "/images/running/41711b19ad6e3238c075641e18d4f468.jpg",
    contactEmail: "iusegy@gmail.com",
    contactPhone: "+36-30-960-2112",
    contactUrl: "https://jazzfovaros.hu/futas",
    distances: [
      { label: "2 300 m", distance: "2 300 m", fee: "2 500 Ft" },
      { label: "11 500 m", distance: "11 500 m", fee: "2 500 Ft" },
      { label: "5 × 2 300 m váltó", distance: "5 × 2 300 m", fee: "2 500 Ft / fő" },
    ] as RunningDistance[],
  },

  /* VI. JAZZFŐVÁROS jazztábor — 2026. aug. 4-9.
     Helyszín: Neumann János Egyetem, Kecskemét. Szervezi: Pepita Egyesület. */
  camp: {
    videoUrl: "https://www.youtube.com/embed/bSbwtaxe5WE",
    entryUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSdCuzKK9Z1yN2XCaRgGt0mxnC_tv0DxcdxVTujNRn9fniNCXg/viewform",
    supporters: [
      { name: "Nemzeti Kulturális Alap", logo: "/images/sponsors/nka.png", url: "https://nka.hu" },
      { name: "Neumann János Egyetem", logo: "/images/sponsors/nje.png", url: "https://nje.hu" },
      { name: "KEDO Zrt.", logo: "/images/sponsors/kedo.png", url: "#" },
    ] as Sponsor[],
  },

  sponsors: {
    main: [
      { name: "KMJV", logo: "/images/gallery/menu/1302-6642.png", url: "http://www.kecskemet.hu" },
      { name: "NKA", logo: "/images/gallery/menu/1296-2624.png", url: "https://www.nka.hu" },
      { name: "STE", logo: "/images/gallery/menu/1407-3126.png", url: "https://jazzfovaros.hu/ste" },
      { name: "Logall", logo: "/images/gallery/menu/1375-5338.png", url: "http://logall.hu/" },
      { name: "Alcufer", logo: "/images/gallery/menu/1390-4377.png", url: "http://www.alcufer.hu/hu/" },
      { name: "Cargoport", logo: "/images/gallery/menu/1377-2536.png", url: "http://www.cargoport.hu" },
      { name: "Neumann Egyetem", logo: "/images/gallery/menu/1403-6758.png", url: "https://nje.hu/" },
      { name: "Holland Nagykövetség", logo: "/images/gallery/menu/1333-6769.png", url: "https://www.netherlandsandyou.nl/web/hungary/about-us" },
    ] as Sponsor[],
    sponsors: [
      { name: "Félegyházi Pékség", logo: "/images/gallery/menu/1364-4060.png", url: "https://www.felegyhazipekseg.hu" },
      { name: "KEDO", logo: "/images/gallery/menu/1413-9085.png", url: "http://kedozrt.hu" },
    ] as Sponsor[],
    partners: [
      { name: "Bartók Rádió", logo: "/images/gallery/menu/1416-5177.png", url: "https://mediaklikk.hu/bartok/" },
      { name: "hiros.hu", logo: "/images/gallery/menu/1315-7264.png", url: "https://hiros.hu" },
      { name: "Axon", logo: "/images/gallery/menu/1394-8120.png", url: "https://www.axon-cable.com/en/axon-kabelgyarto-hungary" },
      { name: "Füredi", logo: "/images/gallery/menu/1359-1595.png", url: "http://furedi.eu/" },
      { name: "DTKH", logo: "/images/gallery/menu/1339-3453.png", url: "https://dtkh.hu" },
      { name: "Gépész", logo: "/images/gallery/menu/1300-9865.png", url: "https://gepesz.hu" },
      { name: "Tiszaföldvári Italkereskedőház", logo: "/images/gallery/menu/1391-4915.png", url: "https://jazzfovaros.hu/tiszafoldvari-italkereskedohaz" },
      { name: "KEFAG", logo: "/images/gallery/menu/1311-5581.png", url: "https://jazzfovaros.hu/kefag" },
      { name: "Microsystem", logo: "/images/gallery/menu/1405-8346.png", url: "http://www.microsystem.hu" },
      { name: "Botond Kft.", logo: "/images/gallery/menu/1353-3892.png", url: "https://botondkft.hu/" },
      { name: "BeeWaTec", logo: "/images/gallery/menu/1360-5339.png", url: "https://www.beewatec.de/hu/" },
      { name: "Termostar", logo: "/images/gallery/menu/1335-9925.png", url: "https://termostar.hu/kezdolap" },
      { name: "Simon Otthonok", logo: "/images/gallery/menu/1387-7975.png", url: "https://www.simonotthonok.hu/" },
      { name: "Benkó Zoltán Szabadidőközpont", logo: "/images/gallery/menu/1381-2680.png", url: "https://www.szabadidokozpont-kecskemet.hu/" },
      { name: "Hírös Veterán", logo: "/images/gallery/menu/1409-6341.png", url: "https://hirosveteran.hu" },
      { name: "Iustitia", logo: "/images/gallery/menu/1410-6252.png", url: "https://www.juszti.hu" },
      { name: "Társasjáték", logo: "/images/gallery/menu/1414-7680.png", url: "https://www.facebook.com/kecskemetitarsasjatek/" },
    ] as Sponsor[],
  } as SponsorSection,
};
