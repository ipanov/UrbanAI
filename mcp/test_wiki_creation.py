"""
Simple test script to create a single wiki page
"""
import os
import json
import requests
from template_processor import create_wiki_page, get_wikis, test_connection, get_auth_header

def test_create_page():
    # First test the connection
    print("Testing connection...")
    conn_result = test_connection()
    print("Connection test result:")
    print(json.dumps(conn_result, indent=2))

    if conn_result.get("status") != "success":
        print("\nError: Failed to connect to Azure DevOps")
        return

    # Get wiki information
    print("\nGetting wikis...")
    wikis = get_wikis()
    print("Found wikis:", json.dumps(wikis, indent=2))

    if not wikis:
        print("\nError: No wikis found")
        return

    wiki_id = wikis[0]["id"]
    project_name = os.getenv("AZURE_DEVOPS_DEFAULT_PROJECT", "UrbanAI")

    # Try to create a simple test page
    print("\nCreating test page...")
    test_content = """# Test Page

This is a test page to verify wiki creation functionality.

## Current Time
- Created on: ${DATE}

## Test Content
1. First item
2. Second item
3. Third item
"""

    result = create_wiki_page(
        project_name=project_name,
        wiki_id=wiki_id,
        path="/Test",
        content=test_content,
        comment="Test page creation"
    )

    print("\nResult of page creation:")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_create_page()
