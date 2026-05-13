# Portable Text Migration Guide

This guide explains how to migrate existing plain text content to the new Portable Text (Rich Text) format.

## Overview

The migration script converts plain text fields to Portable Text blocks, which enables rich text editing with controlled formatting (bold, italic, links, lists, headings, blockquotes, callout blocks).

## Prerequisites

1. **Sanity API Write Token**: You need a write-enabled Sanity token
   - Go to https://www.sanity.io/manage
   - Select your project and navigate to API > Tokens
   - Create a new token with 'Editor' or 'Administrator' role
   - Add it to your `.env.local` file: `SANITY_API_WRITE_TOKEN=your_token_here`
   - **SECURITY WARNING**: Never commit `SANITY_API_WRITE_TOKEN` to version control

2. **Environment Variables**: Ensure your `.env.local` file contains:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=your_write_token
   ```

## Usage

### Dry Run (Preview Changes)

Run the script in dry-run mode to preview what will be migrated:

```bash
npx tsx scripts/migrateToPortableText.ts --dry-run
```

This will:
- Fetch all pages, performers, and camp schedule blocks
- Show which fields will be migrated
- Display the number of paragraphs/lines to be converted
- **NOT make any changes to Sanity**

### Apply Changes

After reviewing the dry-run output, apply the changes:

```bash
npx tsx scripts/migrateToPortableText.ts --apply
```

This will:
- Convert plain text to Portable Text blocks
- Write the new rich text fields to Sanity
- Preserve the original plain text fields (for rollback)
- **Make actual changes to Sanity**

## What Gets Migrated

### Pages

The script migrates the following fields for all active pages:

- `pageBodyHu/En` → `pageBodyRichHu/En`
- `pageBody2Hu/En` → `pageBody2RichHu/En`
- `programBodyHu/En` → `programBodyRichHu/En`

### Camp Schedule Blocks

The script migrates camp schedule block bullets:

- `bulletsHu/En` → `bulletsRichHu/En`

Each line becomes a separate Portable Text block.

### Performers

The script migrates performer bios:

- `bioHu/En` → `bioRichHu/En`

## Conversion Rules

- **Double newlines** = new paragraph
- **Single newlines** = preserved within paragraph
- **Does NOT auto-convert** bullet lists or other formatting (too risky)
- **Skips documents** that already have rich text content in the target field

## After Migration

1. **Review in Sanity Studio**: Open Sanity Studio and check the migrated documents
2. **Test on frontend**: Verify rich text rendering on the website
3. **Publish changes**: Publish the migrated documents in Sanity Studio
4. **Optional cleanup**: After confirming everything works, you can remove the old plain text fields

## Rollback

If something goes wrong, the original plain text fields are preserved. To rollback:

1. In Sanity Studio, delete the `*Rich*` fields (e.g., `pageBodyRichHu`)
2. The frontend will automatically fall back to the plain text fields

## Troubleshooting

### Missing projectId Error

```
❌ ERROR: Missing Sanity projectId
Check .env.local and env variable names (NEXT_PUBLIC_SANITY_PROJECT_ID)
```

**Fix**: Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in your `.env.local` file.

### Missing dataset Error

```
❌ ERROR: Missing Sanity dataset
Check .env.local and env variable names (NEXT_PUBLIC_SANITY_DATASET)
```

**Fix**: Ensure `NEXT_PUBLIC_SANITY_DATASET` is set in your `.env.local` file.

### Missing Token Error

```
❌ ERROR: Missing SANITY_API_WRITE_TOKEN
Required for apply mode
```

**Fix**: Add `SANITY_API_WRITE_TOKEN` to your `.env.local` file (see Prerequisites above).

### Permission Error

If you get a permission error during apply mode:

1. Verify the token has 'Editor' or 'Administrator' role
2. Ensure the token is for the correct project
3. Check that the token hasn't expired

## Example Output

```
====================================
Portable Text Migration Script
====================================
Mode: DRY RUN (no changes will be made)

Configuration:
  Project ID: ajkz39i8
  Dataset: production
  API Version: 2024-01-01
  Migration Token: ✓ Present
====================================

🚀 Starting Portable Text migration...

📄 Migrating pages...
  - page-aszf: pageBodyHu -> pageBodyRichHu
  - page-aszf: pageBodyEn -> pageBodyRichEn
  - page-contact: pageBodyHu -> pageBodyRichHu
  ...
  Migrated 5 pages

🏕️  Migrating camp schedule blocks...
  - Block camp-sched-0: bulletsHu -> bulletsRichHu (8 lines)
  - Block camp-sched-0: bulletsEn -> bulletsRichEn (8 lines)
  ...
  Migrated 1 camp blocks

🎤 Migrating performers...
  - Bérczesi Jazz Band (performer-1): bioHu -> bioRichHu
  - Bérczesi Jazz Band (performer-1): bioEn -> bioRichEn
  ...
  Migrated 21 performers

✅ Migration completed!
```

## Security Notes

- The migration token is never logged in full
- Only a "✓ Present" / "✗ Missing" indicator is shown
- Never commit `.env.local` to version control
- Rotate tokens regularly if they're exposed
