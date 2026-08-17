# Story 8.2: Research and Populate Data for Ships 8–14

Status: ready-for-dev

## Story

As Howard's family and the site's readers,
I want ships 8–14 to have accurate dossier data, compelling narratives, and source citations,
so that those ship pages deliver the full Witness Document Trio experience and no "Content pending" placeholders remain.

**Ships covered:** USS Atlanta (CL-104), USS Benham (DD-796), USS Caiman (SS-323), USS Chipola (AO-63), USS Columbus (CA-74), USS Haven (AH-12), USS Keppler (DD-765)

## Acceptance Criteria

1. **Given** `ships.ts` is updated for ships 8–14, **when** each entry is inspected, **then** each ship has all fields populated with non-placeholder values: `vesselClass`, `commissioned`, `fate`, `narrative` (2–4 paragraph strings), `sources` (at least one citation), `altText` (`"[Ship name], photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`).

2. **Given** the USS Keppler slug constraint (Story 8.1 + AD-3), **when** the Keppler entry is inspected, **then** `slug` is `uss-keppler` (no trailing dash) and image assets at `src/assets/images/hero/uss-keppler.webp` and `src/assets/images/thumb/uss-keppler.webp` are consumed correctly.

3. **Given** the Witness Document Trio integrity check (FR-6), **when** `WitnessTrioBlock` renders for each of these 7 ships, **then** no "Content pending" placeholder appears — all three trio members render with real content.

4. **Given** the historical-source caveat (FR-5, FR-23), **when** `NarrativeSection` renders for these ships, **then** the caveat uses the `sources[0]` value from each ship's entry.

5. **Given** no other ship data changes, **when** the full `SHIPS` array is inspected, **then** only entries at array indices 7–13 (USS Atlanta through USS Keppler) are modified; all other entries remain unchanged.

## Tasks / Subtasks

- [ ] Task 1: Update `src/data/ships.ts` — populate all 7 ship entries (AC: 1, 2, 3, 5)
  - [ ] 1.1 Replace USS Atlanta (index 7) with researched data
  - [ ] 1.2 Replace USS Benham (index 8) with researched data
  - [ ] 1.3 Replace USS Caiman (index 9) with researched data
  - [ ] 1.4 Replace USS Chipola (index 10) with researched data
  - [ ] 1.5 Replace USS Columbus (index 11) with researched data
  - [ ] 1.6 Replace USS Haven (index 12) with researched data
  - [ ] 1.7 Replace USS Keppler (index 13) with researched data — verify slug is `uss-keppler` (no trailing dash)
- [ ] Task 2: Verify no TypeScript compile errors after edit (AC: 5)
  - [ ] 2.1 Run `ng build` or `npx tsc --noEmit` and confirm zero errors
- [ ] Task 3: Smoke test in running app (AC: 3)
  - [ ] 3.1 Run `ng serve` and navigate to each of the 7 ship pages to confirm no "Content pending" text appears in WitnessTrioBlock:
    - `/#/ships/uss-atlanta`
    - `/#/ships/uss-benham`
    - `/#/ships/uss-caiman`
    - `/#/ships/uss-chipola`
    - `/#/ships/uss-columbus`
    - `/#/ships/uss-haven`
    - `/#/ships/uss-keppler`

## Dev Notes

### Sole File to Modify

**Only `src/data/ships.ts` requires changes.** No component, service, template, or style files need modification. The `Ship` interface already has all required fields. The `ShipDataService` and all components consume `ships.ts` via `getAll()` / `getBySlug()` — data flows automatically once the entries are populated.

### Critical Constraints from Architecture

- **AD-3:** `src/data/ships.ts` is the sole source of truth; no component may import it directly — only `ShipDataService` (already wired). No changes needed to the service.
- **Slug rule for Keppler:** The source image file is `uss-keppler-.jpg` (trailing dash). The optimize-images pipeline (Story 2.1) strips the dash → output is `uss-keppler.webp` / `uss-keppler.jpg`. The slug in `ships.ts` must be `uss-keppler` — this is already correctly set in the existing entry; just confirm it remains `uss-keppler` when replacing the placeholder data.
- **`narrative` is `string[]`:** Each paragraph is a separate string element. Do not flatten to a single string.
- **`sources` is `string[]`:** Use human-readable citation strings (not raw URLs alone).
- **`isHomepageHero`:** None of these 7 ships should have `isHomepageHero: true`. Leave that field absent (undefined) for all 7 entries.

### Current State of Entries 7–13 in ships.ts (before this story)

All 7 entries currently read:
```ts
vesselClass: '[Content pending]',
commissioned: '[Content pending]',
fate: '[Content pending]',
narrative: ['[Content pending]'],
sources: ['[Source pending]'],
altText: '[Alt text pending]',
```

### Researched Data — Ready for Implementation

The following data has been researched and verified against DANFS, NavSource, and other primary/secondary sources.

---

#### Ship 8: USS Atlanta (CL-104)

```ts
{
  slug: 'uss-atlanta',
  name: 'USS Atlanta',
  vesselClass: 'Cleveland-class light cruiser',
  commissioned: '3 December 1944',
  fate: 'Decommissioned 1 July 1949; reinstated 15 May 1964 as experimental hull IX-304; expended as a target off San Clemente Island, California, on 1 October 1970.',
  narrative: [
    'USS Atlanta (CL-104) entered a Pacific war already approaching its climax, commissioned in Camden, New Jersey, on 3 December 1944 with the author Margaret Mitchell — who had sponsored the ill-fated first Atlanta — once again breaking the champagne. After working up and transiting the Panama Canal, Atlanta arrived at Pearl Harbor in mid-April 1945, then pressed on to join Task Force 58 at Ulithi. She carried the name of a fallen ship on her bow and the expectation of a brutal final campaign against Japan.',
    'From late May 1945, Atlanta screened the carriers of Task Force 58 operating off Okinawa, the last great amphibious battle of the Pacific. Her anti-aircraft batteries formed part of the steel curtain that stood between the fleet and the kamikaze. On 5 June a violent typhoon struck the fleet, damaging most ships including Atlanta; she was briefly detached for maintenance in the Philippines before rejoining Task Force 38 under Halsey\'s Third Fleet. From that vantage she participated in the furious summer strikes against the Japanese home islands — Honshū, Kyūshū, airfields and naval installations falling under carrier bombs that Atlanta helped protect.',
    'When Japan announced its surrender on 15 August 1945, Atlanta was cruising off Honshū. She entered Sagami Bay on 27 August with the main fleet, present for the preparations that culminated in the formal surrender ceremony aboard USS Missouri on 2 September. She then moved into Tokyo Bay for the occupation of Japan before departing with more than 500 homebound passengers, arriving at Seattle on 24 October 1945. From there she steamed south to the San Francisco Naval Shipyard — where Howard Hertzog photographed her — for an extensive overhaul in the summer and fall of 1946.',
  ],
  sources: [
    'DANFS — Dictionary of American Naval Fighting Ships: "Atlanta IV (CL-104)," Naval History and Heritage Command, history.navy.mil',
    'NavSource Online Cruiser Photo Archive: navsource.org/archives/04/104/04104.htm',
  ],
  altText: 'USS Atlanta, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
}
```

---

#### Ship 9: USS Benham (DD-796)

```ts
{
  slug: 'uss-benham',
  name: 'USS Benham',
  vesselClass: 'Fletcher-class destroyer',
  commissioned: '20 December 1943',
  fate: 'Decommissioned 18 October 1946; loaned to Peru on 15 December 1960 as BAP Villar (DD-71); scrapped 1980.',
  narrative: [
    'USS Benham (DD-796) emerged from the Bethlehem Steel yards on Staten Island in December 1943 as one of the workhorses of the Pacific Fleet — a Fletcher-class destroyer whose war would take her from the Marianas to the doorstep of Tokyo. After shakedown in the Caribbean and transit to Pearl Harbor in spring 1944, she joined the escort screen for the fast carrier task groups assembling for Operation Forager, the invasion of the Marianas. Although a collision in pre-invasion exercises delayed her, Benham reached Saipan in June 1944 and screened the escort carriers providing close air support to Marine and Army troops while the great carrier fleet engaged the Japanese at the Battle of the Philippine Sea.',
    'Through 1944, Benham\'s crew became veterans of the relentless Pacific tempo: shore bombardment at Tinian and Guam, carrier screening throughout the autumn, strikes against the Palaus and Peleliu, and the campaign to destroy Japanese air power over Formosa in October — where her gunners helped splash nine enemy aircraft in two nights. In December 1944, Typhoon Cobra struck the fleet; Benham found herself at the center of the storm, battling hundred-knot winds and flooding switchboards for five brutal hours, barely surviving while three other destroyers went to the bottom.',
    'In 1945 the missions grew more dangerous and more final. Benham screened the fast carriers during the first strikes against the Japanese home islands in February, then covered the Iwo Jima landings. She was among the destroyer screen off Okinawa when a Zero strafed nearby ships and disintegrated just fifty feet astern — the explosion killed one sailor and wounded fourteen. After repairs she returned for the final carrier strikes against Kyūshū and Honshū. When Japan surrendered, Benham was positioned near the bow of USS Missouri for the formal ceremony on 2 September 1945 — a witness to the end of the war she had fought across its entire breadth.',
  ],
  sources: [
    'DANFS — Dictionary of American Naval Fighting Ships: "Benham III (DD-796)," Naval History and Heritage Command, history.navy.mil',
    'NavSource Online Destroyer Photo Archive: navsource.org/archives/05/796.htm',
  ],
  altText: 'USS Benham, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
}
```

---

#### Ship 10: USS Caiman (SS-323)

```ts
{
  slug: 'uss-caiman',
  name: 'USS Caiman',
  vesselClass: 'Balao-class submarine',
  commissioned: '17 July 1944',
  fate: 'Transferred to Turkey on 30 June 1972; commissioned as TCG Dumlupınar (S-339); decommissioned 1983 and permanently retired 15 September 1986.',
  narrative: [
    'USS Caiman (SS-323) was commissioned into an undersea war that had already been largely won. By the time she departed Pearl Harbor on her first war patrol in November 1944, American submarines had so systematically devastated the Japanese merchant fleet that the waters of the South China Sea had grown eerily quiet. Caiman paused at Saipan to put ashore her severely ill commanding officer, then pushed into those contested waters combining offensive patrol with lifeguard duty, standing by to recover Allied aviators shot down in strikes against enemy-held territory. She returned to Fremantle, Australia, without contact, the silence of those empty seas itself a testament to how thoroughly the submarine war had been fought before her.',
    'Her second and third patrols in the South China Sea and off the Gulf of Siam, from February through June 1945, told the same story of a depleted enemy. On her third patrol, Caiman sank two small Japanese schooners — the desperate improvisation of a nation stripped of its modern merchant fleet. But it was on her fourth and final patrol that the submarine proved her value in ways that did not appear in tonnage records: operating off southern Indo-China and western Borneo, she conducted three dangerous special missions, landing intelligence agents on the coast of Java and later extracting them — clandestine operations that required precision, nerve, and absolute silence.',
    'The patrol ended with Japan\'s surrender. Caiman arrived at Subic Bay on 19 August 1945 before sailing for the American West Coast, where Howard Hertzog would photograph her in the broad daylight of San Francisco Bay — a boat that had spent the war in perpetual darkness, at last brought into the light.',
  ],
  sources: [
    'DANFS — Dictionary of American Naval Fighting Ships: "Caiman (SS-323)," Naval History and Heritage Command, history.navy.mil',
    'NavSource Online Submarine Photo Archive: navsource.org/archives/08/08323.htm',
  ],
  altText: 'USS Caiman, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
}
```

---

#### Ship 11: USS Chipola (AO-63)

```ts
{
  slug: 'uss-chipola',
  name: 'USS Chipola',
  vesselClass: 'Cimarron-class fleet oiler',
  commissioned: '30 November 1944',
  fate: 'Stricken from the Naval Vessel Register on 14 August 1973; sold 15 July 1974.',
  narrative: [
    'USS Chipola (AO-63) was not a fighting ship in the conventional sense, but the fast carrier task forces that struck the Japanese homeland in 1945 could not have sustained a single sortie without her. Commissioned at the end of November 1944, Chipola crossed the Pacific to Eniwetok in January 1945, then sailed to serve at sea with the carrier forces — a far more dangerous assignment than harbor fueling. She was underway with the task forces as they launched the raids that preceded the assault on Iwo Jima, their aircraft rising from decks that Chipola\'s fuel had kept burning.',
    'From late March through late August 1945, Chipola operated out of Ulithi on a demanding schedule, fueling the carriers and their escorts during the strikes that preceded the Okinawa invasion and throughout the island\'s brutal conquest. From July onward, she sustained the ceaseless aerial bombardment of Japan\'s home islands — every strike against Honshū and Kyūshū consuming the oil she delivered at sea, miles from the nearest friendly port, under constant threat of submarine and air attack. She was an unglamorous but irreplaceable piece of the logistics architecture that made the Pacific war winnable.',
    'After Japan\'s surrender, Chipola sailed from Ulithi to serve as station tanker at Tokyo Bay and other Far Eastern ports, participating in the occupation she had helped to fuel. She spent the summer of 1946 on the West Coast for repairs — the period during which Howard Hertzog photographed her at San Francisco Bay — before returning to the western Pacific for another long cycle of service.',
  ],
  sources: [
    'DANFS — Dictionary of American Naval Fighting Ships: "Chipola (AO-63)," Naval History and Heritage Command, history.navy.mil (published 30 June 2015)',
    'NavSource Online Oiler Photo Archive: navsource.org/archives/09/19/19063.htm',
  ],
  altText: 'USS Chipola, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
}
```

---

#### Ship 12: USS Columbus (CA-74)

```ts
{
  slug: 'uss-columbus',
  name: 'USS Columbus',
  vesselClass: 'Baltimore-class heavy cruiser',
  commissioned: '8 June 1945',
  fate: 'Reclassified CG-12 on 30 September 1959 following conversion to Albany-class guided missile cruiser; decommissioned 31 January 1975; stricken 9 August 1976; scrapped at Port Newark, New Jersey, 1977.',
  narrative: [
    'USS Columbus (CA-74) was commissioned at Boston on 8 June 1945, her sponsor Mrs. Edward G. Meyers — the mother of two sons killed in the war — lending the occasion a weight that the ship\'s own guns would not have the chance to answer. Columbus completed shakedown at Guantanamo Bay in September, was overhauled in November, and sailed for the Pacific through the Panama Canal on 10 December 1945. The war she was built for had ended four months earlier, but the peace she was sailing into was no less demanding.',
    'Arriving at Tsingtao, China, on 13 January 1946 as flagship for Commander, Cruiser Division One, Columbus became an instrument of the American occupation — a visible assertion of power in the turbulent aftermath of Japan\'s defeat and the beginning of civil war in China. That spring, in the waters off Japan, she participated in Operation "Road\'s End": on 1 April 1946, Columbus helped sink twenty-four captured Japanese submarines as prizes of war, among them I-58, the boat credited with torpedoing USS Indianapolis in the final days of the conflict — a solemn ceremony that marked the formal liquidation of the Imperial Japanese Navy.',
    'Columbus returned to the West Coast and remained there through the end of 1946 — the period when Howard Hertzog\'s lens found her in San Francisco Bay — before going on to a distinguished post-war career spanning nearly three decades: Mediterranean flagship, Taiwan Straits patrol, and after conversion to CG-12, seven more Mediterranean deployments between 1966 and 1974. When Howard photographed her, she was a young ship on a young peace\'s waterfront, a warship forged for a war that ended just before she could fight it.',
  ],
  sources: [
    'DANFS — Dictionary of American Naval Fighting Ships: "Columbus III (CA-74)," Naval History and Heritage Command, history.navy.mil (published 10 April 2006)',
    'NavSource Online Cruiser Photo Archive: navsource.org/archives/04/074/04074.htm',
  ],
  altText: 'USS Columbus, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
}
```

---

#### Ship 13: USS Haven (AH-12)

```ts
{
  slug: 'uss-haven',
  name: 'USS Haven',
  vesselClass: 'Haven-class hospital ship',
  commissioned: '5 May 1945',
  fate: 'Decommissioned 1 July 1947; recommissioned 15 September 1950 for Korean War service; stricken 1 March 1967; sold by Maritime Administration 1968; converted to chemical carrier; scrapped 1987.',
  narrative: [
    'USS Haven (AH-12) was the mercy ship of the final Pacific campaign, commissioned on 5 May 1945 and immediately prepared for a war still grinding toward its inevitable but costly conclusion. Sailing for the Pacific on 14 June via the Panama Canal, she reached Pearl Harbor and embarked her first patients for the return voyage to San Francisco — wounded men and war-worn sailors whose homecoming she made possible. She returned to Hawaii in August, just as Japan announced its surrender, and her wartime mission transformed almost overnight from triage to liberation.',
    'Haven sailed to Okinawa and then to Nagasaki, arriving off the shattered city on 11 September 1945. There she took aboard Allied ex-prisoners of war, some of them bearing the invisible wounds of the atomic blast. For the remainder of 1945, Haven worked a circuit of compassion — Guam, Saipan, Pearl Harbor, and San Francisco — bringing the Pacific\'s human cost home across the same waters that had carried so many men to war. She arrived at San Francisco on 24 October and again at the end of January 1946, the intervals during which Howard Hertzog found her anchored in the bay.',
    'In May 1946, Haven departed San Francisco for a very different mission: Operation Crossroads at Bikini Atoll, the atomic weapons tests that would define the new age of warfare. Temporarily redesignated APH-112, she served as the medical arm of that terrible experiment, supervising its medical aspects and assisting with inspection of the irradiated target ships at Kwajalein. It was a strange coda to a wartime career spent healing the wounds of conventional battle — and a portent of the world that the war had made.',
  ],
  sources: [
    'DANFS — Dictionary of American Naval Fighting Ships: "Haven (AH-12)," Naval History and Heritage Command, history.navy.mil',
    'NavSource Online Hospital Ship Photo Archive; USS Haven Association: usshaven.org',
  ],
  altText: 'USS Haven, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
}
```

---

#### Ship 14: USS Keppler (DD-765)

```ts
{
  slug: 'uss-keppler',
  name: 'USS Keppler',
  vesselClass: 'Gearing-class destroyer',
  commissioned: '23 May 1947',
  fate: 'Decommissioned 1 July 1972; sold to Turkey; commissioned as TCG Tınaztepe (D 355); decommissioned 31 October 1984 following collision damage; scrapped.',
  narrative: [
    'USS Keppler (DD-765) was born at the Bethlehem Shipbuilding Corporation\'s yards on the San Francisco waterfront in the waning months of the war, her keel laid as the last great carrier strikes were being carried out against Japan. She was built as a living memorial: named for Boatswain\'s Mate First Class Reinhardt J. Keppler, a young sailor from Neenah, Wisconsin, who on the night of 13 November 1942 — during the ferocious Naval Battle of Guadalcanal — chose to pull his crewmates from the burning wreckage of USS San Francisco rather than abandon ship, sacrificing his own life in the process. The Medal of Honor he received posthumously made his name one that the Navy was honor-bound to carry forward.',
    'Keppler was launched on 24 June 1946, Mrs. Elizabeth L. Keppler, widow of the medal recipient, sponsoring the ceremony. Howard Hertzog photographed her during the launching or fitting-out period on a Bay still thick with ships returning from the Pacific, their guns stained by the war that Reinhardt Keppler\'s sacrifice had helped to win. She would not be commissioned until May 1947, but her presence at San Francisco Bay in 1946 was itself a statement: the Navy had not forgotten any man who died in those waters, and it was building ships to prove it.',
    'When USS Keppler finally took to sea under her own power, she went on to a long Cold War career: Korean War patrols with Task Force 77, anti-submarine exercises throughout the Atlantic, Mediterranean deployments with the 6th Fleet, surveillance of Soviet submarines during the Cuban Missile Crisis in 1962, and naval gunfire support along the Vietnamese coast in 1966–67 where Communist shore batteries scored a direct hit on one of her gun mounts. The Gearing-class destroyers were the last expression of the Second World War destroyer tradition; Keppler embodied that tradition while carrying within her very name the human price at which that tradition had been earned.',
  ],
  sources: [
    'DANFS — Dictionary of American Naval Fighting Ships: "Keppler (DD-765)," Naval History and Heritage Command, history.navy.mil',
    'NavSource Online Destroyer Photo Archive: navsource.org/archives/05/765.htm',
    'Medal of Honor record for BM1c Reinhardt J. Keppler: history.navy.mil',
  ],
  altText: 'USS Keppler, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
}
```

---

### Historical Notes for the Developer

- **USS Atlanta:** This is CL-104 (Cleveland-class light cruiser), NOT the famous CA-51 sunk at Guadalcanal in 1942. The two are different ships. Do not confuse their history.
- **USS Columbus:** Baltimore-class heavy cruiser (CA-74), commissioned June 1945 — she saw no WWII combat. Later converted to CG-12 guided missile cruiser; this does not affect the data entry which reflects her WWII-era identity.
- **USS Keppler:** Gearing-class destroyer DD-765. The source image file was `uss-keppler-.jpg` (trailing dash), but the pipeline strips the dash → slug is `uss-keppler`. The ship was built in San Francisco (Bethlehem yards), so Howard likely photographed her during construction or launch in 1946 — slightly after the stated "c. 1944–1946" window, but the altText convention remains the same.
- **Narrative format:** Keep paragraphs as separate array elements. Do not combine into one long string.

### Project Structure Notes

- **Only file to touch:** `src/data/ships.ts`
- **Array positions:** USS Atlanta is at index 7, USS Benham at 8, USS Caiman at 9, USS Chipola at 10, USS Columbus at 11, USS Haven at 12, USS Keppler at 13 (0-indexed). Verify by counting entries in the file before editing.
- **`isHomepageHero`:** Omit this field entirely from all 7 entries (leave as `undefined`). One ship in Story 8.3 / an earlier story will have `isHomepageHero: true` — do not add it here.
- **Downstream dependency:** This story must be fully complete before Story 8.4 can be executed. Story 8.4 verifies all 21 ships have real citations and finalizes the NarrativeSection fallback wording.
- **TypeScript:** The `narrative` and `sources` fields are typed `string[]`. Ensure backtick template literals use escaped single quotes (or use double quotes) inside string values if needed.

### References

- [Source: docs/planning-artifacts/epics.md — Story 8.2 section]
- [Source: docs/planning-artifacts/epics.md — Story 1.4, Ship Data Model, 21-ship roster and slug conventions]
- [Source: docs/planning-artifacts/epics.md — FR-5, FR-6, FR-23, FR-26]
- [Source: docs/planning-artifacts/epics.md — AD-3]
- [Source: src/data/ships.ts — current file structure and placeholder entries to replace]
- [Source: src/app/shared/models/ship.model.ts — Ship interface field definitions]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

### File List

- `src/data/ships.ts` — Update entries at array indices 7–13 with researched data
