"""Main MCP server for UrbanAI Wiki management."""

import asyncio
import json
import logging
import sys
from typing import Any, Dict, List, Optional, Sequence

from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel
)

from .client import AzureDevOpsWikiClient
from .models import (
    WikiConfiguration,
    WikiPageContent,
    WikiPageMetadata,
    WikiOperationResult,
    BulkOperationRequest,
    BulkOperationResult,
    WikiPageStatus
)
from .templates import TemplateManager
from .validators import ContentValidator
from .utils import (
    setup_logging,
    validate_environment,
    sanitize_path,
    extract_title_from_path,
    format_date
)

logger = logging.getLogger(__name__)


class WikiMCPServer:
    """MCP Server for UrbanAI Wiki management."""

    def __init__(self):
        """Initialize the Wiki MCP server."""
        self.server = Server("urban-ai-wiki")
        self.client: Optional[AzureDevOpsWikiClient] = None
        self.template_manager = TemplateManager()
        self.validator = ContentValidator()
        self.config: Optional[WikiConfiguration] = None
        
        # Register handlers
        self._register_handlers()

    def _register_handlers(self) -> None:
        """Register MCP handlers."""
        
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            """List available tools."""
            return [
                Tool(
                    name="create_wiki_page",
                    description="Create a new wiki page with content",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "path": {
                                "type": "string",
                                "description": "Path for the new page (e.g., /Architecture/Overview)"
                            },
                            "title": {
                                "type": "string",
                                "description": "Page title"
                            },
                            "content": {
                                "type": "string",
                                "description": "Markdown content for the page"
                            },
                            "template": {
                                "type": "string",
                                "description": "Template name to use (optional)"
                            },
                            "template_variables": {
                                "type": "object",
                                "description": "Variables for template substitution (optional)"
                            }
                        },
                        "required": ["path", "content"]
                    }
                ),
                Tool(
                    name="update_wiki_page",
                    description="Update an existing wiki page",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "path": {
                                "type": "string",
                                "description": "Path to the page to update"
                            },
                            "content": {
                                "type": "string",
                                "description": "New markdown content for the page"
                            },
                            "title": {
                                "type": "string",
                                "description": "Updated page title (optional)"
                            }
                        },
                        "required": ["path", "content"]
                    }
                ),
                Tool(
                    name="get_wiki_page",
                    description="Get the content of a wiki page",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "path": {
                                "type": "string",
                                "description": "Path to the page to retrieve"
                            }
                        },
                        "required": ["path"]
                    }
                ),
                Tool(
                    name="delete_wiki_page",
                    description="Delete a wiki page",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "path": {
                                "type": "string",
                                "description": "Path to the page to delete"
                            }
                        },
                        "required": ["path"]
                    }
                ),
                Tool(
                    name="list_wiki_pages",
                    description="List all pages in the wiki",
                    inputSchema={
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                ),
                Tool(
                    name="list_templates",
                    description="List available page templates",
                    inputSchema={
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                ),
                Tool(
                    name="apply_template",
                    description="Create page content from a template",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "template_name": {
                                "type": "string",
                                "description": "Name of the template to apply"
                            },
                            "variables": {
                                "type": "object",
                                "description": "Variables to substitute in the template"
                            },
                            "path": {
                                "type": "string",
                                "description": "Path for the new page"
                            },
                            "title": {
                                "type": "string",
                                "description": "Title for the new page (optional)"
                            }
                        },
                        "required": ["template_name", "variables", "path"]
                    }
                ),
                Tool(
                    name="validate_content",
                    description="Validate wiki page content for quality and structure",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "content": {
                                "type": "string",
                                "description": "Markdown content to validate"
                            }
                        },
                        "required": ["content"]
                    }
                ),
                Tool(
                    name="bulk_create_pages",
                    description="Create multiple wiki pages at once",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "pages": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "path": {"type": "string"},
                                        "title": {"type": "string"},
                                        "content": {"type": "string"}
                                    },
                                    "required": ["path", "content"]
                                },
                                "description": "Array of pages to create"
                            }
                        },
                        "required": ["pages"]
                    }
                ),
                Tool(
                    name="sync_documentation",
                    description="Synchronize wiki with project documentation files",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "docs_directory": {
                                "type": "string",
                                "description": "Path to documentation directory (optional)"
                            },
                            "dry_run": {
                                "type": "boolean",
                                "description": "Preview changes without applying them"
                            }
                        },
                        "required": []
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            """Handle tool calls."""
            try:
                if not self.client:
                    await self._initialize_client()

                if name == "create_wiki_page":
                    return await self._handle_create_page(arguments)
                elif name == "update_wiki_page":
                    return await self._handle_update_page(arguments)
                elif name == "get_wiki_page":
                    return await self._handle_get_page(arguments)
                elif name == "delete_wiki_page":
                    return await self._handle_delete_page(arguments)
                elif name == "list_wiki_pages":
                    return await self._handle_list_pages(arguments)
                elif name == "list_templates":
                    return await self._handle_list_templates(arguments)
                elif name == "apply_template":
                    return await self._handle_apply_template(arguments)
                elif name == "validate_content":
                    return await self._handle_validate_content(arguments)
                elif name == "bulk_create_pages":
                    return await self._handle_bulk_create_pages(arguments)
                elif name == "sync_documentation":
                    return await self._handle_sync_documentation(arguments)
                else:
                    return [TextContent(type="text", text=f"Unknown tool: {name}")]
                    
            except Exception as e:
                logger.error(f"Error handling tool {name}: {e}")
                return [TextContent(type="text", text=f"Error: {str(e)}")]

    async def _initialize_client(self) -> None:
        """Initialize the Azure DevOps client."""
        env_validation = validate_environment()
        
        if not env_validation["valid"]:
            raise ValueError(
                f"Environment validation failed. Missing: {env_validation['missing_vars']}, "
                f"Invalid: {env_validation['invalid_vars']}"
            )

        config_data = env_validation["config"]
        self.config = WikiConfiguration(
            organization_url=config_data["organization_url"],
            project=config_data["project"],
            default_template=config_data["default_template"],
            max_bulk_operations=config_data["max_bulk_operations"]
        )

        self.client = AzureDevOpsWikiClient(
            config=self.config,
            personal_access_token=config_data["azure_devops_pat"]
        )

        # Get wiki ID
        await self.client.get_wiki_id()

    async def _handle_create_page(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle create_wiki_page tool call."""
        path = sanitize_path(arguments["path"])
        content = arguments["content"]
        title = arguments.get("title", extract_title_from_path(path))
        template_name = arguments.get("template")
        template_variables = arguments.get("template_variables", {})

        # Apply template if specified
        if template_name:
            template_content = self.template_manager.apply_template(
                template_name=template_name,
                variables=template_variables,
                path=path,
                title=title
            )
            if template_content:
                content = template_content.content

        # Validate content
        validation = self.validator.validate_content(content)
        if not validation.valid:
            return [TextContent(
                type="text", 
                text=f"Content validation failed:\nErrors: {validation.errors}\nWarnings: {validation.warnings}"
            )]

        # Create page
        metadata = WikiPageMetadata(
            path=path,
            title=title,
            status=WikiPageStatus.PUBLISHED
        )
        page = WikiPageContent(content=content, metadata=metadata)
        
        result = await self.client.create_page(page)
        
        response_text = f"✅ Page creation {'succeeded' if result.success else 'failed'}: {result.message}"
        if validation.warnings:
            response_text += f"\n\nWarnings: {validation.warnings}"
        if validation.suggestions:
            response_text += f"\n\nSuggestions: {validation.suggestions}"
            
        return [TextContent(type="text", text=response_text)]

    async def _handle_update_page(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle update_wiki_page tool call."""
        path = sanitize_path(arguments["path"])
        content = arguments["content"]
        title = arguments.get("title", extract_title_from_path(path))

        # Validate content
        validation = self.validator.validate_content(content)
        if not validation.valid:
            return [TextContent(
                type="text", 
                text=f"Content validation failed:\nErrors: {validation.errors}"
            )]

        # Update page
        metadata = WikiPageMetadata(
            path=path,
            title=title,
            status=WikiPageStatus.PUBLISHED
        )
        page = WikiPageContent(content=content, metadata=metadata)
        
        result = await self.client.update_page(page)
        
        response_text = f"✅ Page update {'succeeded' if result.success else 'failed'}: {result.message}"
        if validation.warnings:
            response_text += f"\n\nWarnings: {validation.warnings}"
            
        return [TextContent(type="text", text=response_text)]

    async def _handle_get_page(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle get_wiki_page tool call."""
        path = sanitize_path(arguments["path"])
        
        page = await self.client.get_page(path)
        
        if page:
            response = f"# Page: {page.metadata.title}\n\n**Path:** {page.metadata.path}\n\n**Content:**\n\n{page.content}"
        else:
            response = f"❌ Page not found: {path}"
            
        return [TextContent(type="text", text=response)]

    async def _handle_delete_page(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle delete_wiki_page tool call."""
        path = sanitize_path(arguments["path"])
        
        result = await self.client.delete_page(path)
        response_text = f"✅ Page deletion {'succeeded' if result.success else 'failed'}: {result.message}"
        
        return [TextContent(type="text", text=response_text)]

    async def _handle_list_pages(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle list_wiki_pages tool call."""
        pages = await self.client.list_pages()
        
        if pages:
            response = "# Wiki Pages\n\n"
            for page in pages:
                response += f"- **{page.title}** (`{page.path}`)\n"
        else:
            response = "No pages found in the wiki."
            
        return [TextContent(type="text", text=response)]

    async def _handle_list_templates(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle list_templates tool call."""
        templates = self.template_manager.list_templates()
        
        if templates:
            response = "# Available Templates\n\n"
            for template in templates:
                response += f"## {template.name}\n"
                response += f"**Description:** {template.description}\n"
                response += f"**Category:** {template.category or 'General'}\n"
                if template.variables:
                    response += f"**Variables:** {', '.join(template.variables)}\n"
                response += "\n"
        else:
            response = "No templates available."
            
        return [TextContent(type="text", text=response)]

    async def _handle_apply_template(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle apply_template tool call."""
        template_name = arguments["template_name"]
        variables = arguments["variables"]
        path = sanitize_path(arguments["path"])
        title = arguments.get("title")

        # Validate template variables
        validation = self.template_manager.validate_template(template_name, variables)
        if not validation.valid:
            return [TextContent(
                type="text", 
                text=f"Template validation failed:\nErrors: {validation.errors}"
            )]

        # Apply template
        page_content = self.template_manager.apply_template(
            template_name=template_name,
            variables=variables,
            path=path,
            title=title
        )

        if page_content:
            response = f"# Template Applied: {template_name}\n\n**Generated Content:**\n\n{page_content.content}"
            if validation.warnings:
                response += f"\n\n**Warnings:** {validation.warnings}"
        else:
            response = f"❌ Failed to apply template: {template_name}"
            
        return [TextContent(type="text", text=response)]

    async def _handle_validate_content(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle validate_content tool call."""
        content = arguments["content"]
        
        # Content validation
        content_validation = self.validator.validate_content(content)
        
        # Structure validation
        structure_validation = self.validator.validate_structure(content)
        
        response = f"# Content Validation Results\n\n"
        response += f"**Valid:** {'✅ Yes' if content_validation.valid and structure_validation.valid else '❌ No'}\n\n"
        
        if content_validation.errors or structure_validation.errors:
            response += "## Errors\n"
            for error in content_validation.errors + structure_validation.errors:
                response += f"- {error}\n"
            response += "\n"
        
        if content_validation.warnings or structure_validation.warnings:
            response += "## Warnings\n"
            for warning in content_validation.warnings + structure_validation.warnings:
                response += f"- {warning}\n"
            response += "\n"
        
        if content_validation.suggestions or structure_validation.suggestions:
            response += "## Suggestions\n"
            for suggestion in content_validation.suggestions + structure_validation.suggestions:
                response += f"- {suggestion}\n"
        
        return [TextContent(type="text", text=response)]

    async def _handle_bulk_create_pages(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle bulk_create_pages tool call."""
        pages_data = arguments["pages"]
        
        if len(pages_data) > self.config.max_bulk_operations:
            return [TextContent(
                type="text", 
                text=f"❌ Too many pages requested. Maximum: {self.config.max_bulk_operations}"
            )]

        results = []
        successful = 0
        failed = 0

        for page_data in pages_data:
            try:
                path = sanitize_path(page_data["path"])
                content = page_data["content"]
                title = page_data.get("title", extract_title_from_path(path))

                metadata = WikiPageMetadata(
                    path=path,
                    title=title,
                    status=WikiPageStatus.PUBLISHED
                )
                page = WikiPageContent(content=content, metadata=metadata)
                
                result = await self.client.create_page(page)
                results.append(result)
                
                if result.success:
                    successful += 1
                else:
                    failed += 1
                    
            except Exception as e:
                failed += 1
                results.append(WikiOperationResult(
                    success=False,
                    message=f"Error creating page {page_data.get('path', 'unknown')}: {str(e)}",
                    error_code="EXCEPTION"
                ))

        response = f"# Bulk Page Creation Results\n\n"
        response += f"**Total Requested:** {len(pages_data)}\n"
        response += f"**Successful:** ✅ {successful}\n"
        response += f"**Failed:** ❌ {failed}\n\n"
        
        if failed > 0:
            response += "## Failed Operations\n"
            for result in results:
                if not result.success:
                    response += f"- {result.message}\n"
        
        return [TextContent(type="text", text=response)]

    async def _handle_sync_documentation(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Handle sync_documentation tool call."""
        docs_dir = arguments.get("docs_directory", "../docs")
        dry_run = arguments.get("dry_run", False)
        
        # This is a placeholder implementation
        # In a real implementation, you would scan the docs directory and sync files
        
        response = f"# Documentation Sync {'(Dry Run)' if dry_run else ''}\n\n"
        response += f"**Documentation Directory:** {docs_dir}\n"
        response += "**Status:** This feature is not yet fully implemented.\n\n"
        response += "**Planned Features:**\n"
        response += "- Scan local documentation files\n"
        response += "- Compare with wiki pages\n"
        response += "- Create/update pages as needed\n"
        response += "- Generate sync report\n"
        
        return [TextContent(type="text", text=response)]


async def main():
    """Main entry point for the MCP server."""
    # Setup logging
    setup_logging()
    
    # Create and run server
    wiki_server = WikiMCPServer()
    
    # Run server with stdio transport
    async with stdio_server() as (read_stream, write_stream):
        await wiki_server.server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="urban-ai-wiki",
                server_version="1.0.0",
                capabilities=wiki_server.server.get_capabilities(
                    notification_options=None,
                    experimental_capabilities={}
                )
            )
        )


if __name__ == "__main__":
    asyncio.run(main())
