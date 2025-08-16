# UrbanAI Backend Sequence Diagram: Create Issue

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant Func as Azure Functions
    participant App as UrbanAI.Application
    participant Infra as UrbanAI.Infrastructure
    participant DB as Relational Database
    participant Mongo as MongoDB
    participant AI as AI Agent

    U->>F: Report Issue (photo + location)
    F->>Func: POST /api/issues (CreateIssueRequestDto)
    Func->>App: CreateIssueAsync(requestDto)
    App->>Infra: AddIssueAsync(issueEntity)
    Infra->>DB: INSERT INTO Issues (...)
    DB-->>Infra: Issue created (with ID)
    Infra-->>App: Created Issue Entity
    App->>Infra: Store Photo (Blob)
    Infra->>Mongo: Save Photo
    Mongo-->>Infra: Photo URL
    Infra-->>App: Photo URL
    App->>AI: Analyze Image (Photo URL)
    AI-->>App: Analysis Results
    App->>Infra: Update Issue (Regulations)
    Infra->>Mongo: Update Issue Regulations
    Mongo-->>Infra: Update Confirmation
    Infra-->>App: Updated Issue
    App->>Domain: Map Entity to DTO
    App-->>Func: CreateIssueResponseDto
    Func-->>F: 201 Created (CreateIssueResponseDto)
    F->>U: Display Success + Regulations
```

**Explanation:**

1. **User** reports an issue through the **Frontend** application
2. **Frontend** sends POST request to Azure **Functions** endpoint
3. **Functions** HTTP trigger calls **Application** layer's `CreateIssueAsync` method
4. **Application** layer calls **Infrastructure** to add issue to **Database**
5. **Database** confirms issue creation and returns generated ID
6. **Infrastructure** stores photo in **MongoDB** and gets photo URL
7. **Application** sends photo to **AI Agent** for analysis
8. **AI Agent** returns analysis results with applicable regulations
9. **Application** updates issue with regulations via **Infrastructure**
10. **Infrastructure** updates **MongoDB** with regulation data
11. **Application** maps final entity to response DTO
12. **Functions** returns 201 Created response to **Frontend**
13. **Frontend** displays success message with regulations to **User**
