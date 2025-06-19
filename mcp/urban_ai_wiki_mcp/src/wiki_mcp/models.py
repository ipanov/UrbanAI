"""Data models for the Wiki MCP server."""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class WikiPageStatus(str, Enum):
    """Status of a wiki page."""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class WikiPageMetadata(BaseModel):
    """Metadata for a wiki page."""
    model_config = ConfigDict(extra="forbid")
    
    id: Optional[str] = None
    path: str = Field(..., description="Path to the wiki page")
    title: str = Field(..., description="Page title")
    status: WikiPageStatus = WikiPageStatus.PUBLISHED
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    author: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    version: Optional[str] = None


class WikiPageContent(BaseModel):
    """Content of a wiki page."""
    model_config = ConfigDict(extra="forbid")
    
    content: str = Field(..., description="Markdown content of the page")
    metadata: WikiPageMetadata
    template_used: Optional[str] = Field(None, description="Template used to create the page")


class WikiTemplate(BaseModel):
    """Template for creating wiki pages."""
    model_config = ConfigDict(extra="forbid")
    
    name: str = Field(..., description="Template name")
    description: str = Field(..., description="Template description")
    content: str = Field(..., description="Template content with placeholders")
    variables: List[str] = Field(default_factory=list, description="Template variables")
    category: Optional[str] = Field(None, description="Template category")


class WikiOperationResult(BaseModel):
    """Result of a wiki operation."""
    model_config = ConfigDict(extra="forbid")
    
    success: bool = Field(..., description="Whether the operation succeeded")
    message: str = Field(..., description="Operation result message")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional result data")
    error_code: Optional[str] = Field(None, description="Error code if operation failed")


class BulkOperationRequest(BaseModel):
    """Request for bulk operations on wiki pages."""
    model_config = ConfigDict(extra="forbid")
    
    pages: List[WikiPageContent] = Field(..., description="Pages to process")
    operation: str = Field(..., description="Operation to perform")
    options: Dict[str, Any] = Field(default_factory=dict, description="Operation options")


class BulkOperationResult(BaseModel):
    """Result of a bulk operation."""
    model_config = ConfigDict(extra="forbid")
    
    total_requested: int = Field(..., description="Total pages requested for processing")
    successful: int = Field(..., description="Number of successful operations")
    failed: int = Field(..., description="Number of failed operations")
    results: List[WikiOperationResult] = Field(..., description="Individual operation results")
    summary: str = Field(..., description="Operation summary")


class WikiConfiguration(BaseModel):
    """Configuration for the wiki."""
    model_config = ConfigDict(extra="forbid")
    
    organization_url: str = Field(..., description="Azure DevOps organization URL")
    project: str = Field(..., description="Azure DevOps project name")
    wiki_id: Optional[str] = Field(None, description="Wiki ID")
    default_template: Optional[str] = Field(None, description="Default template to use")
    max_bulk_operations: int = Field(50, description="Maximum number of bulk operations")


class ValidationRule(BaseModel):
    """Content validation rule."""
    model_config = ConfigDict(extra="forbid")
    
    name: str = Field(..., description="Rule name")
    description: str = Field(..., description="Rule description")
    pattern: Optional[str] = Field(None, description="Regex pattern to match")
    required: bool = Field(False, description="Whether this rule is required")
    error_message: str = Field(..., description="Error message if validation fails")


class ValidationResult(BaseModel):
    """Result of content validation."""
    model_config = ConfigDict(extra="forbid")
    
    valid: bool = Field(..., description="Whether content is valid")
    errors: List[str] = Field(default_factory=list, description="Validation errors")
    warnings: List[str] = Field(default_factory=list, description="Validation warnings")
    suggestions: List[str] = Field(default_factory=list, description="Improvement suggestions")
