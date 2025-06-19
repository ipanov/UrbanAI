"""Template management for the Wiki MCP server."""

import os
import re
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

from .models import WikiTemplate, WikiPageContent, WikiPageMetadata, ValidationResult


class TemplateManager:
    """Manages wiki page templates."""

    def __init__(self, templates_dir: Optional[str] = None):
        """Initialize the template manager.
        
        Args:
            templates_dir: Directory containing template files
        """
        self.templates_dir = templates_dir or self._get_default_templates_dir()
        self.templates: Dict[str, WikiTemplate] = {}
        self._load_templates()

    def _get_default_templates_dir(self) -> str:
        """Get the default templates directory."""
        current_dir = Path(__file__).parent.parent.parent
        return str(current_dir / "templates")

    def _load_templates(self) -> None:
        """Load all templates from the templates directory."""
        templates_path = Path(self.templates_dir)
        
        if not templates_path.exists():
            # Create default templates if directory doesn't exist
            templates_path.mkdir(parents=True, exist_ok=True)
            self._create_default_templates()

        for template_file in templates_path.glob("*.md"):
            try:
                template = self._load_template_file(template_file)
                self.templates[template.name] = template
            except Exception as e:
                print(f"Warning: Failed to load template {template_file}: {e}")

    def _load_template_file(self, file_path: Path) -> WikiTemplate:
        """Load a template from a file.
        
        Args:
            file_path: Path to the template file
            
        Returns:
            WikiTemplate object
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract metadata from the template content
        name = file_path.stem
        description = self._extract_description(content)
        variables = self._extract_variables(content)
        category = self._extract_category(content)

        return WikiTemplate(
            name=name,
            description=description,
            content=content,
            variables=variables,
            category=category
        )

    def _extract_description(self, content: str) -> str:
        """Extract description from template content."""
        lines = content.split('\n')
        for line in lines:
            if line.startswith('<!-- Description:'):
                return line.replace('<!-- Description:', '').replace('-->', '').strip()
        return f"Template for {content.split('# ')[-1].split('\\n')[0] if '# ' in content else 'documentation'}"

    def _extract_variables(self, content: str) -> List[str]:
        """Extract template variables from content."""
        # Find all {{VARIABLE}} patterns
        pattern = r'\{\{(\w+)\}\}'
        matches = re.findall(pattern, content)
        return list(set(matches))  # Remove duplicates

    def _extract_category(self, content: str) -> Optional[str]:
        """Extract category from template content."""
        lines = content.split('\n')
        for line in lines:
            if line.startswith('<!-- Category:'):
                return line.replace('<!-- Category:', '').replace('-->', '').strip()
        return None

    def get_template(self, name: str) -> Optional[WikiTemplate]:
        """Get a template by name.
        
        Args:
            name: Template name
            
        Returns:
            WikiTemplate if found, None otherwise
        """
        return self.templates.get(name)

    def list_templates(self) -> List[WikiTemplate]:
        """Get list of all available templates.
        
        Returns:
            List of WikiTemplate objects
        """
        return list(self.templates.values())

    def apply_template(
        self, 
        template_name: str, 
        variables: Dict[str, str],
        path: str,
        title: Optional[str] = None
    ) -> Optional[WikiPageContent]:
        """Apply a template with the given variables.
        
        Args:
            template_name: Name of the template to apply
            variables: Variables to substitute in the template
            path: Path for the new page
            title: Title for the new page (optional)
            
        Returns:
            WikiPageContent if successful, None otherwise
        """
        template = self.get_template(template_name)
        if not template:
            return None

        # Add default variables
        default_vars = {
            'DATE': datetime.now().strftime('%Y-%m-%d'),
            'DATETIME': datetime.now().isoformat(),
            'TITLE': title or path.split('/')[-1].replace('-', ' ').title()
        }
        
        # Merge provided variables with defaults
        all_variables = {**default_vars, **variables}

        # Replace variables in content
        content = template.content
        for var_name, var_value in all_variables.items():
            placeholder = f"{{{{{var_name}}}}}"
            content = content.replace(placeholder, str(var_value))

        # Create metadata
        metadata = WikiPageMetadata(
            path=path,
            title=all_variables.get('TITLE', title or 'Untitled'),
            tags=[template.category] if template.category else []
        )

        return WikiPageContent(
            content=content,
            metadata=metadata,
            template_used=template_name
        )

    def validate_template(self, template_name: str, variables: Dict[str, str]) -> ValidationResult:
        """Validate that all required variables are provided for a template.
        
        Args:
            template_name: Name of the template to validate
            variables: Variables provided for the template
            
        Returns:
            ValidationResult
        """
        template = self.get_template(template_name)
        if not template:
            return ValidationResult(
                valid=False,
                errors=[f"Template '{template_name}' not found"]
            )

        errors = []
        warnings = []
        suggestions = []

        # Check for missing required variables
        required_vars = set(template.variables) - {'DATE', 'DATETIME', 'TITLE'}
        provided_vars = set(variables.keys())
        missing_vars = required_vars - provided_vars

        if missing_vars:
            errors.extend([f"Missing required variable: {var}" for var in missing_vars])

        # Check for unused variables
        unused_vars = provided_vars - set(template.variables)
        if unused_vars:
            warnings.extend([f"Variable '{var}' not used in template" for var in unused_vars])

        # Suggestions for improvement
        if not variables.get('TITLE'):
            suggestions.append("Consider providing a TITLE variable for better page naming")

        return ValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            suggestions=suggestions
        )

    def _create_default_templates(self) -> None:
        """Create default templates."""
        templates_dir = Path(self.templates_dir)
        
        # Architecture template
        arch_template = """<!-- Description: Template for architecture documentation -->
<!-- Category: architecture -->
# {{TITLE}}

## Overview
{{OVERVIEW}}

## System Architecture
{{ARCHITECTURE_DESCRIPTION}}

### Components
{{COMPONENTS}}

### Technologies Used
{{TECHNOLOGIES}}

## Design Decisions
{{DESIGN_DECISIONS}}

## Diagrams
{{DIAGRAMS}}

## Related Documentation
- [API Documentation](../API/Overview)
- [Development Guide](../Development/Guide)

---
*Last updated: {{DATE}}*
*Created from template: architecture*
"""

        # API Documentation template
        api_template = """<!-- Description: Template for API documentation -->
<!-- Category: api -->
# {{TITLE}}

## Overview
{{API_OVERVIEW}}

## Authentication
{{AUTHENTICATION}}

## Base URL
`{{BASE_URL}}`

## Endpoints

### {{ENDPOINT_NAME}}
{{ENDPOINT_DESCRIPTION}}

**Method:** `{{METHOD}}`
**Path:** `{{PATH}}`

#### Parameters
{{PARAMETERS}}

#### Request Body
{{REQUEST_BODY}}

#### Response
{{RESPONSE}}

#### Example
{{EXAMPLE}}

## Error Handling
{{ERROR_HANDLING}}

## Rate Limiting
{{RATE_LIMITING}}

---
*Last updated: {{DATE}}*
*Created from template: api_documentation*
"""

        # Development Guide template
        dev_template = """<!-- Description: Template for development guides -->
<!-- Category: development -->
# {{TITLE}}

## Prerequisites
{{PREREQUISITES}}

## Setup Instructions
{{SETUP_INSTRUCTIONS}}

## Development Workflow
{{WORKFLOW}}

### Getting Started
{{GETTING_STARTED}}

### Code Standards
{{CODE_STANDARDS}}

### Testing
{{TESTING}}

### Deployment
{{DEPLOYMENT}}

## Troubleshooting
{{TROUBLESHOOTING}}

## Contributing
{{CONTRIBUTING}}

---
*Last updated: {{DATE}}*
*Created from template: development_guide*
"""

        # Feature Overview template
        feature_template = """<!-- Description: Template for feature documentation -->
<!-- Category: feature -->
# {{TITLE}}

## Purpose
{{PURPOSE}}

## Description
{{DESCRIPTION}}

## User Stories
{{USER_STORIES}}

## Technical Implementation
{{TECHNICAL_IMPLEMENTATION}}

## Requirements
{{REQUIREMENTS}}

## Dependencies
{{DEPENDENCIES}}

## Testing Strategy
{{TESTING_STRATEGY}}

## Acceptance Criteria
{{ACCEPTANCE_CRITERIA}}

## Related Features
{{RELATED_FEATURES}}

---
*Last updated: {{DATE}}*
*Created from template: feature_overview*
"""

        # Write templates to files
        templates = {
            "architecture.md": arch_template,
            "api_documentation.md": api_template,
            "development_guide.md": dev_template,
            "feature_overview.md": feature_template
        }

        for filename, content in templates.items():
            file_path = templates_dir / filename
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
