const { spawn } = require('child_process');
const https = require('https');

class UrbanAIFigmaCreator {
    constructor() {
        this.requestId = 1;
        this.mcpProcess = null;
        this.apiKey = 'figd_Yo3KxsQasPbkD8r0k43UhcaPGUnL_IwU4Ye7JYOv';
    }

    async connectToMCP() {
        this.mcpProcess = spawn('cmd', [
            '/c',
            'npx',
            '-y',
            'figma-developer-mcp',
            '--figma-api-key=' + this.apiKey,
            '--stdio'
        ], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        this.mcpProcess.stderr.on('data', (data) => {
            console.error('MCP Error:', data.toString());
        });

        await this.sendMCPRequest('initialize', {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            clientInfo: { name: 'UrbanAI-Creator', version: '1.0.0' }
        });

        console.log('✅ Connected to Figma MCP server');
    }

    async sendMCPRequest(method, params = {}) {
        const request = {
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: this.requestId++
        };

        return new Promise((resolve, reject) => {
            this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');
            
            this.mcpProcess.stdout.once('data', (data) => {
                try {
                    const response = JSON.parse(data.toString());
                    if (response.error) {
                        reject(new Error(response.error.message));
                    } else {
                        resolve(response.result);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    async callFigmaAPI(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.figma.com',
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
                        resolve(parsed);
                    } catch (e) {
                        reject(e);
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
            console.log('👤 User:', userInfo.name);
            return userInfo;
        } catch (error) {
            console.error('❌ Error getting user info:', error.message);
            return null;
        }
    }

    async getRecentFiles() {
        try {
            const files = await this.callFigmaAPI('/v1/files/recent');
            console.log('📁 Recent files found:', files.files?.length || 0);
            return files.files || [];
        } catch (error) {
            console.error('❌ Error getting recent files:', error.message);
            return [];
        }
    }

    async createUrbanAIDesignSystem() {
        console.log('🎨 Creating UrbanAI Design System...');
        
        try {
            // Get user info
            const user = await this.getUserInfo();
            if (!user) {
                throw new Error('Could not authenticate with Figma');
            }

            // Get recent files to work with
            const recentFiles = await this.getRecentFiles();
            
            if (recentFiles.length === 0) {
                console.log('ℹ️  No recent files found. You\'ll need to create a new file in Figma manually first.');
                console.log('📝 Please:');
                console.log('   1. Go to https://figma.com');
                console.log('   2. Create a new design file named "UrbanAI Design System"');
                console.log('   3. Copy the file key from the URL');
                console.log('   4. Run this script again with the file key');
                return;
            }

            // Use the first available file or let user choose
            console.log('\n📋 Available files:');
            recentFiles.slice(0, 5).forEach((file, index) => {
                console.log(`   ${index + 1}. ${file.name} (${file.key})`);
            });

            // For now, let's create a comprehensive design guide that can be implemented
            await this.generateDesignSystemGuide();
            
        } catch (error) {
            console.error('❌ Error creating design system:', error.message);
        }
    }

    async generateDesignSystemGuide() {
        console.log('📋 Generating UrbanAI Design System Implementation Guide...');
        
        const designSystemGuide = {
            project: 'UrbanAI Design System',
            description: 'Construction & Environmental Issue Reporting Platform',
            colorPalette: {
                primary: {
                    blue: '#2563EB',
                    dark: '#1E40AF', 
                    light: '#3B82F6'
                },
                secondary: {
                    safetyGreen: '#059669',
                    alertOrange: '#EA580C',
                    professionalGray: '#6B7280'
                },
                semantic: {
                    success: '#10B981',
                    warning: '#F59E0B', 
                    error: '#EF4444',
                    info: '#06B6D4'
                },
                backgrounds: {
                    background: '#F9FAFB',
                    surface: '#FFFFFF',
                    muted: '#F3F4F6'
                },
                text: {
                    primary: '#111827',
                    secondary: '#6B7280',
                    muted: '#9CA3AF'
                }
            },
            typography: {
                heading1: 'Inter 32px Bold',
                heading2: 'Inter 24px SemiBold', 
                body: 'Inter 16px Regular',
                caption: 'Inter 14px Regular',
                buttonText: 'Inter 16px Medium'
            },
            components: {
                buttons: {
                    primary: {
                        background: '#2563EB',
                        text: 'White',
                        height: '48px',
                        borderRadius: '8px'
                    },
                    secondary: {
                        border: '#2563EB',
                        text: '#2563EB', 
                        height: '48px',
                        borderRadius: '8px'
                    }
                },
                forms: {
                    inputHeight: '48px',
                    border: '1px solid #E5E7EB',
                    focusBorder: '2px solid #2563EB',
                    borderRadius: '6px'
                }
            },
            screens: [
                'Welcome/Landing Screen',
                'Sign In/Sign Up Choice',
                'Multi-Provider Sign In', 
                'Registration with GDPR',
                'Issue Reporting Dashboard',
                'AI Analysis Results',
                'Interactive Chat Interface',
                'Report Generation',
                'Case Tracking Dashboard'
            ]
        };

        // Save the design system guide
        const fs = require('fs');
        const path = require('path');
        
        const guidePath = path.join(process.cwd(), 'docs', 'design-system', 'figma-implementation-guide.json');
        fs.writeFileSync(guidePath, JSON.stringify(designSystemGuide, null, 2));
        
        console.log('✅ Design system guide saved to:', guidePath);
        console.log('\n🎯 Next Steps:');
        console.log('1. Create a new Figma file at https://figma.com');
        console.log('2. Name it "UrbanAI Design System"');
        console.log('3. Use the color palette and components defined in the guide');
        console.log('4. Create pages for: Colors, Typography, Components, Auth Screens, App Screens');
        console.log('5. Copy the file key and update this script to automate frame creation');
        
        return designSystemGuide;
    }

    disconnect() {
        if (this.mcpProcess) {
            this.mcpProcess.kill();
        }
    }
}

// Execute the UrbanAI Figma creation
async function main() {
    const creator = new UrbanAIFigmaCreator();
    
    try {
        await creator.connectToMCP();
        await creator.createUrbanAIDesignSystem();
    } catch (error) {
        console.error('❌ Main error:', error);
    } finally {
        creator.disconnect();
    }
}

main();
