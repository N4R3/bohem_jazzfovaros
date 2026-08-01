export const getSiteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const getPopupSettingsQuery = `*[_type == "popupSettings"][0]{
  _id,
  _rev,
  isEnabled,
  image,
  imagePath,
  altHu,
  altEn,
  sessionStorageKey,
  showOnlyOnHomepage
}`;

export const getVenueQuery = `*[_type == "venue"][0]{
  _id,
  nameHu,
  nameEn,
  addressHu,
  addressEn,
  titleHu,
  titleEn,
  subtitleHu,
  subtitleEn,
  mapEmbedUrl,
  googleMapsUrl,
  latitude,
  longitude,
  descriptionHu,
  descriptionEn,
  descriptionRichHu,
  descriptionRichEn,
  mapImage,
  directionsHeadingHu,
  directionsHeadingEn
}`;

export const PERFORMER_PROJECTION = `{
  _id,
  name,
  slug,
  ticketUrlHu,
  ticketUrlEn,
  cardBackgroundVariant,
  shortDescriptionRichHu,
  shortDescriptionRichEn,
  bioRichHu,
  bioRichEn,
  websiteUrl,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  spotifyUrl,
  image,
  imagePath,
  imageDisplayMode,
  order,
  isFeatured,
  isActive,
  tags[]->{_id, titleHu, titleEn, slug, order, isActive},
  members[]{
    nameHu,
    nameEn,
    roleHu,
    roleEn,
    instrumentHu,
    instrumentEn,
    countryCode,
    countryNameHu,
    countryNameEn,
    showAsStandalonePerformer,
    order,
  },
  seo,
}`;

export const getPerformersQuery = `*[_type == "performer"] | order(order asc) ${PERFORMER_PROJECTION}`;

export const getFeaturedPerformersQuery = `*[_type == "performer" && isActive == true && isFeatured == true] | order(order asc) ${PERFORMER_PROJECTION}`;

export const getProgramItemsQuery = `*[_type == "programItem" && isActive == true] | order(date asc, startTime asc, order asc) {
  _id,
  titleHu,
  titleEn,
  eventTitleHu,
  eventTitleEn,
  descriptionHu,
  descriptionEn,
  descriptionRichHu,
  descriptionRichEn,
  detailsRichHu,
  detailsRichEn,
  ticketUrlHu,
  ticketUrlEn,
  date,
  startTime,
  endTime,
  stage,
  "stageRef": stageRef->{ _id, nameHu, nameEn, slug },
  category,
  performers[]->{
    _id,
    name,
    slug
  },
  order,
  isActive,
  seo
}`;

export const getProgramItemsLightQuery = `*[_type == "programItem" && isActive == true] | order(date asc, startTime asc, order asc) {
  _id,
  titleHu,
  titleEn,
  date,
  startTime,
  stage,
  "stageRef": stageRef->{ _id, nameHu, nameEn },
  performers[]->{ _id }
}`;

export const getPerformerTicketUrlsQuery = `*[_type == "performer" && isActive == true]{
  _id,
  ticketUrlHu,
  ticketUrlEn
}`;

export const getStagesQuery = `*[_type == "stage" && isActive == true] | order(order asc) { _id, nameHu, nameEn, slug, order, isActive }`;

export const getPerformerTagsQuery = `*[_type == "performerTag" && isActive == true] | order(order asc) { _id, titleHu, titleEn, slug, order, isActive }`;

export const getNavigationItemsQuery = `*[_type == "navigationItem" && isActive == true] | order(order asc) {
  _id,
  labelHu,
  labelEn,
  order,
  isActive,
  showInHeader,
  showInFooter,
  openInNewTab,
  href,
  externalUrl,
  "page": page->{ _id, slug, titleHu, titleEn, isActive },
  "parent": parent->{ _id, labelHu, labelEn }
}`;

export const getActivePageBySlugQuery = `*[_type == "page" && slug.current == $slug && isActive == true][0]{
  _id,
  titleHu,
  titleEn,
  slug,
  videoUrl,
  videoTitleHu,
  videoTitleEn,
  homeHeroTitleHu,
  homeHeroTitleEn,
  homeHeroSubtitleHu,
  homeHeroSubtitleEn,
  homeHeroLeadHu,
  homeHeroLeadEn,
  homePrimaryCtaTextHu,
  homePrimaryCtaTextEn,
  homePrimaryCtaUrl,
  homeSecondaryCtaTextHu,
  homeSecondaryCtaTextEn,
  homeSecondaryCtaUrl,
  homeStats[]{ value, labelHu, labelEn, icon },
  homeCtaBannerTitleHu,
  homeCtaBannerTitleEn,
  homeCtaBannerTextHu,
  homeCtaBannerTextEn,
  homeCtaBannerButtonTextHu,
  homeCtaBannerButtonTextEn,
  homeCtaBannerButtonUrl,
  heroTitleHu,
  heroTitleEn,
  heroDescriptionRichHu,
  heroDescriptionRichEn,
  introNoteRichHu,
  introNoteRichEn,
  pageBodyRichHu,
  pageBodyRichEn,
  showSecondBody,
  pageBody2RichHu,
  pageBody2RichEn,
  programDisplayMode,
  programBodyRichHu,
  programBodyRichEn,
  showProgramTableDesktop,
  showProgramTableMobile,
  showProgramTextDesktop,
  showProgramTextMobile,
  desktopProgramOrder,
  mobileProgramOrder,
  primaryButtonLabelHu,
  primaryButtonLabelEn,
  primaryButtonUrlHu,
  primaryButtonUrlEn,
  secondaryButtonLabelHu,
  secondaryButtonLabelEn,
  secondaryButtonUrlHu,
  secondaryButtonUrlEn,
  campEyebrowHu,
  campEyebrowEn,
  campScheduleSectionTitleHu,
  campScheduleSectionTitleEn,
  campScheduleBlocks[]{ titleHu, titleEn, displayMode, bulletsRichHu, bulletsRichEn },
  campSupportersSectionTitleHu,
  campSupportersSectionTitleEn,
  campSupporters[]{ nameHu, nameEn, url },
  runningEyebrowHu,
  runningEyebrowEn,
  runningFreeEntryBannerRichHu,
  runningFreeEntryBannerRichEn,
  runningCardDateHu,
  runningCardDateEn,
  runningCardTime,
  runningCardLocationRichHu,
  runningCardLocationRichEn,
  runningDistancesSectionTitleHu,
  runningDistancesSectionTitleEn,
  runningDistanceRows[]{ categoryHu, categoryEn, distanceHu, distanceEn, feeHu, feeEn },
  runningEntryDeadlineRichHu,
  runningEntryDeadlineRichEn,
  runningResultsNoteRichHu,
  runningResultsNoteRichEn,
  ticketNoteRichHu,
  ticketNoteRichEn,
  infoFaqItems[]{
    questionHu,
    questionEn,
    answerRichHu,
    answerRichEn,
  },
  sections[]{
    ...,
    videoRef->{
      _id,
      titleHu,
      titleEn,
      descriptionHu,
      descriptionEn,
      videoUrl,
      thumbnail,
      size,
      enabled,
      order,
      ctaTextHu,
      ctaTextEn,
      ctaUrl
    }
  },
  isActive,
  seo
}`;

export const getPageQuery = `*[_type == "page" && slug.current == $slug && isActive != false][0]{
  _id,
  titleHu,
  titleEn,
  slug,
  heroTitleHu,
  heroTitleEn,
  heroDescriptionRichHu,
  heroDescriptionRichEn,
  introNoteRichHu,
  introNoteRichEn,
  pageBodyRichHu,
  pageBodyRichEn,
  pageBody2RichHu,
  pageBody2RichEn,
  programDisplayMode,
  programBodyRichHu,
  programBodyRichEn,
  showSecondBody,
  campEyebrowHu,
  campEyebrowEn,
  campScheduleSectionTitleHu,
  campScheduleSectionTitleEn,
  campScheduleBlocks[]{
    titleHu,
    titleEn,
    displayMode,
    bulletsRichHu,
    bulletsRichEn,
  },
  campSupportersSectionTitleHu,
  campSupportersSectionTitleEn,
  campSupporters[]{
    nameHu,
    nameEn,
    url,
  },
  runningEyebrowHu,
  runningEyebrowEn,
  runningFreeEntryBannerRichHu,
  runningFreeEntryBannerRichEn,
  runningCardDateHu,
  runningCardDateEn,
  runningCardTime,
  runningCardLocationRichHu,
  runningCardLocationRichEn,
  runningDistancesSectionTitleHu,
  runningDistancesSectionTitleEn,
  runningDistanceRows[]{
    categoryHu,
    categoryEn,
    distanceHu,
    distanceEn,
    feeHu,
    feeEn,
  },
  runningEntryDeadlineRichHu,
  runningEntryDeadlineRichEn,
  runningResultsNoteRichHu,
  runningResultsNoteRichEn,
  primaryButtonLabelHu,
  primaryButtonLabelEn,
  primaryButtonUrlHu,
  primaryButtonUrlEn,
  secondaryButtonLabelHu,
  secondaryButtonLabelEn,
  secondaryButtonUrlHu,
  secondaryButtonUrlEn,
  seo,
}`;

export const getAllActivePageSlugsQuery = `*[_type == "page" && isActive == true && defined(slug.current)].slug.current`;

/** Extended variant with locale availability flags — used by generateStaticParams for locale-aware filtering. */
export const getAllActivePageSlugsWithLocaleQuery = `*[_type == "page" && isActive == true && defined(slug.current)]{
  "slug": slug.current,
  "hasHu": defined(titleHu) && titleHu != "",
  "hasEn": defined(titleEn) && titleEn != ""
}`;

export const getSitemapPagesQuery = `*[_type == "page" && isActive == true && defined(slug.current)]{
  "slug": slug.current,
  "_updatedAt": _updatedAt,
  "noIndex": seo.noIndex,
  "hasHu": defined(titleHu) && titleHu != "",
  "hasEn": defined(titleEn) && titleEn != ""
}`;

export const getTicketsQuery = `*[_type == "ticket"] | order(order asc)`;

/** Tickets shown in the homepage ticket boxes — must have showOnHome=true, not hidden, available. */
export const getHomeTicketsQuery = `*[_type == "ticket" && isHidden != true && isAvailable == true && showOnHome == true] | order(homeOrder asc, order asc){
  _id,
  nameHu,
  nameEn,
  descriptionHu,
  descriptionEn,
  price,
  currency,
  ticketUrlHu,
  ticketUrlEn,
  ctaTextHu,
  ctaTextEn,
  ctaUrl,
  showOnHome,
  homeOrder,
  isAvailable,
  isHidden
}`;

export const getVisibleTicketsQuery = `*[_type == "ticket" && isHidden != true && isAvailable == true] | order(order asc){
  _id,
  nameHu,
  nameEn,
  descriptionHu,
  descriptionEn,
  descriptionRichHu,
  descriptionRichEn,
  price,
  currency,
  ticketUrlHu,
  ticketUrlEn,
  badgeHu,
  badgeEn,
  ctaTextHu,
  ctaTextEn,
  ctaUrl,
  isFeatured,
  isAvailable,
  isHidden,
  order
}`;

export const getSponsorsGroupedByCategoryQuery = `*[_type == "sponsorCategory"] | order(order asc) {
  _id,
  titleHu,
  titleEn,
  order,
  "sponsors": *[_type == "sponsor" && isActive == true && references(^._id)] | order(order asc) {
    _id,
    name,
    logo,
    logoPath,
    url,
    order,
    isActive
  }
}`;

export const getAccommodationItemsQuery = `*[_type == "accommodation" && isActive == true] | order(order asc) {
  _id,
  name,
  descriptionHu,
  descriptionEn,
  descriptionRichHu,
  descriptionRichEn,
  bodyRichHu,
  bodyRichEn,
  ctaTextHu,
  ctaTextEn,
  ctaUrl,
  priceHu,
  priceEn,
  stars,
  image,
  imagePath,
  websiteUrl,
  bookingUrl,
  bookingLabelHu,
  bookingLabelEn,
  distanceHu,
  distanceEn,
  order,
  isActive
}`;

export const getTransportItemsQuery = `*[_type == "transportItem" && isActive == true] | order(order asc)`;

export const getPageBySlugQuery = `*[_type == "page" && slug.current == $slug && isActive == true][0]{
  titleHu,
  titleEn,
  seo
}`;

export const getEnabledVideosQuery = `*[_type == "video" && enabled == true] | order(order asc) {
  _id,
  titleHu,
  titleEn,
  videoUrl,
  size,
  enabled,
  order,
  ctaTextHu,
  ctaTextEn,
  ctaUrl,
  thumbnail,
  "displayOnPages": displayOnPages[]->slug.current
}`;
