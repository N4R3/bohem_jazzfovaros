import { seoType } from "./objects/seo";
import { siteSettingsType } from "./documents/siteSettings";
import { pageType } from "./documents/page";
import { performerType } from "./documents/performer";
import { programItemType } from "./documents/programItem";
import { ticketType } from "./documents/ticket";
import { sponsorType } from "./documents/sponsor";
import { sponsorCategoryType } from "./documents/sponsorCategory";
import { accommodationType } from "./documents/accommodation";
import { transportItemType } from "./documents/transportItem";
import { popupSettingsType } from "./documents/popupSettings";
import { venueType } from "./documents/venue";

export const schemaTypes = [
  siteSettingsType,
  popupSettingsType,
  pageType,
  performerType,
  programItemType,
  ticketType,
  sponsorType,
  sponsorCategoryType,
  accommodationType,
  transportItemType,
  venueType,
  seoType,
];
