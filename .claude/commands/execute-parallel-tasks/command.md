# Command: execute-parallel-tasks

## Purpose

Universal parallel task execution with dynamic subagent allocation. This command provides standardized parallel execution patterns used across all UrbanAI agents.

## Usage

```markdown
# Basic parallel task execution
execute-parallel-tasks({
  tasks: [
    { description: "Task 1", subagent_type: "specialist-1" },
    { description: "Task 2", subagent_type: "specialist-2" },
    { description: "Task 3", subagent_type: "specialist-3" }
  ],
  complexity_level: "standard",
  max_concurrent: 4
})
```

## Parameters

### Required Parameters
- `tasks` (Array): Array of task objects with `description` and `subagent_type` properties
- `complexity_level` (String): Task complexity level ("simple", "standard", "complex")
- `max_concurrent` (Number): Maximum number of concurrent subagents to launch

### Optional Parameters
- `timeout_ms` (Number): Timeout for task execution in milliseconds (default: 1800000)
- `error_handling` (String): Error handling strategy ("fail-fast", "continue", "retry")
- `result_aggregation` (Boolean): Whether to aggregate results from parallel tasks (default: true)

## Complexity Level Guidelines

### Level 1 - Simple Tasks (2-3 Parallel Subagents)
- Basic component updates
- Minor styling adjustments
- Single viewport optimization
- Limited accessibility updates

### Level 2 - Standard Tasks (4-6 Parallel Subagents)
- New feature design/development
- Multi-component workflows
- Responsive design implementation
- Cross-platform consistency

### Level 3 - Complex Tasks (8+ Parallel Subagents)
- Complete feature redesign
- Multi-platform synchronization
- Advanced accessibility requirements
- Performance-critical interfaces
- Complex user workflows

## Return Value

```javascript
{
  success: true,
  results: [
    { task_id: 1, result: "Task result data", status: "completed" },
    { task_id: 2, result: "Task result data", status: "completed" },
    { task_id: 3, result: "Task result data", status: "completed" }
  ],
  execution_time: 45000,
  parallel_efficiency: 0.85,
  errors: []
}
```

## Error Handling

The command supports three error handling strategies:

1. **fail-fast**: Stop execution on first error
2. **continue**: Continue execution despite errors, collect all errors
3. **retry**: Retry failed tasks up to 3 times

## Examples

### Basic Parallel Execution
```javascript
const result = await executeParallelTasks({
  tasks: [
    { description: "API development", subagent_type: "backend-api-specialist" },
    { description: "Database implementation", subagent_type: "database-specialist" },
    { description: "Security implementation", subagent_type: "authentication-security-specialist" }
  ],
  complexity_level: "standard",
  max_concurrent: 3
});
```

### Complex Task with Error Handling
```javascript
const result = await executeParallelTasks({
  tasks: [
    { description: "Complete API layer development", subagent_type: "backend-api-specialist" },
    { description: "Database architecture implementation", subagent_type: "database-specialist" },
    { description: "Comprehensive security implementation", subagent_type: "authentication-security-specialist" },
    { description: "External service integration", subagent_type: "api-integration-specialist" },
    { description: "Performance testing", subagent_type: "performance-testing-specialist" },
    { description: "DevOps configuration", subagent_type: "devops-automation-specialist" },
    { description: "Test suite development", subagent_type: "testing-automation-specialist" },
    { description: "Security audit", subagent_type: "security-testing-specialist" }
  ],
  complexity_level: "complex",
  max_concurrent: 8,
  error_handling: "retry",
  timeout_ms: 3600000
});
```

## Agent Integration

### Backend Team Lead Integration
```markdown
# Replace inline parallel execution with command
Task({description: "Execute parallel backend development", subagent_type: "execute-parallel-tasks"})
```

### Frontend Team Lead Integration
```markdown
# Replace inline parallel execution with command
Task({description: "Execute parallel frontend development", subagent_type: "execute-parallel-tasks"})
```

### QA Team Lead Integration
```markdown
# Replace inline parallel execution with command
Task({description: "Execute parallel testing", subagent_type: "execute-parallel-tasks"})
```

## Performance Metrics

The command tracks and reports:
- **Execution Time**: Total time for parallel task completion
- **Parallel Efficiency**: Ratio of theoretical vs actual parallel speedup
- **Resource Utilization**: CPU/memory usage during parallel execution
- **Success Rate**: Percentage of tasks completed successfully

## Best Practices

1. **Task Granularity**: Keep tasks focused and single-purpose
2. **Resource Management**: Monitor resource usage to avoid overloading
3. **Error Handling**: Choose appropriate error handling strategy based on task criticality
4. **Timeout Management**: Set realistic timeouts based on task complexity
5. **Result Processing**: Plan for result aggregation and error handling

## Dependencies

- Task tool for subagent execution
- Performance monitoring for metrics collection
- Error handling utilities for robust execution
- Result aggregation utilities for output processing