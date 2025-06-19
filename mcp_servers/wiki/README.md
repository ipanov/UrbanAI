# UrbanAI Wiki MCP Server

A Model Context Protocol (MCP) server for managing Azure DevOps Wiki documentation for the UrbanAI project.

## Overview

This MCP server provides tools for creating, updating, and managing wiki documentation in Azure DevOps. It's specifically designed for the UrbanAI project - an urban issue reporting and regulation management system.

## Features

- **Wiki Management**: Create, update, and delete wiki pages
- **Template System**: Use predefined templates for consistent documentation
- **Content Validation**: Validate markdown content and structure
- **Batch Operations**: Perform bulk operations on multiple pages
- **Error Handling**: Robust error handling with detailed logging
- **Testing**: Comprehensive unit and integration tests

## Installation

### Prerequisites

- Python 3.10 or later
- Azure DevOps account with wiki access
- Personal Access Token (PAT) with wiki permissions

### Setup

1. Clone the repository:
```bash
git clone https://github.com/urbanai/urban-ai-wiki-mcp.git
cd urban-ai-wiki-mcp
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -e .[dev]
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Azure DevOps configuration
```

## Configuration

Create a `.env` file with the following variables:

```env
AZURE_DEVOPS_PAT=your_personal_access_token
AZURE_DEVOPS_ORGANIZATION_URL=https://dev.azure.com/your-org
AZURE_DEVOPS_DEFAULT_PROJECT=YourProject
```

## Usage

### Running the Server

```bash
# Development mode
python -m wiki_mcp.server --dev

# Production mode
urban-ai-wiki-mcp
```

### MCP Integration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "urban-ai-wiki": {
      "command": "python",
      "args": ["-m", "wiki_mcp.server"],
      "env": {
        "AZURE_DEVOPS_PAT": "your_pat_here"
      }
    }
  }
}
```

## Available Tools

### Wiki Management
- `create_wiki_page`: Create a new wiki page
- `update_wiki_page`: Update existing wiki page content
- `delete_wiki_page`: Delete a wiki page
- `get_wiki_page`: Retrieve wiki page content
- `list_wiki_pages`: List all pages in a wiki

### Template System
- `list_templates`: Get available page templates
- `apply_template`: Apply a template to create new content
- `validate_template`: Validate template structure

### Batch Operations
- `bulk_create_pages`: Create multiple pages at once
- `bulk_update_pages`: Update multiple pages
- `sync_documentation`: Synchronize with project documentation

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run unit tests only
pytest tests/unit/

# Run integration tests only
pytest tests/integration/

# Run with coverage
pytest --cov=wiki_mcp --cov-report=html
```

### Code Quality

```bash
# Format code
black src/ tests/
isort src/ tests/

# Lint code
flake8 src/ tests/

# Type checking
mypy src/
```

### Pre-commit Hooks

```bash
pre-commit install
pre-commit run --all-files
```

## Project Structure

```
urban-ai-wiki-mcp/
├── src/
│   └── wiki_mcp/
│       ├── __init__.py
│       ├── server.py          # Main MCP server
│       ├── models.py          # Data models
│       ├── client.py          # Azure DevOps client
│       ├── templates.py       # Template management
│       ├── validators.py      # Content validation
│       └── utils.py           # Utility functions
├── tests/
│   ├── unit/
│   │   ├── test_client.py
│   │   ├── test_models.py
│   │   ├── test_templates.py
│   │   └── test_validators.py
│   ├── integration/
│   │   ├── test_server.py
│   │   └── test_wiki_operations.py
│   └── fixtures/
│       ├── mock_responses.py
│       └── test_data.py
├── templates/
│   ├── architecture.md
│   ├── api_documentation.md
│   ├── development_guide.md
│   └── feature_overview.md
├── pyproject.toml
├── README.md
├── LICENSE
├── .env.example
├── .gitignore
└── .pre-commit-config.yaml
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact the UrbanAI team

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
