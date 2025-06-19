"""Unit tests for utils module."""

import pytest
import os
import tempfile
from unittest.mock import patch, MagicMock
from datetime import datetime

from wiki_mcp.utils import (
    setup_logging,
    validate_environment,
    sanitize_path,
    extract_title_from_path,
    format_date,
    ensure_directory_exists,
    load_config_from_env,
    get_logger
)


class TestSetupLogging:
    """Test logging setup functions."""
    
    def test_setup_logging_default_level(self):
        """Test setup logging with default level."""
        logger = setup_logging()
        assert logger.level == 20  # INFO level
    
    def test_setup_logging_custom_level(self):
        """Test setup logging with custom level."""
        logger = setup_logging(level="DEBUG")
        assert logger.level == 10  # DEBUG level
    
    def test_setup_logging_invalid_level(self):
        """Test setup logging with invalid level."""
        # Should not raise an error, should use default
        logger = setup_logging(level="INVALID")
        assert logger.level == 20  # INFO level


class TestValidateEnvironment:
    """Test environment validation."""
    
    def test_validate_environment_success(self):
        """Test successful environment validation."""
        with patch.dict(os.environ, {
            'AZURE_DEVOPS_ORG_URL': 'https://dev.azure.com/myorg',
            'AZURE_DEVOPS_PROJECT': 'MyProject',
            'AZURE_DEVOPS_PAT': 'dummy_token'
        }):
            result = validate_environment()
            assert result is True
    
    def test_validate_environment_missing_required_vars(self):
        """Test environment validation with missing required variables."""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError) as exc_info:
                validate_environment()
            
            error_message = str(exc_info.value)
            assert "AZURE_DEVOPS_ORG_URL" in error_message
            assert "AZURE_DEVOPS_PROJECT" in error_message
            assert "AZURE_DEVOPS_PAT" in error_message
    
    @patch.dict(os.environ, {
        'AZURE_DEVOPS_ORG_URL': 'https://dev.azure.com/myorg',
        'AZURE_DEVOPS_PROJECT': 'MyProject'
    })
    def test_validate_environment_partial_missing(self):
        """Test environment validation with partially missing variables."""
        with pytest.raises(ValueError) as exc_info:
            validate_environment()
        
        error_message = str(exc_info.value)
        assert "AZURE_DEVOPS_PAT" in error_message


class TestSanitizePath:
    """Test path sanitization functions."""
    
    def test_sanitize_simple_path(self):
        """Test sanitizing a simple path."""
        result = sanitize_path("/docs/api")
        assert result == "/docs/api"
    
    def test_sanitize_path_with_special_chars(self):
        """Test sanitizing path with special characters."""
        result = sanitize_path("/docs/api with spaces & symbols!")
        assert result == "/docs/api-with-spaces-symbols"
    
    def test_sanitize_path_with_leading_trailing_spaces(self):
        """Test sanitizing path with leading/trailing spaces."""
        result = sanitize_path("  /docs/api  ")
        assert result == "/docs/api"
    
    def test_sanitize_empty_path(self):
        """Test sanitizing empty path."""
        result = sanitize_path("")
        assert result == ""
    
    def test_sanitize_path_with_multiple_slashes(self):
        """Test sanitizing path with multiple consecutive slashes."""
        result = sanitize_path("/docs//api///guide")
        assert result == "/docs/api/guide"
    
    def test_sanitize_path_unicode_characters(self):
        """Test sanitizing path with unicode characters."""
        result = sanitize_path("/docs/api-ñoño")
        assert result == "/docs/api-nono"


class TestExtractTitleFromPath:
    """Test title extraction from paths."""
    
    def test_extract_title_simple_path(self):
        """Test extracting title from simple path."""
        result = extract_title_from_path("/docs/api")
        assert result == "Api"
    
    def test_extract_title_with_hyphens(self):
        """Test extracting title from path with hyphens."""
        result = extract_title_from_path("/docs/api-documentation")
        assert result == "Api Documentation"
    
    def test_extract_title_with_underscores(self):
        """Test extracting title from path with underscores."""
        result = extract_title_from_path("/docs/api_documentation")
        assert result == "Api Documentation"
    
    def test_extract_title_nested_path(self):
        """Test extracting title from nested path."""
        result = extract_title_from_path("/docs/guides/api-guide")
        assert result == "Api Guide"
    
    def test_extract_title_single_word(self):
        """Test extracting title from single word."""
        result = extract_title_from_path("/api")
        assert result == "Api"
    
    def test_extract_title_root_path(self):
        """Test extracting title from root path."""
        result = extract_title_from_path("/")
        assert result == "Home"
    
    def test_extract_title_empty_path(self):
        """Test extracting title from empty path."""
        result = extract_title_from_path("")
        assert result == "Home"


class TestFormatDate:
    """Test date formatting functions."""
    
    def test_format_date_datetime_object(self):
        """Test formatting datetime object."""
        dt = datetime(2023, 12, 25, 15, 30, 45)
        result = format_date(dt)
        assert result == "2023-12-25 15:30:45"
    
    def test_format_date_string_input(self):
        """Test formatting string input."""
        result = format_date("2023-12-25T15:30:45")
        assert result == "2023-12-25T15:30:45"  # Should pass through
    
    def test_format_date_custom_format(self):
        """Test formatting with custom format."""
        dt = datetime(2023, 12, 25, 15, 30, 45)
        result = format_date(dt, format_str="%Y-%m-%d")
        assert result == "2023-12-25"
    
    def test_format_date_none_input(self):
        """Test formatting None input."""
        result = format_date(None)
        assert result is None


class TestEnsureDirectoryExists:
    """Test directory creation utility."""
    
    def test_ensure_directory_exists_new_directory(self):
        """Test creating new directory."""
        with tempfile.TemporaryDirectory() as temp_dir:
            test_path = os.path.join(temp_dir, "test", "nested", "directory")
            ensure_directory_exists(test_path)
            assert os.path.exists(test_path)
            assert os.path.isdir(test_path)
    
    def test_ensure_directory_exists_existing_directory(self):
        """Test with existing directory."""
        with tempfile.TemporaryDirectory() as temp_dir:
            # Should not raise any exception
            ensure_directory_exists(temp_dir)
            assert os.path.exists(temp_dir)
    
    def test_ensure_directory_exists_file_path(self):
        """Test with file path (should create parent directory)."""
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, "subdir", "file.txt")
            ensure_directory_exists(os.path.dirname(file_path))
            assert os.path.exists(os.path.dirname(file_path))


class TestLoadConfigFromEnv:
    """Test configuration loading from environment."""
    
    def test_load_config_success(self):
        """Test successful configuration loading."""
        with patch.dict(os.environ, {
            'AZURE_DEVOPS_ORG_URL': 'https://dev.azure.com/myorg',
            'AZURE_DEVOPS_PROJECT': 'MyProject',
            'AZURE_DEVOPS_PAT': 'dummy_token',
            'AZURE_DEVOPS_WIKI_ID': 'wiki123'
        }):
            config = load_config_from_env()
            assert config.organization_url == 'https://dev.azure.com/myorg'
            assert config.project == 'MyProject'
            assert config.wiki_id == 'wiki123'
    
    def test_load_config_minimal(self):
        """Test loading minimal configuration."""
        with patch.dict(os.environ, {
            'AZURE_DEVOPS_ORG_URL': 'https://dev.azure.com/myorg',
            'AZURE_DEVOPS_PROJECT': 'MyProject',
            'AZURE_DEVOPS_PAT': 'dummy_token'
        }):
            config = load_config_from_env()
            assert config.organization_url == 'https://dev.azure.com/myorg'
            assert config.project == 'MyProject'
            assert config.wiki_id is None
    
    def test_load_config_missing_required(self):
        """Test loading configuration with missing required variables."""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError):
                load_config_from_env()


class TestGetLogger:
    """Test logger getter function."""
    
    def test_get_logger_default_name(self):
        """Test getting logger with default name."""
        logger = get_logger()
        assert logger.name == "wiki_mcp"
    
    def test_get_logger_custom_name(self):
        """Test getting logger with custom name."""
        logger = get_logger("custom_logger")
        assert logger.name == "custom_logger"
    
    def test_get_logger_returns_same_instance(self):
        """Test that get_logger returns the same instance for same name."""
        logger1 = get_logger("test_logger")
        logger2 = get_logger("test_logger")
        assert logger1 is logger2
