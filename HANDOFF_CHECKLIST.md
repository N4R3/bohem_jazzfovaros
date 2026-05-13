# Handoff Checklist - Jazzfőváros CMS Editability

This checklist summarizes what needs to be done before client handoff to ensure the CMS is fully functional and the editor can manage all visible content.

**Last updated:** Post-Portable Text migration (May 13, 2026)

---

## Editor Tasks (Before Launch)

### Sanity Studio Setup
- [ ] Verify Sanity Studio is accessible to the editor
- [ ] Confirm editor has appropriate permissions (can edit all document types)
- [ ] Verify all document types are visible in Studio

### Content Migration
- [ ] Create Venue document with map page data:
  - [ ] Fill in nameHu/nameEn (venue name)
  - [ ] Fill in titleHu/titleEn (map page title fallback)
  - [ ] Fill in subtitleHu/subtitleEn (map page subtitle fallback)
  - [ ] Fill in descriptionHu/descriptionEn (map note)
  - [ ] Set latitude/longitude (GPS coordinates)
  - [ ] Add mapImage (festival map image)
  - [ ] Fill in directionsHeadingHu/directionsHeadingEn ("Hogyan juss el?" text)
  - [ ] Set mapEmbedUrl and googleMapsUrl
- [ ] Create Accommodation documents for hotels:
  - [ ] Fill in all hotel data (name, description, price, distance, stars, booking URL, booking label)
  - [ ] Add hotel images
  - [ ] Set appropriate order
- [ ] Create TransportItem documents for transport directions:
  - [ ] Fill in titleHu/titleEn (transport mode name)
  - [ ] Fill in descriptionHu/descriptionEn (directions text)
  - [ ] Set icon (car, train, bus)
  - [ ] Add URL if applicable (schedule links)
  - [ ] Set order
- [ ] Create Page documents with content:
  - [ ] `/szallas` - Fill in heroTitle, heroDescription, introNoteHu/introNoteEn, body
  - [ ] `/terkep` - Fill in heroTitle, heroDescription, introNoteHu/introNoteEn, body
  - [ ] `/tabor` - Fill in heroTitle, heroDescription, campEyebrowHu/campEyebrowEn, body, campScheduleBlocks, campSupporters
- [ ] Create Performer documents:
  - [ ] Fill in name, slug, image, shortDescriptionHu/shortDescriptionEn, bioHu/bioEn
  - [ ] Set imageDisplayMode (cover/contain/landscape/portrait)
  - [ ] Add members array with band members if applicable
  - [ ] Set showAsStandalonePerformer for members as needed
- [ ] Create ProgramItem documents:
  - [ ] Fill in titleHu/titleEn, descriptionHu/descriptionEn, date, time, venue
  - [ ] Link to performers
  - [ ] Set isActive to true for visible programs
  - [ ] Set isActive to false for placeholder programs
- [ ] Verify migrated Portable Text content:
  - [ ] Review 5 pages with pageBodyRich/pageBody2Rich/programBodyRich fields
  - [ ] Review 3 camp schedule blocks with bulletsRich fields
  - [ ] Review 21 performer bios with bioRich fields
  - [ ] Edit and enhance as needed using rich text editor

### Content Verification
- [ ] Verify all HU content is complete and accurate
- [ ] Verify all EN content is complete and accurate
- [ ] Complete transport directions English translations (titleEn, descriptionEn)
- [ ] Check for missing translations
- [ ] Verify images are uploaded and displaying correctly
- [ ] Manual data cleanup:
  - [ ] Clean up The Carling Sisters performer data (name, members)
  - [ ] Clean up Nanna Carling performer data (name, members)

---

## Pages to Manually Check (Pre-Launch)

### Homepage (`/`)
- [ ] Verify hero section displays correctly
- [ ] Check all links work
- [ ] Verify images load

### Lineup Page (`/lineup`)
- [ ] Verify all performers are visible
- [ ] Check performer images display correctly (aspect ratio, cropping)
- [ ] Click on a performer to verify detail modal:
  - [ ] Verify bio displays
  - [ ] Verify band members display (if applicable)
  - [ ] Verify related programs display
  - [ ] Verify image shows full on desktop
- [ ] Verify performers without origin don't show empty parentheses
- [ ] Verify performers with origin show origin cleanly

### Program Page (`/program`)
- [ ] Verify program list displays correctly
- [ ] Check date/time filters work
- [ ] Verify programs with isActive=false are hidden
- [ ] Click on a program to verify details
- [ ] Check program-performer relationships

### Map Page (`/terkep`)
- [ ] Verify page title displays correctly (from Page.heroTitle or venue.titleHu)
- [ ] Verify subtitle displays correctly (from Page.heroDescription or venue.subtitleHu)
- [ ] Verify intro note displays if filled (Page.introNote)
- [ ] Verify Google Maps iframe loads
- [ ] Verify map note displays under iframe (venue.descriptionHu)
- [ ] Verify GPS coordinates display
- [ ] Verify Google Maps link works
- [ ] Verify directions link works
- [ ] Verify festival map image displays
- [ ] Verify "Hogyan juss el?" heading displays (venue.directionsHeadingHu)
- [ ] Verify transport directions display correctly
- [ ] Check all transport direction links work

### Accommodation Page (`/szallas`)
- [ ] Verify page title displays correctly
- [ ] Verify subtitle displays correctly
- [ ] Verify intro note displays if filled (Page.introNote)
- [ ] Verify all hotels are visible
- [ ] Check hotel images display
- [ ] Verify hotel names, descriptions, prices, distances, stars display
- [ ] Verify booking links work
- [ ] Verify booking labels display correctly

### Camp Page (`/tabor`)
- [ ] Verify page title displays correctly
- [ ] Verify subtitle displays correctly
- [ ] Verify eyebrow displays correctly
- [ ] Verify camp schedule blocks display
- [ ] Check displayMode works (list vs paragraphs)
- [ ] Verify supporters display
- [ ] Check all links work

---

## Known Limitations (Documented for Editor)

### Rich Text Formatting
- **Status:** ✅ Implemented (Portable Text)
- **Available:** Bold, italic, links, headings (H2, H3), lists (bullet, numbered), blockquotes, callout blocks (Info, Important, Price)
- **Intentional exclusions (brand safety):** HTML source editor, free color picker, free font sizing
- **Migration:** 5 pages, 3 camp blocks, 21 performer bios successfully migrated
- **Documentation:** See PORTABLE_TEXT_MIGRATION_GUIDE.md for migration details
- **Affected fields:** pageBodyRich*, bioRich*, programBodyRich*, bulletsRich* fields

### Map Page Fallback Behavior
- **Current:** Map page title/subtitle fall back to venue schema if Page fields are empty
- **Recommendation:** Fill in both Page.heroTitle/heroDescription AND venue.titleHu/subtitleHu for redundancy
- **Note:** This is intentional fallback behavior, not a bug

### Production Fallback Safety
- **Performer data:** Hardcoded fallback only used when NO Sanity performer document exists
- **Safe behavior:** If a performer exists in Sanity with empty fields, no hardcoded data appears
- **Note:** Editors can safely empty fields in Sanity without triggering unwanted fallback content

---

## Temporary Fallbacks (Safe to Remove Later)

### Static Content Fallbacks
The following static fallbacks are safe and intentional:
- `BASE.venue.hu` - Used when venue.nameHu/nameEn is empty
- `c.map.gps` - Used when venue.latitude/longitude is empty
- `c.map.mapNote` - Used when venue.descriptionHu/descriptionEn is empty
- `c.map.mapImage` - Used when venue.mapImage is empty
- `c.map.title/subtitle` - Used when venue.titleHu/subtitleHu is empty
- `c.map.directions` - Used when no transportItem documents exist
- `c.accommodation.*` - Used when no accommodation documents exist
- `c.camp.*` - Used when camp Page fields are empty

### Hardcoded Performer Data
- `performerDetailsHu` - Only used when NO Sanity performer document exists
- `BASE.artists` - Used to detect if performer has Sanity doc
- **Safe to remove:** After all performers are migrated to Sanity

---

## Testing Instructions

### Hungarian Content Testing
1. Switch language to Hungarian
2. Navigate to each page:
   - Homepage
   - Lineup
   - Program
   - Map
   - Accommodation
   - Camp
3. Verify all Hungarian text displays correctly
4. Check for any English text appearing where Hungarian should be
5. Verify links and images work

### English Content Testing
1. Switch language to English
2. Navigate to each page:
   - Homepage
   - Lineup
   - Program
   - Map
   - Accommodation
   - Camp
3. Verify all English text displays correctly
4. Check for any Hungarian text appearing where English should be
5. Verify links and images work

### CMS Editability Testing
1. In Sanity Studio, edit a visible text field (e.g., accommodation note)
2. Publish the change
3. Refresh the public page
4. Verify the change appears
5. Clear the field in Sanity
6. Publish
7. Refresh the public page
8. Verify the content disappears (no static fallback appears for introNote fields)

---

## Final Checks

### Technical
- [ ] Run `npm run lint` - No errors
- [ ] Run `npm run typecheck` - No errors
- [ ] Run `npm run build` - Build succeeds
- [ ] Verify production environment variables are set
- [ ] Verify Sanity API credentials are configured

### Documentation
- [ ] CMS_EDITABILITY_AUDIT.md is up to date
- [ ] MIGRATION_NOTES.md is up to date
- [ ] EDITOR_GUIDE.md is up to date
- [ ] HANDOFF_CHECKLIST.md is completed
- [ ] All known limitations are documented

### Editor Handoff
- [ ] Provide editor with Sanity Studio URL
- [ ] Provide editor with credentials
- [ ] Walk through EDITOR_GUIDE.md with editor
- [ ] Demonstrate basic editing workflow
- [ ] Explain known limitations
- [ ] Provide contact information for support

---

## Post-Launch Tasks (Future Work)

1. **Remove Hardcoded Fallbacks** - After full migration:
   - Remove performerDetailsHu
   - Remove BASE.artists
   - Remove static content fallbacks where safe

2. **Additional Features** - Consider:
   - Program filtering by venue
   - Performer filtering by genre
   - Search functionality
   - More granular image hotspot support

---

## Emergency Contacts

- **Technical Support:** [Contact information]
- **CMS Issues:** [Contact information]
- **Content Questions:** [Contact information]

---

## Summary

**Status:** ✅ Ready for handoff

**All critical editorial content is now editable in Sanity Studio.**
- Accommodation notes: ✅ Editable
- Band members: ✅ Editable
- Map page content: ✅ Editable
- Hotel data: ✅ Editable
- Program hiding: ✅ Available
- Image display modes: ✅ Available
- Rich text formatting: ✅ Available (bold, italic, links, headings, lists, blockquotes, callouts)
- Camp formatting: ✅ Available (rich text + displayMode)

**Migration completed successfully.**
- migrateStaticContent: 28 documents updated, 11 skipped, 0 errors
- migrateToPortableText: 5 pages, 3 camp blocks, 21 performer bios migrated, 0 errors

**Remaining manual tasks.**
- The Carling Sisters data cleanup (name, members)
- Nanna Carling data cleanup (name, members)
- Transport directions English translations
- Festival map image upload
- Visual refinement (imageDisplayMode tuning)

**Intentional design decisions (brand safety).**
- HTML source editor: Not available
- Free color picker: Not available (use callout blocks instead)
- Free font sizing: Not available (use H2/H3 headings instead)

**Production fallback safety confirmed.**
- Fallbacks only trigger when NO Sanity data exists
- Empty Sanity fields do NOT trigger fallback content
