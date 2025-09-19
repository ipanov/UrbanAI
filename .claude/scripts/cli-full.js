#!/usr/bin/env node

/**
 * UrbanAI CLI Interface - Full Version
 *
 * A comprehensive CLI interface for executing all agent commands with parallel execution
 */

const path = require('path');
const { AgentCommandSystem } = require('./agent-commands-simple');

// Import specialized command modules
const { BackendCommands } = require('./commands/backend-commands');
const { FrontendCommandSystem } = require('./commands/frontend-commands');
const { QACommandSystem } = require('./commands/qa-commands');
const { ArchitectCommandSystem } = require('./commands/architect-commands');
const { MobileCommands } = require('./commands/mobile-commands');
const { ProductOwnerCommands } = require('./commands/product-owner-commands');

class UrbanAICLI {
    constructor() {
        this.commandSystem = new AgentCommandSystem();
        this.backendCommands = new BackendCommands();
        this.frontendCommands = new FrontendCommandSystem();
        this.qaCommands = new QACommandSystem();
        this.architectCommands = new ArchitectCommandSystem();
        this.mobileCommands = new MobileCommands();
        this.productOwnerCommands = new ProductOwnerCommands();

        this.registerSpecializedCommands();
    }

    registerSpecializedCommands() {
        // Register backend commands
        this.commandSystem.registerCommand('backend:develop-api', {
            description: 'Develop API endpoints with Clean Architecture',
            execute: async (args) => {
                return this.backendCommands.developApiEndpoints(args);
            }
        });

        this.commandSystem.registerCommand('backend:setup-database', {
            description: 'Setup database architecture with migrations',
            execute: async (args) => {
                return this.backendCommands.setupDatabaseArchitecture(args);
            }
        });

        this.commandSystem.registerCommand('backend:implement-security', {
            description: 'Implement authentication and security layer',
            execute: async (args) => {
                return this.backendCommands.implementSecurityLayer(args);
            }
        });

        this.commandSystem.registerCommand('backend:optimize-performance', {
            description: 'Optimize backend performance and scalability',
            execute: async (args) => {
                return this.backendCommands.optimizePerformance(args);
            }
        });

        // Register frontend commands
        this.commandSystem.registerCommand('frontend:develop-component', {
            description: 'Develop React components with TypeScript',
            execute: async (args) => {
                return this.frontendCommands.developReactComponent(args);
            }
        });

        this.commandSystem.registerCommand('frontend:implement-responsive', {
            description: 'Implement responsive design patterns',
            execute: async (args) => {
                return this.frontendCommands.implementResponsiveDesign(args);
            }
        });

        this.commandSystem.registerCommand('frontend:optimize-performance', {
            description: 'Optimize frontend performance and bundle size',
            execute: async (args) => {
                return this.frontendCommands.optimizeFrontendPerformance(args);
            }
        });

        this.commandSystem.registerCommand('frontend:run-e2e-tests', {
            description: 'Run E2E tests with Playwright',
            execute: async (args) => {
                return this.frontendCommands.runE2ETests(args);
            }
        });

        // Register QA commands
        this.commandSystem.registerCommand('qa:run-unit-tests', {
            description: 'Run comprehensive unit tests',
            execute: async (args) => {
                return this.qaCommands.runUnitTests(args);
            }
        });

        this.commandSystem.registerCommand('qa:run-integration-tests', {
            description: 'Run integration tests across all layers',
            execute: async (args) => {
                return this.qaCommands.runIntegrationTests(args);
            }
        });

        this.commandSystem.registerCommand('qa:run-e2e-tests', {
            description: 'Run end-to-end tests with cross-browser validation',
            execute: async (args) => {
                return this.qaCommands.runE2ETests(args);
            }
        });

        this.commandSystem.registerCommand('qa:run-performance-tests', {
            description: 'Run performance and load testing',
            execute: async (args) => {
                return this.qaCommands.runPerformanceTests(args);
            }
        });

        this.commandSystem.registerCommand('qa:run-security-tests', {
            description: 'Run security compliance and vulnerability tests',
            execute: async (args) => {
                return this.qaCommands.runSecurityTests(args);
            }
        });

        // Register architect commands
        this.commandSystem.registerCommand('architect:research-technology', {
            description: 'Research technology stacks and architectures',
            execute: async (args) => {
                return this.architectCommands.researchTechnologyStack(args);
            }
        });

        this.commandSystem.registerCommand('architect:design-architecture', {
            description: 'Design system architecture with patterns',
            execute: async (args) => {
                return this.architectCommands.designArchitecture(args);
            }
        });

        this.commandSystem.registerCommand('architect:create-documentation', {
            description: 'Create comprehensive architecture documentation',
            execute: async (args) => {
                return this.architectCommands.createDocumentation(args);
            }
        });

        this.commandSystem.registerCommand('architect:validate-architecture', {
            description: 'Validate architecture against requirements',
            execute: async (args) => {
                return this.architectCommands.validateArchitecture(args);
            }
        });

        // Register mobile commands
        this.commandSystem.registerCommand('mobile:develop-cross-platform', {
            description: 'Develop cross-platform mobile UI',
            execute: async (args) => {
                return this.mobileCommands.developCrossPlatformUI(args);
            }
        });

        this.commandSystem.registerCommand('mobile:develop-android', {
            description: 'Develop Android platform-specific features',
            execute: async (args) => {
                return this.mobileCommands.developAndroidPlatform(args);
            }
        });

        this.commandSystem.registerCommand('mobile:develop-ios', {
            description: 'Develop iOS platform-specific features',
            execute: async (args) => {
                return this.mobileCommands.developIOSPlatform(args);
            }
        });

        this.commandSystem.registerCommand('mobile:run-mobile-tests', {
            description: 'Run mobile-specific testing',
            execute: async (args) => {
                return this.mobileCommands.runMobileTests(args);
            }
        });

        // Register product owner commands
        this.commandSystem.registerCommand('po:orchestrate-feature', {
            description: 'Orchestrate complete feature development',
            execute: async (args) => {
                return this.productOwnerCommands.orchestrateFeatureDevelopment(args);
            }
        });

        this.commandSystem.registerCommand('po:manage-resources', {
            description: 'Manage resources dynamically across teams',
            execute: async (args) => {
                return this.productOwnerCommands.manageResourcesDynamically(args);
            }
        });

        this.commandSystem.registerCommand('po:coordinate-teams', {
            description: 'Coordinate cross-team development',
            execute: async (args) => {
                return this.productOwnerCommands.coordinateCrossTeamDevelopment(args);
            }
        });

        this.commandSystem.registerCommand('po:enforce-quality-gates', {
            description: 'Enforce quality gates and compliance',
            execute: async (args) => {
                return this.productOwnerCommands.enforceQualityGates(args);
            }
        });

        // Register parallel execution command
        this.commandSystem.registerCommand('parallel:execute', {
            description: 'Execute multiple commands in parallel',
            execute: async (args) => {
                const commands = args.map(arg => {
                    const [name, ...cmdArgs] = arg.split(':');
                    return { name, args: cmdArgs };
                });

                return this.commandSystem.executeParallelCommands(commands);
            }
        });

        // Register development workflow commands
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

        this.commandSystem.registerCommand('dev:run-tests', {
            description: 'Run complete test suite',
            execute: async () => {
                const { spawn } = require('child_process');
                return new Promise((resolve, reject) => {
                    const child = spawn('npm', ['run', 'test:complete'], {
                        stdio: 'inherit',
                        cwd: path.join(process.cwd(), 'src/UrbanAI.Frontend')
                    });

                    child.on('exit', (code) => {
                        if (code === 0) {
                            resolve({ success: true, message: 'All tests completed successfully' });
                        } else {
                            reject(new Error(`Tests failed with exit code ${code}`));
                        }
                    });

                    child.on('error', reject);
                });
            }
        });

        // Register demonstration commands
        this.commandSystem.registerCommand('demo:parallel-development', {
            description: 'Demonstrate parallel development workflow',
            execute: async () => {
                console.log('🚀 Demonstrating parallel development workflow...');

                const commands = [
                    { name: 'backend:develop-api', args: ['--feature=user-management', '--complexity=medium'] },
                    { name: 'frontend:develop-component', args: ['--component=UserDashboard', '--type=responsive'] },
                    { name: 'qa:run-unit-tests', args: ['--coverage=85'] }
                ];

                return this.commandSystem.executeParallelCommands(commands);
            }
        });

        this.commandSystem.registerCommand('demo:full-feature', {
            description: 'Demonstrate complete feature development lifecycle',
            execute: async () => {
                console.log('🚀 Demonstrating complete feature development lifecycle...');

                const commands = [
                    { name: 'architect:design-architecture', args: ['--feature=mobile-issue-reporting'] },
                    { name: 'backend:develop-api', args: ['--feature=issue-reporting'] },
                    { name: 'frontend:develop-component', args: ['--component=IssueReportingForm'] },
                    { name: 'mobile:develop-cross-platform', args: ['--feature=issue-reporting'] },
                    { name: 'qa:run-e2e-tests', args: ['--feature=issue-reporting'] }
                ];

                return this.commandSystem.executeParallelCommands(commands);
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

            // Exit with appropriate code
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