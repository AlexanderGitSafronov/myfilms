#!/usr/bin/env node
// Run with: node scripts/generate-icons.js
// Generates PWA icons + iOS apple-touch-startup-image splash screens
// Requires: sharp (devDependency)

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const iconsDir = path.join(__dirname, "../public/icons");
const splashDir = path.join(iconsDir, "splash");
fs.mkdirSync(iconsDir, { recursive: true });
fs.mkdirSync(splashDir, { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#000000"/>
  <rect x="56" y="56" width="400" height="400" rx="70" fill="#DC2626"/>
  <circle cx="256" cy="256" r="100" fill="rgba(0,0,0,0.3)"/>
  <path d="M220 200 L220 312 L330 256 Z" fill="white"/>
  <rect x="100" y="100" width="40" height="40" rx="8" fill="rgba(255,255,255,0.3)"/>
  <rect x="372" y="100" width="40" height="40" rx="8" fill="rgba(255,255,255,0.3)"/>
  <rect x="100" y="372" width="40" height="40" rx="8" fill="rgba(255,255,255,0.3)"/>
  <rect x="372" y="372" width="40" height="40" rx="8" fill="rgba(255,255,255,0.3)"/>
</svg>
`.trim();

const svgPath = path.join(iconsDir, "icon.svg");
fs.writeFileSync(svgPath, svg);

const BG = { r: 0, g: 0, b: 0, alpha: 1 };

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

const splashSizes = [
  { w: 1290, h: 2796 }, // iPhone 15 Pro Max / 14 Pro Max
  { w: 1179, h: 2556 }, // iPhone 15 / 15 Pro / 14 Pro
  { w: 1284, h: 2778 }, // iPhone 12/13 Pro Max
  { w: 1170, h: 2532 }, // iPhone 13/12/14
  { w: 1125, h: 2436 }, // iPhone X/XS/11 Pro/13 mini
  { w: 1242, h: 2688 }, // iPhone 11 Pro Max / XS Max
  { w: 828, h: 1792 },  // iPhone 11 / XR
  { w: 1242, h: 2208 }, // iPhone 8 Plus
  { w: 750, h: 1334 },  // iPhone 8 / SE2/3
  { w: 2048, h: 2732 }, // iPad Pro 12.9"
  { w: 1668, h: 2388 }, // iPad Pro 11" / Air 10.9"
  { w: 1536, h: 2048 }, // iPad mini / 9.7"
];

async function generate() {
  for (const size of iconSizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}.png`));
    console.log(`icon-${size}.png`);
  }

  await sharp(Buffer.from(svg)).resize(16, 16).png().toFile(path.join(iconsDir, "favicon-16.png"));
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(iconsDir, "favicon-32.png"));
  console.log("favicon-16.png, favicon-32.png");

  for (const { w, h } of splashSizes) {
    const iconSize = Math.round(Math.min(w, h) * 0.32);
    const iconPng = await sharp(Buffer.from(svg)).resize(iconSize, iconSize).png().toBuffer();

    await sharp({
      create: { width: w, height: h, channels: 4, background: BG },
    })
      .composite([{ input: iconPng, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toFile(path.join(splashDir, `splash-${w}x${h}.png`));
    console.log(`splash-${w}x${h}.png`);
  }

  console.log("\nDone.");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
