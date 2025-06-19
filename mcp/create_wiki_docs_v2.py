import os
import base64
import requests
import yaml
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
        if response.status_code not in [200, 201]:
            print(f"Response Body: {response.text}")
        
        success = response.status_code in [200, 201]
        print(f"{'✅' if success else '❌'} Created page: {path}")
        return success
        
    except Exception as e:
        print(f"❌ Error creating page {path}: {str(e)}")
        return False

def ensure_parent_pages(wiki_id, path):
    """Ensure all parent pages exist"""
    parts = path.strip('/').split('/')
    current_path = ""
    
    for part in parts[:-1]:  # Don't process the last part, that's our target page
        current_path += f"/{part}"
        print(f"Ensuring parent page exists: {current_path}")
        
        # Create a simple parent page if it doesn't exist
        content = f"# {part}\n\nParent page for {part} section."
        
        create_wiki_page(wiki_id, current_path, content)

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
    
    # Test with a simple page first
    print("\nTesting with a simple page...")
    success = create_wiki_page(wiki_id, "/TestPage", "# Test Page\n\nThis is a test page.")
    
    if not success:
        print("❌ Failed to create test page. Stopping.")
        return
        
    print("\n✅ Test page created successfully. Proceeding with documentation...")
    
    # Create structure first
    page_structure = [
        "/Architecture",
        "/API",
        "/Development"
    ]
    
    print("\nCreating section pages...")
    for path in page_structure:
        ensure_parent_pages(wiki_id, path)
        content = f"""# {path.strip('/')}

Welcome to the {path.strip('/')} section of the UrbanAI documentation.

## Contents
- [Overview]({path}/Overview)
"""
        create_wiki_page(wiki_id, path, content)
    
    # Create the actual pages
    print("\nCreating content pages...")
    
    # Home page
    home_content = f"""# UrbanAI Documentation

Welcome to the UrbanAI documentation! This wiki contains comprehensive information about the UrbanAI project.

## Quick Links
- [Architecture Overview](/Architecture/Overview)
- [API Documentation](/API/Overview)
- [Development Guide](/Development/Guide)

## Project Overview
UrbanAI is a sophisticated urban planning and analysis platform that leverages artificial intelligence to help city planners and developers make data-driven decisions.

### Key Features
- AI-powered urban analysis
- Real-time data processing
- Interactive visualization
- Comprehensive reporting
- Integration with city planning tools

## Getting Started
1. [Setup Development Environment](/Development/Setup)
2. [Architecture Overview](/Architecture/Overview)
3. [API Documentation](/API/Overview)

---
*Last updated: {datetime.now().strftime('%Y-%m-%d')}*"""

    create_wiki_page(wiki_id, "/Home", home_content)
    
    # Architecture Overview
    arch_content = """# Architecture Overview

## System Architecture
UrbanAI follows a modern, microservices-based architecture designed for scalability and maintainability.

### High-Level Architecture
The system is divided into the following main components:
- **UrbanAI.API** - RESTful API layer
- **UrbanAI.Application** - Application logic and services
- **UrbanAI.Domain** - Core domain models and business logic
- **UrbanAI.Infrastructure** - Data access and external services

## Key Design Decisions
1. Clean Architecture pattern
2. Domain-Driven Design principles
3. CQRS pattern for data operations
4. Event-driven architecture for real-time updates

## Technology Stack
- **.NET Core** - Primary development framework
- **Entity Framework Core** - Data access
- **Azure Services** - Cloud infrastructure
- **Identity Server** - Authentication and authorization"""

    create_wiki_page(wiki_id, "/Architecture/Overview", arch_content)
    
    # API Overview
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
Documentation for specific endpoints will be added soon."""

    create_wiki_page(wiki_id, "/API/Overview", api_content)
    
    # Development Guide
    dev_content = """# Development Guide

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
- Write unit tests for new features"""

    create_wiki_page(wiki_id, "/Development/Guide", dev_content)
    
    print("\n✨ Documentation creation complete!")

if __name__ == "__main__":
    main()
