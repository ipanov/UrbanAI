# Sequence Diagrams

This page contains sequence diagrams showing the flow of operations through the UrbanAI system.

## Create Issue Flow

This diagram shows how a new issue is created in the system, from the initial client request through all the architectural layers.

```mermaid
sequenceDiagram
    participant Client
    participant API as UrbanAI.API
    participant App as UrbanAI.Application
    participant Domain as UrbanAI.Domain
    participant Infra as UrbanAI.Infrastructure
    participant DB as Database
    participant AI as AI Agent

    Client->>API: POST /v1/issues (CreateIssueRequestDto)
    API->>App: CreateIssueAsync(requestDto)
    App->>Domain: Map DTO to Issue Entity
    Domain->>Domain: Validate Business Rules
    App->>Infra: AddIssueAsync(issueEntity)
    Infra->>DB: INSERT INTO Issues (...)
    DB-->>Infra: Issue created (with ID)
    
    alt Photo Processing Required
        App->>Infra: ProcessPhotoAsync(issueId, photoData)
        Infra->>AI: Analyze Photo & Location
        AI-->>Infra: Classification Results
        Infra->>DB: UPDATE Issues (classification)
    end
    
    Infra-->>App: Created Issue Entity
    App->>Domain: Map Entity to DTO
    App-->>API: CreateIssueResponseDto
    API-->>Client: 201 Created (CreateIssueResponseDto)
```

### Flow Description

1. **Client Request**: Client sends a POST request to `/v1/issues` with issue details
2. **API Layer**: Receives and validates the request, forwards to application layer
3. **Application Layer**: Orchestrates the business logic and coordinates between layers
4. **Domain Layer**: Validates business rules and creates the issue entity
5. **Infrastructure Layer**: Persists the issue to the database
6. **Database**: Stores the issue and returns the created record with ID
7. **Photo Processing** (if applicable): 
   - Processes uploaded photos using AI services
   - Classifies potential violations based on image and location
   - Updates the issue with classification results
8. **Response**: Returns the created issue details to the client

## Report Generation Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as UrbanAI.API
    participant App as UrbanAI.Application
    participant Infra as UrbanAI.Infrastructure
    participant AI as AI Agent
    participant DB as Database
    participant RegAPI as Regulation API

    Client->>API: POST /v1/issues/{id}/report
    API->>App: GenerateReportAsync(issueId)
    App->>Infra: GetIssueAsync(issueId)
    Infra->>DB: SELECT * FROM Issues WHERE Id = issueId
    DB-->>Infra: Issue Details
    
    App->>Infra: CrawlRegulationsAsync(issue.Location, issue.Type)
    Infra->>RegAPI: Search relevant regulations
    RegAPI-->>Infra: Regulation documents
    
    App->>AI: GenerateReportAsync(issue, regulations)
    AI-->>App: Generated report content
    
    App->>Infra: SaveReportAsync(issueId, reportContent)
    Infra->>DB: INSERT INTO Reports (...)
    DB-->>Infra: Report saved
    
    App-->>API: ReportGeneratedResponseDto
    API-->>Client: 200 OK (Report details)
```

### Report Generation Steps

1. **Request**: Client requests report generation for a specific issue
2. **Issue Retrieval**: System retrieves the full issue details from database
3. **Regulation Crawling**: System searches for relevant local regulations and building codes
4. **AI Processing**: AI agent generates a formatted report using issue details and regulations
5. **Report Storage**: Generated report is saved to the database
6. **Response**: Client receives confirmation and report details

## User Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant API as UrbanAI.API
    participant App as UrbanAI.Application
    participant AI as AI Agent
    participant DB as Database

    User->>API: GET /v1/issues/{id}/chat
    API->>App: GetChatSessionAsync(issueId)
    
    loop Interactive Chat
        User->>API: POST /v1/chat/message
        API->>App: ProcessChatMessageAsync(message)
        App->>AI: GetAIResponseAsync(context, message)
        AI-->>App: AI Response
        App->>DB: SaveChatMessage(message, response)
        App-->>API: ChatResponseDto
        API-->>User: AI Response
    end
    
    User->>API: POST /v1/issues/{id}/additional-data
    API->>App: UpdateIssueAsync(additionalData)
    App->>DB: UPDATE Issues SET ...
    DB-->>App: Updated
    App-->>API: Success
    API-->>User: 200 OK
```

## Key Patterns

### Error Handling
- Each layer handles its own errors appropriately
- Domain layer validates business rules
- Infrastructure layer handles external service failures
- API layer returns appropriate HTTP status codes

### Data Flow
- DTOs are used for API contracts
- Domain entities represent business logic
- Repository pattern abstracts data access
- Services coordinate between layers

### Asynchronous Processing
- All database operations are async
- AI processing happens asynchronously
- Photo processing can be queued for background processing

## Related Documentation

- [Component Diagram](/Architecture/Component-Diagram) - System component overview
- [API Documentation](/API) - Detailed endpoint specifications
- [Error Handling](/Architecture/Error-Handling) - Error handling strategies
