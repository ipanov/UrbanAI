"""Unit tests for models module."""

import pytest
from datetime import datetime
from pydantic import ValidationError

from wiki_mcp.models import (
    WikiPageStatus,
    WikiPageMetadata,
    WikiPageContent,
    WikiTemplate,
    WikiOperationResult,
    BulkOperationRequest,
    BulkOperationResult,
    WikiConfiguration,
    ValidationRule
)


class TestWikiPageStatus:
    """Test WikiPageStatus enum."""
    
    def test_status_values(self):
        """Test that status enum has correct values."""
        assert WikiPageStatus.DRAFT == "draft"
        assert WikiPageStatus.PUBLISHED == "published"
        assert WikiPageStatus.ARCHIVED == "archived"


class TestWikiPageMetadata:
    """Test WikiPageMetadata model."""
    
    def test_valid_metadata_creation(self):
        """Test creating valid metadata."""
        metadata = WikiPageMetadata(
            path="/docs/api",
            title="API Documentation",
            status=WikiPageStatus.PUBLISHED,
            author="test@example.com",
            tags=["api", "documentation"]
        )
        
        assert metadata.path == "/docs/api"
        assert metadata.title == "API Documentation"
        assert metadata.status == WikiPageStatus.PUBLISHED
        assert metadata.author == "test@example.com"
        assert metadata.tags == ["api", "documentation"]
    
    def test_required_fields(self):
        """Test that required fields are validated."""
        with pytest.raises(ValidationError) as exc_info:
            WikiPageMetadata()
        
        errors = exc_info.value.errors()
        required_fields = {error["loc"][0] for error in errors}
        assert "path" in required_fields
        assert "title" in required_fields
    
    def test_default_values(self):
        """Test default values are set correctly."""
        metadata = WikiPageMetadata(
            path="/test",
            title="Test Page"
        )
        
        assert metadata.status == WikiPageStatus.PUBLISHED
        assert metadata.tags == []
        assert metadata.id is None
        assert metadata.created_at is None
    
    def test_datetime_fields(self):
        """Test datetime fields work correctly."""
        now = datetime.now()
        metadata = WikiPageMetadata(
            path="/test",
            title="Test Page",
            created_at=now,
            updated_at=now
        )
        
        assert metadata.created_at == now
        assert metadata.updated_at == now


class TestWikiPageContent:
    """Test WikiPageContent model."""
    
    def test_valid_content_creation(self):
        """Test creating valid page content."""
        metadata = WikiPageMetadata(path="/test", title="Test")
        content = WikiPageContent(
            content="# Test Page\n\nThis is a test page.",
            metadata=metadata,
            template_used="basic"
        )
        
        assert content.content == "# Test Page\n\nThis is a test page."
        assert content.metadata.path == "/test"
        assert content.template_used == "basic"
    
    def test_required_fields(self):
        """Test required fields validation."""
        with pytest.raises(ValidationError):
            WikiPageContent()
    
    def test_optional_template_field(self):
        """Test that template_used is optional."""
        metadata = WikiPageMetadata(path="/test", title="Test")
        content = WikiPageContent(
            content="# Test",
            metadata=metadata
        )
        
        assert content.template_used is None


class TestWikiTemplate:
    """Test WikiTemplate model."""
    
    def test_valid_template_creation(self):
        """Test creating valid template."""
        template = WikiTemplate(
            name="api_template",
            description="Template for API documentation",
            content="# {{title}}\n\n{{description}}",
            variables=["title", "description"],
            category="documentation"
        )
        
        assert template.name == "api_template"
        assert template.description == "Template for API documentation"
        assert template.content == "# {{title}}\n\n{{description}}"
        assert template.variables == ["title", "description"]
        assert template.category == "documentation"
    
    def test_required_fields(self):
        """Test required fields validation."""
        with pytest.raises(ValidationError) as exc_info:
            WikiTemplate()
        
        errors = exc_info.value.errors()
        required_fields = {error["loc"][0] for error in errors}
        assert "name" in required_fields
        assert "description" in required_fields
        assert "content" in required_fields
    
    def test_default_values(self):
        """Test default values."""
        template = WikiTemplate(
            name="test",
            description="Test template",
            content="Test content"
        )
        
        assert template.variables == []
        assert template.category is None


class TestWikiOperationResult:
    """Test WikiOperationResult model."""
    
    def test_successful_result(self):
        """Test creating successful operation result."""
        result = WikiOperationResult(
            success=True,
            message="Page created successfully",
            data={"page_id": "123", "url": "https://example.com/page/123"}
        )
        
        assert result.success is True
        assert result.message == "Page created successfully"
        assert result.data["page_id"] == "123"
        assert result.error_code is None
    
    def test_failed_result(self):
        """Test creating failed operation result."""
        result = WikiOperationResult(
            success=False,
            message="Failed to create page",
            error_code="PERMISSION_DENIED"
        )
        
        assert result.success is False
        assert result.message == "Failed to create page"
        assert result.error_code == "PERMISSION_DENIED"
        assert result.data is None


class TestBulkOperationRequest:
    """Test BulkOperationRequest model."""
    
    def test_valid_bulk_request(self):
        """Test creating valid bulk operation request."""
        metadata = WikiPageMetadata(path="/test", title="Test")
        page_content = WikiPageContent(content="Test", metadata=metadata)
        
        request = BulkOperationRequest(
            pages=[page_content],
            operation="create",
            options={"force": True}
        )
        
        assert len(request.pages) == 1
        assert request.operation == "create"
        assert request.options["force"] is True
    
    def test_required_fields(self):
        """Test required fields validation."""
        with pytest.raises(ValidationError) as exc_info:
            BulkOperationRequest()
        
        errors = exc_info.value.errors()
        required_fields = {error["loc"][0] for error in errors}
        assert "pages" in required_fields
        assert "operation" in required_fields
    
    def test_default_options(self):
        """Test default options value."""
        metadata = WikiPageMetadata(path="/test", title="Test")
        page_content = WikiPageContent(content="Test", metadata=metadata)
        
        request = BulkOperationRequest(
            pages=[page_content],
            operation="create"
        )
        
        assert request.options == {}


class TestBulkOperationResult:
    """Test BulkOperationResult model."""
    
    def test_valid_bulk_result(self):
        """Test creating valid bulk operation result."""
        individual_result = WikiOperationResult(
            success=True,
            message="Success"
        )
        
        result = BulkOperationResult(
            total_requested=2,
            successful=1,
            failed=1,
            results=[individual_result],
            summary="Processed 2 pages: 1 successful, 1 failed"
        )
        
        assert result.total_requested == 2
        assert result.successful == 1
        assert result.failed == 1
        assert len(result.results) == 1
        assert "1 successful, 1 failed" in result.summary


class TestWikiConfiguration:
    """Test WikiConfiguration model."""
    
    def test_valid_configuration(self):
        """Test creating valid configuration."""
        config = WikiConfiguration(
            organization_url="https://dev.azure.com/myorg",
            project="MyProject",
            wiki_id="wiki123",
            default_template="basic",
            max_bulk_operations=100
        )
        
        assert config.organization_url == "https://dev.azure.com/myorg"
        assert config.project == "MyProject"
        assert config.wiki_id == "wiki123"
        assert config.default_template == "basic"
        assert config.max_bulk_operations == 100
    
    def test_required_fields(self):
        """Test required fields validation."""
        with pytest.raises(ValidationError) as exc_info:
            WikiConfiguration()
        
        errors = exc_info.value.errors()
        required_fields = {error["loc"][0] for error in errors}
        assert "organization_url" in required_fields
        assert "project" in required_fields
    
    def test_default_values(self):
        """Test default values."""
        config = WikiConfiguration(
            organization_url="https://dev.azure.com/myorg",
            project="MyProject"
        )
        
        assert config.wiki_id is None
        assert config.default_template is None
        assert config.max_bulk_operations == 50


class TestValidationRule:
    """Test ValidationRule model."""
    
    def test_valid_rule(self):
        """Test creating valid validation rule."""
        rule = ValidationRule(
            name="title_required",
            description="Page must have a title",
            pattern=r"^# .+",
            required=True,
            error_message="Page must start with a title (# Title)"
        )
        
        assert rule.name == "title_required"
        assert rule.description == "Page must have a title"
        assert rule.pattern == r"^# .+"
        assert rule.required is True
        assert rule.error_message == "Page must start with a title (# Title)"
    
    def test_required_fields(self):
        """Test required fields validation."""
        with pytest.raises(ValidationError) as exc_info:
            ValidationRule()
        
        errors = exc_info.value.errors()
        required_fields = {error["loc"][0] for error in errors}
        assert "name" in required_fields
        assert "description" in required_fields
        assert "error_message" in required_fields
    
    def test_default_values(self):
        """Test default values."""
        rule = ValidationRule(
            name="test_rule",
            description="Test rule",
            error_message="Test error"
        )
        
        assert rule.pattern is None
        assert rule.required is False
