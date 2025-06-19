"""Content validation for the Wiki MCP server."""

import re
from typing import List, Dict, Any
from .models import ValidationResult, ValidationRule


class ContentValidator:
    """Validates wiki page content."""

    def __init__(self):
        """Initialize the validator with default rules."""
        self.rules = self._create_default_rules()

    def _create_default_rules(self) -> List[ValidationRule]:
        """Create default validation rules."""
        return [
            ValidationRule(
                name="has_title",
                description="Page must have a title (H1 heading)",
                pattern=r"^#\s+.+",
                required=True,
                error_message="Page must start with a title (# Title)"
            ),
            ValidationRule(
                name="no_empty_sections",
                description="Sections should not be empty",
                pattern=r"#{2,6}\s+[^\n]*\n\s*#{2,6}",
                required=False,
                error_message="Empty sections found - consider adding content or removing section"
            ),
            ValidationRule(
                name="valid_links",
                description="Links should be properly formatted",
                pattern=r"\[([^\]]+)\]\(([^)]+)\)",
                required=False,
                error_message="Malformed links found"
            ),
            ValidationRule(
                name="no_trailing_whitespace",
                description="Lines should not have trailing whitespace",
                pattern=r"[ \t]+$",
                required=False,
                error_message="Trailing whitespace found"
            ),
            ValidationRule(
                name="consistent_heading_style",
                description="Headings should use consistent style",
                pattern=r"^#{1,6}\s",
                required=False,
                error_message="Inconsistent heading style"
            )
        ]

    def validate_content(self, content: str) -> ValidationResult:
        """Validate wiki page content.
        
        Args:
            content: Markdown content to validate
            
        Returns:
            ValidationResult with errors, warnings, and suggestions
        """
        errors = []
        warnings = []
        suggestions = []

        # Apply validation rules
        for rule in self.rules:
            result = self._apply_rule(content, rule)
            
            if not result and rule.required:
                errors.append(rule.error_message)
            elif not result:
                warnings.append(rule.error_message)

        # Additional content-specific validations
        content_checks = self._additional_content_checks(content)
        errors.extend(content_checks.get("errors", []))
        warnings.extend(content_checks.get("warnings", []))
        suggestions.extend(content_checks.get("suggestions", []))

        return ValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            suggestions=suggestions
        )

    def _apply_rule(self, content: str, rule: ValidationRule) -> bool:
        """Apply a validation rule to content.
        
        Args:
            content: Content to validate
            rule: Validation rule to apply
            
        Returns:
            True if rule passes, False otherwise
        """
        if not rule.pattern:
            return True

        if rule.name == "has_title":
            return bool(re.search(rule.pattern, content, re.MULTILINE))
        elif rule.name == "no_empty_sections":
            return not bool(re.search(rule.pattern, content, re.MULTILINE))
        elif rule.name == "valid_links":
            # Check if all links are properly formatted
            links = re.findall(r"\[([^\]]*)\]\(([^)]*)\)", content)
            return all(text.strip() and url.strip() for text, url in links)
        elif rule.name == "no_trailing_whitespace":
            lines = content.split('\n')
            return not any(re.search(rule.pattern, line) for line in lines)
        elif rule.name == "consistent_heading_style":
            headings = re.findall(r"^(#{1,6})\s", content, re.MULTILINE)
            # Check if all headings use the same style (# vs ##)
            return len(set(headings)) <= 6  # Allow different levels

        return True

    def _additional_content_checks(self, content: str) -> Dict[str, List[str]]:
        """Perform additional content quality checks.
        
        Args:
            content: Content to check
            
        Returns:
            Dictionary with errors, warnings, and suggestions
        """
        errors = []
        warnings = []
        suggestions = []

        lines = content.split('\n')
        
        # Check for very short content
        if len(content.strip()) < 50:
            warnings.append("Content is very short - consider adding more detail")

        # Check for missing sections in documentation
        if not any("## " in line for line in lines):
            suggestions.append("Consider adding sections with ## headings for better organization")

        # Check for code blocks without language specification
        code_blocks = re.findall(r"```(\w*)", content)
        if any(not lang for lang in code_blocks):
            suggestions.append("Consider specifying language for code blocks (e.g., ```python)")

        # Check for TODO/FIXME comments
        todo_pattern = r"\b(TODO|FIXME|XXX|HACK)\b"
        if re.search(todo_pattern, content, re.IGNORECASE):
            warnings.append("TODO/FIXME comments found - consider resolving before publishing")

        # Check for broken internal links
        internal_links = re.findall(r"\[([^\]]+)\]\((?!https?://)([^)]+)\)", content)
        if internal_links:
            suggestions.append("Internal links found - ensure they are valid within the wiki")

        # Check for inconsistent list formatting
        list_items = re.findall(r"^[-*+]\s", content, re.MULTILINE)
        if len(set(list_items)) > 1:
            suggestions.append("Consider using consistent list formatting (- vs * vs +)")

        # Check for missing metadata/frontmatter
        if not content.startswith("---") and "Last updated:" not in content:
            suggestions.append("Consider adding metadata or 'Last updated' information")

        return {
            "errors": errors,
            "warnings": warnings,
            "suggestions": suggestions
        }

    def validate_structure(self, content: str) -> ValidationResult:
        """Validate the structural aspects of the content.
        
        Args:
            content: Content to validate
            
        Returns:
            ValidationResult for structural validation
        """
        errors = []
        warnings = []
        suggestions = []

        lines = content.split('\n')
        
        # Check heading hierarchy
        headings = []
        for i, line in enumerate(lines):
            if re.match(r"^#{1,6}\s", line):
                level = len(line.split()[0])
                headings.append((i + 1, level, line.strip()))

        # Validate heading hierarchy
        for i in range(1, len(headings)):
            current_level = headings[i][1]
            prev_level = headings[i-1][1]
            
            if current_level > prev_level + 1:
                warnings.append(
                    f"Line {headings[i][0]}: Heading level jumps from {prev_level} to {current_level}"
                )

        # Check for duplicate headings
        heading_texts = [h[2] for h in headings]
        duplicates = set([h for h in heading_texts if heading_texts.count(h) > 1])
        if duplicates:
            warnings.extend([f"Duplicate heading found: {dup}" for dup in duplicates])

        # Check table of contents vs actual structure
        toc_pattern = r"#{2,6}\s+Table of Contents|#{2,6}\s+Contents"
        if re.search(toc_pattern, content, re.IGNORECASE):
            suggestions.append("Table of contents detected - ensure it matches the actual structure")

        return ValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            suggestions=suggestions
        )
