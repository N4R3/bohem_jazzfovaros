import type { SiteContent } from "@/lib/types";
import { BASE } from "./base";
import { getLanguageSwitchUrl } from "@/lib/seo";

export const en: SiteContent = {
  meta: {
    siteTitle: "Bohém Jazz Capital",
    siteDescription:
      "The best outdoor classic jazz festival of Europe. 4 days, multiple stages, 120 musicians from 10 countries. Domb Beach, Kecskemét, Hungary.",
    festivalDates: BASE.festivalDates.en,
    festivalYear: BASE.festivalYear,
    venue: BASE.venue.en,
    city: BASE.city.en,
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Performers", href: "/lineup/" },
    { label: "Program", href: "/program/" },
    { label: "Tickets & Info", href: "/info/" },
    { label: "Accommodation", href: "/szallas/" },
    { label: "Map & Transport", href: "/terkep/" },
    { label: "Gallery", href: "/gallery/" },
    { label: "Jazz Camp", href: "/tabor/" },
    { label: "Contact", href: "/contact/" },
  ],

  otherLocale: {
    label: "HU",
    domain: getLanguageSwitchUrl(),
  },

  home: {
    heroTitle: "Bohém Jazz Capital",
    heroSubtitle: "Kecskemét, Hungary · Aug 6–9, 2026",
    heroCta: "Get Tickets",
    heroDateLine: "Aug 6–9, 2026 · Domb Beach, Kecskemét, Hungary",
    videoUrl: BASE.videoUrl,
    videoTitle: "Bohém Jazz Capital — Festival Video",

    quickLinks: [
      {
        label: "Buy Tickets",
        description: "Passes and day tickets online",
        href: "/info/",
        icon: "ticket",
      },
      {
        label: "Map & Transport",
        description: "Venue, parking, how to get there",
        href: "/terkep/",
        icon: "map",
      },
      {
        label: "Accommodation",
        description: "Hotels and camping near the venue",
        href: "/szallas/",
        icon: "hotel",
      },
    ],

    highlights: [
      { value: "4", label: "Days", icon: "calendar" },
      { value: "10+", label: "Countries", icon: "globe" },
      { value: "120+", label: "Musicians", icon: "mic" },
      { value: "40+", label: "Hours of Music", icon: "music" },
    ],

    lineupTeaserTitle: "This Year's Performers",
    lineupTeaserCta: "See Full Lineup",

    ctaBannerTitle: "Passes and Tickets for 2026 Are Available Now",
    ctaBannerSubtitle: "Aug 6–9, 2026 · Domb Beach, Kecskemét, Hungary",
    ctaBannerButton: "Buy Tickets →",

    accompanyingProgrammesTitle: "Accompanying Programmes",
    accompanyingProgrammes: [
      { label: "Jazz Camp (Aug 5–10)", url: "https://pepitasummerswing.hu/en/" },
      { label: "Jazz Capital Run (Saturday 16:00)", url: "/futas/" },
      { label: "Beach — free with festival wristband (9 am – 8 pm, excl. wakeboard)" },
      { label: "Oldtimers Show (Friday–Saturday–Sunday)" },
      { label: "Labyrinth Run (Friday–Saturday–Sunday)" },
      { label: "Dragon Boat (Saturday)" },
      { label: "Board Games (Saturday)" },
    ],
  },

  lineup: {
    title: "Performers",
    subtitle: "Hungarian and international artists on one stage",
    filterAll: "All",
    filterThursday: "Thursday",
    filterFriday: "Friday",
    filterSaturday: "Saturday",
    filterSunday: "Sunday",
    stageMain: "Main Stage",
    stageClub: "Club Stage",

    artists: [
      {
        name: "Dresch Mihály Quartet",
        genre: "Hungarian Jazz",
        bio: "Mihály Dresch is one of the defining voices of Hungarian jazz. His music merges the Bartók legacy with the freedom of free jazz.",
        image: "/images/artists/dresch.jpg",
        day: "friday",
        stage: "main",
        time: "21:00",
        origin: "Budapest, Hungary",
      },
      {
        name: "Tigran Hamasyan",
        genre: "Contemporary Jazz",
        bio: "The Armenian pianist uniquely bridges contemporary jazz with Caucasian folk music. Breathtaking technique meets deep emotion.",
        image: "/images/artists/tigran.jpg",
        day: "saturday",
        stage: "main",
        time: "22:00",
        origin: "Yerevan, Armenia",
      },
      {
        name: "Borbély Mihály",
        genre: "World Jazz",
        bio: "Through his wind instruments, Borbély Mihály gives voice to the world's musical diversity — folk melodies, jazz, and Eastern influences in a singular blend.",
        image: "/images/artists/borbely.jpg",
        day: "friday",
        stage: "club",
        time: "19:30",
        origin: "Hungary",
      },
      {
        name: "GoGo Penguin",
        genre: "Jazz / Electronic",
        bio: "The Manchester trio fuses jazz tradition with electronic energy. Driving, urban sound you won't forget.",
        image: "/images/artists/gogopenguin.jpg",
        day: "saturday",
        stage: "main",
        time: "20:00",
        origin: "Manchester, United Kingdom",
      },
      {
        name: "Roby Lakatos & Ensemble",
        genre: "Gypsy Jazz / Classical",
        bio: "The legendary violin virtuoso performs Romani music and classical repertoire with breathtaking technique and boundless passion.",
        image: "/images/artists/roby.jpg",
        day: "sunday",
        stage: "main",
        time: "20:30",
        origin: "Budapest, Hungary",
      },
      {
        name: "Nils Petter Molvær",
        genre: "Nordic Jazz / Fusion",
        bio: "The Norwegian trumpeter inhabits a sound world between jazz, electronics, and ambient — a unique and deeply atmospheric cocktail.",
        image: "/images/artists/molvaer.jpg",
        day: "sunday",
        stage: "main",
        time: "22:00",
        origin: "Oslo, Norway",
      },
      {
        name: "Grencsó Kollektíva",
        genre: "Free Jazz / Avant-garde",
        bio: "István Grencsó's collective is known as a champion of free improvisation — bold, experimental, and utterly singular.",
        image: "/images/artists/grenco.jpg",
        day: "saturday",
        stage: "club",
        time: "21:30",
        origin: "Budapest, Hungary",
      },
      {
        name: "Cory Henry & The Funk Apostles",
        genre: "Soul Jazz / Funk",
        bio: "Organist and vocalist Cory Henry fills a room with an intensity and spirituality that echoes the greatest gospel preachers.",
        image: "/images/artists/cory.jpg",
        day: "friday",
        stage: "main",
        time: "22:30",
        origin: "New York, USA",
      },
    ],
  },

  program: {
    title: "Program",
    subtitle: "4 days, multiple stages — plan your festival",
    stageMain: "Main Stage",
    stageClub: "Club Stage",
    days: [
      {
        label: "Thursday",
        date: "2026-08-06",
        slots: [
          { time: "18:00", artist: "Opening", stage: "main", duration: 60 },
          { time: "20:00", artist: "Performer TBA", stage: "main", duration: 90 },
        ],
      },
      {
        label: "Friday",
        date: "2026-08-07",
        slots: [
          { time: "17:00", artist: "Borbély Mihály", stage: "club", duration: 75 },
          { time: "19:30", artist: "Dresch Mihály Quartet", stage: "main", duration: 90 },
          { time: "21:00", artist: "Cory Henry & The Funk Apostles", stage: "main", duration: 90 },
          { time: "21:00", artist: "Evening ticket valid from 21:00", stage: "club", duration: 0, note: "Evening day tickets valid from 21:00" },
        ],
      },
      {
        label: "Saturday",
        date: "2026-08-08",
        slots: [
          { time: "16:00", artist: "Jazz Capital Run", stage: "club", duration: 60 },
          { time: "18:00", artist: "GoGo Penguin", stage: "main", duration: 90 },
          { time: "20:00", artist: "Grencsó Kollektíva", stage: "club", duration: 75 },
          { time: "21:00", artist: "Tigran Hamasyan", stage: "main", duration: 90 },
          { time: "21:00", artist: "Evening ticket valid from 21:00", stage: "club", duration: 0, note: "Evening day tickets valid from 21:00" },
        ],
      },
      {
        label: "Sunday",
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
    title: "Tickets & Info",
    subtitle: "Everything you need to know",
    ticketCta: "Buy Tickets Now",
    ticketUrl: BASE.ticketUrlEn,

    ticketTiers: [
      { label: "Super Early Bird Pass (first 200 buyers get a free festival chair)", price: "HUF 19,900", highlight: true },
      { label: "Early Bird Pass", price: "HUF 19,900" },
      { label: "Lazy Bird Pass", price: "HUF 24,900" },
      { label: "4-Day Pass (Early Bird until Mar 31, Lazy Bird until Jun 30)", price: "HUF 29,900" },
      { label: "4-Day VIP Pass (food & drink in VIP marquee)", price: "HUF 59,900" },
      { label: "4-Day Pass for Kecskemét residents (postcode 6000–6050)", price: "HUF 16,900" },
      { label: "Student Pass (age 7–18)", price: "HUF 7,900" },
      { label: "Day ticket – Thursday", price: "HUF 5,900" },
      { label: "Day ticket – Friday", price: "HUF 9,900" },
      { label: "Day ticket – Saturday", price: "HUF 11,900" },
      { label: "Day ticket – Sunday", price: "HUF 3,900" },
      { label: "Evening ticket – Friday or Saturday (from 21:00)", price: "HUF 4,900" },
    ],

    ticketNote:
      "Your ticket is a wristband collected at the venue in exchange for your pre-purchase receipt. Entry is free for children under 6 when accompanied by an adult — do not buy a ticket for them. OTP SZÉP card payments accepted at Gate II during the festival. Tickets are also available at Gate I and Gate II on site. No food or drink may be brought into the festival area.",

    sections: [
      {
        title: "Venue",
        body: "Domb Beach (Benkó Zoltán Recreation Centre), Csabay Géza körút, Kecskemét — between the hospital and Kecskemét Spa. Gate I is open 9:00–20:00 only. Gate II is open continuously. GPS: 46.903819, 19.666032",
      },
      {
        title: "Entry & Security",
        body: "A valid ticket or pass is required for entry. Your ticket is a wristband issued at the venue. No food or drink may be brought into the festival area — security staff may check bags at entry.",
      },
    ],

    faq: [
      {
        question: "Can children enter for free?",
        answer: "Children under 6 enter free when accompanied by an adult. Do not purchase a ticket for them.",
      },
      {
        question: "Is there food and drink at the venue?",
        answer: "Yes, there are street food stands and bars throughout the festival site. Outside food and drink is not permitted.",
      },
      {
        question: "How do I get to Kecskemét?",
        answer: "By car via the M5 motorway, by train from Budapest Keleti, or by intercity bus from Budapest Stadion. From the Kecskemét station take local bus 21 or 22 to the venue.",
      },
      {
        question: "When is Gate I open?",
        answer: "Gate I (beach entrance side) is open 9:00–20:00 only. Gate II is open continuously throughout the festival.",
      },
      {
        question: "Is the beach included?",
        answer: "Yes — the beach is free to use with your festival wristband, from 9 am to 8 pm daily (wakeboard excluded).",
      },
    ],
  },

  gallery: {
    title: "Gallery",
    subtitle: "Photos from previous years",
    images: [
      { src: "/images/gallery/01.jpg", alt: "Main stage evening light" },
      { src: "/images/gallery/02.jpg", alt: "Crowd at Domb Beach" },
      { src: "/images/gallery/03.jpg", alt: "Trumpet solo" },
      { src: "/images/gallery/04.jpg", alt: "Club Stage atmosphere" },
      { src: "/images/gallery/05.jpg", alt: "Sunset and music" },
      { src: "/images/gallery/06.jpg", alt: "Drummer in the spotlight" },
      { src: "/images/gallery/07.jpg", alt: "Piano close-up" },
      { src: "/images/gallery/08.jpg", alt: "Audience applause" },
      { src: "/images/gallery/09.jpg", alt: "Kecskemét skyline" },
      { src: "/images/gallery/10.jpg", alt: "Double bass on stage" },
      { src: "/images/gallery/11.jpg", alt: "Saxophone solo" },
      { src: "/images/gallery/12.jpg", alt: "Festival crowd" },
    ],
  },

  contact: {
    title: "Contact",
    subtitle: "Get in touch",
    organizer: BASE.contact.organizer.en,
    address: BASE.contact.address.en,
    email: BASE.contact.email,
    phone: BASE.contact.phone,
    phone2: BASE.contact.phone2En,
    phone2Name: BASE.contact.phone2NameEn,
    pressEmail: BASE.contact.pressEmail,
    pressTitle: "Press & Accreditation",
    pressText:
      "To request press accreditation, please send your name, media outlet, email and mobile number to sajt@bohemragtime.com by 31 July 2026. Interview requests with performers should also be submitted by this date.",
    socials: BASE.socials,
  },

  accommodation: {
    title: "Accommodation",
    subtitle: "Hotels and camping near the festival",
    note: "Festival hotel rates include breakfast. Tourist tax not included (HUF 400/person/night, ages 18+). Book early — rooms are limited during the festival.",
    hotels: [
      {
        name: "Four Points by Sheraton Kecskemét",
        description: "The official festival hotel, 15 minutes' walk from Domb Beach. Discounted festival rate available when booking directly with the JAZZFŐVÁROS code.",
        price: BASE.accommodation.hotels[0].price.en,
        distance: BASE.accommodation.hotels[0].distance.en,
        bookingUrl: BASE.accommodation.hotels[0].bookingUrl,
        bookingLabel: "Book Now →",
        images: BASE.accommodation.hotels[0].images,
        stars: 4,
      },
      {
        name: "Hotel Aqua",
        description: "The closest hotel to the festival — just 5 minutes' walk from Domb Beach. Free parking, breakfast included, air-conditioned rooms.",
        price: BASE.accommodation.hotels[1].price.en,
        distance: BASE.accommodation.hotels[1].distance.en,
        bookingUrl: BASE.accommodation.hotels[1].bookingUrl,
        bookingLabel: "Book Now →",
        images: BASE.accommodation.hotels[1].images,
        stars: 3,
      },
      {
        name: "Tó Camping",
        description: "Camping directly next to the festival venue — tents and camper vans welcome. Reception 9:00–13:00; you may set up your tent at any time.",
        price: "Rates on registration",
        distance: BASE.accommodation.hotels[2].distance.en,
        bookingUrl: BASE.accommodation.hotels[2].bookingUrl,
        bookingLabel: "tokemping.hu →",
        images: BASE.accommodation.hotels[2].images,
        stars: undefined,
      },
    ],
  },

  map: {
    title: "Map & Transport",
    subtitle: "How to get to Domb Beach",
    mapImage: BASE.mapImage,
    mapNote: "Festival map — note gate opening times. Gate I (beach side) is open 9:00–20:00 only. Gate II is open continuously.",
    gps: BASE.gps,
    directions: [
      {
        mode: "By Car",
        icon: "car",
        text: "Exit at Kecskemét-Centrum/Lajosmizse or Kecskemét-Nyugat from the M5 motorway. Parking available at the rear gate inside the festival grounds. GPS: 46.903819, 19.666032",
      },
      {
        mode: "By Train",
        icon: "train",
        text: "From Budapest Keleti, take a train to Kecskemét, then board bus 21 (every hour) or bus 22 (every half hour) from the adjacent bus station. Get off at SZTK — 5 minutes' walk to the venue. Timetable: menetrend.kecskemet.hu",
      },
      {
        mode: "By Intercity Bus",
        icon: "bus",
        text: "From Budapest Stadion intercity bus station to Kecskemét, then local bus (21 or 22). The train and bus stations are next to each other. Timetable: menetrendek.hu",
      },
    ],
  },

  running: {
    title: "Jazz Capital Run",
    subtitle: "Run with us at the festival!",
    date: BASE.running.date.en,
    time: BASE.running.time,
    location: BASE.running.location.en,
    description: "The Jazz Capital Run takes place on the Saturday of the festival. Registration is available online or at the festival office. Entry fee: HUF 2,500 or a HUF 2,500 health voucher. Children participate free. Changing rooms and showers available.",
    distances: BASE.running.distances,
    entryUrl: BASE.running.entryUrl,
    entryLabel: "Register Online →",
    entryDeadline: BASE.running.entryDeadline.en,
    resultsNote: "Prize ceremony: Saturday 9 Aug, 11:25 at Nagyvárosliget. Jazz Capital Run participants receive a FREE ENTRY to the Saturday programme!",
    image: BASE.running.image,
    contactEmail: BASE.running.contactEmail,
    contactPhone: BASE.running.contactPhone,
    contactUrl: BASE.running.contactUrl,
    freeTicketNote: "Run participants receive a FREE ENTRY to the Saturday festival programme!",
  },

  camp: {
    title: "Jazz Camp",
    subtitle: "Bohém Jazz Camp · Aug 5–10, 2026",
    description: "The Jazz Camp is a full-day music and dance programme running alongside the Jazz Capital festival. Jazz, swing and lindy hop workshops, performances and group activities. The camp takes place at and around the festival venue.",
    videoUrl: BASE.camp.videoUrl,
    scheduleTitle: "Camp programme (indicative)",
    schedule: [
      {
        day: "Aug 5 (Wed) – Aug 6 (Thu)",
        items: [
          "Arrival day workshops (swing, lindy hop, jazz improvisation)",
          "Group dinner and evening jam session",
        ],
      },
      {
        day: "Aug 7 (Fri) – Aug 8 (Sat)",
        items: [
          "Daytime workshops at the venue",
          "Festival performances",
          "Late-night dance events",
        ],
      },
      {
        day: "Aug 9 (Sun) – Aug 10 (Mon)",
        items: [
          "Closing workshops",
          "Final group performance",
          "Departure day",
        ],
      },
    ],
    entryUrl: BASE.camp.entryUrl,
    entryLabel: "Register for Jazz Camp →",
    supporters: BASE.camp.supporters,
  },

  terms: {
    title: "Terms & Conditions",
    body: `JAZZFŐVÁROS Kft. (hereafter: organiser) sets out the following general conditions for entry to its events, for personal belongings brought to the festival, and for presence in the festival area.

Tickets can only be purchased on www.jazzfovaros.hu by accepting the terms of use. The integrated service via www.bartix.hu does not allow cookies to be declined.

By purchasing a ticket and/or entering the festival area, the visitor accepts the following conditions:

1. The ticket is personal and non-transferable.
2. Tickets are checked at the entrance.
3. The organiser accepts no responsibility for lost, stolen or damaged tickets.
4. No food or drink may be brought into the festival area.
5. The organiser reserves the right to remove persons who endanger the order of the event.
6. Public publication of recordings (photos, video) made at the festival requires the organiser's permission.
7. In cases of force majeure (natural disaster, official order, etc.), the organiser is not liable for damages caused by a cancelled event.

Persons attending the JAZZFŐVÁROS festival consent to the organiser using photos and videos taken of them at the event for marketing purposes.`,
  },

  sponsors: BASE.sponsors,

  footer: {
    copyright: "© 2026 JAZZ CAPITAL Ltd. All rights reserved.",
    tagline: "Join us on social networks!",
    navLabel: "Navigation",
    legalLinks: [
      { label: "Privacy", href: "/privacy/" },
      { label: "Legal notice", href: "/legal-notice/" },
      { label: "Impressum", href: "/impressum/" },
      { label: "T&C", href: "/aszf/" },
    ],
    paymentNote: "Payment options",
    builtBy: BASE.builtBy,
    builtByUrl: BASE.builtByUrl,
  },
};
