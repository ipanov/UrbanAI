const https = require('https');
const fs = require('fs');
const path = require('path');

class FigmaProjectCreator {
    constructor() {
        this.apiKey = process.env.FIGMA_API_KEY || '';
        if(!this.apiKey) {
            console.error('FIGMA_API_KEY environment variable not set. Create .env and set FIGMA_API_KEY.');
        }
        this.baseUrl = 'api.figma.com';
    }

    async callFigmaAPI(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.baseUrl,
                path: endpoint,
                method: method,
                headers: {
                    'X-Figma-Token': this.apiKey,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', chunk => responseData += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(responseData);
                        if (res.statusCode >= 400) {
                            reject(new Error(`API Error: ${parsed.message || parsed.error}`));
                        } else {
                            resolve(parsed);
                        }                    } catch (parseError) {
                        reject(new Error(`Failed to parse response: ${responseData}. Parse error: ${parseError.message}`));
                    }
                });
            });

            req.on('error', reject);
            
            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }

    async getUserInfo() {
        try {
            const userInfo = await this.callFigmaAPI('/v1/me');
            console.log('👤 Authenticated as:', userInfo.name, `(${userInfo.email})`);
            return userInfo;
        } catch (error) {
            console.error('❌ Authentication failed:', error.message);
            throw error;
        }
    }

    async listTeamProjects(teamId) {
        try {
            const projects = await this.callFigmaAPI(`/v1/teams/${teamId}/projects`);
            console.log('📁 Team Projects:');
            projects.projects.forEach(project => {
                console.log(`  - ${project.name} (ID: ${project.id})`);
            });
            return projects.projects;
        } catch (error) {
            console.error('❌ Failed to list team projects:', error.message);
            return [];
        }
    }

    async getRecentFiles() {
        try {
            const files = await this.callFigmaAPI('/v1/files/recent');
            console.log('📄 Recent Files:');
            files.recent_files.forEach(file => {
                console.log(`  - ${file.name} (Key: ${file.key})`);
            });
            return files.recent_files;
        } catch (error) {
            console.error('❌ Failed to get recent files:', error.message);
            return [];
        }
    }

    async createUrbanAIProject() {
        console.log('🚀 Starting UrbanAI Figma Project Creation');
        console.log('=' .repeat(50));

        try {            // Step 1: Authenticate and get user info
            await this.getUserInfo();
            
            // Step 2: Get recent files to see what's available
            const recentFiles = await this.getRecentFiles();
            
            if (recentFiles.length === 0) {
                console.log('📝 No recent files found. You may need to create a file manually in Figma first.');
                console.log('💡 Suggestion: Go to Figma.com and create a new design file named "UrbanAI Design System"');
                return;
            }

            // Step 3: Check if we have any teams to work with
            console.log('\n🔍 Checking for available teams...');
            
            // Get team info from recent files
            const teamIds = [...new Set(recentFiles
                .filter(file => file.project)
                .map(file => file.project.team_id)
                .filter(Boolean))];

            if (teamIds.length > 0) {
                for (const teamId of teamIds) {
                    await this.listTeamProjects(teamId);
                }
            }

            // Step 4: Generate UrbanAI Design System Guide
            await this.generateDesignSystemGuide();

            console.log('\n✅ UrbanAI Figma project analysis complete!');
            console.log('\n📋 Next Steps:');
            console.log('1. Create a new Figma file called "UrbanAI Design System"');
            console.log('2. Copy the file key from the URL when you create it');
            console.log('3. Run this script again with the file key to populate it with UrbanAI designs');
            console.log('4. Use the generated design system guide below');

        } catch (error) {
            console.error('❌ Error in project creation:', error.message);
        }
    }

    async populateUrbanAIFile(fileKey) {
        console.log(`🎨 Populating UrbanAI file: ${fileKey}`);
        
        try {
            // Get file info first
            const fileInfo = await this.callFigmaAPI(`/v1/files/${fileKey}`);
            console.log(`📄 File: ${fileInfo.name}`);
            
            // Note: The Figma API doesn't allow creating frames/components directly
            // We can only read and comment. To create content, we'd need to use Figma plugins
            // or the FigJam API for some operations.
            
            console.log('ℹ️  The Figma REST API is read-only for file content.');
            console.log('💡 To add frames and components, you can:');
            console.log('   1. Use Figma plugins');
            console.log('   2. Manually create frames using the design guide below');
            console.log('   3. Use the Figma desktop app with automation tools');
            
            return fileInfo;
            
        } catch (error) {
            console.error('❌ Error populating file:', error.message);
        }
    }

    generateDesignSystemGuide() {
        const guide = `
# UrbanAI Design System Implementation Guide

## 🎨 Color Palette
Create color styles in Figma with these values:

### Primary Colors
- Primary Blue: #2563EB
- Primary Blue Dark: #1E40AF
- Primary Blue Light: #3B82F6

### Status Colors
- Success Green: #059669
- Warning Orange: #D97706
- Error Red: #DC2626
- Info Blue: #0284C7

### Neutral Colors
- Background: #F8FAFC
- Surface: #FFFFFF
- Border: #E2E8F0
- Text Primary: #1E293B
- Text Secondary: #64748B
- Text Muted: #94A3B8

## 🔤 Typography Styles
Create text styles in Figma:

### Headings
- H1: Inter, 32px, Bold, #1E293B
- H2: Inter, 24px, Semibold, #1E293B
- H3: Inter, 20px, Semibold, #1E293B
- H4: Inter, 18px, Medium, #1E293B

### Body Text
- Body Large: Inter, 16px, Regular, #1E293B
- Body: Inter, 14px, Regular, #1E293B
- Body Small: Inter, 12px, Regular, #64748B

### UI Text
- Button: Inter, 14px, Medium
- Label: Inter, 12px, Medium, #374151
- Caption: Inter, 11px, Regular, #6B7280

## 📐 Component Frames to Create

### 1. Authentication Components
Frame Name: "Authentication"
- Login Card (400x500px)
- Register Card (400x600px)
- Password Reset (400x300px)
- Social Login Buttons (280x48px each)
- Input Fields (280x48px)
- Primary Button (280x48px)
- Secondary Button (280x48px)

### 2. Navigation Components
Frame Name: "Navigation"
- Header Bar (1200x64px)
- Sidebar Navigation (240x800px)
- Mobile Bottom Navigation (375x80px)
- Breadcrumb (auto-width x 32px)

### 3. Issue Reporting Components
Frame Name: "Issue Reporting"
- Issue Card (320x400px)
- Issue Form (400x600px)
- Photo Upload Component (280x200px)
- Location Picker (280x200px)
- Category Selector (280x48px)
- Priority Selector (280x48px)

### 4. Dashboard Components
Frame Name: "Dashboard"
- Statistics Card (240x120px)
- Recent Issues List (360x400px)
- Chart Container (400x300px)
- Filter Panel (280x400px)

### 5. AI Chat Components
Frame Name: "AI Chat"
- Chat Container (400x500px)
- Message Bubble User (max 280px x auto)
- Message Bubble AI (max 280px x auto)
- Input Field with Send (360x48px)
- Typing Indicator (80x24px)

## 🏗️ Page Layouts

### 1. Login Page
Frame Size: 1440x900px (Desktop), 375x812px (Mobile)
- Center the login card
- Add UrbanAI logo and tagline
- Include background pattern/image
- Social login options
- GDPR compliance notice

### 2. Dashboard Page
Frame Size: 1440x900px (Desktop), 375x812px (Mobile)
- Header with navigation
- Sidebar with menu (desktop only)
- Main content area with statistics
- Recent issues section
- Quick action buttons

### 3. Issue Reporting Page
Frame Size: 1440x900px (Desktop), 375x812px (Mobile)
- Step-by-step form layout
- Photo upload area
- Location map integration
- Category and priority selection
- Submit and save draft buttons

### 4. AI Chat Page
Frame Size: 1440x900px (Desktop), 375x812px (Mobile)
- Chat interface
- Conversation history
- Input area
- Suggested actions panel

## 🔧 Implementation Steps

1. **Create Master File**
   - New Figma file: "UrbanAI Design System"
   - Set up color styles
   - Set up text styles
   - Create effect styles (shadows, etc.)

2. **Build Components**
   - Create each component frame
   - Use auto-layout for responsive behavior
   - Add component descriptions
   - Set up variants for different states

3. **Design Pages**
   - Create page frames
   - Use components for consistency
   - Add responsive breakpoints
   - Test user flows

4. **Export Assets**
   - Generate icons as SVG
   - Export images for development
   - Create component specifications
   - Document interaction states

## 📱 Mobile Considerations

- Use 375px width for mobile frames
- Stack components vertically
- Increase touch targets to 44px minimum
- Simplify navigation for small screens
- Consider gesture-based interactions

## ♿ Accessibility

- Ensure color contrast ratios meet WCAG 2.1 AA
- Include focus states for all interactive elements
- Add alt text for all images
- Design clear loading and error states
- Test with screen reader simulation

---

✨ This guide will help you create a complete UrbanAI design system in Figma!
        `;

        // Write the guide to a file
        const guidePath = path.join(__dirname, '..', 'docs', 'design-system', 'figma-implementation-guide.md');
        
        // Ensure directory exists
        const dir = path.dirname(guidePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(guidePath, guide);
        console.log(`\n📖 Design System Guide saved to: ${guidePath}`);
        
        return guide;
    }
}

// Main execution
async function main() {
    const creator = new FigmaProjectCreator();
    
    // Check if a file key was provided as argument
    const fileKey = process.argv[2];
    
    if (fileKey) {
        console.log(`🎯 Populating specific file: ${fileKey}`);
        await creator.populateUrbanAIFile(fileKey);
    } else {
        await creator.createUrbanAIProject();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = FigmaProjectCreator;
