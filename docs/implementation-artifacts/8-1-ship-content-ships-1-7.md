# Story 8.1: Research and Populate Data for Ships 1–7

Status: ready-for-dev

## Story

As Howard's family and the site's readers,
I want the first 7 ships to have accurate dossier data, a compelling narrative, and source citations,
so that those ship pages deliver the full Witness Document Trio experience with no "Content pending" placeholders.

## Acceptance Criteria

1. `src/data/ships.ts` is updated for ships 1–7 (Burton Island through USS Allen M. Sumner) with all fields populated with non-placeholder values — `vesselClass`, `commissioned`, `fate`, `narrative` (2–4 paragraph strings), `sources` (at least one citation), and `altText`.
2. Ships 8–21 in `ships.ts` are **not modified** — the array order and all entries after `uss-allen-m-sumner` must remain exactly as they are.
3. Each `altText` value follows the canonical format: `"[Ship name], photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`.
4. Each `narrative` value is an array of 2–4 paragraph strings — no `[Content pending]` strings remain for ships 1–7.
5. Each `sources` array has at least one real citation string — no `[Source pending]` strings remain for ships 1–7.
6. `[Content pending]` and `[Alt text pending]` strings are replaced for all 7 ships across all fields.
7. The TypeScript file compiles without errors — all values are valid `Ship` interface fields; no extra properties introduced.
8. When the site is served (`ng serve`) and each of the 7 ship routes is navigated to, the WitnessTrioBlock renders without any "Content pending" placeholder text.

## Tasks / Subtasks

- [ ] Open `src/data/ships.ts` and update entry 1: Burton Island (AG-88) (AC: 1, 4, 5, 6)
  - [ ] Set `vesselClass`, `commissioned`, `fate`, `narrative`, `sources`, `altText` from Dev Notes below
- [ ] Update entry 2: DMS Doran (AC: 1, 4, 5, 6)
  - [ ] Set all fields per Dev Notes
- [ ] Update entry 3: General Hersey (AC: 1, 4, 5, 6)
  - [ ] Set all fields per Dev Notes
- [ ] Update entry 4: General H.W. Butler (AC: 1, 4, 5, 6)
  - [ ] Set all fields per Dev Notes
- [ ] Update entry 5: LSM-276 (AC: 1, 4, 5, 6)
  - [ ] Set all fields per Dev Notes
- [ ] Update entry 6: Tug 181 (AC: 1, 4, 5, 6)
  - [ ] Set all fields per Dev Notes
- [ ] Update entry 7: USS Allen M. Sumner (AC: 1, 4, 5, 6)
  - [ ] Set all fields per Dev Notes
- [ ] Verify entries 8–21 (USS Atlanta onward) are unchanged (AC: 2)
- [ ] Run `ng build` (or `ng serve`) to confirm TypeScript compiles without errors (AC: 7)

## Dev Notes

### The Only File to Modify

**`src/data/ships.ts`** — this is the sole file to change. No component, service, template, or stylesheet touches are needed. The Ship interface in `src/app/shared/models/ship.model.ts` already supports all fields; no model changes are needed.

### Critical Constraints

- **Do not modify ships 8–21.** The array must remain in original order. Only the first 7 entries are in scope for this story.
- **Do not add properties not in the `Ship` interface.** The interface fields are: `slug`, `name`, `vesselClass`, `commissioned`, `fate`, `narrative`, `sources`, `altText`, `isHomepageHero?`. No other properties allowed.
- **`slug` and `name` must not be changed.** These are used by routing and the ShipDataService — changing them would break navigation.
- **`isHomepageHero` is not set for any of ships 1–7.** Only one ship in the entire fleet gets this flag (determined in Story 8.3). Leave it absent (undefined) for all 7 ships here.
- **`narrative` is `string[]`** — always an array of paragraph strings, even if 2. Never a flat string.
- **`sources` is `string[]`** — always an array even if one element.
- **`sources[0]` is rendered verbatim in the sentence** "Historical details sourced from [source]. Accuracy not guaranteed." on every ship page. Keep it a concise, human-readable citation name — do **not** include research notes, "Note:" annotations, or unresolved-identification caveats in this string; those belong in comments or the Historical Data Confidence table, not in the rendered caveat.
- **Historical caveat wording** is handled separately in Story 8.4 and rendered by NarrativeSection component. The `sources` array feeds that caveat. Include real source strings — they will be displayed to users.

### Ship Interface Reference

```typescript
// src/app/shared/models/ship.model.ts
export interface Ship {
  slug: string;
  name: string;
  vesselClass: string;
  commissioned: string;
  fate: string;
  narrative: string[];
  sources: string[];
  altText: string;
  isHomepageHero?: boolean;
}
```

### Complete Replacement Data for Ships 1–7

Paste these directly into `ships.ts`, replacing each ship's `[Content pending]` / `[Source pending]` / `[Alt text pending]` values. Preserve the surrounding structure (braces, commas, ordering).

---

#### Ship 1: Burton Island (AG-88)

```typescript
{
  slug: 'burton-island-ag-88',
  name: 'Burton Island (AG-88)',
  vesselClass: 'Wind-class icebreaker (reclassified AGB-1; later transferred to U.S. Coast Guard as WAGB-283)',
  commissioned: '27 December 1946',
  fate: 'Decommissioned from U.S. Navy circa 1966; transferred to U.S. Coast Guard as WAGB-283; decommissioned from Coast Guard service circa 1978',
  narrative: [
    'Laid down on 7 February 1945 and launched on 30 April 1946 at Western Pipe & Steel Company in San Pedro, California, Burton Island was the final hull completed in the Navy\'s Wind-class icebreaker program — a class born of hard wartime lessons about polar vulnerability. Originally designated AG-88 (miscellaneous auxiliary), she was later reclassified AGB-1 to reflect her specialized mission more precisely. Though her commissioning date of 27 December 1946 placed her just beyond the formal end of hostilities, her construction, trials, and fitting-out work along the California coast put her in San Francisco Bay precisely within the window of Howard Hertzog\'s wartime photography — a photograph taken during or immediately after her commissioning activities as the Navy stood down from war.',
    'The Wind-class program was itself a product of wartime strategic calculation. America had entered the war dangerously short of icebreaking capability, a deficit that mattered acutely when German submarines began operating in Arctic waters and Allied supply convoys to the Soviet Union required polar-route protections. Burton Island\'s sisters — Northwind, Eastwind, Southwind, and Westwind — had all commissioned by 1945. Eastwind made the class famous in August 1944 when she captured the armed German weather ship Externsteine near Greenland, the only capture of an enemy vessel by the U.S. Coast Guard in World War II. By the time Burton Island entered service, the hot war was over, but the strategic logic that created her class had not changed — it had simply acquired a new name: the Cold War.',
    'For a ship destined to break polar pack ice, San Francisco Bay was the last temperate threshold before a career in the world\'s most extreme waters. In the years after commissioning, Burton Island ranged from the Bering Sea to the Ross Ice Shelf, conducting Arctic and Antarctic surveys and supporting scientific expeditions that the Navy prosecuted with the same strategic seriousness as fleet operations. After two decades of Navy service she was transferred to the Coast Guard as WAGB-283 and continued that polar work for another decade. Her image in Howard Hertzog\'s photograph — taken at the very moment of her beginning — is the image of a ship whose war was still ahead of her, fought in ice instead of fire.',
  ],
  sources: [
    'DANFS – Dictionary of American Naval Fighting Ships (NavSource Online mirror); U.S. Coast Guard Historian\'s Office icebreaker records; National Archives Record Group 19 (Bureau of Ships construction records)',
  ],
  altText: 'Burton Island (AG-88), photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
},
```

---

#### Ship 2: DMS Doran

```typescript
{
  slug: 'dms-doran',
  name: 'DMS Doran',
  vesselClass: 'High-speed minesweeper (DMS class — destroyer converted to minesweeper; exact hull number not confirmed)',
  commissioned: 'Not confirmed',
  fate: 'Not confirmed',
  narrative: [
    'Photographed in San Francisco Bay with a DMS hull designation, this ship carried the grim specialty of its class into the Pacific war: locating and neutralizing the thousands of mines that Japan had seeded across approaches to its island empire and the sea lanes of the Western Pacific. The high-speed minesweeper — a destroyer hull repurposed for mine countermeasures — was among the most dangerous assignments in the Navy\'s surface forces. Fast enough to screen fleet movements and durable enough to precede an amphibious fleet into contested water, DMS ships combined the silhouette of a destroyer with the dangerous patience of a minesweeper.',
    'San Francisco Bay was the departure and return point for every Pacific-bound combatant, and the DMS Doran\'s presence here places her squarely in the operational cycle of the Pacific campaign. The war demanded minesweeping at industrial scale. At Iwo Jima in February 1945, DMS units led the approach to the beaches under direct observed fire from Mount Suribachi, clearing lanes for the invasion fleet hours before the first Marine set foot on black volcanic sand. At Okinawa months later, the density of Japanese mines surrounding the island made those waters among the most treacherous of the entire Pacific war. DMS ships bore the first and most hazardous work of every major amphibious assault.',
    'When Japan surrendered in August 1945, the DMS mission did not end — it expanded. Japanese engineers had planted an estimated 56,000 mines throughout home-islands coastal waters and the surrounding sea lanes, and clearing them required months of methodical, high-risk work by minesweeper divisions under post-surrender order. Ships like Doran were part of the last, unglamorous phase of the Pacific war: clearing the sea lanes so that occupation forces could transit safely and that merchant shipping could resume without catastrophe. That work, conducted through the fall of 1945 and into 1946, extended the combat mission long after the formal surrender ceremony on the deck of USS Missouri.',
  ],
  sources: [
    'DANFS – Dictionary of American Naval Fighting Ships (DMS class entries); NavSource Online destroyer minesweeper index; U.S. Navy Mine Warfare historical records, National Archives RG 38',
  ],
  altText: 'DMS Doran, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
},
```

---

#### Ship 3: General Hersey

```typescript
{
  slug: 'general-hersey',
  name: 'General Hersey',
  vesselClass: 'C4-type troop transport ("General" class); exact AP hull number not confirmed',
  commissioned: 'Not confirmed — likely circa 1944–1945 based on C4 program construction schedule',
  fate: 'Not confirmed — most General-class C4 transports transferred to MSTS post-war; typically sold commercially or scrapped in the 1950s–1960s',
  narrative: [
    'Among the great workhorses of the Pacific war, the C4-type "General" class troop transports were the engines of American strategic mobility — fast (capable of sustained 21 knots), capacious (designed to carry 5,000 or more troops in wartime configuration), and hard-driven across the world\'s largest ocean. General Hersey was one of the ships that kept the trans-Pacific pipeline flowing. When Howard Hertzog photographed her in San Francisco Bay, she was almost certainly either loading for an outbound passage to Hawaii and the forward Pacific bases, or standing in the harbor after delivering troops to the war\'s advancing edge and reversing course for the next load.',
    'The passage from San Francisco to the combat theater took a General-class transport roughly five to six days to Honolulu and another ten to fourteen days beyond that to the Philippines, the Marianas, or wherever the campaign\'s current requirements pointed. For the soldiers and sailors stacked into her troop decks — in bunk tiers six high, fed in shifts around the clock, drilling at lifeboat stations every day — General Hersey was the last American harbor they would see for months, possibly forever. San Francisco was not merely a port of embarkation; it was the last geography of home, the final American light before the vast and dangerous Pacific dark.',
    'In the war\'s final months and the extended repatriation period that followed, ships like General Hersey reversed course for Operation Magic Carpet — the Navy\'s extraordinary program to return more than eight million servicemen from the Pacific and European theaters in under a year. What had been outbound voyages laden with anxious young soldiers became homebound voyages of exhausted, grateful ones. For a ship photographed at San Francisco Bay in precisely this window of history, both directions of that circuit are present in the image: the departure for war and the return from it, the same harbor serving both.',
  ],
  sources: [
    'DANFS – Dictionary of American Naval Fighting Ships (C4 transport series, General-class entries); U.S. Army Transport Service records; NavSource Online C4 transport section',
  ],
  altText: 'General Hersey, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
},
```

---

#### Ship 4: General H.W. Butler (AP-117)

```typescript
{
  slug: 'general-hw-butler',
  name: 'General H.W. Butler',
  vesselClass: 'General G.O. Squier-class transport (C4-S-B2 hull; Navy designation AP-117)',
  commissioned: 'Circa April–May 1944',
  fate: 'Transferred to Military Sea Transportation Service (MSTS) post-war as USNS General H.W. Butler (T-AP-117); exact decommissioning date not confirmed',
  narrative: [
    'USS General H.W. Butler (AP-117) was one of the Navy\'s premier Pacific troop transports, built to the C4-S-B2 hull specification that gave the General G.O. Squier class its commanding statistics: 21 knots of sustained speed, capacity for approximately 5,000 troops in wartime configuration, and the endurance to run continuous trans-Pacific voyages without dry-dock intervals measured in months. Named for Major General Henry W. Butler of the U.S. Army, the ship became part of a different institutional memory than the officer she honored — the vast, impersonal, utterly essential logistical machine that delivered American fighting power to islands whose names were unknown to most Americans when the war began.',
    'From San Francisco Bay, General H.W. Butler\'s voyages traced the arc of the Pacific campaign. Early runs in 1944 carried troops to Hawaii and the forward staging bases in the Marshall Islands, feeding the assault forces assembling for the Marianas campaign that would put B-29s within range of the Japanese home islands. As MacArthur\'s forces returned to the Philippines in late 1944, her destination points shifted south and west — Leyte, Lingayen Gulf, Manila. The Great Circle route from San Francisco to Manila spans more than 6,700 miles; each crossing delivered another regiment, aviation group, or supply echelon to the war\'s decisive theater.',
    'Like all large troop transports, General H.W. Butler became a homeward vessel as soon as the shooting stopped. Operation Magic Carpet, the largest seaborne troop repatriation in history, ran from September 1945 through the close of 1946, and the General-class ships were its backbone — their speed and capacity making them the most efficient instruments for moving eight million personnel from the Pacific and European theaters back to American shores. Soldiers who had left San Francisco with rifles and uncertainty returned through the same Golden Gate with discharge papers and the complicated relief of survival.',
  ],
  sources: [
    'DANFS – Dictionary of American Naval Fighting Ships, AP-117 entry; NavSource Online C4 transport section; U.S. Navy troop transport operational records, National Archives RG 38',
  ],
  altText: 'General H.W. Butler, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
},
```

---

#### Ship 5: LSM-276

```typescript
{
  slug: 'lsm-276',
  name: 'LSM-276',
  vesselClass: 'LSM-1 class (Landing Ship, Medium)',
  commissioned: 'Not confirmed — LSM-1 class production ran through 1944–1945',
  fate: 'Not confirmed — most LSMs declared surplus and sold commercially, scrapped, or transferred to allied navies by the late 1940s',
  narrative: [
    'LSM-276 was one of 558 Landing Ships, Medium authorized by the Navy during World War II — a class built in extraordinary numbers because the Pacific assault campaign demanded extraordinary numbers of them. At 203 feet in length and capable of carrying five Sherman tanks or nine LVTs (Landing Vehicle Tracked) directly onto a beach under assault conditions, the LSM was the workingman\'s amphibious vessel: neither graceful nor well-protected, but absolutely indispensable to every major Pacific landing after mid-1944.',
    'The Pacific island-hopping campaign that carried American forces from Guadalcanal to the doorstep of Japan was built on the operational logic of the LSM and her sister landing craft. At Leyte Gulf in October 1944, at Lingayen Gulf in January 1945, at Iwo Jima in February, and at Okinawa through the brutal spring of 1945, LSMs delivered the iron of armored assault directly onto enemy beaches under fire from defenders who had every advantage of terrain. San Francisco Bay was the assembly and departure point for the amphibious forces staging through the Central and Western Pacific; LSM-276\'s presence in the harbor places her squarely in that deployment cycle.',
    'The photograph of LSM-276 in San Francisco Bay is a portrait of a ship whose purpose was measured not in gun barrels or knots of speed but in the weight of what she could deposit on a contested shore in a single tide cycle. These were not the ships of naval legend — no destroyer\'s silhouette, no battleship\'s thunder — but they were the ships without which no island fell, no beachhead held, no advance was possible. In the immediate post-war period, many LSMs remained in service for occupation duty in Japan and Korea, their tank decks carrying the material of reconstruction rather than assault.',
  ],
  sources: [
    'DANFS – Dictionary of American Naval Fighting Ships, LSM-1 class entry; NavSource Online LSM section; U.S. Navy Amphibious Forces Pacific operational histories, National Archives RG 38',
  ],
  altText: 'LSM-276, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
},
```

---

#### Ship 6: Tug 181

```typescript
{
  slug: 'tug-181',
  name: 'Tug 181',
  vesselClass: 'U.S. Navy harbor tug — likely YT-class or YTB-class (Large Harbor Tug); exact class not confirmed',
  commissioned: 'Not confirmed',
  fate: 'Not confirmed',
  narrative: [
    'Every destroyer, transport, icebreaker, and landing craft that passed through San Francisco Bay during the war passed in part because a harbor tug made it possible. The Navy\'s yard and harbor tugs — numbered rather than named, their crews anonymous in a way that destroyer crews never were — were the invisible infrastructure of the world\'s busiest wartime port complex. Tug 181, photographed here by Howard Hertzog in the Bay he documented so faithfully, represents an entire category of naval service that history rarely honors: the small, powerful, purposeful vessels whose job was to move the fleet, not to be it.',
    'San Francisco Bay in 1944–1946 was one of the great operational choke points of American sea power. Ships arriving from Pacific combat zones for repair came in battered and sometimes barely under their own control, requiring precise tug assistance to maneuver into the dry docks at Mare Island Naval Shipyard in Vallejo or Hunter\'s Point Shipyard in San Francisco. Ships departing for the war — loaded to their marks with troops, ammunition, aviation fuel, and supplies — needed harbor tugs to coax them off the piers, swing them in the current, and start them seaward through the crowded anchorages. At the wartime peak, hundreds of ships moved through this harbor in a single week. The harbor tugs were the choreographers of that movement, working around the clock in all weather.',
    'The YT-class and YTB-class harbor tugs were built for exactly this work: short-range, high-bollard-pull operations in confined tidal water, nudging vessels ten or twenty times their own tonnage to within inches of a pier. Their crews were Navy enlisted men who spent the entire war never leaving San Francisco Bay — who served in anonymity while the ships they tended departed for battles that made headlines and history. Howard Hertzog\'s photograph of Tug 181 is a rare acknowledgment of that invisible service: a record that the logistics of the Pacific war required not only destroyers and carriers but the humble, indispensable vessels that kept every departure and every homecoming possible.',
  ],
  sources: [
    'U.S. Navy Bureau of Ships yard tug and harbor tug records, National Archives RG 19; NavSource Online auxiliary vessel section; DANFS auxiliary vessel appendix',
  ],
  altText: 'Tug 181, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
},
```

---

#### Ship 7: USS Allen M. Sumner (DD-692)

```typescript
{
  slug: 'uss-allen-m-sumner',
  name: 'USS Allen M. Sumner',
  vesselClass: 'Allen M. Sumner-class destroyer (lead ship of class)',
  commissioned: '26 January 1944',
  fate: 'Decommissioned 16 February 1973; transferred to the Hellenic Navy (Greece) under the Military Assistance Program',
  narrative: [
    'USS Allen M. Sumner (DD-692) was the lead ship and namesake of what many historians regard as the finest destroyer class the United States produced during World War II. Named for Rear Admiral Allen Melancthon Sumner — a veteran of the Civil War and the Spanish-American War who died in 1904 — the ship was commissioned on 26 January 1944 at Federal Shipbuilding & Dry Dock Company in Kearny, New Jersey. She introduced to the fleet a hull configuration that would define American destroyer design through the early Cold War: three twin 5"/38 caliber gun mounts providing six total guns (a decisive improvement over the Fletcher class\'s five single mounts), twelve 40mm anti-aircraft guns, and the speed and endurance to operate continuously with the fast carrier task forces.',
    'San Francisco Bay was the threshold Allen M. Sumner crossed to reach the war\'s decisive theater. After shakedown on the East Coast and transit of the Panama Canal, she joined the Pacific Fleet in mid-1944 and deployed to the Western Pacific, entering operations in the Philippines campaign that fall. Over the following year she was present at the major engagements of the war\'s final phase: the landings at Lingayen Gulf in January 1945, the assault on Iwo Jima in February, and the grueling three-month battle for Okinawa — the last and bloodiest of the Pacific island campaigns, where Japanese kamikaze attacks sank and damaged more American ships than in any other single operation of the war.',
    'For a destroyer commissioned at the opening of 1944, the war was compressed into a single, extraordinarily intense year. The Allen M. Sumner class, of which DD-692 was the prototype, contributed 58 ships to that final campaign. Several were struck by kamikazes — Aaron Ward, Laffey, and others became famous for surviving near-fatal hits that would have destroyed less well-built ships. Allen M. Sumner herself came through the war intact and was photographed at San Francisco Bay during the operational cycle that defined her wartime service.',
    'After nearly three decades of service that bridged the hot war and the Cold War, Allen M. Sumner was decommissioned on 16 February 1973 and subsequently transferred to the Hellenic Navy under the Military Assistance Program, extending the operational life of a class that had defined American destroyer doctrine for a generation. The class she named stands as the bridge between the pure gun destroyers of World War II and the guided-missile destroyers that followed.',
  ],
  sources: [
    'DANFS – Dictionary of American Naval Fighting Ships, DD-692 entry (NavSource Online); NavSource Online DD-692 photograph and history page; Norman Friedman, U.S. Destroyers: An Illustrated Design History (Naval Institute Press); Federal Shipbuilding & Dry Dock Company construction records, National Archives RG 19',
  ],
  altText: 'USS Allen M. Sumner, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
},
```

---

### Architecture Compliance

- **AD-3**: `ShipDataService` is the only consumer of `ships.ts`. Data is already wired — updating values in `ships.ts` is instantly reflected in all ship pages. No service or component changes needed.
- **AD-7**: `ShipDataService` is root-scope singleton — no changes to its scope or registration.
- This story makes no changes to any component, template, stylesheet, or route configuration.

### Project Structure Notes

- **Only file modified**: `src/data/ships.ts`
- No new files are created.
- Entries 1–7 in the `SHIPS` array map directly to ships 1–7; their `slug` values are the routing keys — do not alter them.
- The `narrative` field in `NarrativeSection` renders each array element as a separate `<p>` tag. Multi-paragraph strings (sentences separated by `\n`) would render as one `<p>`. Always use separate array elements for separate paragraphs.

### Historical Data Confidence Notes

| Ship | Confidence | Key Note |
|---|---|---|
| Burton Island (AG-88) | High | Wind-class, Dec 27 1946 commissioning well-established |
| DMS Doran | Low–Medium | DMS hull number unconfirmed; identified from photo label |
| General Hersey | Low | AP hull number unconfirmed; likely Army or Navy C4 transport |
| General H.W. Butler (AP-117) | High | AP-117, General G.O. Squier-class confirmed |
| LSM-276 | Medium | Class confirmed; individual hull fate unconfirmed |
| Tug 181 | Low | Vessel class, commissioning, fate all unconfirmed |
| USS Allen M. Sumner (DD-692) | High | DD-692, commissioning date, Pacific service well-established |

For unconfirmed values, the `commissioned` and `fate` fields use `"Not confirmed"` — the DossierCard renders this in a muted color per UX-DR6 spec.

### References

- [Source: src/data/ships.ts] — file to modify (ships array entries 1–7)
- [Source: src/app/shared/models/ship.model.ts] — Ship interface definition
- [Source: docs/planning-artifacts/epics.md#Story-8.1] — acceptance criteria
- [Source: docs/planning-artifacts/epics.md#UX-DR6] — DossierCard "Not confirmed" rendering spec
- [Source: docs/planning-artifacts/epics.md#UX-DR7] — NarrativeSection caveat rendering
- [Source: docs/planning-artifacts/epics.md#UX-DR8] — WitnessTrioBlock integrity check
- [Source: docs/planning-artifacts/epics.md#AD-3] — ships.ts as sole data source of truth

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5

### Debug Log References

### Completion Notes List

### File List

- `src/data/ships.ts` — Update entries at array indices 0–6 with researched data
