# Story 8.3: Research and Populate Data for Ships 15–21

Status: ready-for-dev

## Story

As Howard's family and the site's readers,
I want ships 15–21 to have accurate dossier data, compelling narratives, and source citations,
so that those ship pages deliver the full Witness Document Trio experience with no "Content pending" placeholders.

## Acceptance Criteria

1. `ships.ts` is updated for the 7 ships (USS Massachusetts, USS Oklahoma City, USS Rockwall, USS Rodgers, USS Theodore E. Chandler, USS Valley Forge, USS Vicksburg) with all fields populated — no `[Content pending]` or `[Source pending]` placeholders remain for these ships
2. Each ship has `vesselClass`, `commissioned`, and `fate` fields populated with confirmed, factual values
3. Each ship has a `narrative` array of 2–4 paragraph strings placing the ship in its WWII operational context (theatre, mission type, connection to San Francisco Bay, historical significance)
4. Each ship has a `sources` array with at least one citation string (used by `NarrativeSection.caveats` getter to build the historical source caveat)
5. Each ship has `altText` set to the format: `"[Ship name], photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
6. USS Massachusetts uses slug `uss-massachusettes` (preserving the image filename misspelling) but `name` field shows `"USS Massachusetts"` (correct spelling) — **do not change the slug**
7. Exactly one ship in the entire `SHIPS` array has `isHomepageHero: true`; all others have `isHomepageHero` as `undefined` (never `false`) — USS Valley Forge already has `isHomepageHero: true`; **do not add `isHomepageHero: false` to any other ship in this batch**
8. When `WitnessTrioBlock` renders for each of these 7 ships, no "Content pending" placeholder appears — all three trio members render with real content

## Tasks / Subtasks

- [ ] Open `src/data/ships.ts` and locate the 7 entries for ships 15–21 (AC: 1)
  - [ ] Confirm current state: all 7 have `[Content pending]` / `[Source pending]` placeholders
  - [ ] Note: USS Valley Forge already has `isHomepageHero: true` — preserve this
- [ ] Populate USS Massachusetts (AC: 1–5, 6)
  - [ ] Set `vesselClass`: `"South Dakota-class battleship"`
  - [ ] Set `commissioned`: `"12 May 1942"`
  - [ ] Set `fate`: `"Decommissioned 27 March 1947; preserved as museum ship at Battleship Cove, Fall River, Massachusetts since 14 August 1965"`
  - [ ] Set `narrative` (2–4 paragraphs — see Dev Notes)
  - [ ] Set `sources`: `["Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"]`
  - [ ] Set `altText`: `"USS Massachusetts, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
  - [ ] Verify slug remains `uss-massachusettes` (do NOT fix the spelling)
- [ ] Populate USS Oklahoma City (AC: 1–5)
  - [ ] Set `vesselClass`: `"Cleveland-class light cruiser"`
  - [ ] Set `commissioned`: `"22 December 1944"`
  - [ ] Set `fate`: `"Decommissioned 30 June 1947; recommissioned 7 September 1960 as guided missile cruiser CLG-5; final decommissioning 15 December 1979; sunk as target on 27 March 1999"`
  - [ ] Set `narrative` (2–4 paragraphs — see Dev Notes)
  - [ ] Set `sources`: `["Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"]`
  - [ ] Set `altText`: `"USS Oklahoma City, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
- [ ] Populate USS Rockwall (AC: 1–5)
  - [ ] Set `vesselClass`: `"Haskell-class attack transport"`
  - [ ] Set `commissioned`: `"14 January 1945"`
  - [ ] Set `fate`: `"Decommissioned 15 March 1947; recommissioned 3 March 1951; final decommissioning 28 September 1955; stricken 1 December 1958; sold and scrapped in Barcelona, Spain, 1984"`
  - [ ] Set `narrative` (2–4 paragraphs — see Dev Notes)
  - [ ] Set `sources`: `["Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"]`
  - [ ] Set `altText`: `"USS Rockwall, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
- [ ] Populate USS Rodgers (AC: 1–5)
  - [ ] Set `vesselClass`: `"Gearing-class destroyer"`
  - [ ] Set `commissioned`: `"26 March 1945"`
  - [ ] Set `fate`: `"Decommissioned 1 October 1980; transferred to the Republic of Korea Navy 11 August 1981; served as ROKS Jeonju (DD-925); decommissioned 31 December 1999; preserved as museum ship in Dangjin, South Korea"`
  - [ ] Set `narrative` (2–4 paragraphs — see Dev Notes)
  - [ ] Set `sources`: `["Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"]`
  - [ ] Set `altText`: `"USS Rodgers, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
  - [ ] Note: Wikipedia lists this ship as "USS Rogers (DD-876)"; the `name` field in `ships.ts` reads "USS Rodgers" — **do not change the name field**; Howard's photograph may reflect a period spelling variant
- [ ] Populate USS Theodore E. Chandler (AC: 1–5)
  - [ ] Set `vesselClass`: `"Gearing-class destroyer"`
  - [ ] Set `commissioned`: `"22 March 1946"`
  - [ ] Set `fate`: `"Decommissioned 1 April 1975; sold for scrapping to General Metals, Tacoma, Washington, 30 December 1975"`
  - [ ] Set `narrative` (2–4 paragraphs — see Dev Notes)
  - [ ] Set `sources`: `["Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"]`
  - [ ] Set `altText`: `"USS Theodore E. Chandler, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
- [ ] Populate USS Valley Forge (AC: 1–5, 7)
  - [ ] Set `vesselClass`: `"Essex-class aircraft carrier"`
  - [ ] Set `commissioned`: `"3 November 1946"`
  - [ ] Set `fate`: `"Decommissioned 15 January 1970; sold for scrap 29 October 1971"`
  - [ ] Set `narrative` (2–4 paragraphs — see Dev Notes)
  - [ ] Set `sources`: `["Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"]`
  - [ ] Set `altText`: `"USS Valley Forge, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
  - [ ] **Preserve `isHomepageHero: true`** — this must remain on USS Valley Forge
- [ ] Populate USS Vicksburg (AC: 1–5)
  - [ ] Set `vesselClass`: `"Cleveland-class light cruiser"`
  - [ ] Set `commissioned`: `"12 June 1944"`
  - [ ] Set `fate`: `"Decommissioned 30 June 1947; stricken 1 October 1962; sold for scrapping 25 August 1964"`
  - [ ] Set `narrative` (2–4 paragraphs — see Dev Notes)
  - [ ] Set `sources`: `["Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"]`
  - [ ] Set `altText`: `"USS Vicksburg, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
- [ ] Verify the full `SHIPS` array integrity (AC: 7, 8)
  - [ ] Count ships with `isHomepageHero: true` — must be exactly 1 (USS Valley Forge)
  - [ ] Confirm no ship in this batch has `isHomepageHero: false`
  - [ ] Confirm `uss-massachusettes` slug unchanged
  - [ ] Run `ng serve` and navigate to `/#/ships/uss-valley-forge`, `/#/ships/uss-vicksburg`, `/#/ships/uss-massachusetts` to verify Witness Document Trio renders with real content and no "Content pending" text

## Dev Notes

### The Only File to Modify

**`src/data/ships.ts`** — sole source of truth per AD-3. No template changes, no component changes, no route changes. This story is pure data population.

### Architectural Constraints (Must Follow)

- **AD-3**: `src/data/ships.ts` is the sole source of truth for ship data. Only edit this file.
- **AD-5**: `WitnessTrioBlock` renders `DossierCard`, `AttributionCaption`, and `NarrativeSection` unconditionally. The narrative data must be non-placeholder for all 3 trio members to render correctly.
- **`isHomepageHero` rule**: The `Ship` interface declares `isHomepageHero?: boolean` as optional. USS Valley Forge already has `isHomepageHero: true`. For all other ships, this field must be **absent** (undefined), not `false`. Never add `isHomepageHero: false` to any entry.

### How `sources[0]` Is Used (NarrativeSection)

The `NarrativeSection` component builds the historical source caveat from `sources[0]`:

```typescript
get caveats(): string {
  const source = this.ship.sources?.[0];
  if (!source || source === '[Source pending]') {
    return 'Historical details sourced from historical sources. Accuracy not guaranteed.';
  }
  return `Historical details sourced from ${source}. Accuracy not guaranteed.`;
}
```

The caveat renders as: _"Historical details sourced from [sources[0]]. Accuracy not guaranteed."_

**This means `sources[0]` is inserted directly into the sentence** — use a concise, readable source name like `"Dictionary of American Naval Fighting Ships (DANFS) — Naval History and Heritage Command"`, not a URL.

### Slug Constraints

| Ship name (display) | Slug in ships.ts | Notes |
|---|---|---|
| USS Massachusetts | `uss-massachusettes` | **Intentional misspelling** — matches image filename. Do NOT fix. |
| USS Rodgers | `uss-rodgers` | Name from photograph label. Wikipedia has "USS Rogers (DD-876)" — do not change. |
| All others | standard dash-separated slugs | No anomalies |

### Researched Ship Data (Reference for Narrative Writing)

The following data was researched from Wikipedia and the DANFS. Use this as the factual foundation for the narrative paragraphs. Narratives should be 2–4 paragraphs of 3–6 sentences each, written in a respectful, atmospheric tone appropriate to a memorial site.

---

#### USS Massachusetts (BB-59) — South Dakota-class battleship

**Key facts:**
- Built at Bethlehem Steel's Fore River Shipyard, Quincy, Massachusetts; laid down 20 July 1939; commissioned 12 May 1942
- First action: Naval Battle of Casablanca, 8 November 1942 — engaged incomplete French battleship *Jean Bart* during Operation Torch; scored 5 hits, disabling her main turret; fired the first American naval shots of the North African campaign
- Pacific War: served as escort for the fast carrier task force throughout the Pacific campaign — Gilbert and Marshall Islands, Philippines, Iwo Jima bombardments, Okinawa, bombardments of Japanese home island industrial targets at Kamaishi and Hamamatsu (July–August 1945)
- After the Japanese surrender, departed for Puget Sound overhaul in September 1945; sailed to San Francisco in early 1946 before proceeding to Hampton Roads for decommissioning 27 March 1947
- Preserved: transferred to the Massachusetts Memorial Committee 8 June 1965; on display at Battleship Cove, Fall River, Massachusetts; National Historic Landmark
- Earned 11 battle stars in WWII

**Narrative approach:** Opening on Casablanca; transition to Pacific role as carrier escort; arrival at San Francisco Bay c. 1946 outward bound for decommissioning; now preserved for all to see.

---

#### USS Oklahoma City (CL-91) — Cleveland-class light cruiser

**Key facts:**
- Commissioned 22 December 1944 at Philadelphia; commissioned too late to see significant WWII action
- WWII service: Departed Philadelphia, transited Panama Canal, arrived Pearl Harbor 2 May 1945; joined Carrier Task Group 38.1 at Ulithi 6 June 1945; screened Third Fleet carriers for air operations against Japanese home islands; participated in shore bombardment of Japan 18 July 1945; was at sea 72 days continuous through end of hostilities; entered Tokyo Bay 10 September 1945
- Occupation duty through January 1946; arrived San Francisco 14 February 1946; remained in San Francisco until 15 August 1946; entered Mare Island Naval Yard for inactivation; decommissioned (first time) 30 June 1947 to Pacific Reserve Fleet, San Francisco Group
- Post-war: converted to guided missile cruiser CLG-5; long Cold War career as 7th Fleet flagship; fired first US combat surface-to-surface missile in history 4 February 1972
- Decommissioned final time 15 December 1979; sunk as target 27 March 1999

**Narrative approach:** A ship that arrived at the war's closing chapter; how she was assigned to screen the fast carriers as they hammered Japan's home islands; her arrival in San Francisco Bay in February 1946; the city's welcome home.

---

#### USS Rockwall (APA-230) — Haskell-class attack transport

**Key facts:**
- Named for Rockwall County, Texas; built by Kaiser Shipbuilding, Vancouver, Washington; laid down 9 September 1944; commissioned 14 January 1945 at Astoria, Oregon
- WWII service: After shakedown off California, sailed for Saipan; debarked Marine Rocket Detachment and Naval Construction Regiment 12 April; practiced amphibious operations off Lanai and Maui; debarked Marines at Okinawa 10 June 1945; later transported the 5th Military Police Battalion from Guam to Iwo Jima
- Returned to San Francisco 24 July 1945 with officers and men; further "Magic Carpet" voyages; carried Army replacements to Manila; sailed with a 24-ship convoy for Honshu, Japan in September 1945; loaded passengers in Shanghai and arrived Seattle 26 October 1945
- Spring 1946: participated in Operation Crossroads, the atomic bomb tests at Bikini Atoll, as a support vessel
- Decommissioned 15 March 1947; recommissioned 1951 for Korean War era; final decommission 28 September 1955; scrapped in Barcelona 1984
- Earned one battle star

**Narrative approach:** The logistics backbone of the amphibious Pacific — how a ship like Rockwall moved thousands of men toward some of the war's bloodiest beaches; San Francisco Bay as a gateway; her role in the atomic tests.

---

#### USS Rodgers (DD-876) — Gearing-class destroyer

**Note on name:** Wikipedia records this ship as "USS Rogers (DD-876)" (one 'd'), but the photograph label reads "Rodgers" — use the name as recorded in `ships.ts`. The ship was named for three brothers — Jack Ellis Rogers Jr., Charles Ethbert Rogers, and Edward Keith Rogers — killed in action aboard USS New Orleans during the Battle of Tassafaronga, 30 November 1942.

**Key facts:**
- Built by Consolidated Steel Corporation, Orange, Texas; keel laid 3 June 1944; launched 20 November 1944; commissioned 26 March 1945
- After shakedown, converted to radar picket destroyer at Norfolk; reached Pearl Harbor 4 August 1945; departed for Tokyo Bay 17 August — arrived 31 August via Eniwetok and Iwo Jima as hostilities ended; joined 7th Fleet for occupation duty
- 1948: participated in Operation Sandstone atomic bomb tests at Eniwetok Atoll
- 1949: reclassified as radar picket destroyer (DDR-876)
- Korean War, Vietnam War service; in 1969 came alongside USS Enterprise during her catastrophic flight deck fire in Hawaiian waters, fighting the blaze with fire hoses while exposed to exploding bombs — earned the Meritorious Unit Commendation for this action
- Decommissioned 1 October 1980; transferred to Republic of Korea; served as ROKS Jeonju; now preserved as museum ship in Dangjin, South Korea

**Narrative approach:** A ship named for sacrifice — three brothers lost together; arriving in Tokyo Bay on the cusp of peace; patrol duties through the uncertain early Cold War; her long second life after transfer to Korea.

---

#### USS Theodore E. Chandler (DD-717) — Gearing-class destroyer

**Key facts:**
- Named for Rear Admiral Theodore E. Chandler, who died of burns sustained during a kamikaze attack on USS Louisville at Lingayen Gulf, 6 January 1945
- Built by Federal Shipbuilding Company, Kearny, New Jersey; keel laid 23 April 1945; launched 20 October 1945; commissioned 22 March 1946 — after the war's end
- Post-commissioning: shakedown at Guantanamo Bay; departed for west coast 20 September 1946; reached San Diego 7 October 1946; departed San Diego for Japan 6 January 1947
- San Francisco Bay: likely photographed during the ship's west coast transit in late 1946
- Went on to serve in Korean War (9 battle stars) and Vietnam War (8 battle stars + Navy Unit Commendation); participated in Operation Sea Dragon interdiction ops; rushed to assist USS Forrestal after her catastrophic 1967 fire
- Decommissioned 1 April 1975; sold for scrapping 30 December 1975

**Narrative approach:** A ship named for the last act of a man — the admiral who lived just long enough to see victory; "Big Mamie" commissioned into a world at peace and yet never knowing peace; her long career in every American conflict from Korea to Vietnam.

---

#### USS Valley Forge (CV-45) — Essex-class aircraft carrier

**Key facts:**
- Named for Washington's encampment at Valley Forge, 1777–1778; laid down 7 September 1944 at Philadelphia Naval Shipyard; launched 5 November 1945; commissioned 3 November 1946 — after WWII ended
- Shakedown departed 24 January 1947; first aircraft had landed 16 January 1947; departed Philadelphia 14 July 1947, transited Panama Canal 5 August 1947, arrived San Diego 14 August 1947 as her new home port
- Likely photographed in San Francisco Bay during her 1947 Pacific transit
- **Historic distinction:** Launched the first carrier air strike of the Korean War from her flight deck on 3 July 1950 — the F9F Panthers and F4U Corsairs that struck Pyongyang; also the world's first combat strike by jet aircraft
- Made four Korean War deployments (8 battle stars); later reclassified CVS-45 (ASW carrier), then LPH-8 (amphibious assault ship); 9 Vietnam battle stars
- Recovery ship for Mercury-Redstone 1A space capsule, 19 December 1960
- Decommissioned 15 January 1970; selected as filming location for the 1972 science fiction film *Silent Running* (the fictional space freighter in the film is named Valley Forge in her honor); sold for scrap 29 October 1971

**Narrative approach:** An icon of post-war transition — laid down during the war's dying months, commissioned into a world remade; the carrier that launched the first jets into combat over Korea; her arrival in San Francisco Bay in 1947 as a symbol of the new Navy.

---

#### USS Vicksburg (CL-86) — Cleveland-class light cruiser

**Key facts:**
- Originally laid down as "Cheyenne" on 26 October 1942; renamed Vicksburg; launched 14 December 1943; commissioned 12 June 1944 at Norfolk
- WWII service: Reached Pacific via Panama Canal by January 1945; joined bombardment forces for Iwo Jima — assigned to TU 54.9.2, conducted multiple shore bombardments 16–19 February 1945 through the height of the battle; shot down a Japanese Zero that attacked her spotter plane
- Okinawa campaign: narrowly evaded a torpedo from a Japanese G4M1 bomber (18 March); shot down 8 Japanese aircraft including kamikazes; provided naval gunfire support throughout the Okinawa land battle; escorted minesweepers through the East China Sea
- After hostilities: assigned to TG 38.2; part of the fleet that entered Tokyo Bay 5 September; became flagship of Cruiser Division 10 under Rear Admiral Lloyd J. Wiltse
- **San Francisco Bay arrival:** The ship arrived in San Francisco Bay on 15 October 1945 as part of the "Magic Carpet" returning veterans — the fleet passed through a naval review as it entered the port; she proceeded to Monterey Bay for Navy Day 27 October; then Long Beach and Portland
- Post-war: briefly flagship of Third Fleet at San Diego; decommissioned 30 June 1947; stricken 1 October 1962; sold for scrapping 25 August 1964
- Earned 2 battle stars

**Narrative approach:** Vicksburg's arrival at San Francisco Bay in October 1945 passed through a naval review — the crowd, the homecoming, the city that had watched so many ships depart now watching them return; her role at Iwo Jima and Okinawa; the heavy price of those islands.

---

### Key Technical Notes for `ships.ts` Edits

1. **Only edit the 7 entries for ships 15–21** — ships 1–14 should not be touched
2. **String escaping**: Use standard apostrophe-free sentences where possible to avoid TypeScript string escaping issues. If you must use an apostrophe inside a template literal string, escape it as `\'`.
3. **Narrative array format**: Each element is a paragraph string. 2–4 paragraphs recommended. No HTML — plain text only. Example:
   ```typescript
   narrative: [
     'First paragraph text here.',
     'Second paragraph text here.',
   ],
   ```
4. **`isHomepageHero` preservation**: USS Valley Forge already has `isHomepageHero: true`. Do not remove it. Do not add `isHomepageHero: false` to any other ship in this batch.
5. **Slug `uss-massachusettes`**: This slug exists because the image filename is `uss-massachusettes.webp` (intentional misspelling). If the slug were corrected, the hero image would break. Leave it as-is.

### Verify with ng serve

After populating all 7 ships, start `ng serve` and navigate to:
- `/#/ships/uss-massachusettes` → verify full WitnessTrioBlock renders (no "Content pending")
- `/#/ships/uss-oklahoma-city` → verify full render
- `/#/ships/uss-rockwall` → verify full render
- `/#/ships/uss-rodgers` → verify full render
- `/#/ships/uss-theodore-e-chandler` → verify full render
- `/#/ships/uss-valley-forge` → verify full render AND verify `isHomepageHero` still drives the homepage hero (navigate to `/#/` to confirm the homepage hero still shows Valley Forge)
- `/#/ships/uss-vicksburg` → verify full render

### Project Structure Notes

- **Only file to modify**: `src/data/ships.ts` (imports `Ship` from `'../app/shared/models/ship.model'`)
- **Do not** import `ships.ts` directly in any component — only `ShipDataService` consumes it (AD-3)
- **No new files needed** — this is a pure data update

### References

- [Source: src/data/ships.ts] — the file being populated
- [Source: src/app/shared/models/ship.model.ts] — Ship interface definition
- [Source: src/app/shared/components/narrative-section/narrative-section.component.ts] — `sources[0]` used in caveat getter
- [Source: docs/planning-artifacts/epics.md#Story 8.3] — acceptance criteria source
- [Source: Wikipedia — USS Massachusetts (BB-59)] — class, commissioning date, fate, service history
- [Source: Wikipedia — USS Oklahoma City (CL-91)] — class, commissioning date, fate, service history
- [Source: Wikipedia — USS Rockwall (APA-230)] — class, commissioning date, fate, service history
- [Source: Wikipedia — USS Rogers (DD-876)] — class, commissioning date, fate, service history (note: name in ships.ts is "USS Rodgers")
- [Source: Wikipedia — USS Theodore E. Chandler (DD-717)] — class, commissioning date, fate, service history
- [Source: Wikipedia — USS Valley Forge (CV-45)] — class, commissioning date, fate, service history
- [Source: Wikipedia — USS Vicksburg (CL-86)] — class, commissioning date, fate, service history

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
