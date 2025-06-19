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

def create_test_page():
    print("Starting wiki page creation test...")
    
    # Test environment variables
    if not all([PAT, ORG_URL, PROJECT]):
        print("Missing required environment variables!")
        print(f"PAT: {'✓' if PAT else '✗'}")
        print(f"ORG_URL: {'✓' if ORG_URL else '✗'}")
        print(f"PROJECT: {'✓' if PROJECT else '✗'}")
        return False
    
    # Get wikis first
    wiki_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis?api-version=7.0"
    auth = base64.b64encode(f":{PAT}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/json"
    }
    
    try:
        print("Getting wikis...")
        response = requests.get(wiki_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        wikis = response.json().get('value', [])
        if not wikis:
            print("No wikis found")
            return False
        
        wiki_id = wikis[0]['id']
        wiki_name = wikis[0]['name']
        print(f"Using wiki: {wiki_name} (ID: {wiki_id})")
        
        # Create test page content
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        page_path = f"/TestPage_{timestamp}"
        content = {
            "content": f"""# Test Page {timestamp}

This is a test page created via Azure DevOps REST API.

## Details
- Created: {datetime.now().isoformat()}
- Wiki: {wiki_name}
- Project: {PROJECT}

## Test Content
This page was created to test the Azure DevOps Wiki API integration."""
        }
        
        # Create the page
        print(f"\nCreating page at path: {page_path}")
        page_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path={page_path}&api-version=7.0"
        
        response = requests.put(page_url, headers=headers, json=content, timeout=30)
        print(f"Response Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ Page created successfully!")
            result = response.json()
            print(f"Page URL: {result.get('remoteUrl', 'N/A')}")
            return True
        else:
            print(f"❌ Failed to create page: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = create_test_page()
    if success:
        print("\n🎉 Test completed successfully!")
    else:
        print("\n💥 Test failed!")
