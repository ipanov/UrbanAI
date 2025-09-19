#!/usr/bin/env node

/**
 * UrbanAI CLI Test Interface
 *
 * A minimal test version to verify the CLI system works correctly
 */

const path = require('path');
const { AgentCommandSystem } = require('./agent-commands-simple');

class UrbanAITestCLI {
    constructor() {
        this.commandSystem = new AgentCommandSystem();
        this.registerTestCommands();
    }

    registerTestCommands() {
        // Register simple test commands
        this.commandSystem.registerCommand('test:backend', {
            description: 'Test backend development commands',
            execute: async () => {
            console.log('🔧 Testing backend development commands...');

            // Simulate parallel backend development
            const tasks = [
                'Designing API endpoints',
                'Setting up database models',
                'Implementing security layer',
                'Creating unit tests'
            ];

            for (const task of tasks) {
                console.log(`   🔄 ${task}...`);
                await this.delay(300);
            }

            return {
                success: true,
                message: 'Backend development test completed',
                data: {
                    tasks: tasks.length,
                    parallelUtilization: '4 subagents',
                    status: 'completed'
                }
            };
        }
        });

        this.commandSystem.registerCommand('test:frontend', {
            description: 'Test frontend development commands',
            execute: async () => {
            console.log('🎨 Testing frontend development commands...');

            const tasks = [
                'Developing React components',
                'Implementing responsive design',
                'Setting up state management',
                'Creating E2E tests'
            ];

            for (const task of tasks) {
                console.log(`   🔄 ${task}...`);
                await this.delay(300);
            }

            return {
                success: true,
                message: 'Frontend development test completed',
                data: {
                    tasks: tasks.length,
                    parallelUtilization: '4 subagents',
                    status: 'completed'
                }
            };
        }
        });

        this.commandSystem.registerCommand('test:parallel', {
            description: 'Test parallel command execution',
            execute: async () => {
                console.log('🚀 Testing parallel execution...');

                const commands = [
                    { name: 'test:backend', args: [] },
                    { name: 'test:frontend', args: [] }
                ];

                return this.commandSystem.executeParallelCommands(commands);
            }
        });

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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CLI Entry Point
if (require.main === module) {
    const cli = new UrbanAITestCLI();
    cli.execute(process.argv.slice(2));
}

module.exports = UrbanAITestCLI;