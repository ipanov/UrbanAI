"""Utility functions for the Wiki MCP server."""

import os
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime


def setup_logging(level: str = "INFO", log_file: Optional[str] = None) -> None:
    """Setup logging configuration.
    
    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
        log_file: Optional log file path
    """
    log_level = getattr(logging, level.upper(), logging.INFO)
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Setup console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    
    handlers = [console_handler]
    
    # Setup file handler if specified
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        handlers.append(file_handler)
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        handlers=handlers,
        force=True
    )


def get_environment_config() -> Dict[str, Any]:
    """Get configuration from environment variables.
    
    Returns:
        Dictionary with configuration values
    """
    return {
        "azure_devops_pat": os.getenv("AZURE_DEVOPS_PAT"),
        "organization_url": os.getenv("AZURE_DEVOPS_ORGANIZATION_URL"),
        "project": os.getenv("AZURE_DEVOPS_DEFAULT_PROJECT", "UrbanAI"),
        "default_template": os.getenv("WIKI_DEFAULT_TEMPLATE"),
        "max_bulk_operations": int(os.getenv("WIKI_MAX_BULK_OPERATIONS", "50")),
        "log_level": os.getenv("LOG_LEVEL", "INFO"),
        "templates_dir": os.getenv("WIKI_TEMPLATES_DIR"),
    }


def validate_environment() -> Dict[str, Any]:
    """Validate required environment variables.
    
    Returns:
        Dictionary with validation results
    """
    required_vars = [
        "AZURE_DEVOPS_PAT",
        "AZURE_DEVOPS_ORGANIZATION_URL",
    ]
    
    missing_vars = []
    invalid_vars = []
    
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        elif var == "AZURE_DEVOPS_ORGANIZATION_URL" and not value.startswith("https://"):
            invalid_vars.append(f"{var}: must start with https://")
    
    return {
        "valid": len(missing_vars) == 0 and len(invalid_vars) == 0,
        "missing_vars": missing_vars,
        "invalid_vars": invalid_vars,
        "config": get_environment_config()
    }


def sanitize_path(path: str) -> str:
    """Sanitize a wiki page path.
    
    Args:
        path: Raw path string
        
    Returns:
        Sanitized path
    """
    # Remove leading/trailing whitespace
    path = path.strip()
    
    # Ensure path starts with /
    if not path.startswith("/"):
        path = "/" + path
    
    # Remove double slashes
    path = "/".join(part for part in path.split("/") if part)
    
    # Ensure we have a leading slash
    if not path.startswith("/"):
        path = "/" + path
    
    return path


def extract_title_from_path(path: str) -> str:
    """Extract a title from a wiki page path.
    
    Args:
        path: Wiki page path
        
    Returns:
        Extracted title
    """
    # Get the last part of the path
    title = path.strip("/").split("/")[-1]
    
    # Replace hyphens and underscores with spaces
    title = title.replace("-", " ").replace("_", " ")
    
    # Capitalize words
    title = " ".join(word.capitalize() for word in title.split())
    
    return title or "Untitled Page"


def format_datetime(dt: Optional[datetime] = None) -> str:
    """Format datetime for wiki content.
    
    Args:
        dt: Datetime to format (defaults to now)
        
    Returns:
        Formatted datetime string
    """
    if dt is None:
        dt = datetime.now()
    
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def format_date(dt: Optional[datetime] = None) -> str:
    """Format date for wiki content.
    
    Args:
        dt: Datetime to format (defaults to now)
        
    Returns:
        Formatted date string
    """
    if dt is None:
        dt = datetime.now()
    
    return dt.strftime("%Y-%m-%d")


def create_backup_name(original_path: str) -> str:
    """Create a backup name for a wiki page.
    
    Args:
        original_path: Original page path
        
    Returns:
        Backup page path
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    path_parts = original_path.strip("/").split("/")
    
    if len(path_parts) > 1:
        # /section/page -> /section/page_backup_20231201_123456
        return "/" + "/".join(path_parts[:-1]) + f"/{path_parts[-1]}_backup_{timestamp}"
    else:
        # /page -> /page_backup_20231201_123456
        return f"/{path_parts[0]}_backup_{timestamp}"


def parse_wiki_url(url: str) -> Dict[str, str]:
    """Parse a wiki URL to extract components.
    
    Args:
        url: Wiki URL
        
    Returns:
        Dictionary with URL components
    """
    # Example URL: https://dev.azure.com/org/project/_wiki/wikis/wiki_id/pagePath
    parts = url.split("/")
    
    result = {"url": url}
    
    if "dev.azure.com" in url:
        try:
            org_index = parts.index("dev.azure.com") + 1
            project_index = org_index + 1
            
            if org_index < len(parts):
                result["organization"] = parts[org_index]
            
            if project_index < len(parts):
                result["project"] = parts[project_index]
            
            if "_wiki" in parts:
                wiki_index = parts.index("_wiki")
                if wiki_index + 2 < len(parts):
                    result["wiki_id"] = parts[wiki_index + 2]
                
                if wiki_index + 3 < len(parts):
                    result["page_path"] = "/" + "/".join(parts[wiki_index + 3:])
        except (ValueError, IndexError):
            pass
    
    return result


def ensure_directory_exists(path: str) -> None:
    """Ensure a directory exists, creating it if necessary.
    
    Args:
        path: Directory path
    """
    Path(path).mkdir(parents=True, exist_ok=True)


def load_file_safely(file_path: str, encoding: str = "utf-8") -> Optional[str]:
    """Safely load a file's content.
    
    Args:
        file_path: Path to the file
        encoding: File encoding
        
    Returns:
        File content or None if error
    """
    try:
        with open(file_path, 'r', encoding=encoding) as f:
            return f.read()
    except (FileNotFoundError, PermissionError, UnicodeDecodeError) as e:
        logging.warning(f"Failed to load file {file_path}: {e}")
        return None


def save_file_safely(file_path: str, content: str, encoding: str = "utf-8") -> bool:
    """Safely save content to a file.
    
    Args:
        file_path: Path to save the file
        content: Content to save
        encoding: File encoding
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Ensure directory exists
        ensure_directory_exists(str(Path(file_path).parent))
        
        with open(file_path, 'w', encoding=encoding) as f:
            f.write(content)
        return True
    except (PermissionError, OSError) as e:
        logging.error(f"Failed to save file {file_path}: {e}")
        return False
