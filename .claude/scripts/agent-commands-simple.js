#!/usr/bin/env node

/**
 * Simplified Agent Command Orchestration System
 *
 * A streamlined version of the agent command system that focuses on
 * executing specialized command modules with parallel execution patterns.
 */

const fs = require('fs');
const path = require('path');

class AgentCommandSystem {
    constructor() {
        this.commands = new Map();
        this.commandHistory = [];
        this.initializeCommands();
    }

    initializeCommands() {
        // Register basic system commands
        this.registerCommand('help', {
            description: 'Show available commands and usage',
            execute: this.showHelp.bind(this)
        });

        this.registerCommand('status', {
            description: 'Show system status and command history',
            execute: this.showStatus.bind(this)
        });
    }

    registerCommand(name, config) {
        this.commands.set(name, {
            ...config,
            name,
            createdAt: new Date().toISOString(),
            executionCount: 0
        });
    }

    async executeCommand(commandName, args = []) {
        const command = this.commands.get(commandName);
        if (!command) {
            throw new Error(`Unknown command: ${commandName}`);
        }

        console.log(`🚀 Executing: ${commandName}`);
        console.log(`📝 Description: ${command.description}`);

        const startTime = Date.now();
        command.executionCount++;

        try {
            const result = await command.execute(args);
            const duration = Date.now() - startTime;

            this.logExecution(commandName, 'success', duration);
            console.log(`✅ Command completed in ${duration}ms`);

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logExecution(commandName, 'error', duration, error.message);
            console.error(`❌ Command failed: ${error.message}`);
            throw error;
        }
    }

    async executeParallelCommands(commands) {
        console.log(`🚀 Executing ${commands.length} commands in parallel...`);
        const startTime = Date.now();

        const results = await Promise.allSettled(
            commands.map(cmd => this.executeCommand(cmd.name, cmd.args || []))
        );

        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');

        const duration = Date.now() - startTime;

        console.log(`\n📊 Parallel Execution Results:`);
        console.log(`  ✅ Successful: ${successful.length}/${commands.length}`);
        console.log(`  ❌ Failed: ${failed.length}/${commands.length}`);
        console.log(`  ⏱️  Total Time: ${duration}ms`);

        return {
            success: failed.length === 0,
            results: successful.map(r => r.value),
            errors: failed.map(f => f.reason.message),
            performance: {
                executionTime: duration,
                parallelTasks: commands.length,
                successRate: successful.length / commands.length
            }
        };
    }

    logExecution(commandName, status, duration, error = null) {
        const execution = {
            timestamp: new Date().toISOString(),
            command: commandName,
            status,
            duration,
            error
        };

        this.commandHistory.push(execution);

        // Keep only last 50 executions in memory
        if (this.commandHistory.length > 50) {
            this.commandHistory = this.commandHistory.slice(-50);
        }
    }

    showHelp() {
        return {
            success: true,
            data: {
                description: 'UrbanAI Agent Command System',
                commands: Array.from(this.commands.entries()).map(([name, cmd]) => ({
                    name,
                    description: cmd.description,
                    executions: cmd.executionCount
                }))
            }
        };
    }

    showStatus() {
        const stats = this.getExecutionStats();

        return {
            success: true,
            data: {
                systemStatus: 'operational',
                totalCommands: this.commands.size,
                commandHistory: this.commandHistory.slice(-10),
                executionStats: stats
            }
        };
    }

    getCommandHistory() {
        return this.commandHistory;
    }

    getExecutionStats() {
        const total = this.commandHistory.length;
        const successful = this.commandHistory.filter(e => e.status === 'success').length;
        const failed = this.commandHistory.filter(e => e.status === 'error').length;

        const avgDuration = total > 0
            ? this.commandHistory.reduce((sum, e) => sum + e.duration, 0) / total
            : 0;

        return {
            totalExecutions: total,
            successfulExecutions: successful,
            failedExecutions: failed,
            successRate: total > 0 ? (successful / total) * 100 : 0,
            averageExecutionTime: Math.round(avgDuration)
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = { AgentCommandSystem };