const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Standardized SVG Highlight Generator
 * @param {number} w Canvas width
 * @param {number} h Canvas height
 * @param {number} x Highlight box X
 * @param {number} y Highlight box Y
 * @param {number} width Highlight box width
 * @param {number} height Highlight box height
 * @param {number} radius Corner radius (use height/2 for pills)
 * @param {string} color Highlight stroke color (default #00f0ff)
 */
function createHighlightSvg(w, h, x, y, width, height, radius = 8, color = '#00f0ff') {
  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}"
            fill="rgba(0, 240, 255, 0.12)" stroke="${color}" stroke-width="2" filter="url(#glow)" />
    </svg>
  `);
}

/**
 * Crop an image card and optionally apply a glowing highlight box
 * @param {Object} options
 * @param {string} options.inputPath Path to clean raw screenshot
 * @param {string} options.outputPath Destination path in static/img/dapp/
 * @param {Object} options.crop { left, top, width, height }
 * @param {Object} [options.highlight] { x, y, width, height, radius }
 */
async function cropAndHighlight(options) {
  const { inputPath, outputPath, crop, highlight } = options;

  let pipeline = sharp(inputPath).extract({
    left: crop.left,
    top: crop.top,
    width: crop.width,
    height: crop.height
  });

  if (highlight) {
    const radius = highlight.radius ?? (highlight.isPill ? Math.round(highlight.height / 2) : 8);
    const svgOverlay = createHighlightSvg(
      crop.width,
      crop.height,
      highlight.x,
      highlight.y,
      highlight.width,
      highlight.height,
      radius,
      highlight.color || '#00f0ff'
    );
    pipeline = pipeline.composite([{ input: svgOverlay, top: 0, left: 0 }]);
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await pipeline.toFile(outputPath);
  console.log(`[SUCCESS] Generated: ${outputPath} (${crop.width}x${crop.height})`);
}

/**
 * Utility to measure exact pixel bounding box of an active element (e.g. white active pill button)
 */
async function measureElementBounds(inputPath, crop, filterFn) {
  const { data, info } = await sharp(inputPath)
    .extract(crop)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  let minX = 9999, maxX = 0, minY = 9999, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (filterFn(r, g, b, x, y)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    radius: Math.round((maxY - minY + 1) / 2)
  };
}

module.exports = {
  createHighlightSvg,
  cropAndHighlight,
  measureElementBounds
};
