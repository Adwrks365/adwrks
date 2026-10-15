import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const src = path.join(webRoot, "public/wp-content/uploads/cropped-adwrks-white-192x192.webp");

async function circleIcon(size, outPath) {
  const logoSize = Math.round(size * 0.62);
  const logo = await sharp(src).resize(logoSize, logoSize).ensureAlpha().png().toBuffer();
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#000"/></svg>`,
  );
  const bg = await sharp(circle).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const left = Math.round((size - logoMeta.width) / 2);
  const top = Math.round((size - logoMeta.height) / 2);
  await sharp(bg)
    .composite([{ input: logo, left, top }])
    .png({ force: true })
    .toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(outPath, `${meta.width}x${meta.height}`, `channels=${meta.channels}`, `alpha=${meta.hasAlpha}`);
}

/** Minimal single-size ICO (32x32 PNG embedded) for browsers and static /favicon.ico */
async function writeIco(pngPath, icoPath) {
  const png = fs.readFileSync(pngPath);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry[0] = 32;
  entry[1] = 32;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);

  fs.writeFileSync(icoPath, Buffer.concat([header, entry, png]));
}

const appDir = path.join(webRoot, "src/app");
const publicDir = path.join(webRoot, "public");
const tmp32 = path.join(appDir, "favicon-32-rgba.png");

await circleIcon(32, path.join(appDir, "icon.png"));
await circleIcon(32, tmp32);
await writeIco(tmp32, path.join(appDir, "favicon.ico"));
await writeIco(tmp32, path.join(publicDir, "favicon.ico"));
fs.unlinkSync(tmp32);
const tmpLeft = path.join(appDir, "favicon.tmp.png");
if (fs.existsSync(tmpLeft)) fs.unlinkSync(tmpLeft);

console.log("Done.");
