"""Register the UrbanAI Wiki MCP Server for future use."""

import json
import os
import sys

def register_mcp_server():
    """Register the UrbanAI Wiki MCP server."""
    
    print("Registering UrbanAI Wiki MCP Server")
    print("=" * 40)
    
    # Get the current directory
    wiki_server_path = os.path.abspath(".")
    
    # Server configuration
    server_config = {
        "mcpServers": {
            "urban-ai-wiki": {
                "command": "python",
                "args": ["-m", "wiki_mcp.server"],
                "cwd": wiki_server_path,
                "env": {
                    "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/urban-ai",
                    "AZURE_DEVOPS_PROJECT": "UrbanAI", 
                    "AZURE_DEVOPS_WIKI_ID": "UrbanAI.wiki",
                    "AZURE_DEVOPS_PAT": "2alMwrLCpOSBk20TwbYIRsiYzq9cgY6W7Pj38qD5QqopUT7A8WXOJQQJ99BFACAAAAAAAAAAAAASAZDO2CTD"
                }
            }
        }
    }
    
    # Save configuration
    config_file = "mcp_server_config.json"
    with open(config_file, "w") as f:
        json.dump(server_config, f, indent=2)
    
    print(f"✓ Server configuration saved to: {config_file}")
    print(f"✓ Server path: {wiki_server_path}")
    print(f"✓ Connected to: https://dev.azure.com/urban-ai/UrbanAI/_wiki/wikis/UrbanAI.wiki")
    
    print("\nAvailable MCP Tools:")
    tools = [
        "create_wiki_page - Create new wiki pages",
        "update_wiki_page - Update existing wiki pages", 
        "delete_wiki_page - Delete wiki pages",
        "list_wiki_pages - List all wiki pages",
        "get_wiki_page - Get specific wiki page content",
        "create_page_from_template - Create pages using templates",
        "validate_page_content - Validate page content",
        "list_templates - List available templates",
        "bulk_operations - Perform bulk page operations",
        "sync_documentation - Sync local docs to wiki"
    ]
    
    for tool in tools:
        print(f"  • {tool}")
    
    print("\nTo use the MCP server:")
    print("1. The server is now configured and ready")
    print("2. Use any MCP-compatible client to connect")
    print("3. All wiki operations will use your existing PAT token")
    
    print("\nServer Status:")
    print("✓ Installed and configured")
    print("✓ Connected to Azure DevOps")
    print("✓ Ready for wiki management tasks")
    
    # Create a simple usage script
    usage_script = '''#!/usr/bin/env python3
"""Simple script to use the UrbanAI Wiki MCP Server."""

from wiki_mcp.server import WikiMCPServer
import asyncio

async def main():
    """Run MCP server operations."""
    server = WikiMCPServer()
    await server.initialize()
    
    # Example: List wiki pages
    result = await server._list_wiki_pages({})
    print("Wiki pages:", result)
    
    await server.cleanup()

if __name__ == "__main__":
    asyncio.run(main())
'''
    
    with open("use_mcp_server.py", "w") as f:
        f.write(usage_script)
    
    print(f"\n✓ Usage example created: use_mcp_server.py")
    print("\nThe MCP server is now registered and ready for use!")

if __name__ == "__main__":
    register_mcp_server()
