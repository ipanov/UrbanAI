"""Quick script to update UrbanAI project description in Azure DevOps Wiki."""

import asyncio
import os
from dotenv import load_dotenv
from wiki_mcp.client import AzureDevOpsWikiClient
from wiki_mcp.models import WikiConfiguration, WikiPageContent, WikiPageMetadata

# Load environment variables
load_dotenv()

async def update_urbanai_description():
    """Update the UrbanAI project description in the wiki."""
    
    # Get Azure DevOps credentials from environment or prompt
    pat = os.getenv('AZURE_DEVOPS_PAT')
    if not pat:
        pat = input("Enter your Azure DevOps Personal Access Token: ")
    
    # Configuration for UrbanAI wiki
    config = WikiConfiguration(
        organization_url="https://dev.azure.com/urban-ai",
        project="UrbanAI",
        wiki_id="UrbanAI.wiki"
    )
      # Create client
    client = AzureDevOpsWikiClient(config=config, personal_access_token=pat)
    
    try:
        # Get current home page
        print("Fetching current home page...")
        current_page = await client.get_page("/Home")
        print(f"Current page content: {current_page.get('content', '')[:200]}...")
        
        # Correct UrbanAI description based on actual project purpose
        correct_content = """# UrbanAI Documentation

Welcome to the UrbanAI documentation! This wiki contains comprehensive information about the UrbanAI project.

## Project Overview

UrbanAI is a sophisticated urban planning and analysis platform that leverages artificial intelligence to help city planners and developers make data-driven decisions. The platform combines advanced AI algorithms with comprehensive urban data analysis to provide insights for sustainable urban development.

### Key Features

• **AI-powered urban analysis** - Advanced machine learning algorithms for urban pattern recognition and analysis
• **Real-time data processing** - Processing of urban data streams for immediate insights
• **Interactive visualization** - Comprehensive mapping and visualization tools for urban planning
• **Comprehensive reporting** - Detailed analytics and reporting for urban development decisions
• **Integration with city planning tools** - Seamless integration with existing urban planning workflows
• **Predictive modeling** - AI-driven predictions for urban growth and development patterns

### Technology Stack

- **Backend**: .NET 9 with Clean Architecture
- **AI/ML**: Python-based machine learning models
- **Database**: SQL Server with Entity Framework Core
- **Frontend**: Modern web technologies for interactive dashboards
- **Cloud**: Azure DevOps with CI/CD pipelines

## Getting Started

1. [Setup Development Environment](./Development/Setup-Development-Environment)
2. [Architecture Overview](./Architecture/Architecture-Overview) 
3. [API Documentation](./API/API-Documentation)

## Git Branching Strategy

Following Azure DevOps best practices:

- **main** - Production-ready code (default branch)
- **develop** - Integration branch for features
- **feature/** - Feature development branches (e.g., feature/ai-model-integration)
- **release/** - Release preparation branches
- **hotfix/** - Critical production fixes

## Contributing

Please refer to our [Development Guide](./Development/Development-Guide) for contribution guidelines and coding standards.

---
*Last updated: 2025-06-19*

## Comments

Add your comments and questions about the UrbanAI project below.
"""

        # Create updated page content
        metadata = WikiPageMetadata(
            path="/Home",
            title="UrbanAI Documentation"
        )
        
        updated_content = WikiPageContent(
            content=correct_content,
            metadata=metadata
        )
        
        # Update the page
        print("Updating home page with correct description...")
        result = await client.update_page(updated_content)
        print(f"Update successful! Page ID: {result.get('id')}")
        
        # Also create/update Git branching guide
        branching_guide_content = """# Git Branching Strategy

## Azure DevOps Git Best Practices

Based on Microsoft's recommendations and industry standards, UrbanAI follows this branching strategy:

### Main Branches

- **main** - The default branch containing production-ready code
- **develop** - Integration branch where features are merged for testing

### Supporting Branches

- **feature/[feature-name]** - For developing new features
  - Branch from: `develop`
  - Merge to: `develop`
  - Examples: `feature/ai-urban-analysis`, `feature/dashboard-ui`

- **release/[version]** - For preparing releases
  - Branch from: `develop`
  - Merge to: `main` and `develop`
  - Examples: `release/1.0.0`, `release/1.1.0`

- **hotfix/[fix-name]** - For critical production fixes
  - Branch from: `main`
  - Merge to: `main` and `develop`
  - Examples: `hotfix/security-patch`, `hotfix/critical-bug`

### Branch Protection Rules

- **main** and **develop** branches have pull request policies
- Require code reviews before merging
- Require successful build validation
- No direct commits allowed

### Naming Conventions

- Use lowercase with hyphens: `feature/user-authentication`
- Be descriptive but concise
- Include ticket numbers when applicable: `feature/123-ai-model-integration`

### Migration Note

⚠️ **Important**: Microsoft and the industry have moved from `master` to `main` as the default branch name. If you have existing repositories using `master`, consider renaming to `main` for consistency with modern standards.

## Azure DevOps Setup

1. Set branch policies on `main` and `develop`
2. Configure build validation
3. Enable automatic merging for successful builds
4. Set up branch security with appropriate permissions
"""

        branching_metadata = WikiPageMetadata(
            path="/Development/Git-Branching-Strategy",
            title="Git Branching Strategy"
        )
        
        branching_page = WikiPageContent(
            content=branching_guide_content,
            metadata=branching_metadata
        )
        
        print("Creating/updating Git branching strategy page...")
        try:
            await client.update_page(branching_page)
            print("Git branching strategy page updated!")
        except Exception as e:
            # Try creating if update fails
            print(f"Update failed, trying to create new page: {e}")
            await client.create_page(branching_page)
            print("Git branching strategy page created!")
            
    except Exception as e:
        print(f"Error: {e}")
        print("Please make sure your PAT token has wiki read/write permissions")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(update_urbanai_description())
