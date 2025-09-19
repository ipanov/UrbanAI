#!/usr/bin/env node

/**
 * UrbanAI CLI Interface - Simplified Version
 *
 * A streamlined CLI interface for executing agent commands with parallel execution
 */

const path = require('path');
const { AgentCommandSystem } = require('./agent-commands-simple');

// Import specialized command modules
const BackendCommands = require('./commands/backend-commands');
const FrontendCommands = require('./commands/frontend-commands');
const QACommands = require('./commands/qa-commands');
const ArchitectCommands = require('./commands/architect-commands');
const MobileCommands = require('./commands/mobile-commands');
const ProductOwnerCommands = require('./commands/product-owner-commands');

class UrbanAICLI {
    constructor() {
        this.commandSystem = new AgentCommandSystem();
        this.backendCommands = new BackendCommands();
        this.frontendCommands = new FrontendCommands();
        this.qaCommands = new QACommands();
        this.architectCommands = new ArchitectCommands();
        this.mobileCommands = new MobileCommands();
        this.productOwnerCommands = new ProductOwnerCommands();

        this.registerSpecializedCommands();
    }

    registerSpecializedCommands() {
        // Register backend commands
        this.commandSystem.registerCommand('backend:develop-api', async (args) => {
            return this.backendCommands.developApiEndpoints(args);
        });

        this.commandSystem.registerCommand('backend:setup-database', async (args) => {
            return this.backendCommands.setupDatabaseArchitecture(args);
        });

        this.commandSystem.registerCommand('backend:implement-security', async (args) => {
            return this.backendCommands.implementSecurityLayer(args);
        });

        this.commandSystem.registerCommand('backend:optimize-performance', async (args) => {
            return this.backendCommands.optimizePerformance(args);
        });

        // Register frontend commands
        this.commandSystem.registerCommand('frontend:develop-component', async (args) => {
            return this.frontendCommands.developReactComponent(args);
        });

        this.commandSystem.registerCommand('frontend:implement-responsive', async (args) => {
            return this.frontendCommands.implementResponsiveDesign(args);
        });

        this.commandSystem.registerCommand('frontend:optimize-performance', async (args) => {
            return this.frontendCommands.optimizeFrontendPerformance(args);
        });

        this.commandSystem.registerCommand('frontend:run-e2e-tests', async (args) => {
            return this.frontendCommands.runE2ETests(args);
        });

        // Register QA commands
        this.commandSystem.registerCommand('qa:run-unit-tests', async (args) => {
            return this.qaCommands.runUnitTests(args);
        });

        this.commandSystem.registerCommand('qa:run-integration-tests', async (args) => {
            return this.qaCommands.runIntegrationTests(args);
        });

        this.commandSystem.registerCommand('qa:run-e2e-tests', async (args) => {
            return this.qaCommands.runE2ETests(args);
        });

        this.commandSystem.registerCommand('qa:run-performance-tests', async (args) => {
            return this.qaCommands.runPerformanceTests(args);
        });

        this.commandSystem.registerCommand('qa:run-security-tests', async (args) => {
            return this.qaCommands.runSecurityTests(args);
        });

        // Register architect commands
        this.commandSystem.registerCommand('architect:research-technology', async (args) => {
            return this.architectCommands.researchTechnologyStack(args);
        });

        this.commandSystem.registerCommand('architect:design-architecture', async (args) => {
            return this.architectCommands.designArchitecture(args);
        });

        this.commandSystem.registerCommand('architect:create-documentation', async (args) => {
            return this.architectCommands.createDocumentation(args);
        });

        this.commandSystem.registerCommand('architect:validate-architecture', async (args) => {
            return this.architectCommands.validateArchitecture(args);
        });

        // Register mobile commands
        this.commandSystem.registerCommand('mobile:develop-cross-platform', async (args) => {
            return this.mobileCommands.developCrossPlatformUI(args);
        });

        this.commandSystem.registerCommand('mobile:develop-android', async (args) => {
            return this.mobileCommands.developAndroidPlatform(args);
        });

        this.commandSystem.registerCommand('mobile:develop-ios', async (args) => {
            return this.mobileCommands.developIOSPlatform(args);
        });

        this.commandSystem.registerCommand('mobile:run-mobile-tests', async (args) => {
            return this.mobileCommands.runMobileTests(args);
        });

        // Register product owner commands
        this.commandSystem.registerCommand('po:orchestrate-feature', async (args) => {
            return this.productOwnerCommands.orchestrateFeatureDevelopment(args);
        });

        this.commandSystem.registerCommand('po:manage-resources', async (args) => {
            return this.productOwnerCommands.manageResourcesDynamically(args);
        });

        this.commandSystem.registerCommand('po:coordinate-teams', async (args) => {
            return this.productOwnerCommands.coordinateCrossTeamDevelopment(args);
        });

        this.commandSystem.registerCommand('po:enforce-quality-gates', async (args) => {
            return this.productOwnerCommands.enforceQualityGates(args);
        });

        // Register parallel execution command
        this.commandSystem.registerCommand('parallel:execute', async (args) => {
            const commands = args.map(arg => {
                const [name, ...cmdArgs] = arg.split(':');
                return { name, args: cmdArgs };
            });

            return this.commandSystem.executeParallelCommands(commands);
        });

        // Register development workflow commands
        this.commandSystem.registerCommand('dev:start-servers', async () => {
            const { spawn } = require('child_process');
            return new Promise((resolve, reject) => {
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
        });

        this.commandSystem.registerCommand('dev:run-tests', async () => {
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