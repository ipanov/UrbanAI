# Command: validate-quality-gates

## Purpose

Universal quality gate validation across all agents. This command provides standardized quality validation procedures used by all UrbanAI agents.

## Usage

```markdown
# Basic quality gate validation
validate-quality-gates({
  quality_gates: ["parallel_execution", "cross_platform_sync", "performance"],
  agent_type: "backend-team-lead",
  task_complexity: "standard",
  strict_mode: true
})
```

## Parameters

### Required Parameters
- `quality_gates` (Array): Array of quality gates to validate
- `agent_type` (String): Type of agent requesting validation
- `task_complexity` (String): Complexity level of task being validated

### Optional Parameters
- `strict_mode` (Boolean): Whether to fail on any quality gate violation (default: true)
- `evidence_required` (Boolean): Whether to collect validation evidence (default: true)
- `timeout_ms` (Number): Validation timeout in milliseconds (default: 300000)

## Available Quality Gates

### Universal Quality Gates (All Agents)

#### 1. `parallel_execution`
**Validation**: Parallel execution completion and documentation
**Criteria**:
- All parallel subagents completed successfully
- Parallel execution logs documented
- Task coordination verified
- Resource utilization within acceptable limits

#### 2. `cross_platform_sync`
**Validation**: Cross-platform UI synchronization (for UI-related tasks)
**Criteria**:
- Web, Android, and iOS platforms consistent
- Design tokens aligned across platforms
- Component behavior synchronized
- Performance standards consistent

#### 3. `performance_standards`
**Validation**: Performance benchmark compliance
**Criteria**:
- API response times meet SLA (<500ms for 95% of requests)
- Web Core Web Vitals within acceptable ranges
- Mobile performance standards met
- Database query performance optimized

#### 4. `security_compliance`
**Validation**: Security and compliance requirements
**Criteria**:
- OAuth2 security validation complete
- GDPR compliance requirements met
- API security standards enforced
- Municipal data protection validated

#### 5. `documentation_complete`
**Validation**: Documentation completeness and accuracy
**Criteria**:
- Technical documentation updated
- API documentation current
- Architectural decisions documented
- User guides comprehensive

### Agent-Specific Quality Gates

#### Backend Team Lead
- `clean_architecture_compliance`: Clean Architecture layer separation
- `api_contract_coverage`: 100% API contract coverage
- `database_performance`: Database query optimization

#### Frontend Team Lead
- `accessibility_compliance`: WCAG 2.1 AA compliance
- `responsive_design`: Multi-device responsive design
- `component_reusability`: Component design system compliance

#### QA Team Lead
- `test_coverage`: 80%+ test coverage for business logic
- `cross_browser_compatibility`: Multi-browser validation
- `defect_escape_rate`: <5% defects found in production

#### Software Architect
- `architectural_decision_documentation`: 100% decisions documented
- `technology_stack_optimization`: Technology choices validated
- `scalability_projection`: System scalability modeled

#### UX Designer
- `visual_consistency`: Design system compliance
- `user_experience_validation**: User testing completed
- `accessibility_standards`: WCAG compliance verified

## Return Value

```javascript
{
  success: true,
  quality_gates: {
    parallel_execution: { passed: true, evidence: "All 4 subagents completed successfully" },
    cross_platform_sync: { passed: true, evidence: "All platforms synchronized" },
    performance_standards: { passed: true, evidence: "All performance benchmarks met" },
    security_compliance: { passed: true, evidence: "Security validation complete" },
    documentation_complete: { passed: true, evidence: "Documentation updated" }
  },
  overall_score: 1.0,
  validation_time: 45000,
  recommendations: [],
  blocking_issues: []
}
```

## Error Handling

The command provides detailed error reporting:

1. **Blocking Issues**: Critical failures that prevent release
2. **Recommendations**: Suggested improvements for non-blocking issues
3. **Evidence Links**: Links to validation evidence and documentation
4. **Compliance Scores**: Numerical scores for each quality gate

## Examples

### Basic Quality Gate Validation
```javascript
const result = await validateQualityGates({
  quality_gates: ["parallel_execution", "performance_standards", "security_compliance"],
  agent_type: "backend-team-lead",
  task_complexity: "standard",
  strict_mode: true
});
```

### Comprehensive Quality Gate Validation
```javascript
const result = await validateQualityGates({
  quality_gates: [
    "parallel_execution",
    "cross_platform_sync",
    "performance_standards",
    "security_compliance",
    "documentation_complete",
    "clean_architecture_compliance",
    "test_coverage"
  ],
  agent_type: "backend-team-lead",
  task_complexity: "complex",
  strict_mode: true,
  evidence_required: true,
  timeout_ms: 600000
});
```

### Non-Strict Validation with Recommendations
```javascript
const result = await validateQualityGates({
  quality_gates: ["accessibility_compliance", "responsive_design"],
  agent_type: "frontend-team-lead",
  task_complexity: "standard",
  strict_mode: false,
  evidence_required: true
});
```

## Agent Integration

### Product Owner Integration
```markdown
# Release quality validation
validate-quality-gates({
  quality_gates: ["parallel_execution", "cross_platform_sync", "performance_standards"],
  agent_type: "product-owner",
  task_complexity: "complex"
})
```

### Backend Team Lead Integration
```markdown
# Backend development quality validation
validate-quality-gates({
  quality_gates: ["clean_architecture_compliance", "api_contract_coverage", "database_performance"],
  agent_type: "backend-team-lead",
  task_complexity: "standard"
})
```

### QA Team Lead Integration
```markdown
# Testing quality validation
validate-quality-gates({
  quality_gates: ["test_coverage", "cross_browser_compatibility", "defect_escape_rate"],
  agent_type: "qa-team-lead",
  task_complexity: "standard"
})
```

## Quality Gate Enforcement

### Blocking Criteria
- **Critical Issues**: Any security vulnerability or data protection violation
- **Performance Degradation**: Performance below established benchmarks
- **Coverage Gaps**: Test coverage below minimum thresholds
- **Compliance Failures**: GDPR or municipal compliance violations

### Non-Blocking Criteria
- **Documentation Gaps**: Missing or outdated documentation
- **Performance Optimization**: Opportunities for performance improvement
- **Code Quality**: Code style or maintainability improvements
- **Testing Enhancement**: Additional test coverage opportunities

## Reporting and Analytics

The command provides comprehensive reporting:

1. **Quality Score**: Overall quality assessment (0.0 - 1.0)
2. **Gate Status**: Individual quality gate pass/fail status
3. **Evidence Collection**: Links to validation evidence
4. **Trend Analysis**: Quality trends over time
5. **Recommendations**: Actionable improvement suggestions

## Best Practices

1. **Early Validation**: Validate quality gates early in development process
2. **Comprehensive Coverage**: Validate all relevant quality gates for each task
3. **Evidence Collection**: Maintain thorough validation evidence
4. **Continuous Improvement**: Use recommendations to improve quality processes
5. **Stakeholder Communication**: Share quality results with stakeholders

## Dependencies

- Quality measurement utilities
- Evidence collection frameworks
- Reporting and analytics tools
- Agent-specific validation logic