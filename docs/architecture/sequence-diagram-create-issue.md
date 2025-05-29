sequenceDiagram
    participant Client
    participant API as UrbanAI.API
    participant App as UrbanAI.Application
    participant Infra as UrbanAI.Infrastructure
    participant DB as SQL Database
    participant NoSQL

    Client->>API: POST /v1/issues (IssueDto)
    API->>App: HandleCreateIssueCommand(command)
    App->>Domain: Validate Issue data
    Domain-->>App: Validation Result
    alt if valid
        App->>Infra: SaveIssue(issueEntity)
        Infra->>DB: INSERT INTO Issues (...)
        DB-->>Infra: Issue ID
        Infra-->>App: Issue ID
        App->>Infra: ProcessImageData(imageData)
        Infra->>NoSQL: INSERT INTO ImageClassificationResults (...)
        NoSQL-->>Infra: Result ID
        Infra-->>App: Result ID
        App-->>API: IssueDto (created)
        API-->>Client: 201 Created (IssueDto)
    else if invalid
        App-->>API: Validation Errors
        API-->>Client: 400 Bad Request (Errors)
    end
