---
name: doc-visual-annotator
description: Standardized tool and workflow for cropping UI screenshots, applying glowing cyan highlight annotations, and empirically verifying documentation visual assets.
---

# Documentation Visual Annotator Skill

Use this skill whenever capturing, cropping, annotating, or updating UI screenshots for the AI Hedge documentation.

---

## Key Principles & Best Practices

1. **Use `sharp` + SVG Overlay Pipeline (Never Screen-Crop Canvases)**
   - Never capture browser screenshots of canvas elements with offset scrolling, as viewport scaling and scroll positions cause misalignment and blurry artifacts.
   - Use `sharp` to extract exact bounding boxes directly from the source PNG (`sharp(src).extract({ left, top, width, height })`), and composite an SVG with glowing cyan rounded rectangles (`feGaussianBlur`, `stroke="#00f0ff"`, `fill="rgba(0, 240, 255, 0.12)"`).

2. **Clean Raw Baseline Rule (Zero Double / Ghost Highlights)**
   - Always extract or load from an un-annotated, raw screenshot source (from git history or fresh live DApp capture).
   - Never draw a highlight on an image that already had baked-in highlights (e.g. old green outlines), as this creates double borders.

3. **Pixel-Exact Measurement (No Coordinate Guesswork)**
   - Use buffer analysis (`sharp(src).extract(crop).raw().toBuffer()`) to measure the exact `(minX, maxX, minY, maxY)` bounding box of UI elements by color threshold (e.g. white active pill tabs `rgb > 160`, dropdown buttons, or banner containers).

4. **Curvature & Padding Rules**:
   - **Pill Buttons** (e.g., `Deposit`, `Withdraw`, `APY`, `PRICE`): Corner radius must equal `height / 2` (typically `r = 18` for `h = 36px`).
   - **Banners / Notices** (e.g., `Enso Cross-chain banner`): Corner radius `r = 10` to `12`.
   - **Table Columns / Metric Boxes**: Corner radius `r = 8`.
   - **Padding**: Ensure at least `10px` horizontal and vertical breathing room around numbers/labels so borders never touch typography.

5. **Mandatory Empirical Verification**:
   - Always call `view_file` on the generated image file to visually inspect the crop and alignment before marking any task complete.

---

## Quick Usage Workflow

### 1. Import Helper
```javascript
const { cropAndHighlight, measureElementBounds } = require('./.agents/skills/doc-visual-annotator/scripts/annotate.js');
```

### 2. Crop Card & Add Glowing Highlight
```javascript
await cropAndHighlight({
  inputPath: 'scratch/clean_raw_page.png',
  outputPath: 'static/img/dapp/vault_deposit_panel.png',
  crop: {
    left: 1475,
    top: 355,
    width: 396,
    height: 570
  },
  highlight: {
    x: 22,
    y: 104,
    width: 172,
    height: 40,
    radius: 20 // Pill shape (height / 2)
  }
});
```

### 3. Automatically Measure Bounds of an Active White Tab Button
```javascript
const bounds = await measureElementBounds(
  'scratch/clean_raw_page.png',
  { left: 1018, top: 400, width: 396, height: 475 },
  (r, g, b, x, y) => r > 160 && g > 170 && b > 180 // White pill threshold
);

console.log('Exact bounds:', bounds);
// Output: { x: 201, y: 99, width: 174, height: 36, radius: 18 }
```

---

## Checklist Before Finishing Any Image Task
- [ ] Source image is 100% clean and free of legacy baked-in highlights.
- [ ] The component is cropped tightly to its card container without outer page clutter.
- [ ] Highlight box frames the target element with exact radius (`r = h/2` for pill tabs).
- [ ] No text or digits are touched, covered, or obscured.
- [ ] Image verified visually with `view_file`.
- [ ] Docusaurus build passes cleanly (`npm run build`).
