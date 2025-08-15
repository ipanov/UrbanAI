# Icon & Brand Asset Guidelines

## Purpose
Define sourcing, optimization, accessibility, naming, and integration rules for UrbanAI brand/UI icons and related visual assets for MVP scope.

## Taxonomy (Frontend Source)
```
src/UrbanAI.Frontend/src/assets/brand/
  logos/
  icons/
  backgrounds/
  badges/
  stores/
  photos/
```
Rules:
- Only production‑approved assets committed here.
- No experimental / unused icons.
- Filenames: lowercase kebab-case.

## MVP Feature / Action Icon Map
| Placeholder (data-asset-placeholder) | Semantic Purpose (MVP)                | Library Icon (Heroicons outline) | Target Filename                    | Notes |
|--------------------------------------|----------------------------------------|----------------------------------|------------------------------------|-------|
| icon-arrow-right                     | Forward / primary action               | arrow-right (24/outline)         | arrow-right.svg                    | Inline in CTAs |
| icon-detect                          | Detect Violations (issue scanning)     | magnifying-glass                 | detect-violations.svg              | Circle + handle; keep stroke 1.75 |
| icon-regulations                     | Access Regulations library             | document-text                    | access-regulations.svg             | Use currentColor stroke |
| icon-streamline                      | Streamline Reporting (list / submit)   | bars-3                           | streamline-reporting.svg           | Simplify to 3 lines |
| icon-analyze                         | (Will be pruned: analytics out-of-scope)| chart-bar OR chart-pie          | analytics-insights.svg (DEFERRED)  | Not in MVP – exclude for now |
| badge-security (trust placeholder)   | Security assurance badge               | shield-check                     | shield-check.svg                   | If retained post-MVP gate |
| badge-compliance                     | Compliance confirmation                | check-badge (combine)            | compliance-badge.svg               | Possibly composite |
| badge-partner / badge-award          | Partner / award logos (external)       | N/A (use provided SVGs)          | partner-[name].svg / award-[name].svg | Require attribution |
| hero-visual (media)                  | Platform preview composite             | N/A (screenshot)                 | hero-preview-desktop.webp          | Provide 2 sizes + mobile |
| future: issue-status-open            | Issue status icon (open)               | clock                            | issue-status-open.svg              | Only if status chips added |
| future: issue-status-resolved        | Issue status icon (resolved)           | check-circle                     | issue-status-resolved.svg          | Only if added to dashboard |

Removed (non-MVP): icon-analyze (Analytics & Insights).

## Inclusion Criteria
An icon MUST map to one of:
- Submit issue
- Classify / detect violation
- Access / view regulations
- View or act on issue status lifecycle
If not, reject.

## Sourcing
Primary: Heroicons (MIT) outline set.
Secondary (if gap): Lucide (ISC) with matched stroke (set stroke-width="1.75" to harmonize).
Custom: Minimal modifications only (path simplification, stroke rounding). Record derivative notice in attribution.

## Optimization (SVGO Profile)
Recommended svgo config (conceptual):
```json
{
  "plugins": [
    { "name": "removeDoctype" },
    { "name": "removeXMLProcInst" },
    { "name": "removeComments" },
    { "name": "removeMetadata" },
    { "name": "removeEditorsNSData" },
    { "name": "convertStyleToAttrs" },
    { "name": "cleanupAttrs" },
    { "name": "inlineStyles" },
    { "name": "removeUselessDefs" },
    { "name": "convertShapeToPath" },
    { "name": "mergePaths" },
    { "name": "removeDimensions" },
    { "name": "removeAttrs", "params": { "attrs": "(stroke-linecap|stroke-linejoin)" } }
  ]
}
```
Keep: `viewBox`, `stroke="currentColor"`, `fill="none"`, `stroke-width`.

## File Naming & Theming
- Use action-based names: `detect-violations.svg`, not `search.svg`.
- All outline icons: `stroke="currentColor" fill="none"`.
- Provide consistent `stroke-width="1.75"` (or library default 1.5, unify during optimization).
- No inline hard-coded colors except exceptional accent glyphs (avoid unless justified).

## Integration Rules (HTML Mockups)
Inline SVG over external `<img>` for critical interactive icons (reduces request overhead and allows CSS theming).
Decorative usage: add `aria-hidden="true" focusable="false"`.
Informative usage: supply `<title>` OR visually hidden text.

Example snippet:
```html
<span class="feature-icon" aria-hidden="true">
  <!-- icons/detect-violations.svg inlined -->
  <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" fill="none">
    <circle cx="11" cy="11" r="6"/>
    <path d="m21 21-4.35-4.35" stroke-linecap="round"/>
  </svg>
</span>
```

## Accessibility
- Decorative: `role="img"` omitted + `aria-hidden="true"`.
- Meaningful: Provide `<svg role="img" aria-labelledby="id">` + `<title id="id">Meaning</title>`.
- Maintain minimum 3:1 contrast for glyph vs. background where necessary.
- Avoid using icon alone to convey status without text label.

## Background Assets
Planned:
- `backgrounds/hero-mesh-desktop.svg`
- `backgrounds/hero-mesh-mobile.svg`
Converted raster:
- `backgrounds/hero-mesh-desktop.webp` (≤180KB)
- `backgrounds/hero-mesh-mobile.webp` (≤120KB)

If photo variant added: store in `photos/` with dual sizes + WebP.

## Store Badges
- Place raw originals (unaltered) under `stores/`:
  - `app-store-badge.svg` (or .png if official)
  - `google-play-badge.svg`
Do not recolor. Must match platform brand usage guidelines.

## Attribution
Each added icon/library reference appended to `docs/design-system/assets/attribution.md` with:
| Asset | Source URL | License | Author | Modifications | File Size (bytes) | Added |
Sizes filled post-commit (use `git ls-files -s` or local stat).

## Performance
- Inline critical path icons (<1KB each post-SVGO).
- Defer non-critical decorative logos with `loading="lazy"` when using `<img>`.
- Aggregate hero composite into single WebP to minimize layout shift.

## Review / Gate
Before adding new icon:
1. Confirm mapping to MVP action.
2. Check if existing icon can be repurposed.
3. Add entry to attribution after optimization.
4. Update this map if placeholder attribute used in mockups.

## Open Tasks (After Guidelines)
- Add actual optimized SVGs for mapped icons.
- Replace placeholders in HTML mockups.
- Update attribution with each commit.

## Change Log
- 2025-08-15: Initial guidelines created (curated sourcing approach).
