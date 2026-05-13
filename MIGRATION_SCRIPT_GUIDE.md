# Sanity Migration Script Guide

This guide explains how to use the static content migration script to migrate content from the static files to Sanity CMS.

**Script location:** `scripts/migrateStaticContent.ts`

**Last updated:** May 13, 2026

---

## Overview

The migration script migrates the following static content to Sanity CMS:

1. **Accommodation introNote** - From `src/content/hu.ts` and `src/content/en.ts` to Page document slug="szallas"
2. **Accommodation/hotel data** - From `src/content/base.ts` to accommodation documents
3. **Venue data** - From `src/content/base.ts`, `src/content/hu.ts`, and `src/content/en.ts` to venue document
4. **Transport directions** - From `src/content/hu.ts` to transportItem documents
5. **Performer members** - From `src/app/lineup/page.tsx` performerDetailsHu to performer documents

---

## Prerequisites

- Ensure Sanity CMS is accessible and configured
- Ensure `.env.local` file exists with Sanity credentials:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` (for project identification)
  - `NEXT_PUBLIC_SANITY_DATASET` (for dataset selection)
  - `SANITY_API_WRITE_TOKEN` (for write permissions - **required for --apply mode**)

### ⚠️ IMPORTANT: Write Token Required for Migration

The migration script requires a **server-side write token** to perform mutations in Sanity CMS. This is different from the read-only token used in the frontend.

**Why a separate token?**
- `NEXT_PUBLIC_*` tokens are exposed to the browser and should be read-only
- Migration script needs write permissions to update/create documents
- Using a write token in frontend code is a security risk

**How to create a write token:**
1. Go to https://www.sanity.io/manage
2. Select your project
3. Navigate to **API > Tokens**
4. Click **+ New API token**
5. Configure:
   - **Name**: "Migration Script" or similar
   - **Role**: "Editor" or "Administrator" (Editor is sufficient)
   - **Permissions**: Ensure "Write" permission is enabled
6. Click **Generate**
7. Copy the token (you won't see it again)

**Where to add the token:**
Add the token to your `.env.local` file:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=sk_your_write_token_here
```

**⚠️ SECURITY WARNING:**
- **NEVER** commit `SANITY_API_WRITE_TOKEN` to version control
- Add `.env.local` to `.gitignore` if not already there
- Treat the token like a password
- If the token is compromised, revoke it immediately in Sanity dashboard

**Common errors:**
- `403 Forbidden` - Token lacks write permissions or is invalid
- `Insufficient permissions; permission "update" required` - Token is read-only
- Next.js environment variables not loaded - Ensure `.env.local` is in project root

**Note:** The `--force` flag does NOT solve permission errors. If you get a 403 Forbidden error, you need to create a proper write token with Editor or Administrator role.

---

## Running the Migration

### CLI Flags

The migration script uses the following CLI flags:

- **--dry-run** (default behavior): Preview mode - shows what changes would be made without applying them
- **--apply**: Actual migration mode - applies changes to Sanity CMS
- **--force**: Force overwrite - can only be used with --apply, overwrites non-empty Sanity fields

### Flag Combinations

**Valid combinations:**
```bash
npx tsx scripts/migrateStaticContent.ts --dry-run
```
- Shows preview of all changes
- No changes made to Sanity
- Safe to run multiple times

```bash
npx tsx scripts/migrateStaticContent.ts --apply
```
- Applies changes to Sanity CMS
- Skips fields that already have content (safe mode)
- Does NOT overwrite existing data

```bash
npx tsx scripts/migrateStaticContent.ts --apply --force
```
- Applies changes to Sanity CMS
- Overwrites existing non-empty fields
- **Use with caution** - cannot be undone automatically

**Invalid combinations:**
```bash
# ERROR: Must specify either --dry-run or --apply
npx tsx scripts/migrateStaticContent.ts

# ERROR: Cannot specify both --dry-run and --apply
npx tsx scripts/migrateStaticContent.ts --dry-run --apply

# ERROR: --force can only be used with --apply
npx tsx scripts/migrateStaticContent.ts --force
```

### Recommended Workflow

1. **Set up write token:**
   - Create a write token in Sanity dashboard (see Prerequisites above)
   - Add `SANITY_API_WRITE_TOKEN` to `.env.local`
   - Verify the token has "Editor" or "Administrator" role

2. **First run (dry-run):**
   ```bash
   npx tsx scripts/migrateStaticContent.ts --dry-run
   ```
   Review the output carefully to see what will be migrated and what will be skipped.
   The script will verify read permissions but won't attempt any writes.

3. **Second run (apply - safe mode):**
   ```bash
   npx tsx scripts/migrateStaticContent.ts --apply
   ```
   Applies changes but skips any fields that already have content. This is the safest mode.
   The script will verify write permissions before attempting mutations.

4. **Third run (apply - force mode - only if needed):**
   ```bash
   npx tsx scripts/migrateStaticContent.ts --apply --force
   ```
   Only use if you want to overwrite existing Sanity data with static content. Use with caution.

**Script behavior:**
- On startup, the script logs configuration (projectId, dataset, token presence)
- Before mutations, it performs a permission smoke test
- If token is missing, the script exits with clear error message
- If token lacks write permissions, mutations will fail with 403 error

---

## Fields Migrated

### 1. Accommodation IntroNote

**Source:**
- `src/content/hu.ts` → `accommodation.note` → `Page.introNoteHu`
- `src/content/en.ts` → `accommodation.note` → `Page.introNoteEn`

**Target:** Page document with slug="szallas"

**Fields:**
- `introNoteHu` - Hungarian accommodation note
- `introNoteEn` - English accommodation note

**Behavior:**
- Skips if field already exists (unless --force)
- Creates if field is empty

---

### 2. Accommodation/Hotel Data

**Source:** `src/content/base.ts` → `BASE.accommodation.hotels`

**Additional descriptions from:**
- `src/content/hu.ts` → `hu.accommodation.hotels[].description`
- `src/content/en.ts` → `en.accommodation.hotels[].description`

**Target:** New accommodation documents (created if they don't exist)

**Fields:**
- `nameHu` - Hotel name (Hungarian)
- `nameEn` - Hotel name (English)
- `descriptionHu` - Hotel description (Hungarian)
- `descriptionEn` - Hotel description (English)
- `priceHu` - Price information (Hungarian)
- `priceEn` - Price information (English)
- `distanceHu` - Distance text (Hungarian)
- `distanceEn` - Distance text (English)
- `stars` - Star rating (0-4)
- `bookingUrl` - Booking URL
- `bookingLabelHu` - Button label (Hungarian)
- `bookingLabelEn` - Button label (English)
- `images` - Image array (from static files)
- `order` - Display order (default 0)
- `isActive` - Active status (true)

**Hotels migrated:**
1. Four Points by Sheraton Kecskemét
2. Hotel Aqua
3. Tó Kemping

**Behavior:**
- Skips if accommodation document already exists
- Does NOT overwrite existing accommodations
- Use --force to overwrite existing accommodations

---

### 3. Venue Data

**Source:**
- `src/content/base.ts` → `BASE.gps`, `BASE.mapImage`
- `src/content/hu.ts` → `map.title`, `map.subtitle`, `map.mapNote`
- `src/content/en.ts` → `map.title`, `map.subtitle`, `map.mapNote`

**Target:** Venue document (single document, updates if exists)

**Fields:**
- `titleHu` - Map page title (Hungarian)
- `titleEn` - Map page title (English)
- `subtitleHu` - Map page subtitle (Hungarian)
- `subtitleEn` - Map page subtitle (English)
- `descriptionHu` - Map note (Hungarian)
- `descriptionEn` - Map note (English)
- `directionsHeadingHu` - "Hogyan juss el?" heading (Hungarian)
- `directionsHeadingEn` - "How to get there?" heading (English)
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `mapEmbedUrl` - Google Maps embed URL (generated from GPS)
- `googleMapsUrl` - Google Maps link (generated from GPS)
- `mapImage` - Festival map image (requires manual upload)

**Behavior:**
- Skips if field already exists (unless --force)
- GPS and URLs are generated from static GPS coordinates
- mapImage is skipped (requires manual upload - see below)

---

### 4. Transport Directions

**Source:** `src/content/hu.ts` → `map.directions`

**Target:** New transportItem documents

**Fields:**
- `titleHu` - Transport mode name (Hungarian)
- `titleEn` - Transport mode name (English) - **EMPTY by default, requires manual translation**
- `descriptionHu` - Directions text (Hungarian)
- `descriptionEn` - Directions text (English) - **EMPTY by default, requires manual translation**
- `icon` - Icon type (car, train, bus)
- `url` - Schedule URL (empty by default)
- `order` - Display order (default 0)
- `isActive` - Active status (true)

**Transport modes migrated:**
1. Autóval (By Car)
2. Vonattal (By Train)
3. Busszal (By Intercity Bus)
4. Autóbusszal (helyi) (By Local Bus)

**Behavior:**
- Skips if transportItem documents already exist
- Does NOT overwrite existing transport items
- Use --apply --force to overwrite existing transport items

**⚠️ IMPORTANT - English Translations Required:**
- Static files only provide Hungarian transport directions
- The script sets `titleEn` and `descriptionEn` to empty strings
- **Manual English translation is required** for all transportItem documents
- See MANUAL_MIGRATION_TODO.md for detailed translation requirements

---

### 5. Performer Members

**Source:** `src/app/lineup/page.tsx` → `performerDetailsHu`

**Target:** Performer documents (updates if they exist)

**Fields:** `members` array with:
- `nameHu` - Member name (Hungarian)
- `nameEn` - Member name (English)
- `roleHu` - Member role (Hungarian)
- `roleEn` - Member role (English)
- `instrumentHu` - Instrument (Hungarian)
- `instrumentEn` - Instrument (English)
- `showAsStandalonePerformer` - Show as separate performer (false by default)
- `order` - Display order

**Member parsing:**
The script parses member strings like "Bérczesi Róbert (Hiperkarma) (voc, g)" to extract:
- Name: "Bérczesi Róbert"
- Nickname: "Hiperkarma" (if present)
- Instruments: "voc, g"

**Performers with members migrated:**
- Bérczesi Jazz Band (7 members)
- Bohém Ragtime Jazz Band (8 members)
- Bolba Éva (1 member)
- Clotile Yana (1 member)
- Cseh Balázs (1 member)
- Dániel Balázs (1 member)
- Dennert Árpád (1 member)
- Emanuele Urso "King of Swing" (1 member)
- Farkas Norbert (1 member)
- Farkas Péter "Bubu" (1 member)
- Gyárfás István (1 member)
- Hungarian Jazz Embassy (6 members)
- Hunter Burgamy (1 member)
- Jazz Camp All Stars (9 members)
- Ken Aoki (1 member)
- Korb Attila (1 member)
- Lukács Eszter (1 member)
- Nagy Iván (1 member)
- Pribojszki Mátyás (1 member)
- Sir Oliver Mally & Peter Schneider Duo (2 members)
- Szalóky Béla (1 member)
- Tom White & the Mad Circus (4 members)

**Behavior:**
- Skips if performer already has members (unless --force)
- Skips if performer not found in performerDetailsHu
- Skips if performerDetailsHu has no lineup data for that performer

---

## Items Requiring Manual Review/Action

### 1. Festival Map Image (venue.mapImage)

**Status:** ⚠️ Manual upload required

**Reason:** The static map image is a local file path (`/images/gallery/article-upload/7/901a43ed59ac4878d276b1b8a5b20640.jpg`). Sanity requires image assets to be uploaded directly.

**Action required:**
1. Open Sanity Studio
2. Go to Venue document
3. Upload the festival map image to the `mapImage` field
4. Alternatively, use the Sanity asset upload API

---

### 2. Transport Direction English Translations

**Status:** ⚠️ Manual editing required

**Reason:** Static files only provide Hungarian transport directions. The script uses Hungarian text for both HU and EN fields.

**Action required:**
1. Open Sanity Studio
2. Go to each transportItem document
3. Edit the `titleEn` and `descriptionEn` fields with proper English translations
4. Add `url` field if schedule links are available

---

### 3. Performers Not in performerDetailsHu

**Status:** ℹ️ Informational

**Performers skipped:**
- Festival All Stars (no lineup data in performerDetailsHu)
- Swingtáncórák kezdőknek (no lineup data in performerDetailsHu)
- Nanna Carling (name mismatch - Sanity has "Nanna Carling (S) soprano sax, voc" but performerDetailsHu has "Nanna Carling")
- The Carling Sisters (S) (not in performerDetailsHu)

**Action required:** Manual entry of member data for these performers if needed.

---

### 4. Existing Accommodation Documents

**Status:** ℹ️ Informational

**Behavior:** Script skips creating accommodation documents if they already exist.

**Action required:** If you want to overwrite existing accommodation data:
1. Delete existing accommodation documents in Sanity
2. Run the migration script again
3. Or use --force to overwrite (not recommended for accommodations)

---

### 5. Existing TransportItem Documents

**Status:** ℹ️ Informational

**Behavior:** Script skips creating transportItem documents if they already exist (4 found in dry-run).

**Action required:** If you want to overwrite existing transport data:
1. Delete existing transportItem documents in Sanity
2. Run the migration script again
3. Or use --force to overwrite (not recommended for transport items)

---

## Dry-Run Output Analysis

### Successful Migrations (Dry-Run)

From the dry-run test:

**Accommodation IntroNote:**
- ✓ Will set introNoteHu (Hungarian note)
- ✓ Will set introNoteEn (English note)

**Accommodation/Hotel Data:**
- ✓ Will create 3 accommodation documents (Four Points, Hotel Aqua, Tó Kemping)

**Venue Data:**
- ✓ Will set titleHu/titleEn
- ✓ Will set subtitleHu/subtitleEn
- ✓ Will set directionsHeadingHu/directionsHeadingEn
- ⚠️ SKIP: descriptionHu/descriptionEn already exists (shows document, field, existing value, incoming value, action)
- ⚠️ SKIP: GPS already exists (shows document, field, existing value, incoming value, action)
- ⚠️ SKIP: mapImage (manual upload required)
- ⚠️ SKIP: mapEmbedUrl/googleMapsUrl already exists (shows document, field, existing value, incoming value, action)

**Transport Directions:**
- ⚠️ SKIP: 4 transportItem documents already exist (shows document type, count, action, recommendation)
- ⚠️ WARNING: English fields will be empty - manual translation required

**Performer Members:**
- ✓ Will add members to 19 performers
- ⚠️ SKIP: 4 performers not in performerDetailsHu or already have members (shows document, field, reason)

### Improved Skip Messages

The updated script now provides detailed skip messages including:

- **Document type** (Page, Venue, Performer, transportItem)
- **Document identifier** (slug, name, _id)
- **Field name** (introNoteHu, titleHu, members, etc.)
- **Existing value preview** (first 50 characters)
- **Incoming value preview** (first 50 characters)
- **Action reason** (skipped because non-empty, no source data available, etc.)
- **Recommendation** (what to do next)

---

## Safety Features

### Dry-Run Mode
- Default mode
- Shows what would happen without making changes
- Safe to run multiple times

### Force Protection
- By default, skips fields that already have content
- Requires --force flag to overwrite existing content
- Prevents accidental data loss

### Logging
- Logs every update that would be made
- Logs every skip with reason
- Logs errors with context
- Provides summary statistics

### No Deletion
- Script never deletes static files
- Script never deletes Sanity documents
- Script never removes fallback code

---

## Post-Migration Checklist

After running the migration, verify the following:

### Sanity Studio
- [ ] Page document slug="szallas" has introNoteHu and introNoteEn
- [ ] 3 accommodation documents exist (Four Points, Hotel Aqua, Tó Kemping)
- [ ] Venue document has titleHu/titleEn, subtitleHu/subtitleEn
- [ ] Venue document has directionsHeadingHu/directionsHeadingEn
- [ ] TransportItem documents exist (or manually created)
- [ ] Performer documents have members arrays

### Manual Actions Required
- [ ] Upload festival map image to venue.mapImage
- [ ] Translate transport directions to English
- [ ] Add member data for performers skipped by migration
- [ ] Review and adjust accommodation data if needed
- [ ] Review and adjust venue data if needed

### Public Website Verification
- [ ] Accommodation page shows intro note
- [ ] Accommodation page shows hotel data
- [ ] Map page shows title/subtitle from venue
- [ ] Map page shows "Hogyan juss el?" heading
- [ ] Transport directions display correctly
- [ ] Performer detail modals show band members

---

## Troubleshooting

### Error: Configuration must contain `projectId`

**Cause:** Sanity environment variables not set

**Solution:** Ensure `.env.local` file exists with:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Error: Document not found

**Cause:** Target document doesn't exist in Sanity

**Solution:** Create the document in Sanity Studio first, then run migration

### Script skips all items

**Cause:** Items already exist in Sanity

**Solution:** Use --force flag to overwrite, or delete existing documents first

### Migration creates wrong data

**Cause:** Static content has incorrect values

**Solution:** Edit static files in `src/content/` and run migration again, or manually edit in Sanity Studio

---

## Rollback

If migration produces incorrect results:

1. **Manual rollback:** Edit or delete affected documents in Sanity Studio
2. **Fallback code:** The application still has fallback code, so clearing Sanity fields will restore static content
3. **No automatic rollback:** The script does not support automatic rollback

---

## Support

For issues or questions about the migration script:
- Check the script comments in `scripts/migrateStaticContent.ts`
- Review this documentation
- Contact the development team

---

## Summary

**Migration script location:** `scripts/migrateStaticContent.ts`

**Dry-run command:** `npx tsx scripts/migrateStaticContent.ts --dry-run`

**Force migration command:** `npx tsx scripts/migrateStaticContent.ts --force`

**Fields migrated:**
- Accommodation introNote (2 fields)
- Accommodation/hotel data (3 documents, ~11 fields each)
- Venue data (10 fields)
- Transport directions (4 documents, ~8 fields each)
- Performer members (19 performers, variable member counts)

**Manual actions required:**
- Upload festival map image
- Translate transport directions to English
- Add member data for skipped performers

**Safety features:**
- Dry-run mode by default
- Force protection (skips non-empty fields unless --force)
- Comprehensive logging
- No deletion of static files or Sanity documents
