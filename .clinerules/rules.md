# UrbanAI Development Rules - Streamlined

## Core Development Principles

### Memory Bank Management
- **MANDATORY**: Read ALL memory bank files at the start of every task
- **MANDATORY**: Update memory-bank/progress.md after completing any work
- **MANDATORY**: Commit and push changes before marking tasks complete

### Port Management
- **MANDATORY**: Use only specified ports (3000, 5001, 7071) for development services
- **MANDATORY**: Use `/start-dev-services.md` workflow for service startup
- **NEVER**: Start services on arbitrary ports without workflow approval

### Quality Standards
- **MANDATORY**: TypeScript strict mode enabled
- **MANDATORY**: ESLint validation passes
- **MANDATORY**: 80%+ test coverage maintained
- **MANDATORY**: Visual validation required for all frontend changes

### Workflow Usage
- **MANDATORY**: Use `/implement-component.md` for frontend development
- **MANDATORY**: Use `/visual-validate-frontend.md` for visual validation
- **MANDATORY**: Use `/frontend-dev-checklist.md` for quality assurance

## Project-Specific Rules

### Architecture Compliance
- **MANDATORY**: Follow Clean Architecture (Domain → Application → Infrastructure → API)
- **MANDATORY**: Use established design patterns and folder structure
- **MANDATORY**: Maintain separation of concerns across all layers

### Code Quality
- **MANDATORY**: PascalCase for classes, camelCase for variables
- **MANDATORY**: XML documentation for all public APIs
- **MANDATORY**: Meaningful commit messages following conventional format

### Security Requirements
- **MANDATORY**: Input validation on all user inputs
- **MANDATORY**: Authentication required for protected endpoints
- **MANDATORY**: GDPR compliance for data handling

## Development Workflow

### Task Completion Protocol
1. Read memory bank files
2. Understand task requirements
3. Execute appropriate workflow
4. Validate quality gates
5. Update memory bank
6. Commit and push changes

### Error Handling
- **MANDATORY**: Log all errors with correlation IDs
- **MANDATORY**: Provide user-friendly error messages
- **MANDATORY**: Graceful degradation for system failures

## Performance Standards

### Frontend Performance
- **MANDATORY**: Bundle size < 200KB
- **MANDATORY**: First paint < 2 seconds
- **MANDATORY**: Time to interactive < 3 seconds

### Backend Performance
- **MANDATORY**: API response time < 500ms
- **MANDATORY**: Database query optimization
- **MANDATORY**: Efficient caching strategies

## Testing Requirements

### Unit Testing
- **MANDATORY**: 80%+ code coverage
- **MANDATORY**: Mock external dependencies
- **MANDATORY**: Test edge cases and error conditions

### Integration Testing
- **MANDATORY**: API endpoint validation
- **MANDATORY**: Database operation testing
- **MANDATORY**: Third-party service integration

### E2E Testing
- **MANDATORY**: Critical user journey validation
- **MANDATORY**: Cross-browser compatibility
- **MANDATORY**: Mobile responsiveness testing

## Documentation Standards

### Code Documentation
- **MANDATORY**: XML comments for public APIs
- **MANDATORY**: Inline comments for complex logic
- **MANDATORY**: README files for all projects

### Architecture Documentation
- **MANDATORY**: Update memory bank for all changes
- **MANDATORY**: Maintain system architecture diagrams
- **MANDATORY**: Document API changes and breaking changes

## Deployment Requirements

### Pre-deployment Checks
- **MANDATORY**: All tests pass
- **MANDATORY**: Security scan completed
- **MANDATORY**: Performance benchmarks met
- **MANDATORY**: Documentation updated

### Environment Management
- **MANDATORY**: Environment-specific configuration
- **MANDATORY**: Secret management through Azure Key Vault
- **MANDATORY**: Database migration scripts tested

## Communication Standards

### Code Review Process
- **MANDATORY**: All changes require code review
- **MANDATORY**: Address all review comments
- **MANDATORY**: Maintain code review checklist

### Team Collaboration
- **MANDATORY**: Daily standup updates
- **MANDATORY**: Clear task assignment and ownership
- **MANDATORY**: Regular knowledge sharing sessions

---

*These rules are designed to be stable and infrequently changing. For specific task execution, use the appropriate workflow from `.clinerules/workflows/` directory.*
