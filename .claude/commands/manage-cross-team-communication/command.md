# Command: manage-cross-team-communication

## Purpose

Standardized cross-team communication workflows for UrbanAI development. This command provides structured communication patterns and coordination mechanisms between Product Owner, Team Leads, QA, and other stakeholders.

## Usage

```markdown
# Basic team communication
manage-cross-team-communication({
  communication_type: "status_update",
  from_team: "frontend-team-lead",
  to_teams: ["product-owner", "qa-team-lead"],
  message: "Feature X implementation complete and ready for testing"
})

# Comprehensive cross-team coordination
manage-cross-team-communication({
  communication_type: "coordination_meeting",
  from_team: "product-owner",
  to_teams: ["backend-team-lead", "frontend-team-lead", "qa-team-lead", "software-architect"],
  agenda: "Cross-platform feature sync",
  action_items: ["API contract finalization", "UI component alignment", "Test strategy review"],
  deadline: "2024-01-20"
})
```

## Parameters

### Required Parameters
- `communication_type` (String): Type of communication ("status_update", "coordination_meeting", "blocking_issue", "release_planning", "risk_alert")
- `from_team` (String): Originating team or agent
- `to_teams` (Array): Recipient teams or agents
- `message` (String): Primary communication message

### Optional Parameters
- `agenda` (String): Meeting agenda or discussion topics
- `action_items` (Array): Required actions or next steps
- `deadline` (String): Deadline for actions or responses
- `priority` (String): Communication priority ("low", "medium", "high", "critical") (default: "medium")
- `attachments` (Array): Supporting documents or evidence
- `response_required` (Boolean): Whether response is required (default: true)

## Communication Types

### 1. `status_update`
Regular progress updates and status reports:
- Feature development progress
- Testing status and results
- Blocker identification and resolution
- Timeline and milestone updates

### 2. `coordination_meeting`
Structured team coordination:
- Cross-team planning sessions
- Architecture and design reviews
- Release planning and coordination
- Retrospectives and lessons learned

### 3. `blocking_issue`
Critical issue escalation:
- Development blockers and impediments
- Resource constraints and conflicts
- Technical challenges requiring input
- Timeline risks and concerns

### 4. `release_planning`
Release coordination and planning:
- Feature readiness assessment
- Quality gate validation
- Deployment coordination
- Release communication strategy

### 5. `risk_alert`
Risk identification and mitigation:
- Technical risk identification
- Quality and testing concerns
- Timeline and resource risks
- Compliance and security issues

## Communication Matrix

### Team Communication Patterns
| From Team | To Teams | Communication Types | Frequency |
|-----------|----------|-------------------|-----------|
| Product Owner | All Teams | status_update, coordination_meeting, release_planning | Daily/Weekly |
| Backend Team Lead | Product Owner, QA, Frontend | status_update, blocking_issue, risk_alert | As needed |
| Frontend Team Lead | Product Owner, QA, Backend | status_update, blocking_issue, risk_alert | As needed |
| QA Team Lead | All Teams | status_update, blocking_issue, risk_alert | As needed |
| Software Architect | All Teams | coordination_meeting, risk_alert | Weekly/As needed |
| UX Designer | Product Owner, Frontend | status_update, coordination_meeting | Weekly |

### Priority Levels
- **Critical**: Immediate attention required, blocking development
- **High**: Urgent attention needed, timeline impact
- **Medium**: Standard communication, normal priority
- **Low**: Informational, no immediate action required

## Return Value

```javascript
{
  success: true,
  communication_id: "comm_20240115_001",
  delivery_status: {
    delivered: ["product-owner", "backend-team-lead", "qa-team-lead"],
    pending: [],
    failed: []
  },
  responses: {
    "product-owner": {
      status: "acknowledged",
      response: "Approved for testing phase",
      timestamp: "2024-01-15T10:30:00Z"
    },
    "backend-team-lead": {
      status: "acknowledged",
      response: "API documentation updated",
      timestamp: "2024-01-15T10:35:00Z"
    },
    "qa-team-lead": {
      status: "pending",
      response: null,
      timestamp: null
    }
  },
  action_items: [
    {
      action: "Review and approve test plan",
      assigned_to: "qa-team-lead",
      deadline: "2024-01-16",
      status: "pending"
    },
    {
      action: "Update API documentation",
      assigned_to: "backend-team-lead",
      deadline: "2024-01-15",
      status: "completed"
    }
  ],
  follow_up_required: true,
  next_communication: "2024-01-16T09:00:00Z"
}
```

## Examples

### Status Update Communication
```javascript
const result = await manageCrossTeamCommunication({
  communication_type: "status_update",
  from_team: "frontend-team-lead",
  to_teams: ["product-owner", "qa-team-lead"],
  message: "User profile component implementation complete with 95% test coverage",
  priority: "medium",
  response_required: false
});
```

### Blocking Issue Communication
```javascript
const result = await manageCrossTeamCommunication({
  communication_type: "blocking_issue",
  from_team: "backend-team-lead",
  to_teams: ["product-owner", "software-architect"],
  message: "Database performance issue identified in user query optimization",
  priority: "high",
  action_items: [
    "Review database indexing strategy",
    "Implement query optimization",
    "Performance test with production data volume"
  ],
  deadline: "2024-01-16",
  response_required: true
});
```

### Release Planning Communication
```javascript
const result = await manageCrossTeamCommunication({
  communication_type: "release_planning",
  from_team: "product-owner",
  to_teams: ["backend-team-lead", "frontend-team-lead", "qa-team-lead"],
  message: "Sprint 5 release planning - feature freeze in 3 days",
  agenda: "Feature readiness, quality gates, deployment coordination",
  action_items: [
    "Complete feature development",
    "Execute final test suite",
    "Prepare deployment packages",
    "Update documentation"
  ],
  deadline: "2024-01-18",
  priority: "high",
  response_required: true
});
```

## Agent Integration

### Product Owner Integration
```markdown
# Feature coordination communication
manage-cross-team-communication({
  communication_type: "coordination_meeting",
  from_team: "product-owner",
  to_teams: ["backend-team-lead", "frontend-team-lead", "qa-team-lead"],
  agenda: "Cross-platform feature coordination",
  action_items: ["API contract review", "UI component sync", "Test strategy alignment"],
  deadline: "2024-01-20"
})
```

### Backend Team Lead Integration
```markdown
# Technical blocker communication
manage-cross-team-communication({
  communication_type: "blocking_issue",
  from_team: "backend-team-lead",
  to_teams: ["product-owner", "software-architect"],
  message: "Database performance optimization blocking feature development",
  priority: "high",
  action_items: ["Performance analysis", "Index optimization", "Query optimization"],
  deadline: "2024-01-16"
})
```

### QA Team Lead Integration
```markdown
# Quality risk communication
manage-cross-team-communication({
  communication_type: "risk_alert",
  from_team: "qa-team-lead",
  to_teams: ["product-owner", "backend-team-lead", "frontend-team-lead"],
  message: "Test coverage below threshold for critical user workflows",
  priority: "high",
  action_items: ["Increase unit test coverage", "Add integration tests", "Update test strategy"],
  deadline: "2024-01-17"
})
```

### Software Architect Integration
```markdown
# Architecture coordination communication
manage-cross-team-communication({
  communication_type: "coordination_meeting",
  from_team: "software-architect",
  to_teams: ["backend-team-lead", "frontend-team-lead", "qa-team-lead"],
  agenda: "Architecture review and compliance validation",
  action_items: ["Review architecture decisions", "Validate compliance", "Update documentation"],
  deadline: "2024-01-19"
})
```

## Communication Workflow

### Phase 1: Message Preparation
```markdown
1. **Identify Communication Need**: Determine why communication is necessary
2. **Select Communication Type**: Choose appropriate communication type
3. **Define Target Audience**: Identify which teams need to be informed
4. **Craft Message**: Develop clear, concise message
5. **Set Priority**: Determine urgency and importance level
```

### Phase 2: Communication Delivery
```markdown
1. **Route to Recipients**: Deliver message to target teams/agents
2. **Track Delivery Status**: Monitor message delivery and acknowledgment
3. **Facilitate Response**: Enable recipients to respond appropriately
4. **Document Communication**: Record communication for audit trail
```

### Phase 3: Response Management
```markdown
1. **Collect Responses**: Gather responses from all recipients
2. **Analyze Responses**: Evaluate response content and sentiment
3. **Identify Action Items**: Extract required actions and assignments
4. **Schedule Follow-up**: Plan necessary follow-up communications
```

### Phase 4: Action Tracking
```markdown
1. **Assign Action Items**: Assign specific actions to team members
2. **Set Deadlines**: Establish realistic completion timelines
3. **Monitor Progress**: Track action item completion status
4. **Escalate Blockers**: Address any impediments to completion
```

## Communication Templates

### Status Update Template
```markdown
**Status Update**: [Feature/Component Name]
**Team**: [Sending Team]
**Progress**: [Current Status/Percentage]
**Key Accomplishments**: [Completed Tasks]
**Next Steps**: [Upcoming Tasks]
**Blockers**: [Any Impediments]
**Timeline Impact**: [Schedule Effects]
**QA Status**: [Testing Progress]
**Next Update**: [When to expect next update]
```

### Blocking Issue Template
```markdown
**🚨 BLOCKING ISSUE**
**Severity**: [Critical/High/Medium]
**Team**: [Reporting Team]
**Issue**: [Clear description of blocker]
**Impact**: [Effect on development/testing/release]
**Root Cause**: [Analysis of underlying cause]
**Proposed Solutions**: [Potential resolutions]
**Required Actions**: [Specific actions needed]
**Deadline**: [Resolution timeline]
**Escalation Point**: [Who to contact if unresolved]
```

### Risk Alert Template
```markdown
**⚠️ RISK ALERT**
**Risk Category**: [Technical/Quality/Timeline/Resource]
**Risk Level**: [High/Medium/Low]
**Identified By**: [Team/Agent]
**Risk Description**: [Clear explanation of risk]
**Potential Impact**: [Consequences if materialized]
**Mitigation Strategies**: [Actions to reduce risk]
**Monitoring Plan**: [How risk will be tracked]
**Contingency Plan**: [Backup plans if risk materializes]
```

## Response Management

### Response Types
- **Acknowledgment**: Simple receipt confirmation
- **Approval**: Agreement with proposed actions
- **Rejection**: Disagreement with counter-proposal
- **Request for Information**: Need for additional details
- **Escalation**: Referral to higher authority

### Response Tracking
- **Response Rate**: Percentage of recipients responding
- **Response Time**: Average time to respond
- **Action Completion**: Rate of action item completion
- **Follow-up Required**: Need for additional communication

## Integration Patterns

### With Task Management
```javascript
// Convert communication to tasks
if (communication.action_items.length > 0) {
  executeParallelTasks({
    tasks: communication.action_items.map(item => ({
      description: item.action,
      subagent_type: item.assigned_to
    })),
    complexity_level: "standard"
  });
}
```

### With Quality Gates
```javascript
// Communication-based quality validation
if (communication.type === "blocking_issue" && communication.priority === "critical") {
  validateQualityGates({
    quality_gates: ["issue_resolution"],
    agent_type: communication.from_team,
    strict_mode: true
  });
}
```

## Best Practices

1. **Clear Communication**: Use specific, unambiguous language
2. **Appropriate Urgency**: Match priority level to actual urgency
3. **Targeted Audience**: Include only necessary recipients
4. **Action-Oriented**: Include clear action items and deadlines
5. **Documentation**: Maintain comprehensive communication records
6. **Follow-up**: Ensure responses and actions are tracked
7. **Respect Time**: Be considerate of team members' time and priorities

## Dependencies

- Message routing and delivery system
- Response tracking and management
- Action item assignment and tracking
- Team and role management
- Notification and alerting system
- Communication audit trail

## Performance Metrics

### Communication Effectiveness
- **Response Rate**: Percentage of communications receiving responses
- **Response Time**: Average time to receive responses
- **Action Completion**: Rate of action item completion
- **Communication Satisfaction**: Team feedback on communication quality

### Operational Metrics
- **Communication Volume**: Number of communications by type and team
- **Escalation Rate**: Frequency of escalated communications
- **Blocker Resolution**: Time to resolve blocking issues
- **Cross-Team Coordination**: Effectiveness of multi-team coordination

This command provides comprehensive cross-team communication management, enabling structured and effective coordination between all UrbanAI development teams and stakeholders.