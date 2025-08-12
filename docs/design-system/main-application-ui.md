# UrbanAI Main Application UI Design

## Overview
The main application interface focuses on the core UrbanAI workflow: photo upload, issue classification, AI analysis, and municipal reporting for construction and environmental violations.

## Core User Flows

### 1. Issue Reporting Dashboard
**Purpose**: Primary interface for submitting construction/environmental issue reports

**Layout (Desktop)**:
```
┌─────────────────────────────────────────────────────────────────┐
│ UrbanAI     🏠 Dashboard  📊 Reports  ⚙️ Settings   👤 Profile │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│               Report Construction Issue                         │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐   │
│  │                 │  │  📍 Location Detection              │   │
│  │   📷 Upload     │  │  ─────────────────────────────────  │   │
│  │     Photo       │  │  📍 123 Main St, Springfield       │   │
│  │                 │  │  🗺️ [Interactive Map]              │   │
│  │  [Browse Files] │  │                                     │   │
│  │   or drag here  │  │  Issue Type:                        │   │
│  │                 │  │  [ ] Construction Safety            │   │
│  └─────────────────┘  │  [ ] Building Code Violation        │   │
│                       │  [ ] Environmental Hazard           │   │
│  Description:         │  [ ] Road/Infrastructure            │   │
│  ┌─────────────────┐  │  [ ] Other: ____________            │   │
│  │ Describe what   │  │                                     │   │
│  │ you observed... │  │  Urgency Level:                     │   │
│  │                 │  │  ⚪ Low  🔵 Medium  🔴 High        │   │
│  │                 │  └─────────────────────────────────────┘   │
│  └─────────────────┘                                           │
│                                                                 │
│                    [🤖 Analyze with AI] [📤 Submit Report]      │
└─────────────────────────────────────────────────────────────────┘
```

### 2. AI Analysis Results Screen
**Purpose**: Display AI classification and regulatory analysis

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Analysis Results                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🤖 Analysis Complete                     ⏱️ Processed in 3.2s  │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐   │
│  │                 │  │  📋 Issue Classification             │   │
│  │   [Uploaded     │  │  ─────────────────────────────────  │   │
│  │    Photo]       │  │  Category: Building Code Violation  │   │
│  │                 │  │  Confidence: 94%                    │   │
│  │  🔍 View Full   │  │                                     │   │
│  │     Size        │  │  🏗️ Specific Issues Detected:       │   │
│  └─────────────────┘  │  • Improper railing height          │   │
│                       │  • Missing safety barriers          │   │
│  📊 Regulatory Check  │  • Non-compliant materials          │   │
│  ┌─────────────────┐  │                                     │   │
│  │ ✅ Local Code   │  │  ⚖️ Relevant Regulations:           │   │
│  │    DB-2024.1    │  │  • Municipal Code Sec. 15.24       │   │
│  │ ✅ State Regs   │  │  • Safety Standard ISO-14001       │   │
│  │    ENV-2023     │  │  • Building Code Chapter 7         │   │
│  │ ⚠️ Federal EPA  │  └─────────────────────────────────────┘   │
│  │    Under Review │                                           │
│  └─────────────────┘                                           │
│                                                                 │
│  💬 Need More Info? [Chat with AI Assistant]                   │
│                                                                 │
│  📤 Next Steps:                                                 │
│  [📋 Generate Report] [📧 Contact Authority] [💾 Save Draft]    │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Interactive AI Chat Interface
**Purpose**: Gather additional information through conversational UI

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 UrbanAI Assistant                              [❌ Close]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🤖 I need a few more details to complete the analysis.         │
│     Can you help me measure the railing height?                 │
│                                                   10:34 AM      │
│                                                                 │
│  👤 Sure, how do I measure it properly?                         │
│                                                   10:35 AM      │
│                                                                 │
│  🤖 Please measure from the floor to the top of the            │
│     railing. Building code requires minimum 42 inches          │
│     (107 cm) for safety.                                       │
│                                                   10:35 AM      │
│                                                                 │
│     [📏 Measurement Guide] [📷 Photo Example]                   │
│                                                                 │
│  👤 I measured 38 inches                                        │
│                                                   10:37 AM      │
│                                                                 │
│  🤖 ⚠️ That confirms a violation! The railing is 4 inches      │
│     below code. This is a safety hazard that should be         │
│     reported immediately.                                       │
│                                                   10:37 AM      │
│                                                                 │
│     [📋 Update Report] [🚨 Mark as Urgent]                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  💬 [Type your message...]                         [📤 Send]   │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Report Generation & Submission
**Purpose**: Create official documents for municipal submission

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│                    Municipal Report Generator                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 Report Summary                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📍 Location: 123 Main St, Springfield                         │
│  📅 Date Reported: June 23, 2025                               │
│  👤 Reporter: John Citizen (Verified)                          │
│  🏷️ Case ID: URB-2025-06-001234                                │
│                                                                 │
│  ⚠️ Violation Type: Building Code Non-Compliance               │
│  🎯 Risk Level: Medium-High                                    │
│                                                                 │
│  📊 Evidence Package:                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Original Photo  │  │ Measurements    │  │ AI Analysis     │ │
│  │ [Thumbnail]     │  │ Railing: 38"    │  │ 94% Confidence  │ │
│  └─────────────────┘  │ Required: 42"   │  │ Building Code   │ │
│                       │ Gap: -4 inches  │  │ Section 15.24   │ │
│                       └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  🏛️ Submission Options:                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 🟢 Springfield Building Inspector                          │ │
│  │    📧 inspector@springfield.gov                           │ │
│  │    📞 (555) 123-4567                                      │ │
│  │    🌐 Online Portal Available                             │ │
│  │                                        [🚀 Submit Online] │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📄 Document Formats:                                           │
│  [📑 PDF Report] [📧 Email Template] [💾 Export Data]          │
│                                                                 │
│  🔔 Follow-up Options:                                          │
│  ☑️ Track case status     ☑️ Notify of updates                 │
│  ☐ Anonymous submission   ☐ Media sharing consent              │
│                                                                 │
│                            [📤 Submit Report]                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Case Tracking Dashboard
**Purpose**: Monitor submitted reports and their resolution status

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│                       My Case Reports                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Overview                        🔍 [Search cases...]        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │     12      │ │      5      │ │      3      │ │      4      │ │
│  │   Total     │ │   Under     │ │   Resolved  │ │   Pending   │ │
│  │   Cases     │ │   Review    │ │    Cases    │ │   Response  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                 │
│  📋 Recent Cases                                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 🟡 URB-2025-06-001234  Building Code Violation             │ │
│  │    📍 123 Main St • 📅 Jun 23 • ⏰ Under Review           │ │
│  │    Inspector: J. Smith • Expected: Jul 7                   │ │
│  │                                    [📱 Contact] [📄 View] │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ 🟢 URB-2025-06-001201  Environmental Hazard               │ │
│  │    📍 456 Oak Ave • 📅 Jun 20 • ✅ Resolved               │ │
│  │    Resolution: Cleanup completed • Inspector: M. Johnson    │ │
│  │                                    [⭐ Rate] [📄 View]     │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ 🔴 URB-2025-06-001189  Safety Violation                   │ │
│  │    📍 789 Pine St • 📅 Jun 18 • ⚠️ Escalated             │ │
│  │    Status: Referred to Legal • Contact: City Attorney      │ │
│  │                                    [📞 Call] [📄 View]    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📈 Analytics                                                   │
│  • Average resolution time: 14 days                            │
│  • Your response rate: 89% (above average)                     │
│  • Community impact: 47 issues resolved                        │
│                                                                 │
│                               [📝 New Report] [📊 Full Stats]  │
└─────────────────────────────────────────────────────────────────┘
```

## Mobile-Responsive Design

### Mobile Report Submission (375px width)
```
┌─────────────────────┐
│ ≡ UrbanAI          │
├─────────────────────┤
│  Report New Issue   │
│                     │
│ ┌─────────────────┐ │
│ │                 │ │
│ │   📷 Add Photo  │ │
│ │                 │ │
│ └─────────────────┘ │
│                     │
│ 📍 Current Location │
│ 123 Main St...      │
│ [📍 Change]         │
│                     │
│ Issue Type:         │
│ [Construction ▼]    │
│                     │
│ Description:        │
│ ┌─────────────────┐ │
│ │ What did you    │ │
│ │ observe?        │ │
│ └─────────────────┘ │
│                     │
│ Urgency:            │
│ ⚪ 🔵 🔴            │
│                     │
│ [🤖 Analyze Issue]  │
│ [📤 Quick Submit]   │
└─────────────────────┘
```

## Component Library Requirements

### Form Components
- **File Upload**: Drag-and-drop with preview
- **Location Picker**: Map integration with autocomplete
- **Issue Type Selector**: Categorized checkboxes with icons
- **Urgency Indicator**: Color-coded radio buttons
- **Measurement Input**: Numeric with unit conversion

### Display Components
- **Analysis Card**: Confidence meter with breakdown
- **Regulation Viewer**: Expandable sections with citations
- **Case Status Badge**: Color-coded with animations
- **Progress Timeline**: Visual status tracking
- **Report Preview**: PDF-style layout preview

### Interactive Components
- **AI Chat Bubble**: Conversational interface with quick replies
- **Image Annotation**: Markup tools for highlighting issues
- **Municipal Directory**: Contact finder with integration options
- **Notification Panel**: Real-time status updates

## Accessibility & Performance

### Mobile Optimization
- **Touch Targets**: Minimum 44px for all interactive elements
- **Offline Support**: Cache critical functionality
- **Camera Integration**: Native camera access with compression
- **GPS Integration**: Background location services

### Performance Targets
- **Initial Load**: < 2 seconds on 3G
- **Image Upload**: Progress indicators with compression
- **AI Analysis**: Streaming results with partial updates
- **Report Generation**: Background processing with notifications

This comprehensive UI design ensures UrbanAI provides an intuitive, accessible, and professional interface for all stakeholders involved in construction and environmental issue reporting, while maintaining the civic trust essential for municipal collaboration.
