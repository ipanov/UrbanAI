#!/usr/bin/env python3
"""
Script to get existing pages and explore what's in the wiki
"""

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

async def explore_wiki():
    """Explore what's actually in the wiki"""
    
    config = WikiConfiguration(
        organization_url=os.getenv("AZURE_DEVOPS_ORG_URL"),
        project=os.getenv("AZURE_DEVOPS_PROJECT"),
        wiki_id="11370c99-432d-416b-99b7-54390f99cec1"  # Actual GUID
    )
    
    pat = os.getenv("AZURE_DEVOPS_PAT")
    client = AzureDevOpsWikiClient(config, pat)
    
    # Try to get various pages that might exist
    test_pages = [
        "/Home",
        "/Architecture", 
        "/API",
        "/Overview",
        "/Getting-Started",
        "/Project-Overview"
    ]
    
    print("Exploring existing wiki pages...")
    print("=" * 50)
    
    for page_path in test_pages:
        try:
            page = await client.get_page(page_path)
            if page:
                print(f"✅ Found page: {page_path}")
                print(f"   Title: {page.metadata.title}")
                print(f"   Content length: {len(page.content)} chars")
                if len(page.content) > 0:
                    print(f"   Preview: {page.content[:100]}...")
                print()
            else:
                print(f"❌ Page not found: {page_path}")
        except Exception as e:
            print(f"❌ Error accessing {page_path}: {e}")
    
    # Try to delete the Architecture page to recreate it
    try:
        print("\n" + "=" * 50)
        print("Attempting to delete /Architecture page...")
        result = await client.delete_page("/Architecture")
        if result.success:
            print("✅ Successfully deleted /Architecture page")
        else:
            print(f"❌ Failed to delete /Architecture: {result.message}")
    except Exception as e:
        print(f"❌ Error deleting /Architecture: {e}")

if __name__ == "__main__":
    asyncio.run(explore_wiki())
