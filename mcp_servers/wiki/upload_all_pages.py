#!/usr/bin/env python3
"""
Bulk wiki page uploader - creates or updates all pages at once
"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from wiki_mcp.client import AzureDevOpsWikiClient
from wiki_mcp.models import WikiConfiguration, WikiPageContent, WikiPageMetadata

load_dotenv()

async def upload_all_pages():
    print("=== Uploading All Wiki Pages ===")
    
    # Configure client
    config = WikiConfiguration(
        organization_url=os.getenv("AZURE_DEVOPS_ORG_URL"),
        project=os.getenv("AZURE_DEVOPS_PROJECT"),
        wiki_id=os.getenv("AZURE_DEVOPS_WIKI_ID")
    )
    client = AzureDevOpsWikiClient(config, os.getenv("AZURE_DEVOPS_PAT"))
    
    # Define page structure
    pages = [
        {"file": "home.md", "path": "/Home", "title": "Home"},
        {"file": "architecture.md", "path": "/Architecture", "title": "Architecture"},
        {"file": "component-diagram.md", "path": "/Architecture/Component-Diagram", "title": "Component Diagram"},
        {"file": "sequence-diagrams.md", "path": "/Architecture/Sequence-Diagrams", "title": "Sequence Diagrams"},
        {"file": "api.md", "path": "/API", "title": "API Documentation"},
        {"file": "ux-design.md", "path": "/UX-Design", "title": "UX Design"}
    ]
    
    content_dir = Path("content")
    
    # Try to create each page
    for page in pages:
        file_path = content_dir / page["file"]
        if not file_path.exists():
            print(f"⚠️ Content file not found: {file_path}")
            continue
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            page_content = WikiPageContent(
                content=content,
                metadata=WikiPageMetadata(
                    path=page["path"],
                    title=page["title"]
                )
            )
            
            # Try to delete first (if exists)
            print(f"\nProcessing: {page['path']}")
            await client.delete_page(page["path"])
            
            # Create new page
            result = await client.create_page(page_content)
            if result.success:
                print(f"✅ Created {page['path']}")
            else:
                print(f"❌ Failed to create {page['path']}: {result.message}")
                # Try updating instead
                result = await client.update_page(page_content)
                if result.success:
                    print(f"✅ Updated {page['path']}")
                else:
                    print(f"❌ Failed to update {page['path']}: {result.message}")
        
        except Exception as e:
            print(f"❌ Error processing {page['path']}: {e}")

if __name__ == "__main__":
    asyncio.run(upload_all_pages())
