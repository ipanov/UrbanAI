#!/usr/bin/env node

/**
 * UrbanAI CLI Working Demonstration
 *
 * A working CLI that demonstrates parallel execution with actual command modules
 */

const path = require('path');
const { AgentCommandSystem } = require('./agent-commands-simple');

// Import a working command module
const { BackendCommands } = require('./commands/backend-commands');

class UrbanAICLI {
    constructor() {
        this.commandSystem = new AgentCommandSystem();
        this.backendCommands = new BackendCommands();
        this.registerCommands();
    }

    registerCommands() {
        // Register backend commands with proper function binding
        this.commandSystem.registerCommand('backend:develop-api', {
            description: 'Develop API endpoints with Clean Architecture',
            execute: (args) => this.backendCommands.developApiEndpoints(args)
        });

        this.commandSystem.registerCommand('backend:setup-database', {
            description: 'Setup database architecture with migrations',
            execute: (args) => this.backendCommands.designDatabaseArchitecture(args)
        });

        this.commandSystem.registerCommand('backend:implement-security', {
            description: 'Implement authentication and security layer',
            execute: (args) => this.backendCommands.implementSecurityArchitecture(args)
        });

        this.commandSystem.registerCommand('backend:optimize-performance', {
            description: 'Optimize backend performance and scalability',
            execute: (args) => this.backendCommands.optimizePerformance(args)
        });

        // Register simple test commands
        this.commandSystem.registerCommand('test:parallel-api', {
            description: 'Test parallel API development',
            execute: async () => {
                console.log('🚀 Testing parallel API development...');

                const commands = [
                    { name: 'backend:develop-api', args: ['--feature=user-management', '--complexity=medium'] },
                    { name: 'backend:setup-database', args: ['--feature=user-management'] },
                    { name: 'backend:implement-security', args: ['--feature=user-management'] }
                ];

                return this.commandSystem.executeParallelCommands(commands);
            }
        });

        this.commandSystem.registerCommand('demo:backend-workflow', {
            description: 'Demonstrate complete backend workflow',
            execute: async () => {
                console.log('🚀 Demonstrating complete backend development workflow...');

                const commands = [
                    { name: 'backend:develop-api', args: ['--feature=issue-reporting', '--complexity=high'] },
                    { name: 'backend:setup-database', args: ['--feature=issue-reporting'] },
                    { name: 'backend:implement-security', args: ['--feature=issue-reporting'] },
                    { name: 'backend:optimize-performance', args: ['--feature=issue-reporting'] }
                ];

                return this.commandSystem.executeParallelCommands(commands);
            }
        });

        // Register development server command
        this.commandSystem.registerCommand('dev:start-servers', {
            description: 'Start development servers',
            execute: async () => {
                const { spawn } = require('child_process');
                return new Promise((resolve, reject) => {
                    console.log('🚀 Starting development servers...');
                    const child = spawn('node', ['.claude/scripts/start-development-servers.js'], {
                        stdio: 'inherit',
                        cwd: process.cwd()
                    });

                    child.on('exit', (code) => {
                        if (code === 0) {
                            resolve({ success: true, message: 'Development servers started successfully' });
                        } else {
                            reject(new Error(`Development servers exited with code ${code}`));
                        }
                    });

                    child.on('error', reject);
                });
            }
        });
    }

    async execute(args) {
        if (args.length === 0) {
            const helpResult = await this.commandSystem.executeCommand('help');
            this.displayResult(helpResult);
            return;
        }

        const command = args[0];
        const commandArgs = args.slice(1);

        try {
            const result = await this.commandSystem.executeCommand(command, commandArgs);
            this.displayResult(result);

            if (!result.success) {
                process.exit(1);
            }
        } catch (error) {
            console.error('❌ Command execution failed:', error.message);
            process.exit(1);
        }
    }

    displayResult(result) {
        if (result.success) {
            console.log('✅ Command executed successfully');

            if (result.message) {
                console.log(result.message);
            }

            if (result.data) {
                console.log('\n📊 Results:');
                console.log(JSON.stringify(result.data, null, 2));
            }

            if (result.performance) {
                console.log('\n⚡ Performance Metrics:');
                console.log(`  Execution Time: ${result.performance.executionTime}ms`);
                console.log(`  Parallel Tasks: ${result.performance.parallelTasks}`);
                console.log(`  Success Rate: ${(result.performance.successRate * 100).toFixed(1)}%`);
            }
        } else {
            console.log('❌ Command execution failed');
            console.log(result.message || 'Unknown error occurred');

            if (result.errors && result.errors.length > 0) {
                console.log('\n🔍 Errors:');
                result.errors.forEach(error => {
                    console.log(`  - ${error}`);
                });
            }
        }
    }
}

// CLI Entry Point
if (require.main === module) {
    const cli = new UrbanAICLI();
    cli.execute(process.argv.slice(2));
}

module.exports = UrbanAICLI;