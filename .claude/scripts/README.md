# UrbanAI Command-Based Architecture

This directory contains the command-based architecture for UrbanAI's parallel agent execution system.

## Overview

The command-based architecture extracts specialized logic from optimized agents into executable command modules, enabling:

- **Parallel Task Execution**: Multiple subagents running simultaneously using Promise.allSettled
- **Specialized Command Modules**: Each agent type has its own command module with domain-specific functionality
- **Centralized Orchestration**: Main command system coordinates all agent commands
- **CLI Interface**: Command-line interface for direct execution of agent workflows
- **Performance Metrics**: Comprehensive tracking of execution performance and resource utilization

## Architecture

### Core Components

1. **Agent Command System** (`agent-commands.js`)
   - Main orchestration system for all agent commands
   - Command registration, execution, and history tracking
   - Parallel execution coordination and performance monitoring

2. **Specialized Command Modules**
   - `commands/backend-commands.js` - Backend API and database development
   - `commands/frontend-commands.js` - React component and UI development
   - `commands/qa-commands.js` - Testing and quality assurance
   - `commands/architect-commands.js` - Architecture research and design
   - `commands/mobile-commands.js` - Cross-platform mobile development
   - `commands/product-owner-commands.js` - Feature orchestration and resource management

3. **CLI Interface** (`cli.js`)
   - Unified command-line interface for all agent workflows
   - Interactive command execution and result display
   - Parallel execution coordination

## Command Patterns

### Parallel Execution Pattern

All commands implement parallel execution using the following pattern:

```javascript
async executeParallelSubagents(subagents, context) {
    console.log(`🚀 Executing ${subagents.length} subagents in parallel...`);

    const results = await Promise.allSettled(
        subagents.map(subagent => this.executeSubagent(subagent, context))
    );

    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');

    return {
        success: failed.length === 0,
        results: successful.map(r => r.value),
        errors: failed.map(f => f.reason.message),
        performance: {
            executionTime: Date.now() - startTime,
            parallelTasks: subagents.length,
            successRate: successful.length / subagents.length
        }
    };
}
```

### Specialized Subagent Types

Each agent type has specialized subagents:

**Backend (8 subagents)**
- Backend API Specialist
- Database Specialist
- Authentication & Security Specialist
- API Integration Specialist
- Performance Testing Specialist
- DevOps Automation Specialist
- Testing Automation Specialist
- Security Testing Specialist

**Frontend (5 subagents)**
- React Component Specialist
- UX Design Specialist
- State Management Specialist
- Testing Automation Specialist
- Performance Optimization Specialist

**QA (5 subagents)**
- Unit Testing Specialist
- Integration Testing Specialist
- E2E Testing Specialist
- Performance Testing Specialist
- Security Testing Specialist

**Architect (6 subagents)**
- Technology Research Specialist
- Architecture Pattern Specialist
- Compliance Research Specialist
- Scalability Research Specialist
- Security Architecture Specialist
- Integration Research Specialist

**Mobile (8 subagents)**
- Cross-Platform UI Specialist
- Android Platform Specialist
- iOS Platform Specialist
- React Native Development Specialist
- Mobile Testing Specialist
- Mobile DevOps Specialist
- Mobile Security Specialist
- Mobile Performance Specialist

**Product Owner (6 team leads + 40+ subagents)**
- Software Architect (6 subagents)
- UX Designer (3 subagents)
- Frontend Team Lead (6 subagents)
- Backend Team Lead (8 subagents)
- Mobile Team Lead (6 subagents)
- QA Team Lead (7 subagents)

## Usage

### CLI Interface

```bash
# Get help and available commands
node .claude/scripts/cli.js help

# Execute individual commands
node .claude/scripts/cli.js backend:develop-api user-authentication
node .claude/scripts/cli.js frontend:develop-component issue-reporting-form
node .claude/scripts/cli.js qa:run-e2e-tests cross-platform

# Execute commands in parallel
node .claude/scripts/cli.js parallel:execute backend:develop-api frontend:develop-component qa:run-unit-tests

# Orchestrate complex features
node .claude/scripts/cli.js po:orchestrate-feature cross-platform-mobile
node .claude/scripts/cli.js po:manage-resources dynamic-allocation
```

### Programmatic Usage

```javascript
const { AgentCommandSystem } = require('./.claude/scripts/agent-commands');

const commandSystem = new AgentCommandSystem();

// Execute single command
const result = await commandSystem.executeCommand('backend:develop-api', ['user-auth']);

// Execute parallel commands
const parallelResult = await commandSystem.executeParallelCommands([
    { name: 'backend:develop-api', args: ['user-auth'] },
    { name: 'frontend:develop-component', args: ['login-form'] }
]);

// Get execution history and stats
const history = commandSystem.getCommandHistory();
const stats = commandSystem.getExecutionStats();
```

## Development Workflow

### 1. Command Development

1. **Identify Agent Logic**: Extract logic from optimized agent files
2. **Create Command Module**: Implement in appropriate commands/ file
3. **Register Command**: Add to agent-commands.js registry
4. **Add CLI Interface**: Register command in cli.js
5. **Test Execution**: Verify parallel execution and performance

### 2. Parallel Execution Optimization

- **Subagent Specialization**: Each subagent focuses on specific capabilities
- **Resource Management**: Coordinate file access and prevent conflicts
- **Performance Monitoring**: Track execution metrics and optimize bottlenecks
- **Error Handling**: Implement comprehensive error recovery strategies

### 3. Integration with Existing Systems

- **Development Servers**: Integration with start-development-servers.js
- **Testing Pipeline**: Integration with existing test frameworks
- **Build Systems**: Integration with existing build processes
- **Deployment Pipeline**: Integration with CI/CD workflows

## Performance Metrics

The command system tracks comprehensive performance metrics:

- **Execution Time**: Duration of command execution
- **Memory Usage**: Resource consumption during execution
- **Parallel Tasks**: Number of concurrent subagents
- **Success Rate**: Percentage of successful parallel executions
- **Resource Utilization**: Efficiency of parallel processing
- **Command History**: Historical execution data

## Quality Assurance

### Testing Commands

```bash
# Run backend development with testing
node .claude/scripts/cli.js parallel:execute backend:develop-api qa:run-unit-tests qa:run-integration-tests

# Run frontend development with E2E testing
node .claude/scripts/cli.js parallel:execute frontend:develop-component frontend:run-e2e-tests

# Run comprehensive testing
node .claude/scripts/cli.js parallel:execute qa:run-unit-tests qa:run-integration-tests qa:run-e2e-tests qa:run-performance-tests qa:run-security-tests
```

### Quality Gates

The system enforces quality gates through:

- **Parallel Validation**: Multiple testing specialists validate simultaneously
- **Cross-Platform Testing**: Web, Android, iOS platforms tested in parallel
- **Performance Benchmarks**: Automated performance validation
- **Security Compliance**: Security testing integrated into all workflows
- **Code Coverage**: Comprehensive coverage tracking and reporting

## Configuration

### Environment Variables

```bash
# Enable debug logging
export DEBUG_URBANAI_COMMANDS=true

# Set maximum parallel subagents
export MAX_PARALLEL_SUBAGENTS=10

# Enable performance profiling
export ENABLE_PERFORMANCE_PROFILING=true

# Set execution timeout (milliseconds)
export COMMAND_EXECUTION_TIMEOUT=300000
```

### Configuration Files

- `agent-commands.js` - Main command system configuration
- `commands/*.js` - Specialized command module configurations
- `cli.js` - CLI interface configuration

## Integration Examples

### Complete Feature Development

```bash
# Orchestrate cross-platform feature development
node .claude/scripts/cli.js po:orchestrate-feature mobile-issue-reporting

# Execute parallel development workflow
node .claude/scripts/cli.js parallel:execute \
  architect:design-architecture mobile-feature \
  backend:develop-api issue-reporting-endpoints \
  frontend:develop-component issue-reporting-ui \
  mobile:develop-cross-platform issue-reporting-mobile \
  qa:run-e2e-tests cross-platform-issue-reporting
```

### Continuous Integration

```bash
# Run complete test suite
node .claude/scripts/cli.js dev:run-tests

# Execute security validation
node .claude/scripts/cli.js qa:run-security-tests comprehensive

# Performance optimization workflow
node .claude/scripts/cli.js parallel:execute \
  backend:optimize-performance api-endpoints \
  frontend:optimize-performance bundle-size \
  qa:run-performance-tests load-testing
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure development servers are using correct ports (3000, 5001)
2. **Resource Conflicts**: Check for file access conflicts between parallel subagents
3. **Memory Issues**: Monitor memory usage during parallel execution
4. **Timeout Issues**: Adjust timeout settings for long-running commands

### Debug Mode

```bash
# Enable debug logging
export DEBUG_URBANAI_COMMANDS=true
node .claude/scripts/cli.js help

# View command history
node .claude/scripts/cli.js status

# Execute with verbose output
export DEBUG_URBANAI_VERBOSE=true
node .claude/scripts/cli.js backend:develop-api debug-feature
```

## Future Enhancements

### Planned Features

1. **Intelligent Resource Allocation**: AI-powered resource management
2. **Predictive Performance**: ML-based performance optimization
3. **Advanced Deadlock Prevention**: Sophisticated conflict resolution
4. **Real-time Monitoring**: Live performance dashboards
5. **Enhanced CLI Features**: Interactive mode and autocompletion
6. **Cloud Integration**: Distributed execution across multiple environments

### Integration Roadmap

1. **CI/CD Pipeline**: Integration with Azure DevOps and GitHub Actions
2. **Container Orchestration**: Docker and Kubernetes support
3. **Cloud Functions**: Serverless command execution
4. **API Gateway**: RESTful API for command execution
5. **Web Dashboard**: Web-based command management interface

## Contributing

When contributing to the command-based architecture:

1. **Follow Patterns**: Maintain consistency with existing command patterns
2. **Implement Parallel Execution**: Use Promise.allSettled for parallel subagents
3. **Add Performance Metrics**: Track execution performance and resource usage
4. **Include Error Handling**: Implement comprehensive error recovery
5. **Add Documentation**: Document new commands and their usage
6. **Test Thoroughly**: Verify parallel execution and error scenarios

## License

This command-based architecture is part of the UrbanAI project and follows the same license terms.