import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdr = makeChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData.writeUInt8(0, rowOffset); // filter type: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData.writeUInt8(r, pxOffset);
      rawData.writeUInt8(g, pxOffset + 1);
      rawData.writeUInt8(b, pxOffset + 2);
      rawData.writeUInt8(a, pxOffset + 3);
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc >>> 0, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ 0xffffffff;
}

function renderBeireIcon(x, y, w, h) {
  // Center coordinates
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background gradient: Navy blue (#1e3a8a) to deep slate (#0f172a)
  const t = y / h;
  const rBg = Math.round(30 * (1 - t) + 15 * t);
  const gBg = Math.round(58 * (1 - t) + 23 * t);
  const bBg = Math.round(138 * (1 - t) + 42 * t);

  // Rounded icon boundary
  if (Math.abs(dx) > 0.95 || Math.abs(dy) > 0.95) {
    return [0, 0, 0, 0];
  }

  // Golden Shield or central emblem
  if (dist < 0.65) {
    if (dist < 0.28) {
      // Golden center emblem with blue/water element
      if (dist < 0.12 && dy > 0) {
        return [2, 132, 199, 255]; // Sky blue water drop
      }
      return [250, 204, 21, 255]; // Gold
    }
    // Inner ring
    if (dist > 0.45 && dist < 0.52) {
      return [202, 138, 4, 255]; // Dark gold border
    }
  }

  return [rBg, gBg, bBg, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, renderBeireIcon));
// 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, renderBeireIcon));
// Maskable 512x512 (with safe-zone margins)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, renderBeireIcon));
// Apple Touch Icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, renderBeireIcon));
// Favicon
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, renderBeireIcon));

console.log('PWA PNG Icons generated successfully in public/');
