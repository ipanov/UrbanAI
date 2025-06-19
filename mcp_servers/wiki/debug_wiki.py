#!/usr/bin/env python3
"""Debug script to check wiki connection and pages"""

import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add the src directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from wiki_mcp.client import AzureDevOpsWikiClient
from wiki_mcp.models import WikiConfiguration

# Load environment variables
load_dotenv()

async def debug_wiki():
    """Debug wiki connection and pages"""
    
    config = WikiConfiguration(
        organization_url=os.getenv("AZURE_DEVOPS_ORG_URL"),
        project=os.getenv("AZURE_DEVOPS_PROJECT"),
        wiki_id=os.getenv("AZURE_DEVOPS_WIKI_ID")
    )
    
    pat = os.getenv("AZURE_DEVOPS_PAT")
    client = AzureDevOpsWikiClient(config, pat)
    
    print("Debug: Testing wiki connection...")
    print(f"  Organization: {config.organization_url}")
    print(f"  Project: {config.project}")
    print(f"  Wiki ID: {config.wiki_id}")
    
    # Test 1: Get wikis
    try:
        wikis = await client.get_wikis()
        print(f"\n✅ Found {len(wikis)} wiki(s):")
        for wiki in wikis:
            print(f"  - {wiki}")
    except Exception as e:
        print(f"\n❌ Error getting wikis: {e}")
    
    # Test 2: Get wiki ID
    try:
        wiki_id = await client.get_wiki_id()
        print(f"\n✅ Wiki ID from API: {wiki_id}")
    except Exception as e:
        print(f"\n❌ Error getting wiki ID: {e}")
    
    # Test 3: Get Home page
    try:
        home_page = await client.get_page("/Home")
        if home_page:
            print(f"\n✅ Home page found: {home_page.metadata.path}")
            print(f"  Title: {home_page.metadata.title}")
            print(f"  Content length: {len(home_page.content)} chars")
        else:
            print("\n❌ Home page not found")
    except Exception as e:
        print(f"\n❌ Error getting Home page: {e}")
    
    # Test 4: List pages
    try:
        pages = await client.list_pages()
        print(f"\n✅ Found {len(pages)} page(s):")
        for page in pages:
            print(f"  - {page.path} (ID: {page.id})")
    except Exception as e:
        print(f"\n❌ Error listing pages: {e}")

if __name__ == "__main__":
    asyncio.run(debug_wiki())
