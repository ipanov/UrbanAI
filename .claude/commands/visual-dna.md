# Visual DNA Creation Command

This command creates a systematic design system (Visual DNA) by analyzing professional app designs and codifying them into token-based design guidelines.

## Usage
Use this slash command to create or update the project's visual DNA based on professional inspiration.

## What this command does:
1. **Inspiration Analysis**: Systematically analyzes professional app designs
2. **Design Pattern Extraction**: Identifies color schemes, typography, spacing, interaction patterns
3. **Token System Creation**: Converts visual patterns into specific design tokens
4. **Implementation Guidelines**: Creates developer-ready CSS custom properties
5. **Documentation Generation**: Produces comprehensive design system documentation

## Implementation:
```typescript
// This command will:
// 1. Analyze provided professional app screenshots or references
// 2. Extract visual patterns using systematic design analysis
// 3. Create token-based design system with specific values
// 4. Generate CSS custom properties for implementation
// 5. Document design principles and usage guidelines
// 6. Create design validation criteria for future implementations

@@agent ux-designer "Create comprehensive Visual DNA by analyzing professional app designs. Extract color palettes, typography hierarchy, spacing systems, and interaction patterns. Convert into token-based design system with CSS custom properties. Generate implementation guidelines and design validation criteria."
```

## Process Flow:
1. **Collection**: Gather 5-8 professional app screenshots from relevant categories
2. **Analysis**: Use systematic design analysis with <pondering> methodology
3. **Codification**: Convert visual patterns into specific design tokens
4. **Implementation**: Create CSS custom properties and component guidelines
5. **Validation**: Establish criteria for design compliance checking

## Outputs:
- **Design System Documentation**: Comprehensive token system with rationale
- **CSS Custom Properties**: Implementation-ready design tokens
- **Component Guidelines**: Specific styling patterns and interaction states
- **Validation Criteria**: Measurable standards for design compliance
- **Usage Examples**: Practical implementation guidance for developers

## Integration Points:
- Updates existing design system files
- Coordinates with frontend-developer agent for implementation
- Integrates with visual validation workflows
- Uses HTML mockups in `mocks/` folder as reference points

## Success Criteria:
- ✅ Professional designs systematically analyzed
- ✅ Visual patterns extracted and documented
- ✅ Token-based design system created
- ✅ CSS custom properties generated
- ✅ Implementation guidelines provided
- ✅ Validation criteria established
- ✅ Developer handoff documentation complete