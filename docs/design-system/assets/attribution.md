# Asset Attribution – UrbanAI

This document lists every non-code design/marketing asset, its source, license, optimization status, and any required usage notes. Update on each addition, replacement, or removal. Keep entries sorted by logical groups (Logos → Icons → Backgrounds → Badges → Patterns → Future Photos).

| Asset / Family | Type | Source / Origin URL | License | Notes / Required Attribution | Added (UTC) | Optimization |
|----------------|------|---------------------|---------|------------------------------|-------------|--------------|
| urbanai-logo-primary.svg | Logo (wordmark+mark) | Internal generation (see `docs/design-system/urbanai-logo-generation-prompt.md`) | Internal / Company-owned | Generated via internal prompt; not for external reuse without permission | 2025-08-15 | Clean SVG, metadata stripped |
| (planned) urbanai-logo-mark.svg | Logo (icon-only) | Internal (to add) | Internal | Monochrome + adaptive (currentColor) variant to be added | 2025-08-15 | Pending creation |
| icons/ (issue.svg, regulation.svg, ai-assist.svg, analytics.svg, compliance.svg) | Outline SVG Icons | https://github.com/tailwindlabs/heroicons | MIT | Subset of Heroicons; paths may be minimally edited for sizing; MIT notice retained below | 2025-08-15 | SVGO: remove metadata, collapse groups, preserve viewBox |
| backgrounds/hero-mesh-desktop.svg | Background (abstract gradient mesh) | Created in-house | CC0 (Author dedication) | Custom mesh authored for UrbanAI; treated as CC0 for internal/external marketing | 2025-08-15 | Vector (≤10KB) |
| backgrounds/hero-mesh-mobile.svg | Background (abstract gradient mesh – mobile) | Created in-house | CC0 | Simplified mesh; focuses on central gradient for performance | 2025-08-15 | Vector (≤8KB) |
| backgrounds/hero-mesh-desktop.webp | Background raster (desktop) | Derived from hero-mesh-desktop.svg export | CC0 (derivative of in-house) | Exported at 1920×1080, quality tuned for <180KB | 2025-08-15 | WebP q~70, target <180KB |
| backgrounds/hero-mesh-mobile.webp | Background raster (mobile) | Derived from hero-mesh-mobile.svg export | CC0 | Exported at 960×1280 portrait, <120KB target | 2025-08-15 | WebP q~70, target <120KB |
| patterns/grid-dots.svg | Subtle pattern overlay | Created in-house | CC0 | Can be tinted via currentColor with opacity | 2025-08-15 | Minified SVG |
| stores/app-store-badge.(svg/png) | Official App Store Badge | https://developer.apple.com/app-store/marketing/guidelines/ | Apple Licensed Asset (usage restricted) | Must not modify; follow clear-space & minimum size rules; provide link to app | Pending | To optimize (keep original; do not recompress lossy) |
| stores/google-play-badge.(svg/png) | Official Google Play Badge | https://play.google.com/intl/en_us/badges/ | Google Play Badge License (usage restricted) | Must not alter colors/shapes; link to Play listing | Pending | To optimize (keep original; do not recompress lossy) |
| badges/gdpr-compliant.svg (planned) | Compliance / trust badge | To source (e.g., create in-house) | CC0 (if in-house) | Avoid implying formal certification unless verified | Pending | Pending |
| photos/city-night.webp (planned) | Hero photographic alt option | To source (Unsplash / Pexels) | Unsplash / Pexels (free license) | Must attribute photographer: “Photo by <Name> on Unsplash” | Pending | WebP responsive (desktop/mobile) |
| photos/city-day.webp (planned) | Secondary alt background | To source (Unsplash / Pexels) | Unsplash / Pexels | Same attribution pattern | Pending | WebP responsive |

## MIT License Notice (Heroicons Subset)

Heroicons © Tailwind Labs – Licensed MIT: https://github.com/tailwindlabs/heroicons/blob/master/LICENSE  
A copy of the MIT license must remain associated with any redistributed icon subset.

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction...
```

(Full text retained in repository via upstream link; include explicit MIT header in any aggregated sprite if created.)

## Attribution Templates

Unsplash:  
“Photo by <Photographer Name> on Unsplash” (link to photographer profile & photo page)

Pexels:  
“Photo by <Photographer Name> on Pexels” (link to photo page)

## Contribution / Update Process

1. Add new asset file under `src/UrbanAI.Frontend/src/assets/brand/{icons|backgrounds|badges|stores|photos}`.
2. Run SVGO (for SVG) or convert raster to WebP (desktop & mobile variants if background/hero).
3. Add / update table row above with:
   - Canonical filename
   - Precise source URL (direct license page if applicable)
   - License shorthand (MIT, CC0, Unsplash, Apple Licensed Asset, etc.)
   - Notes (special restrictions, derivative info)
   - Added date (UTC)
   - Optimization summary
4. Commit change referencing “docs: attribution update – <asset-name>”.
5. Update `memory-bank/progress.md` summarizing design asset changes.

## Pending Actions (Tracking)

- [ ] Import official App Store & Google Play badges (stores/).
- [ ] Create icon-only logo variant (`urbanai-logo-mark.svg`).
- [ ] Generate and export actual mesh SVG + WebP derivatives (placeholders if not yet added).
- [ ] Source at least one photographic city-tech background (night + neutral) with attribution.
- [ ] Add compliance / trust badges only if verified or clearly labeled “In-house decorative”.

## Rationale

Maintaining a single authoritative attribution ledger:
- Ensures license compliance
- Speeds due diligence for marketing releases
- Avoids orphan / unknown-origin assets
- Facilitates automated audits (future: parse table → JSON)

## Change Log

- 2025-08-15: Initial attribution ledger scaffold created (no external proprietary badge binaries yet – pending official downloads).
