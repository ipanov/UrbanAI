"""
UrbanAI Wiki Management MCP Server Launcher
This script sets up and launches the Azure DevOps MCP server
for wiki page management in the UrbanAI project.
"""

import os
import sys
import json
try:
    from dotenv import load_dotenv
except ImportError:
    print("dotenv package not found. Installing...")
    from subprocess import check_call
    check_call([sys.executable, "-m", "pip", "install", "python-dotenv"])
    from dotenv import load_dotenv

try:
    import requests
except ImportError:
    print("requests package not found. Installing...")
    from subprocess import check_call
    check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

# Import our template processor functions
from template_processor import (
    test_connection, get_wikis, get_wiki_pages,
    create_wiki_page, create_wiki_page_from_template,
    delete_wiki_page, get_available_templates
)

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    # Check for required environment variables
    required_vars = ["AZURE_DEVOPS_PAT", "AZURE_DEVOPS_ORGANIZATION_URL"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: Missing required environment variables: {', '.join(missing_vars)}")
        print("Please update the .env file with your Azure DevOps credentials")
        sys.exit(1)
    
    # Test connection before starting server
    connection_status = test_connection()
    if connection_status.get("status") != "success":
        print("Error connecting to Azure DevOps:")
        print(json.dumps(connection_status, indent=2))
        sys.exit(1)
    
    print(f"Successfully connected to Azure DevOps organization: {connection_status['organization']}")
    print(f"Found {connection_status['wikis']} wikis: {', '.join(connection_status['wiki_names'])}")
    
    # Create the MCP server
    print("Starting Azure DevOps MCP Server for UrbanAI Wiki Management...")
    
    try:
        # Get the base server
        server = create_server()
        
        # Add custom wiki management tools
        server.tool(
            name="list_wiki_templates",
            description="List available wiki page templates",
            function=get_available_templates
        )
        
        server.tool(
            name="get_wikis",
            description="Get all wikis in a project",
            function=lambda project_name=None: get_wikis(project_name)
        )
        
        server.tool(
            name="get_wiki_pages",
            description="Get all pages in a wiki",
            function=lambda project_name=None, wiki_id=None: get_wiki_pages(project_name, wiki_id)
        )
        
        server.tool(
            name="create_wiki_page_from_template",
            description="Create a wiki page using a template",
            function=lambda project_name, wiki_id, path, template_name, replacements, comment=None: 
                create_wiki_page_from_template(project_name, wiki_id, path, template_name, replacements, comment)
        )
        
        server.tool(
            name="create_wiki_page",
            description="Create or update a wiki page",
            function=lambda project_name, wiki_id, path, content, comment=None: 
                create_wiki_page(project_name, wiki_id, path, content, comment)
        )
        
        server.tool(
            name="delete_wiki_page",
            description="Delete a wiki page",
            function=lambda project_name, wiki_id, path, comment=None: 
                delete_wiki_page(project_name, wiki_id, path, comment)
        )
        
        # Run the server
        server.run(port=7001)  # You can change this port if needed
        
    except Exception as e:
        print(f"Error starting MCP server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
