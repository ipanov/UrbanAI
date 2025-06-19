import os
import base64
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Azure DevOps configuration
PAT = os.getenv('AZURE_DEVOPS_PAT')
ORG_URL = os.getenv('AZURE_DEVOPS_ORGANIZATION_URL')
PROJECT = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')

print(f"PAT available: {bool(PAT)}")
print(f"Organization URL: {ORG_URL}")
print(f"Project: {PROJECT}")

if PAT:
    print(f"PAT length: {len(PAT)}")
    print(f"PAT starts with: {PAT[:10]}...")

# Test basic authentication
if PAT:
    encoded_pat = base64.b64encode(f":{PAT}".encode()).decode()
    headers = {
        "Authorization": f"Basic {encoded_pat}",
        "Content-Type": "application/json"
    }
    
    # Test connection to Azure DevOps
    try:
        wiki_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis?api-version=7.0"
        print(f"\nTesting URL: {wiki_url}")
        
        response = requests.get(wiki_url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")
        
        if response.status_code == 200:
            data = response.json()
            wikis = data.get('value', [])
            print(f"Found {len(wikis)} wikis")
            for wiki in wikis:
                print(f"  - {wiki.get('name')} (ID: {wiki.get('id')})")
        
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No PAT found in environment variables")
