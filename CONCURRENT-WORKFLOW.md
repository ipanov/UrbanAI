# UrbanAI Concurrent Development Workflow

## Overview
This document describes the concurrent development workflow that enables seamless switching between Claude Code and Cline development environments while maintaining project consistency and preventing conflicts.

## Architecture

### Branch Strategy
```
main (production)
├── develop (Claude Code - primary development)
│   ├── .claude/ (Claude Code configuration)
│   └── latest work and features
└── cline-metadata-archive (Cline - secondary development)
    ├── .cline/ (Cline configuration)
    ├── .clinerules (Cline workflow rules)
    └── memory-bank/ (project documentation)
```

### Configuration Separation
- **Claude Code**: Uses `.claude/` directory for agents, settings, and hooks
- **Cline**: Uses `.cline/` directory for personas and `.clinerules` for workflow
- **Shared**: `memory-bank/` contains project documentation accessible by both tools

## Getting Started

### Prerequisites
1. Both Claude Code and Cline installed and configured
2. Git repository cloned locally
3. Access to both `develop` and `cline-metadata-archive` branches

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/ipanov/UrbanAI.git
cd UrbanAI

# Ensure both branches exist
git checkout develop
git pull origin develop

git checkout cline-metadata-archive
git pull origin cline-metadata-archive
```

## Workflow Commands

### Switching Between Tools

#### Using PowerShell Script (Recommended)
```powershell
# Switch to Claude Code
.\scripts\switch-dev-tools.ps1 -claude

# Switch to Cline
.\scripts\switch-dev-tools.ps1 -cline

# Force switch (auto-stash changes)
.\scripts\switch-dev-tools.ps1 -claude -Force
```

#### Manual Switching
```bash
# Stash current changes (if any)
git stash push -m "Switching to [tool name]"

# Switch branch
git checkout [target-branch]

# Pull latest changes
git pull origin [target-branch]

# Restore stashed changes (if needed)
git stash pop
```

## Development Guidelines

### Memory Bank Protocol
1. **Always read** all core memory-bank files at the start of each session
2. **Update progress.md** with current work status
3. **Document decisions** in activeContext.md
4. **Maintain consistency** across both tools

### Commit Strategy
- **Conventional commits**: Use standard format (`feat:`, `fix:`, `docs:`, etc.)
- **Atomic commits**: Each commit should represent a single logical change
- **Descriptive messages**: Include what, why, and impact of changes
- **Push immediately**: Never leave commits unpushed

### Quality Standards
- **Testing**: Maintain 80%+ code coverage
- **Documentation**: Update memory-bank files for all changes
- **Code Review**: Self-review before committing
- **Security**: Verify security implications of changes

## Conflict Resolution

### When Changes Conflict
1. **Identify conflicts**: Check git status for merge conflicts
2. **Review changes**: Compare conflicting files
3. **Resolve manually**: Choose appropriate version or merge changes
4. **Test thoroughly**: Ensure functionality works after resolution
5. **Document resolution**: Update memory-bank with conflict details

### Prevention Strategies
- **Feature isolation**: Work on separate features in different branches
- **Regular sync**: Pull changes frequently to avoid large conflicts
- **Clear communication**: Document work in progress in memory-bank
- **Atomic changes**: Make small, focused commits

## Tool-Specific Configurations

### Claude Code Configuration
- **Location**: `.claude/` directory
- **Agents**: Specialized agents for different development tasks
- **Settings**: Claude-specific preferences and automations
- **Hooks**: Pre/post-commit hooks and automation scripts

### Cline Configuration
- **Location**: `.cline/` directory and `.clinerules` file
- **Personas**: Specialized development personas
- **Rules**: Workflow rules and memory bank requirements
- **Memory Bank**: Comprehensive project documentation

## Best Practices

### Daily Workflow
1. **Start session**: Read memory-bank files
2. **Plan work**: Update progress.md with goals
3. **Develop**: Make changes following established patterns
4. **Test**: Ensure quality standards are met
5. **Commit**: Use conventional commit format
6. **Push**: Immediately push changes to remote
7. **Document**: Update memory-bank with progress

### Session Management
- **Context limits**: Monitor AI tool context usage
- **Session boundaries**: Clear separation between tool sessions
- **Progress tracking**: Regular updates to memory-bank
- **Knowledge transfer**: Seamless context sharing between tools

### Quality Assurance
- **Code standards**: Consistent formatting and patterns
- **Testing requirements**: Comprehensive test coverage
- **Documentation**: Up-to-date memory-bank files
- **Security review**: Security implications assessment

## Troubleshooting

### Common Issues

#### Stash Conflicts
```bash
# List available stashes
git stash list

# Apply specific stash
git stash apply stash@{1}

# Drop applied stash
git stash drop stash@{1}

# Clear all stashes
git stash clear
```

#### Branch Synchronization
```bash
# Check branch status
git status
git log --oneline -5

# Force pull (use with caution)
git pull --force origin [branch]

# Reset to remote state
git reset --hard origin/[branch]
```

#### Configuration Issues
- **Missing files**: Check if configuration directories exist
- **Permission issues**: Ensure proper file permissions
- **Path issues**: Verify script paths and working directory

### Getting Help
1. **Check memory-bank**: Review activeContext.md for current issues
2. **Review progress**: Check progress.md for known issues
3. **Git history**: Look at recent commits for similar issues
4. **Documentation**: Refer to this document and related docs

## Advanced Usage

### Custom Scripts
Create additional automation scripts in the `scripts/` directory:
- Build scripts for different environments
- Deployment automation
- Testing utilities
- Code quality checks

### Integration Points
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Application performance tracking
- **Security**: Automated security scanning
- **Documentation**: Auto-generated API docs

### Scaling Considerations
- **Team collaboration**: Multiple developers using different tools
- **Project complexity**: Managing large codebases
- **Performance optimization**: Tool-specific optimizations
- **Knowledge sharing**: Cross-tool knowledge transfer

## Maintenance

### Regular Tasks
- **Update memory-bank**: Keep documentation current
- **Review configurations**: Ensure tool configs are up-to-date
- **Clean branches**: Remove obsolete feature branches
- **Archive old stashes**: Remove unnecessary git stashes

### Monitoring
- **Branch health**: Regular branch status checks
- **Configuration sync**: Ensure configs stay synchronized
- **Performance**: Monitor development tool performance
- **Quality metrics**: Track code quality over time

---

## Quick Reference

### Switch Commands
```powershell
# Claude Code
.\scripts\switch-dev-tools.ps1 -claude

# Cline
.\scripts\switch-dev-tools.ps1 -cline
```

### Memory Bank Files
- `projectbrief.md`: Project overview
- `productContext.md`: User journeys and market
- `activeContext.md`: Current development status
- `systemPatterns.md`: Architecture patterns
- `techContext.md`: Technology stack
- `progress.md`: Development progress

### Key Directories
- `.claude/`: Claude Code configuration
- `.cline/`: Cline configuration
- `memory-bank/`: Project documentation
- `scripts/`: Automation scripts

---

*Last Updated: November 2025*
*Maintained by: UrbanAI Development Team*
