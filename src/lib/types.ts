export type Locale = "hu" | "en";

export interface Artist {
  name: string;
  genre: string;
  bio: string;
  image?: string;
  day: "thursday" | "friday" | "saturday" | "sunday";
  stage: "main" | "club";
  time: string;
  origin: string;
}

export interface ScheduleSlot {
  time: string;
  artist: string;
  stage: "main" | "club";
  duration: number;
  note?: string;
}

export interface ScheduleDay {
  label: string;
  date: string;
  slots: ScheduleSlot[];
}

export interface InfoSection {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface TicketTier {
  label: string;
  price: string;
  highlight?: boolean;
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface AccompanyingProgramme {
  label: string;
  url?: string;
}

export interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

export interface SponsorSection {
  main: Sponsor[];
  sponsors: Sponsor[];
  partners: Sponsor[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Highlight {
  value: string;
  label: string;
  icon: string;
}

export interface QuickLink {
  label: string;
  description: string;
  href: string;
  icon: string;
}

export interface Hotel {
  name: string;
  description: string;
  price: string;
  distance: string;
  bookingUrl: string;
  bookingLabel: string;
  images: string[];
  stars?: number;
}

export interface RunningDistance {
  label: string;
  distance: string;
  fee: string;
}

export interface CampScheduleItem {
  day: string;
  items: string[];
}

export interface SiteContent {
  meta: {
    siteTitle: string;
    siteDescription: string;
    festivalDates: string;
    festivalYear: string;
    venue: string;
    city: string;
  };
  nav: NavItem[];
  otherLocale: {
    label: string;
    domain: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroDateLine: string;
    videoUrl?: string;
    videoTitle?: string;
    quickLinks?: QuickLink[];
    highlights: Highlight[];
    lineupTeaserTitle: string;
    lineupTeaserCta: string;
    ctaBannerTitle: string;
    ctaBannerSubtitle: string;
    ctaBannerButton: string;
    accompanyingProgrammesTitle?: string;
    accompanyingProgrammes?: AccompanyingProgramme[];
  };
  lineup: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterThursday: string;
    filterFriday: string;
    filterSaturday: string;
    filterSunday: string;
    stageMain: string;
    stageClub: string;
    artists: Artist[];
  };
  program: {
    title: string;
    subtitle: string;
    days: ScheduleDay[];
    stageMain: string;
    stageClub: string;
  };
  info: {
    title: string;
    subtitle: string;
    sections: InfoSection[];
    faq: FaqItem[];
    ticketCta: string;
    ticketUrl: string;
    ticketTiers?: TicketTier[];
    ticketNote?: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    images: GalleryImage[];
  };
  contact: {
    title: string;
    subtitle: string;
    organizer: string;
    address: string;
    email: string;
    phone: string;
    phone2?: string;
    phone2Name?: string;
    volunteerText?: string;
    volunteerUrl?: string;
    pressEmail: string;
    pressTitle: string;
    pressText: string;
    socials: {
      facebook: string;
      instagram: string;
      youtube: string;
    };
  };
  accommodation: {
    title: string;
    subtitle: string;
    note: string;
    hotels: Hotel[];
  };
  map: {
    title: string;
    subtitle: string;
    mapImage: string;
    mapNote: string;
    gps: string;
    directions: {
      mode: string;
      icon: string;
      text: string;
    }[];
  };
  running: {
    title: string;
    subtitle: string;
    date: string;
    time: string;
    location: string;
    description: string;
    distances: RunningDistance[];
    entryUrl: string;
    entryLabel: string;
    entryDeadline: string;
    resultsNote: string;
    image: string;
    contactEmail: string;
    contactPhone: string;
    contactUrl: string;
    freeTicketNote: string;
  };
  camp: {
    title: string;
    subtitle: string;
    description: string;
    videoUrl?: string;
    scheduleTitle: string;
    schedule: CampScheduleItem[];
    entryUrl?: string;
    entryLabel?: string;
    supporters: Sponsor[];
  };
  terms: {
    title: string;
    body: string;
  };
  sponsors: SponsorSection;
  footer: {
    copyright: string;
    tagline: string;
    navLabel: string;
    legalLinks: LegalLink[];
    paymentNote?: string;
    builtBy?: string;
    builtByUrl?: string;
  };
}
