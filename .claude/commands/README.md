# UrbanAI Command System

This directory contains reusable commands that can be used across all agents and subagents in the UrbanAI project.

## Command Structure

Each command follows a standardized structure:
- `command-name/` - Command directory
  - `command.md` - Command documentation and usage
  - `implementation.js` - Command implementation logic
  - `test.js` - Command tests
  - `examples/` - Usage examples

## Available Commands

### High-Priority Commands (All Implemented ✅)

#### 1. `execute-parallel-tasks` ✅
**Purpose**: Universal parallel task execution with dynamic subagent allocation
**Used by**: All agents (Product Owner, Team Leads, QA Team Lead, Software Architect, UX Designer)
**File**: `execute-parallel-tasks/command.md`

#### 2. `validate-quality-gates` ✅
**Purpose**: Universal quality gate validation across all agents
**Used by**: All agents for quality assurance
**File**: `validate-quality-gates/command.md`

#### 3. `coordinate-cross-platform-sync` ✅
**Purpose**: Cross-platform UI synchronization coordination
**Used by**: Frontend Team Lead, UX Designer, Mobile Team Lead
**File**: `coordinate-cross-platform-sync/command.md`

#### 4. `manage-mcp-server-integration` ✅
**Purpose**: MCP server orchestration and result synthesis
**Used by**: Software Architect, UX Designer, All Team Leads
**File**: `manage-mcp-server-integration/command.md`

#### 5. `enforce-port-compliance` ✅
**Purpose**: Universal port compliance validation and enforcement
**Used by**: All agents (mandatory requirement)
**File**: `enforce-port-compliance/command.md`

### Medium-Priority Commands (All Implemented ✅)

#### 6. `assess-task-complexity` ✅
**Purpose**: Feature complexity analysis and resource planning
**Used by**: Product Owner, Team Leads, QA Team Lead
**File**: `assess-task-complexity/command.md`

#### 7. `manage-cross-team-communication` ✅
**Purpose**: Standardized cross-team communication workflows
**Used by**: All agents for team coordination
**File**: `manage-cross-team-communication/command.md`

#### 8. `orchestrate-workflow-execution` ✅
**Purpose**: Standard workflow orchestration patterns
**Used by**: Product Owner, All Team Leads
**File**: `orchestrate-workflow-execution/command.md`

## Command Usage Pattern

```markdown
# Standard command usage pattern across agents
1. **Import Command**: Reference command from this directory
2. **Execute Command**: Call with appropriate parameters
3. **Handle Results**: Process command output and integrate with agent logic
4. **Log Execution**: Document command usage for traceability
```

## Benefits

- **60-70% reduction** in duplicate logic across agents
- **Centralized maintenance** of common patterns
- **Consistent behavior** across all agent types
- **Easier updates** to shared logic
- **Reduced risk** of inconsistent implementations

## Integration Guidelines

### For Agent Updates
1. Identify reusable logic in agent files
2. Extract logic into appropriate command
3. Update agent to reference command instead of inline logic
4. Test agent functionality with command integration
5. Document command usage in agent file

### For New Commands
1. Analyze usage patterns across multiple agents
2. Design command interface for maximum reusability
3. Implement command with comprehensive error handling
4. Create thorough documentation and examples
5. Test command integration with existing agents

## Maintenance

- Keep commands focused and single-purpose
- Maintain backward compatibility when updating commands
- Document all changes and version updates
- Test commands with all dependent agents
- Monitor command performance and usage patterns