"""
Direct Azure DevOps Wiki API test
"""
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

def get_auth_header():
    """Create authorization header with PAT"""
    if not PAT:
        raise ValueError("Azure DevOps Personal Access Token (PAT) not set")
    
    encoded_pat = base64.b64encode(f":{PAT}".encode()).decode()
    return {
        "Authorization": f"Basic {encoded_pat}",
        "Content-Type": "application/json"
    }

def test_wiki_api():
    """Test the Azure DevOps Wiki API directly"""
    
    print(f"Testing connection to {ORG_URL}")
    print(f"Project: {PROJECT}")
    print(f"PAT available: {bool(PAT)}")
    
    # First, get the list of wikis
    wiki_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis?api-version=7.0"
    
    try:
        print("\nGetting wikis...")
        print(f"URL: {wiki_url}")
        response = requests.get(wiki_url, headers=get_auth_header())
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"Response body: {response.text}")
        
        if response.status_code == 200:
            wikis = response.json().get("value", [])
            if wikis:
                wiki_id = wikis[0]["id"]
                print(f"\nFound wiki with ID: {wiki_id}")
                
                # Try to create a test page
                page_url = f"{ORG_URL}/{PROJECT}/_apis/wiki/wikis/{wiki_id}/pages?path=/TestPage&api-version=7.0"
                content = "# Test Page\n\nThis is a test page."
                
                print("\nCreating test page...")
                print(f"URL: {page_url}")
                page_response = requests.put(
                    page_url,
                    headers={
                        "Authorization": get_auth_header()["Authorization"],
                        "Content-Type": "text/plain"
                    },
                    data=content.encode('utf-8')
                )
                print(f"Page creation status: {page_response.status_code}")
                print(f"Page creation response: {page_response.text}")
            else:
                print("No wikis found in project")
        else:
            print("Failed to get wikis")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Redirect output to a log file
    import sys
    with open("wiki_api_test.log", "w") as log_file:
        sys.stdout = log_file
        test_wiki_api()
    # Reset stdout
    sys.stdout = sys.__stdout__
    
    # Print the log contents
    with open("wiki_api_test.log", "r") as log_file:
        print(log_file.read())
