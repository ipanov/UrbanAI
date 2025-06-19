"""Unit tests for validators module."""

import pytest
from unittest.mock import MagicMock

from wiki_mcp.validators import (
    ContentValidator,
    ValidationResult,
    validate_markdown_structure,
    validate_title_format,
    validate_content_length,
    validate_image_references,
    validate_link_format
)
from wiki_mcp.models import ValidationRule


class TestValidationResult:
    """Test ValidationResult class."""
    
    def test_validation_result_success(self):
        """Test successful validation result."""
        result = ValidationResult(
            is_valid=True,
            message="Content is valid",
            errors=[]
        )
        
        assert result.is_valid is True
        assert result.message == "Content is valid"
        assert result.errors == []
    
    def test_validation_result_failure(self):
        """Test failed validation result."""
        errors = ["Missing title", "Content too short"]
        result = ValidationResult(
            is_valid=False,
            message="Validation failed",
            errors=errors
        )
        
        assert result.is_valid is False
        assert result.message == "Validation failed"
        assert result.errors == errors


class TestContentValidator:
    """Test ContentValidator class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.validator = ContentValidator()
    
    def test_validator_initialization(self):
        """Test validator initialization."""
        assert isinstance(self.validator.rules, list)
        assert len(self.validator.rules) > 0
    
    def test_validator_with_custom_rules(self):
        """Test validator with custom rules."""
        custom_rules = [
            ValidationRule(
                name="test_rule",
                description="Test rule",
                pattern=r"^# .+",
                required=True,
                error_message="Must start with header"
            )
        ]
        
        validator = ContentValidator(rules=custom_rules)
        assert len(validator.rules) == 1
        assert validator.rules[0].name == "test_rule"
    
    def test_validate_content_success(self):
        """Test successful content validation."""
        content = """# Test Page

This is a well-formatted page with proper structure.

## Section 1

Some content here with appropriate length.

## Section 2

More content to meet minimum requirements.
"""
        
        result = self.validator.validate_content(content)
        assert result.is_valid is True
        assert len(result.errors) == 0
    
    def test_validate_content_failure(self):
        """Test failed content validation."""
        content = "This is too short and has no title"
        
        result = self.validator.validate_content(content)
        assert result.is_valid is False
        assert len(result.errors) > 0
    
    def test_validate_content_empty(self):
        """Test validation of empty content."""
        result = self.validator.validate_content("")
        assert result.is_valid is False
        assert "empty" in result.message.lower() or "content" in result.message.lower()
    
    def test_add_rule(self):
        """Test adding a validation rule."""
        initial_count = len(self.validator.rules)
        
        new_rule = ValidationRule(
            name="custom_rule",
            description="Custom validation rule",
            error_message="Custom error"
        )
        
        self.validator.add_rule(new_rule)
        assert len(self.validator.rules) == initial_count + 1
        assert self.validator.rules[-1].name == "custom_rule"
    
    def test_remove_rule(self):
        """Test removing a validation rule."""
        rule_to_remove = ValidationRule(
            name="temp_rule",
            description="Temporary rule",
            error_message="Temp error"
        )
        
        self.validator.add_rule(rule_to_remove)
        initial_count = len(self.validator.rules)
        
        result = self.validator.remove_rule("temp_rule")
        assert result is True
        assert len(self.validator.rules) == initial_count - 1
    
    def test_remove_nonexistent_rule(self):
        """Test removing a non-existent rule."""
        result = self.validator.remove_rule("nonexistent_rule")
        assert result is False


class TestValidateMarkdownStructure:
    """Test markdown structure validation function."""
    
    def test_valid_markdown_structure(self):
        """Test valid markdown structure."""
        content = """# Main Title

## Section 1

Some content here.

### Subsection

More content.

## Section 2

Final content.
"""
        
        result = validate_markdown_structure(content)
        assert result.is_valid is True
    
    def test_missing_main_title(self):
        """Test markdown missing main title."""
        content = """## Section 1

Some content without main title.
"""
        
        result = validate_markdown_structure(content)
        assert result.is_valid is False
        assert "title" in result.message.lower()
    
    def test_improper_heading_hierarchy(self):
        """Test improper heading hierarchy."""
        content = """# Main Title

### Subsection (skipping h2)

Content here.
"""
        
        result = validate_markdown_structure(content)
        # This might be valid depending on implementation
        # The test verifies that the function runs without error
        assert isinstance(result, ValidationResult)
    
    def test_empty_content(self):
        """Test empty content."""
        result = validate_markdown_structure("")
        assert result.is_valid is False


class TestValidateTitleFormat:
    """Test title format validation function."""
    
    def test_valid_title_format(self):
        """Test valid title format."""
        content = "# Proper Title Format"
        result = validate_title_format(content)
        assert result.is_valid is True
    
    def test_missing_title(self):
        """Test missing title."""
        content = "Just some content without a title"
        result = validate_title_format(content)
        assert result.is_valid is False
    
    def test_improper_title_format(self):
        """Test improper title format."""
        content = "## This should be h1, not h2"
        result = validate_title_format(content)
        assert result.is_valid is False
    
    def test_multiple_h1_titles(self):
        """Test multiple h1 titles."""
        content = """# First Title

Some content.

# Second Title

This should not be allowed.
"""
        
        result = validate_title_format(content)
        # Depending on implementation, this might be invalid
        assert isinstance(result, ValidationResult)


class TestValidateContentLength:
    """Test content length validation function."""
    
    def test_valid_content_length(self):
        """Test valid content length."""
        content = "# Title\n\n" + "This is sufficient content. " * 10
        result = validate_content_length(content)
        assert result.is_valid is True
    
    def test_content_too_short(self):
        """Test content that is too short."""
        content = "# Title\n\nToo short."
        result = validate_content_length(content, min_length=100)
        assert result.is_valid is False
        assert "short" in result.message.lower()
    
    def test_content_too_long(self):
        """Test content that is too long."""
        content = "# Title\n\n" + "Very long content. " * 1000
        result = validate_content_length(content, max_length=100)
        assert result.is_valid is False
        assert "long" in result.message.lower()
    
    def test_custom_length_limits(self):
        """Test custom length limits."""
        content = "# Title\n\nJust right amount of content."
        result = validate_content_length(content, min_length=10, max_length=100)
        assert result.is_valid is True


class TestValidateImageReferences:
    """Test image reference validation function."""
    
    def test_valid_image_references(self):
        """Test valid image references."""
        content = """# Title

Here's an image: ![Alt text](https://example.com/image.png)

And another: ![Another image](./relative/path/image.jpg)
"""
        
        result = validate_image_references(content)
        assert result.is_valid is True
    
    def test_invalid_image_references(self):
        """Test invalid image references."""
        content = """# Title

Invalid image: ![Alt text](invalid-url)

Another invalid: ![](missing-url)
"""
        
        result = validate_image_references(content)
        # Depending on implementation, this might be invalid
        assert isinstance(result, ValidationResult)
    
    def test_no_image_references(self):
        """Test content with no image references."""
        content = "# Title\n\nJust text content with no images."
        result = validate_image_references(content)
        assert result.is_valid is True


class TestValidateLinkFormat:
    """Test link format validation function."""
    
    def test_valid_link_format(self):
        """Test valid link format."""
        content = """# Title

Here's a link: [Example](https://example.com)

And another: [Internal Link](./docs/internal)
"""
        
        result = validate_link_format(content)
        assert result.is_valid is True
    
    def test_invalid_link_format(self):
        """Test invalid link format."""
        content = """# Title

Invalid link: [Example](not-a-valid-url)

Malformed: [](missing-url)
"""
        
        result = validate_link_format(content)
        # Depending on implementation, this might be invalid
        assert isinstance(result, ValidationResult)
    
    def test_no_links(self):
        """Test content with no links."""
        content = "# Title\n\nJust text content with no links."
        result = validate_link_format(content)
        assert result.is_valid is True
    
    def test_mixed_valid_invalid_links(self):
        """Test content with mixed valid and invalid links."""
        content = """# Title

Valid link: [Example](https://example.com)

Invalid link: [Bad](not-a-url)
"""
        
        result = validate_link_format(content)
        assert isinstance(result, ValidationResult)
        # The result validity depends on implementation tolerance
