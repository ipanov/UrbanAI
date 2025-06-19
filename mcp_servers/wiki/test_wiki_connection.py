#!/usr/bin/env python3
"""
Simple test script to debug wiki connection issues
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

async def test_connection():
    print("=== Wiki Connection Test ===")
    
    # Check environment variables
    org_url = os.getenv("AZURE_DEVOPS_ORG_URL")
    project = os.getenv("AZURE_DEVOPS_PROJECT")
    wiki_id = os.getenv("AZURE_DEVOPS_WIKI_ID")
    pat = os.getenv("AZURE_DEVOPS_PAT")
    
    print(f"Organization URL: {org_url}")
    print(f"Project: {project}")
    print(f"Wiki ID: {wiki_id}")
    print(f"PAT: {'SET' if pat else 'NOT SET'}")
    
    if not all([org_url, project, pat]):
        print("❌ Missing required environment variables")
        return
    
    # Create client
    config = WikiConfiguration(
        organization_url=org_url,
        project=project,
        wiki_id=wiki_id
    )
    
    client = AzureDevOpsWikiClient(config, pat)
    
    try:
        print("\n=== Testing Wiki List ===")
        wikis = await client.get_wikis()
        print(f"Found {len(wikis)} wikis:")
        for wiki in wikis:
            print(f"  - {wiki.get('name', 'Unknown')} (ID: {wiki.get('id', 'Unknown')})")
        
        print("\n=== Testing Page List ===")
        pages = await client.list_pages()
        print(f"Found {len(pages)} pages:")
        for page in pages[:5]:  # Show first 5 pages
            print(f"  - {page.path} (ID: {page.id})")
        
        if len(pages) > 5:
            print(f"  ... and {len(pages) - 5} more pages")
            
        print("\n✅ Connection test successful!")
        
    except Exception as e:
        print(f"❌ Connection test failed: {e}")
        import traceback
        print("Full error:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_connection())
