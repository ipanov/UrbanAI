# Command: enforce-port-compliance

## Purpose

Universal port compliance validation and enforcement for all UrbanAI development servers. This command ensures that all agents and development processes adhere to the mandatory port configuration to prevent conflicts and maintain consistency.

## Usage

```markdown
# Basic port compliance validation
enforce-port-compliance({
  action: "validate",
  process_type: "development"
})

# Comprehensive port compliance enforcement
enforce-port-compliance({
  action: "enforce",
  process_type: "development",
  strict_mode: true,
  auto_correct: true
})
```

## Parameters

### Required Parameters
- `action` (String): Action to perform ("validate", "enforce", "kill_violations", "start_servers")
- `process_type` (String): Type of process ("development", "testing", "deployment")

### Optional Parameters
- `strict_mode` (Boolean): Whether to fail on any port violation (default: true)
- `auto_correct` (Boolean): Whether to automatically correct violations (default: false)
- `timeout_ms` (Number): Timeout for operations in milliseconds (default: 30000)

## Mandatory Port Configuration

### 🔒 Enforced Development Ports (No Exceptions)
- **API Server**: Port **5001** ONLY
- **Frontend Server**: Port **3000** ONLY

### ❌ Forbidden Ports
- **3100** - Previously used conflicting port
- **5101** - Previously used conflicting port
- **4173** - Vite default port (forbidden)
- **5173** - Vite default port (forbidden)
- **Any other non-configured port**

## Return Value

```javascript
{
  success: true,
  port_compliance: {
    api_server: { port: 5001, status: "compliant", running: true },
    frontend_server: { port: 3000, status: "compliant", running: true }
  },
  violations: [],
  corrections: [],
  execution_time: 5000,
  recommendations: []
}
```

## Error Handling

The command provides detailed error reporting for port violations:

1. **Port Conflicts**: Multiple processes using the same port
2. **Wrong Ports**: Processes running on forbidden ports
3. **Configuration Mismatches**: Process ports not matching configuration files
4. **Missing Processes**: Required servers not running

## Examples

### Basic Port Validation
```javascript
const result = await enforcePortCompliance({
  action: "validate",
  process_type: "development",
  strict_mode: true
});
```

### Comprehensive Port Enforcement
```javascript
const result = await enforcePortCompliance({
  action: "enforce",
  process_type: "development",
  strict_mode: true,
  auto_correct: true,
  timeout_ms: 60000
});
```

### Kill Violations and Restart
```javascript
const result = await enforcePortCompliance({
  action: "kill_violations",
  process_type: "development",
  strict_mode: true
});
```

### Start Development Servers
```javascript
const result = await enforcePortCompliance({
  action: "start_servers",
  process_type: "development",
  strict_mode: true
});
```

## Agent Integration

### Universal Integration Pattern
All agents must include port compliance validation:

```markdown
# Before starting any development work
enforce-port-compliance({
  action: "validate",
  process_type: "development",
  strict_mode: true
})

# After development work completion
enforce-port-compliance({
  action: "enforce",
  process_type: "development",
  strict_mode: true
})
```

### Product Owner Integration
```markdown
# Feature development validation
enforce-port-compliance({
  action: "validate",
  process_type: "development",
  strict_mode: true
})
```

### Backend Team Lead Integration
```markdown
# API development validation
enforce-port-compliance({
  action: "enforce",
  process_type: "development",
  strict_mode: true,
  auto_correct: true
})
```

### Frontend Team Lead Integration
```markdown
# Frontend development validation
enforce-port-compliance({
  action: "validate",
  process_type: "development",
  strict_mode: true
})
```

### QA Team Lead Integration
```markdown
# Testing environment validation
enforce-port-compliance({
  action: "enforce",
  process_type: "testing",
  strict_mode: true
})
```

## Compliance Enforcement Workflow

### Phase 1: Port Validation
```markdown
1. **Scan Running Processes**: Check all processes and their ports
2. **Validate Configuration**: Compare with launchSettings.json and appsettings.json
3. **Identify Violations**: List all port compliance issues
4. **Generate Report**: Provide detailed violation report
```

### Phase 2: Violation Correction
```markdown
1. **Kill Violating Processes**: Terminate processes on wrong ports
2. **Clear Port Conflicts**: Resolve any port conflicts
3. **Start Correct Servers**: Launch servers on correct ports
4. **Validate Compliance**: Ensure all servers running on correct ports
```

### Phase 3: Continuous Monitoring
```markdown
1. **Monitor Port Usage**: Track port usage during development
2. **Prevent Violations**: Block attempts to use wrong ports
3. **Auto-Correction**: Automatically correct violations when detected
4. **Generate Alerts**: Notify on port compliance issues
```

## Violation Types and Solutions

### Type 1: Wrong Port Usage
**Issue**: Process running on forbidden port
**Solution**: Kill process and restart on correct port

### Type 2: Port Conflicts
**Issue**: Multiple processes trying to use same port
**Solution**: Kill conflicting processes, restart primary process

### Type 3: Configuration Mismatch
**Issue**: Process port doesn't match configuration file
**Solution**: Update configuration or restart with correct port

### Type 4: Missing Required Process
**Issue**: Required server not running
**Solution**: Start server using startup script

## Best Practices

1. **Pre-Development Validation**: Always validate port compliance before starting work
2. **Post-Development Enforcement**: Ensure compliance after completing tasks
3. **Auto-Correction**: Enable auto-correction for development environments
4. **Strict Mode**: Use strict mode in production and testing environments
5. **Continuous Monitoring**: Monitor port usage throughout development sessions

## Configuration Files Validation

### API Configuration
- `src/UrbanAI.API/Properties/launchSettings.json`: Must specify port 5001
- `src/UrbanAI.API/appsettings.json`: OAuth URLs must use port 3000

### Frontend Configuration
- `src/UrbanAI.Frontend/package.json`: Dev server must use port 3000
- `src/UrbanAI.Frontend/vite.config.ts`: Must specify port 3000

### Startup Script
- `.claude/scripts/start-development-servers.js`: Must enforce correct ports

## Performance Metrics

The command tracks and reports:
- **Validation Time**: Time to complete port compliance check
- **Violation Count**: Number of port violations detected
- **Correction Time**: Time to correct violations
- **Success Rate**: Percentage of successful compliance validations
- **Resource Usage**: CPU/memory usage during enforcement

## Security Considerations

- **Process Permissions**: Ensure process termination has proper permissions
- **Configuration Security**: Protect configuration files from unauthorized changes
- **Network Security**: Validate that only authorized ports are accessible
- **Audit Trail**: Maintain log of all port compliance actions

## Dependencies

- Process management utilities
- Port scanning and monitoring tools
- Configuration file validation
- Process termination utilities
- Server startup script coordination

## Compliance Reporting

### Real-time Reporting
```javascript
{
  compliance_status: "compliant",
  api_server: { port: 5001, status: "running", process_id: 12345 },
  frontend_server: { port: 3000, status: "running", process_id: 12346 },
  violations: [],
  last_validation: "2024-01-15T10:30:00Z"
}
```

### Violation Reporting
```javascript
{
  compliance_status: "non_compliant",
  violations: [
    {
      type: "wrong_port",
      process: "node",
      pid: 12347,
      current_port: 5173,
      required_port: 3000,
      severity: "critical"
    }
  ],
  recommendations: [
    "Kill process on port 5173 and restart on port 3000"
  ]
}
```