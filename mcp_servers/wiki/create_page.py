#!/usr/bin/env python3
"""
Single Page Wiki Update Script - Simple Version
Updates one wiki page at a time to avoid context limits
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

class SimplePageUpdater:
    def __init__(self):
        # Use the actual wiki ID from our debug output
        self.config = WikiConfiguration(
            organization_url=os.getenv("AZURE_DEVOPS_ORG_URL"),
            project=os.getenv("AZURE_DEVOPS_PROJECT"),
            wiki_id="11370c99-432d-416b-99b7-54390f99cec1"  # Actual GUID from API
        )
        self.pat = os.getenv("AZURE_DEVOPS_PAT")
        self.client = AzureDevOpsWikiClient(self.config, self.pat)
        
    async def create_page(self, path: str, content: str):
        """Create a single wiki page"""
        try:
            page_content = WikiPageContent(
                content=content,
                metadata=WikiPageMetadata(
                    path=path,
                    title=path.split('/')[-1] if path.split('/')[-1] else path
                )
            )
            
            result = await self.client.create_page(page_content)
            if result.success:
                print(f"✅ Created page: {path}")
                return True
            else:
                print(f"❌ Failed to create page {path}: {result.message}")
                return False
        except Exception as e:
            print(f"❌ Error creating page {path}: {e}")
            return False

async def main():
    if len(sys.argv) < 3:
        print("Usage: python create_page.py <path> <content_file>")
        print("Example: python create_page.py '/Architecture' 'content/architecture.md'")
        return
    
    path = sys.argv[1]
    content_file = sys.argv[2]
    
    if not os.path.exists(content_file):
        print(f"Content file not found: {content_file}")
        return
    
    with open(content_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    updater = SimplePageUpdater()
    success = await updater.create_page(path, content)
    
    if success:
        print(f"✅ Successfully created page: {path}")
    else:
        print(f"❌ Failed to create page: {path}")

if __name__ == "__main__":
    asyncio.run(main())
