# Command: assess-task-complexity

## Purpose

Feature complexity analysis and resource planning for UrbanAI development tasks. This command provides standardized complexity assessment to help agents and subagents allocate appropriate resources and plan execution strategies.

## Usage

```markdown
# Basic complexity assessment
assess-task-complexity({
  task_description: "Implement OAuth2 authentication flow",
  task_type: "feature_development",
  platforms: ["web", "api"]
})

# Comprehensive complexity analysis
assess-task-complexity({
  task_description: "Real-time notification system with cross-platform support",
  task_type: "feature_development",
  platforms: ["web", "android", "ios"],
  include_dependencies: true,
  include_risk_analysis: true,
  resource_planning: true
})
```

## Parameters

### Required Parameters
- `task_description` (String): Detailed description of the task or feature
- `task_type` (String): Type of task ("feature_development", "bug_fix", "refactoring", "testing", "documentation")
- `platforms` (Array): Array of platforms involved (["web", "api", "android", "ios"])

### Optional Parameters
- `include_dependencies` (Boolean): Whether to analyze dependencies (default: true)
- `include_risk_analysis` (Boolean): Whether to include risk assessment (default: true)
- `resource_planning` (Boolean): Whether to generate resource allocation plan (default: true)
- `technical_depth` (String): Analysis depth ("basic", "detailed", "comprehensive") (default: "detailed")

## Complexity Levels

### Level 1 - Simple (1-3 points)
- Single component or feature
- Limited platform impact
- Well-defined requirements
- Minimal dependencies
- Low risk and complexity

### Level 2 - Standard (4-6 points)
- Multiple related components
- Cross-platform considerations
- Moderate requirements complexity
- Some external dependencies
- Moderate risk factors

### Level 3 - Complex (7-9 points)
- Multiple integrated features
- Significant cross-platform impact
- Complex requirements and edge cases
- Multiple external dependencies
- High risk and uncertainty

### Level 4 - Enterprise (10+ points)
- Large-scale system changes
- Enterprise-wide impact
- Complex business logic
- Critical dependencies and integrations
- Very high risk and compliance requirements

## Complexity Assessment Criteria

### Technical Complexity (40%)
- **Architecture Impact**: Changes to system architecture
- **Integration Complexity**: External system integrations
- **Data Model Complexity**: Database and data structure changes
- **Performance Requirements**: Performance and scalability needs
- **Security Requirements**: Authentication, authorization, and compliance

### Platform Complexity (30%)
- **Cross-Platform Needs**: Number of platforms to support
- **Platform-Specific Features**: Native platform requirements
- **Responsive Design**: Multi-device support requirements
- **Performance Targets**: Platform-specific performance goals
- **Testing Complexity**: Cross-platform testing needs

### Business Logic Complexity (20%)
- **Business Rules**: Complexity of business logic
- **User Workflows**: User interaction complexity
- **Error Handling**: Exception and error handling requirements
- **Data Validation**: Input validation and business rules
- **Reporting Needs**: Reporting and analytics requirements

### Risk Factors (10%)
- **Technical Risk**: New technologies or approaches
- **Integration Risk**: Third-party dependencies
- **Performance Risk**: Performance and scalability concerns
- **Security Risk**: Security and compliance considerations
- **Timeline Risk**: Schedule and dependency risks

## Return Value

```javascript
{
  success: true,
  complexity_assessment: {
    overall_score: 7.5,
    complexity_level: "complex",
    breakdown: {
      technical_complexity: 8.2,
      platform_complexity: 7.8,
      business_logic_complexity: 6.5,
      risk_factors: 6.8
    },
    platform_impact: {
      web: { complexity: 7.0, effort_days: 8 },
      api: { complexity: 8.5, effort_days: 10 },
      android: { complexity: 7.2, effort_days: 9 },
      ios: { complexity: 7.2, effort_days: 9 }
    }
  },
  resource_planning: {
    total_effort_days: 36,
    team_allocation: {
      backend_developers: 2,
      frontend_developers: 2,
      mobile_developers: 2,
      qa_engineers: 2,
      ux_designers: 1
    },
    timeline: {
      development_phase: 18,
      testing_phase: 12,
      deployment_phase: 6,
      total_calendar_days: 45
    }
  },
  dependencies: [
    { type: "external", name: "OAuth2 providers", impact: "high" },
    { type: "internal", name: "User management system", impact: "medium" },
    { type: "technical", name: "Real-time database", impact: "high" }
  ],
  risk_analysis: {
    high_risks: [
      "Third-party OAuth provider integration complexity",
      "Real-time notification scaling challenges"
    ],
    mitigation_strategies: [
      "Implement OAuth abstraction layer",
      "Start with basic notifications, scale incrementally"
    ]
  },
  recommendations: [
    "Use parallel development for platform-specific components",
    "Implement incremental delivery approach",
    "Establish clear integration testing strategy"
  ]
}
```

## Examples

### Simple Feature Assessment
```javascript
const result = await assessTaskComplexity({
  task_description: "Add user profile picture upload functionality",
  task_type: "feature_development",
  platforms: ["web", "api"],
  include_dependencies: true,
  resource_planning: true
});
```

### Complex Feature Assessment
```javascript
const result = await assessTaskComplexity({
  task_description: "Implement real-time collaborative issue editing with conflict resolution",
  task_type: "feature_development",
  platforms: ["web", "android", "ios", "api"],
  include_dependencies: true,
  include_risk_analysis: true,
  resource_planning: true,
  technical_depth: "comprehensive"
});
```

### System Integration Assessment
```javascript
const result = await assessTaskComplexity({
  task_description: "Integrate with external municipal GIS system for location validation",
  task_type: "integration",
  platforms: ["api", "web"],
  include_dependencies: true,
  include_risk_analysis: true,
  resource_planning: true
});
```

## Agent Integration

### Product Owner Integration
```markdown
# Feature complexity analysis for planning
assess-task-complexity({
  task_description: "New feature request",
  task_type: "feature_development",
  platforms: ["web", "api"],
  resource_planning: true
})
```

### Backend Team Lead Integration
```markdown
# Backend development complexity assessment
assess-task-complexity({
  task_description: "API development task",
  task_type: "feature_development",
  platforms: ["api"],
  include_dependencies: true,
  include_risk_analysis: true
})
```

### Frontend Team Lead Integration
```markdown
# Frontend feature complexity analysis
assess-task-complexity({
  task_description: "UI component development",
  task_type: "feature_development",
  platforms: ["web"],
  include_dependencies: true,
  resource_planning: true
})
```

### QA Team Lead Integration
```markdown
# Testing complexity assessment
assess-task-complexity({
  task_description: "Test suite development",
  task_type: "testing",
  platforms: ["web", "api", "android", "ios"],
  include_risk_analysis: true,
  resource_planning: true
})
```

## Resource Planning Matrix

### Effort Estimation Guidelines
| Complexity Level | Platform | Effort Range | Team Size | Timeline |
|------------------|----------|--------------|-----------|----------|
| Simple (1-3) | Single | 3-5 days | 1-2 people | 1 week |
| Simple (1-3) | Multi | 5-8 days | 2-3 people | 2 weeks |
| Standard (4-6) | Single | 8-12 days | 2-3 people | 2-3 weeks |
| Standard (4-6) | Multi | 12-20 days | 3-4 people | 3-4 weeks |
| Complex (7-9) | Multi | 20-35 days | 4-6 people | 4-6 weeks |
| Enterprise (10+) | Multi | 35-60+ days | 6-8+ people | 6-10+ weeks |

### Team Composition Guidelines
- **Simple Tasks**: 1-2 developers, part-time QA
- **Standard Tasks**: 2-3 developers, dedicated QA, part-time UX
- **Complex Tasks**: 3-4 developers, 2 QA, dedicated UX
- **Enterprise Tasks**: 4-6+ developers, 2-3 QA, 2 UX, architect involvement

## Risk Assessment Framework

### Risk Categories
1. **Technical Risk**: New technologies, architecture changes, performance concerns
2. **Integration Risk**: Third-party dependencies, system integration complexity
3. **Resource Risk**: Team availability, skill gaps, timeline pressure
4. **Requirements Risk**: Unclear or changing requirements
5. **Quality Risk**: Testing complexity, quality assurance challenges

### Risk Levels
- **Low Risk**: Well-understood technology, clear requirements, experienced team
- **Medium Risk**: Some new elements, moderate complexity, manageable uncertainty
- **High Risk**: Significant new technology, complex requirements, major uncertainties
- **Critical Risk**: Unproven technology, very complex requirements, high uncertainty

## Dependency Analysis

### Dependency Types
- **External Dependencies**: Third-party APIs, services, libraries
- **Internal Dependencies**: Other systems, teams, or features
- **Technical Dependencies**: Infrastructure, databases, platforms
- **Business Dependencies**: Business processes, stakeholder approvals

### Dependency Impact Assessment
- **High Impact**: Critical path, blocking issues, significant effort
- **Medium Impact**: Important but not blocking, manageable effort
- **Low Impact**: Nice to have, minimal effort required

## Complexity Scoring Algorithm

### Weighted Scoring
```javascript
const complexityScore = (
  technicalComplexity * 0.40 +
  platformComplexity * 0.30 +
  businessLogicComplexity * 0.20 +
  riskFactors * 0.10
);
```

### Scoring Rubric
- **1-3 Points**: Simple, well-understood, minimal impact
- **4-6 Points**: Moderate complexity, some challenges
- **7-9 Points**: Complex, significant challenges, multiple considerations
- **10+ Points**: Very complex, enterprise-level challenges, high risk

## Integration Patterns

### With Parallel Task Execution
```javascript
// Use complexity assessment to plan parallel execution
const complexityResult = await assessTaskComplexity(taskDetails);

if (complexityResult.complexity_level === "complex") {
  // Launch multiple parallel subagents
  executeParallelTasks({
    tasks: generateParallelTasks(complexityResult),
    complexity_level: "complex",
    max_concurrent: 6
  });
}
```

### With Quality Gates
```javascript
// Complexity-based quality gate selection
const qualityGates = selectQualityGates(complexityResult.complexity_level);

const qualityResult = await validateQualityGates({
  quality_gates: qualityGates,
  agent_type: determineAgentType(task),
  strict_mode: complexityResult.complexity_level === "enterprise"
});
```

## Best Practices

1. **Early Assessment**: Assess complexity as early as possible in planning
2. **Regular Updates**: Update complexity assessments as requirements evolve
3. **Historical Data**: Use historical data to improve estimation accuracy
4. **Team Input**: Involve team members in complexity assessment
5. **Buffer Planning**: Include appropriate buffers for uncertainty
6. **Risk Management**: Proactively identify and mitigate risks
7. **Communication**: Communicate complexity assessments to stakeholders

## Dependencies

- Complexity analysis algorithms
- Resource planning tools
- Risk assessment frameworks
- Historical project data
- Team skill assessment tools
- Dependency analysis utilities

## Performance Metrics

### Assessment Accuracy
- **Estimation Accuracy**: Compare estimated vs actual effort
- **Risk Prediction**: Accuracy of risk identification
- **Resource Planning**: Team allocation effectiveness
- **Timeline Prediction**: Schedule estimation accuracy

### Continuous Improvement
- **Feedback Collection**: Gather feedback on assessment accuracy
- **Model Refinement**: Improve algorithms based on actual results
- **Team Calibration**: Calibrate assessments across teams
- **Tool Enhancement**: Enhance tools and processes

This command provides comprehensive complexity assessment capabilities, enabling agents to make informed decisions about resource allocation, risk management, and execution strategies for UrbanAI development tasks.