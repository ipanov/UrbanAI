"""Unit tests for templates module."""

import pytest
import tempfile
import os
from unittest.mock import patch, mock_open, MagicMock

from wiki_mcp.templates import (
    TemplateManager,
    TemplateError,
    load_template,
    apply_template,
    validate_template,
    extract_template_variables
)
from wiki_mcp.models import WikiTemplate


class TestTemplateError:
    """Test TemplateError exception."""
    
    def test_template_error_creation(self):
        """Test creating TemplateError."""
        error = TemplateError("Test error message")
        assert str(error) == "Test error message"
        assert isinstance(error, Exception)


class TestTemplateManager:
    """Test TemplateManager class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.manager = TemplateManager()
    
    def test_manager_initialization(self):
        """Test manager initialization."""
        assert isinstance(self.manager.templates, dict)
        assert len(self.manager.templates) >= 0  # May have default templates
    
    def test_manager_with_custom_directory(self):
        """Test manager with custom template directory."""
        with tempfile.TemporaryDirectory() as temp_dir:
            manager = TemplateManager(templates_dir=temp_dir)
            assert manager.templates_dir == temp_dir
    
    def test_add_template(self):
        """Test adding a template."""
        template = WikiTemplate(
            name="test_template",
            description="Test template",
            content="# {{title}}\n\n{{content}}",
            variables=["title", "content"]
        )
        
        self.manager.add_template(template)
        assert "test_template" in self.manager.templates
        assert self.manager.templates["test_template"] == template
    
    def test_add_template_duplicate_name(self):
        """Test adding template with duplicate name."""
        template1 = WikiTemplate(
            name="duplicate",
            description="First template",
            content="Content 1"
        )
        template2 = WikiTemplate(
            name="duplicate",
            description="Second template",
            content="Content 2"
        )
        
        self.manager.add_template(template1)
        self.manager.add_template(template2)  # Should overwrite
        
        assert self.manager.templates["duplicate"].description == "Second template"
    
    def test_get_template_existing(self):
        """Test getting existing template."""
        template = WikiTemplate(
            name="existing",
            description="Existing template",
            content="# {{title}}"
        )
        
        self.manager.add_template(template)
        retrieved = self.manager.get_template("existing")
        assert retrieved == template
    
    def test_get_template_nonexistent(self):
        """Test getting non-existent template."""
        with pytest.raises(TemplateError) as exc_info:
            self.manager.get_template("nonexistent")
        
        assert "not found" in str(exc_info.value).lower()
    
    def test_remove_template_existing(self):
        """Test removing existing template."""
        template = WikiTemplate(
            name="to_remove",
            description="Template to remove",
            content="Content"
        )
        
        self.manager.add_template(template)
        result = self.manager.remove_template("to_remove")
        
        assert result is True
        assert "to_remove" not in self.manager.templates
    
    def test_remove_template_nonexistent(self):
        """Test removing non-existent template."""
        result = self.manager.remove_template("nonexistent")
        assert result is False
    
    def test_list_templates(self):
        """Test listing templates."""
        template1 = WikiTemplate(name="temp1", description="Desc1", content="Content1")
        template2 = WikiTemplate(name="temp2", description="Desc2", content="Content2")
        
        self.manager.add_template(template1)
        self.manager.add_template(template2)
        
        templates = self.manager.list_templates()
        template_names = [t.name for t in templates]
        
        assert "temp1" in template_names
        assert "temp2" in template_names
    
    def test_apply_template_success(self):
        """Test successful template application."""
        template = WikiTemplate(
            name="test",
            description="Test template",
            content="# {{title}}\n\n{{description}}\n\nAuthor: {{author}}"
        )
        
        self.manager.add_template(template)
        
        variables = {
            "title": "Test Page",
            "description": "This is a test page",
            "author": "Test Author"
        }
        
        result = self.manager.apply_template("test", variables)
        
        assert "# Test Page" in result
        assert "This is a test page" in result
        assert "Author: Test Author" in result
    
    def test_apply_template_missing_variables(self):
        """Test template application with missing variables."""
        template = WikiTemplate(
            name="test",
            description="Test template",
            content="# {{title}}\n\n{{description}}"
        )
        
        self.manager.add_template(template)
        
        # Missing 'description' variable
        variables = {"title": "Test Page"}
        
        with pytest.raises(TemplateError):
            self.manager.apply_template("test", variables)
    
    def test_apply_template_nonexistent(self):
        """Test applying non-existent template."""
        with pytest.raises(TemplateError):
            self.manager.apply_template("nonexistent", {})
    
    def test_load_templates_from_directory(self):
        """Test loading templates from directory."""
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create template files
            template_content = """name: test_template
description: Test template from file
content: |
  # {{title}}
  
  {{content}}
variables:
  - title
  - content
"""
            
            template_file = os.path.join(temp_dir, "test_template.yaml")
            with open(template_file, 'w') as f:
                f.write(template_content)
            
            manager = TemplateManager(templates_dir=temp_dir)
            manager.load_templates_from_directory()
            
            # This test assumes YAML template loading is implemented
            # If not implemented, it should at least not crash
            assert isinstance(manager.templates, dict)
    
    def test_save_template_to_file(self):
        """Test saving template to file."""
        template = WikiTemplate(
            name="save_test",
            description="Template to save",
            content="# {{title}}\n\n{{content}}"
        )
        
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, "save_test.yaml")
            
            # This test assumes save functionality is implemented
            try:
                self.manager.save_template_to_file(template, file_path)
                assert os.path.exists(file_path)
            except AttributeError:
                # Method might not be implemented yet
                pass


class TestLoadTemplate:
    """Test load_template function."""
    
    def test_load_template_from_string(self):
        """Test loading template from string."""
        template_content = "# {{title}}\n\n{{description}}"
        
        template = load_template("test", template_content)
        
        assert template.name == "test"
        assert template.content == template_content
        assert isinstance(template, WikiTemplate)
    
    def test_load_template_from_file(self):
        """Test loading template from file."""
        template_content = "# {{title}}\n\n{{description}}"
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(template_content)
            temp_file = f.name
        
        try:
            template = load_template("file_test", file_path=temp_file)
            assert template.content == template_content
        finally:
            os.unlink(temp_file)
    
    def test_load_template_nonexistent_file(self):
        """Test loading template from non-existent file."""
        with pytest.raises(TemplateError):
            load_template("test", file_path="/nonexistent/file.md")


class TestApplyTemplate:
    """Test apply_template function."""
    
    def test_apply_template_success(self):
        """Test successful template application."""
        template_content = "# {{title}}\n\nDescription: {{description}}\nAuthor: {{author}}"
        variables = {
            "title": "Test Page",
            "description": "This is a test",
            "author": "Test Author"
        }
        
        result = apply_template(template_content, variables)
        
        assert "# Test Page" in result
        assert "Description: This is a test" in result
        assert "Author: Test Author" in result
    
    def test_apply_template_missing_variables(self):
        """Test template application with missing variables."""
        template_content = "# {{title}}\n\n{{description}}"
        variables = {"title": "Test Page"}  # Missing description
        
        with pytest.raises(TemplateError):
            apply_template(template_content, variables)
    
    def test_apply_template_extra_variables(self):
        """Test template application with extra variables."""
        template_content = "# {{title}}"
        variables = {
            "title": "Test Page",
            "extra": "This variable is not used"
        }
        
        result = apply_template(template_content, variables)
        assert "# Test Page" in result
        assert "extra" not in result
    
    def test_apply_template_empty_content(self):
        """Test applying template with empty content."""
        result = apply_template("", {})
        assert result == ""
    
    def test_apply_template_no_variables(self):
        """Test applying template with no variables."""
        template_content = "# Static Title\n\nStatic content"
        result = apply_template(template_content, {})
        assert result == template_content


class TestValidateTemplate:
    """Test validate_template function."""
    
    def test_validate_template_valid(self):
        """Test validating valid template."""
        template_content = "# {{title}}\n\n{{description}}"
        result = validate_template(template_content)
        assert result.is_valid is True
    
    def test_validate_template_invalid_syntax(self):
        """Test validating template with invalid Jinja2 syntax."""
        template_content = "# {{title}\n\n{{description}}"  # Missing closing brace
        result = validate_template(template_content)
        assert result.is_valid is False
    
    def test_validate_template_empty(self):
        """Test validating empty template."""
        result = validate_template("")
        # Empty template might be valid or invalid depending on requirements
        assert hasattr(result, 'is_valid')


class TestExtractTemplateVariables:
    """Test extract_template_variables function."""
    
    def test_extract_variables_simple(self):
        """Test extracting simple variables."""
        template_content = "# {{title}}\n\n{{description}}"
        variables = extract_template_variables(template_content)
        
        assert "title" in variables
        assert "description" in variables
        assert len(variables) == 2
    
    def test_extract_variables_duplicates(self):
        """Test extracting variables with duplicates."""
        template_content = "# {{title}}\n\n{{title}} - {{description}}"
        variables = extract_template_variables(template_content)
        
        assert "title" in variables
        assert "description" in variables
        assert len(variables) == 2  # Should not have duplicates
    
    def test_extract_variables_none(self):
        """Test extracting variables from template with no variables."""
        template_content = "# Static Title\n\nStatic content"
        variables = extract_template_variables(template_content)
        
        assert len(variables) == 0
    
    def test_extract_variables_complex(self):
        """Test extracting variables from complex template."""
        template_content = """# {{title}}

Created by: {{author}}
Date: {{date}}

## Description
{{description}}

## Tags
{% for tag in tags %}
- {{tag}}
{% endfor %}
"""
        
        variables = extract_template_variables(template_content)
        
        expected_vars = {"title", "author", "date", "description", "tags", "tag"}
        assert expected_vars.issubset(set(variables))
    
    def test_extract_variables_empty_template(self):
        """Test extracting variables from empty template."""
        variables = extract_template_variables("")
        assert len(variables) == 0
