/**
 * scripts/optimize-images.mjs
 *
 * Pre-build image optimization pipeline.
 * Reads ./images/*.jpg, writes four variants per ship to src/assets/images/:
 *   hero/{slug}.webp  (1920w, ≤200 KB)
 *   hero/{slug}.jpg   (1920w, JPEG fallback)
 *   thumb/{slug}.webp (600w)
 *   thumb/{slug}.jpg  (600w, JPEG fallback)
 *
 * Run: node scripts/optimize-images.mjs
 * or:  npm run optimize-images
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const SOURCE_DIR = './images';
const HERO_DIR = 'src/assets/images/hero';
const THUMB_DIR = 'src/assets/images/thumb';

const HERO_WIDTH = 1920;
const THUMB_WIDTH = 600;

/** Maximum allowed hero WebP size in bytes (200 KB). */
const HERO_WEBP_MAX_BYTES = 200 * 1024;

/**
 * The 21 canonical output slugs expected from ./images/.
 * Used by the source-file count guard (AC-9).
 */
const EXPECTED_SLUGS = [
  'burton-island-ag-88',
  'dms-doran',
  'general-hersey',
  'general-hw-butler',
  'lsm-276',
  'tug-181',
  'uss-allen-m-sumner',
  'uss-atlanta',
  'uss-benham',
  'uss-caiman',
  'uss-chipola',
  'uss-columbus',
  'uss-haven',
  'uss-keppler',          // source: uss-keppler-.jpg (trailing dash stripped)
  'uss-massachusettes',  // source: uss-massachusettes.jpg (misspelling preserved)
  'uss-oklahoma-city',
  'uss-rockwall',
  'uss-rodgers',
  'uss-theodore-e-chandler',
  'uss-valley-forge',
  'uss-vicksburg',
];

// ---------------------------------------------------------------------------
// Slug derivation
// ---------------------------------------------------------------------------

/**
 * Derives the output slug from a source filename.
 * - Strips the .jpg extension
 * - Strips any trailing dashes (handles `uss-keppler-.jpg` → `uss-keppler`)
 * - All other filenames: slug = filename minus extension
 *
 * @param {string} filename  Basename of the source file (e.g. "uss-keppler-.jpg")
 * @returns {string} Slug (e.g. "uss-keppler")
 */
function toSlug(filename) {
  return basename(filename, extname(filename))
    .replace(/-+$/, ''); // strip one or more trailing dashes
}

// ---------------------------------------------------------------------------
// Hero WebP with adaptive quality (≤200 KB target)
// ---------------------------------------------------------------------------

/**
 * Writes a hero WebP for `inputPath` → `outputPath`.
 * Starts at quality 80 and steps down by 10 each retry until the file fits
 * within HERO_WEBP_MAX_BYTES or reaches a floor of quality 50.
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {number} [startQuality=80]
 */
async function writeHeroWebp(inputPath, outputPath, startQuality = 80) {
  const QUALITY_FLOOR = 50;
  const QUALITY_STEP = 10;

  let quality = startQuality;

  while (quality >= QUALITY_FLOOR) {
    await sharp(inputPath)
      .resize(HERO_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);

    const { size } = await stat(outputPath);

    if (size <= HERO_WEBP_MAX_BYTES) {
      // Fits within the 200 KB budget — done.
      return { quality, size };
    }

    if (quality - QUALITY_STEP < QUALITY_FLOOR) {
      // Reached the floor; keep the last-written file and warn.
      console.warn(
        `  [warn] ${basename(outputPath)}: ${(size / 1024).toFixed(1)} KB ` +
        `at quality ${quality} (floor reached — exceeds 200 KB target)`
      );
      return { quality, size };
    }

    // Try a lower quality on the next iteration.
    quality -= QUALITY_STEP;
  }
}

// ---------------------------------------------------------------------------
// Process a single source image
// ---------------------------------------------------------------------------

/**
 * @param {string} inputPath  Absolute/relative path to source JPEG
 * @param {string} slug       Output slug (e.g. "uss-keppler")
 */
async function processImage(inputPath, slug) {
  const heroWebp = join(HERO_DIR, `${slug}.webp`);
  const heroJpg  = join(HERO_DIR, `${slug}.jpg`);
  const thumbWebp = join(THUMB_DIR, `${slug}.webp`);
  const thumbJpg  = join(THUMB_DIR, `${slug}.jpg`);

  // Hero WebP — adaptive quality to stay ≤200 KB
  const { quality, size } = await writeHeroWebp(inputPath, heroWebp);
  console.log(
    `  hero  webp  ${slug}.webp  ${(size / 1024).toFixed(1)} KB  (q${quality})`
  );

  // Hero JPEG fallback
  await sharp(inputPath)
    .resize(HERO_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true })
    .toFile(heroJpg);
  console.log(`  hero  jpg   ${slug}.jpg`);

  // Thumbnail WebP
  await sharp(inputPath)
    .resize(THUMB_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(thumbWebp);
  console.log(`  thumb webp  ${slug}.webp`);

  // Thumbnail JPEG fallback
  await sharp(inputPath)
    .resize(THUMB_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 78 })
    .toFile(thumbJpg);
  console.log(`  thumb jpg   ${slug}.jpg`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('optimize-images: starting');

  // 1. Read source directory
  let sourceFiles;
  try {
    sourceFiles = (await readdir(SOURCE_DIR))
      .filter(f => extname(f).toLowerCase() === '.jpg');
  } catch (err) {
    console.error(`optimize-images: cannot read source directory "${SOURCE_DIR}": ${err.message}`);
    process.exit(1);
  }

  // 2. Guard: ensure all 21 expected slugs are present (AC-9)
  const foundSlugs = new Set(sourceFiles.map(toSlug));
  const missingSlugs = EXPECTED_SLUGS.filter(s => !foundSlugs.has(s));

  if (missingSlugs.length > 0) {
    for (const slug of missingSlugs) {
      console.warn(`optimize-images: [warn] expected source image missing for slug "${slug}"`);
    }
    console.error(
      `optimize-images: ${missingSlugs.length} expected source file(s) missing — aborting.`
    );
    process.exit(1);
  }

  // Also warn about unexpected extra files (informational only — not a hard error).
  for (const slug of foundSlugs) {
    if (!EXPECTED_SLUGS.includes(slug)) {
      console.warn(`optimize-images: [warn] unexpected source file with slug "${slug}" — will be processed`);
    }
  }

  // 3. Create output directories (idempotent)
  await mkdir(HERO_DIR,  { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  // 4. Process each source image
  let processed = 0;
  for (const filename of sourceFiles) {
    const slug = toSlug(filename);
    const inputPath = join(SOURCE_DIR, filename);
    console.log(`\nProcessing [${++processed}/${sourceFiles.length}]: ${filename} → ${slug}`);
    await processImage(inputPath, slug);
  }

  // 5. Summary
  console.log(`\noptimize-images: done. ${processed} images → ${processed * 4} output files.`);
}

main().catch(err => {
  console.error('optimize-images: fatal error:', err);
  process.exit(1);
});
