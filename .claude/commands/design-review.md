# Design Review Command

This command performs a comprehensive design review using Playwright MCP for visual validation and systematic design analysis.

## Usage
Use this slash command to trigger a complete design review of recent changes or specific components.

## What this command does:
1. **Visual Capture**: Uses Playwright MCP to capture screenshots of implemented components
2. **Reference Comparison**: Compares against HTML mockups in `mocks/` folder
3. **Multi-Viewport Testing**: Tests responsive behavior across desktop, tablet, mobile
4. **Interactive State Validation**: Tests hover, focus, active, disabled states
5. **Accessibility Audit**: Runs automated accessibility checks
6. **Design System Compliance**: Validates adherence to established visual DNA

## Implementation:
```typescript
// This command will:
// 1. Start development servers using the mandatory startup script
// 2. Use Playwright MCP to navigate and capture screenshots
// 3. Compare with reference mockups using visual-compare.js
// 4. Generate comprehensive design review report
// 5. Provide specific recommendations for pixel-perfect alignment

@@agent ux-designer "Perform comprehensive design review with visual validation using Playwright MCP. Compare implementation screenshots with HTML mockups in mocks/ folder. Test all interactive states and responsive behavior. Generate detailed review with specific recommendations."
```

## Integration with existing workflow:
- Uses existing `node .claude/scripts/visual-compare.js` tooling
- Integrates with HTML mockups in `mocks/` folder
- Leverages existing Playwright configuration
- Follows established port compliance (API: 5001, Frontend: 3000)

## Success Criteria:
- ✅ Screenshots captured for all major components
- ✅ Visual comparison completed against reference mockups
- ✅ Responsive behavior validated across viewports
- ✅ Interactive states tested and documented
- ✅ Accessibility compliance verified
- ✅ Design system token usage validated
- ✅ Specific improvement recommendations provided