import type { PortableTextBlock } from "@portabletext/react";

export type SanityImageRef = {
  _type: "image";
  asset?: {
    _ref?: string;
    _type?: "reference";
  };
};

export type SeoFields = {
  seoTitleHu?: string;
  seoTitleEn?: string;
  seoDescriptionHu?: string;
  seoDescriptionEn?: string;
  ogImage?: SanityImageRef;
  canonicalOverrideHu?: string;
  canonicalOverrideEn?: string;
  noIndex?: boolean;
};

export type SiteSettings = {
  titleHu?: string;
  titleEn?: string;
  descriptionHu?: string;
  descriptionEn?: string;
  festivalStartDate?: string;
  festivalEndDate?: string;
  venueNameHu?: string;
  venueNameEn?: string;
  ticketUrlHu?: string;
  ticketUrlEn?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  volunteerTitleHu?: string;
  volunteerTitleEn?: string;
  volunteerDescriptionHu?: string;
  volunteerDescriptionEn?: string;
  volunteerButtonLabelHu?: string;
  volunteerButtonLabelEn?: string;
  volunteerUrl?: string;
  houseRulesPdf?: string;
  organizationName?: string;
  organizationUrl?: string;
  seo?: SeoFields;
};

export type PopupSettings = {
  _rev?: string;
  isEnabled?: boolean;
  image?: SanityImageRef;
  imagePath?: string;
  altHu?: string;
  altEn?: string;
  sessionStorageKey?: string;
  showOnlyOnHomepage?: boolean;
};

export type SanityPerformerTag = {
  _id: string;
  titleHu?: string;
  titleEn?: string;
  slug?: { current?: string };
  order?: number;
  isActive?: boolean;
};

export type SanityPerformer = {
  _id: string;
  name: string;
  ticketUrlHu?: string;
  ticketUrlEn?: string;
  cardBackgroundVariant?: "navbar" | "default" | "accent";
  shortDescriptionRichHu?: PortableTextBlock[];
  shortDescriptionRichEn?: PortableTextBlock[];
  bioRichHu?: PortableTextBlock[];
  bioRichEn?: PortableTextBlock[];
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  image?: SanityImageRef;
  imagePath?: string;
  imageDisplayMode?: "cover" | "contain" | "landscape" | "portrait";
  order?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: SanityPerformerTag[];
  members?: Array<{
    nameHu?: string;
    nameEn?: string;
    roleHu?: string;
    roleEn?: string;
    instrumentHu?: string;
    instrumentEn?: string;
    countryCode?: string;
    countryNameHu?: string;
    countryNameEn?: string;
    showAsStandalonePerformer?: boolean;
    order?: number;
  }>;
  seo?: SeoFields;
};

export type SanityStage = {
  _id: string;
  nameHu?: string;
  nameEn?: string;
  slug?: { current?: string };
  order?: number;
  isActive?: boolean;
};

export type SanityNavigationItem = {
  _id: string;
  labelHu?: string;
  labelEn?: string;
  order?: number;
  isActive?: boolean;
  showInHeader?: boolean;
  showInFooter?: boolean;
  openInNewTab?: boolean;
  href?: string;
  externalUrl?: string;
  page?: {
    _id?: string;
    slug?: { current?: string };
    titleHu?: string;
    titleEn?: string;
    isActive?: boolean;
  } | null;
  parent?: { _id?: string; labelHu?: string; labelEn?: string } | null;
};

export type SanityPage = {
  _id: string;
  titleHu?: string;
  titleEn?: string;
  slug?: { current?: string };
  videoUrl?: string;
  videoTitleHu?: string;
  videoTitleEn?: string;
  homeHeroTitleHu?: string;
  homeHeroTitleEn?: string;
  homeHeroSubtitleHu?: string;
  homeHeroSubtitleEn?: string;
  homeHeroLeadHu?: string;
  homeHeroLeadEn?: string;
  homePrimaryCtaTextHu?: string;
  homePrimaryCtaTextEn?: string;
  homePrimaryCtaUrl?: string;
  homeSecondaryCtaTextHu?: string;
  homeSecondaryCtaTextEn?: string;
  homeSecondaryCtaUrl?: string;
  homeStats?: Array<{
    value?: string;
    labelHu?: string;
    labelEn?: string;
    icon?: string;
  }>;
  homeCtaBannerTitleHu?: string;
  homeCtaBannerTitleEn?: string;
  homeCtaBannerTextHu?: string;
  homeCtaBannerTextEn?: string;
  homeCtaBannerButtonTextHu?: string;
  homeCtaBannerButtonTextEn?: string;
  homeCtaBannerButtonUrl?: string;
  heroTitleHu?: string;
  heroTitleEn?: string;
  heroDescriptionRichHu?: PortableTextBlock[];
  heroDescriptionRichEn?: PortableTextBlock[];
  introNoteRichHu?: PortableTextBlock[];
  introNoteRichEn?: PortableTextBlock[];
  pageBodyRichHu?: PortableTextBlock[];
  pageBodyRichEn?: PortableTextBlock[];
  pageBody2RichHu?: PortableTextBlock[];
  pageBody2RichEn?: PortableTextBlock[];
  showSecondBody?: boolean;
  programDisplayMode?: "structured" | "freeText" | "both";
  programBodyRichHu?: PortableTextBlock[];
  programBodyRichEn?: PortableTextBlock[];
  showProgramTableDesktop?: boolean;
  showProgramTableMobile?: boolean;
  showProgramTextDesktop?: boolean;
  showProgramTextMobile?: boolean;
  desktopProgramOrder?: string;
  mobileProgramOrder?: string;
  primaryButtonLabelHu?: string;
  primaryButtonLabelEn?: string;
  primaryButtonUrlHu?: string;
  primaryButtonUrlEn?: string;
  secondaryButtonLabelHu?: string;
  secondaryButtonLabelEn?: string;
  secondaryButtonUrlHu?: string;
  secondaryButtonUrlEn?: string;
  campEyebrowHu?: string;
  campEyebrowEn?: string;
  campScheduleSectionTitleHu?: string;
  campScheduleSectionTitleEn?: string;
  campScheduleBlocks?: Array<{
    titleHu?: string;
    titleEn?: string;
    displayMode?: "list" | "paragraphs";
    bulletsRichHu?: PortableTextBlock[];
    bulletsRichEn?: PortableTextBlock[];
  }>;
  campSupportersSectionTitleHu?: string;
  campSupportersSectionTitleEn?: string;
  campSupporters?: Array<{
    nameHu?: string;
    nameEn?: string;
    url?: string;
  }>;
  runningEyebrowHu?: string;
  runningEyebrowEn?: string;
  runningFreeEntryBannerRichHu?: PortableTextBlock[];
  runningFreeEntryBannerRichEn?: PortableTextBlock[];
  runningCardDateHu?: string;
  runningCardDateEn?: string;
  runningCardTime?: string;
  runningCardLocationRichHu?: PortableTextBlock[];
  runningCardLocationRichEn?: PortableTextBlock[];
  runningDistancesSectionTitleHu?: string;
  runningDistancesSectionTitleEn?: string;
  runningDistanceRows?: Array<{
    categoryHu?: string;
    categoryEn?: string;
    distanceHu?: string;
    distanceEn?: string;
    feeHu?: string;
    feeEn?: string;
  }>;
  runningEntryDeadlineRichHu?: PortableTextBlock[];
  runningEntryDeadlineRichEn?: PortableTextBlock[];
  runningResultsNoteRichHu?: PortableTextBlock[];
  runningResultsNoteRichEn?: PortableTextBlock[];
  infoFaqItems?: Array<{
    questionHu?: string;
    questionEn?: string;
    answerRichHu?: PortableTextBlock[];
    answerRichEn?: PortableTextBlock[];
  }>;
  isActive?: boolean;
  seo?: SeoFields;
  sections?: Array<
    | {
        _type: "sectionRichText";
        enabled?: boolean;
        titleHu?: string;
        titleEn?: string;
        bodyRichHu?: PortableTextBlock[];
        bodyRichEn?: PortableTextBlock[];
      }
    | {
        _type: "sectionTextBox";
        enabled?: boolean;
        titleHu?: string;
        titleEn?: string;
        bodyRichHu?: PortableTextBlock[];
        bodyRichEn?: PortableTextBlock[];
        variant?: "default" | "highlight" | "muted";
      }
    | {
        _type: "sectionVideo";
        enabled?: boolean;
        titleHu?: string;
        titleEn?: string;
        videoRef?: SanityVideo | null;
      }
    | {
        _type: "sectionButton";
        enabled?: boolean;
        labelHu?: string;
        labelEn?: string;
        url?: string;
        style?: "primary" | "secondary" | "link";
        openInNewTab?: boolean;
      }
    | {
        _type: "sectionImage";
        enabled?: boolean;
        titleHu?: string;
        titleEn?: string;
        image?: SanityImageRef;
        captionHu?: string;
        captionEn?: string;
      }
    | {
        _type: "sectionGallery";
        enabled?: boolean;
        titleHu?: string;
        titleEn?: string;
        images?: Array<SanityImageRef & { altHu?: string; altEn?: string }>;
      }
    | {
        _type: "sectionSpacer";
        enabled?: boolean;
        size?: "sm" | "md" | "lg" | "xl";
        showDivider?: boolean;
      }
  >;
};

export type SanityVideo = {
  _id: string;
  titleHu?: string;
  titleEn?: string;
  descriptionHu?: PortableTextBlock[];
  descriptionEn?: PortableTextBlock[];
  videoUrl?: string;
  thumbnail?: SanityImageRef;
  size?: "small" | "medium" | "large" | "full";
  enabled?: boolean;
  order?: number;
  ctaTextHu?: string;
  ctaTextEn?: string;
  ctaUrl?: string;
  displayOnPages?: string[];
};

export type SanityTicket = {
  _id: string;
  nameHu?: string;
  nameEn?: string;
  descriptionRichHu?: PortableTextBlock[];
  descriptionRichEn?: PortableTextBlock[];
  descriptionHu?: string;
  descriptionEn?: string;
  price?: string;
  currency?: string;
  ticketUrlHu?: string;
  ticketUrlEn?: string;
  badgeHu?: string;
  badgeEn?: string;
  ctaTextHu?: string;
  ctaTextEn?: string;
  ctaUrl?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  isHidden?: boolean;
  showOnHome?: boolean;
  homeOrder?: number;
  order?: number;
};

export type SponsorCategoryWithSponsors = {
  _id: string;
  titleHu?: string;
  titleEn?: string;
  order?: number;
  sponsors: Array<{
    _id: string;
    name?: string;
    logo?: SanityImageRef;
    logoPath?: string;
    url?: string;
    order?: number;
    isActive?: boolean;
  }>;
};

export type SanityProgramItem = {
  _id: string;
  titleHu?: string;
  titleEn?: string;
  eventTitleHu?: string;
  eventTitleEn?: string;
  descriptionRichHu?: PortableTextBlock[];
  descriptionRichEn?: PortableTextBlock[];
  descriptionHu?: string;
  descriptionEn?: string;
  detailsRichHu?: PortableTextBlock[];
  detailsRichEn?: PortableTextBlock[];
  ticketUrlHu?: string;
  ticketUrlEn?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  stage?: string;
  stageRef?: SanityStage | null;
  category?: string;
  performers?: Array<{ _id: string; name?: string; slug?: { current?: string } }>;
  order?: number;
  isActive?: boolean;
  seo?: SeoFields;
};

export type SanityAccommodation = {
  _id: string;
  name: string;
  descriptionRichHu?: PortableTextBlock[];
  descriptionRichEn?: PortableTextBlock[];
  descriptionHu?: string;
  descriptionEn?: string;
  bodyRichHu?: PortableTextBlock[];
  bodyRichEn?: PortableTextBlock[];
  ctaTextHu?: string;
  ctaTextEn?: string;
  ctaUrl?: string;
  priceHu?: string;
  priceEn?: string;
  stars?: number;
  image?: SanityImageRef;
  imagePath?: string;
  websiteUrl?: string;
  bookingUrl?: string;
  bookingLabelHu?: string;
  bookingLabelEn?: string;
  distanceHu?: string;
  distanceEn?: string;
  order?: number;
  isActive?: boolean;
};

export type SanityTransportItem = {
  _id: string;
  titleHu?: string;
  titleEn?: string;
  descriptionRichHu?: PortableTextBlock[];
  descriptionRichEn?: PortableTextBlock[];
  descriptionHu?: string;
  descriptionEn?: string;
  icon?: string;
  url?: string;
  order?: number;
  isActive?: boolean;
};

export type SanityVenue = {
  _id: string;
  nameHu?: string;
  nameEn?: string;
  addressHu?: string;
  addressEn?: string;
  titleHu?: string;
  titleEn?: string;
  subtitleHu?: string;
  subtitleEn?: string;
  mapEmbedUrl?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  descriptionRichHu?: PortableTextBlock[];
  descriptionRichEn?: PortableTextBlock[];
  descriptionHu?: string;
  descriptionEn?: string;
  mapImage?: {
    asset?: { _ref: string; _type: "reference" };
    url?: string;
  };
  directionsHeadingHu?: string;
  directionsHeadingEn?: string;
};
