"""
UrbanAI Wiki Documentation Generator
This script creates a comprehensive wiki structure for the UrbanAI project
"""

import os
from template_processor import (
    get_wikis, create_wiki_page_from_template,
    delete_wiki_page, test_connection
)

def create_wiki_documentation():
    """Create the complete wiki documentation structure"""
    
    # Test connection first
    conn_result = test_connection()
    if conn_result.get("status") != "success":
        print("Error connecting to Azure DevOps:")
        print(conn_result)
        return
    
    # Get the wiki ID
    wikis = get_wikis()
    if not wikis:
        print("No wikis found!")
        return
    
    wiki_id = wikis[0]["id"]
    project_name = os.getenv("AZURE_DEVOPS_DEFAULT_PROJECT", "UrbanAI")

    # Create Home page
    home_content = {
        "TITLE": "UrbanAI Project Documentation",
        "OVERVIEW": """UrbanAI is an intelligent urban planning and management system that leverages artificial intelligence to analyze urban data, predict trends, and provide actionable insights for city planners and policymakers.""",
        "PURPOSE": """The system aims to revolutionize how cities handle urban planning, issue reporting, and regulatory compliance through advanced AI-powered analysis and automation.""",
        "TECHNICAL_IMPLEMENTATION": """Built using .NET 9.0 with a clean architecture approach, the system consists of four main projects: API, Application, Domain, and Infrastructure. It uses both SQL and NoSQL databases for different data storage needs and integrates with external AI services.""",
        "RELATED_COMPONENTS": """- API Layer (REST API endpoints)
- Application Layer (Business logic)
- Domain Layer (Core business rules)
- Infrastructure Layer (Data access and external services)
- AI Agent (Image classification and text analysis)"""
    }
    
    print("Creating Home page...")
    create_wiki_page_from_template(
        project_name=project_name,
        wiki_id=wiki_id,
        path="/",
        template_name="feature_template",
        replacements=home_content,
        comment="Initial wiki documentation setup"
    )

    # Create Architecture page
    architecture_content = {
        "TITLE": "System Architecture",
        "OVERVIEW": """UrbanAI follows a clean architecture pattern with clear separation of concerns across multiple layers.""",
        "PURPOSE": """The architecture is designed to be maintainable, testable, and scalable, with clear boundaries between different parts of the system.""",
        "TECHNICAL_IMPLEMENTATION": """The system is divided into four main projects:

1. UrbanAI.API - REST API endpoints and controllers
2. UrbanAI.Application - Business logic and use cases
3. UrbanAI.Domain - Core business rules and entities
4. UrbanAI.Infrastructure - Data access and external service integration

Key architectural decisions:
- Clean Architecture pattern
- CQRS for command/query separation
- Repository pattern for data access
- Mediator pattern for handling commands/queries""",
        "RELATED_COMPONENTS": """See the following diagrams for more details:
- [Component Diagram](UrbanAI_Wiki_Component_Diagram)
- [Sequence Diagram - Create Issue](UrbanAI_Wiki_Sequence_Diagram)"""
    }
    
    print("Creating Architecture page...")
    create_wiki_page_from_template(
        project_name=project_name,
        wiki_id=wiki_id,
        path="/Architecture",
        template_name="feature_template",
        replacements=architecture_content,
        comment="Added architecture documentation"
    )

    # Create API Documentation page
    api_content = {
        "TITLE": "REST API Documentation",
        "ENDPOINT_NAME": "Create Issue",
        "HTTP_METHOD": "POST",
        "ENDPOINT_URL": "/v1/issues",
        "REQUEST_PARAMETERS": """| description | string | Yes | Detailed description of the urban issue |
| imageData | base64 | No | Optional image data for AI analysis |""",
        "RESPONSE_FORMAT": """{
  "id": "string",
  "description": "string",
  "status": "string",
  "createdAt": "2025-06-12T10:00:00Z"
}""",
        "EXAMPLE_REQUEST": """curl -X POST https://api.urbanai.com/v1/issues \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Pothole on Main Street",
    "imageData": "base64_encoded_image_data"
  }'""",
        "EXAMPLE_RESPONSE": """{
  "id": "issue_123",
  "description": "Pothole on Main Street",
  "status": "Open",
  "createdAt": "2025-06-12T10:00:00Z"
}""",
        "AUTHENTICATION_DETAILS": "API requires JWT bearer token for authentication",
        "ERROR_HANDLING": """Common error responses:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Insufficient permissions
- 500 Internal Server Error: Server-side error""",
        "RATE_LIMITING": "Maximum 100 requests per minute per API key"
    }
    
    print("Creating API Documentation page...")
    create_wiki_page_from_template(
        project_name=project_name,
        wiki_id=wiki_id,
        path="/API_Documentation",
        template_name="api_template",
        replacements=api_content,
        comment="Added API documentation"
    )

    print("Wiki documentation created successfully!")

if __name__ == "__main__":
    create_wiki_documentation()
