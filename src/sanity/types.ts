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
  isEnabled?: boolean;
  image?: SanityImageRef;
  imagePath?: string;
  altHu?: string;
  altEn?: string;
  sessionStorageKey?: string;
  showOnlyOnHomepage?: boolean;
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
