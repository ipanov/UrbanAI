import os
import base64
import requests
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Azure DevOps configuration
PAT = os.getenv('AZURE_DEVOPS_PAT')
ORG_URL = os.getenv('AZURE_DEVOPS_ORGANIZATION_URL')
PROJECT = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')

def get_headers():
    """Get authorization headers"""
    encoded_pat = base64.b64encode(f":{PAT}".encode()).decode()
    return {
        "Authorization": f"Basic {encoded_pat}",
        "Content-Type": "application/json"
    }

def get_wiki_id():
    """Get the wiki ID for the project"""
    wiki_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis?api-version=7.0"
    response = requests.get(wiki_url, headers=get_headers())
    
    if response.status_code == 200:
        wikis = response.json().get('value', [])
        if wikis:
            return wikis[0]['id']
    return None

def create_wiki_page(wiki_id, path, content):
    """Create or update a wiki page"""
    page_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path={path}&api-version=7.0"
    
    try:
        payload = {
            "content": content
        }
        
        response = requests.put(
            page_url,
            headers=get_headers(),
            json=payload,
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        if response.status_code not in [200, 201]:
            print(f"Response Body: {response.text}")
        
        success = response.status_code in [200, 201]
        print(f"{'✅' if success else '❌'} {'Updated' if response.status_code == 200 else 'Created'} page: {path}")
        return success
        
    except Exception as e:
        print(f"❌ Error with page {path}: {str(e)}")
        return False

def enhance_architecture_documentation(wiki_id):
    """Add diagrams and enhance architecture documentation"""
    
    # Read diagrams
    try:
        with open(os.path.join('..', 'docs', 'architecture', 'component-diagram.md'), 'r') as f:
            component_diagram = f.read().strip()
    except Exception as e:
        print(f"Warning: Could not load component diagram: {e}")
        component_diagram = "Component diagram not available"
        
    try:
        with open(os.path.join('..', 'docs', 'architecture', 'sequence-diagram-create-issue.md'), 'r') as f:
            sequence_diagram = f.read().strip()
    except Exception as e:
        print(f"Warning: Could not load sequence diagram: {e}")
        sequence_diagram = "Sequence diagram not available"
    
    # Enhanced architecture content
    content = f"""# Architecture Overview

## System Architecture

UrbanAI follows a modern, microservices-based architecture designed for scalability, maintainability, and extensibility. The system is built using Clean Architecture principles and Domain-Driven Design (DDD) patterns.

## Component Diagram

The following diagram shows the high-level components and their relationships:

```mermaid
{component_diagram}
```

### Component Details

#### 1. UrbanAI.API
- RESTful API layer
- Handles HTTP requests and responses
- Implements authentication and authorization
- Manages API versioning
- Implements rate limiting and throttling
- Handles API documentation (Swagger/OpenAPI)

#### 2. UrbanAI.Application
- Implements application business logic
- Handles command and query processing (CQRS)
- Manages data transformation (DTOs)
- Implements validation rules
- Coordinates between components
- Handles event processing

#### 3. UrbanAI.Domain
- Contains core business logic
- Defines domain entities and value objects
- Implements domain services
- Defines interfaces for repositories
- Contains business rules and validations
- Implements domain events

#### 4. UrbanAI.Infrastructure
- Implements data access layer
- Manages database connections
- Implements repositories
- Handles external service integration
- Manages caching
- Implements logging and monitoring

## Sequence Diagrams

### Create Issue Flow
The following diagram shows the sequence of operations when creating a new issue:

```mermaid
{sequence_diagram}
```

## Technical Implementation Details

### Clean Architecture
The solution follows Clean Architecture principles:
- **Independence of Frameworks**: Core business logic doesn't depend on external frameworks
- **Testability**: Business rules can be tested without UI, database, or external elements
- **Independence of UI**: The UI can change without changing the business rules
- **Independence of Database**: Business rules aren't bound to a specific database
- **Independence of External Agency**: Business rules don't know about the outside world

### Domain-Driven Design (DDD)
- **Ubiquitous Language**: Consistent terminology throughout the codebase
- **Bounded Contexts**: Clear boundaries between different parts of the system
- **Aggregates**: Encapsulation of domain logic and data
- **Value Objects**: Immutable objects that model domain concepts
- **Domain Events**: Communication between bounded contexts

### CQRS Pattern
The system implements Command Query Responsibility Segregation:
- **Commands**: Handle write operations and updates
- **Queries**: Handle read operations
- **Separate Models**: Different models for read and write operations
- **Event Sourcing**: Track all changes as a series of events

## Technology Stack

### Backend
- **.NET Core 9.0**: Primary development framework
- **Entity Framework Core**: ORM for data access
- **MediatR**: CQRS and message handling
- **FluentValidation**: Request validation
- **AutoMapper**: Object mapping
- **Serilog**: Structured logging

### Infrastructure
- **Azure App Service**: Application hosting
- **Azure SQL Database**: Primary data storage
- **Azure Cache for Redis**: Caching layer
- **Azure Service Bus**: Message queue
- **Azure Key Vault**: Secret management
- **Azure Application Insights**: Monitoring and telemetry

### Development Tools
- **Visual Studio 2024**: Primary IDE
- **Azure DevOps**: CI/CD, project management
- **Docker**: Containerization
- **Git**: Version control
- **xUnit**: Unit testing
- **Moq**: Mocking framework

## Security Implementation

### Authentication
- OAuth2.0 / OpenID Connect
- JWT token-based authentication
- Azure AD B2C integration
- Multi-factor authentication support

### Authorization
- Role-based access control (RBAC)
- Policy-based authorization
- Resource-based authorization
- Claims-based authorization

### Data Protection
- Data encryption at rest
- TLS 1.3 for data in transit
- PII data handling
- Audit logging

## Performance Considerations

### Caching Strategy
- In-memory caching
- Distributed caching
- Cache invalidation patterns
- Cache-aside pattern implementation

### Database Optimization
- Query optimization
- Indexing strategy
- Connection pooling
- Command/Query segregation

### Scalability
- Horizontal scaling capability
- Load balancing
- Auto-scaling rules
- Resource optimization

---
*Last updated: {datetime.now().strftime('%Y-%m-%d')}*
"""

    return create_wiki_page(wiki_id, "/Architecture/Overview", content)

def main():
    """Enhance wiki documentation"""
    try:
        print("Starting documentation enhancement...")
        print("Python is working...")
    
    wiki_id = get_wiki_id()
    if not wiki_id:
        print("❌ Failed to get wiki ID")
        return
    
    print(f"Using wiki ID: {wiki_id}")
    
    enhance_architecture_documentation(wiki_id)
    
    print("\n✨ Documentation enhancement complete!")

if __name__ == "__main__":
    main()
