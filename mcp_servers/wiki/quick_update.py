"""Quick script to update UrbanAI project description in Azure DevOps Wiki."""

import asyncio
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def update_urbanai_description():
    """Update the UrbanAI project description in the wiki."""
    
    print("UrbanAI Wiki Update Tool")
    print("=" * 50)
    
    # Get Azure DevOps credentials
    pat = os.getenv('AZURE_DEVOPS_PAT')
    if not pat or pat == "your_personal_access_token_here":
        print("\nYou need to provide your Azure DevOps Personal Access Token (PAT)")
        print("Go to: https://dev.azure.com/urban-ai/_usersSettings/tokens")
        print("Create a new token with 'Wiki (Read & Write)' permissions")
        print()
        pat = input("Enter your PAT token: ").strip()
        
        if not pat:
            print("No PAT token provided. Exiting.")
            return
        
        # Save to .env file
        env_path = ".env"
        with open(env_path, "r") as f:
            content = f.read()
        
        content = content.replace("AZURE_DEVOPS_PAT=your_personal_access_token_here", f"AZURE_DEVOPS_PAT={pat}")
        
        with open(env_path, "w") as f:
            f.write(content)
        
        print(f"PAT token saved to {env_path}")
    
    print("\nConnecting to Azure DevOps Wiki...")
    print("Organization: https://dev.azure.com/urban-ai")
    print("Project: UrbanAI")
    print("Wiki: UrbanAI.wiki")
    
    try:
        from wiki_mcp.client import AzureDevOpsWikiClient
        from wiki_mcp.models import WikiConfiguration, WikiPageContent, WikiPageMetadata
        
        # Configuration for UrbanAI wiki
        config = WikiConfiguration(
            organization_url="https://dev.azure.com/urban-ai",
            project="UrbanAI",
            wiki_id="UrbanAI.wiki"
        )
          # Create client
        client = AzureDevOpsWikiClient(config=config, personal_access_token=pat)
        
        print("\nFetching current home page...")
        
        try:
            current_page = await client.get_page("/Home")
            print("✓ Current page found")
            if hasattr(current_page, 'content'):
                print(f"Current content preview: {current_page.content[:100]}...")
            else:
                print("Current page content not accessible")
        except Exception as e:
            print(f"Note: Could not fetch current page: {e}")
            print("Will create new page instead.")
            current_page = None
          # Correct UrbanAI description based on authoritative project requirements
        correct_content = """# UrbanAI Documentation

Welcome to the UrbanAI documentation! This wiki contains comprehensive information about the UrbanAI project.

## Project Overview

**UrbanAI is a backend platform and AI-agent service that empowers citizens, investors, and authorities to report, analyze, and resolve urban construction and environmental issues.** The platform accepts geo-tagged photos and descriptions, classifies potential code violations, crawls local regulations, guides users via AI, generates/submits reports, and tracks cases to resolution.

### Key Features

• **Citizen-driven reporting** - Citizens can photograph and report construction/environmental issues  
• **Photo + geo-location analysis** - Intelligent classification of issues based on images and location data  
• **AI-powered regulation crawling** - Automated discovery and analysis of relevant local laws and building codes  
• **Interactive guidance** - AI agent provides chat-based assistance for additional data collection  
• **Automated report generation** - Creates properly formatted reports for municipal authorities  
• **Case tracking to resolution** - Monitors reported issues through to final resolution status  
• **Multi-stakeholder support** - Serves citizens, property investors, and municipal authorities  

### Use Cases

- **Citizens**: Report dangerous buildings, broken infrastructure, environmental violations
- **Property Investors**: Monitor construction quality, ensure building code compliance
- **Municipal Authorities**: Receive properly formatted violation reports with supporting evidence
- **Civil Engineers**: Access AI-powered analysis of construction and safety issues

### Technology Stack

- **Backend**: .NET 9 with Clean Architecture (Domain, Application, Infrastructure, WebAPI)
- **AI Agent**: Hugging Face Agent SDK for regulation crawling and image classification
- **Database**: Entity Framework Core (relational) + NoSQL (MongoDB/Cosmos) for diverse data storage
- **Image Processing**: Computer vision models for construction/environmental issue classification
- **Web Crawling**: Automated discovery of municipal regulations and building codes
- **Infrastructure**: Azure DevOps with CI/CD pipelines, GitFlow branching strategy
- **Cloud**: Azure services for scalable, secure deployment

## Quick Links

• [Architecture Overview](./Architecture/Architecture-Overview)  
• [API Documentation](./API/API-Documentation)  
• [Development Guide](./Development/Development-Guide)  

## Git Branching Strategy

Following GitFlow with modern Azure DevOps best practices:

- **main** - Production-ready code (default branch)
- **develop** - Integration branch for features  
- **feature/[name]** - Feature development branches
- **release/[version]** - Release preparation branches
- **hotfix/[name]** - Critical production fixes

*Note: Modern convention uses `main` instead of `master` as the default branch.*

## API Endpoints

Core API structure includes:

- `POST /v1/issues` - Submit new issue reports with photos and descriptions
- `GET /v1/issues/{id}` - Retrieve issue status and resolution details
- `GET /v1/issues/{id}/analysis` - Get AI analysis results and recommendations
- `POST /v1/issues/{id}/chat` - Interactive chat for additional data collection

## Getting Started

1. [Setup Development Environment](./Development/Setup-Development-Environment)
2. [Architecture Overview](./Architecture/Architecture-Overview)
3. [API Documentation](./API/API-Documentation)

## Contributing

Please refer to our [Development Guide](./Development/Development-Guide) for contribution guidelines and coding standards.

---
*Last updated: 2025-01-17*
*Project description updated with authoritative requirements from ChatGPT conversation*
"""        # Create updated page content
        metadata = WikiPageMetadata(
            path="/Home",
            title="UrbanAI Documentation"
        )
        
        updated_content = WikiPageContent(
            content=correct_content,
            metadata=metadata
        )
        
        print("\n" + "=" * 50)
        print("UPDATING WIKI WITH AUTHORITATIVE DESCRIPTION")
        print("=" * 50)
        print("New description: UrbanAI is a backend platform and AI-agent service...")
        print("Key corrections:")
        print("- Updated from generic description to citizen-driven reporting platform")
        print("- Added geo-tagged photo reporting and AI analysis capabilities")
        print("- Included regulation crawling and automated report generation")
        print("- Added multi-stakeholder support (citizens, investors, authorities)")
        print("- Updated technology stack to reflect actual architecture")        
        try:
            # Try to update the page
            if current_page:
                result = await client.update_page(updated_content)
                print("✓ Home page updated successfully!")
            else:
                result = await client.create_page(updated_content)
                print("✓ Home page created successfully!")
            
            if result.data:
                print(f"Page ID: {result.data.get('id', 'N/A')}")
                print(f"Status Code: {result.data.get('status_code', 'N/A')}")
            
            if not result.success:
                print(f"✗ Operation failed: {result.message}")
                return
                
        except Exception as e:
            print(f"✗ Failed to update home page: {e}")
            return
            
        print("\n" + "=" * 50)
        print("SUMMARY")
        print("=" * 50)
        print("✓ Connected to Azure DevOps Wiki")
        print("✓ Updated project description to reflect authoritative requirements")
        print("✓ Changed from generic AI platform to citizen-driven reporting service")
        print("✓ Added geo-tagged photo analysis and regulation crawling features")
        print("✓ Included multi-stakeholder support and case tracking")
        print("✓ Updated technology stack to match actual architecture")
        print("\nYour wiki now has the correct, authoritative UrbanAI description!")
        
    except ImportError as e:
        print(f"Error importing modules: {e}")
        print("Make sure you've installed the package: pip install -e .")
    except Exception as e:
        print(f"Error: {e}")
        print("Please check your PAT token has Wiki read/write permissions")
        print("Visit: https://dev.azure.com/urban-ai/_usersSettings/tokens")

if __name__ == "__main__":
    asyncio.run(update_urbanai_description())
