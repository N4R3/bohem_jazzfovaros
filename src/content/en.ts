import type { SiteContent } from "@/lib/types";
import { BASE } from "./base";
import { getLanguageSwitchUrl } from "@/lib/seo";

export const en: SiteContent = {
  meta: {
    siteTitle: "Bohém JAZZ CAPITAL",
    siteDescription:
      "Europe's best outdoor classic jazz festival — X. Bohém JAZZ CAPITAL, 6–9 August 2026, Kecskemét, Domb Beach. 4 days, 4 stages, 10 countries, 120 musicians, 40 hours of music.",
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

    /* Matches the official jazzfovaros.hu stats line:
       "4 days, 4 stages, 10 countries, 120 musicians, 40 hours of music" */
    highlights: [
      { value: "4", label: "Days", icon: "calendar" },
      { value: "4", label: "Stages", icon: "mic" },
      { value: "10", label: "Countries", icon: "globe" },
      { value: "120", label: "Musicians", icon: "music" },
    ],

    lineupTeaserTitle: "This Year's Performers",
    lineupTeaserCta: "See Full Lineup",

    ctaBannerTitle: "Passes and Tickets for 2026 Are Available Now",
    ctaBannerSubtitle: "Aug 6–9, 2026 · Domb Beach, Kecskemét, Hungary",
    ctaBannerButton: "Buy Tickets →",

    accompanyingProgrammesTitle: "Accompanying Programmes",
    accompanyingProgrammes: [
      { label: "VI. JAZZ CAPITAL Jazz Camp (Aug 4–9)", url: "/tabor/" },
      { label: "Bohém JAZZ CAPITAL Run (Saturday 10:00)", url: "/futas/" },
      { label: "Beach (free throughout with festival wristband)" },
      { label: "Swing dance taster classes for beginners (Thursday–Sunday)" },
      { label: "Oldtimer Vehicle Show (Friday–Saturday–Sunday)" },
      { label: "Labyrinth Course (Friday–Saturday–Sunday)" },
      { label: "Board Games Tent (Saturday)" },
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

    /* 2026 lineup (25 acts) from jazzfovaros.hu/fellepok.
       Detailed bios to be filled editorially later. */
    artists: [
      { name: "Bérczesi Jazz Band", genre: "Classic Jazz", bio: "", day: "friday", stage: "main", time: "18:00", origin: "Hungary" },
      { name: "Bohém Ragtime Jazz Band", genre: "Ragtime / Classic Jazz", bio: "", day: "saturday", stage: "main", time: "22:00", origin: "Kecskemét, Hungary" },
      { name: "Bolba Éva", genre: "Jazz Vocal", bio: "", day: "friday", stage: "club", time: "19:00", origin: "Hungary" },
      { name: "Clotile Yana", genre: "Jazz Vocal", bio: "", day: "saturday", stage: "main", time: "20:00", origin: "USA" },
      { name: "Cseh Balázs", genre: "Jazz Drums", bio: "", day: "saturday", stage: "club", time: "21:00", origin: "Hungary" },
      { name: "Dániel Balázs", genre: "Jazz Piano", bio: "", day: "sunday", stage: "main", time: "13:00", origin: "Hungary" },
      { name: "Dennert Árpád", genre: "Clarinet / Tenor Sax", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Hungary" },
      { name: "Emanuele Urso \"King of Swing\"", genre: "Swing / Classic Jazz", bio: "", day: "saturday", stage: "main", time: "19:00", origin: "Italy" },
      { name: "Farkas Norbert", genre: "Double Bass", bio: "", day: "friday", stage: "club", time: "17:00", origin: "Hungary" },
      { name: "Farkas Péter \"Bubu\"", genre: "Double Bass", bio: "", day: "saturday", stage: "club", time: "20:00", origin: "Hungary" },
      { name: "Festival All Stars", genre: "International All-Stars", bio: "", day: "friday", stage: "main", time: "23:30", origin: "International" },
      { name: "Gyárfás István", genre: "Jazz Guitar", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Hungary" },
      { name: "Hungarian Jazz Embassy", genre: "Classic Jazz", bio: "", day: "sunday", stage: "main", time: "14:30", origin: "Hungary" },
      { name: "Hunter Burgamy", genre: "Banjo / Guitar", bio: "", day: "saturday", stage: "club", time: "16:30", origin: "USA" },
      { name: "Jazz Camp All Stars", genre: "Classic Jazz", bio: "", day: "thursday", stage: "main", time: "19:30", origin: "Hungary" },
      { name: "Ken Aoki", genre: "Banjo", bio: "", day: "friday", stage: "club", time: "18:00", origin: "Japan" },
      { name: "Korb Attila", genre: "Trombone / Trumpet / Piano / Vocal", bio: "", day: "saturday", stage: "main", time: "23:30", origin: "Hungary" },
      { name: "Lukács Eszter", genre: "Jazz Vocal", bio: "", day: "saturday", stage: "club", time: "16:00", origin: "Hungary" },
      { name: "Nagy Iván", genre: "Jazz Piano", bio: "", day: "saturday", stage: "main", time: "23:30", origin: "Hungary" },
      { name: "Nanna Carling", genre: "Classic Jazz / Swing", bio: "", day: "sunday", stage: "main", time: "15:30", origin: "Sweden" },
      { name: "Pribojszki Mátyás", genre: "Blues / Jazz Harmonica", bio: "", day: "friday", stage: "main", time: "21:00", origin: "Hungary" },
      { name: "Sir Oliver Mally & Peter Schneider Duo", genre: "Blues", bio: "", day: "friday", stage: "club", time: "19:00", origin: "Austria / Germany" },
      { name: "Szalóky Béla", genre: "Trumpet / Trombone", bio: "", day: "friday", stage: "main", time: "23:30", origin: "Hungary" },
      { name: "Tom White & the Mad Circus", genre: "Vintage Jazz", bio: "", day: "saturday", stage: "main", time: "18:00", origin: "Hungary" },
      { name: "Swing Dance Classes for Beginners", genre: "Swing Dance Lesson", bio: "", day: "friday", stage: "club", time: "16:30", origin: "International" },
    ],
  },

  /* X. Bohém JAZZ CAPITAL 2026 programme — built on the 2026 lineup
     (jazzfovaros.hu/fellepok) using the 2025 programme structure.
     Exact running order finalised closer to the festival. */
  program: {
    title: "Programme",
    subtitle: "4 days, 4 stages — full running order announced closer to the festival",
    stageMain: "Big Marquee",
    stageClub: "Club Stage / Cargoport",
    days: [
      {
        label: "Thursday (Day Zero)",
        date: "2026-08-06",
        slots: [
          { time: "16:30", artist: "Gates open", stage: "main", duration: 30 },
          { time: "17:00", artist: "Swing dance taster class for beginners", stage: "club", duration: 60 },
          { time: "18:00", artist: "Tom White & the Mad Circus", stage: "main", duration: 60 },
          { time: "19:30", artist: "Jazz Camp All Stars", stage: "main", duration: 60 },
          { time: "20:30", artist: "Bohém Ragtime Jazz Band", stage: "main", duration: 60 },
          { time: "22:00", artist: "Evening jam session", stage: "main", duration: 60, note: "Open jam session with guest musicians" },
        ],
      },
      {
        label: "Friday (Day One)",
        date: "2026-08-07",
        slots: [
          { time: "16:30", artist: "Ken Aoki", stage: "club", duration: 60 },
          { time: "17:00", artist: "Farkas Norbert Trio", stage: "club", duration: 60 },
          { time: "18:00", artist: "Bérczesi Jazz Band", stage: "main", duration: 60 },
          { time: "19:00", artist: "Bolba Éva", stage: "club", duration: 60 },
          { time: "19:00", artist: "Sir Oliver Mally & Peter Schneider Duo", stage: "club", duration: 60 },
          { time: "21:00", artist: "Pribojszki Mátyás", stage: "main", duration: 60 },
          { time: "21:00", artist: "Evening day ticket valid", stage: "club", duration: 0, note: "Evening day tickets grant entry from 21:00" },
          { time: "22:00", artist: "Festival All Stars (Szalóky, Dennert, Gyárfás, …)", stage: "main", duration: 60 },
          { time: "23:30", artist: "Korb Attila & guests", stage: "main", duration: 60 },
        ],
      },
      {
        label: "Saturday (Day Two)",
        date: "2026-08-08",
        slots: [
          { time: "10:00", artist: "Bohém JAZZ CAPITAL Run", stage: "club", duration: 90, note: "Start at the finish gate; 2,300 m / 11,500 m / 5 × 2,300 m relay" },
          { time: "12:00", artist: "Solo piano (Nagy Iván)", stage: "main", duration: 60 },
          { time: "16:00", artist: "Lukács Eszter & Gyárfás István Duo", stage: "club", duration: 45 },
          { time: "16:30", artist: "Hunter Burgamy", stage: "club", duration: 60 },
          { time: "18:00", artist: "Tom White & the Mad Circus", stage: "main", duration: 60 },
          { time: "19:00", artist: "Emanuele Urso \"King of Swing\"", stage: "main", duration: 60 },
          { time: "20:00", artist: "Clotile Yana", stage: "main", duration: 60 },
          { time: "21:00", artist: "Cseh Balázs Trio", stage: "club", duration: 60 },
          { time: "21:00", artist: "Evening day ticket valid", stage: "club", duration: 0, note: "Evening day tickets grant entry from 21:00" },
          { time: "22:00", artist: "Bohém Ragtime Jazz Band", stage: "main", duration: 60 },
          { time: "23:30", artist: "Festival All Stars (Korb, Nagy, …)", stage: "main", duration: 60 },
        ],
      },
      {
        label: "Sunday (Day Three)",
        date: "2026-08-09",
        slots: [
          { time: "10:30", artist: "Blues Duo (Sir Oliver Mally & Peter Schneider)", stage: "club", duration: 60 },
          { time: "12:30", artist: "Swing dance taster — Lindy Hop", stage: "club", duration: 60 },
          { time: "13:00", artist: "Dániel Balázs Trio", stage: "main", duration: 60 },
          { time: "14:30", artist: "Hungarian Jazz Embassy", stage: "main", duration: 90 },
          { time: "15:30", artist: "Nanna Carling", stage: "main", duration: 30 },
          { time: "14:30", artist: "Best of Jazz Camp / closing performances", stage: "main", duration: 90, note: "The VI. JAZZ CAPITAL Jazz Camp participants close the festival" },
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

  /* Bohém JAZZ CAPITAL Run — Saturday 8 Aug 2026, 10:00.
     Organised by Iustitia Egyesület. Source: jazzfovaros.hu/futas */
  running: {
    title: "Bohém JAZZ CAPITAL Run",
    subtitle: "Run with us at the X. festival!",
    date: BASE.running.date.en,
    time: BASE.running.time,
    location: BASE.running.location.en,
    description:
      "The Bohém JAZZ CAPITAL Run takes place on the Saturday of the festival at 10:00. Start and finish at the festival finish gate. Choose from three distances: 2,300 m, 11,500 m, or 5 × 2,300 m relay. Entry fee: HUF 2,500 by bank transfer before midnight on Aug 7 (Kecskeméti Jazz Foundation account: 11732002-20302115) or HUF 3,000 on site in cash or by card. Changing rooms and bag storage provided. Every participant receives a race-logo t-shirt; snacks and water at the finish line.",
    distances: BASE.running.distances,
    entryUrl: BASE.running.entryUrl,
    entryLabel: "Register Online →",
    entryDeadline: BASE.running.entryDeadline.en,
    resultsNote:
      "Prize ceremony: Saturday 8 Aug 2026, 11:55 at the Big Marquee. Medals for the top 3 in each distance and gender (mixed teams for the relay). Special recognition for the youngest and oldest participants!",
    image: BASE.running.image,
    contactEmail: BASE.running.contactEmail,
    contactPhone: BASE.running.contactPhone,
    contactUrl: BASE.running.contactUrl,
    freeTicketNote:
      "All Bohém JAZZ CAPITAL Run participants receive a FREE ENTRY to the Saturday festival programme!",
  },

  /* VI. JAZZ CAPITAL Jazz Camp — 4–9 August 2026.
     Venue: Neumann János University, Kecskemét (air-conditioned rooms).
     Vocal/instrumental courses + swing dance courses in parallel.
     Source: jazzfovaros.hu/jazztabor */
  camp: {
    title: "VI. JAZZ CAPITAL Jazz Camp",
    subtitle: "4–9 August 2026 · Neumann János University, Kecskemét",
    description:
      "We welcome everyone interested in classic (old-school, danceable) jazz — from complete beginners to advanced players, with no age limit. Instrumental or vocal pre-education (e.g. music school) is required; interested passive participants are also welcome! Camp attendees receive 5 × 40-minute individual lessons plus afternoon band practice. On the final day of the festival, the best camp performances close the JAZZ CAPITAL main stage. The camp is organised together with the Pepita Association and Neumann János University; swing dance courses are coordinated by Pepita from 6–8 August.",
    videoUrl: BASE.camp.videoUrl,
    scheduleTitle: "Teachers and programme (2026)",
    schedule: [
      {
        day: "Vocal and instrumental courses (Aug 4–9)",
        items: [
          "VOCAL: Bolba Éva, Lukács Eszter",
          "GUITAR: Gyárfás István, Rieger Attila",
          "DRUMS: Cseh Balázs, Gulyás-Szabó Krisztián",
          "PIANO: Nagy Iván, Korb Attila",
          "DOUBLE BASS: Farkas Péter \"Bubu\"",
          "CLARINET / SAXOPHONE: Dennert Árpád, Korb Attila",
          "TRUMPET / TROMBONE / TUBA: Korb Attila",
          "VIOLIN, Camp Director: Ittzés Tamás",
        ],
      },
      {
        day: "Course fees and festival passes",
        items: [
          "Vocal / instrumental course (per course): HUF 50,000",
          "Swing dance courses: applications and pricing from mid-May",
          "Discounted jazz camp festival pass (with coupon code): HUF 19,900",
          "Pass for Kecskemét residents (postcodes 6000–6050): HUF 16,900",
          "Pass for primary school pupils: HUF 7,900",
          "Pass for Kecskemét primary school pupils (with code): free",
        ],
      },
      {
        day: "Typical day schedule",
        items: [
          "9:30–12:50 — individual lessons (instrument / vocal)",
          "12:00–14:00 — lunch (university cafeteria)",
          "14:30–18:00 — band practice",
          "18:00–20:00 — dinner (university or festival venue)",
          "19:30–23:00 — evening jam session, film screening",
        ],
      },
      {
        day: "Closing day — Aug 9 (Sunday)",
        items: [
          "9:30–11:00 — band practice",
          "9:30–16:00 — Sunday festival programme at Domb Beach",
          "14:30–16:00 — jazz camp performances at the Big Marquee (festival closing set)",
        ],
      },
    ],
    entryUrl: BASE.camp.entryUrl,
    entryLabel: "Apply to the Jazz Camp →",
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
