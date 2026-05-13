# Editor Guide - Jazzfőváros / Jazztábor CMS

This guide explains how to edit the key content areas in the Sanity CMS.

---

## Accommodation Note (Szállás)

**Where to edit:** Page document with slug `szallas`

**Field:** `Kiemelt megjegyzés – HU` / `Kiemelt megjegyzés – EN`

**What it controls:** The highlighted yellow note block at the top of the accommodation page.

**Example content (HU):**
```
Fesztiválszálloda: az árak reggelivel értendők, az idegenforgalmi adó nem tartalmazzák (400 Ft/fő/éj, 18 éves kortól). Foglalj minél hamarabb — a fesztivál idején korlátozott a szabad szobák száma.
```

**Behavior:** If the field is empty, the note block does not appear. No static fallback text will appear.

---

## Map Note (Térkép)

**Where to edit:** Page document with slug `terkep`

**Field:** `Kiemelt megjegyzés – HU` / `Kiemelt megjegyzés – EN`

**What it controls:** The highlighted note block at the top of the map page (if needed).

**Behavior:** If the field is empty, the note block does not appear.

---

## Performer Band Members

**Where to edit:** Performer documents

**Field:** `Zenekari tagok / Közreműködők` (array)

**How to add members:**
1. Open a Performer document
2. Scroll to the "Zenekari tagok / Közreműködők" field
3. Click "Add member"
4. Fill in:
   - **Név** (required) - e.g., "János Kovács"
   - **Szerep (HU/EN)** - e.g., "zenekarvezető", "vendégművész"
   - **Hangszer (HU/EN)** - e.g., "zongora", "trombita", "ének"
   - **Országkód** - e.g., "H", "USA", "S"
   - **Ország neve (HU/EN)** - e.g., "Magyarország", "United States"
   - **Megjelenik önálló fellépőként?** - Keep unchecked unless you want this member to appear as a separate performer card
5. Use the **Sorrend** field to control the order (lower number = earlier in list)
6. Publish

**Behavior:** If the members array is empty, the "Közreműködők" section does not appear in the performer detail modal.

---

## Hiding Placeholder Programs

**Where to edit:** ProgramItem documents

**Field:** `Megjelenik az oldalon?` (isActive)

**How to hide a program:**
1. Open a ProgramItem document
2. Toggle the `Megjelenik az oldalon?` switch to OFF
3. Publish

**Behavior:** Programs with `isActive = false` will not appear on the public website. This is useful for placeholder programs that are not yet confirmed.

---

## Camp Schedule Display Mode

**Where to edit:** Page document with slug `tabor`

**Field:** `Megjelenítés módja` in each `campScheduleBlocks` item

**Options:**
- **Felsorolás (bullets)** - Shows orange bullet dots (good for teacher lists)
- **Bekezdések (no bullets)** - Shows plain paragraphs (good for fees, program descriptions)

**How to change:**
1. Open the Page document with slug `tabor`
2. Scroll to `Tábor — program blokkok (kártyák)`
3. For each block, select the appropriate display mode
4. Publish

---

## Performer Image Display Mode

**Where to edit:** Performer documents

**Field:** `Kép megjelenítési módja`

**Options:**
- **Kitöltés (cover)** - Fills the frame, may crop edges (default, good for portraits)
- **Teljes kép (contain)** - Shows the entire image without cropping (good for group photos)
- **Fekvő (landscape)** - Wider aspect ratio (good for horizontal group photos)
- **Álló (portrait)** - Taller aspect ratio (good for vertical solo photos)

**Recommendations:**
- Use `contain` or `landscape` for band/group photos to avoid cutting off members
- Use `cover` or `portrait` for solo performer portraits
- The detail modal always shows the full image on desktop regardless of this setting

---

## Hotel Data (Accommodation)

**Where to edit:** Accommodation documents

**Fields available:**
- **Szállás neve** - Hotel name
- **Leírás (HU/EN)** - Description text
- **Ár (HU/EN)** - Price information (e.g., "19 950 Ft/fő/éjtől")
- **Csillagos besorolás** - Star rating (0-4)
- **Kép** - Hotel image (Sanity asset recommended)
- **Hivatalos weboldal** - Hotel website URL
- **Foglalási link** - Booking URL
- **Foglalás gomb felirat (HU/EN)** - Button label (e.g., "Foglalás →")
- **Távolság (HU/EN)** - Distance text (e.g., "5 perc sétára a fesztiváltól")
- **Sorrend** - Controls display order
- **Aktív (megjelenik?)** - Toggle to hide/show

**Behavior:** All hotel data is now editable in Sanity. If no accommodation documents exist, the static fallback from `src/content` will be used.

---

## What Still Requires Migration

### Portable Text Support (Rich Text) ✅

Rich text editing is now fully implemented using Sanity Portable Text. The following fields now support rich formatting:

**Page documents:**
- `pageBodyRichHu` / `pageBodyRichEn` - Main body content
- `pageBody2RichHu` / `pageBody2RichEn` - Second body section (for specific slugs)
- `programBodyRichHu` / `programBodyRichEn` - Program free text body
- Camp schedule blocks: `bulletsRichHu` / `bulletsRichEn`

**Performer documents:**
- `bioRichHu` / `bioRichEn` - Performer biography/description

**Supported formatting:**
- **Paragraph styles:** Normal, H2, H3
- **Text marks:** Bold, Italic, Links
- **Lists:** Bullet lists, Numbered lists
- **Blockquotes:** For quoted text
- **Callout blocks:** Predefined styled blocks (Info, Important, Price)

**How to use rich text fields:**
1. Open the document in Sanity Studio
2. Look for fields ending in "Rich" (e.g., "Szöveges tartalom (Rich) - HU")
3. Click in the editor to start typing
4. Use the formatting toolbar for:
   - Paragraph styles (normal/h2/h3)
   - Bold/italic (select text and click the icon)
   - Links (select text, click the link icon, enter URL)
   - Lists (click the bullet or numbered list icon)
   - Blockquotes (click the quote icon)
5. To add a callout block:
   - Click the "+" button to add a new block
   - Select "Callout"
   - Choose the callout type (Info, Important, Price)
   - Enter the text content
6. Publish when done

**Backward compatibility:**
- Old plain text fields (e.g., `pageBodyHu`, `bioHu`) are still present
- If a rich text field is empty, the system automatically falls back to the plain text field
- You can migrate content from plain text to rich text using the migration script

**Migration from plain text:**
A migration script is available at `scripts/migrateToPortableText.ts`:
1. Ensure SANITY_API_WRITE_TOKEN is set in .env.local
2. Run dry-run to preview: `npx tsx scripts/migrateToPortableText.ts --dry-run`
3. Review the output to see what will be migrated
4. Apply changes: `npx tsx scripts/migrateToPortableText.ts --apply`
5. Review changes in Sanity Studio
6. Publish the migrated documents

**Documentation:** See PORTABLE_TEXT_MIGRATION_GUIDE.md for detailed migration instructions.

**What you CANNOT do (brand safety):**
- No HTML source code editing
- No custom colors (use predefined callout styles instead)
- No free font sizing (use heading levels H2/H3)
- No arbitrary inline styles

**Tips:**
- Use H2 for main section headings within content
- Use H3 for subsection headings
- Use callout blocks for important announcements or pricing info
- Links automatically open in a new tab with `rel="noopener noreferrer"`

---

## General Tips

1. **Always publish** after making changes - unpublished changes won't appear on the live site
2. **Use the Hungarian field** first if editing primarily for Hungarian content - the English field is optional
3. **Toggle `isActive` to OFF** to temporarily hide content instead of deleting
4. **Check the preview** in Sanity Studio to see how content will appear
5. **Contact the development team** if you need new fields or functionality

---

## Quick Reference

| Task | Document Type | Slug/Field | Key Field |
|------|--------------|------------|-----------|
| Accommodation note | Page | szallas | introNoteHu/introNoteEn |
| Map note | Page | terkep | introNoteHu/introNoteEn |
| Band members | Performer | - | members (array) |
| Hide program | ProgramItem | - | isActive (boolean) |
| Camp display mode | Page | tabor | campScheduleBlocks[].displayMode |
| Image display mode | Performer | - | imageDisplayMode |
| Hotel data | Accommodation | - | All fields |

---

## Need Help?

If you encounter issues or need clarification on any of the above, please refer to the technical team or check the MIGRATION_NOTES.md document for detailed technical information.
