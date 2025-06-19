import os
import base64
import requests
import yaml
from dotenv import load_dotenv
from datetime import datetime
import json

# Load environment variables
load_dotenv()

# Azure DevOps configuration
PAT = os.getenv('AZURE_DEVOPS_PAT')
ORG_URL = os.getenv('AZURE_DEVOPS_ORGANIZATION_URL')
PROJECT = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')

def get_headers(content_type="application/json"):
    """Get authorization headers"""
    encoded_pat = base64.b64encode(f":{PAT}".encode()).decode()
    return {
        "Authorization": f"Basic {encoded_pat}",
        "Content-Type": content_type
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
    """Create a wiki page"""
    page_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path={path}&api-version=7.0"
    
    try:
        # Use JSON payload for wiki page content
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
        print(f"Response Body: {response.text}")
        
        success = response.status_code in [200, 201]
        print(f"{'✅' if success else '❌'} Created page: {path}")
        return success
        
    except Exception as e:
        print(f"❌ Error creating page {path}: {str(e)}")
        return False

def load_openapi_spec():
    """Load OpenAPI specification"""
    api_spec_path = os.path.join('..', 'docs', 'api', 'openapi.yaml')
    try:
        with open(api_spec_path, 'r') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"Warning: Could not load OpenAPI spec: {e}")
        return None

def create_home_page(wiki_id):
    """Create the home page"""
    return create_wiki_page(wiki_id, "/Home", """# UrbanAI Documentation

Welcome to the UrbanAI documentation! This wiki contains comprehensive information about the UrbanAI project, including its architecture, API documentation, and development workflows.

## Quick Links
- [Architecture Overview](./Architecture/Overview)
- [API Documentation](./API/Overview)
- [Development Guide](./Development/Guide)
- [Component Documentation](./Components/Overview)

## Project Overview
UrbanAI is a sophisticated urban planning and analysis platform that leverages artificial intelligence to help city planners and developers make data-driven decisions.

### Key Features
- AI-powered urban analysis
- Real-time data processing
- Interactive visualization
- Comprehensive reporting
- Integration with city planning tools

## Getting Started
1. [Setup Development Environment](./Development/Setup)
2. [Architecture Overview](./Architecture/Overview)
3. [API Documentation](./API/Overview)
4. [Contributing Guidelines](./Development/Contributing)

## Documentation Structure
- **Architecture/** - System architecture and design documents
- **API/** - API documentation and examples
- **Components/** - Detailed component documentation
- **Development/** - Development guides and workflows

---
*Last updated: {datetime.now().strftime('%Y-%m-%d')}*
"""
    return create_wiki_page(wiki_id, "/", content)

def create_architecture_pages(wiki_id):
    """Create architecture documentation pages"""
    # Read component diagram
    try:
        with open(os.path.join('..', 'docs', 'architecture', 'component-diagram.md'), 'r') as f:
            component_diagram = f.read()
    except:
        component_diagram = "Component diagram content unavailable"
    
    # Read sequence diagram
    try:
        with open(os.path.join('..', 'docs', 'architecture', 'sequence-diagram-create-issue.md'), 'r') as f:
            sequence_diagram = f.read()
    except:
        sequence_diagram = "Sequence diagram content unavailable"
    
    # Architecture Overview
    overview_content = f"""# Architecture Overview

## System Architecture
UrbanAI follows a modern, microservices-based architecture designed for scalability and maintainability.

### High-Level Architecture
The system is divided into the following main components:
- **UrbanAI.API** - RESTful API layer
- **UrbanAI.Application** - Application logic and services
- **UrbanAI.Domain** - Core domain models and business logic
- **UrbanAI.Infrastructure** - Data access and external services

## Component Diagram
{component_diagram}

## Sequence Diagrams
### Create Issue Flow
{sequence_diagram}

## Key Design Decisions
1. Clean Architecture pattern
2. Domain-Driven Design principles
3. CQRS pattern for data operations
4. Event-driven architecture for real-time updates

## Technology Stack
- **.NET Core** - Primary development framework
- **Entity Framework Core** - Data access
- **Azure Services** - Cloud infrastructure
- **Identity Server** - Authentication and authorization

---
*Last updated: {datetime.now().strftime('%Y-%m-%d')}*
"""
    create_wiki_page(wiki_id, "/Architecture/Overview", overview_content)

def create_api_documentation(wiki_id):
    """Create API documentation pages"""
    api_spec = load_openapi_spec()
    
    if not api_spec:
        api_content = """# API Documentation

## Overview
The UrbanAI API provides RESTful endpoints for urban planning and analysis.

### Authentication
API uses OAuth2.0 for authentication. Contact system administrator for credentials.

### Base URL
`https://api.urbanai.com/v1`

### Common Response Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Endpoints
Documentation for specific endpoints will be added soon.
"""
    else:
        # Generate API documentation from OpenAPI spec
        endpoints = []
        for path, methods in api_spec.get('paths', {}).items():
            for method, details in methods.items():
                endpoints.append(f"""### {method.upper()} {path}
{details.get('summary', '')}

**Description:** {details.get('description', 'No description available')}

**Parameters:**
{chr(10).join(['- ' + p['name'] + ': ' + p['description'] for p in details.get('parameters', [])])}

**Responses:**
{chr(10).join(['- ' + code + ': ' + resp.get('description', '') for code, resp in details.get('responses', {}).items()])}
""")
        
        api_content = f"""# API Documentation

## Overview
{api_spec.get('info', {}).get('description', 'The UrbanAI API provides RESTful endpoints for urban planning and analysis.')}

### Version
{api_spec.get('info', {}).get('version', '1.0.0')}

### Base URL
{api_spec.get('servers', [{'url': 'https://api.urbanai.com/v1'}])[0]['url']}

## Authentication
{api_spec.get('components', {}).get('securitySchemes', {}).get('oauth2', {}).get('description', 'API uses OAuth2.0 for authentication. Contact system administrator for credentials.')}

## Endpoints

{chr(10).join(endpoints)}

---
*Last updated: {datetime.now().strftime('%Y-%m-%d')}*
"""
    
    create_wiki_page(wiki_id, "/API/Overview", api_content)

def create_development_guide(wiki_id):
    """Create development guide pages"""
    content = """# Development Guide

## Getting Started

### Prerequisites
- .NET SDK 9.0 or later
- Visual Studio 2024 or later / VS Code
- SQL Server 2022 or later
- Azure CLI

### Environment Setup
1. Clone the repository
```bash
git clone https://github.com/urbanai/urbanai.git
cd urbanai
```

2. Install dependencies
```bash
dotnet restore
```

3. Set up the database
```bash
dotnet ef database update
```

4. Start the application
```bash
dotnet run --project src/UrbanAI.API
```

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `release/*` - Release branches

### Code Style
- Follow Microsoft's C# coding conventions
- Use async/await for asynchronous operations
- Implement proper exception handling
- Write unit tests for new features

### Testing
1. Run unit tests
```bash
dotnet test
```

2. Run integration tests
```bash
dotnet test --filter "Category=Integration"
```

### Deployment
1. Build the solution
```bash
dotnet build -c Release
```

2. Publish
```bash
dotnet publish -c Release
```

## Contributing Guidelines

### Pull Request Process
1. Create a feature branch
2. Implement changes
3. Write/update tests
4. Update documentation
5. Submit PR for review

### Code Review Guidelines
- Check code style
- Verify test coverage
- Review documentation
- Check for security issues
- Validate performance impact

---
*Last updated: {datetime.now().strftime('%Y-%m-%d')}*
"""
    create_wiki_page(wiki_id, "/Development/Guide", content)

def ensure_parent_pages(wiki_id, path):
    """Ensure all parent pages exist"""
    parts = path.strip('/').split('/')
    current_path = ""
    
    for part in parts[:-1]:  # Don't process the last part, that's our target page
        current_path += f"/{part}"
        print(f"Ensuring parent page exists: {current_path}")
        
        # Create a simple parent page if it doesn't exist
        content = {
            "content": f"# {part}\n\nParent page for {part} section."
        }
        
        response = requests.put(
            f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path={current_path}&api-version=7.0",
            headers=get_headers(),
            json=content,
            timeout=30
        )
        
        if response.status_code not in [200, 201]:
            print(f"Note: Parent page {current_path} might already exist: {response.status_code}")

def main():
    """Create all wiki pages"""
    print("Starting wiki documentation creation...")
    
    print("Checking environment variables...")
    print(f"PAT available: {bool(PAT)}")
    print(f"Organization URL: {ORG_URL}")
    print(f"Project: {PROJECT}")
    
    print("\nGetting wiki ID...")
    wiki_id = get_wiki_id()
    if not wiki_id:
        print("❌ Failed to get wiki ID")
        return
    
    print(f"Using wiki ID: {wiki_id}")
    
    # Create structure first
    page_structure = [
        "/Home",
        "/Architecture/Overview",
        "/API/Overview",
        "/Development/Guide"
    ]
    
    # Create parent folders
    for path in page_structure:
        ensure_parent_pages(wiki_id, path)
    
    # Now create all pages
    create_home_page(wiki_id)
    create_architecture_pages(wiki_id)
    create_api_documentation(wiki_id)
    create_development_guide(wiki_id)
    
    print("\n✨ Documentation creation complete!")

if __name__ == "__main__":
    main()
