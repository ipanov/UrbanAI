"""
Create the component and sequence diagram wiki pages
"""

import os
from template_processor import create_wiki_page, get_wikis

def create_diagram_pages():
    """Create the diagram documentation pages"""
    
    # Get the wiki ID
    wikis = get_wikis()
    if not wikis:
        print("No wikis found!")
        return
    
    wiki_id = wikis[0]["id"]
    project_name = os.getenv("AZURE_DEVOPS_DEFAULT_PROJECT", "UrbanAI")

    # Component Diagram
    component_diagram = """# UrbanAI Component Diagram

The UrbanAI system follows a clean architecture pattern with clear separation of concerns. Below is the high-level component diagram showing the main system components and their interactions.

```mermaid
graph TD
    User --> UrbanAI.API
    UrbanAI.API --> UrbanAI.Application
    UrbanAI.Application --> UrbanAI.Domain
    UrbanAI.Application --> UrbanAI.Infrastructure
    UrbanAI.Infrastructure --> Database(SQL Database)
    UrbanAI.Infrastructure --> NoSQLDB(NoSQL Database)
    UrbanAI.Infrastructure --> ExternalServices(External Services / AI Agent)
```

## Component Descriptions

### UrbanAI.API
- REST API endpoints
- Authentication & Authorization
- Request/Response handling
- API documentation (Swagger/OpenAPI)

### UrbanAI.Application
- Business logic implementation
- Use case handlers
- DTOs and mappings
- Command/Query handlers (CQRS)

### UrbanAI.Domain
- Core business rules
- Domain entities
- Value objects
- Domain events

### UrbanAI.Infrastructure
- Data access implementation
- External service integration
- File storage
- Caching
- Message queuing

### Databases
- SQL Database: Relational data (issues, users, etc.)
- NoSQL Database: Unstructured data (images, AI analysis results)

### External Services
- AI Agent for image classification
- Text analysis services
- Regulatory document crawling
"""
    
    print("Creating Component Diagram page...")
    create_wiki_page(
        project_name=project_name,
        wiki_id=wiki_id,
        path="/Component_Diagram",
        content=component_diagram,
        comment="Added component diagram documentation"
    )

    # Sequence Diagram
    sequence_diagram = """# Issue Creation Sequence Diagram

Below is the sequence diagram showing the flow of creating a new urban issue in the system.

```mermaid
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
```

## Process Description

1. Client submits a new issue through the API
2. API controller receives the request and creates a command
3. Application layer validates the issue data
4. If valid:
   - Issue is saved to SQL database
   - Image data is processed and results stored in NoSQL
   - Success response returned to client
5. If invalid:
   - Validation errors returned to client

## Error Handling
- Input validation errors return 400 Bad Request
- Server errors return 500 Internal Server Error
- Detailed error information logged for debugging"""

    print("Creating Sequence Diagram page...")
    create_wiki_page(
        project_name=project_name,
        wiki_id=wiki_id,
        path="/Sequence_Diagram",
        content=sequence_diagram,
        comment="Added sequence diagram documentation"
    )

    print("Diagram pages created successfully!")

if __name__ == "__main__":
    create_diagram_pages()
