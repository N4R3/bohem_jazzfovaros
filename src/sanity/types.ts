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
  shortDescriptionHu?: string;
  shortDescriptionEn?: string;
  bioHu?: string;
  bioEn?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  image?: SanityImageRef;
  imagePath?: string;
  order?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: SanityPerformerTag[];
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
  heroTitleHu?: string;
  heroTitleEn?: string;
  heroDescriptionHu?: string;
  heroDescriptionEn?: string;
  pageBodyHu?: string;
  pageBodyEn?: string;
  showSecondBody?: boolean;
  pageBody2Hu?: string;
  pageBody2En?: string;
  programDisplayMode?: "structured" | "freeText" | "both";
  programBodyHu?: string;
  programBodyEn?: string;
  primaryButtonLabelHu?: string;
  primaryButtonLabelEn?: string;
  primaryButtonUrlHu?: string;
  primaryButtonUrlEn?: string;
  secondaryButtonLabelHu?: string;
  secondaryButtonLabelEn?: string;
  secondaryButtonUrlHu?: string;
  secondaryButtonUrlEn?: string;
  isActive?: boolean;
  seo?: SeoFields;
};

export type SanityTicket = {
  _id: string;
  nameHu?: string;
  nameEn?: string;
  descriptionHu?: string;
  descriptionEn?: string;
  price?: string;
  currency?: string;
  ticketUrlHu?: string;
  ticketUrlEn?: string;
  badgeHu?: string;
  badgeEn?: string;
  isAvailable?: boolean;
  isHidden?: boolean;
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
  descriptionHu?: string;
  descriptionEn?: string;
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
  name?: string;
  descriptionHu?: string;
  descriptionEn?: string;
  image?: SanityImageRef;
  imagePath?: string;
  websiteUrl?: string;
  bookingUrl?: string;
  distanceHu?: string;
  distanceEn?: string;
  order?: number;
  isActive?: boolean;
};

export type SanityTransportItem = {
  _id: string;
  titleHu?: string;
  titleEn?: string;
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
  mapEmbedUrl?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  descriptionHu?: string;
  descriptionEn?: string;
};
