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

export const getVenueQuery = `*[_type == "venue"][0]`;

const PERFORMER_PROJECTION = `{
  _id,
  name,
  slug,
  image,
  imagePath,
  shortDescriptionHu,
  shortDescriptionEn,
  bioHu,
  bioEn,
  websiteUrl,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  spotifyUrl,
  order,
  isFeatured,
  isActive,
  "tags": tags[]->{ _id, titleHu, titleEn, order, isActive },
  seo
}`;

export const getPerformersQuery = `*[_type == "performer" && isActive == true] | order(order asc) ${PERFORMER_PROJECTION}`;

export const getFeaturedPerformersQuery = `*[_type == "performer" && isActive == true && isFeatured == true] | order(order asc) ${PERFORMER_PROJECTION}`;

export const getProgramItemsQuery = `*[_type == "programItem" && isActive == true] | order(date asc, startTime asc, order asc) {
  _id,
  titleHu,
  titleEn,
  descriptionHu,
  descriptionEn,
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
  heroTitleHu,
  heroTitleEn,
  heroDescriptionHu,
  heroDescriptionEn,
  pageBodyHu,
  pageBodyEn,
  programDisplayMode,
  programBodyHu,
  programBodyEn,
  primaryButtonLabelHu,
  primaryButtonLabelEn,
  primaryButtonUrlHu,
  primaryButtonUrlEn,
  secondaryButtonLabelHu,
  secondaryButtonLabelEn,
  secondaryButtonUrlHu,
  secondaryButtonUrlEn,
  isActive,
  seo
}`;

export const getAllActivePageSlugsQuery = `*[_type == "page" && isActive == true && defined(slug.current)].slug.current`;

export const getTicketsQuery = `*[_type == "ticket"] | order(order asc)`;

export const getVisibleTicketsQuery = `*[_type == "ticket" && isHidden != true && isAvailable == true] | order(order asc)`;

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
  image,
  imagePath,
  websiteUrl,
  bookingUrl,
  distanceHu,
  distanceEn,
  order,
  isActive
}`;

export const getTransportItemsQuery = `*[_type == "transportItem" && isActive == true] | order(order asc)`;

export const getPageBySlugQuery = `*[_type == "page" && slug.current == $slug && isActive == true][0]`;
