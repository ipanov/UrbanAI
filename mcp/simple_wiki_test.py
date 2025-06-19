import os
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

PAT = os.getenv('AZURE_DEVOPS_PAT')
ORG_URL = os.getenv('AZURE_DEVOPS_ORGANIZATION_URL') 
PROJECT = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')

print("Testing wiki page creation...")
print(f"PAT: {bool(PAT)}")
print(f"URL: {ORG_URL}")
print(f"Project: {PROJECT}")

# Get wiki ID
headers = {
    "Authorization": f"Basic {base64.b64encode(f':{PAT}'.encode()).decode()}",
    "Content-Type": "application/json"
}

wiki_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis?api-version=7.0"
response = requests.get(wiki_url, headers=headers)
print(f"Wiki list status: {response.status_code}")

if response.status_code == 200:
    wikis = response.json().get('value', [])
    if wikis:
        wiki_id = wikis[0]['id']
        print(f"Wiki ID: {wiki_id}")
        
        # Try to create a simple page
        page_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path=/SimpleTest&api-version=7.0"
        page_content = {"content": "# Simple Test\n\nThis is a test page."}
        
        print(f"Creating page at: {page_url}")
        create_response = requests.put(page_url, headers=headers, json=page_content)
        print(f"Create status: {create_response.status_code}")
        print(f"Create response: {create_response.text}")
        
        if create_response.status_code in [200, 201]:
            print("SUCCESS: Page created!")
        else:
            print("FAILED: Could not create page")
    else:
        print("No wikis found")
else:
    print("Failed to get wikis")
