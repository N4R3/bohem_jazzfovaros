# Sanity kezdő tartalom feltöltés (Phase 2A)

Ez a dokumentum a kezdő tartalom feltöltésének meneteit írja le.

## 1) Előkészítés

Szükséges env:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_WRITE_TOKEN` (kötelező importhoz)

Fájlok:

- Seed adatok: `src/sanity/seed/initialData.ts`
- Import script: `scripts/importSanityInitialData.ts`

## 2) Automatikus seed futtatása

Parancs:

```bash
npm run sanity:seed
```

Mit tölt fel:

1. `siteSettings` (singleton)
2. `popupSettings` (singleton)
3. `venue` (singleton)
4. `sponsorCategory`
5. `sponsor`
6. `ticket`
7. `performer`

## 3) Képek kezelése (fontos)

A script **nem** tölti fel automatikusan a lokális képfájlokat Sanity assetként.
Ezért a `logoPath`, `imagePath` mezők csak segéd információk a seedben.

Studio-ban manuálisan fel kell tölteni:

- popup kép (`popupSettings.image`)
- sponsor logók (`sponsor.logo`)
- fellépő képek (`performer.image`)

Forrás lokális path:

- popup: `/images/43e3a57583f727d87fb1271bb22963ef.jpg`
- sponsor logók: főleg `/images/gallery/menu/*.png`
- fellépők: főleg `/images/gallery/bands/*.jpg`

## 4) Ajánlott feltöltési sorrend Studio-ban

1. `Site settings`
2. `Popup settings`
3. `Venue`
4. `Sponsor categories`
5. `Sponsors` (kategóriára hivatkozva)
6. `Tickets`
7. `Performers`

## 5) Ticket üzleti szabály

Rejtett jegyek:

- `HOT Super Early Bird`
- `Early Bird`

Állapot:

- `isHidden: true`
- `isAvailable: false`

Látható jegyek:

- `isHidden: false`
- `isAvailable: true`

## 6) Popup kötelező értékek

`popupSettings`:

- `isEnabled: true`
- `altHu: Széchenyi Terv támogatási információ`
- `altEn: Széchenyi Plan funding information`
- `sessionStorageKey: szechenyiPopupShown`
- `showOnlyOnHomepage: true`

Fallback megmarad:

- statikus kép: `/images/43e3a57583f727d87fb1271bb22963ef.jpg`

## 7) Fallback biztonság

A seed/import nem kapcsolja ki a fallbacket.
Ha Sanity üres vagy hiányos, az oldal továbbra is a `src/content/*` adatokból működik.

## 8) Program szerkesztése

Studio típus: `programItem`

- HU/EN cím: `titleHu`, `titleEn`
- HU/EN leírás: `descriptionHu`, `descriptionEn`
- időpont: `date`, `startTime`, `endTime`
- színpad: `stage`
- rendezés: `order`
- láthatóság: `isActive`

Megjelenítési rendezés automatikusan:

1. `date`
2. `startTime`
3. `order`

## 9) Szállás szerkesztése

Studio típus: `accommodation`

- név: `name`
- HU/EN leírás: `descriptionHu`, `descriptionEn`
- kép: `image`
- linkek: `websiteUrl`, `bookingUrl`
- távolság HU/EN: `distanceHu`, `distanceEn`
- rendezés: `order`
- elrejtés: `isActive = false`

## 10) Közlekedés és helyszín szerkesztése

- Helyszín: `venue` (singleton)
- Közlekedési elemek: `transportItem`

`venue` mezők:

- `nameHu`, `nameEn`
- `addressHu`, `addressEn`
- `mapEmbedUrl`, `googleMapsUrl`
- `latitude`, `longitude`
- `descriptionHu`, `descriptionEn`

`transportItem` mezők:

- `titleHu`, `titleEn`
- `descriptionHu`, `descriptionEn`
- `url`
- `order`
- `isActive`

## 11) Kapcsolat szerkesztése

Studio típus: `siteSettings`

- `contactEmail`
- `contactPhone`
- `facebookUrl`
- `instagramUrl`
- `youtubeUrl`
- `organizationName`
- `organizationUrl`
- `volunteerButtonLabelHu`, `volunteerButtonLabelEn`
- `volunteerUrl`

Ha ezek hiányoznak vagy üresek, a frontend visszaesik a `src/content` adatokra.

