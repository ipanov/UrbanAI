#!/usr/bin/env python3
"""
Simple page creator with debug output
"""

import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add the src directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from wiki_mcp.client import AzureDevOpsWikiClient
from wiki_mcp.models import WikiConfiguration, WikiPageContent, WikiPageMetadata

# Load environment variables
load_dotenv()

async def create_home_page():
    print("=== Creating Home Page ===")
    
    # Load configuration
    config = WikiConfiguration(
        organization_url=os.getenv("AZURE_DEVOPS_ORG_URL"),
        project=os.getenv("AZURE_DEVOPS_PROJECT"),
        wiki_id=os.getenv("AZURE_DEVOPS_WIKI_ID")
    )
    pat = os.getenv("AZURE_DEVOPS_PAT")
    
    print(f"Wiki ID: {config.wiki_id}")
    
    client = AzureDevOpsWikiClient(config, pat)
    
    try:
        # Read the home content
        home_file = "content/home.md"
        if not os.path.exists(home_file):
            print(f"❌ Content file not found: {home_file}")
            return
            
        with open(home_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"Content length: {len(content)} characters")
        
        # Create page content
        page_content = WikiPageContent(
            content=content,
            metadata=WikiPageMetadata(
                path="/Home",
                title="Home"
            )
        )
        
        print("Creating page...")
        result = await client.create_page(page_content)
        
        if result.success:
            print("✅ Home page created successfully!")
        else:
            print(f"❌ Failed to create page: {result.message}")
            print(f"Error code: {result.error_code}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(create_home_page())
