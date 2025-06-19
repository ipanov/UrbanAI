import os
import base64
import requests
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Azure DevOps configuration
PAT = os.getenv('AZURE_DEVOPS_PAT')
ORG_URL = os.getenv('AZURE_DEVOPS_ORGANIZATION_URL')
PROJECT = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')

def create_wiki_page():
    """Create a test wiki page"""
    print("Starting wiki page creation test...")
    
    # Get wikis first
    wiki_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis?api-version=7.0"
    headers = {
        "Authorization": f"Basic {base64.b64encode(f':{PAT}'.encode()).decode()}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(wiki_url, headers=headers, timeout=10)
    
    if response.status_code != 200:
        print(f"Failed to get wikis: {response.status_code}")
        return False
    
    wikis = response.json().get('value', [])
    if not wikis:
        print("No wikis found")
        return False
    
    wiki_id = wikis[0]['id']
    wiki_name = wikis[0]['name']
    print(f"Using wiki: {wiki_name} (ID: {wiki_id})")
    
    # Create a test page
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    page_path = f"/TestPage_{timestamp}"
    
    # Content for the test page
    content = f"""# Test Page {timestamp}

This is a test page created via Azure DevOps REST API.

## Details
- Created: {datetime.now().isoformat()}
- Wiki: {wiki_name}
- Project: {PROJECT}

## Test Content
This page was created to test the Azure DevOps Wiki API integration.
"""

    # Create the page using PUT request
    page_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path={page_path}&api-version=7.0"
      print(f"Creating page at path: {page_path}")
    try:
        # Use JSON content type for page creation
        create_headers = {
            "Authorization": f"Basic {base64.b64encode(f':{PAT}'.encode()).decode()}",
            "Content-Type": "application/json"
        }
        
        # Prepare JSON payload for page creation
        page_data = {
            "content": content
        }
        
        response = requests.put(
            page_url,
            headers=create_headers,
            json=page_data,
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ Page created successfully!")
            return True
        else:
            print(f"❌ Failed to create page: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Exception during page creation: {e}")
        return False

if __name__ == "__main__":
    success = create_wiki_page()
    if success:
        print("\n🎉 Test completed successfully!")
    else:
        print("\n💥 Test failed!")
