"""Unit tests for client module."""

import pytest
import json
from unittest.mock import Mock, AsyncMock, patch, MagicMock
from aiohttp import ClientSession, ClientResponse, ClientResponseError

from wiki_mcp.client import (
    AzureDevOpsWikiClient,
    WikiClientError,
    WikiAuthenticationError,
    WikiNotFoundError
)
from wiki_mcp.models import WikiPageContent, WikiPageMetadata, WikiConfiguration


class TestWikiClientError:
    """Test WikiClientError exception hierarchy."""
    
    def test_wiki_client_error(self):
        """Test base WikiClientError."""
        error = WikiClientError("Test error")
        assert str(error) == "Test error"
        assert isinstance(error, Exception)
    
    def test_wiki_authentication_error(self):
        """Test WikiAuthenticationError."""
        error = WikiAuthenticationError("Auth failed")
        assert str(error) == "Auth failed"
        assert isinstance(error, WikiClientError)
    
    def test_wiki_not_found_error(self):
        """Test WikiNotFoundError."""
        error = WikiNotFoundError("Not found")
        assert str(error) == "Not found"
        assert isinstance(error, WikiClientError)


class TestAzureDevOpsWikiClient:
    """Test AzureDevOpsWikiClient class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.config = WikiConfiguration(
            organization_url="https://dev.azure.com/testorg",
            project="TestProject",
            wiki_id="test-wiki-123"
        )
        self.client = AzureDevOpsWikiClient(
            config=self.config,
            pat="test-pat-token"
        )
    
    def test_client_initialization(self):
        """Test client initialization."""
        assert self.client.config == self.config
        assert self.client.pat == "test-pat-token"
        assert self.client.base_url == "https://dev.azure.com/testorg/TestProject/_apis/wiki/wikis/test-wiki-123"
        assert "Authorization" in self.client.headers
    
    def test_client_initialization_without_wiki_id(self):
        """Test client initialization without wiki ID."""
        config = WikiConfiguration(
            organization_url="https://dev.azure.com/testorg",
            project="TestProject"
        )
        client = AzureDevOpsWikiClient(config=config, pat="test-pat")
        
        # Should work but base_url might be different
        assert client.config == config
    
    @pytest.mark.asyncio
    async def test_get_session(self):
        """Test getting HTTP session."""
        session = await self.client._get_session()
        assert isinstance(session, ClientSession)
        
        # Clean up
        await session.close()
    
    @pytest.mark.asyncio
    async def test_make_request_success(self):
        """Test successful HTTP request."""
        mock_response_data = {"id": "123", "name": "test-page"}
        
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value=mock_response_data)
            mock_response.raise_for_status = Mock()
            mock_get.return_value.__aenter__.return_value = mock_response
            
            result = await self.client._make_request("GET", "/test")
            
            assert result == mock_response_data
            mock_get.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_make_request_authentication_error(self):
        """Test HTTP request with authentication error."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 401
            mock_response.raise_for_status.side_effect = ClientResponseError(
                request_info=Mock(),
                history=(),
                status=401
            )
            mock_get.return_value.__aenter__.return_value = mock_response
            
            with pytest.raises(WikiAuthenticationError):
                await self.client._make_request("GET", "/test")
    
    @pytest.mark.asyncio
    async def test_make_request_not_found_error(self):
        """Test HTTP request with not found error."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 404
            mock_response.raise_for_status.side_effect = ClientResponseError(
                request_info=Mock(),
                history=(),
                status=404
            )
            mock_get.return_value.__aenter__.return_value = mock_response
            
            with pytest.raises(WikiNotFoundError):
                await self.client._make_request("GET", "/test")
    
    @pytest.mark.asyncio
    async def test_make_request_generic_error(self):
        """Test HTTP request with generic error."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 500
            mock_response.raise_for_status.side_effect = ClientResponseError(
                request_info=Mock(),
                history=(),
                status=500
            )
            mock_get.return_value.__aenter__.return_value = mock_response
            
            with pytest.raises(WikiClientError):
                await self.client._make_request("GET", "/test")
    
    @pytest.mark.asyncio
    async def test_list_wikis(self):
        """Test listing wikis."""
        mock_response = {
            "value": [
                {"id": "wiki1", "name": "Wiki 1"},
                {"id": "wiki2", "name": "Wiki 2"}
            ]
        }
        
        with patch.object(self.client, '_make_request', return_value=mock_response):
            wikis = await self.client.list_wikis()
            
            assert len(wikis) == 2
            assert wikis[0]["id"] == "wiki1"
            assert wikis[1]["id"] == "wiki2"
    
    @pytest.mark.asyncio
    async def test_get_page_exists(self):
        """Test getting existing page."""
        mock_response = {
            "id": "123",
            "path": "/docs/api",
            "content": "# API Documentation\n\nThis is the API docs."
        }
        
        with patch.object(self.client, '_make_request', return_value=mock_response):
            page = await self.client.get_page("/docs/api")
            
            assert page["id"] == "123"
            assert page["path"] == "/docs/api"
            assert "API Documentation" in page["content"]
    
    @pytest.mark.asyncio
    async def test_get_page_not_exists(self):
        """Test getting non-existent page."""
        with patch.object(self.client, '_make_request', side_effect=WikiNotFoundError("Page not found")):
            with pytest.raises(WikiNotFoundError):
                await self.client.get_page("/nonexistent")
    
    @pytest.mark.asyncio
    async def test_create_page_success(self):
        """Test successful page creation."""
        metadata = WikiPageMetadata(
            path="/docs/new-page",
            title="New Page"
        )
        content = WikiPageContent(
            content="# New Page\n\nThis is a new page.",
            metadata=metadata
        )
        
        mock_response = {
            "id": "456",
            "path": "/docs/new-page",
            "content": "# New Page\n\nThis is a new page."
        }
        
        with patch.object(self.client, '_make_request', return_value=mock_response):
            result = await self.client.create_page(content)
            
            assert result["id"] == "456"
            assert result["path"] == "/docs/new-page"
    
    @pytest.mark.asyncio
    async def test_create_page_parent_not_exists(self):
        """Test creating page when parent doesn't exist."""
        metadata = WikiPageMetadata(
            path="/docs/nested/deep/new-page",
            title="New Page"
        )
        content = WikiPageContent(
            content="# New Page\n\nThis is a new page.",
            metadata=metadata
        )
        
        # Mock the create_page to fail first, then succeed after parent creation
        call_count = 0
        
        async def mock_make_request(method, endpoint, **kwargs):
            nonlocal call_count
            call_count += 1
            
            if method == "PUT" and call_count == 1:
                # First call fails due to missing parent
                raise WikiClientError("Parent page does not exist")
            elif method == "PUT" and "/docs/nested" in endpoint:
                # Parent creation succeeds
                return {"id": "parent-id", "path": "/docs/nested"}
            elif method == "PUT" and "/docs/nested/deep" in endpoint:
                # Deep parent creation succeeds
                return {"id": "deep-parent-id", "path": "/docs/nested/deep"}
            elif method == "PUT" and call_count > 1:
                # Retry succeeds
                return {"id": "456", "path": "/docs/nested/deep/new-page"}
            else:
                return {}
        
        with patch.object(self.client, '_make_request', side_effect=mock_make_request):
            with patch.object(self.client, '_ensure_parent_pages_exist', return_value=None):
                result = await self.client.create_page(content)
                assert result["id"] == "456"
    
    @pytest.mark.asyncio
    async def test_update_page_success(self):
        """Test successful page update."""
        metadata = WikiPageMetadata(
            path="/docs/existing-page",
            title="Updated Page"
        )
        content = WikiPageContent(
            content="# Updated Page\n\nThis page has been updated.",
            metadata=metadata
        )
        
        mock_response = {
            "id": "789",
            "path": "/docs/existing-page",
            "content": "# Updated Page\n\nThis page has been updated."
        }
        
        with patch.object(self.client, '_make_request', return_value=mock_response):
            result = await self.client.update_page(content)
            
            assert result["id"] == "789"
            assert "updated" in result["content"].lower()
    
    @pytest.mark.asyncio
    async def test_delete_page_success(self):
        """Test successful page deletion."""
        mock_response = {"deleted": True}
        
        with patch.object(self.client, '_make_request', return_value=mock_response):
            result = await self.client.delete_page("/docs/to-delete")
            
            assert result["deleted"] is True
    
    @pytest.mark.asyncio
    async def test_delete_page_not_exists(self):
        """Test deleting non-existent page."""
        with patch.object(self.client, '_make_request', side_effect=WikiNotFoundError("Page not found")):
            with pytest.raises(WikiNotFoundError):
                await self.client.delete_page("/nonexistent")
    
    @pytest.mark.asyncio
    async def test_list_pages(self):
        """Test listing pages."""
        mock_response = {
            "value": [
                {"id": "1", "path": "/docs/page1", "title": "Page 1"},
                {"id": "2", "path": "/docs/page2", "title": "Page 2"}
            ]
        }
        
        with patch.object(self.client, '_make_request', return_value=mock_response):
            pages = await self.client.list_pages()
            
            assert len(pages) == 2
            assert pages[0]["path"] == "/docs/page1"
            assert pages[1]["path"] == "/docs/page2"
    
    @pytest.mark.asyncio
    async def test_list_pages_with_path_filter(self):
        """Test listing pages with path filter."""
        mock_response = {
            "value": [
                {"id": "1", "path": "/docs/api/endpoint1", "title": "Endpoint 1"},
                {"id": "2", "path": "/docs/api/endpoint2", "title": "Endpoint 2"}
            ]
        }
        
        with patch.object(self.client, '_make_request', return_value=mock_response):
            pages = await self.client.list_pages(path_filter="/docs/api")
            
            assert len(pages) == 2
            assert all("/docs/api" in page["path"] for page in pages)
    
    @pytest.mark.asyncio
    async def test_ensure_parent_pages_exist(self):
        """Test ensuring parent pages exist."""
        # This is a complex function that creates parent pages if they don't exist
        path = "/docs/guides/api/authentication"
        
        # Mock responses for checking if pages exist
        def mock_get_page(page_path):
            if page_path in ["/docs", "/docs/guides"]:
                return {"id": "existing", "path": page_path}
            else:
                raise WikiNotFoundError("Page not found")
        
        async def mock_create_page(content):
            return {"id": "new-id", "path": content.metadata.path}
        
        with patch.object(self.client, 'get_page', side_effect=mock_get_page):
            with patch.object(self.client, 'create_page', side_effect=mock_create_page):
                await self.client._ensure_parent_pages_exist(path)
                
                # Should have tried to create /docs/guides/api
                # (assuming /docs and /docs/guides exist but /docs/guides/api doesn't)
    
    @pytest.mark.asyncio
    async def test_close_session(self):
        """Test closing HTTP session."""
        # Create a session first
        session = await self.client._get_session()
        
        # Mock the close method
        with patch.object(session, 'close', new_callable=AsyncMock) as mock_close:
            self.client._session = session
            await self.client.close()
            
            mock_close.assert_called_once()
            assert self.client._session is None
    
    def test_build_api_url(self):
        """Test API URL building."""
        url = self.client._build_api_url("/pages/test-page")
        expected = "https://dev.azure.com/testorg/TestProject/_apis/wiki/wikis/test-wiki-123/pages/test-page"
        assert url == expected
    
    def test_build_api_url_with_params(self):
        """Test API URL building with parameters."""
        url = self.client._build_api_url("/pages", {"api-version": "7.0", "includeContent": "true"})
        expected_base = "https://dev.azure.com/testorg/TestProject/_apis/wiki/wikis/test-wiki-123/pages"
        
        assert url.startswith(expected_base)
        assert "api-version=7.0" in url
        assert "includeContent=true" in url
    
    def test_extract_page_path_from_nested_path(self):
        """Test extracting parent paths from nested path."""
        path = "/docs/guides/api/authentication"
        expected_parents = ["/docs", "/docs/guides", "/docs/guides/api"]
        
        parents = self.client._extract_parent_paths(path)
        assert parents == expected_parents
    
    def test_extract_page_path_from_simple_path(self):
        """Test extracting parent paths from simple path."""
        path = "/docs"
        parents = self.client._extract_parent_paths(path)
        assert parents == []  # No parents for top-level path
    
    def test_extract_page_path_from_root(self):
        """Test extracting parent paths from root path."""
        path = "/"
        parents = self.client._extract_parent_paths(path)
        assert parents == []
