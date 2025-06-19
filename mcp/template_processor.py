"""
UrbanAI Wiki Template Processor for MCP Server
This script extends the core Azure DevOps MCP server functionality
with specific wiki template processing for the UrbanAI project.
"""

import os
import datetime
import requests
import base64
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Azure DevOps configuration
ADO_PAT = os.getenv('AZURE_DEVOPS_PAT', '2alMwrLCpOSBk20TwbYIRsiYzq9cgY6W7Pj38qD5QqopUT7A8WXOJQQJ99BFACAAAAAAAAAAAAASAZDO2CTD')
ADO_ORG_URL = os.getenv('AZURE_DEVOPS_ORGANIZATION_URL', 'https://dev.azure.com/urban-ai')
ADO_PROJECT = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')

# Template directory
TEMPLATE_DIR = Path(__file__).parent / "wiki_templates"

def load_template(template_name):
    """Load a wiki template by name"""
    template_path = TEMPLATE_DIR / f"{template_name}.md"
    if not template_path.exists():
        available_templates = [f.stem for f in TEMPLATE_DIR.glob("*.md")]
        raise ValueError(f"Template '{template_name}' not found. Available templates: {', '.join(available_templates)}")
    
    with open(template_path, 'r') as f:
        return f.read()

def process_template(template_name, replacements=None):
    """Process a template with the given replacements"""
    template = load_template(template_name)
    
    # Add current date if not provided
    if replacements and "DATE" not in replacements:
        replacements["DATE"] = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Replace all placeholders
    if replacements:
        for key, value in replacements.items():
            template = template.replace(f"{{{{" + key + "}}}}", value)
    
    return template

def get_available_templates():
    """Return a list of available template names"""
    return [f.stem for f in TEMPLATE_DIR.glob("*.md")]

def get_auth_header():
    """Create authorization header with PAT"""
    if not ADO_PAT:
        raise ValueError("Azure DevOps Personal Access Token (PAT) not set")
    
    encoded_pat = base64.b64encode(f":{ADO_PAT}".encode()).decode()
    return {
        "Authorization": f"Basic {encoded_pat}",
        "Content-Type": "application/json"
    }

def get_wikis(project_name=None):
    """
    Get all wikis in a project
    
    Args:
        project_name: Azure DevOps project name (optional, uses default if not specified)
    
    Returns:
        List of wikis in the project
    """
    if not project_name:
        project_name = ADO_PROJECT
    
    url = f"{ADO_ORG_URL}/{project_name}/_apis/wiki/wikis?api-version=7.0"
    
    response = requests.get(url, headers=get_auth_header())
    if response.status_code == 200:
        return response.json()["value"]
    else:
        print(f"Error getting wikis: {response.status_code}")
        print(response.text)
        return []

def get_wiki_pages(project_name=None, wiki_id=None):
    """
    Get all pages in a wiki
    
    Args:
        project_name: Azure DevOps project name (optional, uses default if not specified)
        wiki_id: Wiki ID (optional, uses first wiki if not specified)
    
    Returns:
        List of pages in the wiki
    """
    if not project_name:
        project_name = ADO_PROJECT
    
    if not wiki_id:
        wikis = get_wikis(project_name)
        if not wikis:
            raise ValueError(f"No wikis found in project {project_name}")
        wiki_id = wikis[0]["id"]
    
    url = f"{ADO_ORG_URL}/{project_name}/_apis/wiki/wikis/{wiki_id}/pages?recursionLevel=full&api-version=7.0"
    
    response = requests.get(url, headers=get_auth_header())
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting wiki pages: {response.status_code}")
        print(response.text)
        return {}

def create_wiki_page(project_name, wiki_id, path, content, comment=None):
    """
    Create or update a wiki page
    
    Args:
        project_name: Azure DevOps project name
        wiki_id: Wiki ID
        path: Path to the wiki page (without .md extension)
        content: Content of the wiki page
        comment: Optional comment for the page update
    
    Returns:
        Created page information
    """
    url = f"{ADO_ORG_URL}/{project_name}/_apis/wiki/wikis/{wiki_id}/pages?path={path}&api-version=7.0"
    
    headers = get_auth_header()
    
    # Additional headers for wiki page creation
    if comment:
        headers["X-TFS-FedAuthRedirect"] = "Suppress"
        headers["X-TFS-WithAdditionalDetails"] = "true"
        headers["X-TFS-Comment"] = comment
    
    data = content.encode('utf-8')
    
    response = requests.put(
        url, 
        headers=headers, 
        data=data
    )
    
    if response.status_code in [200, 201]:
        return response.json()
    else:
        print(f"Error creating wiki page: {response.status_code}")
        print(response.text)
        return {}

def create_wiki_page_from_template(project_name, wiki_id, path, template_name, replacements, comment=None):
    """
    Create a new wiki page using a template
    
    Args:
        project_name: Azure DevOps project name
        wiki_id: Wiki ID
        path: Path to the wiki page (without .md extension)
        template_name: Name of the template to use
        replacements: Dictionary of replacements for the template
        comment: Optional comment for the page update
    """
    content = process_template(template_name, replacements)
    
    result = create_wiki_page(project_name, wiki_id, path, content, comment)
    
    return {
        "status": "success" if result else "failure",
        "path": path,
        "template": template_name,
        "replacements": replacements,
        "result": result
    }

def delete_wiki_page(project_name, wiki_id, path, comment=None):
    """
    Delete a wiki page
    
    Args:
        project_name: Azure DevOps project name
        wiki_id: Wiki ID
        path: Path to the wiki page (without .md extension)
        comment: Optional comment for the deletion
    
    Returns:
        True if successful
    """
    url = f"{ADO_ORG_URL}/{project_name}/_apis/wiki/wikis/{wiki_id}/pages?path={path}&api-version=7.0"
    
    headers = get_auth_header()
    
    # Additional headers for wiki page deletion
    if comment:
        headers["X-TFS-FedAuthRedirect"] = "Suppress"
        headers["X-TFS-Comment"] = comment
    
    response = requests.delete(url, headers=headers)
    
    if response.status_code == 204:
        return True
    else:
        print(f"Error deleting wiki page: {response.status_code}")
        print(response.text)
        return False

# Test connection to Azure DevOps
def test_connection():
    """Test connection to Azure DevOps"""
    try:
        wikis = get_wikis()
        if wikis:
            return {
                "status": "success",
                "organization": ADO_ORG_URL,
                "project": ADO_PROJECT,
                "wikis": len(wikis),
                "wiki_names": [wiki["name"] for wiki in wikis]
            }
        else:
            return {
                "status": "failure",
                "message": "No wikis found or access denied",
                "organization": ADO_ORG_URL,
                "project": ADO_PROJECT
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "organization": ADO_ORG_URL,
            "project": ADO_PROJECT
        }

# If run directly, test the connection
if __name__ == "__main__":
    print("Testing connection to Azure DevOps...")
    result = test_connection()
    print(json.dumps(result, indent=2))
