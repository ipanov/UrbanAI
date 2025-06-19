#!/usr/bin/env python3
"""
Script to delete a specific page
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

async def delete_page(page_path):
    """Delete a specific page"""
    
    config = WikiConfiguration(
        organization_url=os.getenv("AZURE_DEVOPS_ORG_URL"),
        project=os.getenv("AZURE_DEVOPS_PROJECT"),
        wiki_id="11370c99-432d-416b-99b7-54390f99cec1"  # Actual GUID
    )
    
    pat = os.getenv("AZURE_DEVOPS_PAT")
    client = AzureDevOpsWikiClient(config, pat)
    
    try:
        print(f"Attempting to delete page: {page_path}")
        result = await client.delete_page(page_path)
        if result.success:
            print(f"✅ Successfully deleted page: {page_path}")
        else:
            print(f"❌ Failed to delete page {page_path}: {result.message}")
    except Exception as e:
        print(f"❌ Error deleting page {page_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python delete_page.py <page_path>")
        print("Example: python delete_page.py '/API'")
    else:
        page_path = sys.argv[1]
        asyncio.run(delete_page(page_path))
