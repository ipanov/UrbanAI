# UrbanAI Wiki Management with MCP

This directory contains an MCP (Model Context Protocol) server configuration for automatically creating, editing, and deleting Azure DevOps wiki pages for the UrbanAI project.

## Setup Instructions

1. **Configure Azure DevOps credentials**

   Edit the `.env` file and update with your Azure DevOps information:
   
   ```
   AZURE_DEVOPS_PAT=your_personal_access_token
   AZURE_DEVOPS_ORGANIZATION_URL=https://dev.azure.com/your-organization
   ```
   
   You'll need to create a Personal Access Token (PAT) with the following permissions:
   - Read & Write for Work Items
   - Read & Write for Wiki

2. **Activate the virtual environment**

   ```powershell
   .\mcp-env\Scripts\Activate.ps1
   ```

3. **Start the MCP server**

   ```powershell
   python start_wiki_server.py
   ```
   
   This will start the MCP server on port 7001.

4. **Connect to GitHub Copilot**

   Configure GitHub Copilot to use this MCP server for Azure DevOps Wiki Management.

## Using the MCP Wiki Management Server

With the MCP server running, you can use natural language commands to manage your wiki pages through GitHub Copilot:

- "Create a new wiki page about the project architecture"
- "Update the API documentation wiki page with the latest endpoints"
- "Delete the outdated setup instructions wiki page"
- "List all wiki pages in the UrbanAI project"
- "Add a section about authentication to the API documentation wiki"

## Wiki Page Templates

The MCP server can also use templates stored in the `wiki_templates` directory to quickly create standardized wiki pages.

## Troubleshooting

If you encounter issues:

1. Check that your PAT is valid and has the correct permissions
2. Verify the Azure DevOps organization URL is correct
3. Check the server logs for detailed error messages
