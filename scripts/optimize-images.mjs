/**
 * scripts/optimize-images.mjs
 *
 * Pre-build image optimization pipeline.
 * Reads ./images/*.jpg, writes optimized WebP + JPEG variants to:
 *   src/assets/images/hero/{slug}.webp   (1920px wide, ≤200 KB)
 *   src/assets/images/hero/{slug}.jpg
 *   src/assets/images/thumb/{slug}.webp  (600px wide)
 *   src/assets/images/thumb/{slug}.jpg
 *
 * Run: node scripts/optimize-images.mjs
 *
 * Architecture: AD-6 (ARCHITECTURE-SPINE.md)
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

const HERO_WEBP_QUALITY_START = 80;
const HERO_WEBP_QUALITY_FLOOR = 50;
const HERO_WEBP_MAX_BYTES = 200 * 1024; // 200 KB

const HERO_JPEG_QUALITY = 82;
const THUMB_WEBP_QUALITY = 75;
const THUMB_JPEG_QUALITY = 78;

/**
 * The 21 expected slugs (derived from PRD §3.5 source file list).
 * Used to detect missing source files before processing begins.
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
  'uss-massachusettes',   // source: uss-massachusettes.jpg (misspelling preserved)
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
 *
 * Rules:
 *   1. Strip the .jpg extension.
 *   2. Strip any trailing dashes.
 *
 * Examples:
 *   uss-keppler-.jpg      → uss-keppler   (trailing dash stripped)
 *   uss-massachusettes.jpg → uss-massachusettes (misspelling preserved)
 *   uss-atlanta.jpg        → uss-atlanta
 */
function toSlug(filename) {
  return basename(filename, extname(filename)).replace(/-+$/, '');
}

// ---------------------------------------------------------------------------
// Hero WebP with adaptive quality (≤200 KB target)
// ---------------------------------------------------------------------------

/**
 * Writes a hero WebP file, adaptively reducing quality until the file is
 * ≤200 KB or quality reaches the floor (50).
 *
 * Strategy:
 *   Start at quality 80. If the output exceeds 200 KB, retry at q70, q60, q50.
 *   If q50 still exceeds 200 KB the file is written at q50 with a warning
 *   (some very large originals may be unavoidable, but the quality floor
 *   prevents degrading the image further than necessary).
 */
async function writeHeroWebp(inputPath, outputPath) {
  let quality = HERO_WEBP_QUALITY_START;

  while (quality >= HERO_WEBP_QUALITY_FLOOR) {
    await sharp(inputPath)
      .resize(HERO_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);

    const { size } = await stat(outputPath);
    if (size <= HERO_WEBP_MAX_BYTES) {
      return; // within budget
    }

    if (quality === HERO_WEBP_QUALITY_FLOOR) {
      const kb = (size / 1024).toFixed(1);
      console.warn(
        `  [WARN] ${basename(outputPath)} is ${kb} KB at quality ${quality} — exceeds 200 KB target`
      );
      return;
    }

    // Reduce quality by 10 and retry
    quality -= 10;
  }
}

// ---------------------------------------------------------------------------
// Source-file count guard (AC-9)
// ---------------------------------------------------------------------------

/**
 * Reads ./images/, maps filenames to slugs, and cross-checks against
 * EXPECTED_SLUGS. Logs a warning for each missing expected slug and returns
 * false if any are missing (caller will exit non-zero).
 */
async function validateSourceFiles(sourceFiles) {
  const foundSlugs = new Set(sourceFiles.map(toSlug));
  let allPresent = true;

  for (const expected of EXPECTED_SLUGS) {
    if (!foundSlugs.has(expected)) {
      console.warn(`[WARN] Expected source image for slug "${expected}" not found in ${SOURCE_DIR}/`);
      allPresent = false;
    }
  }

  if (sourceFiles.length < EXPECTED_SLUGS.length) {
    console.warn(
      `[WARN] Found ${sourceFiles.length} source JPEGs but expected ${EXPECTED_SLUGS.length}.`
    );
  }

  return allPresent;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Ensure output directories exist
  await mkdir(HERO_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  // 2. Discover source files
  const allFiles = await readdir(SOURCE_DIR);
  const sourceFiles = allFiles.filter((f) => extname(f).toLowerCase() === '.jpg');

  // 3. Guard: validate all expected source files are present
  const valid = await validateSourceFiles(sourceFiles);
  if (!valid) {
    console.error('[ERROR] One or more expected source images are missing. Aborting.');
    process.exit(1);
  }

  console.log(`Processing ${sourceFiles.length} source images...`);

  // 4. Process each source file
  let processed = 0;
  for (const filename of sourceFiles) {
    const inputPath = join(SOURCE_DIR, filename);
    const slug = toSlug(filename);

    const heroWebp = join(HERO_DIR, `${slug}.webp`);
    const heroJpg = join(HERO_DIR, `${slug}.jpg`);
    const thumbWebp = join(THUMB_DIR, `${slug}.webp`);
    const thumbJpg = join(THUMB_DIR, `${slug}.jpg`);

    console.log(`  [${processed + 1}/${sourceFiles.length}] ${filename} → ${slug}`);

    // Hero WebP (adaptive quality, ≤200 KB)
    await writeHeroWebp(inputPath, heroWebp);

    // Hero JPEG fallback
    await sharp(inputPath)
      .resize(HERO_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: HERO_JPEG_QUALITY, progressive: true })
      .toFile(heroJpg);

    // Thumbnail WebP
    await sharp(inputPath)
      .resize(THUMB_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: THUMB_WEBP_QUALITY })
      .toFile(thumbWebp);

    // Thumbnail JPEG fallback
    await sharp(inputPath)
      .resize(THUMB_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: THUMB_JPEG_QUALITY })
      .toFile(thumbJpg);

    processed++;
  }

  console.log(`\nDone. ${processed} images processed.`);
  console.log(`  Hero:  ${HERO_DIR}/`);
  console.log(`  Thumb: ${THUMB_DIR}/`);
}

main().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
