import { seoType } from "./objects/seo";
import { siteSettingsType } from "./documents/siteSettings";
import { pageType } from "./documents/page";
import { performerType } from "./documents/performer";
import { performerTagType } from "./documents/performerTag";
import { programItemType } from "./documents/programItem";
import { stageType } from "./documents/stage";
import { ticketType } from "./documents/ticket";
import { sponsorType } from "./documents/sponsor";
import { sponsorCategoryType } from "./documents/sponsorCategory";
import { accommodationType } from "./documents/accommodation";
import { transportItemType } from "./documents/transportItem";
import { popupSettingsType } from "./documents/popupSettings";
import { venueType } from "./documents/venue";
import { navigationItemType } from "./documents/navigationItem";

export const schemaTypes = [
  siteSettingsType,
  popupSettingsType,
  navigationItemType,
  pageType,
  performerType,
  performerTagType,
  stageType,
  programItemType,
  ticketType,
  sponsorType,
  sponsorCategoryType,
  accommodationType,
  transportItemType,
  venueType,
  seoType,
];
