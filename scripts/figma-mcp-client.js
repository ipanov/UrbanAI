const { spawn } = require('child_process');
const readline = require('readline');

class FigmaMCPClient {
    constructor() {
        this.requestId = 1;
        this.mcpProcess = null;
    }

    async connect() {
        // Start the Figma MCP server process
        const apiKey = process.env.FIGMA_API_KEY;
        if(!apiKey) {
            throw new Error('FIGMA_API_KEY environment variable not set. Create a .env file and set FIGMA_API_KEY=your_token');
        }

        this.mcpProcess = spawn('cmd', [
            '/c',
            'npx',
            '-y',
            'figma-developer-mcp',
            `--figma-api-key=${apiKey}`,
            '--stdio'
        ], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        this.mcpProcess.stderr.on('data', (data) => {
            console.error('MCP Error:', data.toString());
        });

        // Initialize the MCP session
        await this.sendRequest('initialize', {
            protocolVersion: '2024-11-05',
            capabilities: {
                tools: {}
            },
            clientInfo: {
                name: 'UrbanAI-Figma-Client',
                version: '1.0.0'
            }
        });

        console.log('Connected to Figma MCP server');
    }

    async sendRequest(method, params = {}) {
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

    async listTools() {
        return await this.sendRequest('tools/list');
    }

    async callTool(name, arguments_) {
        return await this.sendRequest('tools/call', {
            name: name,
            arguments: arguments_
        });
    }

    async createUrbanAIProject() {
        console.log('Starting UrbanAI Figma project creation...');
        
        try {
            // First, let's list available tools
            const tools = await this.listTools();
            console.log('Available tools:', JSON.stringify(tools, null, 2));

            // Create a new Figma file for UrbanAI
            // Note: We'll need to use existing Figma files and duplicate them, as the API doesn't directly create new files
            
            console.log('UrbanAI project setup initiated. Check the console for next steps.');
            
        } catch (error) {
            console.error('Error creating UrbanAI project:', error);
        }
    }

    disconnect() {
        if (this.mcpProcess) {
            this.mcpProcess.kill();
        }
    }
}

// Main execution
async function main() {
    const client = new FigmaMCPClient();
    
    try {
        await client.connect();
        await client.createUrbanAIProject();
    } catch (error) {
        console.error('Main error:', error);
    } finally {
        client.disconnect();
    }
}

main();
