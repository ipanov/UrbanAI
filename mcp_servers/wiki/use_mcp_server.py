#!/usr/bin/env python3
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
