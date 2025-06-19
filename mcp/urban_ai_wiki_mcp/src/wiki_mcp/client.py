"""Azure DevOps Wiki client for the MCP server."""

import base64
import json
import logging
from typing import Dict, List, Optional, Any
from urllib.parse import quote

import aiohttp
from aiohttp import ClientSession, ClientTimeout

from .models import (
    WikiPageContent,
    WikiPageMetadata,
    WikiOperationResult,
    WikiConfiguration,
    WikiPageStatus
)

logger = logging.getLogger(__name__)


class AzureDevOpsWikiClient:
    """Client for interacting with Azure DevOps Wiki API."""

    def __init__(self, config: WikiConfiguration, personal_access_token: str):
        """Initialize the client.
        
        Args:
            config: Wiki configuration
            personal_access_token: Azure DevOps PAT
        """
        self.config = config
        self.pat = personal_access_token
        self.base_url = f"{config.organization_url}/{config.project}/_apis/wiki/wikis"
        self.timeout = ClientTimeout(total=30)
        
        # Create authorization header
        encoded_pat = base64.b64encode(f":{self.pat}".encode()).decode()
        self.headers = {
            "Authorization": f"Basic {encoded_pat}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    async def get_wikis(self) -> List[Dict[str, Any]]:
        """Get list of wikis in the project.
        
        Returns:
            List of wiki information
            
        Raises:
            aiohttp.ClientError: If API request fails
        """
        url = f"{self.base_url}?api-version=7.0"
        
        async with ClientSession(timeout=self.timeout) as session:
            async with session.get(url, headers=self.headers) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("value", [])
                else:
                    error_text = await response.text()
                    raise aiohttp.ClientError(
                        f"Failed to get wikis: {response.status} - {error_text}"
                    )

    async def get_wiki_id(self) -> Optional[str]:
        """Get the first available wiki ID.
        
        Returns:
            Wiki ID if found, None otherwise
        """
        try:
            wikis = await self.get_wikis()
            if wikis:
                wiki_id = wikis[0]["id"]
                self.config.wiki_id = wiki_id
                return wiki_id
            return None
        except Exception as e:
            logger.error(f"Failed to get wiki ID: {e}")
            return None

    async def get_page(self, path: str, wiki_id: Optional[str] = None) -> Optional[WikiPageContent]:
        """Get a wiki page by path.
        
        Args:
            path: Page path
            wiki_id: Wiki ID (uses default if not provided)
            
        Returns:
            WikiPageContent if found, None otherwise
        """
        if not wiki_id:
            wiki_id = self.config.wiki_id or await self.get_wiki_id()
            
        if not wiki_id:
            logger.error("No wiki ID available")
            return None

        encoded_path = quote(path, safe="")
        url = f"{self.base_url}/{wiki_id}/pages?path={encoded_path}&api-version=7.0"
        
        try:
            async with ClientSession(timeout=self.timeout) as session:
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        metadata = WikiPageMetadata(
                            id=data.get("id"),
                            path=data.get("path", path),
                            title=self._extract_title_from_content(data.get("content", "")),
                            status=WikiPageStatus.PUBLISHED
                        )
                        
                        return WikiPageContent(
                            content=data.get("content", ""),
                            metadata=metadata
                        )
                    elif response.status == 404:
                        return None
                    else:
                        error_text = await response.text()
                        logger.error(f"Failed to get page {path}: {response.status} - {error_text}")
                        return None
        except Exception as e:
            logger.error(f"Error getting page {path}: {e}")
            return None

    async def create_page(
        self, 
        page: WikiPageContent, 
        wiki_id: Optional[str] = None
    ) -> WikiOperationResult:
        """Create a new wiki page.
        
        Args:
            page: Page content to create
            wiki_id: Wiki ID (uses default if not provided)
            
        Returns:
            Operation result
        """
        if not wiki_id:
            wiki_id = self.config.wiki_id or await self.get_wiki_id()
            
        if not wiki_id:
            return WikiOperationResult(
                success=False,
                message="No wiki ID available",
                error_code="NO_WIKI_ID"
            )

        # Ensure parent pages exist
        await self._ensure_parent_pages(page.metadata.path, wiki_id)

        encoded_path = quote(page.metadata.path, safe="")
        url = f"{self.base_url}/{wiki_id}/pages?path={encoded_path}&api-version=7.0"
        
        payload = {"content": page.content}
        
        try:
            async with ClientSession(timeout=self.timeout) as session:
                async with session.put(
                    url, 
                    headers=self.headers, 
                    json=payload
                ) as response:
                    if response.status in [200, 201]:
                        return WikiOperationResult(
                            success=True,
                            message=f"Page created successfully: {page.metadata.path}",
                            data={"path": page.metadata.path, "status_code": response.status}
                        )
                    else:
                        error_text = await response.text()
                        return WikiOperationResult(
                            success=False,
                            message=f"Failed to create page: {error_text}",
                            error_code=f"HTTP_{response.status}"
                        )
        except Exception as e:
            return WikiOperationResult(
                success=False,
                message=f"Error creating page: {str(e)}",
                error_code="EXCEPTION"
            )

    async def update_page(
        self, 
        page: WikiPageContent, 
        wiki_id: Optional[str] = None
    ) -> WikiOperationResult:
        """Update an existing wiki page.
        
        Args:
            page: Updated page content
            wiki_id: Wiki ID (uses default if not provided)
            
        Returns:
            Operation result
        """
        if not wiki_id:
            wiki_id = self.config.wiki_id or await self.get_wiki_id()
            
        if not wiki_id:
            return WikiOperationResult(
                success=False,
                message="No wiki ID available",
                error_code="NO_WIKI_ID"
            )

        encoded_path = quote(page.metadata.path, safe="")
        url = f"{self.base_url}/{wiki_id}/pages?path={encoded_path}&api-version=7.0"
        
        payload = {"content": page.content}
        
        try:
            async with ClientSession(timeout=self.timeout) as session:
                async with session.put(
                    url, 
                    headers=self.headers, 
                    json=payload
                ) as response:
                    if response.status in [200, 201]:
                        return WikiOperationResult(
                            success=True,
                            message=f"Page updated successfully: {page.metadata.path}",
                            data={"path": page.metadata.path, "status_code": response.status}
                        )
                    else:
                        error_text = await response.text()
                        return WikiOperationResult(
                            success=False,
                            message=f"Failed to update page: {error_text}",
                            error_code=f"HTTP_{response.status}"
                        )
        except Exception as e:
            return WikiOperationResult(
                success=False,
                message=f"Error updating page: {str(e)}",
                error_code="EXCEPTION"
            )

    async def delete_page(self, path: str, wiki_id: Optional[str] = None) -> WikiOperationResult:
        """Delete a wiki page.
        
        Args:
            path: Page path to delete
            wiki_id: Wiki ID (uses default if not provided)
            
        Returns:
            Operation result
        """
        if not wiki_id:
            wiki_id = self.config.wiki_id or await self.get_wiki_id()
            
        if not wiki_id:
            return WikiOperationResult(
                success=False,
                message="No wiki ID available",
                error_code="NO_WIKI_ID"
            )

        encoded_path = quote(path, safe="")
        url = f"{self.base_url}/{wiki_id}/pages?path={encoded_path}&api-version=7.0"
        
        try:
            async with ClientSession(timeout=self.timeout) as session:
                async with session.delete(url, headers=self.headers) as response:
                    if response.status == 200:
                        return WikiOperationResult(
                            success=True,
                            message=f"Page deleted successfully: {path}",
                            data={"path": path}
                        )
                    else:
                        error_text = await response.text()
                        return WikiOperationResult(
                            success=False,
                            message=f"Failed to delete page: {error_text}",
                            error_code=f"HTTP_{response.status}"
                        )
        except Exception as e:
            return WikiOperationResult(
                success=False,
                message=f"Error deleting page: {str(e)}",
                error_code="EXCEPTION"
            )

    async def list_pages(self, wiki_id: Optional[str] = None) -> List[WikiPageMetadata]:
        """List all pages in the wiki.
        
        Args:
            wiki_id: Wiki ID (uses default if not provided)
            
        Returns:
            List of page metadata
        """
        if not wiki_id:
            wiki_id = self.config.wiki_id or await self.get_wiki_id()
            
        if not wiki_id:
            logger.error("No wiki ID available")
            return []

        url = f"{self.base_url}/{wiki_id}/pages?api-version=7.0"
        
        try:
            async with ClientSession(timeout=self.timeout) as session:
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        pages = []
                        
                        def extract_pages(page_data, parent_path=""):
                            path = page_data.get("path", parent_path)
                            if path and path != "/":
                                pages.append(WikiPageMetadata(
                                    id=page_data.get("id"),
                                    path=path,
                                    title=path.split("/")[-1] or "Root",
                                    status=WikiPageStatus.PUBLISHED
                                ))
                            
                            for subpage in page_data.get("subPages", []):
                                extract_pages(subpage, path)
                        
                        extract_pages(data)
                        return pages
                    else:
                        error_text = await response.text()
                        logger.error(f"Failed to list pages: {response.status} - {error_text}")
                        return []
        except Exception as e:
            logger.error(f"Error listing pages: {e}")
            return []

    async def _ensure_parent_pages(self, path: str, wiki_id: str) -> None:
        """Ensure all parent pages exist for the given path.
        
        Args:
            path: Target page path
            wiki_id: Wiki ID
        """
        parts = path.strip("/").split("/")
        current_path = ""
        
        for part in parts[:-1]:  # Don't create the target page itself
            current_path += f"/{part}"
            
            # Check if parent page exists
            existing_page = await self.get_page(current_path, wiki_id)
            if not existing_page:
                # Create parent page
                parent_metadata = WikiPageMetadata(
                    path=current_path,
                    title=part,
                    status=WikiPageStatus.PUBLISHED
                )
                parent_content = WikiPageContent(
                    content=f"# {part}\n\nParent page for {part} section.",
                    metadata=parent_metadata
                )
                await self.create_page(parent_content, wiki_id)

    def _extract_title_from_content(self, content: str) -> str:
        """Extract title from markdown content.
        
        Args:
            content: Markdown content
            
        Returns:
            Extracted title or default
        """
        lines = content.strip().split("\n")
        for line in lines:
            if line.startswith("# "):
                return line[2:].strip()
        return "Untitled Page"
