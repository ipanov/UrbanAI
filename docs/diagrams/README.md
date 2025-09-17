# UrbanAI Agent Architecture Diagrams

This directory contains comprehensive Mermaid diagrams that visualize the UrbanAI agent architecture and integration patterns.

## Available Diagrams

### 1. Comprehensive Documentation
- **`agent-architecture-visualization.md`** - Complete documentation with all diagrams and explanations

### 2. Individual Mermaid Files
- **`system-architecture.mermaid`** - High-level system architecture with custom agents integration
- **`research-agent-workflow.mermaid`** - Research Agent detailed workflow with parallel execution
- **`reporter-agent-workflow.mermaid`** - Reporter Agent workflow for documentation generation
- **`subagent-interactions.mermaid`** - Subagent network patterns and data flow
- **`ai-chat-integration.mermaid`** - AI chat integration architecture with real-time communication
- **`database-schema.mermaid`** - Entity relationship diagram for agent data storage
- **`frontend-integration.mermaid`** - React app integration patterns and component structure
- **`agent-communication-flow.mermaid`** - State diagram showing agent communication patterns
- **`performance-scalability.mermaid`** - Scaling architecture from MVP to enterprise
- **`security-architecture.mermaid`** - Security boundaries and protection mechanisms

## How to Use These Diagrams

### Integration with Documentation
These diagrams can be integrated into various documentation formats:

#### Markdown Integration
```markdown
# System Architecture

```mermaid
!include ./docs/diagrams/system-architecture.mermaid
```
```

#### HTML Integration
```html
<div class="mermaid">
  <!-- Paste mermaid code here -->
</div>
```

#### Mermaid CLI Usage
```bash
# Render diagram as PNG
mmdc -i system-architecture.mermaid -o system-architecture.png

# Render diagram as SVG
mmdc -i system-architecture.mermaid -o system-architecture.svg -t dark
```

### Diagram Categories

#### System Architecture
- **System Architecture**: Shows how custom agents integrate with the existing Clean Architecture
- **Database Schema**: Entity relationships for storing agent data and interactions
- **Performance & Scalability**: Growth path from MVP to enterprise scale

#### Agent Workflows
- **Research Agent Workflow**: Parallel execution of research subagents with MCP integration
- **Reporter Agent Workflow**: Documentation generation with visual components
- **Agent Communication Flow**: State machine showing agent interaction patterns

#### Integration Patterns
- **Subagent Interactions**: Network of specialized agents and their communication
- **AI Chat Integration**: Real-time chat architecture with context management
- **Frontend Integration**: React component structure and state management

#### Security & Operations
- **Security Architecture**: Multi-layered security for agent interactions
- **Communication Flow**: State diagrams for agent orchestration

## Key Architectural Insights

### 1. Clean Architecture Integration
The agent system maintains Clean Architecture principles by:
- Keeping agents in the Application layer
- Preserving Domain layer purity
- Using Infrastructure layer for MCP services
- Maintaining clear separation of concerns

### 2. Parallel Execution
Research and Documentation agents use parallel subagent execution:
- Research subagents run simultaneously for comprehensive analysis
- Documentation subagents generate content in parallel
- Results are synthesized for comprehensive outputs

### 3. MCP Service Integration
The architecture leverages multiple MCP services:
- **Context7**: Real-time documentation access
- **Firecrawl**: Web research and content extraction
- **WebSearch**: Latest technology trends
- **Mermaid**: Professional diagram generation
- **Sequential Thinking**: Complex problem analysis

### 4. Scalability Strategy
The system scales from MVP to enterprise:
- **Phase 1**: Basic agents with shared resources ($4.90/month)
- **Phase 2**: Enhanced agents with read replicas ($25-50/month)
- **Phase 3**: Enterprise agents with microservices ($100-500/month)

### 5. Security Architecture
Multi-layered security approach:
- **User Boundary**: OAuth2, JWT, RBAC
- **Agent Boundary**: Sandboxing, input validation
- **System Boundary**: Encryption, audit logging, firewall
- **Data Protection**: GDPR compliance, data masking

## Development Guidelines

### Adding New Agents
1. Define agent capabilities and interfaces
2. Create appropriate database schema extensions
3. Implement MCP service integrations
4. Design subagent networks for parallel execution
5. Update system architecture diagrams

### Modifying Existing Diagrams
1. Update individual `.mermaid` files
2. Regenerate the comprehensive documentation
3. Validate diagram syntax using Mermaid CLI
4. Test integration with documentation tools

### Best Practices
- Keep diagrams focused and single-purpose
- Use consistent styling and naming conventions
- Include proper labels and annotations
- Validate diagram syntax regularly
- Update diagrams alongside code changes

## Tools and Dependencies

### Required Tools
- **Mermaid CLI**: For diagram rendering and validation
- **Node.js**: For Mermaid CLI and documentation tools
- **VS Code**: With Mermaid preview extension

### Integration Platforms
- **GitHub**: Markdown rendering with Mermaid support
- **Confluence**: Mermaid diagram macros
- **Notion**: Limited Mermaid support
- **Static Site Generators**: Varies by platform

## File Structure

```
docs/diagrams/
├── README.md                           # This file
├── agent-architecture-visualization.md  # Comprehensive documentation
├── system-architecture.mermaid         # High-level system architecture
├── research-agent-workflow.mermaid     # Research agent workflow
├── reporter-agent-workflow.mermaid     # Reporter agent workflow
├── subagent-interactions.mermaid       # Subagent network patterns
├── ai-chat-integration.mermaid         # Chat integration architecture
├── database-schema.mermaid             # Entity relationship diagram
├── frontend-integration.mermaid        # React integration patterns
├── agent-communication-flow.mermaid    # Communication state diagram
├── performance-scalability.mermaid     # Scaling architecture
└── security-architecture.mermaid        # Security boundaries
```

## Contributing

When contributing to these diagrams:
1. Follow the established naming conventions
2. Maintain consistent styling across diagrams
3. Update this README when adding new diagrams
4. Test diagram rendering before committing
5. Include appropriate documentation for new diagrams

## Troubleshooting

### Common Issues
- **Syntax Errors**: Validate using Mermaid CLI or online editor
- **Rendering Issues**: Check browser compatibility and Mermaid version
- **Integration Problems**: Verify file paths and include statements

### Support
- Refer to Mermaid documentation for syntax reference
- Use online Mermaid editor for testing
- Check browser console for rendering errors