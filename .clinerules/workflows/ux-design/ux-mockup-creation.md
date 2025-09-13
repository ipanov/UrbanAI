# UX Mockup Creation Workflow

## Overview
This workflow creates professional UI mockups using Claude's 2-step design process adapted for Cline, incorporating inspiration mining and design system compliance.

## Process Steps

### Step 1: Inspiration Mining (Claude Method)
**Objective**: Build visual DNA from professional designs

**Tools Used**:
- Firecrawl MCP (web scraping for inspiration)
- Figma MCP (design file analysis)
- Sequential Thinking MCP (structured analysis)

**Process**:
1. Identify target user personas and use cases
2. Research competitor apps and industry leaders
3. Download reference screenshots and UI patterns
4. Analyze color schemes, typography, spacing, and interactions

### Step 2: Design System Creation
**Objective**: Codify visual DNA into reusable tokens

**Tools Used**:
- Tailwind MCP (CSS framework generation)
- shadcn/ui MCP (component library)
- Design System MCP (token validation)

**Process**:
1. Extract primary/secondary colors and accents
2. Define typography hierarchy and weights
3. Establish spacing and layout patterns
4. Create component styling guidelines
5. Generate design tokens JSON

### Step 3: Mockup Generation
**Objective**: Create pixel-perfect mockups with variants

**Tools Used**:
- Mockup Forge MCP (wireframe and mockup generation)
- Bolt UX MCP (interactive prototype creation)
- Browser Tools MCP (responsive validation)

**Process**:
1. Generate wireframes for key user flows
2. Create high-fidelity mockups with design system
3. Develop multiple design variants for each screen
4. Ensure responsive design across breakpoints

### Step 4: Design Validation
**Objective**: Validate against requirements and best practices

**Tools Used**:
- Design System Validator MCP (consistency checks)
- Browser Tools MCP (accessibility audit)
- Mobile MCP (device compatibility)

**Process**:
1. Validate against UrbanAI design system
2. Check accessibility compliance (WCAG 2.1)
3. Test responsive behavior
4. Generate design documentation

## Claude-to-Cline Migration Features

### Enhanced Capabilities
- **Native Tailwind Integration**: Direct CSS generation vs manual conversion
- **Component Libraries**: shadcn/ui, Material UI integration
- **Design System Sync**: Automatic token validation and updates
- **Multi-format Export**: HTML, React, Figma, PNG outputs

### Improved Workflow
- **Automated Inspiration Mining**: Web scraping for design research
- **Token-based Consistency**: Design system enforcement
- **Variant Generation**: Multiple design options per screen
- **Real-time Validation**: Instant feedback on design compliance

## Output Formats
- Interactive HTML prototypes
- React component libraries
- Figma design files
- High-resolution PNG mockups
- Design system documentation
- Accessibility reports

## Quality Standards
- Design system compliance: 100%
- Accessibility score: WCAG AA minimum
- Responsive breakpoints: Mobile, tablet, desktop
- Browser compatibility: Modern browsers + mobile
- Performance: <2s load time for prototypes

## Integration Points
- **Frontend Agent**: Passes validated mockups with implementation specs
- **Design System**: Updates with new patterns and components
- **Testing**: Generates visual regression test baselines
- **Documentation**: Auto-generates component documentation
