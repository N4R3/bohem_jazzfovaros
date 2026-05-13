# Manual Migration TODO

This document lists items that were skipped by the automated migration script and require manual action in Sanity Studio.

**Last updated:** May 13, 2026

---

## Skipped Performer Members

The automated migration script skipped the following performers because they have no lineup data in the hardcoded `performerDetailsHu` object in `src/app/lineup/page.tsx`.

### Priority 1: The Carling Sisters (S) - HIGH PRIORITY

**⚠️ ORIGINAL CLIENT COMPLAINT:** This performer was specifically mentioned in client feedback as having issues with band member display.

**Sanity document:** Performer document with name "The Carling Sisters (S) soprano sax, voc"

**Problem:** The performer name in Sanity includes extra details ("soprano sax, voc") that don't match the hardcoded lookup key "Nanna Carling" in `performerDetailsHu`.

**Required action:**
1. Open Sanity Studio
2. Find the Performer document with name "The Carling Sisters (S) soprano sax, voc"
3. Clean up the performer name to "The Carling Sisters" (remove instrument details from name)
4. Add members array with the following structure:
   ```json
   {
     "members": [
       {
         "nameHu": "Nanna Carling",
         "nameEn": "Nanna Carling",
         "roleHu": "",
         "roleEn": "",
         "instrumentHu": "soprano sax, voc",
         "instrumentEn": "soprano sax, voc",
         "showAsStandalonePerformer": false,
         "order": 0
       }
     ]
   }
   ```

**Decision needed:** Determine if this should be a single performer entry or if "The Carling Sisters" should be a separate entry from "Nanna Carling". If they should be separate, create a new Performer document and link them appropriately.

---

### Priority 2: Festival All Stars - MEDIUM PRIORITY

**Sanity document:** Performer document with name "Festival All Stars"

**Problem:** The `performerDetailsHu` object has an entry for "Festival All Stars" but it has no `lineup` array (empty or missing).

**Reason:** Festival All Stars is described as "Nemzetközi all-stars projekt magyar és külföldi vendégművészekkel, külön pénteki és szombati felállással" (International all-stars project with Hungarian and foreign guest artists, separate Friday and Saturday lineups). This means the lineup changes by day, making it difficult to hardcode a static member list.

**Required action:**
1. Open Sanity Studio
2. Find the Performer document with name "Festival All Stars"
3. Decide on one of the following approaches:
   
   **Option A - Add generic members:**
   - Add a note in the description that lineup varies by day
   - Add members array with key recurring members if known
   - Set `showAsStandalonePerformer: true` for members who are also solo performers
   
   **Option B - Create separate performer documents:**
   - Create "Festival All Stars (Friday)" and "Festival All Stars (Saturday)" as separate performers
   - Add specific lineups to each
   - Link them programmatically or manually in the program schedule
   
   **Option C - Leave empty:**
   - Leave the members array empty
   - Add detailed description explaining the variable lineup
   - Members are shown in the program schedule instead

**Decision needed:** Choose one of the above approaches based on editorial preference.

---

### Priority 3: Swingtáncórák kezdőknek - LOW PRIORITY

**Sanity document:** Performer document with name "Swingtáncórák kezdőknek"

**Problem:** The `performerDetailsHu` object has an entry for "Swingtáncórák kezdőknek" but the lineup is a single entry: "Swingtáncórák kezdőknek" (the same as the performer name), which doesn't represent actual band members.

**Reason:** This is a workshop/activity, not a traditional music band. The "lineup" refers to the activity itself, not individual members.

**Required action:**
1. Open Sanity Studio
2. Find the Performer document with name "Swingtáncórák kezdőknek"
3. Decide on one of the following approaches:
   
   **Option A - Add instructors:**
   - Add members array with instructor names if known
   - Set `roleHu/roleEn` to "Instruktor" / "Instructor"
   - Set `instrumentHu/instrumentEn` to empty or "Workshop leader"
   
   **Option B - Leave empty:**
   - Leave the members array empty
   - Add detailed description that this is a workshop/activity
   - The activity itself is the "performer" in this case
   
   **Option C - Remove from lineup:**
   - Consider if this should be a Performer document at all
   - May be better represented as a Program item only

**Decision needed:** Choose one of the above approaches based on how the festival wants to display workshops.

---

### Priority 4: Nanna Carling - LOW PRIORITY

**Sanity document:** Performer document with name "Nanna Carling" (if it exists)

**Problem:** The `performerDetailsHu` object has an entry for "Nanna Carling" with a lineup of just "Nanna Carling" (no instruments specified). However, this may be a duplicate/conflict with "The Carling Sisters (S)".

**Reason:** Nanna Carling is a solo performer in the static data, but there may be confusion with the Carling Sisters group.

**Required action:**
1. Open Sanity Studio
2. Check if there are both "Nanna Carling" and "The Carling Sisters (S)" performer documents
3. If both exist:
   - Determine if they should be merged or kept separate
   - If separate, ensure each has appropriate member data
   - If they should be the same, merge them
4. If only one exists:
   - Ensure it has the correct name (either solo or group)
   - Add appropriate members array

**Decision needed:** Clarify the relationship between "Nanna Carling" (solo) and "The Carling Sisters" (group).

---

## Other Manual Actions Required

### Festival Map Image

**Sanity document:** Venue document

**Field:** `mapImage`

**Problem:** The static map image is a local file path (`/images/gallery/article-upload/7/901a43ed59ac4878d276b1b8a5b20640.jpg`). Sanity requires image assets to be uploaded directly.

**Required action:**
1. Open Sanity Studio
2. Go to Venue document
3. Click on the `mapImage` field
4. Upload the festival map image from local file system
5. Adjust crop/hotspot if needed

**File location:** `/images/gallery/article-upload/7/901a43ed59ac4878d276b1b8a5b20640.jpg`

---

### Transport Direction English Translations

**Sanity documents:** All transportItem documents

**Fields:** `titleEn`, `descriptionEn`

**Problem:** Static files only provide Hungarian transport directions. The script now sets English fields to empty strings to prevent incorrect automatic translations.

**Required action:**
1. Open Sanity Studio
2. Go to each transportItem document
3. Translate the following fields to English:
   - `titleEn` - Transport mode name (e.g., "Autóval" → "By Car")
   - `descriptionEn` - Directions text (full translation required)
4. Add `url` field if schedule links are available

**Transport items requiring translation:**
1. Autóval (By Car)
2. Vonattal (By Train)
3. Busszal (By Intercity Bus)
4. Autóbusszal (helyi) (By Local Bus)

**Note:** This requires professional translation to ensure accuracy and clarity for English-speaking visitors.

---

## Manual Review Checklist

After completing the manual actions above, verify the following:

### Sanity Studio Verification
- [ ] The Carling Sisters performer has correct name and members
- [ ] Festival All Stars has appropriate member strategy (generic members, separate entries, or empty)
- [ ] Swingtáncórák kezdőknek has appropriate member strategy (instructors, empty, or removed)
- [ ] Nanna Carling / Carling Sisters relationship is clarified
- [ ] Venue document has festival map image uploaded
- [ ] All transportItem documents have English translations
- [ ] All transportItem documents have schedule URLs if available

### Public Website Verification
- [ ] The Carling Sisters performer detail modal shows band members correctly
- [ ] Festival All Stars shows appropriate member information (or explains variable lineup)
- [ ] Swingtáncórák kezdőknek shows appropriate information (or is handled correctly)
- [ ] Map page displays festival map image correctly
- [ ] Map page transport directions display in both Hungarian and English

---

## Notes for Development Team

### Future Improvements

1. **Performer name normalization:** Consider implementing a name normalization strategy to handle cases where Sanity performer names include extra details (like instruments) that don't match static lookup keys.

2. **Variable lineup support:** Consider adding a "variableLineup" flag or similar mechanism for performers like Festival All Stars where the lineup changes by day.

3. **Workshop/activity distinction:** Consider adding a performer type or category to distinguish between traditional bands and workshops/activities.

4. **Translation workflow:** Implement a proper translation workflow for transport directions and other content that requires bilingual support.

### Data Quality Issues

The following data quality issues were identified during migration:

1. **Inconsistent naming:** Performer names in Sanity sometimes include instrument details (e.g., "The Carling Sisters (S) soprano sax, voc") which makes programmatic matching difficult.

2. **Missing data:** Some performers in `performerDetailsHu` lack lineup data, requiring manual research and entry.

3. **Translation gaps:** Static files only provide Hungarian content for some fields (transport directions), requiring manual English translation.

---

## Support

For questions or issues with manual migration tasks:
- Refer to `MIGRATION_SCRIPT_GUIDE.md` for migration script details
- Refer to `CLIENT_FEEDBACK_STATUS.md` for original client complaints
- Contact the development team for assistance
