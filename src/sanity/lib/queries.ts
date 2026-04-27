export const getSiteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const getPopupSettingsQuery = `*[_type == "popupSettings"][0]{
  _id,
  isEnabled,
  image,
  imagePath,
  altHu,
  altEn,
  sessionStorageKey,
  showOnlyOnHomepage
}`;

export const getVenueQuery = `*[_type == "venue"][0]`;

export const getPerformersQuery = `*[_type == "performer" && isActive == true] | order(order asc) {
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
  seo
}`;

export const getFeaturedPerformersQuery = `*[_type == "performer" && isActive == true && isFeatured == true] | order(order asc) {
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
  seo
}`;

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
