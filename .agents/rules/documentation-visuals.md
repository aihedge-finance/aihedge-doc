# Documentation Visuals & Screenshot Standards

Guidelines for creating, cropping, annotating, and verifying visual documentation assets across AI Hedge.

---

## 1. Isolated Component Cropping (No Full-Page Clutter)

- **Crop to Relevant Card / Container**: Never embed raw, full-viewport screenshots with irrelevant navigation bars, multiple sidebars, or dead background space.
- **Focus on the Subject**:
  - For chart guides: Crop exclusively to the chart card container (including the chart title, toggle controls, graph line, and axes).
  - For deposit/withdraw guides: Crop exclusively to the deposit/withdraw card or modal.
  - For strategy breakdowns: Crop exclusively to the strategies card (allocation doughnut + strategy table).
  - For activity tracking: Crop exclusively to the My Activity ledger card.
- **Maintain High Resolution**: Ensure screenshots preserve dark glassmorphism styling, clean border radii, and sharp typography.

---

## 2. Glowing Cyan Highlight Annotations

- **Direct Attention to Actionable UI Controls**: When explaining a specific user interaction, setting, or data column, frame the target element with a glowing bounding box.
- **Highlight Styling Parameters**:
  - **Border Color**: Cyan / Teal (`#00f0ff` or `#2dd4bf`).
  - **Border Width**: `2px` to `2.5px`.
  - **Corner Radius**: `6px` to `10px` matching UI curvature.
  - **Outer Glow**: `box-shadow: 0 0 16px rgba(0, 240, 255, 0.6)`.
  - **Inner Fill**: Subtle translucent tint `rgba(0, 240, 255, 0.08)`.
- **Wide Margins & Zero Text Overlap**:
  - Always provide generous horizontal and vertical padding around the target numbers or buttons.
  - The bounding border MUST NEVER touch, overlap, or obscure digits, percentages, or labels.

---

## 3. Empirical Visual Verification Mandatory

- **Mandatory Visual Inspection**: NEVER commit or mark a screenshot task complete without visually inspecting the resulting image file (`view_file` or browser rendering).
- **Checklist before embedding**:
  1. Is the component centered and tightly cropped without extra surrounding page junk?
  2. Is the highlight box positioned accurately over the intended control/column?
  3. Are all numbers and labels inside the highlight completely legible?
  4. Are there any stale brand names, deprecated parameters, or incorrect fees visible in the screenshot?

---

## 4. Brand & Terminology Compliance in Images

- **Zero Yearn Mentions**: Ensure no screenshots display legacy or third-party Yearn labels.
- **Market Making**: Ensure strategy tables show "Market Making" (never "LP Provider").
- **Accurate Fee Rates**: Ensure fees displayed in screenshots align with active protocol documentation (e.g. 0% Management / 2% Performance baseline).
