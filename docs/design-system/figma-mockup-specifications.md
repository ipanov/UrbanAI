# UrbanAI Figma Mockup Specifications

This document provides comprehensive specifications for creating all UrbanAI page mockups in Figma. Each specification includes exact dimensions, colors, typography, and component details for manual implementation.

## Design System Foundation

### Color Palette
- **Primary Blue**: #2563EB
- **Primary Blue Dark**: #1E40AF (hover states)
- **Primary Blue Light**: #3B82F6 (backgrounds)
- **Construction Orange**: #EA580C (construction alerts)
- **Environment Green**: #059669 (environmental success)
- **Safety Yellow**: #EAB308 (warnings)
- **Success Green**: #059669 (success states)
- **Warning Orange**: #D97706 (warning states)
- **Error Red**: #DC2626 (error states)
- **Info Blue**: #0284C7 (information)
- **Background**: #F8FAFC
- **Surface**: #FFFFFF
- **Surface Elevated**: #F1F5F9
- **Border**: #E2E8F0
- **Border Hover**: #CBD5E1
- **Text Primary**: #1E293B
- **Text Secondary**: #64748B
- **Text Muted**: #94A3B8

### Typography Scale (Inter Font Family)
- **Display Large**: Inter 48px Bold (#1E293B)
- **Display Medium**: Inter 36px Bold (#1E293B)
- **Display Small**: Inter 28px SemiBold (#1E293B)
- **H1**: Inter 32px Bold (#1E293B)
- **H2**: Inter 24px SemiBold (#1E293B)
- **H3**: Inter 20px SemiBold (#1E293B)
- **H4**: Inter 18px Medium (#1E293B)
- **Body Large**: Inter 16px Regular (#1E293B)
- **Body**: Inter 14px Regular (#1E293B)
- **Body Small**: Inter 12px Regular (#64748B)
- **Button Large**: Inter 16px Medium
- **Button**: Inter 14px Medium
- **Label**: Inter 12px Medium (#374151)
- **Caption**: Inter 11px Regular (#6B7280)

### Common Components

#### Primary Button
- **Size**: Height 48px, Padding 12px 24px
- **Background**: #2563EB
- **Text**: Inter 14px Medium #FFFFFF
- **Border Radius**: 8px
- **Hover State**: Background #1E40AF
- **Shadow**: 0px 1px 2px rgba(0, 0, 0, 0.05)

#### Secondary Button
- **Size**: Height 48px, Padding 12px 24px
- **Background**: #FFFFFF
- **Border**: 1px solid #E2E8F0
- **Text**: Inter 14px Medium #1E293B
- **Border Radius**: 8px
- **Hover State**: Background #F8FAFC

#### Input Field
- **Size**: Height 48px, Padding 12px 16px
- **Background**: #FFFFFF
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 8px
- **Text**: Inter 14px Regular #1E293B
- **Placeholder**: Inter 14px Regular #94A3B8
- **Focus State**: Border #2563EB, Shadow 0px 0px 0px 3px rgba(37, 99, 235, 0.1)

---

## Page 1: Web Landing Page

### Canvas Settings
- **Frame Size**: 1440px × 3200px (Desktop)
- **Background**: #FFFFFF

### Header Section (1440px × 64px)
**Position**: Top of canvas
**Background**: #FFFFFF
**Border Bottom**: 1px solid #E2E8F0

#### Navigation Bar
- **Container**: 1200px width, centered horizontally
- **Height**: 64px
- **Logo Area** (Left):
  - UrbanAI logo placeholder: 120px × 32px
  - Text: "UrbanAI" Inter 20px SemiBold #2563EB
- **Navigation Links** (Center):
  - Links: "Features", "Privacy", "Contact"
  - Text: Inter 14px Medium #64748B
  - Spacing: 32px between links
  - Hover: Text color #2563EB
- **CTA Button** (Right):
  - "Get Started" Primary Button
  - Size: 48px height, 120px width

### Hero Section (1440px × 600px)
**Background**: Linear gradient from #F8FAFC to #FFFFFF
**Container**: 1200px width, centered
**Padding**: 80px 0

#### Content Layout (Two columns: 60% text, 40% illustration)
**Left Column (720px)**:
- **Headline**: 
  - Text: "Report Municipal Issues with Confidence"
  - Typography: Inter 48px Bold #1E293B
  - Line Height: 56px
  - Margin Bottom: 24px

- **Subheadline**:
  - Text: "UrbanAI empowers citizens to report construction and environmental compliance issues while ensuring complete privacy and GDPR compliance."
  - Typography: Inter 18px Regular #64748B
  - Line Height: 28px
  - Margin Bottom: 32px

- **CTA Buttons**:
  - Download buttons container: 320px width
  - "Download for iOS" button (156px × 56px)
  - "Download for Android" button (156px × 56px)
  - Spacing: 8px between buttons
  - Style: App store button design with rounded corners
  - Background: #000000, Text: #FFFFFF

**Right Column (480px)**:
- Illustration placeholder: 400px × 400px
- Background: #F1F5F9
- Border Radius: 12px
- Center-aligned within column

### Features Section (1440px × 800px)
**Background**: #FFFFFF
**Container**: 1200px width, centered
**Padding**: 100px 0

#### Section Header
- **Title**: "Why Choose UrbanAI"
- Typography: Inter 36px Bold #1E293B, centered
- Margin Bottom: 64px

#### Features Grid (3 columns)
**Each Feature Card (360px × 280px)**:
- **Background**: #FFFFFF
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 12px
- **Padding**: 32px
- **Shadow**: 0px 2px 8px rgba(0, 0, 0, 0.06)
- **Icon Area**: 64px × 64px circle, background #F1F5F9
- **Title**: Inter 20px SemiBold #1E293B, margin top 16px
- **Description**: Inter 14px Regular #64748B, line height 22px, margin top 8px
- **Spacing**: 40px between cards

**Feature 1: Privacy First**
- Icon: Shield placeholder (#059669)
- Description: "Your data stays private with OAuth-only authentication and no PII storage"

**Feature 2: Municipal Focus**
- Icon: Building placeholder (#2563EB)
- Description: "Specialized for construction and environmental compliance reporting"

**Feature 3: GDPR Compliant**
- Icon: Check placeholder (#059669)
- Description: "Fully compliant with European privacy regulations"

### Privacy Section (1440px × 400px)
**Background**: #F8FAFC
**Container**: 1200px width, centered
**Padding**: 80px 0

#### Content
- **Title**: "Your Privacy, Our Priority"
- Typography: Inter 28px SemiBold #1E293B, centered
- Margin Bottom: 16px
- **Description**: "We use OAuth authentication and store no personal information. Your reports are anonymous and secure."
- Typography: Inter 16px Regular #64748B, centered
- Line Height: 24px
- Margin Bottom: 24px
- **Link**: "Read our Privacy Policy"
- Typography: Inter 16px Medium #2563EB, underlined

### Footer Section (1440px × 200px)
**Background**: #1E293B
**Container**: 1200px width, centered
**Padding**: 40px 0

#### Footer Content
- **Logo**: UrbanAI logo in white (#FFFFFF)
- **Links**: Privacy Policy, Terms of Service, Contact
- **Text**: Inter 14px Regular #94A3B8
- **Copyright**: "© 2024 UrbanAI. All rights reserved."
- **Text**: Inter 12px Regular #94A3B8

---

## Page 2: Web Login Page

### Canvas Settings
- **Frame Size**: 1440px × 900px (Desktop)
- **Background**: Linear gradient from #F8FAFC to #E2E8F0

### Layout Structure
**Centered card**: 480px × 640px
**Card Background**: #FFFFFF
**Border Radius**: 16px
**Shadow**: 0px 8px 32px rgba(0, 0, 0, 0.12)
**Position**: Centered in canvas

### Header Area (480px × 120px)
**Position**: Top of card
**Padding**: 32px

#### Content
- **Logo**: UrbanAI logo, 40px height, centered
- **Title**: "Welcome Back"
- Typography: Inter 28px Bold #1E293B, centered
- Margin Top: 16px
- **Subtitle**: "Sign in to your account"
- Typography: Inter 16px Regular #64748B, centered
- Margin Top: 8px

### OAuth Buttons Section (480px × 360px)
**Container**: 416px width (32px margins)
**Spacing**: 16px between buttons

#### Microsoft Button
- **Size**: 416px × 56px
- **Background**: #0078D4
- **Border Radius**: 8px
- **Text**: "Continue with Microsoft"
- **Icon**: Microsoft logo (24px × 24px), left positioned
- **Text**: Inter 16px SemiBold #FFFFFF
- **Padding**: 16px 24px
- **Icon Margin Right**: 12px

#### Google Button  
- **Size**: 416px × 56px
- **Background**: #FFFFFF
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 8px
- **Text**: "Continue with Google"
- **Icon**: Google logo (24px × 24px), left positioned
- **Text**: Inter 16px SemiBold #1E293B
- **Padding**: 16px 24px
- **Icon Margin Right**: 12px

#### Facebook Button
- **Size**: 416px × 56px
- **Background**: #1877F2
- **Border Radius**: 8px
- **Text**: "Continue with Facebook"
- **Icon**: Facebook logo (24px × 24px), left positioned
- **Text**: Inter 16px SemiBold #FFFFFF
- **Padding**: 16px 24px
- **Icon Margin Right**: 12px

### Privacy Notice Section (480px × 120px)
**Padding**: 32px
**Background**: #F8FAFC
**Border Radius**: 8px
**Margin**: 24px 32px

#### Content
- **Icon**: Lock icon (20px), #059669
- **Title**: "Maximum Privacy"
- Typography: Inter 16px SemiBold #1E293B
- **Description**: "Only anonymous case links stored. Your identity stays with trusted providers."
- Typography: Inter 14px Regular #64748B
- Line Height: 20px

### Footer Section (480px × 160px)
**Padding**: 32px

#### Content
- **Divider**: 1px line, #E2E8F0, margin bottom 24px
- **Privacy Text**: "By signing in, you agree to our Privacy Policy and Terms of Service."
- Typography: Inter 12px Regular #64748B, centered
- Line Height: 18px
- **Links**: Privacy Policy, Terms of Service (underlined, #2563EB)
- **Back Link**: "← Back to Home"
- Typography: Inter 14px Medium #2563EB
- Position: Left aligned
- Margin Top: 16px

---

## Page 3: GDPR Compliance Page

### Canvas Settings
- **Frame Size**: 1440px × 2800px (Desktop)
- **Background**: #FFFFFF

### Header Section (1440px × 64px)
**Same as Web Landing Page header**

### Main Content (1440px × 2656px)
**Container**: 800px width, centered
**Padding**: 80px 0

#### Page Header (800px × 160px)
- **Title**: "Privacy & Data Protection"
- Typography: Inter 36px Bold #1E293B
- Margin Bottom: 16px
- **Subtitle**: "Your privacy rights and how we protect your data"
- Typography: Inter 18px Regular #64748B
- Line Height: 28px
- Margin Bottom: 24px
- **Last Updated**: "Last updated: January 2024"
- Typography: Inter 12px Regular #94A3B8

#### Content Sections

**Section Layout Pattern**:
- **Section Title**: Inter 24px SemiBold #1E293B, margin bottom 16px
- **Content**: Inter 16px Regular #1E293B, line height 28px
- **Spacing**: 48px between sections
- **Background**: #FFFFFF
- **Padding**: 32px
- **Border Radius**: 8px
- **Border**: 1px solid #E2E8F0

**Section 1: Your GDPR Rights (800px × 320px)**
- **Title**: "Your GDPR Rights"
- **Content**: 8 bullet points about GDPR rights
- **Bullet Style**: • (Inter 16px Regular #2563EB)
- **Text**: Inter 16px Regular #1E293B
- **Line Height**: 28px
- **Spacing**: 12px between bullets

**Section 2: Data We Collect (800px × 280px)**
- **Title**: "What Data We Collect"
- **Content**: Explanation of OAuth-only approach
- **Emphasis**: "Zero PII Storage" in bold (#059669)
- **Background Highlight**: Light green (#F0FDF4) for privacy guarantees

**Section 3: Legal Basis (800px × 240px)**
- **Title**: "Legal Basis for Processing"
- **Content**: Legal basis explanation
- **Reference**: Legitimate interests highlighted
- **Legal Text**: Inter 14px Regular #64748B (smaller for legal details)

**Section 4: Your Choices (800px × 300px)**
- **Title**: "Your Data Rights & Choices"
- **Content**: User control options
- **Action Items**: Highlighted in boxes with #F8FAFC background
- **Process**: Account deletion process steps

**Section 5: Contact Information (800px × 200px)**
- **Title**: "Contact Our Privacy Team"
- **Content**: DPO contact details
- **Email**: privacy@urbanai.app (clickable, #2563EB)
- **Address**: Formatted with proper spacing

#### CTA Section (800px × 120px)
- **Background**: #F8FAFC
- **Padding**: 32px
- **Border Radius**: 12px
- **Border**: 1px solid #E2E8F0
- **Text**: "Questions about your privacy?"
- Typography: Inter 18px SemiBold #1E293B
- **Button**: "Contact Our Privacy Team" (Primary Button)
- Margin Top: 16px

### Footer Section (1440px × 80px)
**Same as Web Landing Page footer**

---

## Page 4: Dashboard Page

### Canvas Settings
- **Frame Size**: 1440px × 1024px (Desktop)
- **Background**: #F8FAFC

### Header Section (1440px × 64px)
**Background**: #FFFFFF
**Border Bottom**: 1px solid #E2E8F0

#### Navigation Bar
- **Container**: 1200px width, centered
- **Logo** (Left): UrbanAI logo (120px × 32px)
- **Search Bar** (Center): 320px × 40px input field
- **User Menu** (Right):
  - User avatar: 40px circle (#94A3B8 placeholder)
  - Notification bell: 24px icon
  - Dropdown arrow: 16px icon
  - Background: #F8FAFC on hover
  - Padding: 8px 12px
  - Border Radius: 8px

### Sidebar (280px × 960px)
**Position**: Left side, fixed
**Background**: #FFFFFF
**Border Right**: 1px solid #E2E8F0

#### User Profile Section (280px × 80px)
- **Background**: #F8FAFC
- **Padding**: 16px
- **Avatar**: 48px circle
- **Name**: Inter 16px SemiBold #1E293B
- **Role**: Inter 12px Regular #64748B

#### Navigation Menu (280px × 320px)
**Menu Items** (280px × 56px each):
- **Dashboard** (Active)
- **Report Issue**
- **My Reports**
- **Settings**

**Active State**:
- Background: #EBF5FF
- Left border: 4px solid #2563EB
- Text: Inter 16px SemiBold #2563EB
- Icon: 24px, #2563EB

**Default State**:
- Text: Inter 16px Regular #64748B
- Icon: 24px, #64748B
- Hover: Background #F8FAFC
- Padding: 16px 20px

### Main Content Area (1160px × 960px)
**Position**: Right of sidebar
**Padding**: 32px

#### Page Header (1096px × 80px)
- **Title**: "Dashboard"
- Typography: Inter 32px Bold #1E293B
- **Subtitle**: "Overview of your municipal reports"
- Typography: Inter 16px Regular #64748B
- Margin Top: 8px

#### Stats Cards Row (1096px × 140px)
**Three cards**, spacing 24px

**Card Layout** (348px × 140px):
- **Background**: #FFFFFF
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: 0px 2px 8px rgba(0, 0, 0, 0.06)
- **Border**: 1px solid #E2E8F0

**Card 1: Total Reports**
- Icon: Document icon (32px), #2563EB
- Number: "12" (Inter 32px Bold #1E293B)
- Label: "Total Reports" (Inter 14px Regular #64748B)
- Change: "+2 this month" (Inter 12px Regular #059669)

**Card 2: In Progress**
- Icon: Clock icon (32px), #D97706
- Number: "3" (Inter 32px Bold #D97706)
- Label: "In Progress" (Inter 14px Regular #64748B)
- Change: "1 updated today" (Inter 12px Regular #64748B)

**Card 3: Resolved**
- Icon: Check icon (32px), #059669
- Number: "9" (Inter 32px Bold #059669)
- Label: "Resolved" (Inter 14px Regular #64748B)
- Change: "+1 this week" (Inter 12px Regular #059669)

#### Recent Reports Section (1096px × 400px)
**Section Header** (1096px × 60px):
- Title: "Recent Reports"
- Typography: Inter 20px SemiBold #1E293B
- Button: "View All" (Secondary Button, 100px × 36px)
- Position: Right aligned

**Reports Table** (1096px × 340px):
- **Background**: #FFFFFF
- **Border Radius**: 12px
- **Border**: 1px solid #E2E8F0
- **Headers**: Date, Type, Location, Status, Actions
- **Header Style**: Inter 12px SemiBold #64748B, uppercase
- **Row Height**: 60px
- **Row Style**: Inter 14px Regular #1E293B
- **Row Divider**: 1px solid #F1F5F9
- **Status Badges**: 
  - In Progress: #F59E0B background, #FFFFFF text, 8px border radius
  - Resolved: #059669 background, #FFFFFF text
  - Under Review: #6B7280 background, #FFFFFF text
  - Rejected: #DC2626 background, #FFFFFF text

#### Quick Actions Section (1096px × 200px)
**Two action cards**, spacing 24px

**Card Layout** (536px × 160px):
- **Background**: #FFFFFF
- **Border Radius**: 12px
- **Padding**: 24px
- **Border**: 1px solid #E2E8F0
- **Shadow**: 0px 2px 8px rgba(0, 0, 0, 0.06)

**Card 1: Report New Issue**
- Icon: Plus icon (40px), #2563EB
- Title: "Report New Issue" (Inter 18px SemiBold #1E293B)
- Description: "Submit a new municipal compliance report" (Inter 14px Regular #64748B)
- Button: "Get Started" (Primary Button, margin top 16px)

**Card 2: View Guidelines**
- Icon: Book icon (40px), #059669
- Title: "Reporting Guidelines" (Inter 18px SemiBold #1E293B)
- Description: "Learn about effective issue reporting" (Inter 14px Regular #64748B)
- Button: "Learn More" (Secondary Button, margin top 16px)

---

## Page 5: Android Login Screen

### Canvas Settings
- **Frame Size**: 375px × 812px (Mobile)
- **Background**: Linear gradient from #F8FAFC to #E2E8F0

### Status Bar (375px × 44px)
**Position**: Top
**Background**: Transparent
**Content**: Standard mobile status bar elements (time, battery, signal)

### Header Section (375px × 180px)
**Background**: Transparent
**Padding**: 24px

#### Content
- **Logo**: UrbanAI logo, 60px height, centered
- **Title**: "Welcome to UrbanAI"
- Typography: Inter 24px Bold #1E293B, centered
- Margin Top: 16px
- **Subtitle**: "Report municipal issues securely"
- Typography: Inter 16px Regular #64748B, centered
- Margin Top: 8px

### OAuth Buttons Section (375px × 320px)
**Container**: 327px width (24px margins)
**Spacing**: 16px between buttons

#### Microsoft Button
- **Size**: 327px × 56px
- **Background**: #0078D4
- **Border Radius**: 12px
- **Icon**: Microsoft logo (24px × 24px)
- **Text**: "Continue with Microsoft"
- **Typography**: Inter 16px SemiBold #FFFFFF
- **Padding**: 16px 20px
- **Icon Position**: Left, 12px margin right
- **Shadow**: 0px 2px 8px rgba(0, 120, 212, 0.2)

#### Google Button
- **Size**: 327px × 56px
- **Background**: #FFFFFF
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 12px
- **Icon**: Google logo (24px × 24px)
- **Text**: "Continue with Google"
- **Typography**: Inter 16px SemiBold #1E293B
- **Padding**: 16px 20px
- **Icon Position**: Left, 12px margin right
- **Shadow**: 0px 2px 8px rgba(0, 0, 0, 0.06)

#### Facebook Button
- **Size**: 327px × 56px
- **Background**: #1877F2
- **Border Radius**: 12px
- **Icon**: Facebook logo (24px × 24px)
- **Text**: "Continue with Facebook"
- **Typography**: Inter 16px SemiBold #FFFFFF
- **Padding**: 16px 20px
- **Icon Position**: Left, 12px margin right
- **Shadow**: 0px 2px 8px rgba(24, 119, 242, 0.2)

### Privacy Notice (375px × 160px)
**Padding**: 24px
**Background**: rgba(255, 255, 255, 0.9)
**Border Radius**: 16px (top corners only)
**Backdrop Blur**: 10px
**Border**: 1px solid rgba(255, 255, 255, 0.2)

#### Content
- **Icon**: Shield icon (24px), #059669
- **Title**: "Your Privacy is Protected"
- Typography: Inter 16px SemiBold #1E293B
- Margin Bottom: 8px
- **Description**: "We use secure OAuth and store no personal information"
- Typography: Inter 14px Regular #64748B
- Line Height: 20px
- Margin Bottom: 12px
- **Link**: "Privacy Policy"
- Typography: Inter 14px Medium #2563EB, underlined

### Footer (375px × 108px)
**Position**: Bottom
**Padding**: 24px

#### Content
- **Terms Text**: "By signing in, you agree to our Terms of Service and Privacy Policy"
- Typography: Inter 12px Regular #64748B, centered
- Line Height: 18px
- **Links**: Terms of Service, Privacy Policy (#2563EB, underlined)

---

## Page 6: Android Landing Screen

### Canvas Settings
- **Frame Size**: 375px × 812px (Mobile)
- **Background**: #F8FAFC

### Status Bar (375px × 44px)
**Standard mobile status bar**

### Header (375px × 80px)
**Background**: #FFFFFF
**Border Bottom**: 1px solid #E2E8F0
**Padding**: 16px 24px

#### Content
- **Left**: UrbanAI logo (100px width)
- **Right**: 
  - Profile avatar (32px circle)
  - Notification icon (24px) with red dot indicator (8px)
  - Spacing: 12px between elements

### Welcome Section (375px × 100px)
**Background**: #FFFFFF
**Padding**: 24px

#### Content
- **Greeting**: "Good morning, John"
- Typography: Inter 20px SemiBold #1E293B
- **Subtitle**: "Ready to report municipal issues?"
- Typography: Inter 14px Regular #64748B
- Margin Top: 4px

### Quick Stats (375px × 80px)
**Background**: #FFFFFF
**Padding**: 0 24px 24px
**Border Bottom**: 1px solid #F1F5F9

#### Stats Row (3 items, equal width)
**Each Stat** (109px width):
- **Number**: Inter 24px Bold (colored)
- **Label**: Inter 12px Regular #64748B
- **Spacing**: 8px vertical between number and label

**Stat 1**: "5" (#2563EB) - "Active Reports"
**Stat 2**: "12" (#059669) - "Resolved"  
**Stat 3**: "2" (#D97706) - "In Review"

### Main Actions (375px × 180px)
**Padding**: 24px
**Spacing**: 16px between items

#### Primary Action Button
- **Size**: 327px × 64px
- **Background**: #2563EB
- **Border Radius**: 16px
- **Icon**: Plus icon (24px) #FFFFFF, left positioned
- **Text**: "Report New Issue"
- Typography: Inter 18px SemiBold #FFFFFF
- **Shadow**: 0px 4px 12px rgba(37, 99, 235, 0.3)
- **Padding**: 20px 24px

#### Secondary Actions (2 buttons, side by side)
**Each Button**: 155.5px × 56px
**Spacing**: 16px between

**Button 1: My Reports**
- Background: #FFFFFF
- Border: 1px solid #E2E8F0
- Border Radius: 12px
- Icon: Document icon (20px), #64748B
- Text: "My Reports" (Inter 14px SemiBold #1E293B)
- Padding: 16px 12px
- Shadow: 0px 2px 8px rgba(0, 0, 0, 0.06)

**Button 2: Guidelines**
- Background: #FFFFFF
- Border: 1px solid #E2E8F0
- Border Radius: 12px  
- Icon: Book icon (20px), #64748B
- Text: "Guidelines" (Inter 14px SemiBold #1E293B)
- Padding: 16px 12px
- Shadow: 0px 2px 8px rgba(0, 0, 0, 0.06)

### Recent Activity (375px × 288px)
**Background**: #FFFFFF
**Margin Top**: 16px
**Padding**: 24px
**Border Radius**: 16px (top corners only)

#### Section Header (327px × 40px)
- **Title**: "Recent Activity"
- Typography: Inter 16px SemiBold #1E293B
- **View All Link**: "View All"
- Typography: Inter 14px Medium #2563EB
- Position: Right aligned

#### Activity List (327px × 200px)
**Each Activity Item** (327px × 60px):
- **Icon**: Circle (40px) with status color
- **Title**: Inter 14px SemiBold #1E293B
- **Subtitle**: Inter 12px Regular #64748B
- **Time**: Inter 12px Regular #94A3B8 (right-aligned)
- **Divider**: 1px line #F1F5F9 (except last item)
- **Padding**: 16px 0

**Activity 1**: 
- Icon: Green circle (#059669) with check mark
- Title: "Construction report resolved"
- Subtitle: "Report #CR-2024-001"
- Time: "2 hours ago"

**Activity 2**:
- Icon: Orange circle (#D97706) with clock icon
- Title: "Environmental report under review"
- Subtitle: "Report #ER-2024-003"
- Time: "1 day ago"

**Activity 3**:
- Icon: Blue circle (#2563EB) with upload icon
- Title: "New report submitted"
- Subtitle: "Report #CR-2024-002"  
- Time: "3 days ago"

---

## Implementation Guidelines

### Figma Setup
1. **Create new Figma file**: "UrbanAI Mobile & Web Mockups"
2. **Set up design system**: Import colors, typography, and components as specified
3. **Create separate pages**: One page for each mockup
4. **Use consistent naming**: Clear, hierarchical naming conventions

### Component Library
Create reusable components for:
- **Buttons**: Primary, Secondary, OAuth variants with all states
- **Input fields**: Default, focus, error, disabled states
- **Cards**: Content cards, stat cards, activity cards
- **Navigation**: Headers, sidebars, mobile navigation
- **Icons**: Use Feather or Heroicons, 24px standard size

### Responsive Considerations
- **Web pages**: Designed for 1440px desktop, scalable to 1200px
- **Mobile pages**: Designed for 375px width (iPhone standard)
- **Touch targets**: Minimum 44px for mobile accessibility
- **Spacing**: 8px base unit system throughout

### Export Settings
- **Individual pages**: Export as PNG (2x resolution for retina)
- **Components**: Export as SVG for development
- **Assets**: Organize in clearly labeled frames
- **Specifications**: Include dimensions and spacing annotations

### Accessibility Requirements
- **Color contrast**: Minimum 4.5:1 for text
- **Focus states**: Clear visual focus indicators
- **Touch targets**: 44px minimum on mobile
- **Text scaling**: Support for 200% zoom
- **Screen readers**: Proper labeling and hierarchy

This specification provides complete implementation details for all six required UrbanAI page mockups, ensuring consistency with the established design system and privacy-first approach. Each page includes exact measurements, color codes, typography specifications, and component details for pixel-perfect Figma implementation.
