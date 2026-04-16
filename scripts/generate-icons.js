#!/usr/bin/env node
// Run with: node scripts/generate-icons.js
// Generates PWA icons from a source SVG/PNG
// Requires: npm install sharp (temporary)

const fs = require("fs");
const path = require("path");

const iconsDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon programmatically (film reel)
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#000000"/>
  <rect x="56" y="56" width="400" height="400" rx="80" fill="#DC2626"/>
  <circle cx="256" cy="256" r="80" fill="white"/>
  <circle cx="256" cy="256" r="40" fill="#DC2626"/>
  <text x="256" y="270" font-family="Arial" font-size="48" font-weight="bold" fill="white" text-anchor="middle">▶</text>
</svg>
`;

fs.writeFileSync(path.join(iconsDir, "icon.svg"), svg.trim());

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log("Icons directory created at:", iconsDir);
console.log("To generate PNG icons, install sharp and run:");
console.log("  npm install sharp --save-dev");
console.log("  Then use the SVG at public/icons/icon.svg");
console.log("");
console.log("Or use a tool like:");
console.log("  https://realfavicongenerator.net/");
console.log("  https://www.pwabuilder.com/imageGenerator");
console.log("");
console.log("Required sizes:", sizes.map(s => `${s}x${s}`).join(", "));
