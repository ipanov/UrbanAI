# UrbanAI Figma Design System Implementation Guide

## 🎨 Color Palette
Create color styles in Figma with these values:

### Primary Colors
- **Primary Blue**: `#2563EB` - Main brand color for buttons, links, and highlights
- **Primary Blue Dark**: `#1E40AF` - Hover states and emphasis
- **Primary Blue Light**: `#3B82F6` - Background highlights and subtle accents

### Secondary Colors
- **Construction Orange**: `#EA580C` - Warning states, construction-related highlights
- **Environment Green**: `#059669` - Success states, environmental indicators
- **Safety Yellow**: `#EAB308` - Caution alerts, safety-related content

### Status Colors
- **Success Green**: `#059669` - Success messages, completed tasks
- **Warning Orange**: `#D97706` - Warning messages, pending reviews  
- **Error Red**: `#DC2626` - Error messages, urgent issues
- **Info Blue**: `#0284C7` - Information messages, tips

### Neutral Colors
- **Background**: `#F8FAFC` - Page backgrounds
- **Surface**: `#FFFFFF` - Card backgrounds, modals
- **Surface Elevated**: `#F1F5F9` - Elevated components
- **Border**: `#E2E8F0` - Dividers, input borders
- **Border Hover**: `#CBD5E1` - Interactive border states
- **Text Primary**: `#1E293B` - Main text content
- **Text Secondary**: `#64748B` - Supporting text
- **Text Muted**: `#94A3B8` - Placeholder text, captions

## 🔤 Typography System
Create text styles in Figma using Inter font family:

### Display Typography
- **Display Large**: Inter, 48px, Bold, #1E293B - Hero headlines
- **Display Medium**: Inter, 36px, Bold, #1E293B - Section headlines
- **Display Small**: Inter, 28px, Semibold, #1E293B - Page titles

### Heading Typography
- **H1**: Inter, 32px, Bold, #1E293B - Main page headings
- **H2**: Inter, 24px, Semibold, #1E293B - Section headings
- **H3**: Inter, 20px, Semibold, #1E293B - Subsection headings
- **H4**: Inter, 18px, Medium, #1E293B - Component headings

### Body Typography
- **Body Large**: Inter, 16px, Regular, #1E293B - Important content
- **Body**: Inter, 14px, Regular, #1E293B - Standard body text
- **Body Small**: Inter, 12px, Regular, #64748B - Supporting text

### UI Typography
- **Button Large**: Inter, 16px, Medium - Primary action buttons
- **Button**: Inter, 14px, Medium - Standard buttons
- **Button Small**: Inter, 12px, Medium - Compact buttons
- **Label**: Inter, 12px, Medium, #374151 - Form labels
- **Caption**: Inter, 11px, Regular, #6B7280 - Captions, metadata
- **Overline**: Inter, 10px, Semibold, #6B7280, Letter Spacing: 0.5px - Overlines, tags

## 🏗️ Layout System

### Grid System
- **Desktop**: 12-column grid, 1200px max width, 24px gutters
- **Tablet**: 8-column grid, 768px breakpoint, 20px gutters  
- **Mobile**: 4-column grid, 375px breakpoint, 16px gutters

### Spacing Scale (8px base unit)
- **4px**: Micro spacing (icon to text)
- **8px**: Small spacing (tight layouts)
- **12px**: Default spacing (component padding)
- **16px**: Medium spacing (between elements)
- **24px**: Large spacing (between sections)
- **32px**: XL spacing (major sections)
- **48px**: XXL spacing (page sections)
- **64px**: XXXL spacing (hero sections)

## 📱 Component Library

### 1. Authentication Components

#### Login Card (400x500px)
- **Background**: Surface (#FFFFFF)
- **Border Radius**: 12px
- **Shadow**: 0px 4px 12px rgba(0, 0, 0, 0.1)
- **Padding**: 32px
- **Components**:
  - UrbanAI logo (120x40px)
  - Heading "Welcome Back" (H2)
  - Email input field
  - Password input field
  - "Remember me" checkbox
  - "Forgot password?" link
  - Login button (Primary)
  - Social login buttons
  - "Don't have an account?" link

#### Register Card (400x600px)
- Similar structure to login card
- Additional fields: Name, Confirm Password
- Terms & Conditions checkbox
- GDPR consent notice

#### Input Field Component (280x48px)
- **States**: Default, Focus, Error, Disabled
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 8px
- **Padding**: 12px 16px
- **Font**: Body (14px)
- **Focus State**: Border #2563EB, Shadow 0px 0px 0px 3px rgba(37, 99, 235, 0.1)

#### Button Components
##### Primary Button (Variable width x 48px)
- **Background**: Primary Blue (#2563EB)
- **Text**: White, Button font (14px Medium)
- **Border Radius**: 8px
- **Padding**: 12px 24px
- **Hover**: Background #1E40AF
- **Active**: Background #1E3A8A
- **Disabled**: Background #94A3B8, Text #64748B

##### Secondary Button (Variable width x 48px)
- **Background**: Transparent
- **Border**: 1px solid #E2E8F0
- **Text**: Text Primary (#1E293B)
- **Hover**: Background #F8FAFC
- **Active**: Background #F1F5F9

### 2. Navigation Components

#### Header Bar (1200x64px)
- **Background**: Surface (#FFFFFF)
- **Border Bottom**: 1px solid #E2E8F0
- **Components**:
  - UrbanAI logo (left, 120x32px)
  - Navigation menu (center)
  - User avatar & dropdown (right)
  - Notification bell icon
  - Search input (240px width)

#### Sidebar Navigation (240x800px)
- **Background**: Surface (#FFFFFF)
- **Border Right**: 1px solid #E2E8F0
- **Components**:
  - User profile section (top)
  - Navigation menu items
  - Quick stats section
  - Settings link (bottom)

#### Mobile Bottom Navigation (375x80px)
- **Background**: Surface (#FFFFFF)
- **Border Top**: 1px solid #E2E8F0
- **5 tabs**: Dashboard, Report, Chat, History, Profile
- **Active state**: Primary Blue icon + text

### 3. Issue Reporting Components

#### Issue Card (320x400px)
- **Background**: Surface (#FFFFFF)
- **Border Radius**: 12px
- **Shadow**: 0px 2px 8px rgba(0, 0, 0, 0.06)
- **Components**:
  - Issue photo (320x180px, covers top)
  - Issue title (H4)
  - Issue description (Body)
  - Status badge
  - Location text
  - Timestamp
  - Priority indicator
  - Action buttons

#### Photo Upload Component (280x200px)
- **Border**: 2px dashed #CBD5E1
- **Border Radius**: 8px
- **Background**: #F8FAFC
- **Components**:
  - Upload icon (24px)
  - "Drop image here or click to upload" text
  - File format requirements
  - Progress indicator (when uploading)

#### Category Selector (280x48px)
- **Type**: Dropdown/Select component
- **Options**: 
  - Construction Defects
  - Safety Hazards
  - Environmental Issues
  - Accessibility Problems
  - Infrastructure Damage
  - Other

### 4. Dashboard Components

#### Statistics Card (240x120px)
- **Background**: Surface (#FFFFFF)
- **Border Radius**: 12px
- **Border**: 1px solid #E2E8F0
- **Padding**: 20px
- **Components**:
  - Metric value (Display Medium, 36px)
  - Metric label (Body Small)
  - Trend indicator (icon + percentage)
  - Background icon (subtle)

#### Chart Container (400x300px)
- **Background**: Surface (#FFFFFF)
- **Border Radius**: 12px
- **Padding**: 24px
- **Components**:
  - Chart title (H4)
  - Filter dropdown
  - Chart area
  - Legend
  - Data labels

### 5. AI Chat Components

#### Chat Container (400x500px)
- **Background**: Surface (#FFFFFF)
- **Border Radius**: 12px
- **Border**: 1px solid #E2E8F0
- **Components**:
  - Chat header with AI assistant name
  - Message list area
  - Input area at bottom

#### Message Bubble - User (max 280px x auto)
- **Background**: Primary Blue (#2563EB)
- **Text Color**: White
- **Border Radius**: 16px 16px 4px 16px
- **Padding**: 12px 16px
- **Position**: Right-aligned

#### Message Bubble - AI (max 280px x auto)
- **Background**: #F1F5F9
- **Text Color**: Text Primary (#1E293B)
- **Border Radius**: 16px 16px 16px 4px
- **Padding**: 12px 16px
- **Position**: Left-aligned

## 🌐 Page Templates

### 1. Login Page Layout
**Desktop (1440x900px)**
```
┌─────────────────────────────────────────────────────────┐
│                    Background Image                     │
│                                                         │
│                 ┌─────────────────┐                     │
│                 │   Login Card    │                     │
│                 │                 │                     │
│                 │  [UrbanAI Logo] │                     │
│                 │                 │                     │
│                 │ Welcome Back    │                     │
│                 │                 │                     │
│                 │ [Email Input]   │                     │
│                 │ [Password Input]│                     │
│                 │                 │                     │
│                 │ [Remember Me]   │                     │
│                 │ [Forgot Pass?]  │                     │
│                 │                 │                     │
│                 │ [Login Button]  │                     │
│                 │                 │                     │
│                 │ [Social Logins] │                     │
│                 │                 │                     │
│                 │ [Register Link] │                     │
│                 └─────────────────┘                     │
│                                                         │
│               [GDPR Notice]                             │
└─────────────────────────────────────────────────────────┘
```

**Mobile (375x812px)**
```
┌───────────────────────┐
│    [UrbanAI Logo]     │
│                       │
│    Welcome Back       │
│                       │
│   [Email Input]       │
│   [Password Input]    │
│                       │
│   [Remember Me]       │
│   [Forgot Password?]  │
│                       │
│   [Login Button]      │
│                       │
│   [Social Logins]     │
│                       │
│   [Register Link]     │
│                       │
│   [GDPR Notice]       │
└───────────────────────┘
```

### 2. Dashboard Page Layout
**Desktop (1440x900px)**
```
┌─────────────────────────────────────────────────────────┐
│                    Header Bar                           │
├───────────┬─────────────────────────────────────────────┤
│  Sidebar  │              Main Content                   │
│           │                                             │
│ [Profile] │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│           │ │Stat1│ │Stat2│ │Stat3│ │Stat4│             │
│ [Menu]    │ └─────┘ └─────┘ └─────┘ └─────┘             │
│           │                                             │
│ [Stats]   │ ┌─────────────┐  ┌─────────────┐            │
│           │ │   Chart 1   │  │   Chart 2   │            │
│ [Settings]│ └─────────────┘  └─────────────┘            │
│           │                                             │
│           │ ┌─────────────────────────────────┐         │
│           │ │        Recent Issues            │         │
│           │ │  [Issue 1] [Issue 2] [Issue 3] │         │
│           │ └─────────────────────────────────┘         │
└───────────┴─────────────────────────────────────────────┘
```

### 3. Issue Reporting Page Layout
**Mobile (375x812px)**
```
┌───────────────────────┐
│      Header Bar       │
├───────────────────────┤
│                       │
│   Report New Issue    │
│                       │
│ ┌─────────────────┐   │
│ │   Photo Upload  │   │
│ │     Area        │   │
│ └─────────────────┘   │
│                       │
│ [Issue Title Input]   │
│                       │
│ [Description Input]   │
│                       │
│ [Category Selector]   │
│                       │
│ [Priority Selector]   │
│                       │
│ [Location Picker]     │
│                       │
│ ┌─────────┐ ┌───────┐ │
│ │ Save    │ │Submit │ │
│ │ Draft   │ │ Issue │ │
│ └─────────┘ └───────┘ │
└───────────────────────┘
```

## 🎯 Design Tokens

### Shadows
- **Card Shadow**: `0px 2px 8px rgba(0, 0, 0, 0.06)`
- **Modal Shadow**: `0px 8px 32px rgba(0, 0, 0, 0.12)`
- **Button Shadow**: `0px 1px 2px rgba(0, 0, 0, 0.05)`
- **Input Focus Shadow**: `0px 0px 0px 3px rgba(37, 99, 235, 0.1)`

### Border Radius
- **Small**: `4px` - Small elements, badges
- **Medium**: `8px` - Buttons, inputs, cards
- **Large**: `12px` - Modal corners, large cards
- **XL**: `16px` - Special containers
- **Round**: `50%` - Avatars, circular buttons

### Transitions
- **Fast**: `150ms ease-in-out` - Hover states
- **Medium**: `250ms ease-in-out` - Standard interactions
- **Slow**: `350ms ease-in-out` - Complex animations

## ♿ Accessibility Guidelines

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Ensure clear visual distinction

### Touch Targets
- **Minimum Size**: 44x44px for mobile
- **Spacing**: At least 8px between touch targets

### Focus States
- **Visible Focus**: All interactive elements must have clear focus states
- **Keyboard Navigation**: Logical tab order
- **Screen Reader**: Proper labels and descriptions

### Motion
- **Respect Preferences**: Support reduced motion settings
- **Purposeful Animation**: Animations should enhance UX, not distract

## 🔧 Implementation Checklist

### Phase 1: Foundation
- [ ] Set up Figma file structure
- [ ] Create color palette as Figma styles
- [ ] Create typography system as text styles
- [ ] Define spacing and layout grid
- [ ] Create shadow and effect styles

### Phase 2: Component Library
- [ ] Build authentication components
- [ ] Create navigation components
- [ ] Design form components
- [ ] Build card and layout components
- [ ] Create button variations

### Phase 3: Page Templates
- [ ] Design login/register flows
- [ ] Create dashboard layouts
- [ ] Design issue reporting flow
- [ ] Build AI chat interface
- [ ] Create profile and settings pages

### Phase 4: Mobile Optimization
- [ ] Adapt all components for mobile
- [ ] Design mobile-specific interactions
- [ ] Optimize for touch interfaces
- [ ] Test responsive behaviors

### Phase 5: Documentation
- [ ] Document all components
- [ ] Create usage guidelines
- [ ] Export development assets
- [ ] Create handoff specifications

---

## 📚 Additional Resources

### Figma Best Practices
- Use Auto Layout for responsive components
- Create variants for component states
- Maintain consistent naming conventions
- Use component descriptions for documentation
- Organize with clear frame hierarchies

### Development Handoff
- Export icons as SVG
- Provide exact color values and measurements
- Document interaction states
- Include accessibility requirements
- Create component specifications

This comprehensive guide will help you create a professional, accessible, and scalable design system for UrbanAI in Figma. Start with the foundation elements and progressively build up to the complete component library and page templates.
