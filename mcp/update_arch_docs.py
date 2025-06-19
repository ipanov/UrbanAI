import os
import base64
import requests
import yaml
from dotenv import load_dotenv
from datetime import datetime

# Force output buffering
import sys
sys.stdout.reconfigure(line_buffering=True)

# Load environment variables
print("Loading environment variables...", flush=True)
load_dotenv()

# Azure DevOps configuration
PAT = os.getenv('AZURE_DEVOPS_PAT')
ORG_URL = os.getenv('AZURE_DEVOPS_ORGANIZATION_URL')
PROJECT = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')

print(f"PAT available: {bool(PAT)}")
print(f"Organization URL: {ORG_URL}")
print(f"Project: {PROJECT}")

def get_headers():
    """Get authorization headers"""
    encoded_pat = base64.b64encode(f":{PAT}".encode()).decode()
    return {
        "Authorization": f"Basic {encoded_pat}",
        "Content-Type": "application/json"
    }

print("Getting wiki ID...")
wiki_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis?api-version=7.0"
response = requests.get(wiki_url, headers=get_headers())

if response.status_code == 200:
    wikis = response.json().get('value', [])
    if wikis:
        wiki_id = wikis[0]['id']
        print(f"Found wiki ID: {wiki_id}")
        
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
        
        print("Creating enhanced architecture documentation...")
        
        # Enhanced architecture content
        content = f"""# Architecture Overview

## System Architecture

UrbanAI follows a modern, microservices-based architecture designed for scalability, maintainability, and extensibility.

## Component Diagram

```mermaid
{component_diagram}
```

### Component Details

#### 1. UrbanAI.API
- RESTful API layer
- Handles HTTP requests and responses
- Implements authentication and authorization
- Manages API versioning

#### 2. UrbanAI.Application
- Implements application business logic
- Handles command and query processing (CQRS)
- Manages data transformation (DTOs)
- Implements validation rules

#### 3. UrbanAI.Domain
- Contains core business logic
- Defines domain entities and value objects
- Implements domain services
- Defines interfaces for repositories

#### 4. UrbanAI.Infrastructure
- Implements data access layer
- Manages database connections
- Implements repositories
- Handles external service integration

## Sequence Diagrams

### Create Issue Flow

```mermaid
{sequence_diagram}
```

## Technology Stack

### Backend
- **.NET Core 9.0**
- **Entity Framework Core**
- **MediatR**
- **FluentValidation**
- **AutoMapper**
- **Serilog**

### Infrastructure
- **Azure App Service**
- **Azure SQL Database**
- **Azure Cache for Redis**
- **Azure Service Bus**
- **Azure Key Vault**

---
*Last updated: {datetime.now().strftime('%Y-%m-%d')}*"""

        # Create or update the page
        page_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path=/Architecture/Overview&api-version=7.0"
        
        response = requests.put(
            page_url,
            headers=get_headers(),
            json={"content": content},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        if response.status_code not in [200, 201]:
            print(f"Response Body: {response.text}")
        else:
            print("✨ Documentation updated successfully!")
    else:
        print("No wikis found")
else:
    print(f"Failed to get wikis: {response.status_code}")
