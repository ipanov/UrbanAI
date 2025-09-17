# UrbanAI Agent Architecture Documentation

## Visual Architecture Documentation

This document provides comprehensive visual documentation of the UrbanAI agent architecture, including system architecture, agent workflows, subagent interactions, and integration patterns.

## 1. High-Level System Architecture with Custom Agents Integration

```mermaid
graph TB
    subgraph "User Interface Layer"
        UI[React Frontend]
        Mobile[Mobile App]
        Admin[Admin Dashboard]
    end

    subgraph "Agent Orchestration Layer"
        SA[Software Architect Agent]
        PO[Product Owner Agent]
        QA[QA Engineer Agent]
        Dev[Developer Agent]
    end

    subgraph "Custom AI Agents Layer"
        RA[Research Agent]
        RP[Reporter Agent]
        Chat[AI Chat Assistant]
    end

    subgraph "Subagent Network Layer"
        subgraph "Research Subagents"
            TRS[Technology Research Specialist]
            APA[Architecture Pattern Analyst]
            SAS[Security Architecture Specialist]
        end

        subgraph "Documentation Subagents"
            TDE[Technical Documentation Engineer]
            VAD[Visual Architecture Designer]
            PSA[Performance & Scalability Analyst]
        end
    end

    subgraph "Core Application Layer"
        API[ASP.NET Core API]
        Auth[OAuth2 Authentication]
        Gateway[API Gateway]
        Services[Application Services]
    end

    subgraph "Domain & Infrastructure Layer"
        Entities[Domain Entities]
        Repositories[Repositories]
        SQL[Azure SQL Database]
        Cosmos[Azure Cosmos DB]
        Cache[Redis Cache]
    end

    subgraph "External Services Layer"
        OpenAI[Azure OpenAI]
        Search[Web Search APIs]
        Context[Context7 MCP]
        Firecrawl[Firecrawl MCP]
        Mermaid[Mermaid MCP]
    end

    UI --> API
    Mobile --> API
    Admin --> API

    API --> Auth
    API --> Gateway
    Gateway --> Services

    Services --> SA
    Services --> PO
    Services --> QA
    Services --> Dev

    SA --> RA
    SA --> RP
    SA --> Chat

    RA --> TRS
    RA --> APA
    RA --> SAS

    RP --> TDE
    RP --> VAD
    RP --> PSA

    TRS --> OpenAI
    TRS --> Search
    TRS --> Context
    TRS --> Firecrawl

    APA --> Context
    APA --> Firecrawl

    SAS --> Context
    SAS --> Firecrawl

    VAD --> Mermaid

    Services --> Entities
    Services --> Repositories
    Repositories --> SQL
    Repositories --> Cosmos
    Services --> Cache
```

## 2. Research Agent Detailed Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant API as API Gateway
    participant SA as Software Architect
    participant RA as Research Agent
    participant TRS as Tech Research Specialist
    participant APA as Architecture Analyst
    participant SAS as Security Specialist
    participant C7 as Context7 MCP
    participant FC as Firecrawl MCP
    participant WS as WebSearch

    U->>F: Request Architecture Research
    F->>API: POST /api/agents/research
    API->>SA: Route Research Request
    SA->>RA: Deploy Research Agent

    rect rgb(255, 245, 238)
        Note over RA,SAS: Parallel Research Execution
        RA->>TRS: Research Technology Stack
        RA->>APA: Analyze Architecture Patterns
        RA->>SAS: Assess Security Implications

        TRS->>C7: Get .NET 9 Documentation
        TRS->>FC: Crawl Tech Documentation
        TRS->>WS: Search Latest Trends

        APA->>C7: Research Clean Architecture
        APA->>FC: Analyze Competitor Patterns
        APA->>WS: Search Architecture Best Practices

        SAS->>C7: Research Security Standards
        SAS->>FC: Analyze Security Patterns
        SAS->>WS: Search Security Threats
    end

    TRS->>RA: Technology Research Report
    APA->>RA: Architecture Analysis Report
    SAS->>RA: Security Assessment Report

    RA->>RA: Synthesize Research Findings
    RA->>SA: Comprehensive Research Package

    SA->>SA: Ultra Thinking Analysis
    SA->>SA: Generate Architectural Alternatives

    SA->>API: Research Results
    API->>F: JSON Response
    F->>U: Research Findings & Recommendations
```

## 3. Reporter Agent Detailed Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant API as API Gateway
    participant SA as Software Architect
    participant RP as Reporter Agent
    participant TDE as Technical Documentation
    participant VAD as Visual Architecture
    participant PSA as Performance Analyst
    participant M as Mermaid MCP
    participant DB as Database

    U->>F: Request Documentation Report
    F->>API: POST /api/agents/report
    API->>SA: Route Report Request
    SA->>RP: Deploy Reporter Agent

    rect rgb(245, 255, 250)
        Note over RP,PSA: Parallel Documentation Generation
        RP->>TDE: Generate Technical Docs
        RP->>VAD: Create Architecture Diagrams
        RP->>PSA: Analyze Performance Metrics

        TDE->>DB: Fetch Architecture Data
        TDE->>DB: Retrieve Decision Records
        TDE->>TDE: Write Documentation

        VAD->>M: Generate Mermaid Diagrams
        VAD->>VAD: Design Visual Elements
        VAD->>VAD: Optimize Diagram Layout

        PSA->>DB: Query Performance Data
        PSA->>PSA: Model Scalability
        PSA->>PSA: Generate Projections
    end

    TDE->>RP: Technical Documentation
    VAD->>RP: Visual Architecture Package
    PSA->>RP: Performance Analysis

    RP->>RP: Assemble Comprehensive Report
    RP->>SA: Documentation Package

    SA->>SA: Quality Review
    SA->>SA: Validate Completeness

    SA->>API: Report Package
    API->>F: Documentation Response
    F->>U: Complete Report with Diagrams
```

## 4. Subagent Interaction Patterns and Data Flow

```mermaid
graph LR
    subgraph "Orchestration Layer"
        SA[Software Architect Agent]
        PO[Product Owner Agent]
    end

    subgraph "Agent Network"
        RA[Research Agent]
        RP[Reporter Agent]
        QA[QA Engineer Agent]
        Dev[Developer Agent]
    end

    subgraph "Research Subagents Cluster"
        TRS[Technology Research Specialist]
        APA[Architecture Pattern Analyst]
        SAS[Security Architecture Specialist]
    end

    subgraph "Documentation Subagents Cluster"
        TDE[Technical Documentation Engineer]
        VAD[Visual Architecture Designer]
        PSA[Performance & Scalability Analyst]
    end

    subgraph "MCP Services Layer"
        C7[Context7 MCP]
        FC[Firecrawl MCP]
        WS[WebSearch MCP]
        MM[Mermaid MCP]
        ST[Sequential Thinking]
        PM[Planning Mode]
    end

    subgraph "Data Stores"
        Docs[Documentation Store]
        Diagrams[Diagram Repository]
        Research[Research Cache]
        Performance[Performance Metrics]
    end

    PO --> SA
    SA --> RA
    SA --> RP
    SA --> QA
    SA --> Dev

    RA --> TRS
    RA --> APA
    RA --> SAS

    RP --> TDE
    RP --> VAD
    RP --> PSA

    TRS --> C7
    TRS --> FC
    TRS --> WS

    APA --> C7
    APA --> FC
    APA --> ST

    SAS --> C7
    SAS --> FC
    SAS --> WS

    VAD --> MM
    VAD --> C7

    SA --> PM
    SA --> ST

    TRS --> Research
    APA --> Research
    SAS --> Research

    TDE --> Docs
    VAD --> Diagrams
    PSA --> Performance

    RP --> Docs
    RP --> Diagrams
    RP --> Performance
```

## 5. AI Chat Integration Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Chat Interface]
        Auth[Authentication Context]
        Socket[WebSocket Client]
    end

    subgraph "API Gateway Layer"
        Gateway[API Gateway]
        RateLimit[Rate Limiting]
        AuthMW[Authentication Middleware]
    end

    subgraph "Chat Service Layer"
        ChatService[Chat Service]
        SessionManager[Session Manager]
        ContextManager[Context Manager]
        MessageBroker[Message Broker]
    end

    subgraph "AI Integration Layer"
        Orchestrator[Agent Orchestrator]
        Router[Intent Router]
        RA[Research Agent]
        RP[Reporter Agent]
        ChatAssistant[AI Chat Assistant]
    end

    subgraph "MCP Services Layer"
        OpenAI[Azure OpenAI]
        Context7[Context7 MCP]
        Firecrawl[Firecrawl MCP]
        WebSearch[WebSearch MCP]
    end

    subgraph "Data Layer"
        ChatDB[Chat History Database]
        ContextDB[Context Database]
        Cache[Redis Cache]
    end

    UI --> Socket
    UI --> Auth
    Socket --> Gateway

    Gateway --> RateLimit
    RateLimit --> AuthMW
    AuthMW --> ChatService

    ChatService --> SessionManager
    ChatService --> ContextManager
    ChatService --> MessageBroker

    SessionManager --> ChatDB
    ContextManager --> ContextDB
    ContextManager --> Cache

    MessageBroker --> Orchestrator
    Orchestrator --> Router

    Router --> RA
    Router --> RP
    Router --> ChatAssistant

    RA --> OpenAI
    RA --> Context7
    RA --> Firecrawl
    RA --> WebSearch

    RP --> Context7
    RP --> Firecrawl

    ChatAssistant --> OpenAI
    ChatAssistant --> Context7

    ChatAssistant --> MessageBroker
    MessageBroker --> UI
```

## 6. Database Schema Extensions for Agent Data

```mermaid
erDiagram
    AGENTS {
        Guid id PK
        string name
        string type
        string description
        json capabilities
        datetime created_at
        datetime updated_at
        boolean is_active
    }

    AGENT_SESSIONS {
        Guid id PK
        Guid agent_id FK
        Guid user_id FK
        string session_type
        json session_data
        datetime started_at
        datetime ended_at
        string status
    }

    RESEARCH_TASKS {
        Guid id PK
        Guid agent_session_id FK
        string task_type
        string research_query
        json research_parameters
        json research_results
        datetime created_at
        datetime completed_at
        string status
    }

    DOCUMENTATION_REPORTS {
        Guid id PK
        Guid agent_session_id FK
        string report_type
        json report_content
        string document_path
        datetime generated_at
        string version
    }

    ARCHITECTURAL_DECISIONS {
        Guid id PK
        string decision_id
        string title
        string context
        string decision
        string rationale
        json alternatives
        json implications
        Guid author_id FK
        datetime created_at
        datetime updated_at
    }

    CHAT_CONVERSATIONS {
        Guid id PK
        Guid user_id FK
        Guid agent_session_id FK
        string conversation_type
        json conversation_context
        datetime started_at
        datetime ended_at
    }

    CHAT_MESSAGES {
        Guid id PK
        Guid conversation_id FK
        string role
        string content
        json metadata
        datetime timestamp
    }

    AGENT_PERFORMANCE_METRICS {
        Guid id PK
        Guid agent_id FK
        string metric_type
        decimal metric_value
        json metric_data
        datetime recorded_at
    }

    MCP_SERVICE_LOGS {
        Guid id PK
        string service_name
        string operation
        json request_data
        json response_data
        datetime execution_time
        string status
        string error_message
        datetime created_at
    }

    AGENTS ||--o{ AGENT_SESSIONS : "has"
    AGENT_SESSIONS ||--o{ RESEARCH_TASKS : "contains"
    AGENT_SESSIONS ||--o{ DOCUMENTATION_REPORTS : "generates"
    AGENT_SESSIONS ||--o{ CHAT_CONVERSATIONS : "related_to"
    CHAT_CONVERSATIONS ||--o{ CHAT_MESSAGES : "contains"
    AGENTS ||--o{ AGENT_PERFORMANCE_METRICS : "monitors"
    MCP_SERVICE_LOGS }|--|| AGENTS : "used_by"
    AGENT_SESSIONS }|--|| AGENTS : "belongs_to"
    CHAT_CONVERSATIONS }|--|| AGENT_SESSIONS : "part_of"
    ARCHITECTURAL_DECISIONS }|--|| AGENT_SESSIONS : "documented_in"
```

## 7. Frontend Integration Patterns with Existing React App

```mermaid
graph TB
    subgraph "Existing React App Structure"
        App[App.tsx]
        Router[React Router]
        Auth[Auth Context]
        API[API Service Layer]
    end

    subgraph "New Agent Integration Components"
        AgentDashboard[AgentDashboard.tsx]
        ChatInterface[ChatInterface.tsx]
        ResearchPanel[ResearchPanel.tsx]
        ReportViewer[ReportViewer.tsx]
        AgentSelector[AgentSelector.tsx]
    end

    subgraph "Agent Service Layer"
        AgentService[AgentService.ts]
        ChatService[ChatService.ts]
        ResearchService[ResearchService.ts]
        ReportService[ReportService.ts]
    end

    subgraph "State Management"
        AgentStore[Agent Zustand Store]
        ChatStore[Chat Zustand Store]
        ResearchStore[Research Zustand Store]
    end

    subgraph "UI Components"
        ChatMessages[ChatMessages.tsx]
        AgentStatus[AgentStatus.tsx]
        ResearchResults[ResearchResults.tsx]
        ReportDiagrams[ReportDiagrams.tsx]
        LoadingSpinner[LoadingSpinner.tsx]
    end

    subgraph "WebSocket Integration"
        Socket[WebSocket Client]
        SocketManager[SocketManager.tsx]
    end

    App --> Router
    Router --> Auth
    Router --> AgentDashboard
    Router --> ChatInterface
    Router --> ResearchPanel
    Router --> ReportViewer

    AgentDashboard --> AgentSelector
    AgentSelector --> AgentService

    ChatInterface --> ChatMessages
    ChatInterface --> AgentStatus
    ChatInterface --> ChatService
    ChatInterface --> Socket

    ResearchPanel --> ResearchResults
    ResearchPanel --> LoadingSpinner
    ResearchPanel --> ResearchService

    ReportViewer --> ReportDiagrams
    ReportViewer --> ReportService

    AgentService --> AgentStore
    ChatService --> ChatStore
    ResearchService --> ResearchStore

    Socket --> SocketManager
    SocketManager --> ChatStore

    API --> AgentService
    API --> ChatService
    API --> ResearchService
    API --> ReportService
```

## 8. Agent Communication Flow Patterns

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Active: User Request
    Active --> ResearchOrchestrating: Research Task
    Active --> DocumentationGenerating: Documentation Task
    Active --> ChatProcessing: Chat Interaction

    ResearchOrchestrating --> DeployingSubagents: Deploy Research Subagents
    DeployingSubagents --> ExecutingResearch: Parallel Execution
    ExecutingResearch --> SynthesizingResults: Collect Results
    SynthesizingResults --> AnalysisComplete: Ultra Thinking
    AnalysisComplete --> Active: Research Complete

    DocumentationGenerating --> DeployingWriters: Deploy Documentation Subagents
    DeployingWriters --> GeneratingContent: Parallel Generation
    GeneratingContent --> AssemblingReport: Combine Content
    AssemblingReport --> QualityReview: Validate Quality
    QualityReview --> Active: Documentation Complete

    ChatProcessing --> IntentAnalysis: Analyze User Intent
    IntentAnalysis --> AgentRouting: Route to Agent
    AgentRouting --> ProcessingRequest: Handle Request
    ProcessingRequest --> GeneratingResponse: Create Response
    GeneratingResponse --> Active: Response Complete

    Active --> [*]: Task Complete
    Active --> ErrorHandling: Error Occurred
    ErrorHandling --> Active: Error Resolved
```

## 9. Performance & Scalability Architecture

```mermaid
graph LR
    subgraph "Current Architecture (MVP)"
        A1[100 Users]
        B1[Basic Agents]
        C1[Single Database]
        D1[$4.90/month]
    end

    subgraph "Phase 2 Architecture"
        A2[1,000 Users]
        B2[Enhanced Agents]
        C2[Read Replicas]
        D2[$25-50/month]
    end

    subgraph "Phase 3 Architecture"
        A3[10,000+ Users]
        B3[Enterprise Agents]
        C3[Microservices]
        D3[$100-500/month]
    end

    subgraph "Scaling Components"
        S1[Horizontal Scaling]
        S2[Load Balancing]
        S3[Caching Layer]
        S4[Database Sharding]
        S5[Message Queue]
    end

    A1 --> A2
    A2 --> A3
    B1 --> B2
    B2 --> B3
    C1 --> C2
    C2 --> C3
    D1 --> D2
    D2 --> D3

    A2 --> S1
    A3 --> S2
    B2 --> S3
    B3 --> S4
    C3 --> S5
```

## 10. Security Architecture for Agent System

```mermaid
graph TB
    subgraph "Security Boundaries"
        UserBoundary[User Security Boundary]
        AgentBoundary[Agent Security Boundary]
        SystemBoundary[System Security Boundary]
    end

    subgraph "Authentication & Authorization"
        OAuth[OAuth2 Provider]
        JWT[JWT Token Validation]
        RBAC[Role-Based Access Control]
        AgentAuth[Agent Authentication]
    end

    subgraph "Data Protection"
        Encryption[Data Encryption]
        Masking[Data Masking]
        Audit[Audit Logging]
        Compliance[GDPR Compliance]
    end

    subgraph "Network Security"
        Firewall[Web Application Firewall]
        HTTPS[TLS/SSL Encryption]
        RateLimit[Rate Limiting]
        DDoS[DDoS Protection]
    end

    subgraph "Agent Security"
        Sandbox[Agent Sandbox]
        Validation[Input Validation]
        Monitoring[Agent Monitoring]
        Scanning[Vulnerability Scanning]
    end

    UserBoundary --> OAuth
    UserBoundary --> JWT
    UserBoundary --> RBAC

    AgentBoundary --> AgentAuth
    AgentBoundary --> Sandbox
    AgentBoundary --> Validation

    SystemBoundary --> Encryption
    SystemBoundary --> Audit
    SystemBoundary --> Firewall
    SystemBoundary --> HTTPS

    AgentBoundary --> Monitoring
    SystemBoundary --> RateLimit
    SystemBoundary --> DDoS
    SystemBoundary --> Scanning

    Encryption --> Compliance
    Audit --> Compliance
```

## Summary

These diagrams provide a comprehensive visual representation of the UrbanAI agent architecture, covering:

1. **High-level system architecture** with custom agents integration into the existing Clean Architecture
2. **Research and Reporter agent workflows** showing parallel execution and MCP service integration
3. **Subagent interaction patterns** demonstrating the network of specialized agents
4. **AI chat integration** with real-time communication and context management
5. **Database schema extensions** for storing agent data, research results, and documentation
6. **Frontend integration patterns** showing how to extend the existing React application
7. **Communication flow patterns** for agent orchestration and task execution
8. **Performance and scalability** architecture from MVP to enterprise scale
9. **Security architecture** for protecting agent interactions and data

The architecture maintains Clean Architecture principles while introducing a sophisticated agent system that enhances the platform's capabilities for urban issue reporting and resolution.